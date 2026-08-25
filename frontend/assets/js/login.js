/* ================================================
   LOGIN.JS - BioSaúde
   Autenticação real via API (Express + MySQL)
   ================================================ */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Redirect if already logged in
  if (window.App) window.App.redirectIfLoggedIn();

  const form       = document.getElementById('loginForm');
  const userInput  = document.getElementById('username');
  const passInput  = document.getElementById('password');
  const togglePass = document.getElementById('togglePassword');
  const rememberMe = document.getElementById('rememberMe');
  const submitBtn  = document.getElementById('submitBtn');
  const btnText    = submitBtn?.querySelector('.btn-text');
  const btnSpinner = submitBtn?.querySelector('.spinner');

  // ── Toggle password visibility ──
  togglePass?.addEventListener('click', () => {
    const isText = passInput.type === 'text';
    passInput.type = isText ? 'password' : 'text';
    togglePass.classList.toggle('fa-eye', isText);
    togglePass.classList.toggle('fa-eye-slash', !isText);
  });

  // ── Restore remembered username ──
  const savedUser = localStorage.getItem('bs_remember');
  if (savedUser) {
    userInput.value = savedUser;
    if (rememberMe) rememberMe.checked = true;
  }

  // ── Validation ──
  function validateField(input, errorId, message) {
    const error = document.getElementById(errorId);
    if (!input.value.trim()) {
      input.classList.add('error');
      if (error) { error.textContent = message; error.style.display = 'flex'; }
      return false;
    }
    input.classList.remove('error');
    if (error) error.style.display = 'none';
    return true;
  }

  userInput?.addEventListener('input', () => {
    const err = document.getElementById('usernameError');
    if (userInput.value.trim()) {
      userInput.classList.remove('error');
      if (err) err.style.display = 'none';
    }
  });

  passInput?.addEventListener('input', () => {
    const err = document.getElementById('passwordError');
    if (passInput.value) {
      passInput.classList.remove('error');
      if (err) err.style.display = 'none';
    }
  });

  // ── Set loading state ──
  function setLoading(loading) {
    submitBtn.disabled = loading;
    if (btnText) btnText.style.display = loading ? 'none' : 'inline';
    if (btnSpinner) btnSpinner.style.display = loading ? 'inline-block' : 'none';
  }

  // ── Form submit ──
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const validUser = validateField(userInput, 'usernameError', 'Informe seu usuário ou e-mail');
    const validPass = validateField(passInput, 'passwordError', 'Informe sua senha');
    if (!validUser || !validPass) return;

    setLoading(true);

    try {
      // Chamada real ao backend: POST /api/auth/login (auth.routes.js -> auth.controller.js -> auth.service.js)
      // Feita com fetch() direto (não com App.apiFetch) porque apiFetch trata QUALQUER 401
      // como "sessão expirada" e redireciona para o login — o que quebraria o fluxo de
      // "senha errada" aqui, já que estamos justamente na tela de login.
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userInput.value.trim(),
          senha: passInput.value
        })
      });

      const data = await res.json();

      if (!res.ok) {
        // Backend responde 401 com { message: 'Credenciais inválidas.' }
        // ou 422 com { message: 'Dados inválidos.', issues: [...] } se o e-mail for malformado
        throw new Error(data.message || 'Credenciais inválidas.');
      }

      // data = { token, usuario: { id, name, email, role } }
      // Normaliza para o formato { nome, perfil } que o resto do front-end
      // (app.js, dashboard.js, sidebar.js) já espera, sem precisar tocar nesses arquivos.
      const usuario = {
        id: data.usuario.id,
        nome: data.usuario.name,
        email: data.usuario.email,
        perfil: data.usuario.role // 'ADMIN' | 'USER'
      };

      window.App.Auth.setAuth(data.token, usuario);

      if (rememberMe?.checked) {
        localStorage.setItem('bs_remember', userInput.value.trim());
      } else {
        localStorage.removeItem('bs_remember');
      }

      window.App.Toast.success('Bem-vindo!', `Olá, ${usuario.nome}!`);

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);

    } catch (err) {
      window.App.Toast.error('Erro ao entrar', err.message || 'Credenciais inválidas.');
      setLoading(false);
    }
  });
});