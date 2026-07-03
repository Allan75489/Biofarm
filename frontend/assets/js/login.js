/* ================================================
   LOGIN.JS - BioSaúde
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
      // ── Simulação de login (substitua pela chamada real da API) ──
      await new Promise(r => setTimeout(r, 1200));

      // Todos os usuários logados são ADMIN neste sistema
      const fakeUser = {
        id:    1,
        nome:  userInput.value,
        email: userInput.value + '@biosaude.com',
        perfil: 'ADMIN'
      };
      const fakeToken = 'eyJ_FAKE_TOKEN_' + Date.now();

      // ── Real API call example: ──
      // const data = await window.App.apiFetch('/auth/login', {
      //   method: 'POST',
      //   body: JSON.stringify({ login: userInput.value, senha: passInput.value })
      // });
      // window.App.Auth.setAuth(data.token, data.usuario);

      window.App.Auth.setAuth(fakeToken, fakeUser);

      if (rememberMe?.checked) {
        localStorage.setItem('bs_remember', userInput.value);
      } else {
        localStorage.removeItem('bs_remember');
      }

      window.App.Toast.success('Bem-vindo!', `Olá, ${fakeUser.nome}!`);

      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 800);

    } catch (err) {
      window.App.Toast.error('Erro ao entrar', err.message || 'Credenciais inválidas.');
      setLoading(false);
    }
  });
});
