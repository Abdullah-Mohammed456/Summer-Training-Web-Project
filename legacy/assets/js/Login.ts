import { login } from '../../../src/lib/api';

const loginButton = document.getElementById('login-btn');

loginButton?.addEventListener('click', async (event) => {
  event.preventDefault();

  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  if (!(emailInput instanceof HTMLInputElement) || !(passwordInput instanceof HTMLInputElement)) {
    return;
  }

  try {
    const user = await login(emailInput.value.trim(), passwordInput.value);
    window.location.assign(user.role === 'admin' ? './AdminPage.html' : './products.html');
  } catch {
    window.alert('Login failed. Check your email and password.');
  }
});
