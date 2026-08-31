const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function authRoutes(fastify, options) {
  // POST /login — authenticate user via DB with env-var fallback
  fastify.post('/login', async (request, reply) => {
    const { username, password } = request.body || {};

    if (!username || !password) {
      return reply.code(400).send({ error: true, message: 'Username and password are required.' });
    }

    const cleanUsername = username.trim().toLowerCase();

    // ── 1. Primary: MongoDB authentication ──────────────────────────────────
    try {
      const user = await User.findOne({
        $or: [
          { username: { $regex: new RegExp(`^${username.trim()}$`, 'i') } },
          { email: cleanUsername }
        ]
      });

      if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
          const token = fastify.jwt.sign(
            { id: user._id.toString(), username: user.username, email: user.email, role: user.role },
            { expiresIn: '7d' }
          );
          return {
            success: true,
            token,
            user: { id: user._id.toString(), username: user.username, email: user.email, name: user.name, role: user.role }
          };
        }
        // User found in DB but password doesn't match — don't fall through to env-var for security
        // UNLESS this is the admin username (allow env-var override for admin recovery)
        if (user.role !== 'admin') {
          return reply.code(401).send({ error: true, message: 'Invalid credentials.' });
        }
      }
    } catch (err) {
      console.warn('[Auth Login] DB lookup error:', err.message);
      // DB unavailable — fall through to env-var fallback below
    }

    // ── 2. Fallback: Env-var or hardcoded admin credentials ─────────────────
    // This guarantees admin can ALWAYS log in even if DB is momentarily disconnected on Render
    const envAdminUser = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
    const envAdminEmail = (process.env.ADMIN_EMAIL || 'rachitaggarwal1202@gmail.com').toLowerCase();
    const validPasswords = [
      'Rachit_120204',
      process.env.ADMIN_PASSWORD,
      'adminpass123'
    ].filter(Boolean);

    const isAdminUsername = cleanUsername === envAdminUser || cleanUsername === envAdminEmail;
    const isPasswordValid = validPasswords.includes(password);

    if (isAdminUsername && isPasswordValid) {
      // Auto-sync: update DB password to match if DB is available
      try {
        const hashedPass = await bcrypt.hash(password, 10);
        await User.findOneAndUpdate(
          { $or: [{ username: envAdminUser }, { email: envAdminEmail }] },
          { $set: { password: hashedPass, role: 'admin' } },
          { upsert: true }
        );
        console.log('[Auth Login] Admin credentials synced to DB.');
      } catch (syncErr) {
        console.warn('[Auth Login] DB sync notice:', syncErr.message);
      }

      const token = fastify.jwt.sign(
        { id: 'admin_env', username: envAdminUser, email: envAdminEmail, role: 'admin' },
        { expiresIn: '7d' }
      );
      return {
        success: true,
        token,
        user: { id: 'admin_env', username: envAdminUser, email: envAdminEmail, name: 'Rachit Aggarwal', role: 'admin' }
      };
    }

    return reply.code(401).send({ error: true, message: 'Invalid credentials.' });
  });


  // GET /me — verify token and return current user
  fastify.get('/me', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    try {
      const user = await User.findById(request.user.id).select('-password');
      if (!user) {
        return reply.code(401).send({ error: true, message: 'User not found.' });
      }
      return { success: true, user: { id: user._id.toString(), username: user.username, email: user.email, name: user.name, role: user.role } };
    } catch (err) {
      // Fallback from token payload if DB momentarily unavailable
      return {
        success: true,
        user: {
          id: request.user.id,
          username: request.user.username,
          email: request.user.email,
          name: request.user.name || 'Rachit Aggarwal',
          role: request.user.role
        }
      };
    }
  });

  // POST /change-password — change password for logged-in user
  fastify.post('/change-password', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    const { currentPassword, newPassword } = request.body || {};
    if (!currentPassword || !newPassword) {
      return reply.code(400).send({ error: true, message: 'Both current and new passwords are required.' });
    }
    if (newPassword.length < 6) {
      return reply.code(400).send({ error: true, message: 'New password must be at least 6 characters.' });
    }

    try {
      const user = await User.findById(request.user.id);
      if (!user) {
        return reply.code(404).send({ error: true, message: 'User not found.' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return reply.code(400).send({ error: true, message: 'Current password is incorrect.' });
      }

      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      return { success: true, message: 'Password updated successfully.' };
    } catch (err) {
      console.error('[Change Password] DB error:', err.message);
      return reply.code(500).send({ error: true, message: 'Failed to update password.' });
    }
  });

  // GET /users — get all users (admin only)
  fastify.get('/users', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    if (request.user.role !== 'admin') {
      return reply.code(403).send({ error: true, message: 'Forbidden: Super-Administrator access required.' });
    }

    try {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return { success: true, data: users };
    } catch (err) {
      console.error('[Get Users] DB error:', err.message);
      return reply.code(503).send({ error: true, message: 'Could not load users.' });
    }
  });

  // POST /users — create new user (admin only)
  fastify.post('/users', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    if (request.user.role !== 'admin') {
      return reply.code(403).send({ error: true, message: 'Forbidden: Super-Administrator access required.' });
    }

    const { name, username, email, password, role } = request.body || {};
    if (!username || !email || !password) {
      return reply.code(400).send({ error: true, message: 'Username, email, and password are required.' });
    }

    try {
      const existing = await User.findOne({
        $or: [
          { username: username.trim() },
          { email: email.trim().toLowerCase() }
        ]
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

      return reply.code(201).send({ success: true, message: 'User created successfully.', data: safeUser });
    } catch (err) {
      console.error('[Create User] DB error:', err.message);
      return reply.code(500).send({ error: true, message: err.message });
    }
  });

  // PUT /users/:id — update user details (admin only)
  fastify.put('/users/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    if (request.user.role !== 'admin') {
      return reply.code(403).send({ error: true, message: 'Forbidden: Super-Administrator access required.' });
    }

    const { id } = request.params;
    const { name, username, email, role } = request.body || {};

    try {
      const updateData = {};
      if (name) updateData.name = name.trim();
      if (username) updateData.username = username.trim();
      if (email) updateData.email = email.trim().toLowerCase();
      if (role) updateData.role = role;

      const updated = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
      if (!updated) {
        return reply.code(404).send({ error: true, message: 'User not found.' });
      }
      return { success: true, message: 'User updated successfully.', data: updated };
    } catch (err) {
      console.error('[Update User] DB error:', err.message);
      return reply.code(500).send({ error: true, message: err.message });
    }
  });

  // PUT /users/:id/reset-password — reset user password (admin only)
  fastify.put('/users/:id/reset-password', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    if (request.user.role !== 'admin') {
      return reply.code(403).send({ error: true, message: 'Forbidden: Super-Administrator access required.' });
    }

    const { id } = request.params;
    const { newPassword } = request.body || {};

    if (!newPassword || newPassword.length < 6) {
      return reply.code(400).send({ error: true, message: 'New password must be at least 6 characters.' });
    }

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updated = await User.findByIdAndUpdate(id, { password: hashedPassword });
      if (!updated) {
        return reply.code(404).send({ error: true, message: 'User not found.' });
      }
      return { success: true, message: 'Password reset successfully.' };
    } catch (err) {
      console.error('[Reset Password] DB error:', err.message);
      return reply.code(500).send({ error: true, message: 'Failed to reset password.' });
    }
  });

  // DELETE /users/:id — delete user (admin only)
  fastify.delete('/users/:id', { preHandler: [fastify.authenticate] }, async (request, reply) => {
    if (request.user.role !== 'admin') {
      return reply.code(403).send({ error: true, message: 'Forbidden: Super-Administrator access required.' });
    }

    const { id } = request.params;

    if (id === request.user.id) {
      return reply.code(400).send({ error: true, message: 'You cannot delete your own active administrator account.' });
    }

    try {
      const deleted = await User.findByIdAndDelete(id);
      if (!deleted) {
        return reply.code(404).send({ error: true, message: 'User not found.' });
      }
      return { success: true, message: 'User deleted successfully.' };
    } catch (err) {
      console.error('[Delete User] DB error:', err.message);
      return reply.code(500).send({ error: true, message: 'Failed to delete user.' });
    }
  });
}

module.exports = authRoutes;
