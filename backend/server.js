const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

// Initialize JSON data files
const dataFiles = {
  users: [],
  consultations: [],
  prescriptions: [],
  pharmacy_inventory: [
    {
      id: 'ph001',
      pharmacyName: 'Village Medical Store',
      location: 'Main Bazaar, Rampur',
      distance: '0.5 km',
      medicines: [
        { name: 'Paracetamol 500mg', quantity: 150, price: 2, available: true },
        { name: 'Amoxicillin 250mg', quantity: 80, price: 8, available: true },
        { name: 'ORS Sachets', quantity: 200, price: 5, available: true },
        { name: 'Metformin 500mg', quantity: 60, price: 4, available: true },
        { name: 'Amlodipine 5mg', quantity: 45, price: 6, available: true },
        { name: 'Cetirizine 10mg', quantity: 120, price: 3, available: true },
        { name: 'Omeprazole 20mg', quantity: 90, price: 7, available: true },
        { name: 'Azithromycin 250mg', quantity: 0, price: 15, available: false }
      ]
    },
    {
      id: 'ph002',
      pharmacyName: 'Jan Aushadhi Kendra',
      location: 'Near Panchayat Office, Sitapur',
      distance: '1.2 km',
      medicines: [
        { name: 'Paracetamol 500mg', quantity: 300, price: 1, available: true },
        { name: 'Iron Folic Acid', quantity: 180, price: 2, available: true },
        { name: 'Vitamin D3', quantity: 100, price: 3, available: true },
        { name: 'Metformin 500mg', quantity: 120, price: 2, available: true },
        { name: 'Atenolol 50mg', quantity: 75, price: 4, available: true },
        { name: 'Azithromycin 250mg', quantity: 40, price: 10, available: true }
      ]
    },
    {
      id: 'ph003',
      pharmacyName: 'Gram Seva Medical',
      location: 'Block Road, Chandpur',
      distance: '3.1 km',
      medicines: [
        { name: 'Insulin Regular', quantity: 20, price: 180, available: true },
        { name: 'Salbutamol Inhaler', quantity: 15, price: 85, available: true },
        { name: 'Doxycycline 100mg', quantity: 60, price: 12, available: true },
        { name: 'Ciprofloxacin 500mg', quantity: 55, price: 18, available: true },
        { name: 'Pantoprazole 40mg', quantity: 80, price: 5, available: true }
      ]
    }
  ]
};

Object.entries(dataFiles).forEach(([key, defaultVal]) => {
  const filePath = path.join(dataDir, `${key}.json`);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2));
  }
});

// Helper functions
const readData = (collection) => {
  const filePath = path.join(dataDir, `${collection}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

const writeData = (collection, data) => {
  const filePath = path.join(dataDir, `${collection}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Make helpers available globally
app.locals.readData = readData;
app.locals.writeData = writeData;

// Routes
const authRoutes = require('./routes/auth');
const consultationRoutes = require('./routes/consultations');
const prescriptionRoutes = require('./routes/prescriptions');
const pharmacyRoutes = require('./routes/pharmacy');

app.use('/api/auth', authRoutes(readData, writeData));
app.use('/api/consultations', consultationRoutes(readData, writeData));
app.use('/api/prescriptions', prescriptionRoutes(readData, writeData));
app.use('/api/pharmacy', pharmacyRoutes(readData, writeData));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'GramHealth API' });
});

// Serve frontend for all non-API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
  console.log(`\n🏥 GramHealth Server running on http://localhost:${PORT}`);
  console.log(`📱 Open in browser: http://localhost:${PORT}`);
  console.log(`🔌 API Base: http://localhost:${PORT}/api\n`);
});
