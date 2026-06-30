/**
 * StayIndia — Hotel Directory
 * app.js — Core Application Engine (Location-Aware Edition)
 *
 * Boot order:
 *   1. firebase-config.js  (Firebase SDK stubs)
 *   2. data.js             (HOTELS, CITIES, helpers)
 *   3. location.js         (LocationEngine — detection & priority cascade)
 *   4. location-ui.js      (LocationUI — banner, switcher, sections)
 *   5. app.js              (this file — page init, nav, canvas, search, UI)
 */

'use strict';

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initBackToTop();
  initSmoothScroll();
  initFAQs();
  initFavourites();

  if (isPage('index.html') || isPage('')) {
    initHeroCanvas();
    initSearch();
    initStatsCounter();
    initTestimonials();
    renderSection('featuredGrid', getFeaturedHotels(6));
    renderSection('trendingGrid', getTrendingHotels(3));
    renderSection('hkpGrid',      getHKPHotels(3));
    renderSection('newGrid',      getNewHotels(3));
    renderSection('budgetGrid',   getBudgetHotels(3));
    renderCitiesGrid();
    // Location system — non-blocking
    LocationUI.initLocationSystem();
  }

  if (isPage('hotels.html'))       initHotelsPage();
  if (isPage('hotel-detail.html')) initDetailPage();
  if (isPage('register-hotel.html')) initRegisterPage();
});

function isPage(name) {
  const path = window.location.pathname;
  return path.endsWith(name) || path.endsWith('/' + name) ||
    (name === '' && (path === '/' || path.endsWith('/')));
}

/* ============================================================
   LOADER
   ============================================================ */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  document.body.style.overflow = 'hidden';
  window.addEventListener('load', () => {
    setTimeout(() => { loader.classList.add('hidden'); document.body.style.overflow = ''; }, 1900);
  });
}

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  let ticking = false;
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === path) link.classList.add('active');
  });
}

/* ============================================================
   MOBILE MENU
   ============================================================ */
function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open'); btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open'); btn.classList.remove('open');
    }
  });
}

/* ============================================================
   HERO CANVAS — Constellation particle system
   ============================================================ */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  let W, H, nodes;
  let isVisible = true;
  let rafId = null;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    nodes = Array.from({ length: Math.min(Math.floor(W * H / 14000), 80) }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2 + 1, opacity: Math.random() * 0.5 + 0.2,
    }));
  }

  function draw() {
    if (!isVisible) { rafId = null; return; } // stop loop when hero is offscreen
    ctx.clearRect(0, 0, W, H);
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(255,122,0,${(1 - dist / 140) * 0.12})`;
          ctx.lineWidth = 1; ctx.stroke();
        }
      }
    }
    nodes.forEach(n => {
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,175,55,${n.opacity})`; ctx.fill();
    });
    rafId = requestAnimationFrame(draw);
  }

  function startLoop() {
    if (!rafId) rafId = requestAnimationFrame(draw);
  }

  // Pause the particle animation when hero scrolls out of viewport —
  // saves CPU/battery and keeps scrolling smooth on long pages
  const visObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      isVisible = entry.isIntersecting;
      if (isVisible) startLoop();
    });
  }, { threshold: 0 });
  visObserver.observe(canvas);

  // Pause entirely when the browser tab itself is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { isVisible = false; }
    else if (canvas.getBoundingClientRect().bottom > 0) { isVisible = true; startLoop(); }
  });

  new ResizeObserver(resize).observe(canvas);
  resize();
  startLoop();
}

/* ============================================================
   SEARCH SYSTEM
   ============================================================ */
