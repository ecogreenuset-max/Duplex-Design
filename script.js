/* =========================================
   DUPLAX GRAPHICS — script.js
   ========================================= */

'use strict';

/* ===== PRELOADER ===== */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  setTimeout(() => {
    preloader.classList.add('hidden');
    // Trigger hero animations after preloader
    document.querySelectorAll('.hero .reveal-fade, .hero .reveal-up, .hero .reveal-right').forEach(el => {
      el.classList.add('revealed');
    });
  }, 1600);
});

/* ===== NAVBAR SCROLL ===== */
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

const handleNavbarScroll = () => {
  const scrollY = window.scrollY;
  if (scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScrollY = scrollY;
};

window.addEventListener('scroll', handleNavbarScroll, { passive: true });

/* ===== ACTIVE NAV LINK ===== */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const updateActiveLink = () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const sTop = section.offsetTop;
    const sHeight = section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollY >= sTop && scrollY < sTop + sHeight) {
      navLinks.forEach(link => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
      if (activeLink) activeLink.classList.add('active');
    }
  });
};

window.addEventListener('scroll', updateActiveLink, { passive: true });

/* ===== MOBILE MENU ===== */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
const mobileClose = document.getElementById('mobile-close');
const overlay   = document.getElementById('overlay');
const mobLinks  = document.querySelectorAll('.mob-link');

const openMenu = () => {
  hamburger.classList.add('active');
  mobileMenu.classList.add('open');
  overlay.classList.add('active');
  document.body.classList.add('menu-open');
  hamburger.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
};

const closeMenu = () => {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('open');
  overlay.classList.remove('active');
  document.body.classList.remove('menu-open');
  hamburger.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
};

hamburger && hamburger.addEventListener('click', openMenu);
mobileClose && mobileClose.addEventListener('click', closeMenu);
overlay && overlay.addEventListener('click', closeMenu);
mobLinks.forEach(link => link.addEventListener('click', closeMenu));

// ESC key closes menu
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offsetTop = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offsetTop, behavior: 'smooth' });
  });
});

/* ===== SCROLL REVEAL ===== */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

const revealEls = document.querySelectorAll('.reveal-fade, .reveal-up, .reveal-left, .reveal-right');
revealEls.forEach(el => {
  // Don't observe hero elements (they're triggered post-preloader)
  if (!el.closest('.hero')) {
    revealObserver.observe(el);
  }
});

/* ===== COUNTER ANIMATION ===== */
const counters = document.querySelectorAll('.stat-num[data-target]');

const animateCounter = (el) => {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 1800;
  const stepTime = 16;
  const totalSteps = duration / stepTime;
  let step = 0;

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  const timer = setInterval(() => {
    step++;
    const progress = easeOut(step / totalSteps);
    const current = Math.round(progress * target);
    el.textContent = current;
    if (step >= totalSteps) {
      el.textContent = target;
      clearInterval(timer);
    }
  }, stepTime);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach(counter => counterObserver.observe(counter));

/* ===== PORTFOLIO FILTER ===== */
const filterBtns = document.querySelectorAll('.pf-btn');
const portItems  = document.querySelectorAll('.port-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    filterBtns.forEach(b => b.classList.remove('active'));
    this.classList.add('active');

    const filter = this.getAttribute('data-filter');

    portItems.forEach(item => {
      if (filter === 'all' || item.getAttribute('data-cat') === filter) {
        item.classList.remove('hidden');
        item.style.opacity = '0';
        item.style.transform = 'scale(0.9)';
        requestAnimationFrame(() => {
          item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          item.style.opacity = '1';
          item.style.transform = 'scale(1)';
        });
      } else {
        item.classList.add('hidden');
      }
    });
  });
});

/* ===== TESTIMONIALS SLIDER ===== */
const cards    = document.querySelectorAll('.tcard');
const dotsWrap = document.getElementById('tDots');
const prevBtn  = document.getElementById('tPrev');
const nextBtn  = document.getElementById('tNext');
let currentSlide = 0;
let autoSlide;

const isMobile = () => window.innerWidth < 768;

// Build dots
if (dotsWrap && cards.length) {
  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'tsc-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
}

const getDots = () => document.querySelectorAll('.tsc-dot');

