// Trendora — script.js

// Mobile nav toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
}

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity = '1';
      e.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.post-card, .featured-card, .cat-pill').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Newsletter
const newsletterBtn = document.querySelector('.newsletter-form button');
if (newsletterBtn) {
  newsletterBtn.addEventListener('click', () => {
    const input = document.querySelector('.newsletter-form input');
    if (input && input.value.includes('@')) {
      newsletterBtn.textContent = '✓ Subscribed!';
      newsletterBtn.style.background = '#22c55e';
      input.value = '';
    } else {
      input.style.borderColor = 'red';
      setTimeout(() => input.style.borderColor = '', 1500);
    }
  });
}

// ===== CURSOR SPRINKLE EFFECT =====
(function() {
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
  const colors = ['#1d9bf0', '#ff6b1a', '#ffaa00', '#70d4ff', '#ffffff', '#00ff88', '#ff4dff'];

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
        // Draw a small star/diamond
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2;
          const r = i % 2 === 0 ? this.size : this.size * 0.4;
          ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();
    }
  }

  let mouseX = 0, mouseY = 0;
  let lastX = 0, lastY = 0;
  let frameCount = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const dist = Math.hypot(mouseX - lastX, mouseY - lastY);
    if (dist > 5) {
      const count = Math.min(Math.floor(dist / 5), 5);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(mouseX, mouseY));
      }
      lastX = mouseX;
      lastY = mouseY;
    }
  });

  // Burst on click
  document.addEventListener('click', (e) => {
    for (let i = 0; i < 20; i++) {
      particles.push(new Particle(e.clientX, e.clientY));
    }
  });

  // Scroll sprinkles
  let lastScrollY = window.scrollY;
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
})();
