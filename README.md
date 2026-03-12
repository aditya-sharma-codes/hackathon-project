# 🏥 GramHealth – Rural TeleHealth Access System

> *Bringing healthcare to every village, even with poor internet.*

A **Progressive Web App (PWA)** for rural telehealth that works offline, supports low-bandwidth video/audio consultations, and provides AI-powered symptom triage.

---

## 📐 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│                                                                  │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────┐  │
│  │  PWA Shell  │  │ Service      │  │  IndexedDB /           │  │
│  │ (HTML/CSS   │  │ Worker       │  │  LocalStorage          │  │
│  │  Tailwind)  │  │ (Offline     │  │  (Offline Records,     │  │
│  │             │  │  Cache)      │  │  Queue, Cache)         │  │
│  └─────────────┘  └──────────────┘  └───────────────────────┘  │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │             APPLICATION LAYER (JavaScript)               │   │
│  │  app.js │ symptom-checker.js │ consultation.js            │   │
│  │  Auth Manager │ API Helper │ OfflineQueue │ NetworkSpeed  │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           WEBRTC LAYER (PeerJS / STUN/TURN)              │   │
│  │         Video Call ↔ Audio Only ↔ Voice Message          │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTPS / REST API
┌──────────────────────────▼──────────────────────────────────────┐
│                       SERVER LAYER                               │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Express.js (Node.js)                          │  │
│  │  /api/auth  /api/consultations  /api/prescriptions        │  │
│  │  /api/pharmacy        Static file serving                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │               JSON File Storage (Prototype)               │  │
│  │  users.json │ consultations.json │ prescriptions.json     │  │
│  │  pharmacy_inventory.json                                   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Adaptive Communication Stack
```
Network Speed   →   Communication Mode
─────────────────────────────────────────
4G / WiFi       →   Full Video Call (WebRTC + Video)
3G              →   Audio Only Call (WebRTC, no video)
2G / EDGE       →   Voice Messages (recorded, queued)
Offline         →   Text + Queued requests sync later
```

---

## 📁 Folder Structure

```
gramhealth/
├── frontend/                    # All frontend files
│   ├── index.html               # Landing page
│   ├── login.html               # Patient/Doctor login & register
│   ├── patient-dashboard.html   # Patient portal
│   ├── doctor-dashboard.html    # Doctor portal
│   ├── consultation.html        # WebRTC consultation room
│   ├── pharmacy.html            # Pharmacy search & update
│   ├── manifest.json            # PWA manifest
│   ├── sw.js                    # Service worker (offline support)
│   ├── css/
│   │   └── styles.css           # All styles (custom design system)
│   ├── js/
│   │   ├── app.js               # Core: Auth, API, Toast, Offline helpers
│   │   ├── symptom-checker.js   # AI triage engine (offline-capable)
│   │   └── consultation.js      # WebRTC + voice message logic
│   └── icons/                   # PWA icons (72-512px)
├── backend/
│   ├── server.js                # Express entry point
│   ├── package.json
│   ├── routes/
│   │   ├── auth.js              # Register, login, list doctors
│   │   ├── consultations.js     # CRUD consultation requests
│   │   ├── prescriptions.js     # Send/view prescriptions
│   │   └── pharmacy.js          # Inventory search & update
│   └── data/                    # JSON storage (auto-created)
│       ├── users.json
│       ├── consultations.json
│       ├── prescriptions.json
│       └── pharmacy_inventory.json
├── generate-icons.js            # Icon generator script
├── package.json                 # Root scripts
└── README.md                    # This file
```

---

## 🗄️ Database Schema

### users
```json
{
  "id": "uuid",
  "name": "string",
  "phone": "string (unique)",
  "password": "bcrypt hash",
  "role": "patient | doctor | pharmacy",
  "village": "string",
  "age": "number",
  "createdAt": "ISO timestamp"
}
```

### consultations
```json
{
  "id": "uuid",
  "patientId": "user.id",
  "patientName": "string",
  "patientVillage": "string",
  "patientAge": "number",
  "doctorId": "user.id",
  "doctorName": "string",
  "symptoms": "string",
  "triageResult": {
    "riskLevel": "low | medium | high",
    "conditions": [{ "name": "string", "risk": "string" }],
    "recommendation": "string"
  },
  "urgency": "low | medium | high",
  "status": "pending | active | completed | cancelled",
  "roomId": "uuid (WebRTC room)",
  "createdAt": "ISO timestamp",
  "updatedAt": "ISO timestamp"
}
```

