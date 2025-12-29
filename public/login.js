// ============================================
//  ADMIN LOGIN - AUTHENTICATION LOGIC
// ============================================

// Configuration & State
const CONFIG_KEY = 'hotspot_admin_config';
const SESSION_KEY = 'hotspot_admin_session';

// Default admin credentials (stored in Cloudflare KV in production)
const DEFAULT_ADMIN = {
    username: 'admin',
    password: 'admin123' // Should be hashed in production
};

// DOM Elements
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('togglePassword');
const rememberMeCheckbox = document.getElementById('rememberMe');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const toast = document.getElementById('toast');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Check if already logged in
    checkExistingSession();

    // Load remembered username if exists
    loadRememberedCredentials();

    // Setup event listeners
    setupEventListeners();
});

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Login form submission
    loginForm.addEventListener('submit', handleLogin);

    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);

    // Remove error on input
    usernameInput.addEventListener('input', hideError);
    passwordInput.addEventListener('input', hideError);

    // Enter key handling
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
}

// ===== SESSION MANAGEMENT =====
function checkExistingSession() {
    const session = localStorage.getItem(SESSION_KEY);

    if (session) {
        try {
            const sessionData = JSON.parse(session);
            const now = Date.now();

            // Check if session is still valid (24 hours)
            if (sessionData.expiresAt > now) {
                // Redirect to admin dashboard
                showToast('Welcome back!', 'success');
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1000);
            } else {
                // Session expired
                localStorage.removeItem(SESSION_KEY);
            }
        } catch (error) {
            console.error('Session parse error:', error);
            localStorage.removeItem(SESSION_KEY);
        }
    }
}

function createSession(username) {
    const session = {
        username: username,
        loginTime: Date.now(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

// ===== LOGIN HANDLING =====
async function handleLogin(e) {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();
    const rememberMe = rememberMeCheckbox.checked;

    // Basic validation
    if (!username || !password) {
        showError('Please fill in all fields');
        return;
    }

    // Show loading state
    const submitBtn = loginForm.querySelector('.btn-login');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i data-lucide="loader" class="btn-icon animate-spin"></i> Signing in...';
    submitBtn.disabled = true;
    lucide.createIcons();

    try {
        // Authenticate user
        const isValid = await authenticateUser(username, password);

        if (isValid) {
            // Save remember me preference
            if (rememberMe) {
                saveRememberedCredentials(username);
            } else {
                clearRememberedCredentials();
            }

            // Create session
            createSession(username);

            // Show success and redirect
            showToast('Login successful!', 'success');

            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
        } else {
            showError('Invalid username or password');
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            lucide.createIcons();
        }
    } catch (error) {
        console.error('Login error:', error);
        showError('An error occurred. Please try again.');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        lucide.createIcons();
    }
}

// ===== AUTHENTICATION =====
async function authenticateUser(username, password) {
    // In production, this would call a Cloudflare Worker API
    // For now, check against stored credentials or defaults

    try {
        // Try to get custom credentials from localStorage
        const config = localStorage.getItem(CONFIG_KEY);
        let adminCredentials = DEFAULT_ADMIN;

        if (config) {
            const parsedConfig = JSON.parse(config);
            if (parsedConfig.adminCredentials) {
                adminCredentials = parsedConfig.adminCredentials;
            }
        }

        // Simple comparison (should use bcrypt in production)
        return username === adminCredentials.username &&
            password === adminCredentials.password;

    } catch (error) {
        console.error('Authentication error:', error);
        return false;
    }
}

// ===== REMEMBER ME =====
function saveRememberedCredentials(username) {
    localStorage.setItem('hotspot_remember_username', username);
}

function clearRememberedCredentials() {
    localStorage.removeItem('hotspot_remember_username');
}

function loadRememberedCredentials() {
    const rememberedUsername = localStorage.getItem('hotspot_remember_username');

    if (rememberedUsername) {
        usernameInput.value = rememberedUsername;
        rememberMeCheckbox.checked = true;
        passwordInput.focus();
    } else {
        usernameInput.focus();
    }
}

// ===== PASSWORD VISIBILITY =====
function togglePasswordVisibility() {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;

    const icon = togglePasswordBtn.querySelector('i');
    icon.setAttribute('data-lucide', type === 'password' ? 'eye' : 'eye-off');
    lucide.createIcons();
}

// ===== ERROR HANDLING =====
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.add('show');

    // Shake animation
    setTimeout(() => {
        lucide.createIcons();
    }, 10);
}

function hideError() {
    errorMessage.classList.remove('show');
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');

    toastMessage.textContent = message;

    // Update icon based on type
    if (type === 'success') {
        toastIcon.setAttribute('data-lucide', 'check-circle');
        toast.style.borderColor = 'var(--success-color)';
    } else if (type === 'error') {
        toastIcon.setAttribute('data-lucide', 'alert-circle');
        toast.style.borderColor = 'var(--error-color)';
    }

    lucide.createIcons();

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ===== UTILITY: Spin animation for loader =====
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .animate-spin {
        animation: spin 1s linear infinite;
    }
`;
document.head.appendChild(style);
