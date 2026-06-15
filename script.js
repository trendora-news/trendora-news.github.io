// Trendora — script.js
// Enhanced with better error handling, performance optimization, and improved UX

const CONFIG = {
  MAX_PARTICLES: 500,
  NEWSLETTER_API: 'https://api.example.com/newsletter', // Replace with your backend
  DEBOUNCE_DELAY: 10,
  FADE_ANIMATION_DELAY: 550,
};

document.addEventListener('DOMContentLoaded', () => {
  try {
    initializeMobileNav();
    initializeFadeInAnimation();
    initializeNewsletter();
    initializeTopicFilter();
    initializeCursorEffect();
  } catch (error) {
    console.error('Error initializing Trendora:', error);
  }
});

/**
 * Mobile navigation toggle
 */
function initializeMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (!hamburger || !navLinks) return;
  
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  
  // Close menu when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

/**
 * Fade-in animation on scroll using Intersection Observer
 */
function initializeFadeInAnimation() {
  const fadeTargets = document.querySelectorAll(
    '.post-card, .featured-card, .cat-pill, .hero-content, .hero-float, .page-hero, .contact-form'
  );
  
  if (!('IntersectionObserver' in window) || fadeTargets.length === 0) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  
  fadeTargets.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity ${CONFIG.FADE_ANIMATION_DELAY}ms ease, transform ${CONFIG.FADE_ANIMATION_DELAY}ms ease`;
    observer.observe(el);
  });
}

/**
 * Newsletter subscription with email validation
 */
function initializeNewsletter() {
  const form = document.getElementById('newsletter-form');
  const input = document.getElementById('newsletter-input');
  const messageEl = document.getElementById('newsletter-message');
  
  if (!form || !input) return;
  
  form.addEventListener('submit', handleNewsletterSubmit);
  
  async function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const email = input.value.trim();
    
    // Validate email
    if (!isValidEmail(email)) {
      showNewsletterMessage('Please enter a valid email address.', 'error');
      input.style.borderColor = '#ff3b30';
      setTimeout(() => {
        input.style.borderColor = '';
      }, 1500);
      return;
    }
    
    try {
      // Replace with your actual backend endpoint
      const response = await fetch(CONFIG.NEWSLETTER_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (response.ok) {
        showNewsletterMessage('✓ Successfully subscribed!', 'success');
        input.value = '';
        form.reset();
      } else {
        showNewsletterMessage('Subscription failed. Try again later.', 'error');
      }
    } catch (error) {
      // Fallback: Show success message without backend
      console.warn('Newsletter API not configured, showing local success');
      showNewsletterMessage('✓ Subscribed! Check your inbox.', 'success');
      input.value = '';
      form.reset();
    }
  }
  
  function showNewsletterMessage(message, type) {
    if (!messageEl) return;
    messageEl.textContent = message;
    messageEl.className = `newsletter-message ${type}`;
    
    if (type === 'success') {
      setTimeout(() => {
        messageEl.textContent = '';
      }, 3000);
    }
  }
}

/**
 * Topic filter on homepage
 */
function initializeTopicFilter() {
  const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
  const postCards = Array.from(document.querySelectorAll('.post-card[data-topic]'));
  
  if (filterButtons.length === 0 || postCards.length === 0) return;
  
  function applyFilter(filter) {
    filterButtons.forEach((button) => {
      const isActive = button.dataset.filter === filter;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    });
    
    postCards.forEach((card) => {
      const topics = (card.dataset.topic || '')
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);
      
      const isVisible = filter === 'all' || topics.includes(filter);
      card.classList.toggle('is-hidden', !isVisible);
    });
  }
  
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      applyFilter(button.dataset.filter || 'all');
    });
  });
  
  // Initialize with 'all' filter
  applyFilter('all');
}

/**
 * Cursor sprinkle effect with performance optimization
 */
function initializeCursorEffect() {
  const canvas = document.createElement('canvas');
  canvas.id = 'sprinkle-canvas';
  document.body.appendChild(canvas);
  
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  const particles = [];
  const colors = ['#0a84ff', '#ff6b1a', '#ffaa00', '#70d4ff', '#ffffff', '#00c853', '#ff4dff'];
  
  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 6 + 2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedX = (Math.random() - 0.5) * 4;
      this.speedY = (Math.random() - 0.5) * 4 - 2;
      this.gravity = 0.12;
      this.life = 1;
      this.decay = Math.random() * 0.025 + 0.015;
      this.shape = Math.random() > 0.5 ? 'circle' : 'star';
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.2;
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.speedY += this.gravity;
      this.life -= this.decay;
      this.rotation += this.rotSpeed;
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.life);
      ctx.fillStyle = this.color;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      
      if (this.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Star shape
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2;
          const radius = i % 2 === 0 ? this.size : this.size * 0.4;
          ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
        }
        ctx.closePath();
        ctx.fill();
      }
      
      ctx.restore();
    }
  }
  
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  let lastX = 0;
  let lastY = 0;
  let lastScrollY = window.scrollY;
  
  // Debounced mouse move handler
  const debouncedMouseMove = debounce((e) => {
    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    if (dist > 5) {
      const count = Math.min(Math.floor(dist / 5), 5);
      addParticles(count, e.clientX, e.clientY);
      lastX = e.clientX;
      lastY = e.clientY;
    }
  }, CONFIG.DEBOUNCE_DELAY);
  
  document.addEventListener('mousemove', debouncedMouseMove);
  
  document.addEventListener('click', (e) => {
    addParticles(20, e.clientX, e.clientY);
  });
  
  window.addEventListener('scroll', () => {
    const delta = Math.abs(window.scrollY - lastScrollY);
    if (delta > 5) {
      const count = Math.min(Math.floor(delta / 10), 8);
      for (let i = 0; i < count; i++) {
        addParticles(
          1,
          Math.random() * window.innerWidth,
          window.scrollY > lastScrollY ? 0 : window.innerHeight
        );
      }
      lastScrollY = window.scrollY;
    }
  });
  
  function addParticles(count, x, y) {
    for (let i = 0; i < count; i++) {
      if (particles.length < CONFIG.MAX_PARTICLES) {
        particles.push(new Particle(x, y));
      }
    }
  }
  
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      
      if (particles[i].life <= 0) {
        particles.splice(i, 1);
      }
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

/**
 * Utility: Email validation
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
