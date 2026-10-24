import { getCurrentUser, logout } from '../../../src/lib/api';

const loginLink = document.querySelector<HTMLAnchorElement>(
  'a[href*="login&register.html"]',
);

if (loginLink) {
  void getCurrentUser()
    .catch(() => null)
    .then((user) => {
      if (!loginLink) return;
      loginLink.textContent = user ? 'Logout' : 'Login';
      loginLink.href = user ? '#' : './pages/login&register.html';
      loginLink.onclick = user
        ? async (event) => {
            event.preventDefault();
            await logout();
            window.location.assign('/index.html');
          }
        : null;
    });
}
