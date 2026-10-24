interface SectionLink {
  link: HTMLAnchorElement;
  section: HTMLElement;
}

document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname.replace(/\\/g, '/');
  const navigationLinks = document.querySelectorAll<HTMLAnchorElement>(
    '.navbar a[href], .contact_navdiv a[href]',
  );

  navigationLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    const path = new URL(href, window.location.origin).pathname;
    const isCurrentPage =
      (path === '/' && (currentPath === '/' || currentPath.endsWith('/index.html'))) ||
      (path !== '/' && currentPath.endsWith(path));
    link.classList.toggle('active', isCurrentPage);
  });

  const sectionLinks = document.querySelectorAll<HTMLAnchorElement>('.navbar a[href^="#"]');
  const sections = Array.from(sectionLinks)
    .map((link): SectionLink | null => {
      const id = link.getAttribute('href')?.slice(1);
      const section = id ? document.getElementById(id) : null;
      return section ? { link, section } : null;
    })
    .filter((item): item is SectionLink => item !== null);

  if (sections.length) {
    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + 120;
      const active = sections.reduce<SectionLink | null>((best, item) => {
        const top = item.section.getBoundingClientRect().top + window.scrollY;
        return top <= scrollPosition ? item : best;
      }, null);

      sectionLinks.forEach((link) => link.classList.toggle('active', link === active?.link));
    };

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    updateActiveSection();
  }

  const introOverlay = document.querySelector<HTMLElement>('.intro-overlay');
  if (!introOverlay) return;

  const finishIntro = () => {
    introOverlay.style.opacity = '0';
    introOverlay.style.visibility = 'hidden';
    document.body.classList.add('intro-completed');
  };

  window.setTimeout(finishIntro, 5000);
  introOverlay.addEventListener('click', finishIntro, { once: true });
  document.addEventListener('keydown', (event) => {
    if (event.code !== 'Space' && event.code !== 'Enter') return;
    event.preventDefault();
    finishIntro();
  });
});
