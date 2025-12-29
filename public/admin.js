// ============================================
//  ADMIN DASHBOARD - Management & Security
// ============================================

// Constants
const CONFIG_KEY = 'hotspot_admin_config';
const SESSION_KEY = 'hotspot_admin_session';
const LOGS_KEY = 'hotspot_send_logs';

// Global state
let currentConfig = null;

// DOM Elements
const logoutBtn = document.getElementById('logoutBtn');
const adminUsername = document.getElementById('adminUsername');
const tabBtns = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');
const changePasswordForm = document.getElementById('changePasswordForm');
const newPasswordInput = document.getElementById('newPassword');
const toast = document.getElementById('toast');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    checkAuthentication();

    // Load configuration
    loadConfiguration();

    // Load statistics
    loadStatistics();

    // Setup event listeners
    setupEventListeners();

    // Initialize icons
    lucide.createIcons();
});

// ===== AUTHENTICATION CHECK =====
function checkAuthentication() {
    const session = localStorage.getItem(SESSION_KEY);

    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const sessionData = JSON.parse(session);
        const now = Date.now();

        // Check if session is still valid (24 hours)
        if (sessionData.expiresAt <= now) {
            localStorage.removeItem(SESSION_KEY);
            window.location.href = 'login.html';
            return;
        }

        // Display username
        if (adminUsername) {
            adminUsername.textContent = sessionData.username || 'Admin';
        }
    } catch (error) {
        console.error('Session validation error:', error);
        localStorage.removeItem(SESSION_KEY);
        window.location.href = 'login.html';
    }
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Tab navigation
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Edit config button
    const editConfigBtn = document.getElementById('editConfigBtn');
    if (editConfigBtn) {
        editConfigBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    // Change password form
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', handlePasswordChange);
    }

    // Password strength indicator
    if (newPasswordInput) {
        newPasswordInput.addEventListener('input', updatePasswordStrength);
    }

    // Refresh logs
    const refreshLogsBtn = document.getElementById('refreshLogsBtn');
    if (refreshLogsBtn) {
        refreshLogsBtn.addEventListener('click', loadLogs);
    }

    // Password toggle buttons
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', function () {
            const targetId = this.dataset.target;
            const input = document.getElementById(targetId);
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.setAttribute('data-lucide', 'eye-off');
            } else {
                input.type = 'password';
                icon.setAttribute('data-lucide', 'eye');
            }

            lucide.createIcons();
        });
    });
}

// ===== TAB MANAGEMENT =====
function switchTab(tabName) {
    // Update buttons
    tabBtns.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update panes
    tabPanes.forEach(pane => {
        if (pane.id === tabName + '-tab') {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });

    // Load tab-specific data
    if (tabName === 'logs') {
        loadLogs();
    }
}

// ===== CONFIGURATION MANAGEMENT =====
function loadConfiguration() {
    try {
        const configJson = localStorage.getItem(CONFIG_KEY);

        if (configJson) {
            currentConfig = JSON.parse(configJson);
            displayConfiguration(currentConfig);
        } else {
            displayConfiguration(null);
        }
    } catch (error) {
        console.error('Config load error:', error);
        displayConfiguration(null);
    }
}

function displayConfiguration(config) {
    if (!config) {
        return;
    }

    // Email settings
    const displayEmail = document.getElementById('displayEmail');
    const displaySmtp = document.getElementById('displaySmtp');

    if (displayEmail && config.recipientEmail) {
        displayEmail.textContent = config.recipientEmail;
    }

    if (displaySmtp && config.smtpHost) {
        displaySmtp.textContent = `${config.smtpHost}:${config.smtpPort || 465}`;
    }

    // Content settings
    const displayDomain = document.getElementById('displayDomain');
    const displayCount = document.getElementById('displayCount');
    const displayWords = document.getElementById('displayWords');

    if (displayDomain && config.contentDomain) {
        displayDomain.textContent = config.contentDomain;
    }

    if (displayCount && config.itemCount) {
        displayCount.textContent = config.itemCount + ' 条';
    }

    if (displayWords && config.wordLimit) {
        displayWords.textContent = config.wordLimit + ' 字';
    }

    // Schedule settings
    const displaySchedule = document.getElementById('displaySchedule');
    const displayDays = document.getElementById('displayDays');

    if (displaySchedule && config.schedules) {
        displaySchedule.textContent = config.schedules.join(', ');
    }

    if (displayDays && config.runDays) {
        displayDays.textContent = config.runDays + ' 天';
    }
}

// ===== STATISTICS =====
function loadStatistics() {
    try {
        const config = JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}');
        const logs = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');

        // Total sent
        const totalSent = document.getElementById('totalSent');
        if (totalSent) {
            totalSent.textContent = logs.length;
        }

        // Days running
        if (config.startDate) {
            const startDate = new Date(config.startDate);
            const today = new Date();
            const daysRunning = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));

            const daysRunningEl = document.getElementById('daysRunning');
            if (daysRunningEl) {
                daysRunningEl.textContent = Math.max(0, daysRunning);
            }

            // Days remaining
            const runDays = config.runDays || 365;
            const daysRemaining = Math.max(0, runDays - daysRunning);

            const daysRemainingEl = document.getElementById('daysRemaining');
            if (daysRemainingEl) {
                daysRemainingEl.textContent = daysRemaining;
            }

            // System status
            const systemStatus = document.getElementById('systemStatus');
            if (systemStatus) {
                if (daysRemaining > 0) {
                    systemStatus.innerHTML = '<span class="status-dot active"></span> Active';
                } else {
                    systemStatus.innerHTML = '<span class="status-dot"></span> Stopped';
                }
            }
        }
    } catch (error) {
        console.error('Statistics load error:', error);
    }
}

