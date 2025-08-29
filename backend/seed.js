
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

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

const MenuItem = mongoose.model('MenuItem', menuItemSchema);



async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
   
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');
   
    const insertedItems = await MenuItem.insertMany(sampleMenuItems);
    console.log(`Inserted ${insertedItems.length} menu items`);

    const categories = await MenuItem.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalStock: { $sum: '$stock' } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\nMenu Summary by Category:');
    categories.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} items (${cat.totalStock} total stock)`);
    });

    console.log('\nDatabase seeding completed successfully!');
    console.log('starting server');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedDatabase();