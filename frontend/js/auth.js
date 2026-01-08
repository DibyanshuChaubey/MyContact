// Auth Module
const authUI = {
  loginForm: document.getElementById('loginForm'),
  registerForm: document.getElementById('registerForm'),
  loginTab: document.getElementById('loginTab'),
  registerTab: document.getElementById('registerTab'),
  authModal: document.getElementById('authModal'),
  app: document.getElementById('app'),
  logoutBtn: document.getElementById('logoutBtn')
};

// Tab switching
authUI.loginTab.addEventListener('click', () => {
  authUI.loginForm.classList.add('active');
  authUI.registerForm.classList.remove('active');
  authUI.loginTab.classList.add('active');
  authUI.registerTab.classList.remove('active');
});

authUI.registerTab.addEventListener('click', () => {
  authUI.registerForm.classList.add('active');
  authUI.loginForm.classList.remove('active');
  authUI.registerTab.classList.add('active');
  authUI.loginTab.classList.remove('active');
});

// Login
authUI.loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn = authUI.loginForm.querySelector('button[type="submit"]');
  try {
    window.setLoading(btn, true, 'Signing in…');
    const res = await authAPI.login(email, password);
    if (!res.success) {
      document.getElementById('loginError').textContent = res.message;
      window.showToast(res.message || 'Login failed', 'error');
      return;
    }
    token = res.data.access_token;
    localStorage.setItem('token', token);
    window.showToast('Welcome back!', 'success');
    showApp();
  } finally {
    window.setLoading(btn, false);
  }
});

// Register
authUI.registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('regUsername').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const btn = authUI.registerForm.querySelector('button[type="submit"]');
  try {
    window.setLoading(btn, true, 'Creating account…');
    const res = await authAPI.register(username, email, password);
    if (!res.success) {
      document.getElementById('regError').textContent = res.message;
      window.showToast(res.message || 'Registration failed', 'error');
      return;
    }
    const loginRes = await authAPI.login(email, password);
    token = loginRes.data.access_token;
    localStorage.setItem('token', token);
    window.showToast('Account ready. You are logged in.', 'success');
    showApp();
  } finally {
    window.setLoading(btn, false);
  }
});

// Logout
authUI.logoutBtn.addEventListener('click', () => {
  token = null;
  localStorage.removeItem('token');
  authUI.authModal.classList.remove('active');
  authUI.app.classList.add('hidden');
  authUI.loginForm.reset();
  authUI.registerForm.reset();
  window.showToast('Logged out', 'info');
});

function showApp() {
  authUI.authModal.classList.add('hidden');
  authUI.app.classList.remove('hidden');
  loadContacts();
}

// Check if already logged in
if (token) {
  showApp();
}
