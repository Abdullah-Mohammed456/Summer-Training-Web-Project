/* 3D Auth interactions */
(function () {
  const card = document.getElementById('authCard');
  if (!card) return;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  // Tilt on mouse move
  const scene = document.querySelector('.scene');
  let rafId = null;
  function handlePointerMove(e) {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const x = (e.clientX - cx) / rect.width; // -0.5..0.5
    const y = (e.clientY - cy) / rect.height; // -0.5..0.5
    const rx = clamp(-y * 12, -14, 14);
    const ry = clamp(x * 18, -18, 18);

    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => {
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)` + (card.classList.contains('is-flipped') ? ' rotateY(180deg)' : '');
    });
  }

  function handlePointerLeave() {
    if (rafId) cancelAnimationFrame(rafId);
    card.style.transform = card.classList.contains('is-flipped') ? 'rotateY(180deg)' : 'rotateX(0) rotateY(0)';
  }

  scene.addEventListener('pointermove', handlePointerMove);
  scene.addEventListener('pointerleave', handlePointerLeave);

  // Flip actions
  function flip(toBack) {
    card.classList.toggle('is-flipped', toBack);
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-action]');
    if (trigger?.dataset.action === 'show-signup') {
      flip(true);
    } else if (trigger?.dataset.action === 'show-login') {
      flip(false);
    }

    const toggleBtn = e.target.closest('[data-toggle="password"]');
    if (toggleBtn) {
      const targetSel = toggleBtn.getAttribute('data-target');
      const input = document.querySelector(targetSel);
      if (input) {
        const isPassword = input.getAttribute('type') === 'password';
        input.setAttribute('type', isPassword ? 'text' : 'password');
        toggleBtn.innerHTML = isPassword ? '<i class="fa-regular fa-eye-slash"></i>' : '<i class="fa-regular fa-eye"></i>';
      }
    }
  });

  // Demo submit handlers
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');

  function demoRedirect(evt) {
    evt.preventDefault();
    const email = (evt.target.querySelector('input[type="email"]')?.value || '').trim();
    const password = (evt.target.querySelector('input[type="password"], input[type="text"][name="password"]')?.value || '').trim();
    if (!email || !password) {
      alert('Please fill in the form.');
      return;
    }
    window.location.href = './dashboard.html';
  }

  loginForm?.addEventListener('submit', demoRedirect);
  signupForm?.addEventListener('submit', demoRedirect);
})();