// ===== PASSWORD MANAGEMENT =====
async function handlePasswordChange(e) {
    e.preventDefault();

    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validation
    if (newPassword.length < 6) {
        showToast('新密码至少需要6位', 'error');
        return;
    }

    if (newPassword !== confirmPassword) {
        showToast('两次输入的密码不一致', 'error');
        return;
    }

    try {
        // Get current credentials
        const config = JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}');
        const currentCreds = config.adminCredentials || {
            username: 'admin',
            password: 'admin123'
        };

        // Verify current password
        if (currentPassword !== currentCreds.password) {
            showToast('当前密码错误', 'error');
            return;
        }

        // Update password
        config.adminCredentials = {
            username: currentCreds.username,
            password: newPassword
        };

        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));

        // Show success and re-authenticate
        showToast('密码修改成功，请重新登录', 'success');

        setTimeout(() => {
            handleLogout();
        }, 2000);

    } catch (error) {
        console.error('Password change error:', error);
        showToast('密码修改失败，请重试', 'error');
    }
}

function updatePasswordStrength() {
    const password = newPasswordInput.value;
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.getElementById('strengthText');

    if (!strengthBar || !strengthText) return;

    let strength = 0;
    let strengthClass = 'weak';
    let strengthLabel = '弱';

    // Length check
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;

    // Complexity checks
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    // Determine strength level
    if (strength <= 2) {
        strengthClass = 'weak';
        strengthLabel = '弱';
    } else if (strength <= 4) {
        strengthClass = 'medium';
        strengthLabel = '中等';
    } else {
        strengthClass = 'strong';
        strengthLabel = '强';
    }

    strengthBar.className = 'strength-fill ' + strengthClass;
    strengthText.textContent = strengthLabel;
}

// ===== LOGS MANAGEMENT =====
function loadLogs() {
    const logsContainer = document.getElementById('logsContainer');

    if (!logsContainer) return;

    try {
        const logs = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');

        if (logs.length === 0) {
            logsContainer.innerHTML = `
                <div class="empty-state">
                    <i data-lucide="inbox"></i>
                    <p>暂无发送记录</p>
                </div>
            `;
        } else {
            logsContainer.innerHTML = logs.map(log => `
                <div class="log-item">
                    <div class="log-header">
                        <span class="log-time">${formatDate(log.timestamp)}</span>
                        <span class="log-status ${log.status}">${log.status === 'success' ? '成功' : '失败'}</span>
                    </div>
                    <div class="log-details">
                        ${log.message || '发送热点邮件'}
                    </div>
                </div>
            `).join('');
        }

        lucide.createIcons();
    } catch (error) {
        console.error('Logs load error:', error);
        logsContainer.innerHTML = `
            <div class="empty-state">
                <i data-lucide="alert-circle"></i>
                <p>加载记录失败</p>
            </div>
        `;
        lucide.createIcons();
    }
}

// ===== LOGOUT =====
function handleLogout() {
    localStorage.removeItem(SESSION_KEY);
    showToast('已退出登录', 'success');

    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1000);
}

// ===== TOAST NOTIFICATIONS =====
function showToast(message, type = 'success') {
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');

    toastMessage.textContent = message;

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

// ===== UTILITY FUNCTIONS =====
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');

    return `${year}-${month}-${day} ${hour}:${minute}`;
}
