const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rachit_portfolio';

    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 8000,  // 8s to select a server
      connectTimeoutMS: 10000,         // 10s for initial connection
      socketTimeoutMS: 45000,          // 45s for socket operations
      maxPoolSize: 10,                 // maintain up to 10 socket connections
      minPoolSize: 2,                  // keep at least 2 connections open
      heartbeatFrequencyMS: 10000,     // check connection health every 10s
    });

    console.log(`[MongoDB] Connected to ${mongoose.connection.host}/${mongoose.connection.name}`);

    // Handle disconnections and auto-reconnect
    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB] Disconnected. Mongoose will auto-reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[MongoDB] Reconnected successfully.');
    });

    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB] Connection error:', err.message);
    });

  } catch (error) {
    console.error(`[MongoDB Error] Connection failed: ${error.message}`);
    // Don't crash the server — it will retry on next request
  }
};

module.exports = connectDB;
