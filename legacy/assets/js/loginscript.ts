const container = document.querySelector<HTMLElement>('.container');
const body = document.body;

document.querySelector('.register-btn')?.addEventListener('click', () => {
  container?.classList.add('active');
  container?.classList.remove('admin-active');
  body.classList.add('bg-register');
  body.classList.remove('bg-admin');
});

document.querySelector('.login-btn')?.addEventListener('click', () => {
  container?.classList.remove('active', 'admin-active');
  body.classList.remove('bg-register', 'bg-admin');
});

document.querySelectorAll<HTMLElement>('.toggle-password').forEach((toggle) => {
  const targetId = toggle.dataset.target;
  const input = targetId ? document.getElementById(targetId) : null;
  if (!(input instanceof HTMLInputElement)) return;

  const updateVisibility = () => {
    const shouldShow = input.type === 'password';
    input.type = shouldShow ? 'text' : 'password';
    toggle.setAttribute('aria-label', shouldShow ? 'Hide password' : 'Show password');
  };

  toggle.addEventListener('click', updateVisibility);
  toggle.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    updateVisibility();
  });
});

const passwordInput = document.getElementById('register-password');
const strengthWrapper = document.getElementById('register-password-strength');
const strengthLabel = strengthWrapper?.querySelector<HTMLElement>('.strength-label');

if (passwordInput instanceof HTMLInputElement && strengthWrapper && strengthLabel) {
  passwordInput.addEventListener('input', () => {
    const password = passwordInput.value;
    const score = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ].filter(Boolean).length;
    const strength =
      password.length === 0
        ? { className: '', label: 'Strength: —' }
        : score <= 2
          ? { className: 'weak', label: 'Strength: Weak' }
          : score <= 4
            ? { className: 'medium', label: 'Strength: Medium' }
            : { className: 'strong', label: 'Strength: Strong' };

    strengthWrapper.classList.remove('weak', 'medium', 'strong');
    if (strength.className) strengthWrapper.classList.add(strength.className);
    strengthLabel.textContent = strength.label;
  });
}
