function updateButton() {
  const loginLink = document.querySelector('a[href*="login&register.html"]');
  if (!loginLink) return;
  
  if (localStorage.getItem('isLoggedIn') === 'true') {
    loginLink.textContent = 'Logout';
    loginLink.onclick = () => {
      localStorage.removeItem('isLoggedIn');
      window.location.href = '/index.html';
    };
  } else {
    loginLink.textContent = 'Login';
    loginLink.onclick = null;
  }
}

document.addEventListener('DOMContentLoaded', updateButton);
