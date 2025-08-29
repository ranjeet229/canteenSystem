
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Schemas
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  stock: { type: Number, required: true, min: 0 },
  category: String,
  image: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true, required: true },
  customerName: { type: String, required: true },
  customerEmail: String,
  items: [{
    menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
    name: String,
    price: Number,
    quantity: { type: Number, required: true, min: 1 }
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  paidAt: Date,
  completedAt: Date,
  cancelledAt: Date,
  cancelReason: String
});

// Add index for auto cancellation payments 
orderSchema.index({ status: 1, expiresAt: 1 });

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
const Order = mongoose.model('Order', orderSchema);

// fucntion to perfform utility
const generateOrderId = () => {
  return 'ORD' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
};

// Stock Management with Transaction Safety
const updateStockWithTransaction = async (updates, session = null) => {
  const operations = updates.map(({ itemId, quantity }) => ({
    updateOne: {
      filter: { _id: itemId, stock: { $gte: Math.abs(quantity) } },
      update: { $inc: { stock: quantity }, $set: { updatedAt: new Date() } }
    }
  }));

  const result = await MenuItem.bulkWrite(operations, { session });
  return result.modifiedCount === updates.length;
};

// Auto-cancellation Service
const cancelExpiredOrders = async () => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      // Find expired orders that are still pending or try to continue
      const expiredOrders = await Order.find({
        status: 'pending',
        expiresAt: { $lt: new Date() }
      }).session(session);

      for (const order of expiredOrders) {
        // Restore stock for each item
        const stockUpdates = order.items.map(item => ({
          itemId: item.menuItemId,
          quantity: item.quantity // Add back to stock
        }));

        await updateStockWithTransaction(stockUpdates, session);

        // Update order status
        await Order.updateOne(
          { _id: order._id },
          {
            $set: {
              status: 'cancelled',
              cancelledAt: new Date(),
              cancelReason: 'Auto-cancelled due to payment timeout'
            }
          },
          { session }
        );

        console.log(`Auto-cancelled order ${order.orderId} and restored stock`);
      }
    });
  } catch (error) {
    console.error('Error in auto-cancellation:', error);
  } finally {
    await session.endSession();
  }
};

// Schedule auto-cancellation every minute
cron.schedule('* * * * *', cancelExpiredOrders);

// Routes

// Menu Items CRUD
app.get('/api/menu', async (req, res) => {
  try {
    const items = await MenuItem.find({ isActive: true }).sort({ category: 1, name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/menu', async (req, res) => {
  try {
    const item = new MenuItem(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/menu/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/menu/:id', async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { isActive: false, updatedAt: new Date() },
      { new: true }
    );
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ message: 'Item deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Order Management
app.post('/api/orders', async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const { customerName, customerEmail, items } = req.body;
      
      // Validate stock availability
      for (const orderItem of items) {
        const menuItem = await MenuItem.findById(orderItem.menuItemId).session(session);
        if (!menuItem || menuItem.stock < orderItem.quantity) {
          throw new Error(`Insufficient stock for ${orderItem.name || 'item'}`);
        }
      }

      // Calculate total amount
      let totalAmount = 0;
      const orderItems = [];
      
      for (const orderItem of items) {
        const menuItem = await MenuItem.findById(orderItem.menuItemId).session(session);
        const itemTotal = menuItem.price * orderItem.quantity;
        totalAmount += itemTotal;
        
        orderItems.push({
          menuItemId: orderItem.menuItemId,
          name: menuItem.name,
          price: menuItem.price,
          quantity: orderItem.quantity
        });
      }

      // Lock stock (decrement)
      const stockUpdates = items.map(item => ({
        itemId: item.menuItemId,
        quantity: -item.quantity // Subtract from stock
      }));

      const stockUpdated = await updateStockWithTransaction(stockUpdates, session);
      if (!stockUpdated) {
        throw new Error('Failed to lock stock - insufficient inventory');
      }

      // Create order with 15-minute expiration
      const order = new Order({
        orderId: generateOrderId(),
        customerName,
        customerEmail,
        items: orderItems,
        totalAmount,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000) // 15 minutes from now
      });

      await order.save({ session });
      res.status(201).json(order);
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  } finally {
    await session.endSession();
  }
});

app.get('/api/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId })
      .populate('items.menuItemId', 'name price');
    
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const { customerEmail, status, page = 1, limit = 10 } = req.query;
    const filter = {};
    
    if (customerEmail) filter.customerEmail = customerEmail;
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate('items.menuItemId', 'name price')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);
    
    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/orders/:orderId/pay', async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const order = await Order.findOne({ orderId: req.params.orderId }).session(session);
      
      if (!order) throw new Error('Order not found');
      if (order.status !== 'pending') throw new Error('Order cannot be paid');
      if (new Date() > order.expiresAt) throw new Error('Order has expired');

      await Order.updateOne(
        { orderId: req.params.orderId },
        {
          $set: {
            status: 'confirmed',
            paymentStatus: 'paid',
            paidAt: new Date()
          },
          $unset: { expiresAt: 1 } // Remove expiration once paid
        },
        { session }
      );

      res.json({ message: 'Payment successful', orderId: req.params.orderId });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  } finally {
    await session.endSession();
  }
});

app.put('/api/orders/:orderId/cancel', async (req, res) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const order = await Order.findOne({ orderId: req.params.orderId }).session(session);
      
      if (!order) throw new Error('Order not found');
      if (!['pending', 'confirmed'].includes(order.status)) {
        throw new Error('Order cannot be cancelled');
      }

      // Restore stock
      const stockUpdates = order.items.map(item => ({
        itemId: item.menuItemId,
        quantity: item.quantity // Add back to stock
      }));

      await updateStockWithTransaction(stockUpdates, session);

      // Update order
      await Order.updateOne(
        { orderId: req.params.orderId },
        {
          $set: {
            status: 'cancelled',
            cancelledAt: new Date(),
            cancelReason: req.body.reason || 'Cancelled by customer'
          }
        },
        { session }
      );

      res.json({ message: 'Order cancelled successfully' });
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  } finally {
    await session.endSession();
  }
});

// Real-time stock updates endpoint
app.get('/api/menu/stock/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id, 'stock');
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json({ stock: item.stock });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin routes for order status updates
app.put('/api/admin/orders/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const update = { status };
    if (status === 'completed') {
      update.completedAt = new Date();
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { $set: update },
      { new: true }
    );

    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log(`Canteen server running on port ${PORT}`);
  console.log('mongodb connected');
});

module.exports = app;