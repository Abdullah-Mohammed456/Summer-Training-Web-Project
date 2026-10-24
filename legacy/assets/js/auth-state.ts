import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../../src/firebase';

const loginLink = document.querySelector<HTMLAnchorElement>(
  'a[href*="login&register.html"]',
);

if (loginLink) {
  onAuthStateChanged(auth, (user) => {
    loginLink.textContent = user ? 'Logout' : 'Login';
    loginLink.href = user ? '#' : './pages/login&register.html';
    loginLink.onclick = user
      ? async (event) => {
          event.preventDefault();
          await signOut(auth);
          window.location.assign('/index.html');
        }
      : null;
  });
}
