/**
 * StayIndia — Hotel Directory
 * app.js — Core Application Engine
 * Handles: Loader, Nav, Canvas Hero, Search, Cards, Modals,
 *          Stats Counter, Scroll Reveal, Testimonials, FAQs,
 *          Favourites (localStorage), Toasts, Back-to-top
 */

'use strict';

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initNavbar();
  initHeroCanvas();
  initSearch();
  initScrollReveal();
  initBackToTop();
  initMobileMenu();
  initTestimonials();
  initFAQs();
  initFavourites();
  initStatsCounter();
  initSmoothScroll();

  // Render homepage sections
  renderSection('featuredGrid',  getFeaturedHotels(6));
  renderSection('trendingGrid',  getTrendingHotels(3));
  renderSection('hkpGrid',       getHKPHotels(3));
  renderSection('newGrid',       getNewHotels(3));
  renderSection('budgetGrid',    getBudgetHotels(3));
  renderCitiesGrid();
});

/* ============================================================
   LOADER
   ============================================================ */
function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1900);
  });

  // Prevent scroll during load
  document.body.style.overflow = 'hidden';
}

/* ============================================================
   NAVBAR
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active link
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

  // Close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
      btn.classList.remove('open');
    }
  });
}

/* ============================================================
   HERO CANVAS — Constellation city map animation
   ============================================================ */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, nodes, animFrame;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    createNodes();
  }

  function createNodes() {
    const count = Math.min(Math.floor((W * H) / 14000), 80);
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Update positions
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // Draw connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 140;
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(255,122,0,${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    // Draw nodes
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212,175,55,${n.opacity})`;
      ctx.fill();
    });

    animFrame = requestAnimationFrame(draw);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  draw();
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
      if (q.length < 2) {
        suggestions.classList.remove('show');
        return;
      }
      const results = getSuggestions(q);
      if (!results.length) { suggestions.classList.remove('show'); return; }

      suggestions.innerHTML = results.map(s => `
        <div class="suggestion-item" onclick="goSuggestion('${s.link}')">
          <span class="suggestion-icon">${s.icon}</span>
          <div class="suggestion-text">
            <strong>${highlight(s.label, q)}</strong>
            <small>${s.sub}</small>
          </div>
        </div>
      `).join('');
      suggestions.classList.add('show');
    }, 150);
  });

  // Hide suggestions on outside click
  document.addEventListener('click', e => {
    if (!input.closest('.search-field').contains(e.target)) {
      suggestions.classList.remove('show');
    }
  });

  // Enter key search
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') doHeroSearch();
    if (e.key === 'Escape') suggestions.classList.remove('show');
  });

  // Search tabs
  document.querySelectorAll('.search-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.search-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const placeholders = {
        city:  'Haridwar, Rishikesh, Delhi...',
        name:  'Hotel name, resort, ashram...',
        area:  'Har Ki Pauri, Laxman Jhula...',
      };
      input.placeholder = placeholders[tab.dataset.tab] || input.placeholder;
    });
  });
}

function highlight(text, query) {
  const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
  return text.replace(re, '<mark style="background:rgba(255,122,0,.25);color:var(--saffron);border-radius:2px">$1</mark>');
}

function goSuggestion(link) {
  window.location.href = link;
}

function doHeroSearch() {
  const input    = document.getElementById('heroSearch');
  const category = document.getElementById('heroCategory');
  const budget   = document.getElementById('heroBudget');

  const params = new URLSearchParams();
  if (input?.value.trim()) params.set('q', input.value.trim());
  if (category?.value)     params.set('type', category.value);
  if (budget?.value)       params.set('budget', budget.value);

  window.location.href = `hotels.html?${params.toString()}`;
}

/* ============================================================
   RENDER SECTIONS
   ============================================================ */
function renderSection(gridId, hotels) {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  // Show skeletons first
  grid.innerHTML = renderSkeletons(Math.min(hotels.length || 3, 6));

  // Then render real cards with slight delay for feel
  setTimeout(() => {
    if (!hotels.length) {
      grid.innerHTML = '<p style="color:var(--gray-400);text-align:center;padding:3rem;grid-column:1/-1">No hotels found.</p>';
      return;
    }
    grid.innerHTML = hotels.map(renderHotelCard).join('');
    initScrollReveal(); // re-init for new elements
    restoreFavourites();
  }, 400);
}

function renderCitiesGrid() {
  const grid = document.getElementById('citiesGrid');
  if (!grid) return;
  grid.innerHTML = CITIES.slice(0, 8).map(renderCityCard).join('');
  initScrollReveal();
}

/* ============================================================
   HOTEL DETAIL MODAL (quick view)
   ============================================================ */
function openDetail(hotelId) {
  const hotel = getHotelById(hotelId);
  if (!hotel) return;

  // Navigate to detail page instead
  window.location.href = `hotel-detail.html?id=${hotelId}`;
}

/* ============================================================
   FAVOURITES (localStorage)
   ============================================================ */
let favourites = new Set();

function initFavourites() {
  try {
    const stored = JSON.parse(localStorage.getItem('si_favourites') || '[]');
    favourites = new Set(stored);
  } catch { favourites = new Set(); }
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
    favourites.delete(hotelId);
    btn.textContent = '♡';
    btn.classList.remove('active');
    showToast('Removed from favourites', '');
  } else {
    favourites.add(hotelId);
    btn.textContent = '♥';
    btn.classList.add('active');
    showToast('❤️ Saved to favourites!', 'success');
  }

  try { localStorage.setItem('si_favourites', JSON.stringify([...favourites])); } catch {}
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal:not(.visible), .reveal-right:not(.visible)');

  if (!elements.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================
   STATS COUNTER
   ============================================================ */
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-num[data-count]');
  if (!stats.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}

function animateCount(el) {
  const target   = parseInt(el.dataset.count, 10);
  const suffix   = el.dataset.suffix || (target >= 1000 ? '+' : '');
  const duration = 2000;
  const start    = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    const value    = Math.floor(eased * target);
    el.textContent = value.toLocaleString('en-IN') + (progress === 1 ? suffix : '');
    if (progress < 1) requestAnimationFrame(step);
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
  let current  = 0;
  let timer;

  function goTo(idx) {
    current = (idx + slides.length) % slides.length;
    // On mobile: scroll. On desktop: use translateX
    const slideWidth = slides[0].getBoundingClientRect().width + 24; // gap
    const isMobile   = window.innerWidth <= 768;
    if (isMobile) {
      track.scrollTo({ left: current * (slides[0].offsetWidth + 24), behavior: 'smooth' });
    } else {
      // show 3 at a time, but cycle
    }
    dots.querySelectorAll('.t-dot').forEach((d, i) => d.classList.toggle('active', i === current));
  }

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 't-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); resetTimer(); });
    dots.appendChild(dot);
  });

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 4500);
  }

  resetTimer();

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); resetTimer(); }
  });
}

/* ============================================================
   FAQ ACCORDION
   ============================================================ */
function initFAQs() {
  document.querySelectorAll('.faq-item').forEach(item => {
    // Already handled by onclick, but also support keyboard
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleFaq(item);
      }
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
  });
}

function toggleFaq(el) {
  const isOpen = el.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
  if (!isOpen) el.classList.add('open');
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 72;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - navH - 20,
        behavior: 'smooth',
      });
    });
  });
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   AUTH MODAL
   ============================================================ */
function openAuth(tab = 'login') {
  const modal = document.getElementById('authModal');
  if (!modal) return;
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
  switchAuthTab(tab);
}

function closeAuth() {
  const modal = document.getElementById('authModal');
  if (!modal) return;
  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function switchAuthTab(tab) {
  document.getElementById('loginForm').style.display    = tab === 'login'    ? 'flex' : 'none';
  document.getElementById('registerForm').style.display = tab === 'register' ? 'flex' : 'none';
  document.getElementById('loginTab').classList.toggle('active',    tab === 'login');
  document.getElementById('registerTab').classList.toggle('active', tab === 'register');
}

function googleLogin() {
  showToast('🔧 Firebase Auth not configured — add your Firebase config to enable Google login.', '');
}

// Close modals on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    closeAuth();
    closeQuickView();
  }
  if (e.target.id === 'authModal') closeAuth();
  if (e.target.id === 'quickViewModal') closeQuickView();
});

// ESC key closes modals
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeAuth(); closeQuickView(); }
});

function closeQuickView() {
  const m = document.getElementById('quickViewModal');
  if (m) m.style.display = 'none';
  document.body.style.overflow = '';
}

/* ============================================================
   TOAST NOTIFICATIONS
   ============================================================ */
let toastContainer;

function showToast(message, type = '') {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'toastIn 0.3s ease reverse';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

/* ============================================================
   RIPPLE EFFECT (enhance buttons)
   ============================================================ */
document.addEventListener('click', e => {
  const btn = e.target.closest('.ripple');
  if (!btn) return;
  const rect   = btn.getBoundingClientRect();
  const circle = document.createElement('span');
  const size   = Math.max(rect.width, rect.height);
  Object.assign(circle.style, {
    position: 'absolute',
    width: size + 'px', height: size + 'px',
    left: e.clientX - rect.left - size / 2 + 'px',
    top:  e.clientY - rect.top  - size / 2 + 'px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '50%',
    transform: 'scale(0)',
    animation: 'rippleAnim 0.6s ease',
    pointerEvents: 'none',
  });

  if (!document.getElementById('rippleStyle')) {
    const style = document.createElement('style');
    style.id = 'rippleStyle';
    style.textContent = '@keyframes rippleAnim{to{transform:scale(4);opacity:0}}';
    document.head.appendChild(style);
  }

  btn.appendChild(circle);
  circle.addEventListener('animationend', () => circle.remove());
});

/* ============================================================
   SHARE HOTEL
   ============================================================ */
function shareHotel(hotel) {
  const url  = `${window.location.origin}/hotel-detail.html?id=${hotel.id}`;
  const text = `Check out ${hotel.name} in ${hotel.city} — starting ₹${hotel.price}/night! 🏨`;

  if (navigator.share) {
    navigator.share({ title: hotel.name, text, url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => showToast('🔗 Link copied to clipboard!', 'success'));
  }
}

/* ============================================================
   HOTEL FILTER (for hotels.html)
   ============================================================ */
function initHotelsPage() {
  const params  = new URLSearchParams(window.location.search);
  const city    = params.get('city')   || '';
  const type    = params.get('type')   || '';
  const budget  = params.get('budget') || '';
  const query   = params.get('q')      || '';
  const sort    = params.get('sort')   || 'featured';
  const area    = params.get('area')   || '';
  const filter  = params.get('filter') || '';

  // Update page title
  let title = 'Browse Hotels';
  if (city)   title = `Hotels in ${city.charAt(0).toUpperCase()+city.slice(1)}`;
  if (type)   title = `${type.charAt(0).toUpperCase()+type.slice(1)} Hotels in India`;
  if (query)  title = `Search: "${query}"`;
  const h1 = document.getElementById('pageTitle');
  if (h1) h1.textContent = title;

  // Get filtered hotels
  let hotels;
  if (query) {
    hotels = searchHotels(query);
  } else {
    hotels = getHotels({ city, type: type || undefined, budget: budget || undefined, area, sort });
  }

  if (filter === 'featured') hotels = hotels.filter(h => h.badges.includes('featured'));

  // Render
  const grid = document.getElementById('hotelsMainGrid');
  if (grid) {
    grid.innerHTML = renderSkeletons(6);
    setTimeout(() => {
      grid.innerHTML = hotels.length
        ? hotels.map(renderHotelCard).join('')
        : '<p style="color:var(--gray-400);text-align:center;padding:4rem;grid-column:1/-1">No hotels match your search. Try adjusting your filters.</p>';
      initScrollReveal();
      restoreFavourites();

      const count = document.getElementById('hotelsCount');
      if (count) count.innerHTML = `<strong>${hotels.length}</strong> hotels found`;
    }, 500);
  }

  // Sort select
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.value = sort;
    sortSelect.addEventListener('change', () => {
      params.set('sort', sortSelect.value);
      window.location.search = params.toString();
    });
  }

  // Filter checkboxes
  document.querySelectorAll('.filter-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      const currentParams = new URLSearchParams(window.location.search);
      const filterKey = cb.dataset.filter;
      const filterVal = cb.dataset.value;
      if (cb.checked) currentParams.set(filterKey, filterVal);
      else currentParams.delete(filterKey);
      window.location.search = currentParams.toString();
    });
  });
}

/* ============================================================
   HOTEL DETAIL PAGE
   ============================================================ */
function initDetailPage() {
  const params  = new URLSearchParams(window.location.search);
  const hotelId = params.get('id');
  if (!hotelId) { window.location.href = 'hotels.html'; return; }

  const hotel = getHotelById(hotelId);
  if (!hotel) { window.location.href = 'hotels.html'; return; }

  // Set page title
  document.title = `${hotel.name} — ${hotel.city} | StayIndia`;

  // Gallery
  const galleryMain = document.getElementById('galleryMain');
  if (galleryMain) {
    galleryMain.innerHTML = `
      <div class="gallery-main" style="background:${hotel.gradient}">
        <div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:8rem">${hotel.emoji}</div>
      </div>
      <div class="gallery-side" style="background:${hotel.gradient};opacity:.7">
        <div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:4rem">${hotel.emoji}</div>
      </div>
      <div class="gallery-side" style="background:${hotel.gradient};opacity:.5;position:relative">
        <div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:4rem">${hotel.emoji}</div>
        <div class="gallery-more">+4 Photos</div>
      </div>`;
  }

  // Name, location, rating
  const nameEl = document.getElementById('hotelName');
  if (nameEl) nameEl.textContent = hotel.name;

  const locationEl = document.getElementById('hotelLocation');
  if (locationEl) locationEl.textContent = `📍 ${hotel.area}, ${hotel.city}, ${hotel.state} — ${hotel.pin}`;

  const ratingEl = document.getElementById('hotelRating');
  if (ratingEl) ratingEl.innerHTML = `
    <span class="rating-stars">${'★'.repeat(Math.floor(hotel.rating))}${hotel.rating % 1 ? '½' : ''}</span>
    <span class="rating-score">${hotel.rating}</span>
    <span class="rating-count">(${hotel.reviewCount} reviews)</span>`;

  const badgesEl = document.getElementById('hotelBadges');
  if (badgesEl) badgesEl.innerHTML = getBadgeHTML(hotel.badges);

  // Description
  const descEl = document.getElementById('hotelDescription');
  if (descEl) descEl.textContent = hotel.desc;

  // Amenities
  const amenEl = document.getElementById('hotelAmenities');
  if (amenEl) amenEl.innerHTML = hotel.amenities.map(a =>
    `<div class="amenity-item has"><span class="a-icon">${AMENITY_ICONS[a]||'✓'}</span>${a}</div>`
  ).join('');

  // Sidebar price & contact
  const priceEl = document.getElementById('sidebarPrice');
  if (priceEl) priceEl.innerHTML = `
    <span class="from">Starting from</span>
    <div class="amount">${formatPrice(hotel.price)}</div>
    <span class="per">per night</span>`;

  const waBtn = document.getElementById('waBtn');
  if (waBtn) {
    waBtn.href = `https://wa.me/${hotel.whatsapp}?text=Hi, I found your hotel on StayIndia and would like to know about room availability.`;
    waBtn.setAttribute('aria-label', `WhatsApp ${hotel.name}`);
  }
  const callBtn = document.getElementById('callBtn');
  if (callBtn) {
    callBtn.href = `tel:${hotel.phone}`;
    callBtn.setAttribute('aria-label', `Call ${hotel.name}`);
  }
  const dirBtn = document.getElementById('dirBtn');
  if (dirBtn) {
    dirBtn.href = `https://www.google.com/maps?q=${hotel.lat},${hotel.lng}`;
  }

  // Info rows
  const infoEl = document.getElementById('sidebarInfo');
  if (infoEl) infoEl.innerHTML = `
    <div><span>Check-in</span><span>${hotel.checkIn}</span></div>
    <div><span>Check-out</span><span>${hotel.checkOut}</span></div>
    <div><span>Type</span><span>${hotel.type.charAt(0).toUpperCase()+hotel.type.slice(1)}</span></div>
    <div><span>City</span><span>${hotel.city}</span></div>
    <div><span>PIN</span><span>${hotel.pin}</span></div>
    ${hotel.website ? `<div><span>Website</span><a href="${hotel.website}" target="_blank" style="color:var(--saffron)">Visit ↗</a></div>` : ''}`;

  // Reviews
  const reviewsEl = document.getElementById('hotelReviews');
  const hotelRevs = REVIEWS[hotelId] || [];
  if (reviewsEl) {
    if (hotelRevs.length) {
      reviewsEl.innerHTML = hotelRevs.map(r => `
        <div class="review-card">
          <div class="review-header">
            <div class="review-avatar">${r.name.charAt(0)}</div>
            <div>
              <div class="review-name">${r.name}</div>
              <div class="review-date">${r.date}</div>
            </div>
            <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
          </div>
          <p class="review-text">${r.text}</p>
        </div>`).join('');
    } else {
      reviewsEl.innerHTML = '<p style="color:var(--gray-400)">No reviews yet. Be the first to review!</p>';
    }
  }

  // Similar hotels
  const similarEl = document.getElementById('similarHotels');
  if (similarEl) {
    const similar = getSimilarHotels(hotel, 3);
    similarEl.innerHTML = similar.map(renderHotelCard).join('');
  }

  // Detail tab switching
  document.querySelectorAll('.detail-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.detail-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.detail-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.target);
      if (target) target.classList.add('active');
    });
  });

  // Map placeholder
  const mapEl = document.getElementById('hotelMap');
  if (mapEl) {
    mapEl.innerHTML = `
      <div style="height:280px;background:var(--navy-card);border:1px solid var(--navy-border);border-radius:var(--r-lg);display:flex;align-items:center;justify-content:center;flex-direction:column;gap:1rem;color:var(--gray-400)">
        <span style="font-size:3rem">🗺️</span>
        <p style="font-size:.875rem">Interactive map loads when Google Maps API is configured</p>
        <a href="https://www.google.com/maps?q=${hotel.lat},${hotel.lng}" target="_blank" class="btn-primary ripple">Open in Google Maps ↗</a>
      </div>`;
  }

  initScrollReveal();
  initFavourites();
}

