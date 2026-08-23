const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const { authenticate, requireRole } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET;
const VALID_ROLES = new Set(['patient', 'doctor', 'pharmacy']);
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_ATTEMPT_LIMIT = 10;
const loginAttempts = new Map();

function normalizePhone(value) {
  return typeof value === 'string' ? value.replace(/\D/g, '') : '';
}

function loginAttemptKey(req, phone) {
  return `${req.ip || 'unknown'}:${phone}`;
}

function isLoginLimited(key) {
  const record = loginAttempts.get(key);
  if (!record) return false;
  if (record.resetAt <= Date.now()) {
    loginAttempts.delete(key);
    return false;
  }
  return record.count >= LOGIN_ATTEMPT_LIMIT;
}

function recordFailedLogin(key) {
  const current = loginAttempts.get(key);
  const record = current && current.resetAt > Date.now()
    ? current
    : { count: 0, resetAt: Date.now() + LOGIN_WINDOW_MS };
  record.count += 1;
  loginAttempts.set(key, record);
}

module.exports = (readData, writeData) => {
  const router = express.Router();

  // Register
  router.post('/register', async (req, res) => {
    try {
      const { password } = req.body;
      const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
      const phone = normalizePhone(req.body.phone);
      const role = typeof req.body.role === 'string' ? req.body.role.toLowerCase() : '';
      const village = typeof req.body.village === 'string' ? req.body.village.trim() : '';
      const age = req.body.age === '' || req.body.age == null ? null : Number(req.body.age);

      if (!name || !phone || !password || !role) {
        return res.status(400).json({ error: 'All fields required' });
      }
      if (name.length > 100 || village.length > 150) {
        return res.status(400).json({ error: 'Name or location is too long' });
      }
      if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ error: 'Enter a valid 10-digit phone number' });
      }
      if (typeof password !== 'string' || password.length < 6 || password.length > 128) {
        return res.status(400).json({ error: 'Password must be between 6 and 128 characters' });
      }
      if (!VALID_ROLES.has(role)) return res.status(400).json({ error: 'Invalid account role' });
      const staffRegistrationAllowed = process.env.ALLOW_STAFF_REGISTRATION === 'true' ||
        process.env.NODE_ENV !== 'production';
      if (role !== 'patient' && !staffRegistrationAllowed) {
        return res.status(403).json({ error: 'Staff accounts require administrator approval' });
      }
      if (age !== null && (!Number.isInteger(age) || age < 1 || age > 120)) {
        return res.status(400).json({ error: 'Enter a valid age' });
      }
      const users = readData('users');
      if (users.find(u => u.phone === phone)) {
        return res.status(409).json({ error: 'Phone already registered' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        id: randomUUID(),
        name,
        phone,
        password: hashedPassword,
        role, // 'patient' | 'doctor' | 'pharmacy'
        village: village || '',
        age,
        conditions: '',        // optional, can be updated later
        allergies: '',         // optional
        emergencyContact: '',  // optional
        createdAt: new Date().toISOString()
      };
      users.push(user);
      writeData('users', users);
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({ token, user: { id: user.id, name, phone, role, village, age } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Login
  router.post('/login', async (req, res) => {
    try {
      const phone = normalizePhone(req.body.phone);
      const { password } = req.body;
      if (!/^\d{10}$/.test(phone) || typeof password !== 'string') {
        return res.status(400).json({ error: 'Phone and password are required' });
      }
      const attemptKey = loginAttemptKey(req, phone);
      if (isLoginLimited(attemptKey)) {
        return res.status(429).json({ error: 'Too many login attempts. Try again in 15 minutes.' });
      }
      const users = readData('users');
      const user = users.find(u => u.phone === phone);
      if (!user) {
        recordFailedLogin(attemptKey);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        recordFailedLogin(attemptKey);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      loginAttempts.delete(attemptKey);
      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
      res.json({ token, user: { id: user.id, name: user.name, phone: user.phone, role: user.role, village: user.village, age: user.age } });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get all doctors (for patients to see)
  router.get('/doctors', (req, res) => {
    const users = readData('users');
    const doctors = users
      .filter(u => u.role === 'doctor')
      .map(d => ({ id: d.id, name: d.name, village: d.village }));
    res.json(doctors);
  });

  // Get user public profile by ID (for QR scanning)
  router.get('/users/:id', authenticate, requireRole('doctor'), (req, res) => {
    const users = readData('users');
    const user = users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Return only public information
    res.json({
      id: user.id,
      name: user.name,
      age: user.age || '',
      village: user.village || '',
      conditions: user.conditions || '',
      allergies: user.allergies || '',
      emergencyContact: user.emergencyContact || ''
    });
  });

  return router;
};
