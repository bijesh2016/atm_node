const mongoose = require('mongoose');
const User = require('../src/modules/user/user.model');

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/atm_locator');
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Check admin user
const checkAdminUser = async () => {
  try {
    const adminUser = await User.findOne({ email: 'superadmin@gmail.com' });
    
    if (!adminUser) {
      console.log('❌ Admin user not found!');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('📧 Email:', adminUser.email);
    console.log('👤 Name:', adminUser.name);
    console.log('🔑 Role:', adminUser.role);
    console.log('✅ Status:', adminUser.status);
    console.log('📱 Phone:', adminUser.phone);
    console.log('🎭 Gender:', adminUser.gender);
    console.log('📍 Address:', adminUser.address);
    console.log('🔐 Has Password:', !!adminUser.password);
    console.log('🎫 Activation Token:', adminUser.activationToken);
    
    // Check if role is correct
    if (adminUser.role !== 'admin') {
      console.log('⚠️  WARNING: User role is not "admin"!');
    }
    
    // Check if status is active
    if (adminUser.status !== 'active') {
      console.log('⚠️  WARNING: User status is not "active"!');
    }
    
  } catch (error) {
    console.error('❌ Error checking admin user:', error);
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await checkAdminUser();
  mongoose.connection.close();
  console.log('Script completed!');
};

run(); 