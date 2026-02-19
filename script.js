/* ======================================================================
   EBEN DEV SOLUTIONS — 2026 Futuristic JavaScript Engine
   MereqTech-Inspired Animations & Full-Screen Overlay Menu
   ====================================================================== */

/* ===== PARTICLE CANVAS BACKGROUND ===== */
const canvas = document.getElementById('particle-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -1000, y: -1000 };

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.hue = Math.random() > 0.5 ? 240 : 270;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      // Mouse repel
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.x += (dx / dist) * force * 2;
        this.y += (dy / dist) * force * 2;
      }
      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }
  initParticles();

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(99, 102, 241, ${0.06 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
}

/* ===== FULL-SCREEN OVERLAY MENU (MereqTech-style) ===== */
const navToggle = document.getElementById('nav-toggle');
const navOverlay = document.getElementById('nav-overlay');
const overlayMenuItems = document.querySelectorAll('.overlay-menu-item');
let menuOpen = false;

function toggleMenu() {
  menuOpen = !menuOpen;
  navToggle.classList.toggle('is-active', menuOpen);
  navOverlay.classList.toggle('is-open', menuOpen);

  // Prevent body scroll when menu is open
  document.body.style.overflow = menuOpen ? 'hidden' : '';
}

if (navToggle) {
  navToggle.addEventListener('click', toggleMenu);
}

// Close menu when clicking a menu item
overlayMenuItems.forEach(item => {
  item.addEventListener('click', () => {
    if (menuOpen) {
      toggleMenu();
    }
  });
});

// Close menu with Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuOpen) {
    toggleMenu();
  }
});

/* ===== SCROLL-BASED ACTIVE LINK ===== */
const sections = document.querySelectorAll('section[id]');
function scrollActive() {
  const scrollY = window.pageYOffset;
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 120;
    const sectionId = section.getAttribute('id');
    // Update overlay menu items
    overlayMenuItems.forEach(item => {
      if (item.getAttribute('href') === `#${sectionId}`) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          item.style.color = 'var(--accent-primary)';
        } else {
          item.style.color = '';
        }
      }
    });
  });
}
window.addEventListener('scroll', scrollActive);

/* ===== HEADER SCROLL EFFECT ===== */
function scrollHeader() {
  const header = document.getElementById('header');
  if (header) {
    header.classList.toggle('scroll-header', window.scrollY >= 50);
  }
}
window.addEventListener('scroll', scrollHeader);

/* ===== SCROLL UP ===== */
function scrollUp() {
  const scrollUpBtn = document.getElementById('scroll-up');
  if (scrollUpBtn) {
    scrollUpBtn.classList.toggle('show-scroll', window.scrollY >= 400);
  }
}
window.addEventListener('scroll', scrollUp);

/* ===== THEME TOGGLE ===== */
const themeButton = document.getElementById('theme-button');
const selectedTheme = localStorage.getItem('selected-theme');

if (selectedTheme === 'light') {
  document.body.classList.add('light-theme');
  const icon = themeButton.querySelector('i');
  icon.classList.remove('fa-moon');
  icon.classList.add('fa-sun');
}

themeButton.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
  const icon = themeButton.querySelector('i');
  icon.classList.toggle('fa-sun');
  icon.classList.toggle('fa-moon');
  localStorage.setItem('selected-theme',
    document.body.classList.contains('light-theme') ? 'light' : 'dark');
});

/* ===== CUSTOM CURSOR ===== */
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

if (cursorOutline) {
  cursorOutline.style.transition = 'left 0.06s ease-out, top 0.06s ease-out, width 0.2s, height 0.2s, border-color 0.2s';
}

let cursorX = 0, cursorY = 0;
let dotX = 0, dotY = 0;

window.addEventListener('mousemove', e => {
  cursorX = e.clientX;
  cursorY = e.clientY;
});

