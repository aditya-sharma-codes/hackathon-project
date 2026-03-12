// ─── GramHealth AI Symptom Triage Engine ──────────────────────────────────
// Rule-based system that works fully offline

const SymptomChecker = {
  // ─── Knowledge Base ──────────────────────────────────────────────────
  conditions: [
    {
      name: 'Common Cold / Viral URTI',
      keywords: ['cold', 'runny nose', 'sneezing', 'sore throat', 'mild fever', 'cough', 'nasal congestion'],
      risk: 'low',
      recommendation: 'Rest, drink fluids, and take paracetamol if needed. Visit a doctor if symptoms worsen after 5 days.',
      medicines: ['Paracetamol 500mg', 'ORS Sachets', 'Cetirizine 10mg'],
      warning: null
    },
    {
      name: 'Influenza (Flu)',
      keywords: ['high fever', 'body ache', 'chills', 'fatigue', 'muscle pain', 'headache', 'cough'],
      risk: 'medium',
      recommendation: 'Rest and stay hydrated. Consult a doctor for antiviral medication if symptoms are severe.',
      medicines: ['Paracetamol 500mg', 'ORS Sachets'],
      warning: 'Seek medical help if fever exceeds 103°F or breathing difficulty occurs.'
    },
    {
      name: 'Malaria (Suspected)',
      keywords: ['malaria', 'cyclic fever', 'shivering', 'chills', 'sweating', 'headache', 'vomiting after fever'],
      risk: 'high',
      recommendation: 'Seek IMMEDIATE medical attention. Malaria requires blood test and prescription antimalarials.',
      medicines: [],
      warning: '⚠️ URGENT: Do not delay. Go to nearest health center immediately.'
    },
    {
      name: 'Dengue Fever (Suspected)',
      keywords: ['dengue', 'high fever sudden', 'rash', 'bone pain', 'eye pain', 'bleeding gums', 'bruising'],
      risk: 'high',
      recommendation: 'Emergency care needed. Do NOT take aspirin/ibuprofen. Take only paracetamol.',
      medicines: ['Paracetamol 500mg'],
      warning: '⚠️ URGENT: Dengue can be life-threatening. Go to hospital immediately.'
    },
    {
      name: 'Diarrhea / Gastroenteritis',
      keywords: ['diarrhea', 'loose motions', 'stomach pain', 'nausea', 'vomiting', 'stomach ache'],
      risk: 'medium',
      recommendation: 'ORS is critical to prevent dehydration. Avoid heavy meals. See a doctor if bloody stool occurs.',
      medicines: ['ORS Sachets', 'Zinc tablets', 'Metronidazole (if prescribed)'],
      warning: 'Danger signs: blood in stool, no urine in 6+ hours, extreme weakness.'
    },
    {
      name: 'Urinary Tract Infection (UTI)',
      keywords: ['burning urination', 'frequent urination', 'painful urination', 'uti', 'pelvic pain', 'cloudy urine'],
      risk: 'medium',
      recommendation: 'Drink plenty of water. Consult doctor for antibiotic prescription.',
      medicines: ['Ciprofloxacin (prescription)', 'Plenty of water'],
      warning: 'Seek immediate help if fever + back pain (possible kidney infection).'
    },
    {
      name: 'Hypertension / High Blood Pressure',
      keywords: ['high bp', 'high blood pressure', 'headache severe', 'dizziness', 'blurred vision', 'chest tightness'],
      risk: 'high',
      recommendation: 'Check blood pressure immediately. Take prescribed BP medication. Avoid salt and stress.',
      medicines: ['Amlodipine (prescription)', 'Atenolol (prescription)'],
      warning: '⚠️ If BP > 180/120 or chest pain: Emergency. Call doctor immediately.'
    },
    {
      name: 'Diabetes (High Blood Sugar)',
      keywords: ['diabetes', 'high sugar', 'excessive thirst', 'frequent urination', 'blurry vision', 'slow healing', 'fatigue'],
      risk: 'medium',
      recommendation: 'Monitor blood sugar levels. Stick to prescribed medications and diet. Consult doctor for dosage.',
      medicines: ['Metformin 500mg (prescription)'],
      warning: 'Emergency if: confused, unconscious, or breathing rapidly (diabetic ketoacidosis).'
    },
    {
      name: 'Chest Pain / Cardiac Event',
      keywords: ['chest pain', 'heart pain', 'left arm pain', 'jaw pain with chest', 'heart attack', 'palpitation severe'],
      risk: 'high',
      recommendation: 'CALL FOR HELP IMMEDIATELY. This is a medical emergency.',
      medicines: [],
      warning: '🚨 EMERGENCY: Call ambulance NOW. Do not wait or drive alone.'
    },
    {
      name: 'Asthma / Breathing Difficulty',
      keywords: ['asthma', 'breathlessness', 'wheezing', 'difficulty breathing', 'chest tightness breathing', 'shortness of breath'],
      risk: 'high',
      recommendation: 'Use prescribed inhaler. Sit upright. Call doctor if inhaler does not help within 20 min.',
      medicines: ['Salbutamol Inhaler (prescription)'],
      warning: '⚠️ Severe asthma attack is life-threatening. Seek emergency care.'
    },
    {
      name: 'Skin Infection / Wound',
      keywords: ['wound', 'cut', 'infection skin', 'redness', 'swelling skin', 'pus', 'abscess'],
      risk: 'low',
      recommendation: 'Clean wound with clean water and antiseptic. See doctor if signs of infection (redness spreading, pus, fever).',
      medicines: ['Antiseptic cream', 'Doxycycline (if infected, prescription)'],
      warning: null
    },
    {
      name: 'Anemia',
      keywords: ['weakness', 'pale', 'fatigue', 'dizziness', 'anemia', 'low hemoglobin', 'breathless with exertion'],
      risk: 'medium',
      recommendation: 'Eat iron-rich foods (leafy greens, jaggery, pulses). Take iron tablets as prescribed.',
      medicines: ['Iron Folic Acid', 'Vitamin C (to enhance absorption)'],
      warning: 'Get blood test to confirm. Severe anemia requires medical treatment.'
    },
    {
      name: 'Typhoid (Suspected)',
      keywords: ['typhoid', 'prolonged fever', 'week long fever', 'stomach pain', 'rose spots', 'weakness prolonged'],
      risk: 'high',
      recommendation: 'Blood test needed to confirm. Requires antibiotic treatment under doctor supervision.',
      medicines: ['Ciprofloxacin (prescription)', 'ORS'],
      warning: '⚠️ Untreated typhoid can be fatal. See doctor urgently.'
    },
    {
      name: 'Eye Infection (Conjunctivitis)',
      keywords: ['eye pain', 'red eye', 'eye discharge', 'swollen eye', 'pink eye', 'eye irritation'],
      risk: 'low',
      recommendation: 'Wash eyes with clean water. Avoid touching eyes. See doctor for antibiotic eye drops.',
      medicines: ['Antibiotic eye drops (prescription)'],
      warning: null
    },
    {
      name: 'Pregnancy Complications',
      keywords: ['pregnant', 'pregnancy', 'bleeding during pregnancy', 'abdominal pain pregnancy', 'reduced fetal movement'],
      risk: 'high',
      recommendation: 'Contact ASHA worker or nearest PHC immediately.',
      medicines: ['Iron Folic Acid', 'Calcium supplements'],
      warning: '⚠️ Any bleeding or severe pain in pregnancy needs immediate medical care.'
    },
    // New conditions
    {
      name: 'Snake Bite',
      keywords: ['snake bite', 'snake', 'bite', 'fang marks', 'swelling', 'pain at bite site'],
      risk: 'high',
      recommendation: 'Call emergency immediately. Keep the bitten limb still and below heart level. Do NOT apply tourniquet or cut the wound.',
      medicines: [],
      warning: '🚨 LIFE-THREATENING EMERGENCY – Go to nearest hospital IMMEDIATELY.'
    },
    {
      name: 'Dog / Animal Bite',
      keywords: ['dog bite', 'animal bite', 'rabies', 'bite wound'],
      risk: 'medium',
      recommendation: 'Wash wound thoroughly with soap and water for 15 minutes. Apply antiseptic. Visit nearest PHC for rabies vaccine as soon as possible.',
      medicines: ['Rabies vaccine (at PHC)', 'Tetanus toxoid'],
      warning: 'Even if the animal seems healthy, you must get vaccinated.'
    },
    {
      name: 'Dehydration',
      keywords: ['dehydration', 'dry mouth', 'thirst', 'not urinating', 'dark urine', 'weak', 'dizzy'],
      risk: 'medium',
      recommendation: 'Drink ORS solution frequently. If you cannot keep fluids down, or if symptoms worsen, see a doctor immediately.',
      medicines: ['ORS Sachets'],
      warning: 'Severe dehydration can be life-threatening, especially in children.'
    },
    {
      name: 'Heat Stroke',
      keywords: ['heat stroke', 'hot', 'sun stroke', 'high body temperature', 'no sweating', 'confused'],
      risk: 'high',
      recommendation: 'Move to a cool place, apply cold water to skin, fan vigorously. Seek emergency medical help immediately.',
      medicines: [],
      warning: '🚨 MEDICAL EMERGENCY – Call ambulance now.'
    },
    {
      name: 'Allergic Reaction',
      keywords: ['allergy', 'hives', 'rash', 'itching', 'swelling face', 'difficulty breathing'],
      risk: 'high',
      recommendation: 'If breathing difficulty, call emergency. Take antihistamine if available. Seek immediate medical attention.',
      medicines: ['Cetirizine', 'Chlorpheniramine'],
      warning: 'Difficulty breathing is a sign of severe allergic reaction (anaphylaxis) – go to hospital NOW.'
    }
  ],

  commonSymptoms: [
    'Fever', 'Cough', 'Headache', 'Body ache', 'Fatigue',
    'Nausea', 'Vomiting', 'Diarrhea', 'Chest pain', 'Breathlessness',
    'Dizziness', 'Rash', 'Sore throat', 'Runny nose', 'Stomach pain',
    'Back pain', 'Joint pain', 'Weakness', 'Loss of appetite', 'Chills',
    'Snake bite', 'Dog bite', 'Dehydration', 'Allergy', 'Heat stroke'
  ],

  // ─── Analyze Symptoms ────────────────────────────────────────────────
  analyze(symptomsText, selectedSymptoms = []) {
    const combined = (symptomsText + ' ' + selectedSymptoms.join(' ')).toLowerCase();
    const scores = [];

    for (const condition of this.conditions) {
      let score = 0;
      for (const kw of condition.keywords) {
        if (combined.includes(kw.toLowerCase())) score++;
      }
      if (score > 0) scores.push({ ...condition, score });
    }

    scores.sort((a, b) => b.score - a.score);
    const top = scores.slice(0, 3);

    if (top.length === 0) {
      return {
        conditions: [],
        riskLevel: 'low',
        recommendation: 'Symptoms not clearly identified. Please consult a doctor for proper diagnosis.',
        medicines: ['Paracetamol 500mg (if pain/fever)', 'ORS (if dehydrated)'],
        warning: null,
        emergency: false
      };
    }

    const highestRisk = top.some(c => c.risk === 'high') ? 'high'
      : top.some(c => c.risk === 'medium') ? 'medium' : 'low';

    const primary = top[0];
    const allMeds = [...new Set(top.flatMap(c => c.medicines))].slice(0, 5);

    return {
      conditions: top.map(c => ({ name: c.name, risk: c.risk, score: c.score })),
      riskLevel: highestRisk,
      recommendation: primary.recommendation,
      medicines: allMeds,
      warning: primary.warning,
      emergency: top.some(c => c.warning?.includes('URGENT') || c.warning?.includes('EMERGENCY'))
    };
  },

  // ─── Render results ──────────────────────────────────────────────────
  renderResult(result) {
    const riskConfig = {
      high: { cls: 'risk-high', icon: '🚨', title: 'High Risk', color: '#dc2626' },
      medium: { cls: 'risk-medium', icon: '⚠️', title: 'Medium Risk', color: '#d97706' },
      low: { cls: 'risk-low', icon: '✅', title: 'Low Risk', color: '#16a34a' }
    };
    const rc = riskConfig[result.riskLevel];

    const conditionsList = result.conditions.length
      ? result.conditions.map(c => `<div class="med-item">
          <div>
            <div class="med-name">${c.name}</div>
            <div class="med-info">Confidence: ${Math.min(100, c.score * 20)}%</div>
          </div>
          ${urgencyBadge(c.risk)}
        </div>`).join('')
      : '<p class="text-muted text-sm">No specific condition identified</p>';

    const medsList = result.medicines.length
      ? result.medicines.map(m => `<div class="rx-med"><div class="rx-med-dot"></div><div><div class="rx-med-name">${m}</div></div></div>`).join('')
      : '<p class="text-muted text-sm">No specific medicines suggested</p>';

    return `
      <div class="fade-in">
        ${result.emergency ? `<div class="risk-indicator risk-high" style="background:#7f1d1d;border:none;color:white;">
          <div class="risk-icon">🚨</div>
          <div><div class="risk-title">EMERGENCY - Seek Immediate Help!</div>
          <div style="font-size:0.82rem;opacity:0.9;">Call health center or go to nearest hospital NOW</div></div>
        </div>` : ''}
        
        <div class="risk-indicator ${rc.cls}">
          <div class="risk-icon">${rc.icon}</div>
          <div>
            <div class="risk-title">${rc.title}</div>
            <div class="risk-desc">${result.recommendation}</div>
          </div>
        </div>
        
        ${result.warning ? `<div class="card" style="background:#fef3c7;border-color:#fde68a;">
          <p style="font-size:0.85rem;color:#92400e;font-weight:600;">${result.warning}</p>
        </div>` : ''}

        <div class="card">
          <div class="card-header">🔍 Possible Conditions</div>
          ${conditionsList}
        </div>

        <div class="card">
          <div class="card-header">💊 Suggested Medicines</div>
          <p class="text-xs text-muted mb-4" style="margin-bottom:8px;">⚠️ Always consult a doctor before taking medicine</p>
          ${medsList}
        </div>
      </div>
    `;
  }
};