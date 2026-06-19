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

/* =========================================
   PORTFOLIO GALLERY — ENHANCED
   ========================================= */

/* --- Category Filter --- */
(function() {
  const filterBtns = document.querySelectorAll('.pf-btn');
  const portItems  = document.querySelectorAll('#portfolioGrid .port-item');
  const emptyState = document.getElementById('portfolioEmpty');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      let visible = 0;
      portItems.forEach(item => {
        const match = filter === 'all' || item.dataset.cat === filter;
        item.style.display = match ? '' : 'none';
        if (match) visible++;
      });
      if (emptyState) emptyState.style.display = visible === 0 ? 'block' : 'none';
    });
  });
})();

/* --- Lightbox --- */
(function() {
  const lb        = document.getElementById('portLightbox');
  const lbOverlay = document.getElementById('lbOverlay');
  const lbClose   = document.getElementById('lbClose');
  const lbPrev    = document.getElementById('lbPrev');
  const lbNext    = document.getElementById('lbNext');
  const lbImgWrap = document.getElementById('lbImgWrap');
  const lbCaption = document.getElementById('lbCaption');
  if (!lb) return;

  let currentItems = [];
  let currentIdx   = 0;

  function getVisibleItems() {
    return Array.from(document.querySelectorAll('#portfolioGrid .port-item')).filter(i => i.style.display !== 'none');
  }

  function openLightbox(idx) {
    currentItems = getVisibleItems();
    currentIdx   = idx;
    showItem();
    lb.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function showItem() {
    const item = currentItems[currentIdx];
    if (!item) return;
    lbImgWrap.innerHTML = '';
    const portImg = item.querySelector('.port-img');
    const svg = portImg.querySelector('svg');
    const img = portImg.querySelector('img');
    if (img) {
      const clone = img.cloneNode();
      clone.style.maxHeight = '80vh';
      clone.style.maxWidth  = '88vw';
      clone.style.borderRadius = '12px';
      lbImgWrap.appendChild(clone);
    } else if (svg) {
      const clone = svg.cloneNode(true);
      clone.style.maxHeight = '70vh';
      clone.style.maxWidth  = '88vw';
      clone.style.borderRadius = '12px';
      lbImgWrap.appendChild(clone);
    }
    const h4   = item.querySelector('h4');
    const span = item.querySelector('.port-cat-badge');
    lbCaption.textContent = (span ? span.textContent + ' — ' : '') + (h4 ? h4.textContent : '');
    lbPrev.style.display = currentItems.length > 1 ? '' : 'none';
    lbNext.style.display = currentItems.length > 1 ? '' : 'none';
  }

  function closeLightbox() {
    lb.style.display = 'none';
    document.body.style.overflow = '';
  }

  document.getElementById('portfolioGrid').addEventListener('click', e => {
    const btn  = e.target.closest('.port-zoom');
    const item = e.target.closest('.port-item');
    if (!item) return;
    const items = getVisibleItems();
    const idx   = items.indexOf(item);
    if (idx >= 0) openLightbox(idx);
  });

  lbOverlay.addEventListener('click', closeLightbox);
  lbClose.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', () => { currentIdx = (currentIdx - 1 + currentItems.length) % currentItems.length; showItem(); });
  lbNext.addEventListener('click', () => { currentIdx = (currentIdx + 1) % currentItems.length; showItem(); });
  document.addEventListener('keydown', e => {
    if (lb.style.display === 'none') return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') { currentIdx = (currentIdx - 1 + currentItems.length) % currentItems.length; showItem(); }
    if (e.key === 'ArrowRight') { currentIdx = (currentIdx + 1) % currentItems.length; showItem(); }
  });
})();

/* =========================================
   OWNER UPLOAD PANEL
   ========================================= */
(function() {
  // !! Change this to your real password !!
  const OWNER_PASSWORD = 'duplax2025';

  const unlockBtn   = document.getElementById('ownerUnlockBtn');
  const pwModal     = document.getElementById('pwModal');
  const pwOverlay   = document.getElementById('pwOverlay');
  const pwClose     = document.getElementById('pwClose');
  const pwInput     = document.getElementById('pwInput');
  const pwSubmit    = document.getElementById('pwSubmit');
  const pwError     = document.getElementById('pwError');
  const ownerPanel  = document.getElementById('ownerPanel');
  const panelClose  = document.getElementById('ownerPanelClose');
  const dropZone    = document.getElementById('ownerDropZone');
  const fileInput   = document.getElementById('ownerFileInput');
  const uploadMeta  = document.getElementById('ownerUploadMeta');
  const previewStrip= document.getElementById('ownerPreviewStrip');
  const addBtn      = document.getElementById('ownerAddBtn');
  const titleInput  = document.getElementById('ownerTitle');
  const catSelect   = document.getElementById('ownerCategory');
  const grid        = document.getElementById('portfolioGrid');

  if (!unlockBtn) return;

  let pendingFiles = [];
  let isUnlocked = false;

  unlockBtn.addEventListener('click', () => {
    if (isUnlocked) {
      ownerPanel.style.display = ownerPanel.style.display === 'none' ? '' : 'none';
      return;
    }
    pwModal.style.display = 'flex';
    pwOverlay.style.display = 'block';
    pwInput.value = '';
    pwError.style.display = 'none';
    setTimeout(() => pwInput.focus(), 50);
  });

  function closeModal() { pwModal.style.display = 'none'; pwOverlay.style.display = 'none'; }
  pwClose.addEventListener('click', closeModal);
  pwOverlay.addEventListener('click', closeModal);

  function tryUnlock() {
    if (pwInput.value === OWNER_PASSWORD) {
      isUnlocked = true;
      closeModal();
      ownerPanel.style.display = '';
      unlockBtn.innerHTML = '<i class="fas fa-lock-open"></i> Owner Panel';
      unlockBtn.classList.add('unlocked');
    } else {
      pwError.style.display = 'block';
      pwInput.select();
    }
  }
  pwSubmit.addEventListener('click', tryUnlock);
  pwInput.addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(); });

  panelClose.addEventListener('click', () => { ownerPanel.style.display = 'none'; });

  // Drag & drop
  ['dragenter','dragover'].forEach(ev => dropZone.addEventListener(ev, e => { e.preventDefault(); dropZone.classList.add('drag-over'); }));
  ['dragleave','drop'].forEach(ev => dropZone.addEventListener(ev, e => { e.preventDefault(); dropZone.classList.remove('drag-over'); }));
  dropZone.addEventListener('drop', e => handleFiles(e.dataTransfer.files));
  dropZone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => handleFiles(fileInput.files));

  function handleFiles(files) {
    pendingFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (!pendingFiles.length) return;
    previewStrip.innerHTML = '';
    pendingFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.className = 'prev-thumb';
        previewStrip.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
    uploadMeta.style.display = '';
  }

  addBtn.addEventListener('click', () => {
    if (!pendingFiles.length) return;
    const title = titleInput.value.trim() || 'Duplax Design';
    const cat   = catSelect.value;
    const catLabels = { logo:'Logo', flyer:'Flyer', poster:'Poster', card:'Business Card', brand:'Branding', print:'Print' };

    pendingFiles.forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = ev => {
        const item = document.createElement('div');
        item.className = 'port-item reveal-up';
        item.dataset.cat = cat;
        item.innerHTML = `
          <div class="port-img">
            <img src="${ev.target.result}" alt="${title}" />
          </div>
          <div class="port-overlay">
            <div class="port-info">
              <span class="port-cat-badge">${catLabels[cat] || cat}</span>
              <h4>${title}</h4>
            </div>
            <button class="port-zoom" aria-label="View full size"><i class="fas fa-expand-alt"></i></button>
          </div>`;
        grid.appendChild(item);
        // Re-apply current filter
        const activeFilter = document.querySelector('.pf-btn.active');
        const filter = activeFilter ? activeFilter.dataset.filter : 'all';
        if (filter !== 'all' && item.dataset.cat !== filter) item.style.display = 'none';
        // Trigger reveal
        requestAnimationFrame(() => item.classList.add('revealed'));
      };
      reader.readAsDataURL(file);
    });

    // Reset
    pendingFiles = [];
    fileInput.value = '';
    titleInput.value = '';
    previewStrip.innerHTML = '';
    uploadMeta.style.display = 'none';
    // Flash success
    addBtn.innerHTML = '<i class="fas fa-check"></i> Added!';
    setTimeout(() => { addBtn.innerHTML = '<i class="fas fa-plus"></i> Add to Portfolio'; }, 2500);
  });
})();

