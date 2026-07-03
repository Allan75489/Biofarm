/* ================================================
   DASHBOARD.JS - BioSaúde
   ================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  if (window.App) window.App.requireAuth();

  // ── Populate navbar user ──
  populateNavbarUser();

  // ── Animate stat cards ──
  animateCounters();

  // ── Render charts ──
  renderSalesChart();
  renderCategoryChart();

  // ── Animate progress bars ──
  setTimeout(() => {
    document.querySelectorAll('.progress-fill, .stock-fill').forEach(bar => {
      const width = bar.dataset.width || bar.style.width;
      bar.style.width = '0';
      requestAnimationFrame(() => {
        setTimeout(() => { bar.style.width = width; }, 50);
      });
    });
  }, 200);

  // ── Dropdown menus ──
  initDropdowns();
});

function populateNavbarUser() {
  const user = window.App?.Auth.getUser();
  if (!user) return;
  const nameEl = document.querySelector('.navbar-user-name');
  const roleEl = document.querySelector('.navbar-user-role');
  const avatarEl = document.querySelector('.navbar .avatar');
  if (nameEl) nameEl.textContent = user.nome || 'Usuário';
  if (roleEl) roleEl.textContent = user.perfil || 'Cliente';
  if (avatarEl) avatarEl.textContent = (user.nome || 'U')[0].toUpperCase();
}

function animateCounters() {
  document.querySelectorAll('[data-counter]').forEach(el => {
    const target = parseFloat(el.dataset.counter.replace(/\D/g, ''));
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const isCurrency = el.dataset.currency === 'true';
    let start = 0;
    const duration = 1200;
    const step = target / (duration / 16);

    const tick = () => {
      start += step;
      if (start >= target) {
        el.textContent = prefix + (isCurrency
          ? window.App.Fmt.currency(target)
          : window.App.Fmt.number(Math.round(target))) + suffix;
        return;
      }
      el.textContent = prefix + (isCurrency
        ? window.App.Fmt.currency(Math.round(start))
        : window.App.Fmt.number(Math.round(start))) + suffix;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function renderSalesChart() {
  const canvas = document.getElementById('salesChart');
  if (!canvas) return;

  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const data   = [28000, 35000, 27000, 42000, 38000, 51000, 46000, 58000, 52000, 63000, 71000, 68000];
  const max    = Math.max(...data);

  const bars = canvas.querySelectorAll('.chart-bar');
  bars.forEach((bar, i) => {
    const pct = (data[i] / max) * 100;
    bar.style.height = '0%';
    bar.dataset.value = window.App.Fmt.currency(data[i]);
    bar.setAttribute('data-tooltip', window.App.Fmt.currency(data[i]));

    setTimeout(() => {
      bar.style.height = pct + '%';
    }, i * 60 + 200);
  });
}

function renderCategoryChart() {
  const svg = document.getElementById('categoryDonut');
  if (!svg) return;

  const data = [
    { label: 'Medicamentos', value: 45, color: '#2563EB' },
    { label: 'Perfumaria',   value: 28, color: '#22C55E' },
    { label: 'Higiene',      value: 18, color: '#F59E0B' },
    { label: 'Vitaminas',    value: 9,  color: '#06B6D4' }
  ];

  const cx = 60, cy = 60, r = 50, strokeW = 20;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  const circles = svg.querySelectorAll('.donut-segment');
  circles.forEach((circle, i) => {
    if (!data[i]) return;
    const pct = data[i].value / 100;
    const dash = circumference * pct;
    const gap  = circumference - dash;

    circle.setAttribute('r', r);
    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
    circle.setAttribute('stroke', data[i].color);
    circle.setAttribute('stroke-width', strokeW);
    circle.setAttribute('fill', 'none');
    circle.setAttribute('stroke-dasharray', `${dash} ${gap}`);
    circle.setAttribute('stroke-dashoffset', -offset + circumference * 0.25);
    circle.style.transition = 'stroke-dasharray 1s ease';

    offset += dash;
  });
}

function initDropdowns() {
  document.querySelectorAll('.dropdown').forEach(dd => {
    const trigger = dd.querySelector('[data-dropdown-trigger]') || dd.querySelector('.dropdown-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dd.classList.contains('open');
      document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
      if (!isOpen) dd.classList.add('open');
    });
  });
  document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
  });
}
