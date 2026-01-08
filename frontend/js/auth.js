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
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const res = await authAPI.login(email, password);
    
    if (!res.success) {
        document.getElementById('loginError').textContent = res.message;
        return;
    }
    
    token = res.data.access_token;
    localStorage.setItem('token', token);
    showApp();
});

// Register
authUI.registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    const res = await authAPI.register(username, email, password);
    
    if (!res.success) {
        document.getElementById('regError').textContent = res.message;
        return;
    }
    
    // Auto-login after registration
    const loginRes = await authAPI.login(email, password);
    token = loginRes.data.access_token;
    localStorage.setItem('token', token);
    showApp();
});

// Logout
authUI.logoutBtn.addEventListener('click', () => {
    token = null;
    localStorage.removeItem('token');
    authUI.authModal.classList.remove('active');
    authUI.app.classList.add('hidden');
    authUI.loginForm.reset();
    authUI.registerForm.reset();
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