function initSearch() {
  const input       = document.getElementById('heroSearch');
  const suggestions = document.getElementById('searchSuggestions');
  if (!input || !suggestions) return;
  let debounceTimer;

  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const q = input.value.trim();
      if (q.length < 2) { suggestions.classList.remove('show'); return; }
      const results = getSuggestions(q);
      if (!results.length) { suggestions.classList.remove('show'); return; }
      suggestions.innerHTML = results.map(s => `
        <div class="suggestion-item" onclick="goSuggestion('${s.link}')">
          <span class="suggestion-icon">${s.icon}</span>
          <div class="suggestion-text">
            <strong>${highlight(s.label, q)}</strong>
            <small>${s.sub}</small>
          </div>
        </div>`).join('');
      suggestions.classList.add('show');
    }, 150);
  });

  document.addEventListener('click', e => {
    if (!input.closest('.search-field')?.contains(e.target)) suggestions.classList.remove('show');
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') doHeroSearch();
    if (e.key === 'Escape') suggestions.classList.remove('show');
  });

  document.querySelectorAll('.search-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const ph = { city:'Haridwar, Rishikesh, Delhi...', name:'Hotel name, resort, ashram...', area:'Har Ki Pauri, Laxman Jhula...' };
      input.placeholder = ph[tab.dataset.tab] || input.placeholder;
    });
  });
}

function highlight(text, query) {
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
  return text.replace(re, '<mark style="background:rgba(255,122,0,.25);color:var(--saffron);border-radius:2px">$1</mark>');
}
function goSuggestion(link) { window.location.href = link; }
function doHeroSearch() {
  const p = new URLSearchParams();
  const q = document.getElementById('heroSearch')?.value.trim();
  const cat = document.getElementById('heroCategory')?.value;
  const bud = document.getElementById('heroBudget')?.value;
  if (q) p.set('q', q); if (cat) p.set('type', cat); if (bud) p.set('budget', bud);
  window.location.href = `hotels.html?${p.toString()}`;
}

/* ============================================================
   SECTION RENDERERS
   ============================================================ */
function renderSection(gridId, hotels) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = renderSkeletons(Math.min(hotels.length || 3, 6));
  setTimeout(() => {
    grid.innerHTML = hotels.length
      ? hotels.map(renderHotelCard).join('')
      : '<p style="color:var(--gray-400);text-align:center;padding:3rem;grid-column:1/-1">No hotels found.</p>';
    initScrollReveal(); restoreFavourites();
  }, 400);
}

function renderCitiesGrid() {
  const grid = document.getElementById('citiesGrid');
  if (!grid) return;
  grid.innerHTML = CITIES.slice(0, 8).map(renderCityCard).join('');
  initScrollReveal();
}

/* ============================================================
   HOTEL NAVIGATION
   ============================================================ */
function openDetail(hotelId) { window.location.href = `hotel-detail.html?id=${hotelId}`; }

/* ============================================================
   FAVOURITES
   ============================================================ */
let favourites = new Set();
function initFavourites() {
  try { favourites = new Set(JSON.parse(localStorage.getItem('si_favourites') || '[]')); } catch { favourites = new Set(); }
  restoreFavourites();
}
function restoreFavourites() {
  favourites.forEach(id => {
    const btn = document.getElementById(`fav-${id}`);
    if (btn) { btn.textContent = '♥'; btn.classList.add('active'); }
  });
}
function toggleFav(e, hotelId) {
  e.stopPropagation();
  const btn = e.currentTarget;
  if (favourites.has(hotelId)) {
    favourites.delete(hotelId); btn.textContent = '♡'; btn.classList.remove('active');
    showToast('Removed from favourites', '');
  } else {
    favourites.add(hotelId); btn.textContent = '♥'; btn.classList.add('active');
    showToast('❤️ Saved to favourites!', 'success');
  }
  try { localStorage.setItem('si_favourites', JSON.stringify([...favourites])); } catch {}
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal:not(.visible), .reveal-right:not(.visible)');
  if (!els.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => observer.observe(el));
}

/* ============================================================
   STATS COUNTER
   ============================================================ */
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-num[data-count]');
  if (!stats.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { animateCount(e.target); observer.unobserve(e.target); } });
  }, { threshold: 0.5 });
  stats.forEach(el => observer.observe(el));
}
function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 2000; const start = performance.now();
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor((1 - Math.pow(1-p,3)) * target).toLocaleString('en-IN') + (p===1 ? '+' : '');
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ============================================================
   TESTIMONIALS CAROUSEL
   ============================================================ */
