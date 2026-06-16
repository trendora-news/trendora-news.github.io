// Trendora — script.js

const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// Fade-in on scroll
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.post-card, .featured-card, .cat-pill, .float-card').forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
}

// Newsletter
const newsletterBtn = document.querySelector('.newsletter-form button');
if (newsletterBtn) {
  newsletterBtn.addEventListener('click', () => {
    const input = document.querySelector('.newsletter-form input');
    if (!input) return;
    if (input.value.includes('@')) {
      newsletterBtn.textContent = '✓ Subscribed!';
      newsletterBtn.style.background = '#16a34a';
      input.value = '';
    } else {
      input.style.borderColor = 'red';
      setTimeout(() => input.style.borderColor = '', 1500);
    }
  });
}

// ===== CURSOR SPRINKLE EFFECT =====
(function () {
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
  const colors = ['#0a84ff', '#ff6b1a', '#ffb000', '#6dd3ff', '#ffffff', '#16a34a', '#ff4dd8'];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 5 + 2;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedX = (Math.random() - 0.5) * 4;
      this.speedY = (Math.random() - 0.5) * 4 - 2;
      this.gravity = 0.12;
      this.life = 1;
      this.decay = Math.random() * 0.022 + 0.014;
      this.shape = Math.random() > 0.5 ? 'circle' : 'diamond';
      this.rotation = Math.random() * Math.PI * 2;
      this.rotSpeed = (Math.random() - 0.5) * 0.18;
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
        ctx.moveTo(0, -this.size);
        ctx.lineTo(this.size * 0.7, 0);
        ctx.lineTo(0, this.size);
        ctx.lineTo(-this.size * 0.7, 0);
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
    if (dist > 8) {
      const count = Math.min(Math.floor(dist / 6), 5);
      for (let i = 0; i < count; i++) particles.push(new Particle(e.clientX, e.clientY));
      lastX = e.clientX;
      lastY = e.clientY;
    }
  });

  document.addEventListener('click', (e) => {
    for (let i = 0; i < 18; i++) particles.push(new Particle(e.clientX, e.clientY));
  });

  window.addEventListener('scroll', () => {
    const delta = Math.abs(window.scrollY - lastScrollY);
    if (delta > 8) {
      const count = Math.min(Math.floor(delta / 12), 8);
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
})();
