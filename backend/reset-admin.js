const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const UserSchema = new mongoose.Schema(
  { username: String, email: String, password: String, name: String, role: String },
  { timestamps: true }
);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function resetAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('[DB] Connected to MongoDB Atlas');

    const newPassword = 'Rachit_120204';
    const newHash = await bcrypt.hash(newPassword, 10);

    const result = await User.findOneAndUpdate(
      { role: 'admin' },
      { password: newHash, username: 'admin', email: 'rachitaggarwal1202@gmail.com' },
      { new: true }
    );

    if (result) {
      console.log('[SUCCESS] Admin password updated to: ' + newPassword);
      console.log('[User] username:', result.username, '| email:', result.email);
    } else {
      await User.create({
        username: 'admin',
        email: 'rachitaggarwal1202@gmail.com',
        password: newHash,
        name: 'Rachit Aggarwal',
        role: 'admin'
      });
      console.log('[SUCCESS] Admin user created with password: ' + newPassword);
    }

    await mongoose.disconnect();
    console.log('[DONE] You can now login with: admin / Rachit_120204');
  } catch (err) {
    console.error('[ERROR]', err.message);
    process.exit(1);
  }
}

resetAdminPassword();
