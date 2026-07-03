/* ================================================
   SIDEBAR.JS - BioSaúde
   ================================================ */

'use strict';

const Sidebar = (() => {
  let sidebar, navbar, mainContent, overlay, toggleBtn, menuToggle;
  let collapsed = localStorage.getItem('bs_sidebar_collapsed') === 'true';

  function init() {
    sidebar      = document.querySelector('.sidebar');
    navbar       = document.querySelector('.navbar');
    mainContent  = document.querySelector('.main-content');
    overlay      = document.querySelector('.sidebar-overlay');
    toggleBtn    = document.querySelector('.sidebar-toggle');
    menuToggle   = document.querySelector('.menu-toggle');

    if (!sidebar) return;

    // Restore collapsed state
    if (collapsed) collapse(true);

    // Desktop toggle
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggle);
    }

    // Mobile open
    if (menuToggle) {
      menuToggle.addEventListener('click', openMobile);
    }

    // Overlay click closes mobile
    if (overlay) {
      overlay.addEventListener('click', closeMobile);
    }

    // Set active item
    setActive();

    // Nav item click
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', () => {
        if (window.innerWidth <= 1024) closeMobile();
      });
    });

    // Logout button
    const logoutBtn = document.querySelector('[data-action="logout"]');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
  }

  function toggle() {
    collapsed = !collapsed;
    localStorage.setItem('bs_sidebar_collapsed', collapsed);
    if (collapsed) collapse(); else expand();
  }

  function collapse(silent = false) {
    sidebar.classList.add('collapsed');
    navbar?.classList.add('sidebar-collapsed');
    mainContent?.classList.add('sidebar-collapsed');
  }

  function expand() {
    sidebar.classList.remove('collapsed');
    navbar?.classList.remove('sidebar-collapsed');
    mainContent?.classList.remove('sidebar-collapsed');
  }

  function openMobile() {
    sidebar.classList.add('mobile-open');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobile() {
    sidebar.classList.remove('mobile-open');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  function setActive() {
    const page = window.location.pathname.split('/').pop().replace('.html', '');
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.page === page);
    });
  }

  function handleLogout() {
    window.App?.Auth.clear();
    window.location.href = '../pages/login.html';
  }

  // Populate user info in sidebar footer
  function populateUser() {
    const user = window.App?.Auth.getUser();
    if (!user) return;
    const nameEl = document.querySelector('.sidebar-user-name');
    const roleEl = document.querySelector('.sidebar-user-role');
    const avatarEl = document.querySelector('.sidebar .avatar');
    if (nameEl) nameEl.textContent = user.nome || 'Usuário';
    if (roleEl) roleEl.textContent = 'ADM';
    if (avatarEl) avatarEl.textContent = (user.nome || 'U')[0].toUpperCase();
  }

  // Sempre exibe todos os itens admin (sistema exclusivo para ADM)
  function applyRole() {
    document.querySelectorAll('.nav-admin-only').forEach(el => {
      el.style.display = 'flex';
    });
  }

  return { init, toggle, openMobile, closeMobile, populateUser, applyRole };
})();

document.addEventListener('DOMContentLoaded', () => {
  Sidebar.init();
  Sidebar.populateUser();
  Sidebar.applyRole();
});