### prescriptions
```json
{
  "id": "uuid",
  "consultationId": "consultation.id",
  "patientId": "user.id",
  "doctorId": "user.id",
  "doctorName": "string",
  "medicines": [
    { "name": "string", "dosage": "string", "duration": "string" }
  ],
  "notes": "string",
  "nextVisit": "date string",
  "issuedAt": "ISO timestamp"
}
```

### pharmacy_inventory
```json
{
  "id": "string",
  "pharmacyName": "string",
  "location": "string",
  "distance": "string",
  "medicines": [
    {
      "name": "string",
      "quantity": "number",
      "price": "number (₹)",
      "available": "boolean"
    }
  ]
}
```

---

## 🚀 Installation & Running

### Prerequisites
- Node.js v16+ installed
- npm

### Step 1: Install dependencies
```bash
cd gramhealth/backend
npm install
```

### Step 2: Generate PWA icons
```bash
cd gramhealth
node generate-icons.js
```

### Step 3: Start the server
```bash
cd gramhealth/backend
node server.js
```

### Step 4: Open in browser
```
http://localhost:3000
```

### For development with auto-reload:
```bash
cd gramhealth/backend
npm run dev
```

---

## 🎬 Hackathon Demo Flow

### Complete Demo Script (10 minutes)

#### 1. Landing Page (1 min)
- Open `http://localhost:3000`
- Show responsive, mobile-friendly landing
- Point out: offline badge, feature highlights

#### 2. Patient Registration & AI Symptom Check (2 min)
- Click "Get Started" → Register as Patient
  - Name: Ramu Kumar, Phone: 9876543210, Village: Rampur
  - Or click "Patient Demo" button
- On Patient Dashboard → "Check Symptoms" tab
- Type: *"high fever since 2 days, body ache, chills, headache, vomiting"*
- Select tags: Fever, Chills, Headache, Vomiting
- Click "Analyze Symptoms"
- **Show**: AI detects Malaria (High Risk), displays recommendation & emergency warning

#### 3. Book Doctor Consultation (1.5 min)
- Click "Book Consultation →" button (auto-fills symptoms)
- Register/select a doctor (or use Demo Doctor)
- Set urgency to High
- Click "Send Request"
- Show success toast

#### 4. Doctor Dashboard (2 min)
- Open new tab: `http://localhost:3000/login.html`
- Login as Doctor (Demo credentials)
- Show Queue with patient's request
- Click on patient card → See AI triage data
- Click "Accept & Start Call"

#### 5. WebRTC Consultation (2 min)
- Show consultation room
- Demonstrate adaptive modes:
  - Throttle network → UI switches to audio/voice mode
- Show call controls: mute, video toggle, end call
- Doctor fills clinical notes

#### 6. Write Prescription (1 min)
- Doctor → "Prescribe" tab
- Use "Fever" template (auto-fills medicines)
- Send prescription
- Switch back to patient view → Show prescription received

#### 7. Pharmacy Search (1 min)
- Navigate to Pharmacy page
- Search "Paracetamol"
- Show results across 3 pharmacies with prices
- Show out-of-stock item

#### 8. Offline Demo (30 sec)
- Disconnect internet (DevTools → Network → Offline)
- Show: App still loads from cache
- Run symptom checker → Still works!
- Try booking consultation → Gets queued
- Reconnect → Queued requests auto-sync

---

## ✨ Key Features Summary

| Feature | Technology |
|---------|-----------|
| PWA / Installable | Service Worker + manifest.json |
| Offline Symptom Check | Rule-based JS engine (no API needed) |
| Video Call | WebRTC via PeerJS |
| Audio-only mode | Auto-detects slow 3G connection |
| Voice messages | MediaRecorder API + localStorage |
| Offline queue | LocalStorage + background sync |
| AI Triage | 15-condition rule-based engine |
| Prescriptions | REST API + JSON storage |
| Medicine search | Multi-pharmacy search + offline cache |
| Auth | JWT + bcrypt |

---

## 🔮 Production Enhancements

- Replace JSON files with **MongoDB Atlas** or **PostgreSQL**
- Add **TURN server** for reliable WebRTC across NAT/firewalls
- Integrate **Twilio** for SMS notifications
- Add **Hindi language** support (i18n)
- Integrate **ABDM** (Ayushman Bharat Digital Mission) APIs
- Add **push notifications** for consultation updates
- Build **native Android APK** from PWA
- Add **telemedicine billing** with UPI integration

---

## 📄 License
MIT – Build for rural India 🇮🇳
