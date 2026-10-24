import { signInWithEmailAndPassword } from 'firebase/auth';
import { getApiUser } from '../../../src/lib/api';
import { auth } from '../../../src/firebase';

const loginButton = document.getElementById('login-btn');

loginButton?.addEventListener('click', async (event) => {
  event.preventDefault();

  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  if (!(emailInput instanceof HTMLInputElement) || !(passwordInput instanceof HTMLInputElement)) {
    return;
  }

  try {
    const credential = await signInWithEmailAndPassword(
      auth,
      emailInput.value.trim(),
      passwordInput.value,
    );
    const profile = await getApiUser(credential.user);
    window.location.assign(profile.role === 'admin' ? './AdminPage.html' : './products.html');
  } catch {
    window.alert('Login failed. Check your email and password.');
  }
});