function animateCursor() {
  if (cursorDot) {
    dotX += (cursorX - dotX) * 0.4;
    dotY += (cursorY - dotY) * 0.4;
    cursorDot.style.left = `${cursorX}px`;
    cursorDot.style.top = `${cursorY}px`;
  }
  if (cursorOutline) {
    cursorOutline.style.left = `${dotX}px`;
    cursorOutline.style.top = `${dotY}px`;
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

const hoverTargets = document.querySelectorAll('a, button, .service-card, .portfolio__card, .testimonial-card, .contact__card, .overlay-menu-item');
hoverTargets.forEach(el => {
  el.addEventListener('mouseenter', () => {
    if (cursorOutline) {
      cursorOutline.style.width = '64px';
      cursorOutline.style.height = '64px';
      cursorOutline.style.borderColor = 'rgba(99, 102, 241, 0.5)';
    }
    if (cursorDot) cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
  });
  el.addEventListener('mouseleave', () => {
    if (cursorOutline) {
      cursorOutline.style.width = '42px';
      cursorOutline.style.height = '42px';
      cursorOutline.style.borderColor = 'rgba(99, 102, 241, 0.35)';
    }
    if (cursorDot) cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

/* ===== ENHANCED INTERSECTION OBSERVER — STAGGERED REVEAL (MereqTech-style) ===== */
const revealElements = document.querySelectorAll(
  '.section-header, .service-card, .portfolio__card, .process__step, ' +
  '.founder__profile-card, .founder__stat-card, ' +
  '.contact__info-side, .contact__form-side, .hero__stats'
);

revealElements.forEach((el, i) => {
  el.classList.add('reveal');

  // Add directional animations based on position
  const parent = el.parentElement;
  // Staggering logic for grid items
  const siblings = Array.from(parent.children).filter(c =>
    c.classList.contains('service-card') ||
    c.classList.contains('portfolio__card') ||
    c.classList.contains('process__step') ||
    c.classList.contains('founder__stat-card')
  );
  const index = siblings.indexOf(el);

  if (index >= 0 && index < 8) {
    el.classList.add(`reveal-delay-${index + 1}`);
  }

  // Specific reveals
  if (el.classList.contains('founder__profile-card')) {
    el.classList.add('reveal--scale');
  }

  // Contact: info from left, form from right
  if (el.classList.contains('contact__info-side')) {
    el.classList.add('reveal--left');
  }
  if (el.classList.contains('contact__form-side')) {
    el.classList.add('reveal--right');
  }
});

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.06, rootMargin: '0px 0px -20px 0px' }
);
revealElements.forEach(el => revealObserver.observe(el));

/* ===== ANIMATED COUNTERS ===== */
const counterSections = document.querySelectorAll('.hero__stats, .about__metrics, .founder__stats-row, .founder__experience');
const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('[data-count]');
        counters.forEach(counter => {
          const target = parseInt(counter.getAttribute('data-count'));
          const duration = 1100;
          const startTime = performance.now();
          function update(t) {
            const elapsed = t - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            counter.textContent = Math.round(target * eased);
            if (progress < 1) requestAnimationFrame(update);
            else counter.textContent = target;
          }
          requestAnimationFrame(update);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);
counterSections.forEach(s => counterObserver.observe(s));

/* ===== 3D TILT ON SERVICE CARDS ===== */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    // Move glow to follow mouse
    const glow = card.querySelector('.service-card__glow');
    if (glow) {
      glow.style.left = `${x - 110}px`;
      glow.style.top = `${y - 110}px`;
      glow.style.opacity = '1';
    }
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
    const glow = card.querySelector('.service-card__glow');
    if (glow) glow.style.opacity = '0';
  });
});

/* ===== MAGNETIC BUTTONS ===== */
document.querySelectorAll('.btn--primary, .nav__cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px) translateY(-3px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});

/* ===== PARALLAX GHOST TEXT (MereqTech-style) ===== */
function addGhostText() {
  const ghostTextConfig = [
    { selector: '#services', text: 'Services' },
    { selector: '#portfolio', text: 'Recent Works' },
    { selector: '#about', text: 'Founder' },
    { selector: '#contact', text: 'Say Hello' }
  ];

  ghostTextConfig.forEach(({ selector, text }) => {
    const section = document.querySelector(selector);
    if (section) {
      const ghostEl = document.createElement('div');
      ghostEl.className = 'section-ghost-text';
      ghostEl.textContent = text;
      ghostEl.setAttribute('aria-hidden', 'true');
      section.style.position = 'relative';
      section.style.overflow = 'hidden';
      section.insertBefore(ghostEl, section.firstChild);
    }
  });
}
addGhostText();

/* Parallax effect on ghost text */
let ghostTicking = false;
window.addEventListener('scroll', () => {
  if (!ghostTicking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      document.querySelectorAll('.section-ghost-text').forEach(ghost => {
        const section = ghost.parentElement;
        const rect = section.getBoundingClientRect();
        // Only apply parallax when section is in view
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          const offset = (progress - 0.5) * 80; // Subtle parallax offset
          ghost.style.transform = `translateY(calc(-50% + ${offset}px))`;
        }
      });
      ghostTicking = false;
    });
    ghostTicking = true;
  }
}, { passive: true });

