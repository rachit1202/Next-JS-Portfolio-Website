const mongoose = require('mongoose');
const dns = require('dns');

// Use IPv4 first and set Google DNS fallback if local ISP blocks SRV records
try {
  dns.setDefaultResultOrder('ipv4first');
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // ignore if restricted
}

let isConnected = false;

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rachit_portfolio';
    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 10000
    });
    isConnected = true;
    console.log(`[MongoDB] Connected successfully to ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (error) {
    isConnected = false;
    console.error(`[MongoDB Error] Connection failed: ${error.message}`);
    console.log(`[MongoDB] Operating with fallback memory data mode.`);
  }
};

module.exports = connectDB;
