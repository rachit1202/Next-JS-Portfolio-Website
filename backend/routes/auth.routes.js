const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('../models/User');

// Active in-memory credentials store (synced across sessions)
let inMemoryAdminPassword = 'Rachit_120204';
let inMemoryUsers = [
  {
    _id: 'admin_1',
    name: 'Rachit Aggarwal',
    username: 'admin',
    email: 'rachitaggarwal1202@gmail.com',
    password: inMemoryAdminPassword,
    role: 'admin',
    createdAt: new Date('2024-01-01')
  }
];

async function authRoutes(fastify, options) {
  // Login route - Strictly validates ONLY the current active password
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body || {};

    if (!username || !password) {
      return reply.code(400).send({ error: true, message: 'Username and password are required.' });
    }

    const cleanUsername = username.trim().toLowerCase();

    // 1. Try Database authentication if MongoDB is active
    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findOne({
          $or: [{ username: username.trim() }, { email: cleanUsername }]
        });

        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) {
            const token = fastify.jwt.sign({
              id: user._id.toString(),
              username: user.username,
              email: user.email,
              role: user.role
            }, { expiresIn: '7d' });

            return {
              success: true,
              token,
              user: {
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                name: user.name,
                role: user.role
              }
            };
          } else {
            // Password did not match database record
            return reply.code(401).send({ error: true, message: 'Invalid credentials.' });
          }
        }
      } catch (e) {
        console.warn('[Auth Login Error] DB lookup error:', e.message);
      }
    }

    // 2. Check in-memory user registry
    const memUser = inMemoryUsers.find(
      u => u.username.toLowerCase() === cleanUsername || u.email.toLowerCase() === cleanUsername
    );

    if (memUser) {
      let isMatch = false;
      if (memUser.password.startsWith('$2')) {
        try {
          isMatch = await bcrypt.compare(password, memUser.password);
        } catch (_) {}
      } else {
        isMatch = (password === memUser.password);
      }

      if (isMatch) {
        const token = fastify.jwt.sign({
          id: memUser._id,
          username: memUser.username,
          email: memUser.email,
          role: memUser.role
        }, { expiresIn: '7d' });

        return {
          success: true,
          token,
          user: {
            id: memUser._id,
            username: memUser.username,
            email: memUser.email,
            name: memUser.name,
            role: memUser.role
          }
        };
      }
    }

    // 3. Fallback match for admin account strictly against inMemoryAdminPassword
    if (cleanUsername === 'admin' || cleanUsername === 'rachitaggarwal1202@gmail.com' || cleanUsername === 'aggarwalrachit1202@gmail.com') {
      if (password === inMemoryAdminPassword) {
        const token = fastify.jwt.sign({
          id: 'admin_1',
          username: 'admin',
          email: 'rachitaggarwal1202@gmail.com',
          role: 'admin'
        }, { expiresIn: '7d' });

        return {
          success: true,
          token,
          user: {
            id: 'admin_1',
            username: 'admin',
            email: 'rachitaggarwal1202@gmail.com',
            name: 'Rachit Aggarwal',
            role: 'admin'
          }
        };
      }
    }

    return reply.code(401).send({ error: true, message: 'Invalid credentials.' });
  });

  // Verify current token
  fastify.get('/me', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    return {
      success: true,
      user: {
        id: request.user.id || 'admin_1',
        username: request.user.username || 'admin',
        email: request.user.email || 'rachitaggarwal1202@gmail.com',
        name: 'Rachit Aggarwal',
        role: request.user.role || 'admin'
      }
    };
  });

  // Change password for logged-in user
  fastify.post('/change-password', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { currentPassword, newPassword } = request.body || {};
    if (!currentPassword || !newPassword) {
      return reply.code(400).send({ error: true, message: 'Both current and new passwords are required.' });
    }

    if (newPassword.length < 6) {
      return reply.code(400).send({ error: true, message: 'New password must be at least 6 characters.' });
    }

    // Verify current password first
    let currentValid = (currentPassword === inMemoryAdminPassword);

    // 1. Check & Update in Database if connected
    if (mongoose.connection.readyState === 1) {
      try {
        const user = await User.findById(request.user.id);
        if (user) {
          const isMatch = await bcrypt.compare(currentPassword, user.password);
          if (isMatch) {
            currentValid = true;
            user.password = await bcrypt.hash(newPassword, 10);
            await user.save();
          }
        }
      } catch (e) {
        console.warn('[Change Password Error] DB failed:', e.message);
      }
    }

    // Check against in-memory user
    const targetMemUser = inMemoryUsers.find(u => u._id === request.user.id || u.username === request.user.username);
    if (targetMemUser && targetMemUser.password === currentPassword) {
      currentValid = true;
    }

    if (!currentValid) {
      return reply.code(400).send({ error: true, message: 'Current password is incorrect.' });
    }

    // Update active memory password exclusively to newPassword
    inMemoryAdminPassword = newPassword;
    if (targetMemUser) {
      targetMemUser.password = newPassword;
    } else if (inMemoryUsers.length > 0) {
      inMemoryUsers[0].password = newPassword;
    }

    return { success: true, message: 'Password updated successfully.' };
  });

  // Admin: Get all users (Super-Admin only)
  fastify.get('/users', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    if (request.user.role !== 'admin') {
      return reply.code(403).send({ error: true, message: 'Forbidden: Super-Administrator access required.' });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const users = await User.find().select('-password').sort({ createdAt: -1 });
        if (users && users.length > 0) {
          return { success: true, data: users };
        }
      } catch (e) {
        console.warn('[Get Users Error] DB failed:', e.message);
      }
    }

    const safeInMemoryUsers = inMemoryUsers.map(u => {
      const copy = { ...u };
      delete copy.password;
      return copy;
    });

    return { success: true, data: safeInMemoryUsers };
  });

  // Admin: Create new user (Super-Admin only)
  fastify.post('/users', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    if (request.user.role !== 'admin') {
      return reply.code(403).send({ error: true, message: 'Forbidden: Super-Administrator access required.' });
    }

    const { name, username, email, password, role } = request.body || {};

    if (!username || !email || !password) {
      return reply.code(400).send({ error: true, message: 'Username, email, and password are required.' });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const existing = await User.findOne({
          $or: [{ username: username.trim() }, { email: email.trim().toLowerCase() }]
        });
        if (existing) {
          return reply.code(400).send({ error: true, message: 'A user with this username or email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          name: name?.trim() || username.trim(),
          username: username.trim(),
          email: email.trim().toLowerCase(),
          password: hashedPassword,
          role: role || 'editor'
        });

        const safeUser = newUser.toObject();
        delete safeUser.password;

        // Sync in memory
        inMemoryUsers.unshift({
          _id: newUser._id.toString(),
          name: newUser.name,
          username: newUser.username,
          email: newUser.email,
          password: password,
          role: newUser.role,
          createdAt: newUser.createdAt
        });

        return reply.code(201).send({ success: true, message: 'User created successfully.', data: safeUser });
      } catch (e) {
        return reply.code(500).send({ error: true, message: e.message });
      }
    }

    const newUserObj = {
      _id: `user_${Date.now()}`,
      name: name?.trim() || username.trim(),
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: password,
      role: role || 'editor',
      createdAt: new Date()
    };
    inMemoryUsers.unshift(newUserObj);

    const safe = { ...newUserObj };
    delete safe.password;

    return reply.code(201).send({
      success: true,
      message: 'User created successfully.',
      data: safe
    });
  });

  // Admin: Update user details (Super-Admin only)
  fastify.put('/users/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    if (request.user.role !== 'admin') {
      return reply.code(403).send({ error: true, message: 'Forbidden: Super-Administrator access required.' });
    }

    const { id } = request.params;
    const { name, username, email, role } = request.body || {};

    if (mongoose.connection.readyState === 1) {
      try {
        const updateData = {};
        if (name) updateData.name = name.trim();
        if (username) updateData.username = username.trim();
        if (email) updateData.email = email.trim().toLowerCase();
        if (role) updateData.role = role;

        const updated = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
        if (updated) {
          return { success: true, message: 'User updated successfully.', data: updated };
        }
      } catch (e) {
        return reply.code(500).send({ error: true, message: e.message });
      }
    }

    const user = inMemoryUsers.find(u => u._id === id);
    if (user) {
      if (name) user.name = name.trim();
      if (username) user.username = username.trim();
      if (email) user.email = email.trim().toLowerCase();
      if (role) user.role = role;
      return { success: true, message: 'User updated successfully.' };
    }

    return { success: true, message: 'User updated successfully.' };
  });

  // Admin: Reset user password directly (Super-Admin only)
  fastify.put('/users/:id/reset-password', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    if (request.user.role !== 'admin') {
      return reply.code(403).send({ error: true, message: 'Forbidden: Super-Administrator access required.' });
    }

    const { id } = request.params;
    const { newPassword } = request.body || {};

    if (!newPassword || newPassword.length < 6) {
      return reply.code(400).send({ error: true, message: 'New password must be at least 6 characters.' });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(id, { password: hashedPassword });
      } catch (e) {
        console.warn('[Reset Password Error] DB failed:', e.message);
      }
    }

    const memUser = inMemoryUsers.find(u => u._id === id);
    if (memUser) {
      memUser.password = newPassword;
      if (memUser.username === 'admin') {
        inMemoryAdminPassword = newPassword;
      }
    } else {
      inMemoryAdminPassword = newPassword;
    }

    return { success: true, message: 'Password reset successfully.' };
  });

  // Admin: Delete user (Super-Admin only)
  fastify.delete('/users/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    if (request.user.role !== 'admin') {
      return reply.code(403).send({ error: true, message: 'Forbidden: Super-Administrator access required.' });
    }

    const { id } = request.params;

    if (id === request.user.id || id === 'admin_1') {
      return reply.code(400).send({ error: true, message: 'You cannot delete your own active administrator account.' });
    }

    if (mongoose.connection.readyState === 1) {
      try {
        await User.findByIdAndDelete(id);
      } catch (e) {
        console.warn('[Delete User Error] DB failed:', e.message);
      }
    }

    inMemoryUsers = inMemoryUsers.filter(u => u._id !== id);
    return { success: true, message: 'User deleted successfully.' };
  });
}

module.exports = authRoutes;
