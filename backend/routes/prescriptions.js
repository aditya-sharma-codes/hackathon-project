const express = require('express');
const { randomUUID } = require('crypto');
const { authenticate, requireRole } = require('../middleware/auth');

module.exports = (readData, writeData) => {
  const router = express.Router();

  router.post('/', authenticate, requireRole('doctor'), (req, res) => {
    const { consultationId, medicines, notes, nextVisit } = req.body;
    const prescriptions = readData('prescriptions');
    const users = readData('users');
    const doctor = users.find(u => u.id === req.user.id);
    const consultations = readData('consultations');
    const consultation = consultations.find(c => c.id === consultationId);

    if (!consultation || consultation.doctorId !== req.user.id) {
      return res.status(403).json({ error: 'You can prescribe only for your own consultation' });
    }
    if (!['active', 'completed'].includes(consultation.status)) {
      return res.status(409).json({ error: 'The consultation must be active before prescribing' });
    }
    if (!Array.isArray(medicines) || medicines.length < 1 || medicines.length > 20) {
      return res.status(400).json({ error: 'Add between 1 and 20 medicines' });
    }
    const cleanMedicines = medicines.map(medicine => ({
      name: typeof medicine?.name === 'string' ? medicine.name.trim() : '',
      dosage: typeof medicine?.dosage === 'string' ? medicine.dosage.trim() : '',
      duration: typeof medicine?.duration === 'string' ? medicine.duration.trim() : ''
    }));
    if (cleanMedicines.some(medicine =>
      !medicine.name || medicine.name.length > 120 ||
      medicine.dosage.length > 120 || medicine.duration.length > 120)) {
      return res.status(400).json({ error: 'Invalid medicine details' });
    }
    const cleanNotes = typeof notes === 'string' ? notes.trim() : '';
    const cleanNextVisit = typeof nextVisit === 'string' ? nextVisit.trim() : '';
    if (cleanNotes.length > 2000) return res.status(400).json({ error: 'Notes are too long' });
    if (cleanNextVisit && (!/^\d{4}-\d{2}-\d{2}$/.test(cleanNextVisit) ||
        Number.isNaN(Date.parse(`${cleanNextVisit}T00:00:00Z`)))) {
      return res.status(400).json({ error: 'Invalid next-visit date' });
    }
    if (prescriptions.some(p => p.consultationId === consultationId)) {
      return res.status(409).json({ error: 'A prescription already exists for this consultation' });
    }

    const rx = {
      id: randomUUID(),
      consultationId,
      patientId: consultation.patientId,
      doctorId: req.user.id,
      doctorName: doctor?.name || 'Unknown',
      medicines: cleanMedicines,
      notes: cleanNotes,
      nextVisit: cleanNextVisit,
      issuedAt: new Date().toISOString()
    };
    prescriptions.push(rx);
    writeData('prescriptions', prescriptions);

    // Update consultation status
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
