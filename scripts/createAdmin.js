const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../src/modules/user/user.model');
const { Status, UserRoles } = require('../src/config/constant');

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

// Create admin user
const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'superadmin@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: superadmin@gmail.com');
      console.log('Password: Admin@123');
      return;
    }

    // Hash password
    const hashedPassword = bcrypt.hashSync('Admin@123', 10);

    // Create admin user
    const adminUser = new User({
      name: 'Super Admin',
      email: 'superadmin@gmail.com',
      password: hashedPassword,
      phone: '1234567890',
      role: UserRoles.ADMIN,
      gender: 'male',
      address: 'Admin Address',
      status: Status.ACTIVE,
      activationToken: null, // No activation required for admin
    });

    await adminUser.save();
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: superadmin@gmail.com');
    console.log('🔑 Password: Admin@123');
    console.log('👤 Role: Admin');
    console.log('✅ Status: Active');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
};

// Run the script
const run = async () => {
  await connectDB();
  await createAdminUser();
  mongoose.connection.close();
  console.log('Script completed!');
};

run();
