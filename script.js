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
