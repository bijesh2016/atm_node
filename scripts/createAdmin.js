const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env' });

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/atm_locator', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true, enum: ['male', 'female', 'others'] },
  address: { type: String, default: '' },
  dob: { type: Date },
  role: { type: String, default: 'user', enum: ['user', 'admin'] },
  status: { type: String, default: 'active' },
  activationToken: String,
  expiryTime: Date
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

const adminUser = {
  name: 'Admin User',
  email: 'superadmin@gmail.com',
  password: 'Admin@123', 
  phone: '1234567890',
  gender: 'male',
  address: 'Admin Address',
  role: 'admin',
  status: 'active',
  activationToken: null,
  expiryTime: null
};

async function createAdmin() {
  try {
    console.log('Connecting to MongoDB...');
    
    await new Promise((resolve, reject) => {
      mongoose.connection.on('connected', resolve);
      mongoose.connection.on('error', reject);
    });
    
    console.log('Successfully connected to MongoDB');

    console.log('Checking for existing admin user...');
    const existingAdmin = await User.findOne({ email: adminUser.email });
    
    if (existingAdmin) {
      console.log('\nAdmin user already exists:');
      console.log(`Email: ${existingAdmin.email}`);
      console.log('Role:', existingAdmin.role);
      console.log('Status:', existingAdmin.status);
      console.log('\nTo reset the admin password, you need to:');
      console.log('1. Delete the existing admin user from the database, or');
      console.log('2. Update the password directly in the database');
      process.exit(0);
    }

    console.log('No existing admin found. Creating new admin user...');
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminUser.password, salt);
    
    const user = new User({
      ...adminUser,
      password: hashedPassword
    });
    
    await user.save();

    console.log('\n✅ Admin user created successfully!');
    console.log('================================');
    console.log('Email:    ', adminUser.email);
    console.log('Password: ', adminUser.password);
    console.log('Role:     ', 'admin');
    console.log('Status:   ', 'active');
    console.log('================================');
    console.log('\n⚠️  IMPORTANT: Change this password after first login!');
    
  } catch (error) {
    console.error('\n❌ Error creating admin user:');
    console.error(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\nCould not connect to MongoDB. Make sure your MongoDB server is running.');
      console.error('If using a custom connection string, set it in the .env file as MONGO_URI');
    }
    
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
