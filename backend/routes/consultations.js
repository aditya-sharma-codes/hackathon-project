const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'gramhealth_secret_2024';

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = (readData, writeData) => {
  const router = express.Router();

  // Create consultation request
  router.post('/', authenticate, (req, res) => {
    try {
      const { doctorId, symptoms, triageResult, urgency, notes } = req.body;
      const consultations = readData('consultations');
      const users = readData('users');
      const patient = users.find(u => u.id === req.user.id);
      const doctor = users.find(u => u.id === doctorId);

      const consultation = {
        id: uuidv4(),
        patientId: req.user.id,
        patientName: patient?.name || 'Unknown',
        patientVillage: patient?.village || '',
        patientAge: patient?.age || null,
        doctorId,
        doctorName: doctor?.name || 'Unknown',
        symptoms,
        triageResult,
        urgency: urgency || 'medium',
        notes: notes || '',
        status: 'pending', // pending | active | completed | cancelled
        roomId: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      consultations.push(consultation);
      writeData('consultations', consultations);
      res.status(201).json(consultation);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get consultations for current user
  router.get('/', authenticate, (req, res) => {
    const consultations = readData('consultations');
    const result = consultations.filter(c =>
      c.patientId === req.user.id || c.doctorId === req.user.id
    );
    res.json(result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  });

  // Get single consultation
  router.get('/:id', authenticate, (req, res) => {
    const consultations = readData('consultations');
    const c = consultations.find(c => c.id === req.params.id);
    if (!c) return res.status(404).json({ error: 'Not found' });
    res.json(c);
  });

  // Update consultation status
  router.patch('/:id', authenticate, (req, res) => {
    const consultations = readData('consultations');
    const idx = consultations.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    consultations[idx] = { ...consultations[idx], ...req.body, updatedAt: new Date().toISOString() };
    writeData('consultations', consultations);
    res.json(consultations[idx]);
  });

  return router;
};
