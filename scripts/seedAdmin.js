const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/atm_locator', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User model schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  gender: { type: String, required: true, enum: ['male', 'female', 'others'] },
  address: { type: String, default: '' },
  dob: { type: Date },
  status: { type: String, default: 'active' },
  activationToken: String,
  expiryTime: Date
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

// Admin user data
const adminUser = {
  name: 'Admin User',
  email: 'superadmin@gmail.com',
  password: bcrypt.hashSync('Admin@123', 10), // Hashed password
  phone: '1234567890',
  gender: 'male',
  address: 'Admin Address',
  role: 'admin',
  status: 'active'
};

// Create admin user
async function createAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      console.log('To reset the admin password, delete the existing admin user from the database.');
      process.exit(0);
    }

    // Create new admin
    const user = new User(adminUser);
    await user.save();

    console.log('Admin user created successfully!');
    console.log('Email: superadmin@gmail.com');
    console.log('Password: Admin@123');
    console.log('\nIMPORTANT: Change this password after first login!');
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the script
createAdmin();
