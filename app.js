/* ═══════════════════════════════════════════════════════════════
   GÜRKAN YILMAZ THE BARBER — JavaScript
   ═══════════════════════════════════════════════════════════════ */

/* ── Navigation scroll behavior ─────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

/* ── Mobile menu toggle ─────────────────────────────────────────── */
function toggleMenu() {
  const links = document.getElementById('navLinks');
  links.classList.toggle('open');
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
  });
});

/* ── Smooth scroll to reservation ───────────────────────────────── */
function scrollToReservation() {
  document.getElementById('reservation').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ── Scroll reveal IntersectionObserver ─────────────────────────── */
const revealElements = document.querySelectorAll('[data-scroll-reveal]');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger children if parent has multiple reveal-children
        const delay = idx * 0.05;
        entry.target.style.transitionDelay = `${delay}s`;
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -48px 0px' }
);

revealElements.forEach(el => revealObserver.observe(el));

/* ── Multi-step reservation form ────────────────────────────────── */
let currentStep = 1;

function nextStep(targetStep) {
  // Validate before advancing
  if (targetStep > currentStep) {
    if (currentStep === 1) {
      const selected = document.querySelector('input[name="service"]:checked');
      if (!selected) {
        showFormError('Lütfen bir hizmet seçin.');
        return;
      }
    }
    if (currentStep === 2) {
      const date = document.getElementById('rezDate').value;
      const time = document.getElementById('rezTime').value;
      if (!date || !time) {
        showFormError('Lütfen tarih ve saat seçin.');
        return;
      }
      // Validate date is in the future
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        showFormError('Lütfen gelecekteki bir tarih seçin.');
        return;
      }
    }
  }

  // Hide current step
  const current = document.getElementById(`step${currentStep}`);
  if (current) current.classList.remove('active');

  // Show target step
  const target = document.getElementById(`step${targetStep}`);
  if (target) {
    target.classList.add('active');
    currentStep = targetStep;
  }
}

function showFormError(msg) {
  // Remove any existing error
  const existing = document.querySelector('.form-error-msg');
  if (existing) existing.remove();

  const err = document.createElement('div');
  err.className = 'form-error-msg';
  err.style.cssText = `
    background: #fff0f0;
    border: 1px solid #ffcccc;
    color: #cc0000;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 16px;
    animation: fadeIn 0.2s ease;
  `;
  err.textContent = msg;

  const activeStep = document.querySelector('.form-step.active');
  if (activeStep) {
    const firstBtn = activeStep.querySelector('.form-next-btn, .form-nav');
    activeStep.insertBefore(err, firstBtn);
  }

  setTimeout(() => err.remove(), 3000);
}

function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('rezName').value.trim();
  const phone = document.getElementById('rezPhone').value.trim();

  if (!name || !phone) {
    showFormError('Lütfen ad soyad ve telefon numaranızı girin.');
    return;
  }

  // Hide all steps, show success
  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  document.getElementById('formSuccess').style.display = 'flex';
  document.getElementById('formSuccess').style.flexDirection = 'column';
  document.getElementById('formSuccess').style.alignItems = 'center';

  // Animate success icon
  const icon = document.querySelector('.success-icon');
  if (icon) {
    icon.style.animation = 'successPop 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
  }
}

function resetForm() {
  document.getElementById('reservationForm').reset();
  document.getElementById('formSuccess').style.display = 'none';

  document.querySelectorAll('.form-step').forEach(s => s.classList.remove('active'));
  const step1 = document.getElementById('step1');
  if (step1) step1.classList.add('active');
  currentStep = 1;
}

/* ── Set minimum date for date input ─────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('rezDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  // Add keyframe animations dynamically
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes successPop {
      0% { transform: scale(0.5); }
      70% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
  `;
  document.head.appendChild(styleTag);
});

/* ── Parallax effect on hero ─────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-video');
  if (hero) {
    const scrolled = window.pageYOffset;
    hero.style.transform = `translateY(${scrolled * 0.35}px)`;
  }
});

/* ── Gallery hover entrance animation ───────────────────────────── */
document.querySelectorAll('.gallery-item').forEach((item, i) => {
  item.style.transitionDelay = `${i * 0.06}s`;
  item.setAttribute('data-scroll-reveal', '');
  revealObserver.observe(item);
});

/* ── Active nav link highlight on scroll ──────────────────────────  */
const sections = document.querySelectorAll('section[id], footer[id]');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active-link');
          }
        });
      }
    });
  },
  { threshold: 0.3 }
);

sections.forEach(s => navObserver.observe(s));

// Add active link style dynamically
const navStyle = document.createElement('style');
navStyle.textContent = `.nav-link.active-link { color: var(--black) !important; font-weight: 600; }`;
document.head.appendChild(navStyle);
