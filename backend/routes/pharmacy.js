const express = require('express');
const { randomUUID } = require('crypto');
const { findNearbyPharmacies } = require('../services/nearbyPharmacies');
const { authenticate, requireRole } = require('../middleware/auth');

function normalizeMedicine(medicine = {}) {
  const name = typeof medicine.name === 'string' ? medicine.name.trim() : '';
  const quantity = Number(medicine.quantity);
  const price = Number(medicine.price);
  if (!name || name.length > 120 || !Number.isFinite(quantity) || quantity < 0 ||
      !Number.isFinite(price) || price < 0) return null;
  return {
    name,
    quantity,
    price,
    available: typeof medicine.available === 'boolean'
      ? medicine.available
      : quantity > 0
  };
}

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
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';
    if (!q) return res.json([]);
    if (q.length > 120) return res.status(400).json({ error: 'Search term is too long' });
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
  router.patch('/:pharmacyId/medicine', authenticate, requireRole('pharmacy'), (req, res) => {
    const { medicineName, quantity, price, available } = req.body;
    const inventory = readData('pharmacy_inventory');
    const phIdx = inventory.findIndex(p => p.id === req.params.pharmacyId);
    if (phIdx === -1) return res.status(404).json({ error: 'Pharmacy not found' });
    if (inventory[phIdx].ownerId && inventory[phIdx].ownerId !== req.user.id) {
      return res.status(403).json({ error: 'You cannot update another pharmacy inventory' });
    }

    const cleanName = typeof medicineName === 'string' ? medicineName.trim() : '';
    const cleanQuantity = quantity == null ? undefined : Number(quantity);
    const cleanPrice = price == null ? undefined : Number(price);
    if (!cleanName || cleanName.length > 120) {
      return res.status(400).json({ error: 'Enter a valid medicine name' });
    }
    if (cleanQuantity !== undefined && (!Number.isFinite(cleanQuantity) || cleanQuantity < 0)) {
      return res.status(400).json({ error: 'Quantity must be zero or greater' });
    }
    if (cleanPrice !== undefined && (!Number.isFinite(cleanPrice) || cleanPrice < 0)) {
      return res.status(400).json({ error: 'Price must be zero or greater' });
    }
    if (available !== undefined && typeof available !== 'boolean') {
      return res.status(400).json({ error: 'Availability must be true or false' });
    }

    if (!Array.isArray(inventory[phIdx].medicines)) inventory[phIdx].medicines = [];
    const medIdx = inventory[phIdx].medicines.findIndex(m =>
      m.name.toLowerCase() === cleanName.toLowerCase()
    );
    if (medIdx === -1) {
      inventory[phIdx].medicines.push({
        name: cleanName,
        quantity: cleanQuantity ?? 0,
        price: cleanPrice ?? 0,
        available: available ?? (cleanQuantity > 0)
      });
    } else {
      const updatedQuantity = cleanQuantity ?? inventory[phIdx].medicines[medIdx].quantity;
      inventory[phIdx].medicines[medIdx] = {
        ...inventory[phIdx].medicines[medIdx],
        quantity: updatedQuantity,
        price: cleanPrice ?? inventory[phIdx].medicines[medIdx].price,
        available: available ?? (cleanQuantity !== undefined
          ? updatedQuantity > 0
          : inventory[phIdx].medicines[medIdx].available)
      };
    }
    writeData('pharmacy_inventory', inventory);
    res.json(inventory[phIdx]);
  });

  // Add new pharmacy
  router.post('/', authenticate, requireRole('pharmacy'), (req, res) => {
    const pharmacyName = typeof req.body.pharmacyName === 'string'
      ? req.body.pharmacyName.trim()
      : '';
    const location = typeof req.body.location === 'string' ? req.body.location.trim() : '';
    const medicines = Array.isArray(req.body.medicines)
      ? req.body.medicines.map(normalizeMedicine)
      : [];
    if (!pharmacyName || pharmacyName.length > 150 || !location || location.length > 250) {
      return res.status(400).json({ error: 'Valid pharmacy name and location are required' });
    }
    if (medicines.some(medicine => !medicine) || medicines.length > 100) {
      return res.status(400).json({ error: 'Invalid pharmacy inventory' });
    }
    const inventory = readData('pharmacy_inventory');
    const pharmacy = {
      id: randomUUID(),
      ownerId: req.user.id,
      pharmacyName,
      location,
      medicines
    };
    inventory.push(pharmacy);
    writeData('pharmacy_inventory', inventory);
    res.status(201).json(pharmacy);
  });

  return router;
};