/* =========================================
   CUSTOMER REQUEST FORM
   ========================================= */
(function() {
  const pages   = [null, document.getElementById('reqPage1'), document.getElementById('reqPage2'), document.getElementById('reqPage3')];
  const steps   = document.querySelectorAll('.req-step');
  const form    = document.getElementById('requestForm');
  const success = document.getElementById('reqSuccess');
  if (!form) return;

  let currentPage = 1;

  function goTo(n) {
    pages[currentPage].style.display = 'none';
    currentPage = n;
    pages[currentPage].style.display = '';
    steps.forEach((s, i) => {
      s.classList.remove('active', 'done');
      if (i + 1 < n) s.classList.add('done');
      else if (i + 1 === n) s.classList.add('active');
    });
    if (steps[n - 1]) steps[n - 1].querySelector('span').innerHTML = n < currentPage ? '✓' : n;
  }

  document.getElementById('reqNext1').addEventListener('click', () => {
    const name = document.getElementById('reqName');
    const service = document.getElementById('reqService');
    if (!name.value.trim()) { name.focus(); return; }
    if (!service.value) { service.focus(); return; }
    goTo(2);
  });
  document.getElementById('reqNext2').addEventListener('click', () => {
    const brief = document.getElementById('reqBrief');
    if (!brief.value.trim()) { brief.focus(); return; }
    goTo(3);
  });
  document.getElementById('reqBack2').addEventListener('click', () => goTo(1));
  document.getElementById('reqBack3').addEventListener('click', () => goTo(2));

  // Customer file upload
  const reqDrop   = document.getElementById('reqDropZone');
  const reqFile   = document.getElementById('reqFileInput');
  const reqPreview= document.getElementById('reqPreviewStrip');
  let reqFiles    = [];
  const MAX_FILES = 5;

  ['dragenter','dragover'].forEach(ev => reqDrop.addEventListener(ev, e => { e.preventDefault(); reqDrop.classList.add('drag-over'); }));
  ['dragleave','drop'].forEach(ev => reqDrop.addEventListener(ev, e => { e.preventDefault(); reqDrop.classList.remove('drag-over'); }));
  reqDrop.addEventListener('drop', e => handleReqFiles(e.dataTransfer.files));
  reqDrop.addEventListener('click', () => reqFile.click());
  reqFile.addEventListener('change', () => handleReqFiles(reqFile.files));

  function handleReqFiles(files) {
    const newFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    reqFiles = [...reqFiles, ...newFiles].slice(0, MAX_FILES);
    renderReqPreviews();
  }

  function renderReqPreviews() {
    reqPreview.innerHTML = '';
    if (!reqFiles.length) { reqPreview.style.display = 'none'; return; }
    reqPreview.style.display = 'flex';
    reqFiles.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = e => {
        const wrap = document.createElement('div');
        wrap.className = 'prev-thumb-wrap';
        wrap.innerHTML = `<img src="${e.target.result}" class="prev-thumb" alt="reference" /><button class="remove-thumb" data-idx="${idx}" aria-label="Remove"><i class="fas fa-times"></i></button>`;
        reqPreview.appendChild(wrap);
        wrap.querySelector('.remove-thumb').addEventListener('click', () => {
          reqFiles.splice(idx, 1);
          renderReqPreviews();
        });
      };
      reader.readAsDataURL(file);
    });
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const submitBtn = document.getElementById('reqSubmit');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Build WhatsApp message with form data
    const name    = document.getElementById('reqName').value.trim();
    const phone   = document.getElementById('reqPhone').value.trim();
    const email   = document.getElementById('reqEmail').value.trim();
    const service = document.getElementById('reqService').value;
    const brief   = document.getElementById('reqBrief').value.trim();
    const budget  = document.getElementById('reqBudget').value;
    const deadline= document.getElementById('reqDeadline').value;
    const fileCount = reqFiles.length;

    const msg = encodeURIComponent(
      `Hi Duplax Graphics! I'd like to request a design.\n\n` +
      `Name: ${name}\nPhone: ${phone || 'Not provided'}\nEmail: ${email || 'Not provided'}\n` +
      `Service: ${service}\nBrief: ${brief}\n` +
      (budget ? `Budget: ${budget}\n` : '') +
      (deadline ? `Deadline: ${deadline}\n` : '') +
      (fileCount ? `\nI'll also send ${fileCount} reference image(s) separately.` : '')
    );

    // Show success, open WhatsApp
    setTimeout(() => {
      form.style.display = 'none';
      success.style.display = 'block';
      window.open(`https://wa.me/2205817505?text=${msg}`, '_blank');
    }, 1000);
  });
})();
