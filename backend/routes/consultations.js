const express = require('express');
const { randomUUID } = require('crypto');
const { authenticate, requireRole } = require('../middleware/auth');

const URGENCY_LEVELS = new Set(['low', 'medium', 'high']);
const STATUS_TRANSITIONS = {
  pending: new Set(['active', 'cancelled']),
  active: new Set(['completed', 'cancelled']),
  completed: new Set(),
  cancelled: new Set()
};

function isParticipant(consultation, user) {
  return consultation.patientId === user.id || consultation.doctorId === user.id;
}

function normalizeTriageResult(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const riskLevel = ['low', 'medium', 'high'].includes(value.riskLevel)
    ? value.riskLevel
    : 'low';
  const conditions = Array.isArray(value.conditions)
    ? value.conditions.slice(0, 5).map(condition => ({
      name: typeof condition?.name === 'string'
        ? condition.name.trim().slice(0, 120)
        : '',
      risk: ['low', 'medium', 'high'].includes(condition?.risk)
        ? condition.risk
        : 'low',
      score: Number.isFinite(Number(condition?.score))
        ? Math.max(0, Math.min(100, Number(condition.score)))
        : 0
    })).filter(condition => condition.name)
    : [];
  return { riskLevel, conditions };
}

module.exports = (readData, writeData) => {
  const router = express.Router();

  // Create consultation request
  router.post('/', authenticate, requireRole('patient'), (req, res) => {
    try {
      const { doctorId, symptoms, triageResult, urgency, notes } = req.body;
      const consultations = readData('consultations');
      const users = readData('users');
      const patient = users.find(u => u.id === req.user.id);
      const doctor = users.find(u => u.id === doctorId && u.role === 'doctor');
      const cleanSymptoms = typeof symptoms === 'string' ? symptoms.trim() : '';
      const cleanUrgency = typeof urgency === 'string' ? urgency.toLowerCase() : 'medium';
      const cleanNotes = typeof notes === 'string' ? notes.trim() : '';

      if (!patient) return res.status(404).json({ error: 'Patient account not found' });
      if (!doctor) return res.status(400).json({ error: 'Select a valid doctor' });
      if (cleanSymptoms.length < 3 || cleanSymptoms.length > 2000) {
        return res.status(400).json({ error: 'Symptoms must be between 3 and 2000 characters' });
      }
      if (!URGENCY_LEVELS.has(cleanUrgency)) {
        return res.status(400).json({ error: 'Invalid urgency level' });
      }
      if (cleanNotes.length > 1000) {
        return res.status(400).json({ error: 'Notes are too long' });
      }

      const consultation = {
        id: randomUUID(),
        patientId: req.user.id,
        patientName: patient?.name || 'Unknown',
        patientVillage: patient?.village || '',
        patientAge: patient?.age || null,
        doctorId,
        doctorName: doctor?.name || 'Unknown',
        symptoms: cleanSymptoms,
        triageResult: normalizeTriageResult(triageResult),
        urgency: cleanUrgency,
        notes: cleanNotes,
        status: 'pending', // pending | active | completed | cancelled
        roomId: randomUUID(),
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
    if (!isParticipant(c, req.user)) {
      return res.status(403).json({ error: 'You do not have access to this consultation' });
    }
    res.json(c);
  });

  // Update consultation status
  router.patch('/:id', authenticate, (req, res) => {
    const consultations = readData('consultations');
    const idx = consultations.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });

    const consultation = consultations[idx];
    if (!isParticipant(consultation, req.user)) {
      return res.status(403).json({ error: 'You do not have access to this consultation' });
    }

    const nextStatus = typeof req.body.status === 'string'
      ? req.body.status.toLowerCase()
      : '';
    const roleCanUpdate = req.user.role === 'doctor'
      ? consultation.doctorId === req.user.id
      : req.user.role === 'patient' &&
        consultation.patientId === req.user.id &&
        nextStatus === 'cancelled';

    if (!roleCanUpdate) {
      return res.status(403).json({ error: 'You cannot update this consultation status' });
    }
    if (nextStatus !== consultation.status &&
        !STATUS_TRANSITIONS[consultation.status]?.has(nextStatus)) {
      return res.status(409).json({
        error: `Cannot change consultation from ${consultation.status} to ${nextStatus || 'an invalid status'}`
      });
    }

    consultations[idx] = {
      ...consultation,
      status: nextStatus,
      updatedAt: new Date().toISOString()
    };
    writeData('consultations', consultations);
    res.json(consultations[idx]);
  });

  return router;
};
