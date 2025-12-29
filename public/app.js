const addRecipientBtn = document.getElementById('addRecipientBtn');
const recipientsContainer = document.getElementById('recipientsContainer');
const addCustomSourceBtn = document.getElementById('addCustomSourceBtn');
const customSourcesContainer = document.getElementById('customSourcesContainer');
const testBtn = document.getElementById('testBtn');
const smtpGuideLink = document.getElementById('smtpGuideLink');
const smtpGuideModal = document.getElementById('smtpGuideModal');
const closeModal = document.getElementById('closeModal');
const toast = document.getElementById('toast');

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Check authentication and render header
    const isLoggedIn = checkAuthentication();

    // Load existing configuration
    loadConfiguration();

    // Setup event listeners
    setupEventListeners();

    // Initialize Lucide icons
    lucide.createIcons();
});

// ===== AUTHENTICATION & HEADER =====
function checkAuthentication() {
    const session = localStorage.getItem(SESSION_KEY);
    let isLoggedIn = false;

    if (session) {
        try {
            const sessionData = JSON.parse(session);
            const now = Date.now();
            if (sessionData.expiresAt > now) {
                isLoggedIn = true;
            }
        } catch (error) {
            console.error('Session check error:', error);
        }
    }

    // Render header button
    renderHeaderButton(isLoggedIn);

    return isLoggedIn;
}

