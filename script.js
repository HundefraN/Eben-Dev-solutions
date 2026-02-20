/* ======================================================================
   EBEN DEV SOLUTIONS — 2026 Futuristic JavaScript Engine
   MereqTech-Inspired Animations & Full-Screen Overlay Menu
   ====================================================================== */

const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

/* ===== PARTICLE CANVAS BACKGROUND ===== */
const canvas = document.getElementById('particle-canvas');
if (canvas && !isTouchDevice) { // Disable particles on touch devices for performance
  const ctx = canvas.getContext('2d');
  let particles = [];
  let mouse = { x: -1000, y: -1000 };
  let animationFrameId;

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.4 + 0.1;
      this.hue = Math.random() > 0.5 ? 221 : 42;
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
      const sat = '80%';
      const light = '70%';
      ctx.fillStyle = `hsla(${this.hue}, ${sat}, ${light}, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 80); // Reduced density
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
  }

  // Debounce resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(resizeCanvas, 100);
  });
  resizeCanvas();



  function drawConnections() {
    const strokeColor = '177, 148, 76'; // Gold
    const baseOpacity = 0.06;

    for (let i = 0; i < particles.length; i++) {
      // Optimization: check distance before drawing path
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy; // Use squared distance to avoid sqrt
        if (distSq < 16900) { // 130 * 130
          const dist = Math.sqrt(distSq);
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${strokeColor}, ${baseOpacity * (1 - dist / 130)})`;
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
    animationFrameId = requestAnimationFrame(animateParticles);
  }
  animateParticles();

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
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
  // Add touchstart for faster response on mobile
  navToggle.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Prevent ghost click
    toggleMenu();
  }, { passive: false });
}

// Close menu when clicking a menu item
overlayMenuItems.forEach(item => {
  const close = () => {
    if (menuOpen) toggleMenu();
  };
  item.addEventListener('click', close);
});

// Close menu with Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && menuOpen) {
    toggleMenu();
  }
});

/* ===== SCROLL-BASED ACTIVE LINK & HEADER ===== */
const sections = document.querySelectorAll('section[id]');
const header = document.getElementById('header');
const scrollUpBtn = document.getElementById('scroll-up');

function handleScroll() {
  const scrollY = window.pageYOffset;

  // Active Link
  sections.forEach(section => {
    const sectionHeight = section.offsetHeight;
    const sectionTop = section.offsetTop - 120;
    const sectionId = section.getAttribute('id');

    // Only update if menu is actually visible or relevant (optimization)
    if (menuOpen) {
      overlayMenuItems.forEach(item => {
        if (item.getAttribute('href') === `#${sectionId}`) {
          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            item.style.color = 'var(--accent-primary)';
          } else {
            item.style.color = '';
          }
        }
      });
    }
  });

  // Header Background
  if (header) {
    if (scrollY >= 50) header.classList.add('scroll-header');
    else header.classList.remove('scroll-header');
  }

  // Scroll Up Button
  if (scrollUpBtn) {
    if (scrollY >= 400) scrollUpBtn.classList.add('show-scroll');
    else scrollUpBtn.classList.remove('show-scroll');
  }
}

// Throttled Scroll Event
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
});
// Also add resize listener for scroll header adjustments if needed, but not critical.

/* ===== CUSTOM CURSOR ===== */
const cursorDot = document.querySelector('[data-cursor-dot]');
const cursorOutline = document.querySelector('[data-cursor-outline]');

if (!isTouchDevice) {
  if (cursorDot) {
    cursorDot.style.opacity = '0';
    cursorDot.style.transition = 'opacity 0.2s ease-in-out';
  }
  if (cursorOutline) {
    cursorOutline.style.opacity = '0';
    cursorOutline.style.transition = 'left 0.06s ease-out, top 0.06s ease-out, width 0.2s, height 0.2s, border-color 0.2s, opacity 0.2s ease-in-out';
  }

  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;
  let cursorVisible = false;

  window.addEventListener('mousemove', e => {
    if (!cursorVisible) {
      if (cursorDot) cursorDot.style.opacity = '1';
      if (cursorOutline) cursorOutline.style.opacity = '1';
      dotX = cursorX = e.clientX;
      dotY = cursorY = e.clientY;
      cursorVisible = true;
    } else {
      cursorX = e.clientX;
      cursorY = e.clientY;
    }
  });

  function animateCursor() {
    if (cursorVisible) {
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
        cursorOutline.style.borderColor = 'rgba(177, 148, 76, 0.5)';
      }
      if (cursorDot) cursorDot.style.transform = 'translate(-50%, -50%) scale(2)';
    });
    el.addEventListener('mouseleave', () => {
      if (cursorOutline) {
        cursorOutline.style.width = '42px';
        cursorOutline.style.height = '42px';
        cursorOutline.style.borderColor = 'rgba(177, 148, 76, 0.35)';
      }
      if (cursorDot) cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    });
  });
} else {
  // Hide custom cursor on touch devices to avoid ghost elements
  if (cursorDot) cursorDot.style.display = 'none';
  if (cursorOutline) cursorOutline.style.display = 'none';
}

