// ─── GramHealth Core App ───────────────────────────────────────────────────
const API_BASE = window.location.origin + '/api';

// ─── Auth Manager ─────────────────────────────────────────────────────────
const Auth = {
  get token() { return localStorage.getItem('gh_token'); },
  get user() {
    const u = localStorage.getItem('gh_user');
    return u ? JSON.parse(u) : null;
  },
  login(token, user) {
    localStorage.setItem('gh_token', token);
    localStorage.setItem('gh_user', JSON.stringify(user));
  },
  logout() {
    localStorage.removeItem('gh_token');
    localStorage.removeItem('gh_user');
    window.location.href = '/login.html';
  },
  isLoggedIn() { return !!this.token; },
  requireAuth(redirectTo = '/login.html') {
    if (!this.isLoggedIn()) window.location.href = redirectTo;
  },
  // ✅ Updated to include pharmacy role
  redirectIfLoggedIn() {
    if (!this.isLoggedIn()) return;
    const role = this.user?.role;
    if (role === 'doctor') window.location.href = '/doctor-dashboard.html';
    else if (role === 'pharmacy') window.location.href = '/pharmacy-dashboard.html';
    else window.location.href = '/patient-dashboard.html';
  }
};

// ─── API Helper ────────────────────────────────────────────────────────────
const API = {
  async request(endpoint, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (Auth.token) headers['Authorization'] = `Bearer ${Auth.token}`;
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      return data;
    } catch (err) {
      if (!navigator.onLine) throw new Error('You are offline. Data will sync when connection restores.');
      throw err;
    }
  },
  get: (ep) => API.request(ep),
  post: (ep, body) => API.request(ep, { method: 'POST', body: JSON.stringify(body) }),
  patch: (ep, body) => API.request(ep, { method: 'PATCH', body: JSON.stringify(body) })
};

// ─── Toast Notifications ───────────────────────────────────────────────────
const Toast = {
  container: null,
  init() {
    this.container = document.createElement('div');
    this.container.className = 'toast-container';
    document.body.appendChild(this.container);
  },
  show(msg, type = 'info', duration = 3000) {
    if (!this.container) this.init();
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<span>${icons[type] || ''}</span><span>${msg}</span>`;
    this.container.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  },
  success: (msg) => Toast.show(msg, 'success'),
  error: (msg) => Toast.show(msg, 'error'),
  warning: (msg) => Toast.show(msg, 'warning'),
  info: (msg) => Toast.show(msg, 'info')
};

// ─── Offline Queue ─────────────────────────────────────────────────────────
const OfflineQueue = {
  key: 'gh_offline_queue',
  add(item) {
    const q = this.getAll();
    q.push({ ...item, id: Date.now(), timestamp: new Date().toISOString() });
    localStorage.setItem(this.key, JSON.stringify(q));
  },
  getAll() {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  },
  clear() { localStorage.removeItem(this.key); },
  async processQueue() {
    const q = this.getAll();
    if (q.length === 0) return;
    const processed = [];
    for (const item of q) {
      try {
        await API.request(item.endpoint, item.options);
        processed.push(item.id);
        Toast.success(`Queued request synced`);
      } catch (e) { /* keep for next time */ }
    }
    const remaining = q.filter(i => !processed.includes(i.id));
    localStorage.setItem(this.key, JSON.stringify(remaining));
  }
};

// ─── Connection Monitor ────────────────────────────────────────────────────
const ConnectionMonitor = {
  banner: null,
  init() {
    this.banner = document.getElementById('offline-banner');
    window.addEventListener('online', () => {
      this.update(true);
      OfflineQueue.processQueue();
    });
    window.addEventListener('offline', () => this.update(false));
    this.update(navigator.onLine);
  },
  update(online) {
    if (!this.banner) return;
    if (online) this.banner.classList.remove('show');
    else this.banner.classList.add('show');
  }
};

// ─── Local Health Records ──────────────────────────────────────────────────
const HealthRecords = {
  key: 'gh_health_records',
  save(record) {
    const records = this.getAll();
    records.unshift({ ...record, id: Date.now(), savedAt: new Date().toISOString() });
    localStorage.setItem(this.key, JSON.stringify(records.slice(0, 50)));
  },
  getAll() {
    return JSON.parse(localStorage.getItem(this.key) || '[]');
  }
};

// ─── Network Speed Detector ────────────────────────────────────────────────
const NetworkSpeed = {
  level: 'unknown', // 'high' | 'medium' | 'low' | 'offline'
  async detect() {
    if (!navigator.onLine) { this.level = 'offline'; return 'offline'; }
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (conn) {
      const { effectiveType, downlink } = conn;
      if (effectiveType === '4g' && downlink > 2) this.level = 'high';
      else if (effectiveType === '3g' || downlink > 0.5) this.level = 'medium';
      else this.level = 'low';
      return this.level;
    }
    // fallback: time a small fetch
    try {
      const start = Date.now();
      await fetch('/api/health', { cache: 'no-store' });
      const ms = Date.now() - start;
      if (ms < 300) this.level = 'high';
      else if (ms < 1500) this.level = 'medium';
      else this.level = 'low';
    } catch { this.level = 'offline'; }
    return this.level;
  },
  getLabel() {
    const map = {
      high: { label: '📶 Good connection – Video call available', cls: 'conn-good' },
      medium: { label: '📶 Medium connection – Audio call available', cls: 'conn-medium' },
      low: { label: '⚠️ Weak signal – Voice messages only', cls: 'conn-poor' },
      offline: { label: '📵 Offline – Using cached data', cls: 'conn-offline' },
      unknown: { label: '🔄 Checking connection...', cls: 'conn-good' }
    };
    return map[this.level] || map.unknown;
  }
};

// ─── Helpers ───────────────────────────────────────────────────────────────
function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function timeAgo(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function urgencyBadge(level) {
  const map = {
    high: '<span class="badge badge-red">🔴 High</span>',
    medium: '<span class="badge badge-yellow">🟡 Medium</span>',
    low: '<span class="badge badge-green">🟢 Low</span>'
  };
  return map[level] || map.medium;
}

function statusBadge(status) {
  const map = {
    pending: '<span class="badge badge-yellow">⏳ Pending</span>',
    active: '<span class="badge badge-blue">🔵 Active</span>',
    completed: '<span class="badge badge-green">✅ Completed</span>',
    cancelled: '<span class="badge badge-gray">❌ Cancelled</span>'
  };
  return map[status] || '<span class="badge badge-gray">Unknown</span>';
}

// Init on load
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  ConnectionMonitor.init();
});