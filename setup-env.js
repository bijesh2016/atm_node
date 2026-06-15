const fs = require('fs');
const path = require('path');

const envContent = `# Frontend URL for email links
FRONTEND_URL=http://localhost:5173
FrontendUrl=http://localhost:5173

# JWT Secret
JWT_SECRET=atm_locator_jwt_secret_2024

# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017
MONGODB_NAME=atm_locator

# SMTP Configuration (update with your email service details)
SMTP_PROVIDER=gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FORM_ADDRESS=your_email@gmail.com

# Cloudinary Configuration (if using image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
`;

const envPath = path.join(__dirname, '.env');

try {
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('📝 Please update the SMTP and Cloudinary settings in the .env file with your actual credentials.');
  } else {
    console.log('⚠️  .env file already exists. Please check if FRONTEND_URL is set to http://localhost:5173');
  }
} catch (error) {
  console.error('❌ Error creating .env file:', error);
} 