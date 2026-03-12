// ─── GramHealth i18n Engine ────────────────────────────────────────────────
// Languages: English, हिंदी, मराठी, বাংলা, தமிழ்
// Usage:
//   t('key')              → translated string
//   i18n.setLang('hi')   → switch language + saves to localStorage
//   data-i18n="key"      → auto-translate element on switch
//   data-i18n-ph="key"   → translate placeholder attribute
// ─────────────────────────────────────────────────────────────────────────────

const LANGS = {
  en: { label: 'English',  flag: '🇬🇧', inputLang: 'en' },
  hi: { label: 'हिंदी',    flag: '🇮🇳', inputLang: 'hi' },
  mr: { label: 'मराठी',    flag: '🇮🇳', inputLang: 'mr' },
  bn: { label: 'বাংলা',    flag: '🇧🇩', inputLang: 'bn' },
  ta: { label: 'தமிழ்',   flag: '🇮🇳', inputLang: 'ta' },
};

const TRANSLATIONS = {

  // ─── ENGLISH ───────────────────────────────────────────────────────────────
  en: {
    // General
    logout: 'Logout', loading: 'Loading...', close: 'Close',
    cancel: 'Cancel', send: 'Send', search: 'Search',
    view: 'View', back: 'Back', yes: 'Yes', no: 'No',

    // Offline
    offline_banner: '📵 Offline – App works with limited features',
    conn_good: '📶 Good connection – Video call available',
    conn_medium: '📶 Medium signal – Audio only mode',
    conn_poor: '⚠️ Weak signal – Voice messages & chat only',
    conn_offline: '📵 Offline – Chat will sync when online',
    conn_checking: '🔄 Checking connection...',

    // Nav / Tabs
    tab_home: 'Home', tab_symptoms: 'Symptoms', tab_consult: 'Consult',
    tab_records: 'Records', tab_pharmacy: 'Pharmacy',
    tab_queue: 'Queue', tab_active: 'Active',
    tab_history: 'History', tab_prescribe: 'Prescribe',
    tab_search: 'Search', tab_nearby: 'Nearby', tab_update: 'Update',

    // Home
    how_feeling: 'How are you feeling today?',
    check_symptoms: 'Check Symptoms',
    ai_offline: 'AI-powered • Offline',
    talk_to_doctor: 'Talk to Doctor',
    book_consultation: 'Book consultation',
    recent_consultations: '📅 Recent Consultations',
    pending_offline: '⏳ Pending (Offline)',
    offline_queue_msg: 'These will be sent when internet returns.',
    sync_now: '🔄 Sync Now',
    no_consults_yet: 'No consultations yet.',
    book_one_now: 'Book one now',
    greeting_morning: 'morning', greeting_afternoon: 'afternoon', greeting_evening: 'evening',

    // Symptom checker
    ai_symptom_checker: '🩺 AI Symptom Checker',
    works_no_internet: 'Works without internet • Not a substitute for doctor',
    describe_symptoms: 'Describe your symptoms in detail',
    symptom_ph: 'e.g. I have fever since 2 days with headache and body ache...',
    common_symptoms: 'Common symptoms (tap to select)',
    how_long: 'How long have you had these symptoms?',
    duration_today: 'Started today', duration_2_3: '2-3 days',
    duration_1week: 'About a week', duration_more: 'More than a week',
    analyze_btn: '🔍 Analyze Symptoms',
    want_doctor: '💬 Want to speak with a doctor?',
    doctor_review_msg: 'Our doctors can review your symptoms and provide proper diagnosis.',
    book_consult_btn: 'Book Consultation →',
    input_hint: 'You can type in your language',

    // Consultation
    book_consult_title: '👨‍⚕️ Book Consultation',
    connect_doctors: 'Connect with available doctors',
    new_request: '📝 New Consultation Request',
    select_doctor: 'Select Doctor',
    main_complaint: 'Main Complaint / Symptoms',
    consult_ph: 'Describe what you\'re experiencing...',
    urgency_level: 'Urgency Level',
    urgency_low: '🟢 Low – Routine checkup',
    urgency_medium: '🟡 Medium – Needs attention soon',
    urgency_high: '🔴 High – Urgent / Emergency',
    send_request: '📤 Send Request',
    sending: 'Sending...',
    my_consultations: '📋 My Consultations',
    active_consult_msg: 'is available for your consultation',
    join_call_now: '📞 Join Call Now',
    join_call: '📞 Join Call',

    // Records
    health_records: '📋 Health Records',
    rx_history: 'Prescriptions & symptom history',
    prescriptions: '💊 Prescriptions',
    no_prescriptions: 'No prescriptions yet',
    offline_history: '🗂️ Offline Symptom History',
    no_symptom_checks: 'No saved symptom checks',

    // QR
    your_health_qr: '📱 Your Health QR Code',
    show_to_doctor: 'Show this to your doctor or pharmacy',
    scan_to_access: 'Scan to instantly access your health profile',

    // Doctor Queue
    patient_queue: 'Patient Queue',
    pending_requests: 'Pending consultation requests',
    pending: 'Pending', active: 'Active', done_today: 'Done Today',
    active_session: '🔴 Active Session',
    rejoin_call: '📞 Rejoin Call',
    no_active_consult: 'No active consultation',
    view_queue: 'View Queue',
    consult_history: 'Consultation History',
    no_completed: 'No completed consultations yet',
    queue_empty: '🎉 Queue is empty! No pending requests.',
    accept_start: '✅ Accept & Start Call',

    // Prescription
    write_prescription: '💊 Write Prescription',
    select_consult: 'Select Patient Consultation',
    medicines: 'Medicines',
    medicine_name_ph: 'Medicine name',
    dosage_ph: 'Dosage',
    duration_ph: 'Duration',
    add_medicine: '+ Add Medicine',
    doctor_notes_label: 'Doctor\'s Notes / Advice',
    notes_ph: 'Rest, dietary advice, follow-up instructions...',
    next_visit: 'Next Visit Date',
    send_prescription: '📋 Send Prescription',
    quick_templates: '⚡ Quick Templates',
    rx_sent: 'Prescription sent to patient!',
    select_consult_err: 'Please select a consultation first',
    add_medicine_err: 'Add at least one medicine with a name',

    // QR Scanner (doctor)
    scan_patient_qr: '📷 Scan Patient QR',
    point_camera: 'Point camera at patient\'s health QR code',
    or_upload_qr: '— OR upload QR image —',
    patient_info: '🆔 Patient Info',
    scanned_via_qr: 'Scanned via QR',
    view_their_consults: 'View Their Consultations →',

    // Consultation room
    consultation_room: 'Consultation',
    weak_signal_title: '⚠️ Weak Signal',
    weak_signal_msg: 'Use voice messages or text chat to communicate.',
    voice_message: '🎙️ Voice Message',
    recording: '● Recording...',
    record_btn: '🎙️ Record Voice Message',
    stop_recording: '⏹️ Stop Recording',
    saved_recordings: '📼 Saved Recordings',
    no_recordings: 'No recordings yet',
    end_session: '📵 End Session',
    chat: '💬 Chat',
    chat_ph: 'Type a message and press Enter...',
    clinical_notes: '🩺 Clinical Notes',
    clinical_notes_ph: 'Examination findings, diagnosis, advice...',
    call_patient: '📞 Call Patient',
    patient_room_label: 'Patient Room ID:',
    start_call: '📞 Start Video/Audio Call',
    your_room_id: '🔗 Your Room ID',
    waiting_doctor: 'Waiting for doctor to call you...',
    no_msg_yet: 'No messages yet. Say hello! 👋',
    write_rx: '💊 Write Prescription',

    // Pharmacy
    find_medicines: '💊 Find Medicines',
    pharmacy_subtitle: 'Search across all nearby pharmacies',
    search_med_ph: 'Search medicine name (e.g. Paracetamol)...',
    nearby_pharmacies: '📍 Nearby Pharmacies',
    update_stock: '📦 Update Stock',
    for_pharmacy_owners: 'For pharmacy owners to update inventory',
    in_stock: '✅ In Stock',
    out_of_stock: '❌ Out of Stock',
    update_stock_btn: '📤 Update Stock',

    // Auth
    sign_in: 'Sign In', register: 'Register',
    phone_number: '📱 Phone Number',
    password_label: '🔒 Password',
    full_name: '👤 Full Name',
    village_town: '🏘️ Village / Town',
    age_label: '🎂 Age',
    i_am_a: '👥 I am a',
    role_patient: 'Patient',
    role_doctor: 'Doctor / Healthcare Worker',
    role_pharmacy: 'Pharmacy Owner',
    create_account: 'Create Account →',
    sign_in_btn: 'Sign In →',
    demo_creds: 'Demo credentials:',
    patient_demo: '👤 Patient Demo',
    doctor_demo: '👨‍⚕️ Doctor Demo',
    err_fill_all: 'Please fill in all fields',
    err_phone: 'Please enter a valid 10-digit phone number',
    err_password: 'Password must be at least 6 characters',
  },

  // ─── HINDI ─────────────────────────────────────────────────────────────────
  hi: {
    logout: 'लॉग आउट', loading: 'लोड हो रहा है...', close: 'बंद करें',
    cancel: 'रद्द करें', send: 'भेजें', search: 'खोजें',
    view: 'देखें', back: 'वापस', yes: 'हाँ', no: 'नहीं',

    offline_banner: '📵 ऑफलाइन – ऐप सीमित सुविधाओं के साथ काम करता है',
    conn_good: '📶 अच्छा कनेक्शन – वीडियो कॉल उपलब्ध',
    conn_medium: '📶 मध्यम सिग्नल – केवल ऑडियो मोड',
    conn_poor: '⚠️ कमज़ोर सिग्नल – केवल वॉइस और चैट',
    conn_offline: '📵 ऑफलाइन – ऑनलाइन होने पर चैट सिंक होगी',
    conn_checking: '🔄 कनेक्शन जाँच रहे हैं...',

    tab_home: 'होम', tab_symptoms: 'लक्षण', tab_consult: 'परामर्श',
    tab_records: 'रिकॉर्ड', tab_pharmacy: 'फार्मेसी',
    tab_queue: 'कतार', tab_active: 'सक्रिय',
    tab_history: 'इतिहास', tab_prescribe: 'प्रिस्क्रिप्शन',
    tab_search: 'खोज', tab_nearby: 'नज़दीकी', tab_update: 'अपडेट',

    how_feeling: 'आज आप कैसा महसूस कर रहे हैं?',
    check_symptoms: 'लक्षण जाँचें',
    ai_offline: 'AI-आधारित • ऑफलाइन',
    talk_to_doctor: 'डॉक्टर से बात करें',
    book_consultation: 'परामर्श बुक करें',
    recent_consultations: '📅 हाल के परामर्श',
    pending_offline: '⏳ लंबित (ऑफलाइन)',
    offline_queue_msg: 'इंटरनेट आने पर ये अनुरोध भेजे जाएंगे।',
    sync_now: '🔄 अभी सिंक करें',
    no_consults_yet: 'अभी कोई परामर्श नहीं।',
    book_one_now: 'अभी बुक करें',
    greeting_morning: 'सुप्रभात', greeting_afternoon: 'नमस्ते', greeting_evening: 'शुभ संध्या',

    ai_symptom_checker: '🩺 AI लक्षण जाँचक',
    works_no_internet: 'इंटरनेट के बिना काम करता है • डॉक्टर का विकल्प नहीं',
    describe_symptoms: 'अपने लक्षण विस्तार से बताएं',
    symptom_ph: 'जैसे: 2 दिन से बुखार है, सिरदर्द और बदन दर्द भी है...',
    common_symptoms: 'सामान्य लक्षण (चुनने के लिए टैप करें)',
    how_long: 'ये लक्षण कितने समय से हैं?',
    duration_today: 'आज शुरू हुए', duration_2_3: '2-3 दिन',
    duration_1week: 'लगभग एक हफ्ता', duration_more: 'एक हफ्ते से अधिक',
    analyze_btn: '🔍 लक्षण विश्लेषण करें',
    want_doctor: '💬 डॉक्टर से बात करना चाहते हैं?',
    doctor_review_msg: 'हमारे डॉक्टर आपके लक्षण देखकर सही निदान दे सकते हैं।',
    book_consult_btn: 'परामर्श बुक करें →',
    input_hint: 'आप हिंदी में टाइप कर सकते हैं',

    book_consult_title: '👨‍⚕️ परामर्श बुक करें',
    connect_doctors: 'उपलब्ध डॉक्टरों से जुड़ें',
    new_request: '📝 नया परामर्श अनुरोध',
    select_doctor: 'डॉक्टर चुनें',
    main_complaint: 'मुख्य शिकायत / लक्षण',
    consult_ph: 'आप क्या महसूस कर रहे हैं, बताएं...',
    urgency_level: 'जरूरी स्तर',
    urgency_low: '🟢 कम – सामान्य जाँच',
    urgency_medium: '🟡 मध्यम – जल्द ध्यान चाहिए',
    urgency_high: '🔴 अत्यधिक – तुरंत / आपात स्थिति',
    send_request: '📤 अनुरोध भेजें',
    sending: 'भेज रहे हैं...',
    my_consultations: '📋 मेरे परामर्श',
    active_consult_msg: 'आपके परामर्श के लिए उपलब्ध हैं',
    join_call_now: '📞 अभी कॉल में शामिल हों',
    join_call: '📞 कॉल में शामिल हों',

    health_records: '📋 स्वास्थ्य रिकॉर्ड',
    rx_history: 'प्रिस्क्रिप्शन और लक्षण इतिहास',
    prescriptions: '💊 प्रिस्क्रिप्शन',
    no_prescriptions: 'अभी कोई प्रिस्क्रिप्शन नहीं',
    offline_history: '🗂️ ऑफलाइन लक्षण इतिहास',
    no_symptom_checks: 'कोई सहेजा गया लक्षण जाँच नहीं',

    your_health_qr: '📱 आपका स्वास्थ्य QR कोड',
    show_to_doctor: 'यह अपने डॉक्टर या फार्मेसी को दिखाएं',
    scan_to_access: 'स्कैन करके अपनी प्रोफाइल एक्सेस करें',

    patient_queue: 'मरीज़ कतार',
    pending_requests: 'लंबित परामर्श अनुरोध',
    pending: 'लंबित', active: 'सक्रिय', done_today: 'आज पूर्ण',
    active_session: '🔴 सक्रिय सत्र',
    rejoin_call: '📞 कॉल में वापस जाएं',
    no_active_consult: 'कोई सक्रिय परामर्श नहीं',
    view_queue: 'कतार देखें',
    consult_history: 'परामर्श इतिहास',
    no_completed: 'अभी कोई पूर्ण परामर्श नहीं',
    queue_empty: '🎉 कतार खाली है! कोई अनुरोध नहीं।',
    accept_start: '✅ स्वीकार करें और कॉल शुरू करें',

    write_prescription: '💊 प्रिस्क्रिप्शन लिखें',
    select_consult: 'परामर्श चुनें',
    medicines: 'दवाइयाँ',
    medicine_name_ph: 'दवाई का नाम',
    dosage_ph: 'खुराक',
    duration_ph: 'अवधि',
    add_medicine: '+ दवाई जोड़ें',
    doctor_notes_label: 'डॉक्टर के नोट्स / सलाह',
    notes_ph: 'आराम, खानपान सलाह, अनुवर्ती निर्देश...',
    next_visit: 'अगली मुलाकात की तारीख',
    send_prescription: '📋 प्रिस्क्रिप्शन भेजें',
    quick_templates: '⚡ त्वरित टेम्पलेट',
    rx_sent: 'प्रिस्क्रिप्शन मरीज़ को भेज दी गई!',
    select_consult_err: 'कृपया पहले एक परामर्श चुनें',
    add_medicine_err: 'कम से कम एक दवाई का नाम डालें',

    scan_patient_qr: '📷 मरीज़ का QR स्कैन करें',
    point_camera: 'मरीज़ के स्वास्थ्य QR कोड पर कैमरा लगाएं',
    or_upload_qr: '— या QR इमेज अपलोड करें —',
    patient_info: '🆔 मरीज़ की जानकारी',
    scanned_via_qr: 'QR से स्कैन किया',
    view_their_consults: 'उनके परामर्श देखें →',

    consultation_room: 'परामर्श',
    weak_signal_title: '⚠️ कमज़ोर सिग्नल',
    weak_signal_msg: 'संवाद के लिए वॉइस संदेश या चैट उपयोग करें।',
    voice_message: '🎙️ वॉइस संदेश',
    recording: '● रिकॉर्ड हो रहा है...',
    record_btn: '🎙️ वॉइस संदेश रिकॉर्ड करें',
    stop_recording: '⏹️ रिकॉर्डिंग रोकें',
    saved_recordings: '📼 सहेजी गई रिकॉर्डिंग',
    no_recordings: 'अभी कोई रिकॉर्डिंग नहीं',
    end_session: '📵 सत्र समाप्त करें',
    chat: '💬 चैट',
    chat_ph: 'संदेश लिखें और Enter दबाएं...',
    clinical_notes: '🩺 नैदानिक नोट्स',
    clinical_notes_ph: 'जाँच निष्कर्ष, निदान, सलाह...',
    call_patient: '📞 मरीज़ को कॉल करें',
    patient_room_label: 'मरीज़ रूम ID:',
    start_call: '📞 वीडियो/ऑडियो कॉल शुरू करें',
    your_room_id: '🔗 आपका रूम ID',
    waiting_doctor: 'डॉक्टर की कॉल का इंतज़ार...',
    no_msg_yet: 'अभी कोई संदेश नहीं। नमस्ते कहें! 👋',
    write_rx: '💊 प्रिस्क्रिप्शन लिखें',

    find_medicines: '💊 दवाइयाँ खोजें',
    pharmacy_subtitle: 'सभी नज़दीकी फार्मेसी में खोजें',
    search_med_ph: 'दवाई का नाम खोजें (जैसे पैरासिटामोल)...',
    nearby_pharmacies: '📍 नज़दीकी फार्मेसी',
    update_stock: '📦 स्टॉक अपडेट करें',
    for_pharmacy_owners: 'फार्मेसी मालिकों के लिए',
    in_stock: '✅ उपलब्ध',
    out_of_stock: '❌ उपलब्ध नहीं',
    update_stock_btn: '📤 स्टॉक अपडेट करें',

    sign_in: 'साइन इन', register: 'पंजीकरण',
    phone_number: '📱 फ़ोन नंबर',
    password_label: '🔒 पासवर्ड',
    full_name: '👤 पूरा नाम',
    village_town: '🏘️ गाँव / शहर',
    age_label: '🎂 उम्र',
    i_am_a: '👥 मैं हूँ',
    role_patient: 'मरीज़',
    role_doctor: 'डॉक्टर / स्वास्थ्यकर्मी',
    role_pharmacy: 'फार्मेसी मालिक',
    create_account: 'खाता बनाएं →',
    sign_in_btn: 'साइन इन →',
    demo_creds: 'डेमो क्रेडेंशियल:',
    patient_demo: '👤 मरीज़ डेमो',
    doctor_demo: '👨‍⚕️ डॉक्टर डेमो',
    err_fill_all: 'कृपया सभी फ़ील्ड भरें',
    err_phone: 'कृपया 10 अंकों का वैध फ़ोन नंबर दर्ज करें',
    err_password: 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए',
  },

  // ─── MARATHI ───────────────────────────────────────────────────────────────
  mr: {
    logout: 'लॉग आउट', loading: 'लोड होत आहे...', close: 'बंद करा',
    cancel: 'रद्द करा', send: 'पाठवा', search: 'शोधा',
    view: 'पहा', back: 'मागे', yes: 'हो', no: 'नाही',

    offline_banner: '📵 ऑफलाइन – ॲप मर्यादित वैशिष्ट्यांसह काम करते',
    conn_good: '📶 चांगले कनेक्शन – व्हिडिओ कॉल उपलब्ध',
    conn_medium: '📶 मध्यम सिग्नल – केवळ ऑडिओ मोड',
    conn_poor: '⚠️ कमकुवत सिग्नल – केवळ व्हॉइस आणि चॅट',
    conn_offline: '📵 ऑफलाइन – ऑनलाइन आल्यावर चॅट सिंक होईल',
    conn_checking: '🔄 कनेक्शन तपासत आहे...',

    tab_home: 'मुख्यपृष्ठ', tab_symptoms: 'लक्षणे', tab_consult: 'सल्ला',
    tab_records: 'नोंदी', tab_pharmacy: 'फार्मसी',
    tab_queue: 'रांग', tab_active: 'सक्रिय',
    tab_history: 'इतिहास', tab_prescribe: 'प्रिस्क्रिप्शन',
    tab_search: 'शोध', tab_nearby: 'जवळील', tab_update: 'अपडेट',

    how_feeling: 'आज तुम्हाला कसे वाटत आहे?',
    check_symptoms: 'लक्षणे तपासा',
    ai_offline: 'AI-आधारित • ऑफलाइन',
    talk_to_doctor: 'डॉक्टरशी बोला',
    book_consultation: 'सल्ला बुक करा',
    recent_consultations: '📅 अलीकडील सल्ले',
    pending_offline: '⏳ प्रलंबित (ऑफलाइन)',
    offline_queue_msg: 'इंटरनेट आल्यावर हे अनुरोध पाठवले जातील.',
    sync_now: '🔄 आत्ता सिंक करा',
    no_consults_yet: 'अद्याप कोणताही सल्ला नाही.',
    book_one_now: 'आत्ता बुक करा',
    greeting_morning: 'सुप्रभात', greeting_afternoon: 'नमस्कार', greeting_evening: 'शुभ संध्याकाळ',

    ai_symptom_checker: '🩺 AI लक्षण तपासक',
    works_no_internet: 'इंटरनेटशिवाय काम करते • डॉक्टरांचा पर्याय नाही',
    describe_symptoms: 'तुमची लक्षणे तपशीलवार सांगा',
    symptom_ph: 'उदा. 2 दिवसांपासून ताप, डोकेदुखी आणि अंगदुखी आहे...',
    common_symptoms: 'सामान्य लक्षणे (निवडण्यासाठी टॅप करा)',
    how_long: 'ही लक्षणे किती दिवसांपासून आहेत?',
    duration_today: 'आज सुरू झाले', duration_2_3: '2-3 दिवस',
    duration_1week: 'सुमारे एक आठवडा', duration_more: 'एक आठवड्यापेक्षा जास्त',
    analyze_btn: '🔍 लक्षणे विश्लेषण करा',
    want_doctor: '💬 डॉक्टरशी बोलायचे आहे का?',
    doctor_review_msg: 'आमचे डॉक्टर तुमची लक्षणे पाहून योग्य निदान देऊ शकतात.',
    book_consult_btn: 'सल्ला बुक करा →',
    input_hint: 'तुम्ही मराठीत टाइप करू शकता',

    book_consult_title: '👨‍⚕️ सल्ला बुक करा',
    connect_doctors: 'उपलब्ध डॉक्टरांशी जोडा',
    new_request: '📝 नवीन सल्ला विनंती',
    select_doctor: 'डॉक्टर निवडा',
    main_complaint: 'मुख्य तक्रार / लक्षणे',
    consult_ph: 'तुम्हाला काय वाटत आहे ते सांगा...',
    urgency_level: 'तातडी पातळी',
    urgency_low: '🟢 कमी – नियमित तपासणी',
    urgency_medium: '🟡 मध्यम – लवकर लक्ष हवे',
    urgency_high: '🔴 उच्च – तातडीचे / आणीबाणी',
    send_request: '📤 विनंती पाठवा',
    sending: 'पाठवत आहे...',
    my_consultations: '📋 माझे सल्ले',
    active_consult_msg: 'तुमच्या सल्ल्यासाठी उपलब्ध आहेत',
    join_call_now: '📞 आत्ता कॉलमध्ये सामील व्हा',
    join_call: '📞 कॉलमध्ये सामील व्हा',

    health_records: '📋 आरोग्य नोंदी',
    rx_history: 'प्रिस्क्रिप्शन आणि लक्षण इतिहास',
    prescriptions: '💊 प्रिस्क्रिप्शन',
    no_prescriptions: 'अद्याप कोणतेही प्रिस्क्रिप्शन नाही',
    offline_history: '🗂️ ऑफलाइन लक्षण इतिहास',
    no_symptom_checks: 'कोणतीही जतन केलेली लक्षण तपासणी नाही',

    your_health_qr: '📱 तुमचा आरोग्य QR कोड',
    show_to_doctor: 'हे तुमच्या डॉक्टर किंवा फार्मसीला दाखवा',
    scan_to_access: 'स्कॅन करून तुमची प्रोफाइल अॅक्सेस करा',

    patient_queue: 'रुग्ण रांग',
    pending_requests: 'प्रलंबित सल्ला विनंत्या',
    pending: 'प्रलंबित', active: 'सक्रिय', done_today: 'आज पूर्ण',
    active_session: '🔴 सक्रिय सत्र',
    rejoin_call: '📞 कॉलमध्ये परत या',
    no_active_consult: 'कोणताही सक्रिय सल्ला नाही',
    view_queue: 'रांग पहा',
    consult_history: 'सल्ला इतिहास',
    no_completed: 'अद्याप कोणताही पूर्ण सल्ला नाही',
    queue_empty: '🎉 रांग रिकामी आहे! कोणत्याही विनंत्या नाहीत.',
    accept_start: '✅ स्वीकारा आणि कॉल सुरू करा',

    write_prescription: '💊 प्रिस्क्रिप्शन लिहा',
    select_consult: 'सल्ला निवडा',
    medicines: 'औषधे',
    medicine_name_ph: 'औषधाचे नाव',
    dosage_ph: 'मात्रा',
    duration_ph: 'कालावधी',
    add_medicine: '+ औषध जोडा',
    doctor_notes_label: 'डॉक्टरांच्या नोट्स / सल्ला',
    notes_ph: 'विश्रांती, आहार सल्ला, पुढील सूचना...',
    next_visit: 'पुढील भेटीची तारीख',
    send_prescription: '📋 प्रिस्क्रिप्शन पाठवा',
    quick_templates: '⚡ जलद टेम्पलेट',
    rx_sent: 'प्रिस्क्रिप्शन रुग्णाला पाठवली!',
    select_consult_err: 'कृपया प्रथम एक सल्ला निवडा',
    add_medicine_err: 'किमान एका औषधाचे नाव टाका',

    scan_patient_qr: '📷 रुग्णाचा QR स्कॅन करा',
    point_camera: 'रुग्णाच्या आरोग्य QR कोडवर कॅमेरा ठेवा',
    or_upload_qr: '— किंवा QR इमेज अपलोड करा —',
    patient_info: '🆔 रुग्ण माहिती',
    scanned_via_qr: 'QR द्वारे स्कॅन केले',
    view_their_consults: 'त्यांचे सल्ले पहा →',

    consultation_room: 'सल्ला',
    weak_signal_title: '⚠️ कमकुवत सिग्नल',
    weak_signal_msg: 'संवादासाठी व्हॉइस संदेश किंवा चॅट वापरा.',
    voice_message: '🎙️ व्हॉइस संदेश',
    recording: '● रेकॉर्ड होत आहे...',
    record_btn: '🎙️ व्हॉइस संदेश रेकॉर्ड करा',
    stop_recording: '⏹️ रेकॉर्डिंग थांबवा',
    saved_recordings: '📼 जतन केलेल्या रेकॉर्डिंग',
    no_recordings: 'अद्याप कोणत्याही रेकॉर्डिंग नाहीत',
    end_session: '📵 सत्र संपवा',
    chat: '💬 चॅट',
    chat_ph: 'संदेश टाइप करा आणि Enter दाबा...',
    clinical_notes: '🩺 नैदानिक नोट्स',
    clinical_notes_ph: 'तपासणी निष्कर्ष, निदान, सल्ला...',
    call_patient: '📞 रुग्णाला कॉल करा',
    patient_room_label: 'रुग्ण रूम ID:',
    start_call: '📞 व्हिडिओ/ऑडिओ कॉल सुरू करा',
    your_room_id: '🔗 तुमचा रूम ID',
    waiting_doctor: 'डॉक्टरांच्या कॉलची वाट पाहत आहे...',
    no_msg_yet: 'अद्याप कोणताही संदेश नाही. नमस्कार म्हणा! 👋',
    write_rx: '💊 प्रिस्क्रिप्शन लिहा',

    find_medicines: '💊 औषधे शोधा',
    pharmacy_subtitle: 'सर्व जवळील फार्मसींमध्ये शोधा',
    search_med_ph: 'औषधाचे नाव शोधा (उदा. पॅरासिटामॉल)...',
    nearby_pharmacies: '📍 जवळील फार्मसी',
    update_stock: '📦 स्टॉक अपडेट करा',
    for_pharmacy_owners: 'फार्मसी मालकांसाठी',
    in_stock: '✅ उपलब्ध',
    out_of_stock: '❌ उपलब्ध नाही',
    update_stock_btn: '📤 स्टॉक अपडेट करा',

    sign_in: 'साइन इन', register: 'नोंदणी',
    phone_number: '📱 फोन नंबर',
    password_label: '🔒 पासवर्ड',
    full_name: '👤 पूर्ण नाव',
    village_town: '🏘️ गाव / शहर',
    age_label: '🎂 वय',
    i_am_a: '👥 मी आहे',
    role_patient: 'रुग्ण',
    role_doctor: 'डॉक्टर / आरोग्यकर्मी',
    role_pharmacy: 'फार्मसी मालक',
    create_account: 'खाते बनवा →',
    sign_in_btn: 'साइन इन →',
    demo_creds: 'डेमो क्रेडेंशियल:',
    patient_demo: '👤 रुग्ण डेमो',
    doctor_demo: '👨‍⚕️ डॉक्टर डेमो',
    err_fill_all: 'कृपया सर्व फील्ड भरा',
    err_phone: 'कृपया 10 अंकी वैध फोन नंबर प्रविष्ट करा',
    err_password: 'पासवर्ड किमान 6 अक्षरांचा असावा',
  },

  // ─── BENGALI ───────────────────────────────────────────────────────────────
  bn: {
    logout: 'লগ আউট', loading: 'লোড হচ্ছে...', close: 'বন্ধ করুন',
    cancel: 'বাতিল', send: 'পাঠান', search: 'খুঁজুন',
    view: 'দেখুন', back: 'ফিরে যান', yes: 'হ্যাঁ', no: 'না',

    offline_banner: '📵 অফলাইন – অ্যাপ সীমিত সুবিধা নিয়ে কাজ করছে',
    conn_good: '📶 ভালো সংযোগ – ভিডিও কল উপলব্ধ',
    conn_medium: '📶 মাঝারি সংকেত – শুধু অডিও মোড',
    conn_poor: '⚠️ দুর্বল সংকেত – শুধু ভয়েস ও চ্যাট',
    conn_offline: '📵 অফলাইন – অনলাইন হলে চ্যাট সিঙ্ক হবে',
    conn_checking: '🔄 সংযোগ পরীক্ষা করছে...',

    tab_home: 'হোম', tab_symptoms: 'লক্ষণ', tab_consult: 'পরামর্শ',
    tab_records: 'রেকর্ড', tab_pharmacy: 'ফার্মেসি',
    tab_queue: 'সারি', tab_active: 'সক্রিয়',
    tab_history: 'ইতিহাস', tab_prescribe: 'প্রেসক্রিপশন',
    tab_search: 'অনুসন্ধান', tab_nearby: 'কাছাকাছি', tab_update: 'আপডেট',

    how_feeling: 'আজ আপনি কেমন অনুভব করছেন?',
    check_symptoms: 'লক্ষণ পরীক্ষা করুন',
    ai_offline: 'AI-চালিত • অফলাইন',
    talk_to_doctor: 'ডাক্তারের সাথে কথা বলুন',
    book_consultation: 'পরামর্শ বুক করুন',
    recent_consultations: '📅 সাম্প্রতিক পরামর্শ',
    pending_offline: '⏳ অপেক্ষমান (অফলাইন)',
    offline_queue_msg: 'ইন্টারনেট ফিরলে এই অনুরোধগুলো পাঠানো হবে।',
    sync_now: '🔄 এখন সিঙ্ক করুন',
    no_consults_yet: 'এখনো কোনো পরামর্শ নেই।',
    book_one_now: 'এখন বুক করুন',
    greeting_morning: 'সুপ্রভাত', greeting_afternoon: 'নমস্কার', greeting_evening: 'শুভ সন্ধ্যা',

    ai_symptom_checker: '🩺 AI লক্ষণ পরীক্ষক',
    works_no_internet: 'ইন্টারনেট ছাড়াই কাজ করে • ডাক্তারের বিকল্প নয়',
    describe_symptoms: 'আপনার লক্ষণগুলো বিস্তারিত বর্ণনা করুন',
    symptom_ph: 'যেমন: ২ দিন ধরে জ্বর, মাথাব্যথা এবং শরীর ব্যথা...',
    common_symptoms: 'সাধারণ লক্ষণ (বেছে নিতে ট্যাপ করুন)',
    how_long: 'এই লক্ষণগুলো কতদিন ধরে আছে?',
    duration_today: 'আজ শুরু হয়েছে', duration_2_3: '২-৩ দিন',
    duration_1week: 'প্রায় এক সপ্তাহ', duration_more: 'এক সপ্তাহের বেশি',
    analyze_btn: '🔍 লক্ষণ বিশ্লেষণ করুন',
    want_doctor: '💬 ডাক্তারের সাথে কথা বলতে চান?',
    doctor_review_msg: 'আমাদের ডাক্তাররা আপনার লক্ষণ দেখে সঠিক নির্ণয় করতে পারবেন।',
    book_consult_btn: 'পরামর্শ বুক করুন →',
    input_hint: 'আপনি বাংলায় টাইপ করতে পারেন',

    book_consult_title: '👨‍⚕️ পরামর্শ বুক করুন',
    connect_doctors: 'উপলব্ধ ডাক্তারদের সাথে সংযুক্ত হন',
    new_request: '📝 নতুন পরামর্শ অনুরোধ',
    select_doctor: 'ডাক্তার বেছে নিন',
    main_complaint: 'প্রধান অভিযোগ / লক্ষণ',
    consult_ph: 'আপনি কী অনুভব করছেন বর্ণনা করুন...',
    urgency_level: 'জরুরি স্তর',
    urgency_low: '🟢 কম – নিয়মিত পরীক্ষা',
    urgency_medium: '🟡 মাঝারি – শীঘ্রই মনোযোগ দরকার',
    urgency_high: '🔴 উচ্চ – জরুরি / আপৎকালীন',
    send_request: '📤 অনুরোধ পাঠান',
    sending: 'পাঠানো হচ্ছে...',
    my_consultations: '📋 আমার পরামর্শ',
    active_consult_msg: 'আপনার পরামর্শের জন্য উপলব্ধ',
    join_call_now: '📞 এখন কলে যোগ দিন',
    join_call: '📞 কলে যোগ দিন',

    health_records: '📋 স্বাস্থ্য রেকর্ড',
    rx_history: 'প্রেসক্রিপশন ও লক্ষণ ইতিহাস',
    prescriptions: '💊 প্রেসক্রিপশন',
    no_prescriptions: 'এখনো কোনো প্রেসক্রিপশন নেই',
    offline_history: '🗂️ অফলাইন লক্ষণ ইতিহাস',
    no_symptom_checks: 'কোনো সংরক্ষিত লক্ষণ পরীক্ষা নেই',

    your_health_qr: '📱 আপনার স্বাস্থ্য QR কোড',
    show_to_doctor: 'এটি আপনার ডাক্তার বা ফার্মেসিকে দেখান',
    scan_to_access: 'স্ক্যান করে আপনার প্রোফাইল অ্যাক্সেস করুন',

    patient_queue: 'রোগী সারি',
    pending_requests: 'অপেক্ষমান পরামর্শ অনুরোধ',
    pending: 'অপেক্ষমান', active: 'সক্রিয়', done_today: 'আজ সম্পন্ন',
    active_session: '🔴 সক্রিয় সেশন',
    rejoin_call: '📞 কলে ফিরে যান',
    no_active_consult: 'কোনো সক্রিয় পরামর্শ নেই',
    view_queue: 'সারি দেখুন',
    consult_history: 'পরামর্শ ইতিহাস',
    no_completed: 'এখনো কোনো সম্পন্ন পরামর্শ নেই',
    queue_empty: '🎉 সারি খালি! কোনো অনুরোধ নেই।',
    accept_start: '✅ গ্রহণ করুন এবং কল শুরু করুন',

    write_prescription: '💊 প্রেসক্রিপশন লিখুন',
    select_consult: 'পরামর্শ বেছে নিন',
    medicines: 'ওষুধ',
    medicine_name_ph: 'ওষুধের নাম',
    dosage_ph: 'মাত্রা',
    duration_ph: 'সময়কাল',
    add_medicine: '+ ওষুধ যোগ করুন',
    doctor_notes_label: 'ডাক্তারের নোট / পরামর্শ',
    notes_ph: 'বিশ্রাম, খাদ্য পরামর্শ, পরবর্তী নির্দেশনা...',
    next_visit: 'পরবর্তী ভিজিটের তারিখ',
    send_prescription: '📋 প্রেসক্রিপশন পাঠান',
    quick_templates: '⚡ দ্রুত টেমপ্লেট',
    rx_sent: 'প্রেসক্রিপশন রোগীকে পাঠানো হয়েছে!',
    select_consult_err: 'অনুগ্রহ করে প্রথমে একটি পরামর্শ বেছে নিন',
    add_medicine_err: 'অন্তত একটি ওষুধের নাম দিন',

    scan_patient_qr: '📷 রোগীর QR স্ক্যান করুন',
    point_camera: 'রোগীর স্বাস্থ্য QR কোডে ক্যামেরা তাক করুন',
    or_upload_qr: '— অথবা QR ছবি আপলোড করুন —',
    patient_info: '🆔 রোগীর তথ্য',
    scanned_via_qr: 'QR দিয়ে স্ক্যান করা হয়েছে',
    view_their_consults: 'তাদের পরামর্শ দেখুন →',

    consultation_room: 'পরামর্শ',
    weak_signal_title: '⚠️ দুর্বল সংকেত',
    weak_signal_msg: 'যোগাযোগের জন্য ভয়েস বার্তা বা চ্যাট ব্যবহার করুন।',
    voice_message: '🎙️ ভয়েস বার্তা',
    recording: '● রেকর্ড হচ্ছে...',
    record_btn: '🎙️ ভয়েস বার্তা রেকর্ড করুন',
    stop_recording: '⏹️ রেকর্ডিং থামান',
    saved_recordings: '📼 সংরক্ষিত রেকর্ডিং',
    no_recordings: 'এখনো কোনো রেকর্ডিং নেই',
    end_session: '📵 সেশন শেষ করুন',
    chat: '💬 চ্যাট',
    chat_ph: 'বার্তা টাইপ করুন এবং Enter চাপুন...',
    clinical_notes: '🩺 ক্লিনিকাল নোট',
    clinical_notes_ph: 'পরীক্ষার ফলাফল, রোগ নির্ণয়, পরামর্শ...',
    call_patient: '📞 রোগীকে কল করুন',
    patient_room_label: 'রোগী রুম ID:',
    start_call: '📞 ভিডিও/অডিও কল শুরু করুন',
    your_room_id: '🔗 আপনার রুম ID',
    waiting_doctor: 'ডাক্তারের কলের অপেক্ষায়...',
    no_msg_yet: 'এখনো কোনো বার্তা নেই। হ্যালো বলুন! 👋',
    write_rx: '💊 প্রেসক্রিপশন লিখুন',

    find_medicines: '💊 ওষুধ খুঁজুন',
    pharmacy_subtitle: 'সব কাছাকাছি ফার্মেসিতে খুঁজুন',
    search_med_ph: 'ওষুধের নাম খুঁজুন (যেমন প্যারাসিটামল)...',
    nearby_pharmacies: '📍 কাছাকাছি ফার্মেসি',
    update_stock: '📦 স্টক আপডেট করুন',
    for_pharmacy_owners: 'ফার্মেসি মালিকদের জন্য',
    in_stock: '✅ উপলব্ধ',
    out_of_stock: '❌ উপলব্ধ নয়',
    update_stock_btn: '📤 স্টক আপডেট করুন',

    sign_in: 'সাইন ইন', register: 'নিবন্ধন',
    phone_number: '📱 ফোন নম্বর',
    password_label: '🔒 পাসওয়ার্ড',
    full_name: '👤 পুরো নাম',
    village_town: '🏘️ গ্রাম / শহর',
    age_label: '🎂 বয়স',
    i_am_a: '👥 আমি',
    role_patient: 'রোগী',
    role_doctor: 'ডাক্তার / স্বাস্থ্যকর্মী',
    role_pharmacy: 'ফার্মেসি মালিক',
    create_account: 'অ্যাকাউন্ট তৈরি করুন →',
    sign_in_btn: 'সাইন ইন →',
    demo_creds: 'ডেমো ক্রেডেনশিয়াল:',
    patient_demo: '👤 রোগী ডেমো',
    doctor_demo: '👨‍⚕️ ডাক্তার ডেমো',
    err_fill_all: 'অনুগ্রহ করে সব ক্ষেত্র পূরণ করুন',
    err_phone: 'অনুগ্রহ করে বৈধ ১০ সংখ্যার ফোন নম্বর দিন',
    err_password: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে',
  },

  // ─── TAMIL ─────────────────────────────────────────────────────────────────
  ta: {
    logout: 'வெளியேறு', loading: 'ஏற்றுகிறது...', close: 'மூடு',
    cancel: 'ரத்து', send: 'அனுப்பு', search: 'தேடு',
    view: 'பார்', back: 'திரும்பு', yes: 'ஆம்', no: 'இல்லை',

    offline_banner: '📵 ஆஃப்லைன் – ஆப் மட்டுப்படுத்தப்பட்ட அம்சங்களுடன் இயங்குகிறது',
    conn_good: '📶 நல்ல இணைப்பு – வீடியோ அழைப்பு கிடைக்கும்',
    conn_medium: '📶 நடுத்தர சிக்னல் – ஆடியோ மட்டுமே',
    conn_poor: '⚠️ பலவீனமான சிக்னல் – குரல் செய்தி & அரட்டை மட்டுமே',
    conn_offline: '📵 ஆஃப்லைன் – ஆன்லைனில் அரட்டை ஒத்திசைக்கும்',
    conn_checking: '🔄 இணைப்பு சரிபார்க்கிறது...',

    tab_home: 'முகப்பு', tab_symptoms: 'அறிகுறிகள்', tab_consult: 'ஆலோசனை',
    tab_records: 'பதிவுகள்', tab_pharmacy: 'மருந்தகம்',
    tab_queue: 'வரிசை', tab_active: 'செயலில்',
    tab_history: 'வரலாறு', tab_prescribe: 'மருந்துச்சீட்டு',
    tab_search: 'தேடல்', tab_nearby: 'அருகில்', tab_update: 'புதுப்பி',

    how_feeling: 'இன்று உங்களுக்கு எப்படி இருக்கிறது?',
    check_symptoms: 'அறிகுறிகளை சரிபார்',
    ai_offline: 'AI-இயக்கப்பட்டது • ஆஃப்லைன்',
    talk_to_doctor: 'மருத்துவரிடம் பேசு',
    book_consultation: 'ஆலோசனை பதிவு',
    recent_consultations: '📅 சமீபத்திய ஆலோசனைகள்',
    pending_offline: '⏳ நிலுவையில் (ஆஃப்லைன்)',
    offline_queue_msg: 'இணையம் வரும்போது இவை அனுப்பப்படும்.',
    sync_now: '🔄 இப்போது ஒத்திசை',
    no_consults_yet: 'இன்னும் ஆலோசனை இல்லை.',
    book_one_now: 'இப்போது பதிவு செய்',
    greeting_morning: 'காலை வணக்கம்', greeting_afternoon: 'மதிய வணக்கம்', greeting_evening: 'மாலை வணக்கம்',

    ai_symptom_checker: '🩺 AI அறிகுறி சரிபார்ப்பி',
    works_no_internet: 'இணையம் இல்லாமல் இயங்கும் • மருத்துவரின் மாற்றீடு அல்ல',
    describe_symptoms: 'உங்கள் அறிகுறிகளை விரிவாக விவரிக்கவும்',
    symptom_ph: 'எ.கா. 2 நாட்களாக காய்ச்சல், தலைவலி மற்றும் உடல் வலி...',
    common_symptoms: 'பொதுவான அறிகுறிகள் (தேர்ந்தெடுக்க தட்டவும்)',
    how_long: 'இந்த அறிகுறிகள் எவ்வளவு நாட்களாக இருக்கின்றன?',
    duration_today: 'இன்று தொடங்கியது', duration_2_3: '2-3 நாட்கள்',
    duration_1week: 'ஒரு வாரம் சுமார்', duration_more: 'ஒரு வாரத்திற்கு மேல்',
    analyze_btn: '🔍 அறிகுறிகளை பகுப்பாய்வு செய்',
    want_doctor: '💬 மருத்துவரிடம் பேச விரும்புகிறீர்களா?',
    doctor_review_msg: 'எங்கள் மருத்துவர்கள் உங்கள் அறிகுறிகளை பார்த்து சரியான நோய் கண்டறிவை வழங்கலாம்.',
    book_consult_btn: 'ஆலோசனை பதிவு →',
    input_hint: 'நீங்கள் தமிழில் தட்டச்சு செய்யலாம்',

    book_consult_title: '👨‍⚕️ ஆலோசனை பதிவு',
    connect_doctors: 'கிடைக்கும் மருத்துவர்களுடன் இணைக்கவும்',
    new_request: '📝 புதிய ஆலோசனை கோரிக்கை',
    select_doctor: 'மருத்துவரை தேர்ந்தெடு',
    main_complaint: 'முக்கிய புகார் / அறிகுறிகள்',
    consult_ph: 'நீங்கள் என்ன உணர்கிறீர்கள் என்று விவரிக்கவும்...',
    urgency_level: 'அவசர நிலை',
    urgency_low: '🟢 குறைவு – வழக்கமான பரிசோதனை',
    urgency_medium: '🟡 நடுத்தரம் – விரைவில் கவனம் தேவை',
    urgency_high: '🔴 அதிகம் – அவசரம் / அவசரகாலம்',
    send_request: '📤 கோரிக்கை அனுப்பு',
    sending: 'அனுப்புகிறது...',
    my_consultations: '📋 என் ஆலோசனைகள்',
    active_consult_msg: 'உங்கள் ஆலோசனைக்கு கிடைக்கிறார்',
    join_call_now: '📞 இப்போது அழைப்பில் சேரு',
    join_call: '📞 அழைப்பில் சேரு',

    health_records: '📋 சுகாதார பதிவுகள்',
    rx_history: 'மருந்துச்சீட்டு & அறிகுறி வரலாறு',
    prescriptions: '💊 மருந்துச்சீட்டுகள்',
    no_prescriptions: 'இன்னும் மருந்துச்சீட்டு இல்லை',
    offline_history: '🗂️ ஆஃப்லைன் அறிகுறி வரலாறு',
    no_symptom_checks: 'சேமிக்கப்பட்ட அறிகுறி சரிபார்ப்பு இல்லை',

    your_health_qr: '📱 உங்கள் சுகாதார QR குறியீடு',
    show_to_doctor: 'இதை உங்கள் மருத்துவர் அல்லது மருந்தகத்திற்கு காட்டுங்கள்',
    scan_to_access: 'ஸ்கேன் செய்து உங்கள் சுயவிவரத்தை அணுகுங்கள்',

    patient_queue: 'நோயாளி வரிசை',
    pending_requests: 'நிலுவையிலுள்ள ஆலோசனை கோரிக்கைகள்',
    pending: 'நிலுவை', active: 'செயலில்', done_today: 'இன்று முடிந்தது',
    active_session: '🔴 செயல் அமர்வு',
    rejoin_call: '📞 அழைப்பில் மீண்டும் சேரு',
    no_active_consult: 'செயலில் ஆலோசனை இல்லை',
    view_queue: 'வரிசை பார்',
    consult_history: 'ஆலோசனை வரலாறு',
    no_completed: 'இன்னும் முடிந்த ஆலோசனை இல்லை',
    queue_empty: '🎉 வரிசை காலியாக உள்ளது! கோரிக்கைகள் இல்லை.',
    accept_start: '✅ ஏற்று & அழைப்பை தொடங்கு',

    write_prescription: '💊 மருந்துச்சீட்டு எழுது',
    select_consult: 'ஆலோசனை தேர்ந்தெடு',
    medicines: 'மருந்துகள்',
    medicine_name_ph: 'மருந்தின் பெயர்',
    dosage_ph: 'அளவு',
    duration_ph: 'கால அளவு',
    add_medicine: '+ மருந்து சேர்',
    doctor_notes_label: 'மருத்துவரின் குறிப்புகள் / ஆலோசனை',
    notes_ph: 'ஓய்வு, உணவு ஆலோசனை, தொடர்ச்சியான வழிமுறைகள்...',
    next_visit: 'அடுத்த வருகை தேதி',
    send_prescription: '📋 மருந்துச்சீட்டு அனுப்பு',
    quick_templates: '⚡ விரைவு வார்ப்புருக்கள்',
    rx_sent: 'மருந்துச்சீட்டு நோயாளிக்கு அனுப்பப்பட்டது!',
    select_consult_err: 'முதலில் ஒரு ஆலோசனையை தேர்ந்தெடுக்கவும்',
    add_medicine_err: 'குறைந்தது ஒரு மருந்தின் பெயர் சேர்க்கவும்',

    scan_patient_qr: '📷 நோயாளியின் QR ஸ்கேன் செய்',
    point_camera: 'நோயாளியின் சுகாதார QR குறியீட்டில் கேமராவை செலுத்துங்கள்',
    or_upload_qr: '— அல்லது QR படத்தை பதிவேற்றவும் —',
    patient_info: '🆔 நோயாளி தகவல்',
    scanned_via_qr: 'QR மூலம் ஸ்கேன் செய்யப்பட்டது',
    view_their_consults: 'அவர்களின் ஆலோசனைகளை பார்க்கவும் →',

    consultation_room: 'ஆலோசனை',
    weak_signal_title: '⚠️ பலவீனமான சிக்னல்',
    weak_signal_msg: 'தொடர்பு கொள்ள குரல் செய்தி அல்லது அரட்டை பயன்படுத்தவும்.',
    voice_message: '🎙️ குரல் செய்தி',
    recording: '● பதிவு செய்கிறது...',
    record_btn: '🎙️ குரல் செய்தி பதிவு',
    stop_recording: '⏹️ பதிவை நிறுத்து',
    saved_recordings: '📼 சேமிக்கப்பட்ட பதிவுகள்',
    no_recordings: 'இன்னும் பதிவுகள் இல்லை',
    end_session: '📵 அமர்வை முடி',
    chat: '💬 அரட்டை',
    chat_ph: 'செய்தி தட்டச்சு செய்து Enter அழுத்தவும்...',
    clinical_notes: '🩺 மருத்துவ குறிப்புகள்',
    clinical_notes_ph: 'பரிசோதனை கண்டுபிடிப்புகள், நோய் கண்டறிதல், ஆலோசனை...',
    call_patient: '📞 நோயாளியை அழை',
    patient_room_label: 'நோயாளி அறை ID:',
    start_call: '📞 வீடியோ/ஆடியோ அழைப்பை தொடங்கு',
    your_room_id: '🔗 உங்கள் அறை ID',
    waiting_doctor: 'மருத்துவரின் அழைப்பை காத்திருக்கிறது...',
    no_msg_yet: 'இன்னும் செய்திகள் இல்லை. வணக்கம் சொல்லுங்கள்! 👋',
    write_rx: '💊 மருந்துச்சீட்டு எழுது',

    find_medicines: '💊 மருந்துகளை தேடு',
    pharmacy_subtitle: 'அருகிலுள்ள அனைத்து மருந்தகங்களிலும் தேடு',
    search_med_ph: 'மருந்தின் பெயரை தேடு (எ.கா. பாராசிட்டமால்)...',
    nearby_pharmacies: '📍 அருகிலுள்ள மருந்தகங்கள்',
    update_stock: '📦 இருப்பை புதுப்பி',
    for_pharmacy_owners: 'மருந்தக உரிமையாளர்களுக்கு',
    in_stock: '✅ கிடைக்கும்',
    out_of_stock: '❌ கிடைக்காது',
    update_stock_btn: '📤 இருப்பை புதுப்பி',

    sign_in: 'உள்நுழை', register: 'பதிவு',
    phone_number: '📱 தொலைபேசி எண்',
    password_label: '🔒 கடவுச்சொல்',
    full_name: '👤 முழு பெயர்',
    village_town: '🏘️ கிராமம் / நகரம்',
    age_label: '🎂 வயது',
    i_am_a: '👥 நான்',
    role_patient: 'நோயாளி',
    role_doctor: 'மருத்துவர் / சுகாதார பணியாளர்',
    role_pharmacy: 'மருந்தக உரிமையாளர்',
    create_account: 'கணக்கை உருவாக்கு →',
    sign_in_btn: 'உள்நுழை →',
    demo_creds: 'டெமோ நற்சான்றிதழ்:',
    patient_demo: '👤 நோயாளி டெமோ',
    doctor_demo: '👨‍⚕️ மருத்துவர் டெமோ',
    err_fill_all: 'அனைத்து புலங்களையும் நிரப்பவும்',
    err_phone: 'சரியான 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்',
    err_password: 'கடவுச்சொல் குறைந்தது 6 எழுத்துகள் இருக்க வேண்டும்',
  },
};

