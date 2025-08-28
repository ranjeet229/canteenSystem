
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI);

// Menu Item Schema (same as in server.js)
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

// Seed data
const sampleMenuItems = [
  // Main Courses
  {
    name: "Classic Burger",
    description: "Juicy beef patty with lettuce, tomato, onion, and our special sauce",
    price: 12.99,
    stock: 15,
    category: "Main Course",
    image: "burger.jpg"
  },
  {
    name: "Margherita Pizza",
    description: "Fresh mozzarella, tomato sauce, and basil on crispy crust",
    price: 15.99,
    stock: 8,
    category: "Main Course",
    image: "pizza.jpg"
  },
  {
    name: "Grilled Chicken Breast",
    description: "Tender grilled chicken with herbs and spices",
    price: 18.99,
    stock: 12,
    category: "Main Course",
    image: "chicken.jpg"
  },
  {
    name: "Vegetable Stir Fry",
    description: "Fresh mixed vegetables stir-fried with garlic and ginger",
    price: 11.99,
    stock: 20,
    category: "Main Course",
    image: "stirfry.jpg"
  },
  
  // Light Meals
  {
    name: "Club Sandwich",
    description: "Triple-layer sandwich with turkey, bacon, lettuce, and tomato",
    price: 8.99,
    stock: 10,
    category: "Light Meal",
    image: "sandwich.jpg"
  },
  {
    name: "Caesar Salad",
    description: "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan",
    price: 9.99,
    stock: 15,
    category: "Light Meal",
    image: "caesar.jpg"
  },
  {
    name: "Soup of the Day",
    description: "Chef's special soup made with fresh ingredients",
    price: 6.99,
    stock: 25,
    category: "Light Meal",
    image: "soup.jpg"
  },
  
  {
    name: "Quinoa Bowl",
    description: "Nutritious quinoa with roasted vegetables and tahini dressing",
    price: 13.99,
    stock: 8,
    category: "Healthy Options",
    image: "quinoa.jpg"
  },
  {
    name: "Avocado Toast",
    description: "Multigrain toast topped with smashed avocado and seeds",
    price: 7.99,
    stock: 12,
    category: "Healthy Options",
    image: "avocado.jpg"
  },
  {
    name: "Protein Smoothie Bowl",
    description: "Blended fruits with protein powder, topped with granola and berries",
    price: 10.99,
    stock: 10,
    category: "Healthy Options",
    image: "smoothie.jpg"
  },
  
  // Beverages
  {
    name: "Fresh Coffee",
    description: "Freshly brewed coffee from premium beans",
    price: 3.99,
    stock: 50,
    category: "Beverages",
    image: "coffee.jpg"
  },
  {
    name: "Green Tea",
    description: "Organic green tea with antioxidants",
    price: 2.99,
    stock: 30,
    category: "Beverages",
    image: "tea.jpg"
  },
  {
    name: "Fresh Orange Juice",
    description: "100% fresh squeezed orange juice",
    price: 4.99,
    stock: 20,
    category: "Beverages",
    image: "orange.jpg"
  },
  {
    name: "Sparkling Water",
    description: "Refreshing sparkling water with natural minerals",
    price: 2.49,
    stock: 40,
    category: "Beverages",
    image: "water.jpg"
  },
  
  // Desserts
  {
    name: "Chocolate Brownie",
    description: "Rich chocolate brownie with vanilla ice cream",
    price: 6.99,
    stock: 5,
    category: "Desserts",
    image: "brownie.jpg"
  },
  {
    name: "Fresh Fruit Salad",
    description: "Seasonal fresh fruits with honey drizzle",
    price: 5.99,
    stock: 8,
    category: "Desserts",
    image: "fruit.jpg"
  },
  {
    name: "Tiramisu",
    description: "Classic Italian dessert with coffee and mascarpone",
    price: 7.99,
    stock: 3,
    category: "Desserts",
    image: "tiramisu.jpg"
  },

  // Items with zero stock for testing
  {
    name: "Special Fish of the Day",
    description: "Fresh catch prepared by our chef (currently out of stock)",
    price: 22.99,
    stock: 0,
    category: "Main Course",
    image: "fish.jpg"
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    // Clear existing menu items
    await MenuItem.deleteMany({});
    console.log('Cleared existing menu items');
    // Insert new menu items
    const insertedItems = await MenuItem.insertMany(sampleMenuItems);
    console.log(`Inserted ${insertedItems.length} menu items`);

    // Display summary by category
    const categories = await MenuItem.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, totalStock: { $sum: '$stock' } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\nMenu Summary by Category:');
    categories.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} items (${cat.totalStock} total stock)`);
    });

    console.log('\nDatabase seeding completed successfully!');
    console.log('You can now start the server and begin testing the application.');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

seedDatabase();