/* ===== PARALLAX ===== */
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const heroVisual = document.querySelector('.hero__visual');
      if (heroVisual && scrollY < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrollY * 0.12}px)`;
      }
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

/* ===== FORM SUBMISSION (Formspree) ===== */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.btn');
    const originalHTML = btn.innerHTML;

    // 1. Change button state to sending
    btn.innerHTML = '<span class="btn__bg"></span><span class="btn__text">Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
    btn.style.pointerEvents = 'none';

    // 2. Prepare data
    const formData = new FormData(contactForm);

    try {
      // 3. Send to Formspree
      // NOTE: Replace 'YOUR_FORMSPREE_ID' in index.html with your actual ID from formspree.io
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        // Success state
        btn.innerHTML = '<span class="btn__bg" style="background:linear-gradient(135deg,#10b981,#059669)"></span><span class="btn__text">Message Sent!</span> <i class="fa-solid fa-check"></i>';
        contactForm.reset();

        // Return button to original state after delay
        setTimeout(() => {
          btn.innerHTML = originalHTML;
          btn.style.pointerEvents = '';
        }, 2500);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Formspree error');
      }
    } catch (error) {
      // Error state
      console.error('Form Error:', error);
      btn.innerHTML = '<span class="btn__bg" style="background:linear-gradient(135deg,#ef4444,#dc2626)"></span><span class="btn__text">Config Required!</span> <i class="fa-solid fa-triangle-exclamation"></i>';

      // Provide a helpful hint
      alert("Almost there! To make this work:\n1. Go to Formspree.io and create a free account.\n2. Create a 'New Form' and copy the 'Form ID'.\n3. Replace 'YOUR_FORMSPREE_ID' in your index.html file with your real ID.");

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.pointerEvents = '';
      }, 5000);
    }
  });
}

/* ===== HERO TITLE ANIMATION (Enhanced MereqTech-style stagger) ===== */
window.addEventListener('load', () => {
  document.body.style.opacity = '1';
  // Stagger hero title lines with MereqTech-style clip reveal
  document.querySelectorAll('.hero__title-line').forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(50px)';
    line.style.transition = `opacity 0.45s cubic-bezier(0.22, 1, 0.36, 1) ${0.15 + i * 0.08}s, transform 0.45s cubic-bezier(0.22, 1, 0.36, 1) ${0.15 + i * 0.08}s`;
    requestAnimationFrame(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    });
  });
});

/* ===== SMOOTH SCROLL PERFORMANCE ===== */
let scrollTimer;
window.addEventListener('scroll', () => {
  if (scrollTimer) return;
  scrollTimer = setTimeout(() => { scrollTimer = null; }, 16);
}, { passive: true });

/* ===== SMOOTH SECTION SCROLL (MereqTech-style smooth navigation) ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;

    const targetEl = document.querySelector(targetId);
    if (targetEl) {
      e.preventDefault();
      const headerHeight = document.getElementById('header').offsetHeight;
      const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});