/* ============================================================
   REGISTRATION PAGE (private)
   ============================================================ */
function initRegisterPage() {
  // Plan selection highlight
  document.querySelectorAll('.plan-radio').forEach(radio => {
    const input = radio.querySelector('input[type="radio"]');
    if (input) {
      input.addEventListener('change', () => {
        document.querySelectorAll('.plan-radio').forEach(r => r.classList.remove('selected'));
        if (input.checked) radio.classList.add('selected');
      });
    }
  });

  // Location cascade (State → City → Area)
  const stateSelect = document.getElementById('regState');
  const cityInput   = document.getElementById('regCity');
  if (stateSelect && cityInput) {
    stateSelect.addEventListener('change', () => {
      cityInput.value = '';
    });
  }

  // Photo upload
  const uploadZone  = document.getElementById('photoUploadZone');
  const photoInput  = document.getElementById('photoInput');
  if (uploadZone && photoInput) {
    uploadZone.addEventListener('click', () => photoInput.click());
    uploadZone.addEventListener('dragover', e => {
      e.preventDefault();
      uploadZone.style.borderColor = 'var(--saffron)';
    });
    uploadZone.addEventListener('dragleave', () => {
      uploadZone.style.borderColor = '';
    });
    uploadZone.addEventListener('drop', e => {
      e.preventDefault();
      uploadZone.style.borderColor = '';
      handleFiles(e.dataTransfer.files);
    });
    photoInput.addEventListener('change', () => handleFiles(photoInput.files));
  }

  // Form submit
  const form = document.getElementById('hotelRegistrationForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      showToast('✅ Application submitted! We\'ll review your photos within 48 hours.', 'success');
      form.reset();
    });
  }
}

function handleFiles(files) {
  const count = files.length;
  const uploadText = document.querySelector('.upload-text');
  if (uploadText && count) {
    uploadText.innerHTML = `<strong style="color:var(--green)">✓ ${count} photo${count>1?'s':''} selected</strong><br><small style="color:var(--gray-400)">${Array.from(files).map(f=>f.name).join(', ').slice(0,80)}...</small>`;
  }
}

/* ============================================================
   PAGE ROUTER
   ============================================================ */
const page = window.location.pathname.split('/').pop() || 'index.html';

if (page === 'hotels.html')       document.addEventListener('DOMContentLoaded', initHotelsPage);
if (page === 'hotel-detail.html') document.addEventListener('DOMContentLoaded', initDetailPage);
if (page === 'register-hotel.html' || page.includes('invite')) {
  document.addEventListener('DOMContentLoaded', initRegisterPage);
}
