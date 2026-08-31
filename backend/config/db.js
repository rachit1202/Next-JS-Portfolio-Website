const mongoose = require('mongoose');

let lastConnectionError = null;

const connectDB = async () => {
  try {
    const rawUri = process.env.MONGODB_URI || 'mongodb://aggarwalrachit1202_db_user:m1slVOzvbsnVlfIX@ac-apbi8vz-shard-00-00.rjv2ycu.mongodb.net:27017,ac-apbi8vz-shard-00-01.rjv2ycu.mongodb.net:27017,ac-apbi8vz-shard-00-02.rjv2ycu.mongodb.net:27017/rachit_portfolio?ssl=true&replicaSet=atlas-86kdcf-shard-0&authSource=admin&retryWrites=true&w=majority';
    // Clean any accidental surrounding quotes from env vars
    const connStr = rawUri.replace(/^["']|["']$/g, '').trim();

    console.log('[MongoDB] Connecting to MongoDB Atlas...');
    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
      heartbeatFrequencyMS: 10000,
    });

    lastConnectionError = null;
    console.log(`[MongoDB] Connected to ${mongoose.connection.host}/${mongoose.connection.name}`);

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Disconnected. Reconnecting...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[MongoDB] Reconnected successfully.');
    });

    mongoose.connection.on('error', (err) => {
      lastConnectionError = err.message;
      console.error('[MongoDB] Connection error:', err.message);
    });

  } catch (error) {
    lastConnectionError = error.message;
    console.error(`[MongoDB Error] Connection failed: ${error.message}`);
  }
};

module.exports = connectDB;
module.exports.getLastError = () => lastConnectionError;

