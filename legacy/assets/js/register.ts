import { createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../../src/firebase';

const registerButton = document.getElementById('register-btn');

registerButton?.addEventListener('click', async (event) => {
  event.preventDefault();

  const emailInput = document.getElementById('register-email');
  const passwordInput = document.getElementById('register-password');
  const nameInput = document.getElementById('register-username');
  if (
    !(emailInput instanceof HTMLInputElement) ||
    !(passwordInput instanceof HTMLInputElement) ||
    !(nameInput instanceof HTMLInputElement)
  ) {
    return;
  }

  try {
    const credential = await createUserWithEmailAndPassword(
      auth,
      emailInput.value.trim(),
      passwordInput.value,
    );
    const displayName = nameInput.value.trim();
    if (displayName) await updateProfile(credential.user, { displayName });
    await signOut(auth);
    window.alert('Account created. Please log in.');
    window.location.assign('./login&register.html');
  } catch {
    window.alert('Registration failed. Check your details and try again.');
  }
});
