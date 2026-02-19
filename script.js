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
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    for (let i = 0; i < count; i++) particles.push(new Particle());
  }
  initParticles();

  function drawConnections() {
    const strokeColor = '177, 148, 76'; // Gold
    const baseOpacity = 0.06;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
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
}, { threshold: 0.1 });

revealElements.forEach((el) => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* ===== TILT EFFECT FOR CARDS (Realistic & Free Style) ===== */
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
  const glow = el.querySelector('.service-card__glow');
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
  
  const glow = el.querySelector('.service-card__glow');
  if (glow) {
    glow.style.opacity = '0';
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
}, { threshold: 0.5 });

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

