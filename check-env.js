require('dotenv').config();

console.log('Current environment variables:');
console.log('MONGODB_URL:', process.env.MONGODB_URL ? '✅ Found' : '❌ Missing');
console.log('MONGODB_NAME:', process.env.MONGODB_NAME || '❌ Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Found' : '❌ Missing');

// Test if we can resolve the MongoDB hostname
const dns = require('dns');
const { URL } = require('url');

if (process.env.MONGODB_URL) {
  try {
    const mongoUrl = new URL(process.env.MONGODB_URL);
    const hostname = mongoUrl.hostname;
    console.log('\nTesting DNS resolution for:', hostname);
    
    dns.lookup(hostname, (err, address) => {
      if (err) {
        console.log('❌ DNS resolution failed:', err.message);
        console.log('\nTroubleshooting:');
        console.log('1. Check your internet connection');
        console.log('2. Try pinging the hostname manually');
        console.log('3. Check if there are any firewall rules blocking the connection');
      } else {
        console.log(`✅ DNS resolved to: ${address}`);
        console.log('\nIf you still cannot connect, please check:');
        console.log('1. Your MongoDB Atlas cluster is running');
        console.log('2. Your IP is whitelisted in MongoDB Atlas');
        console.log('3. Your credentials in .env are correct');
      }
    });
  } catch (e) {
    console.log('❌ Invalid MONGODB_URL format:', e.message);
  }
}