function initTestimonials() {
  const track = document.getElementById('testimonialTrack');
  const dots  = document.getElementById('testimonialDots');
  if (!track || !dots) return;
  const slides = track.querySelectorAll('.testimonial-slide');
  let current = 0; let timer;
  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    dots.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 't-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role','tab'); dot.setAttribute('aria-label', `Testimonial ${i+1}`);
    dot.addEventListener('click', () => { goTo(i); clearInterval(timer); timer = setInterval(() => goTo(current+1), 4500); });
    dots.appendChild(dot);
  });
  timer = setInterval(() => goTo(current + 1), 4500);
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  track.addEventListener('touchend',   e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); clearInterval(timer); timer = setInterval(() => goTo(current+1), 4500); }
  });
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
function initFAQs() {
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('keydown', e => { if (e.key==='Enter'||e.key===' ') { e.preventDefault(); toggleFaq(item); } });
    item.setAttribute('tabindex','0'); item.setAttribute('role','button');
  });
}
function toggleFaq(el) {
  const isOpen = el.classList.contains('open');
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) el.classList.add('open');
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href'); if (href === '#') return;
      const target = document.querySelector(href); if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 92, behavior: 'smooth' });
    });
  });
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.classList.toggle('show', window.scrollY > 500);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   AUTH MODAL
   ============================================================ */
function openAuth(tab = 'login') {
  const modal = document.getElementById('authModal');
  if (!modal) return;
  modal.style.display = 'flex'; document.body.style.overflow = 'hidden';
  switchAuthTab(tab);
}
function closeAuth() {
  const modal = document.getElementById('authModal');
  if (!modal) return;
  modal.style.display = 'none'; document.body.style.overflow = '';
}
function switchAuthTab(tab) {
  const lf = document.getElementById('loginForm');    const rf = document.getElementById('registerForm');
  const lt = document.getElementById('loginTab');     const rt = document.getElementById('registerTab');
  if (lf) lf.style.display = tab==='login' ? 'flex' : 'none';
  if (rf) rf.style.display = tab==='register' ? 'flex' : 'none';
  lt?.classList.toggle('active', tab==='login');
  rt?.classList.toggle('active', tab==='register');
}
function googleLogin() { showToast('🔧 Firebase Auth not configured yet. Add your Firebase config.', ''); }
document.addEventListener('click', e => { if (e.target.classList.contains('modal-overlay')) { closeAuth(); closeQuickView(); } });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeAuth(); closeQuickView(); } });
function closeQuickView() {
  const m = document.getElementById('quickViewModal');
  if (m) m.style.display = 'none'; document.body.style.overflow = '';
}

/* ============================================================
   TOAST
   ============================================================ */