/* ===== ENHANCED INTERSECTION OBSERVER — STAGGERED REVEAL (MereqTech-style) ===== */
const revealElements = document.querySelectorAll(
  '.section-header, .service-card, .portfolio__card, .process__step, ' +
  '.founder__profile-card, .founder__stat-card, ' +
  '.contact__info-side, .contact__form-side, .hero__stats'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 }); // Low threshold for earlier reveal on mobile

revealElements.forEach((el) => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* ===== TILT EFFECT FOR CARDS (Realistic & Free Style) ===== */
if (!isTouchDevice) {
  const tiltElements = document.querySelectorAll('.service-card, .hero__stats, .portfolio__card, .testimonial-card, .contact__card, .hero__float-card');

  tiltElements.forEach(el => {
    el.addEventListener('mousemove', handleTilt);
    el.addEventListener('mouseleave', resetTilt);
  });

  function handleTilt(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg rotation
    const rotateY = ((x - centerX) / centerX) * 10;

    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    el.style.transition = 'transform 0.1s ease-out';

    // Optional: Add glare effect if child exists
    // Fix: querySelector might return null if not found
    const glow = el.querySelector('.service-card__glow') || el.querySelector('.portfolio-card__glow') || el.querySelector('.founder__card-glow');
    if (glow) {
      glow.style.opacity = '1';
      glow.style.left = `${x - 110}px`; // Center the 220px glow
      glow.style.top = `${y - 110}px`;
    }
  }

  function resetTilt(e) {
    const el = e.currentTarget;
    el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    el.style.transition = 'transform 0.5s ease';

    const glow = el.querySelector('.service-card__glow') || el.querySelector('.portfolio-card__glow') || el.querySelector('.founder__card-glow');
    if (glow) {
      glow.style.opacity = '0';
    }
  }
}

/* ===== ANIMATE STATS NUMBERS ===== */
const stats = document.querySelectorAll('.hero__stat-number, .founder__stat-number');

const statsObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target;
      const countAttr = target.getAttribute('data-count');

      if (countAttr) {
        const countTo = parseInt(countAttr);
        if (!isNaN(countTo)) {
          let count = 0;
          const duration = 2000; // 2 seconds
          const increment = countTo / (duration / 16); // 60fps

          const updateCount = () => {
            count += increment;
            if (count < countTo) {
              target.innerText = Math.ceil(count);
              requestAnimationFrame(updateCount);
            } else {
              target.innerText = countTo;
            }
          };

          updateCount();
        }
      }
      observer.unobserve(target);
    }
  });
}, { threshold: 0.1 });

stats.forEach(stat => {
  statsObserver.observe(stat);
});

/* ===== VIDEO PLAYBACK CONTROL ===== */
const videos = document.querySelectorAll('.portfolio__video');
videos.forEach(video => {
  video.addEventListener('play', () => {
    videos.forEach(v => {
      if (v !== video) {
        v.pause();
      }
    });
  });
});

/* ===== CONTACT FORM AJAX SUBMISSION ===== */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn__text');
    const originalText = btnText.innerText;

    // Set to loading
    btnText.innerText = 'Sending...';
    submitBtn.style.pointerEvents = 'none';

    fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: {
        'Accept': 'application/json'
      }
    }).then(response => {
      if (response.ok) {
        btnText.innerText = 'Message Sent!';
        contactForm.reset();
      } else {
        btnText.innerText = 'Error! Try again.';
      }
    }).catch(error => {
      btnText.innerText = 'Error! Try again.';
    }).finally(() => {
      // Revert text after 3 seconds
      setTimeout(() => {
        btnText.innerText = originalText;
        submitBtn.style.pointerEvents = 'auto';
      }, 3000);
    });
  });
}
