const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'gramhealth_secret_2024';

module.exports = (readData, writeData) => {
  const router = express.Router();

  // Register
  router.post('/register', async (req, res) => {
    try {
      const { name, phone, password, role, village, age } = req.body;
      if (!name || !phone || !password || !role) {
        return res.status(400).json({ error: 'All fields required' });
      }
      const users = readData('users');
      if (users.find(u => u.phone === phone)) {
        return res.status(409).json({ error: 'Phone already registered' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = {
        id: uuidv4(),
        name,
        phone,
        password: hashedPassword,
        role, // 'patient' | 'doctor' | 'pharmacy'
        village: village || '',
        age: age || null,
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
      const { phone, password } = req.body;
      const users = readData('users');
      const user = users.find(u => u.phone === phone);
      if (!user) return res.status(401).json({ error: 'Invalid credentials' });
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
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

  return router;
};
