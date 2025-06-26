require("dotenv").config()
const SMTPConfig = {
  provider: process.env.SMTP_PROVIDER,
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
  from: process.env.SMTP_FORM_ADDRESS,
};

const AppConfig = {
  appUrl: process.env.APP_URL,
  url: process.env.FrontendUrl,
  jwtSecret: process.env.JWT_SECRET,
};

const CloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
};

const mongoConfig={
  url:process.env.MONGODB_URL,
  dbName:process.env.MONGODB_NAME
}
module.exports = { SMTPConfig, AppConfig, CloudinaryConfig, mongoConfig};
