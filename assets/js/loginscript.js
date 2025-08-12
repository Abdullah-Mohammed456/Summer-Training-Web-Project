const container = document.querySelector('.container');
const bodyEl = document.body;
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');
const adminRegisterBtn = document.querySelector('.admin-register-btn');

registerBtn.addEventListener('click', () => {
    container.classList.add('active');
    container.classList.remove('admin-active');
    if (bodyEl) { bodyEl.classList.add('bg-register'); bodyEl.classList.remove('bg-admin'); }
});

loginBtn.addEventListener('click', () => {
    container.classList.remove('active');
    container.classList.remove('admin-active');
    if (bodyEl) { bodyEl.classList.remove('bg-register'); bodyEl.classList.remove('bg-admin'); }
});

if (adminRegisterBtn) {
    adminRegisterBtn.addEventListener('click', () => {
        container.classList.add('admin-active');
        container.classList.remove('active');
        if (bodyEl) { bodyEl.classList.add('bg-admin'); bodyEl.classList.remove('bg-register'); }
    });
}

// Toggle password visibility icons
(function initPasswordToggle() {
    const toggles = document.querySelectorAll('.toggle-password');
    const toggleType = (input) => {
        input.type = input.type === 'password' ? 'text' : 'password';
    };
    const toggleIcon = (icon, isVisible) => {
        icon.classList.toggle('fa-eye', !isVisible);
        icon.classList.toggle('fa-eye-slash', isVisible);
        icon.setAttribute('aria-label', isVisible ? 'Hide password' : 'Show password');
    };
    toggles.forEach((icon) => {
        const targetId = icon.getAttribute('data-target');
        const input = document.getElementById(targetId);
        if (!input) return;
        // start with eye (hidden)
        toggleIcon(icon, false);
        const handler = () => {
            const isCurrentlyHidden = input.type === 'password';
            toggleType(input);
            toggleIcon(icon, isCurrentlyHidden);
        };
        icon.addEventListener('click', handler);
        icon.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } });
    });
})();

// Password strength 
(function(){
    const evaluatePasswordStrength = (value) => {
        let score = 0;
        if (value.length >= 8) score++;
        if (/[A-Z]/.test(value)) score++;
        if (/[a-z]/.test(value)) score++;
        if (/[0-9]/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;
        if (value.length === 0) return { cls: '', text: 'Strength: —' };
        if (score <= 2) return { cls: 'weak', text: 'Strength: Weak' };
        if (score === 3 || score === 4) return { cls: 'medium', text: 'Strength: Medium' };
        return { cls: 'strong', text: 'Strength: Strong' };
    };

    const initPasswordStrengthFor = (inputId, wrapperId) => {
        const passwordInput = document.getElementById(inputId);
        const strengthWrap = document.getElementById(wrapperId);
        if (!passwordInput || !strengthWrap) return;

        const label = strengthWrap.querySelector('.strength-label');

        const updateUI = () => {
            const { cls, text } = evaluatePasswordStrength(passwordInput.value);
            strengthWrap.classList.remove('weak', 'medium', 'strong');
            if (cls) strengthWrap.classList.add(cls);
            if (label) label.textContent = text;
        };

        passwordInput.addEventListener('input', updateUI);
        updateUI();
    };

    initPasswordStrengthFor('register-password', 'register-password-strength');
    initPasswordStrengthFor('admin-register-password', 'admin-password-strength');
})();

// Admin secret key validation
(function(){
    const adminForm = document.getElementById('admin-register-form');
    if (!adminForm) return;
    adminForm.addEventListener('submit', (e) => {
        const keyInput = document.getElementById('admin-secret-key');
        if (!keyInput) return;
        const isValid = keyInput.value === '1111';
        if (!isValid) {
            e.preventDefault();
            alert('Invalid admin secret key.');
            keyInput.focus();
        }
    });
})();