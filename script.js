(() => {
  const nav = document.getElementById('site-nav');
  const toggle = document.querySelector('.nav-toggle');
  const revealEls = document.querySelectorAll('.reveal');
  const experienceEls = Array.from(document.querySelectorAll('.experience[data-progress]'));
  const dots = Array.from(document.querySelectorAll('.route-dot'));
  const progress = document.querySelector('.route-progress');
  const stripeBtn = document.querySelector('[data-stripe-link]');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-cta');

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (toggle) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      nav.classList.toggle('menu-visible', !open);
      document.body.classList.toggle('menu-open', !open);
    });
  }

  navLinks.forEach(link => link.addEventListener('click', () => {
    if (nav.classList.contains('menu-visible')) {
      nav.classList.remove('menu-visible');
      document.body.classList.remove('menu-open');
      toggle?.setAttribute('aria-expanded', 'false');
      toggle?.setAttribute('aria-label', 'Open menu');
    }
  }));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view');
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  revealEls.forEach(el => observer.observe(el));

  if (experienceEls.length && progress) {
    const mapObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const idx = Number(entry.target.dataset.progress || 1);
        dots.forEach((dot, i) => dot.classList.toggle('active', i < idx));
        const pct = Math.min(100, Math.max(10, (idx / dots.length) * 100));
        progress.style.width = String(pct) + '%';
      });
    }, { threshold: 0.32 });
    experienceEls.forEach(el => mapObserver.observe(el));
  }

  if (stripeBtn) {
    stripeBtn.addEventListener('click', (event) => {
      const configured = stripeBtn.getAttribute('data-stripe-link');
      if (!configured) {
        event.preventDefault();
        window.alert('The registration checkout link will be connected here once the program Stripe payment link is confirmed.');
      }
    });
  }
})();