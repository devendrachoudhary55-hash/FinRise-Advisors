// ===== NAVBAR SCROLL =====
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }
}, { passive: true });

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ===== COUNTER ANIMATION =====
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  if (isNaN(target)) return;
  if (el.dataset.animated) return;
  el.dataset.animated = 'true';

  const duration = 1600;
  const startTime = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const value = Math.floor(easeOut(progress) * target);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }

  requestAnimationFrame(update);
}

// ===== INTERSECTION OBSERVER =====
const observerOpts = { threshold: 0.15, rootMargin: '0px 0px -40px 0px' };

// Fade-up animation observer
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOpts);

document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

// Counter observer — watches any element containing [data-count]
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('[data-count]').forEach(animateCounter);
    }
  });
}, { threshold: 0.2 });

// Observe sections that contain counters
document.querySelectorAll('.hero, .stats-bar, .stats-inner').forEach(el => {
  counterObserver.observe(el);
});

// Also observe individual hero cards
document.querySelectorAll('.hero-card').forEach(el => {
  counterObserver.observe(el);
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    const data = Object.fromEntries(new FormData(contactForm));

    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      if (result.success) {
        contactForm.innerHTML = `
          <div class="form-success">
            <div class="success-icon"><i class="fas fa-check"></i></div>
            <h3>Message Sent!</h3>
            <p>Thank you for reaching out. We'll respond within one business day.</p>
          </div>`;
      } else {
        btn.innerHTML = original;
        btn.disabled = false;
      }
    } catch {
      btn.innerHTML = original;
      btn.disabled = false;
    }
  });
}

// ===== SERVICE CARDS STAGGER =====
// Add stagger delays to service cards for a nicer entrance
document.querySelectorAll('.service-card.fade-up').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.08}s`;
});

document.querySelectorAll('.testimonial-card.fade-up').forEach((card, i) => {
  card.style.transitionDelay = `${i * 0.1}s`;
});
