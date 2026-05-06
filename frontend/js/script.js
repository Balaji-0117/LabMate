/* script.js  |  LabMate — Virtual Laboratory Platform */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     1. SPLASH SCREEN
  ---------------------------------------------------------- */
  const splash = document.getElementById('logo-splash');

  if (splash) {
    const hide = () => splash.classList.add('hidden');
    setTimeout(hide, 2600); // Auto-hide after 2.6s gracefully
  }

  /* ----------------------------------------------------------
     2. STICKY HEADER — shrink on scroll
  ---------------------------------------------------------- */
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ----------------------------------------------------------
     3. MOBILE HAMBURGER MENU
  ---------------------------------------------------------- */
  const menuBtn = document.getElementById('mobile-menu-btn');
  const navList = document.getElementById('nav-links-list');

  menuBtn?.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });

  navList?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      menuBtn?.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (menuBtn && navList && !menuBtn.contains(e.target) && !navList.contains(e.target)) {
      navList.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* ----------------------------------------------------------
     4. ACTIVE NAV LINK on scroll
  ---------------------------------------------------------- */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('#nav-links-list .nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.removeAttribute('aria-current');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.setAttribute('aria-current', 'page');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));

  /* ----------------------------------------------------------
     5. COURSE FILTER TABS
  ---------------------------------------------------------- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const courseCards = document.querySelectorAll('.course-card');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active-tab');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active-tab');
      tab.setAttribute('aria-selected', 'true');

      const selected = tab.textContent.trim();
      courseCards.forEach(card => {
        const badge = card.querySelector('.course-branch-badge')?.textContent.trim() || '';
        if (selected === 'All' || badge === selected) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ----------------------------------------------------------
     6. AUTO COPYRIGHT YEAR
  ---------------------------------------------------------- */
  const yrSpan = document.getElementById('copyright-year');
  if (yrSpan) yrSpan.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     7. SCROLL-REVEAL (fade-up on entry)
  ---------------------------------------------------------- */
  const revealItems = document.querySelectorAll(
    '.objective-card, .course-card, .demo-card, .announcement-card, .testimonial-card, .college-logo-item'
  );

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${(i % 6) * 60}ms`;
        entry.target.classList.add('revealed');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(22px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    revealObs.observe(el);
  });

  document.head.insertAdjacentHTML('beforeend', `
    <style>
      .revealed { opacity: 1 !important; transform: translateY(0) !important; }
    </style>
  `);

  /* ----------------------------------------------------------
     8. SMOOTH SCROLL OFFSET
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 72;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------
     9. THEME SWITCHER LOGIC
  ---------------------------------------------------------- */
  const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
    if (toggleSwitch && currentTheme === 'dark') {
      toggleSwitch.checked = true;
    }
  }

  function switchTheme(e) {
    if (e.target.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }

  if (toggleSwitch) {
    toggleSwitch.addEventListener('change', switchTheme, false);
  }

});