let toastContainer;
function showToast(message, type = '') {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`; toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => { toast.style.animation='toastIn 0.3s ease reverse'; setTimeout(() => toast.remove(), 300); }, 2800);
}

/* ============================================================
   RIPPLE
   ============================================================ */
document.addEventListener('click', e => {
  const btn = e.target.closest('.ripple'); if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const circle = document.createElement('span');
  Object.assign(circle.style, {
    position:'absolute', width:size+'px', height:size+'px',
    left:e.clientX-rect.left-size/2+'px', top:e.clientY-rect.top-size/2+'px',
    background:'rgba(255,255,255,0.2)', borderRadius:'50%',
    transform:'scale(0)', animation:'rippleAnim 0.6s ease', pointerEvents:'none',
  });
  if (!document.getElementById('rippleStyle')) {
    const s = document.createElement('style'); s.id='rippleStyle';
    s.textContent='@keyframes rippleAnim{to{transform:scale(4);opacity:0}}';
    document.head.appendChild(s);
  }
  btn.appendChild(circle);
  circle.addEventListener('animationend', () => circle.remove());
});

/* ============================================================
   SHARE
   ============================================================ */
function shareHotel(hotel) {
  const url = `${window.location.origin}/hotel-detail.html?id=${hotel.id}`;
  if (navigator.share) navigator.share({ title:hotel.name, text:`Check out ${hotel.name} — ₹${hotel.price}/night!`, url }).catch(()=>{});
  else navigator.clipboard.writeText(url).then(() => showToast('🔗 Link copied!','success'));
}

/* ============================================================
   HOTELS PAGE
   ============================================================ */
function initHotelsPage() {
  const params = new URLSearchParams(window.location.search);
  const city = params.get('city')||'', type = params.get('type')||'', budget = params.get('budget')||'';
  const query = params.get('q')||'', sort = params.get('sort')||'featured', area = params.get('area')||'';

  let hotels = query ? searchHotels(query) : getHotels({ city:city||undefined, type:type||undefined, budget:budget||undefined, area, sort });

  let title = 'Browse Hotels';
  if (city)  title = `Hotels in ${city.charAt(0).toUpperCase()+city.slice(1)}`;
  if (type)  title = `${type.charAt(0).toUpperCase()+type.slice(1)} Hotels`;
  if (query) title = `Results for "${query}"`;

  const h1 = document.getElementById('pageTitle'); if (h1) h1.textContent = title;
  document.title = `${title} | StayIndia`;

  const grid = document.getElementById('hotelsMainGrid');
  if (grid) {
    grid.innerHTML = renderSkeletons(6);
    setTimeout(() => {
      grid.innerHTML = hotels.length
        ? hotels.slice(0,6).map(renderHotelCard).join('')
        : '<p style="color:var(--gray-400);text-align:center;padding:4rem;grid-column:1/-1">No hotels found. Try different filters.</p>';
      initScrollReveal(); restoreFavourites();
      const c = document.getElementById('hotelsCount'); if (c) c.innerHTML = `<strong>${hotels.length}</strong> hotels found`;
    }, 500);
  }

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.value = sort;
    sortSelect.addEventListener('change', () => { params.set('sort', sortSelect.value); window.location.search = params.toString(); });
  }
}

/* ============================================================
   DETAIL PAGE
   ============================================================ */
function initDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const hotelId = params.get('id');
  if (!hotelId) { window.location.href = 'hotels.html'; return; }
  window._detailHotel = getHotelById(hotelId);
  if (!window._detailHotel) window.location.href = 'hotels.html';
}

/* ============================================================
   REGISTER PAGE
   ============================================================ */
function initRegisterPage() {
  document.querySelectorAll('.plan-radio input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.plan-radio').forEach(r => r.classList.remove('selected'));
      if (radio.checked) radio.closest('.plan-radio').classList.add('selected');
    });
  });
  const uploadZone = document.getElementById('photoUploadZone');
  const photoInput = document.getElementById('photoInput');
  if (uploadZone && photoInput) {
    uploadZone.addEventListener('click', () => photoInput.click());
    uploadZone.addEventListener('dragover', e => { e.preventDefault(); uploadZone.style.borderColor='var(--saffron)'; });
    uploadZone.addEventListener('dragleave', () => { uploadZone.style.borderColor=''; });
    uploadZone.addEventListener('drop', e => { e.preventDefault(); uploadZone.style.borderColor=''; handleFiles(e.dataTransfer.files); });
    photoInput.addEventListener('change', () => handleFiles(photoInput.files));
  }
  document.getElementById('hotelRegistrationForm')?.addEventListener('submit', e => {
    e.preventDefault();
    showToast("✅ Application submitted! We'll review your photos within 48 hours.", 'success');
    e.target.reset();
  });
}
function handleFiles(files) {
  const count = files.length;
  const el = document.querySelector('.upload-text');
  if (el && count) el.innerHTML = `<strong style="color:var(--green)">✓ ${count} photo${count>1?'s':''} selected</strong><br><small>${Array.from(files).map(f=>f.name).join(', ').slice(0,80)}…</small>`;
}
