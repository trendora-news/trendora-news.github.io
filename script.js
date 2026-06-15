// Trendora — script.js

document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Fade-in on scroll
  const fadeTargets = document.querySelectorAll('.post-card, .featured-card, .cat-pill, .hero-content, .hero-float, .page-hero, .contact-form');
  if ('IntersectionObserver' in window && fadeTargets.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.08 });

    fadeTargets.forEach((el) => {
      if (el.classList.contains('hero-content') || el.classList.contains('hero-float') || el.classList.contains('page-hero') || el.classList.contains('contact-form')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(18px)';
      } else {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
      }
      el.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
      observer.observe(el);
    });
  }

  // Newsletter
  const newsletterBtn = document.querySelector('.newsletter-form button');
  const newsletterInput = document.querySelector('.newsletter-form input');
  if (newsletterBtn && newsletterInput) {
    newsletterBtn.addEventListener('click', () => {
      if (newsletterInput.value.includes('@')) {
        newsletterBtn.textContent = '✓ Subscribed!';
        newsletterBtn.style.background = '#22c55e';
        newsletterInput.value = '';
      } else {
        newsletterInput.style.borderColor = 'red';
        setTimeout(() => {
          newsletterInput.style.borderColor = '';
        }, 1500);
      }
    });
  }

  // Topic filter on homepage
  const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
  const postCards = Array.from(document.querySelectorAll('.post-card[data-topic]'));
  if (filterButtons.length && postCards.length) {
    const applyFilter = (filter) => {
      filterButtons.forEach((button) => {
        const active = button.dataset.filter === filter;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });

      postCards.forEach((card) => {
        const topics = (card.dataset.topic || '').toLowerCase().split(/\s+/).filter(Boolean);
        const visible = filter === 'all' || topics.includes(filter);
        card.classList.toggle('is-hidden', !visible);
      });
    };

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => applyFilter(button.dataset.filter || 'all'));
    });

    applyFilter('all');
  }

  // ===== CURSOR SPRINKLE EFFECT =====
  const canvas = document.createElement('canvas');
  canvas.id = 'sprinkle-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

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

  let lastX = 0;
  let lastY = 0;
  let lastScrollY = window.scrollY;

  document.addEventListener('mousemove', (e) => {
    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    if (dist > 5) {
      const count = Math.min(Math.floor(dist / 5), 5);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
      }
      lastX = e.clientX;
      lastY = e.clientY;
    }
  });

  document.addEventListener('click', (e) => {
    for (let i = 0; i < 20; i++) {
      particles.push(new Particle(e.clientX, e.clientY));
    }
  });

  window.addEventListener('scroll', () => {
    const delta = Math.abs(window.scrollY - lastScrollY);
    if (delta > 5) {
      const count = Math.min(Math.floor(delta / 10), 8);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(
          Math.random() * window.innerWidth,
          window.scrollY > lastScrollY ? 0 : window.innerHeight
        ));
      }
      lastScrollY = window.scrollY;
    }
  });

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();
      if (particles[i].life <= 0) particles.splice(i, 1);
    }
    requestAnimationFrame(animate);
  }
  animate();
});
