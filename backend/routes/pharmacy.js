const express = require('express');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { findNearbyPharmacies } = require('../services/nearbyPharmacies');

const JWT_SECRET = process.env.JWT_SECRET;

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

  // Get all pharmacies
  router.get('/', (req, res) => {
    const inventory = readData('pharmacy_inventory');
    res.json(inventory);
  });

  // Find real mapped pharmacies near a typed location or lat,lng pair.
  router.get('/nearby', async (req, res) => {
    const location = typeof req.query.location === 'string' ? req.query.location.trim() : '';
    const requestedRadiusKm = Number(req.query.radius);
    const radiusMetres = Number.isFinite(requestedRadiusKm)
      ? Math.min(30, Math.max(1, requestedRadiusKm)) * 1000
      : 10000;

    if (!location) return res.status(400).json({ error: 'Location is required' });
    if (location.length > 300) return res.status(400).json({ error: 'Location is too long' });

    try {
      res.json(await findNearbyPharmacies(location, radiusMetres));
    } catch (error) {
      console.error('Nearby pharmacy search failed:', error.message);
      res.status(error.status || 502).json({
        error: error.message || 'Unable to search nearby pharmacies'
      });
    }
  });

  // Search medicine across all pharmacies
  router.get('/search', (req, res) => {
    const { q } = req.query;
    if (!q) return res.json([]);
    const inventory = readData('pharmacy_inventory');
    const results = [];
    inventory.forEach(pharmacy => {
      const matches = pharmacy.medicines.filter(m =>
        m.name.toLowerCase().includes(q.toLowerCase())
      );
      if (matches.length > 0) {
        results.push({ ...pharmacy, medicines: matches });
      }
    });
    res.json(results);
  });

  // Update medicine stock (pharmacy role)
  router.patch('/:pharmacyId/medicine', authenticate, (req, res) => {
    const { medicineName, quantity, price, available } = req.body;
    const inventory = readData('pharmacy_inventory');
    const phIdx = inventory.findIndex(p => p.id === req.params.pharmacyId);
    if (phIdx === -1) return res.status(404).json({ error: 'Pharmacy not found' });

    const medIdx = inventory[phIdx].medicines.findIndex(m =>
      m.name.toLowerCase() === medicineName.toLowerCase()
    );
    if (medIdx === -1) {
      inventory[phIdx].medicines.push({ name: medicineName, quantity, price, available });
    } else {
      inventory[phIdx].medicines[medIdx] = {
        ...inventory[phIdx].medicines[medIdx],
        quantity: quantity ?? inventory[phIdx].medicines[medIdx].quantity,
        price: price ?? inventory[phIdx].medicines[medIdx].price,
        available: available ?? inventory[phIdx].medicines[medIdx].available
      };
    }
    writeData('pharmacy_inventory', inventory);
    res.json(inventory[phIdx]);
  });

  // Add new pharmacy
  router.post('/', authenticate, (req, res) => {
    const inventory = readData('pharmacy_inventory');
    const pharmacy = { id: uuidv4(), ...req.body, medicines: req.body.medicines || [] };
    inventory.push(pharmacy);
    writeData('pharmacy_inventory', inventory);
    res.status(201).json(pharmacy);
  });

  return router;
};
