/* ================================================
   APP.JS - BioSaúde | Core utilities
   ================================================ */

'use strict';

// ── API Config ──
// Prefixo real das rotas da API (ver backend/src/app.js: app.use('/api', routes)).
// O endpoint /health é separado e serve apenas para health check, NÃO faz parte do prefixo da API.
const API_BASE = 'https://biofarm.onrender.com/api';

// ── Auth helpers ──
const Auth = {
  getToken: () => localStorage.getItem('bs_token'),
  getUser:  () => {
    const u = localStorage.getItem('bs_user');
    return u ? JSON.parse(u) : null;
  },
  setAuth: (token, user) => {
    localStorage.setItem('bs_token', token);
    localStorage.setItem('bs_user', JSON.stringify(user));
  },
  clear: () => {
    localStorage.removeItem('bs_token');
    localStorage.removeItem('bs_user');
  },
  isLoggedIn: () => !!localStorage.getItem('bs_token'),
  isAdmin: () => {
    const u = Auth.getUser();
    return u && u.perfil === 'ADMIN';
  }
};

// ── Toast notifications ──
const Toast = {
  container: null,

  init() {
    this.container = document.querySelector('.toast-container');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  },

  show(type, title, message = '', duration = 4000) {
    if (!this.container) this.init();

    const icons = {
      success: 'fa-check-circle',
      error:   'fa-times-circle',
      warning: 'fa-exclamation-triangle',
      info:    'fa-info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <i class="fas ${icons[type] || icons.info} toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        ${message ? `<div class="toast-message">${message}</div>` : ''}
      </div>
      <button class="toast-close"><i class="fas fa-times"></i></button>
    `;

    this.container.appendChild(toast);

    toast.querySelector('.toast-close').addEventListener('click', () => this._remove(toast));

    if (duration > 0) {
      setTimeout(() => this._remove(toast), duration);
    }

    return toast;
  },

  _remove(toast) {
    toast.classList.add('hiding');
    toast.addEventListener('animationend', () => toast.remove());
  },

  success: (title, msg) => Toast.show('success', title, msg),
  error:   (title, msg) => Toast.show('error', title, msg),
  warning: (title, msg) => Toast.show('warning', title, msg),
  info:    (title, msg) => Toast.show('info', title, msg)
};

// ── Modal manager ──
const Modal = {
  open(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    overlay.addEventListener('click', e => {
      if (e.target === overlay) Modal.close(id);
    }, { once: false });
  },

  close(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  },

  closeAll() {
    document.querySelectorAll('.modal-overlay.active').forEach(el => {
      el.classList.remove('active');
    });
    document.body.style.overflow = '';
  }
};

// ── Ripple effect on buttons ──
function addRipple(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  btn.style.setProperty('--ripple-x', `${e.clientX - rect.left - size/2}px`);
  btn.style.setProperty('--ripple-y', `${e.clientY - rect.top - size/2}px`);
  btn.classList.remove('ripple-active');
  void btn.offsetWidth;
  btn.classList.add('ripple-active');
  btn.addEventListener('animationend', () => btn.classList.remove('ripple-active'), { once: true });
}

// ── Format helpers ──
const Fmt = {
  currency: (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v),
  date: (d) => new Date(d).toLocaleDateString('pt-BR'),
  datetime: (d) => new Date(d).toLocaleString('pt-BR'),
  number: (v) => new Intl.NumberFormat('pt-BR').format(v)
};

// ── Debounce ──
function debounce(fn, ms = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

// ── DOM helpers ──
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ── Fetch wrapper ──
async function apiFetch(path, options = {}) {
  const token = Auth.getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
    if (res.status === 401) {
      Auth.clear();
      window.location.href = '../pages/login.html';
      return null;
    }
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Erro na requisição');
    return data;
  } catch (err) {
    console.error('[API Error]', err);
    throw err;
  }
}

// ── Sidebar active page detection ──
function setActiveNavItem() {
  const page = window.location.pathname.split('/').pop().replace('.html', '');
  $$('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.page === page) item.classList.add('active');
  });
}

// ── Guard: redirect to login if not authenticated ──
function requireAuth() {
  if (!Auth.isLoggedIn()) {
    window.location.href = '../pages/login.html';
  }
}

// ── Guard: redirect to dashboard if already logged in ──
function redirectIfLoggedIn() {
  if (Auth.isLoggedIn()) {
    window.location.href = 'dashboard.html';
  }
}

// ── Init buttons ripple ──
function initRipples() {
  $$('.btn').forEach(btn => btn.addEventListener('click', addRipple));
}

// ── Initialize on DOM ready ──
document.addEventListener('DOMContentLoaded', () => {
  Toast.init();
  initRipples();
});

// Export for use in modules
window.App = { Auth, Toast, Modal, Fmt, apiFetch, debounce, $, $$, requireAuth, redirectIfLoggedIn, setActiveNavItem };