const goToSlide = (index) => {
  const dots = getDots();
  cards.forEach(c => c.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));

  if (isMobile()) {
    currentSlide = (index + cards.length) % cards.length;
    cards[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  } else {
    // Desktop: show groups of 3, highlight middle
    currentSlide = (index + cards.length) % cards.length;

    // Show all, highlight current
    cards.forEach((card, i) => {
      card.classList.remove('active');
      if (i === currentSlide) card.classList.add('active');
    });
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }
};

const nextSlide = () => goToSlide(currentSlide + 1);
const prevSlide = () => goToSlide(currentSlide - 1);

prevBtn && prevBtn.addEventListener('click', () => {
  prevSlide();
  resetAuto();
});
nextBtn && nextBtn.addEventListener('click', () => {
  nextSlide();
  resetAuto();
});

const startAuto = () => {
  autoSlide = setInterval(nextSlide, 4000);
};
const resetAuto = () => {
  clearInterval(autoSlide);
  startAuto();
};

// Initialize
if (cards.length) {
  cards[0].classList.add('active');
  startAuto();
}

// Pause on hover
const sliderEl = document.querySelector('.testimonials-slider');
sliderEl && sliderEl.addEventListener('mouseenter', () => clearInterval(autoSlide));
sliderEl && sliderEl.addEventListener('mouseleave', startAuto);

// Touch swipe
let touchStartX = 0;
sliderEl && sliderEl.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });
sliderEl && sliderEl.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 40) {
    diff > 0 ? nextSlide() : prevSlide();
    resetAuto();
  }
});

/* ===== FAQ ACCORDION ===== */
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const btn = item.querySelector('.faq-q');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');

    // Close all
    faqItems.forEach(f => {
      f.classList.remove('open');
      f.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });

    // Open clicked if was closed
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ===== CONTACT FORM ===== */
const form       = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const fname   = form.fname.value.trim();
    const email   = form.email.value.trim();
    const message = form.message.value.trim();

    // Basic validation
    if (!fname || !email || !message) {
      showStatus('error', '<i class="fas fa-exclamation-circle"></i> Please fill in all required fields.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('error', '<i class="fas fa-exclamation-circle"></i> Please enter a valid email address.');
      return;
    }

    // Simulate submission
    const submitBtn = form.querySelector('[type="submit"]');
    const btnText   = submitBtn.querySelector('span');
    const original  = btnText.textContent;

    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';

    setTimeout(() => {
      submitBtn.disabled = false;
      btnText.textContent = original;
      showStatus(
        'success',
        '<i class="fas fa-check-circle"></i> Message sent! We\'ll get back to you within hours.'
      );
      form.reset();
    }, 1800);
  });
}

function showStatus(type, html) {
  if (!formStatus) return;
  formStatus.className = 'form-status ' + type;
  formStatus.innerHTML = html;
  setTimeout(() => {
    formStatus.className = 'form-status';
    formStatus.innerHTML = '';
  }, 5000);
}

/* ===== BACK TO TOP ===== */
const backBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  if (!backBtn) return;
  if (window.scrollY > 500) {
    backBtn.classList.add('visible');
  } else {
    backBtn.classList.remove('visible');
  }
}, { passive: true });

backBtn && backBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ===== FOOTER YEAR ===== */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ===== NAVBAR HEIGHT CSS VAR ===== */
const setNavbarHeight = () => {
  if (navbar) {
    document.documentElement.style.setProperty('--navbar-h', navbar.offsetHeight + 'px');
  }
};
setNavbarHeight();
window.addEventListener('resize', setNavbarHeight);

/* ===== HERO PARALLAX (subtle) ===== */
const heroShapes = document.querySelectorAll('.shape');
if (heroShapes.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    heroShapes.forEach((shape, i) => {
      const speed = 0.08 + i * 0.04;
      shape.style.transform = `translateY(${scrollY * speed}px)`;
    });
  }, { passive: true });
}

/* ===== RESIZE: re-initialize slider display ===== */
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => goToSlide(currentSlide), 200);
});

/* ===== ACCESSIBILITY: keyboard navigation for FAQ ===== */
faqItems.forEach(item => {
  const btn = item.querySelector('.faq-q');
  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });
});

/* ===== PORTFOLIO ITEM FOCUS ACCESSIBILITY ===== */
portItems.forEach(item => {
  item.setAttribute('tabindex', '0');
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      item.querySelector('.port-overlay') &&
        item.querySelector('.port-overlay').style.setProperty('opacity', '1');
    }
  });
});
