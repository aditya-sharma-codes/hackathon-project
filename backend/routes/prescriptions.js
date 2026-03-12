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

  router.post('/', authenticate, (req, res) => {
    const { consultationId, patientId, medicines, notes, nextVisit } = req.body;
    const prescriptions = readData('prescriptions');
    const users = readData('users');
    const doctor = users.find(u => u.id === req.user.id);

    const rx = {
      id: uuidv4(),
      consultationId,
      patientId,
      doctorId: req.user.id,
      doctorName: doctor?.name || 'Unknown',
      medicines,
      notes: notes || '',
      nextVisit: nextVisit || '',
      issuedAt: new Date().toISOString()
    };
    prescriptions.push(rx);
    writeData('prescriptions', prescriptions);

    // Update consultation status
    const consultations = readData('consultations');
    const idx = consultations.findIndex(c => c.id === consultationId);
    if (idx !== -1) {
      consultations[idx].status = 'completed';
      consultations[idx].updatedAt = new Date().toISOString();
      writeData('consultations', consultations);
    }
    res.status(201).json(rx);
  });

  router.get('/', authenticate, (req, res) => {
    const prescriptions = readData('prescriptions');
    const result = prescriptions.filter(p =>
      p.patientId === req.user.id || p.doctorId === req.user.id
    );
    res.json(result.sort((a, b) => new Date(b.issuedAt) - new Date(a.issuedAt)));
  });

  return router;
};