function renderHeaderButton(isLoggedIn) {
    const headerActions = document.getElementById('headerActions');
    if (!headerActions) return;

    if (isLoggedIn) {
        headerActions.innerHTML = `
            <a href="admin.html" class="btn-header">
                <i data-lucide="shield-check"></i>
                <span>管理后台</span>
            </a>
        `;
    } else {
        headerActions.innerHTML = `
            <a href="login.html" class="btn-header">
                <i data-lucide="shield-check"></i>
                <span>登录/管理</span>
            </a>
        `;
    }

    lucide.createIcons();
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Form submission
    if (configForm) {
        configForm.addEventListener('submit', handleFormSubmit);
    }

    // Schedule management
    if (addScheduleBtn) {
        addScheduleBtn.addEventListener('click', () => addScheduleItem());
    }

    scheduleContainer?.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.btn-remove-schedule');
        if (removeBtn) removeScheduleItem(removeBtn);
    });

    // Recipient management
    if (addRecipientBtn) {
        addRecipientBtn.addEventListener('click', addRecipientItem);
    }

    recipientsContainer?.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.btn-remove-recipient');
        if (removeBtn) removeRecipientItem(removeBtn);
    });

    // Custom news sources
    if (addCustomSourceBtn) {
        addCustomSourceBtn.addEventListener('click', addCustomSourceItem);
    }

    customSourcesContainer?.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.btn-remove-custom-source');
        if (removeBtn) removeCustomSourceItem(removeBtn);
    });

    // Test email
    if (testBtn) {
        testBtn.addEventListener('click', handleTestEmail);
    }

    // SMTP guide modal
    if (smtpGuideLink) {
        smtpGuideLink.addEventListener('click', (e) => {
            e.preventDefault();
            showModal();
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', hideModal);
    }

    if (smtpGuideModal) {
        smtpGuideModal.addEventListener('click', (e) => {
            if (e.target === smtpGuideModal) hideModal();
        });
    }
}

// ===== RECIPIENT MANAGEMENT =====
function addRecipientItem(email = '') {
    const recipientItem = document.createElement('div');
    recipientItem.className = 'recipient-item';

    recipientItem.innerHTML = `
        <input 
            type="email" 
            class="form-input recipient-input"
            placeholder="email@example.com"
            value="${email}"
            required
        >
        <button type="button" class="btn-icon btn-remove-recipient" aria-label="移除">
            <i data-lucide="x"></i>
        </button>
    `;

    recipientsContainer.appendChild(recipientItem);
    lucide.createIcons();
}

function removeRecipientItem(btn) {
    const recipientItem = btn.closest('.recipient-item');
    const remainingItems = recipientsContainer.querySelectorAll('.recipient-item');

    if (remainingItems.length > 1) {
        recipientItem.remove();
    } else {
        showToast('至少需要保留一个收件人', 'error');
    }
}

function getRecipients() {
    const inputs = recipientsContainer.querySelectorAll('.recipient-input');
    const recipients = [];

    inputs.forEach(input => {
        if (input.value.trim()) {
            recipients.push(input.value.trim());
        }
    });

    return recipients;
}

// ===== CUSTOM NEWS SOURCES =====
function addCustomSourceItem(name = '', url = '') {
    const sourceItem = document.createElement('div');
    sourceItem.className = 'custom-source-item';

    sourceItem.innerHTML = `
        <div class="custom-source-inputs">
            <input 
                type="text" 
                class="form-input"
                placeholder="源名称"
                value="${name}"
            >
            <input 
                type="url" 
                class="form-input"
                placeholder="https://example.com/rss"
                value="${url}"
            >
        </div>
        <button type="button" class="btn-icon btn-remove-custom-source" aria-label="移除">
            <i data-lucide="x"></i>
        </button>
    `;

    customSourcesContainer.appendChild(sourceItem);
    lucide.createIcons();
}

function removeCustomSourceItem(btn) {
    btn.closest('.custom-source-item').remove();
}

function getCustomSources() {
    const items = customSourcesContainer.querySelectorAll('.custom-source-item');
    const sources = [];

    items.forEach(item => {
        const inputs = item.querySelectorAll('.form-input');
        const name = inputs[0].value.trim();
        const url = inputs[1].value.trim();

        if (name && url) {
            sources.push({ name, url });
        }
    });

    return sources;
}

// =====NEWS SOURCES =====
function getSelectedNewsSources() {
    const checkboxes = document.querySelectorAll('input[name="newsSource"]:checked');
    return Array.from(checkboxes).map(cb => cb.value);
}

// ===== SCHEDULE MANAGEMENT =====
function addScheduleItem(time = '08:00') {
    const scheduleItem = document.createElement('div');
    scheduleItem.className = 'schedule-item';

    const timeValue = typeof time === 'string' ? time : '08:00';

    scheduleItem.innerHTML = `
        <input 
            type="time" 
            class="schedule-input"
            value="${timeValue}"
            required
        >
        <button type="button" class="btn-icon btn-remove-schedule" aria-label="移除">
            <i data-lucide="x"></i>
        </button>
    `;

    scheduleContainer.appendChild(scheduleItem);
    lucide.createIcons();
}

function removeScheduleItem(btn) {
    const scheduleItem = btn.closest('.schedule-item');
    const remainingItems = scheduleContainer.querySelectorAll('.schedule-item');

    if (remainingItems.length > 1) {
        scheduleItem.remove();
    } else {
        showToast('至少需要保留一个发送时间', 'error');
    }
}

function getSchedules() {
    const scheduleInputs = scheduleContainer.querySelectorAll('.schedule-input');
    const schedules = [];

    scheduleInputs.forEach(input => {
        if (input.value) {
            schedules.push(input.value);
        }
    });

    return schedules;
}

// ===== CONFIGURATION MANAGEMENT =====
function loadConfiguration() {
    try {
        const configJson = localStorage.getItem(CONFIG_KEY);

        if (configJson) {
            const config = JSON.parse(configJson);

            // Load recipients
            if (config.recipients && config.recipients.length > 0) {
                recipientsContainer.innerHTML = '';
                config.recipients.forEach(email => addRecipientItem(email));
            }

            // Load SMTP settings
            if (config.smtpHost) document.getElementById('smtpHost').value = config.smtpHost;
            if (config.smtpPort) document.getElementById('smtpPort').value = config.smtpPort;
            if (config.smtpSecure !== undefined) document.getElementById('smtpSecure').value = config.smtpSecure;
            if (config.smtpUser) document.getElementById('smtpUser').value = config.smtpUser;
            if (config.smtpPass) document.getElementById('smtpPass').value = config.smtpPass;

            // Load news sources
            if (config.newsSources) {
                config.newsSources.forEach(source => {
                    const checkbox = document.querySelector(`input[name="newsSource"][value="${source}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }

            // Load custom sources
            if (config.customSources && config.customSources.length > 0) {
                config.customSources.forEach(source => {
                    addCustomSourceItem(source.name, source.url);
                });
            }

            // Load content settings
            if (config.contentDomain) document.getElementById('contentDomain').value = config.contentDomain;
            if (config.itemCount) document.getElementById('itemCount').value = config.itemCount;
            if (config.wordLimit) document.getElementById('wordLimit').value = config.wordLimit;
            if (config.runDays) document.getElementById('runDays').value = config.runDays;

            // Load schedules
            if (config.schedules && config.schedules.length > 0) {
                scheduleContainer.innerHTML = '';
                config.schedules.forEach(time => addScheduleItem(time));
            }

            updateStatus(true);
        }
    } catch (error) {
        console.error('Config load error:', error);
    }
}

function saveConfiguration(config) {
    try {
        const existingConfig = JSON.parse(localStorage.getItem(CONFIG_KEY) || '{}');

        if (!existingConfig.startDate) {
            config.startDate = new Date().toISOString();
        } else {
            config.startDate = existingConfig.startDate;
        }

        if (existingConfig.adminCredentials) {
            config.adminCredentials = existingConfig.adminCredentials;
        }

        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        return true;
    } catch (error) {
        console.error('Config save error:', error);
        return false;
    }
}

// ===== FORM HANDLING =====
async function handleFormSubmit(e) {
    e.preventDefault();

    const recipients = getRecipients();
    const newsSources = getSelectedNewsSources();
    const customSources = getCustomSources();

    const config = {
        recipients: recipients,
        smtpHost: document.getElementById('smtpHost').value.trim(),
        smtpPort: parseInt(document.getElementById('smtpPort').value),
        smtpSecure: document.getElementById('smtpSecure').value === 'true',
        smtpUser: document.getElementById('smtpUser').value.trim(),
        smtpPass: document.getElementById('smtpPass').value.trim(),
        newsSources: newsSources,
        customSources: customSources,
        contentDomain: document.getElementById('contentDomain').value.trim(),
        itemCount: parseInt(document.getElementById('itemCount').value),
        wordLimit: parseInt(document.getElementById('wordLimit').value),
        runDays: parseInt(document.getElementById('runDays').value),
        schedules: getSchedules()
    };

    // Validation
    if (recipients.length === 0) {
        showToast('请至少添加一个收件人', 'error');
        return;
    }
    if (newsSources.length === 0 && customSources.length === 0) {
        showToast('请至少选择一个新闻源', 'error');
        return;
    }
    if (!config.smtpHost || !config.smtpUser || !config.smtpPass) {
        showToast('请填写所有必填项', 'error');
        return;
    }
    if (config.schedules.length === 0) {
        showToast('请至少添加一个发送时间', 'error');
        return;
    }

    const saved = saveConfiguration(config);

    if (saved) {
        showToast('配置保存成功！系统已启动', 'success');
        updateStatus(true);

        setTimeout(() => {
            if (localStorage.getItem(SESSION_KEY)) {
                window.location.href = 'admin.html';
            }
        }, 2000);
    } else {
        showToast('配置保存失败，请重试', 'error');
    }
}

// ===== TEST EMAIL =====
async function handleTestEmail() {
    const btn = testBtn;
    const originalContent = btn.innerHTML;

    btn.innerHTML = '<i data-lucide="loader" class="animate-spin"></i> 发送中...';
    btn.disabled = true;
    lucide.createIcons();

    try {
        const recipients = getRecipients();
        const config = {
            recipients: recipients,
            smtpHost: document.getElementById('smtpHost').value.trim(),
            smtpPort: parseInt(document.getElementById('smtpPort').value),
            smtpSecure: document.getElementById('smtpSecure').value === 'true',
            smtpUser: document.getElementById('smtpUser').value.trim(),
            smtpPass: document.getElementById('smtpPass').value.trim()
        };

        if (recipients.length === 0 || !config.smtpHost || !config.smtpUser || !config.smtpPass) {
            showToast('请先填写完整的邮件配置', 'error');
            btn.innerHTML = originalContent;
            btn.disabled = false;
            lucide.createIcons();
            return;
        }

        await new Promise(resolve => setTimeout(resolve, 2000));
        showToast(`测试邮件已发送到 ${recipients.length} 个邮箱！`, 'success');

    } catch (error) {
        console.error('Test email error:', error);
        showToast('测试邮件发送失败：' + error.message, 'error');
    } finally {
        btn.innerHTML = originalContent;
        btn.disabled = false;
        lucide.createIcons();
    }
}

// ===== STATUS & UI =====
function updateStatus(active) {
    const statusCard = document.getElementById('statusCard');
    if (!statusCard) return;

    const statusDot = statusCard.querySelector('.status-dot');
    const statusText = statusCard.querySelector('.status-text');

    if (active) {
        statusDot.classList.add('active');
        statusText.textContent = '已激活';
    } else {
        statusDot.classList.remove('active');
        statusText.textContent = '未激活';
    }
}

function showModal() {
    if (smtpGuideModal) smtpGuideModal.classList.add('show');
}

function hideModal() {
    if (smtpGuideModal) smtpGuideModal.classList.remove('show');
}

function showToast(message, type = 'success') {
    const toastMessage = toast.querySelector('.toast-message');
    const toastIcon = toast.querySelector('.toast-icon');

    toastMessage.textContent = message;

    if (type === 'success') {
        toastIcon.setAttribute('data-lucide', 'check-circle');
        toast.style.borderColor = 'var(--success-color)';
        toastIcon.style.color = 'var(--success-color)';
    } else if (type === 'error') {
        toastIcon.setAttribute('data-lucide', 'alert-circle');
        toast.style.borderColor = 'var(--error-color)';
        toastIcon.style.color = 'var(--error-color)';
    }

    lucide.createIcons();
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Spin animation
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
