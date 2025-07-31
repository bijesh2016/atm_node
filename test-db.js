require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB connection...');
console.log('MongoDB URL:', process.env.MONGODB_URL ? 'Found' : 'Not found');
console.log('DB Name:', process.env.MONGODB_NAME || 'Not set');

async function testConnection() {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: process.env.MONGODB_NAME,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nAvailable collections:');
    collections.forEach(c => console.log(`- ${c.name}`));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\nTroubleshooting steps:');
    console.log('1. Verify your MongoDB Atlas cluster is running');
    console.log('2. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('3. Verify your connection string in .env file');
    console.log('4. Check your internet connection');
    process.exit(1);
  }
}

testConnection();
