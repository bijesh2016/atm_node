const mongoose = require('mongoose');

// Local MongoDB connection for testing
const localMongoUrl = 'mongodb://localhost:27017/atm-locator';

async function testLocalConnection() {
  try {
    console.log('Testing local MongoDB connection...');
    
    await mongoose.connect(localMongoUrl, {
      autoCreate: true,
      autoIndex: true
    });
    
    console.log('✅ Local MongoDB connection successful!');
    console.log('You can now use local MongoDB for testing.');
    console.log('');
    console.log('To use local MongoDB, update your .env file:');
    console.log('MONGODB_URL=mongodb://localhost:27017');
    console.log('MONGODB_NAME=atm-locator');
    
    // Test creating a collection
    const testCollection = mongoose.connection.collection('test');
    await testCollection.insertOne({ test: 'data' });
    console.log('✅ Database write test successful!');
    
    await mongoose.connection.close();
    console.log('Connection closed.');
    
  } catch (error) {
    console.error('❌ Local MongoDB connection failed:', error.message);
    console.log('');
    console.log('To install MongoDB locally:');
    console.log('1. Download from: https://www.mongodb.com/try/download/community');
    console.log('2. Install and start the MongoDB service');
    console.log('3. Or use MongoDB Atlas with proper permissions');
  }
}

// Run the test
testLocalConnection(); 