// ─── i18n Engine ─────────────────────────────────────────────────────────────
const i18n = (() => {
  let currentLang = localStorage.getItem('gh_lang') || 'en';

  function t(key, vars = {}) {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    let str = dict[key] || TRANSLATIONS.en[key] || key;
    // Interpolate {varName}
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(new RegExp(`{${k}}`, 'g'), v);
    });
    return str;
  }

  function setLang(lang) {
    if (!TRANSLATIONS[lang]) return;
    currentLang = lang;
    localStorage.setItem('gh_lang', lang);
    applyToPage();
    updateInputLang(lang);
    updateLangSwitcher();
    // Dispatch event so dashboards can react
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  function getLang() { return currentLang; }

  // Apply data-i18n and data-i18n-ph attributes across the page
  function applyToPage() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      el.placeholder = t(key);
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      el.title = t(key);
    });
    // Update html lang attribute for screen readers
    document.documentElement.lang = LANGS[currentLang]?.inputLang || 'en';
  }

  // Set lang attribute on all text inputs & textareas so mobile keyboards switch
  function updateInputLang(lang) {
    const inputLang = LANGS[lang]?.inputLang || 'en';
    const selectors = 'input[type="text"], input[type="search"], textarea';
    document.querySelectorAll(selectors).forEach(el => {
      // Don't change lang on phone/number/password inputs
      const type = el.getAttribute('type');
      if (type === 'tel' || type === 'number' || type === 'password' || type === 'date') return;
      el.lang = inputLang;
      el.setAttribute('lang', inputLang);
      // On Android Chrome, this hints the keyboard
      el.setAttribute('xml:lang', inputLang);
    });

    // Show/hide input language hint
    document.querySelectorAll('.input-lang-hint').forEach(el => {
      el.textContent = lang !== 'en' ? t('input_hint') : '';
      el.style.display = lang !== 'en' ? 'block' : 'none';
    });
  }

  // Render language switcher into a container element
  function renderSwitcher(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;

    el.innerHTML = `
      <div style="position:relative;display:inline-block;">
        <button id="lang-btn" onclick="i18n.toggleDropdown()"
          style="background:none;border:1.5px solid var(--border);border-radius:20px;padding:4px 10px;
                 font-size:0.8rem;cursor:pointer;display:flex;align-items:center;gap:5px;
                 color:var(--gray-700);white-space:nowrap;">
          <span id="lang-flag">${LANGS[currentLang]?.flag}</span>
          <span id="lang-label">${LANGS[currentLang]?.label}</span>
          <span style="font-size:0.6rem;">▾</span>
        </button>
        <div id="lang-dropdown" style="display:none;position:absolute;right:0;top:calc(100% + 6px);
          background:white;border:1px solid var(--border);border-radius:12px;
          box-shadow:0 8px 24px rgba(0,0,0,0.12);z-index:999;overflow:hidden;min-width:140px;">
          ${Object.entries(LANGS).map(([code, meta]) => `
            <button onclick="i18n.setLang('${code}')"
              style="display:flex;align-items:center;gap:8px;width:100%;padding:10px 14px;
                     background:${code === currentLang ? 'var(--green-50)' : 'none'};
                     border:none;cursor:pointer;font-size:0.85rem;
                     color:${code === currentLang ? 'var(--primary)' : 'var(--gray-800)'};
                     font-weight:${code === currentLang ? '700' : '400'};
                     font-family:'Plus Jakarta Sans',sans-serif;text-align:left;">
              <span>${meta.flag}</span> <span>${meta.label}</span>
              ${code === currentLang ? '<span style="margin-left:auto;">✓</span>' : ''}
            </button>`).join('')}
        </div>
      </div>`;

    // Close dropdown when clicking outside
    document.addEventListener('click', e => {
      if (!el.contains(e.target)) {
        const dd = document.getElementById('lang-dropdown');
        if (dd) dd.style.display = 'none';
      }
    });
  }

  function toggleDropdown() {
    const dd = document.getElementById('lang-dropdown');
    if (dd) dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
  }

  function updateLangSwitcher() {
    const flag = document.getElementById('lang-flag');
    const label = document.getElementById('lang-label');
    if (flag) flag.textContent = LANGS[currentLang]?.flag;
    if (label) label.textContent = LANGS[currentLang]?.label;
    // Refresh dropdown highlight
    const dd = document.getElementById('lang-dropdown');
    if (dd) {
      dd.querySelectorAll('button').forEach(btn => {
        const code = btn.getAttribute('onclick')?.match(/'(\w+)'/)?.[1];
        const isActive = code === currentLang;
        btn.style.background = isActive ? 'var(--green-50)' : 'none';
        btn.style.color = isActive ? 'var(--primary)' : 'var(--gray-800)';
        btn.style.fontWeight = isActive ? '700' : '400';
      });
    }
    // Close dropdown
    const dd2 = document.getElementById('lang-dropdown');
    if (dd2) dd2.style.display = 'none';
  }

  // Auto-init on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    applyToPage();
    updateInputLang(currentLang);
  });

  return { t, setLang, getLang, applyToPage, renderSwitcher, toggleDropdown, updateInputLang };
})();

// Global shorthand
function t(key, vars) { return i18n.t(key, vars); }