document.addEventListener('DOMContentLoaded', function() {
  // Highlight active nav link by current path
  const navLinks = document.querySelectorAll('.navbar a[href], .contact_navdiv a[href]');
  const currentPath = location.pathname.replace(/\\/g, '/');
  navLinks.forEach(function(link) {
    const href = link.getAttribute('href');
    if (!href) return;
    const resolved = new URL(href, location.origin).pathname;
    if (resolved === '/' && (currentPath === '/' || currentPath.endsWith('/index.html'))) {
      link.classList.add('active');
    } else if (resolved !== '/' && currentPath.endsWith(resolved)) {
      link.classList.add('active');
    }
  });

  // Section-based highlighting when scrolling on the homepage
  const sectionAnchors = document.querySelectorAll('.navbar a[href^="#"]');
  if (sectionAnchors.length) {
    const sections = Array.from(sectionAnchors).map(function(a) {
      const id = a.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      return el ? { link: a, section: el } : null;
    }).filter(Boolean);

    function updateActiveByScroll() {
      let best = null;
      const offset = 120;
      const scrollY = window.scrollY + offset;
      sections.forEach(function(pair) {
        const rect = pair.section.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        if (top <= scrollY) best = pair;
      });
      sectionAnchors.forEach(function(a) { a.classList.remove('active'); });
      if (best) best.link.classList.add('active');
    }

    window.addEventListener('scroll', updateActiveByScroll, { passive: true });
    updateActiveByScroll();
  }
});


