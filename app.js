/**
 * HotelRadar — Core App
 * app.js
 */
'use strict';

/* ============================================================
   STATE
   ============================================================ */
let wishlist = new Set();

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  applySavedTheme();
  initMenu();
  initThemeSwitch();
  initWishlist();
  initBackToTop();
  initSheets();
  initSearchBar();
  injectMenuWishlistCount();

  const page = currentPage();
  if (page === 'index.html' || page === '') initHomePage();
  if (page === 'hotels.html') initHotelsPage();
  if (page === 'hotel-detail.html') initDetailPage();
  if (page === 'wishlist.html') initWishlistPage();
});

function currentPage() {
  const p = window.location.pathname.split('/').pop();
  return p || '';
}

/* ============================================================
   THEME (single toggle, in menu only)
   ============================================================ */
function applySavedTheme() {
  try {
    const saved = localStorage.getItem('hr_theme');
    if (saved === 'night') document.documentElement.setAttribute('data-theme', 'night');
  } catch {}
}

function initThemeSwitch() {
  const sw = document.getElementById('themeSwitch');
  if (!sw) return;
  const isNight = document.documentElement.getAttribute('data-theme') === 'night';
  sw.classList.toggle('on', isNight);

  sw.addEventListener('click', () => {
    const nowNight = document.documentElement.getAttribute('data-theme') === 'night';
    if (nowNight) {
      document.documentElement.removeAttribute('data-theme');
      try { localStorage.setItem('hr_theme', 'day'); } catch {}
      sw.classList.remove('on');
    } else {
      document.documentElement.setAttribute('data-theme', 'night');
      try { localStorage.setItem('hr_theme', 'night'); } catch {}
      sw.classList.add('on');
    }
  });
}

/* ============================================================
   SLIDE MENU
   ============================================================ */
function initMenu() {
  const btn = document.getElementById('menuBtn');
  const overlay = document.getElementById('menuOverlay');
  const panel = document.getElementById('menuPanel');
  const closeBtn = document.getElementById('menuClose');
  if (!btn || !overlay || !panel) return;

  const open = () => { overlay.classList.add('open'); panel.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { overlay.classList.remove('open'); panel.classList.remove('open'); document.body.style.overflow = ''; };

  btn.addEventListener('click', open);
  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', close);
  panel.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}

/* Show live wishlist count badge in the menu link + topbar icon */
function injectMenuWishlistCount() {
  const count = wishlist.size;
  const pill = document.getElementById('menuWishlistCount');
  if (pill) {
    if (count > 0) { pill.textContent = count; pill.style.display = 'inline-block'; }
    else pill.style.display = 'none';
  }
  const dot = document.getElementById('topbarWishlistDot');
  if (dot) dot.style.display = count > 0 ? 'block' : 'none';
}

/* ============================================================
   WISHLIST (localStorage, persists, has its own page)
   ============================================================ */
function initWishlist() {
  try { wishlist = new Set(JSON.parse(localStorage.getItem('hr_wishlist') || '[]')); }
  catch { wishlist = new Set(); }
  paintWishlistButtons();
  injectMenuWishlistCount();
}

function saveWishlist() {
  try { localStorage.setItem('hr_wishlist', JSON.stringify([...wishlist])); } catch {}
}

function paintWishlistButtons() {
  document.querySelectorAll('[data-fav-id]').forEach(btn => {
    const id = btn.dataset.favId;
    const on = wishlist.has(id);
    btn.classList.toggle('active', on);
    const svg = btn.querySelector('svg');
    if (svg) svg.setAttribute('fill', on ? 'currentColor' : 'none');
  });
}

function toggleWishlist(id, btnEl) {
  if (wishlist.has(id)) {
    wishlist.delete(id);
    showToast('Removed from wishlist');
  } else {
    wishlist.add(id);
    showToast('Saved to wishlist');
  }
  saveWishlist();
  paintWishlistButtons();
  injectMenuWishlistCount();
  if (currentPage() === 'wishlist.html') renderWishlistPage();
}

/* ============================================================
   TOAST
   ============================================================ */
function showToast(msg) {
  let wrap = document.getElementById('toastWrap');
  if (!wrap) {
    wrap = document.createElement('div');
    wrap.id = 'toastWrap';
    wrap.className = 'toast-wrap';
    document.body.appendChild(wrap);
  }
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 1800);
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('totop');
  if (!btn) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      btn.classList.toggle('show', window.scrollY > 480);
      ticking = false;
    });
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   BOTTOM SHEETS (generic open/close, used for filters + location)
   ============================================================ */
function initSheets() {
  document.querySelectorAll('[data-sheet-open]').forEach(trigger => {
    trigger.addEventListener('click', () => openSheet(trigger.dataset.sheetOpen));
  });
  document.querySelectorAll('[data-sheet-close]').forEach(trigger => {
    trigger.addEventListener('click', () => closeSheet(trigger.dataset.sheetClose));
  });
}

function openSheet(id) {
  const overlay = document.getElementById(id + 'Overlay');
  const sheet = document.getElementById(id);
  if (!sheet) return;
  overlay?.classList.add('open');
  sheet.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSheet(id) {
  const overlay = document.getElementById(id + 'Overlay');
  const sheet = document.getElementById(id);
  if (!sheet) return;
  overlay?.classList.remove('open');
  sheet.classList.remove('open');
  document.body.style.overflow = '';
}

/* ============================================================
   SEARCH BAR — works correctly: name OR city OR state
   ============================================================ */
function initSearchBar() {
  const input = document.getElementById('heroSearchInput');
  const suggestBox = document.getElementById('heroSuggest');
  const clearBtn = document.getElementById('heroSearchClear');
  const goBtn = document.getElementById('heroSearchGo');
  if (!input) return;

  let debounce;

  input.addEventListener('input', () => {
    clearBtn?.classList.toggle('show', input.value.length > 0);
    clearTimeout(debounce);
    debounce = setTimeout(() => renderSuggestions(input.value), 120);
  });

  input.addEventListener('focus', () => {
    if (input.value.length > 0) renderSuggestions(input.value);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); runSearch(input.value); }
    if (e.key === 'Escape') hideSuggestions();
  });

  clearBtn?.addEventListener('click', () => {
    input.value = '';
    clearBtn.classList.remove('show');
    hideSuggestions();
    input.focus();
  });

  goBtn?.addEventListener('click', () => runSearch(input.value));

  document.addEventListener('click', e => {
    if (suggestBox && !suggestBox.contains(e.target) && e.target !== input) hideSuggestions();
  });

  function renderSuggestions(query) {
    if (!suggestBox) return;
    const q = query.trim();
    if (q.length < 1) { hideSuggestions(); return; }
    const results = getSuggestions(q);
    if (!results.length) { hideSuggestions(); return; }

    suggestBox.innerHTML = results.map(r => `
      <div class="suggest-row" role="button" tabindex="0" onclick="window.location.href='${r.link}'">
        <div class="suggest-icon">${r.icon}</div>
        <div class="suggest-text">
          <div class="suggest-title">${highlightMatch(r.label, q)}</div>
          <div class="suggest-sub">${r.sub}</div>
        </div>
        <div class="suggest-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="m9 6 6 6-6 6"/></svg></div>
      </div>
    `).join('');
    suggestBox.classList.add('show');
  }

  function hideSuggestions() { suggestBox?.classList.remove('show'); }

  function runSearch(query) {
    const q = query.trim();
    if (!q) return;
    window.location.href = `hotels.html?q=${encodeURIComponent(q)}`;
  }
}

function highlightMatch(text, q) {
  if (!q) return text;
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'ig');
  return text.replace(re, '<mark>$1</mark>');
}

/* ============================================================
   QUICK CITY CHIPS (hero)
   ============================================================ */
function renderQuickChips(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = CITIES.slice(0, 6).map(c =>
    `<a href="hotels.html?city=${c.id}" class="chip">${c.name}</a>`
  ).join('');
}

/* ============================================================
   HOTEL CARD RENDERER (no WhatsApp/Call — clean card → detail page)
   ============================================================ */
function renderHotelCard(h) {
  const isFav = wishlist.has(h.id);
  const tagsHtml = h.badges.slice(0, 2).map(b => {
    const tag = getBadgeTag(b);
    return tag ? `<span class="tag ${tag.cls}">${tag.label}</span>` : '';
  }).join('');

  const amenitiesHtml = h.amenities.slice(0, 3).map(a =>
    `<span class="amenity-pill">${AMENITY_ICONS[a] || ''} ${a}</span>`
  ).join('');

  return `
  <a href="hotel-detail.html?id=${h.id}" class="hcard reveal in">
    <div class="hcard-media" style="background:${h.gradient}">
      ${h.emoji}
      <div class="hcard-tags">${tagsHtml}</div>
      <button class="hcard-fav ${isFav?'active':''}" data-fav-id="${h.id}"
        onclick="event.preventDefault();event.stopPropagation();toggleWishlist('${h.id}', this)"
        aria-label="${isFav?'Remove from':'Save to'} wishlist">
        <svg viewBox="0 0 24 24" fill="${isFav?'currentColor':'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      </button>
      <div class="hcard-rating">★ ${h.rating}</div>
    </div>
    <div class="hcard-body">
      <div class="hcard-loc">📍 ${h.area}, ${h.city}</div>
      <div class="hcard-name">${h.name}</div>
      <div class="hcard-amenities">${amenitiesHtml}</div>
      <div class="hcard-foot">
        <div>
          <div class="hcard-price-label">From</div>
          <div class="hcard-price">${formatPrice(h.price)}<span>/night</span></div>
        </div>
        <div class="hcard-arrow"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 6 6 6-6 6"/></svg></div>
      </div>
    </div>
  </a>`;
}

function renderSkeletonCards(n = 6) {
  return Array(n).fill(0).map(() => `
    <div class="skel-card">
      <div class="skel-media skel"></div>
      <div class="skel-body">
        <div class="skel-line skel" style="width:40%"></div>
        <div class="skel-line skel" style="width:80%;height:15px"></div>
        <div class="skel-line skel" style="width:60%"></div>
      </div>
    </div>`).join('');
}

function renderCityCard(c) {
  return `
  <a href="hotels.html?city=${c.id}" class="ccard reveal in">
    <div class="ccard-emoji">${c.emoji}</div>
    <div class="ccard-name">${c.name}</div>
    <div class="ccard-state">${c.state}</div>
    <span class="ccard-count">${c.count} hotels</span>
  </a>`;
}

function renderCategoryItem(cat) {
  return `
  <a href="hotels.html?type=${cat.id}" class="cat-item">
    <div class="cat-icon-wrap">${cat.emoji}</div>
    <div class="cat-label">${cat.label}</div>
  </a>`;
}

function renderEmptyState(title, text) {
  return `
  <div class="empty-state">
    <div class="empty-emoji">🔍</div>
    <div class="empty-title">${title}</div>
    <div class="empty-text">${text}</div>
    <a href="hotels.html" class="btn-block primary" style="display:inline-flex;width:auto;padding:10px 20px">Browse all hotels</a>
  </div>`;
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function initReveal() {
  const els = document.querySelectorAll('.reveal:not(.in)');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => obs.observe(el));
}

/* ============================================================
   HOME PAGE
   ============================================================ */
function initHomePage() {
  renderQuickChips('heroChips');

  const catRow = document.getElementById('catScroll');
  if (catRow) catRow.innerHTML = CATEGORIES.map(renderCategoryItem).join('');

  loadSection('featuredGrid', getFeaturedHotels(6));
  loadSection('trendingGrid', getTrendingHotels(3));

  const cityGrid = document.getElementById('citiesGrid');
  if (cityGrid) cityGrid.innerHTML = CITIES.slice(0, 4).map(renderCityCard).join('');

  // Smart location-aware section (if location.js present)
  if (window.LocationEngine) {
    initSmartLocationSection();
  }

  initReveal();
}

function loadSection(gridId, hotels) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = renderSkeletonCards(Math.min(hotels.length, 3));
  setTimeout(() => {
    grid.innerHTML = hotels.length ? hotels.map(renderHotelCard).join('') : renderEmptyState('No hotels yet', 'Check back soon — we add new listings every week.');
    paintWishlistButtons();
    initReveal();
  }, 250);
}

/* ============================================================
   SMART LOCATION SECTION (optional — only if location.js loaded)
   ============================================================ */
async function initSmartLocationSection() {
  const banner = document.getElementById('locBanner');
  const grid = document.getElementById('smartGrid');
  if (!banner || !grid) return;

  banner.innerHTML = `
    <div class="loc-banner detecting">
      <span class="loc-banner-icon">📡</span>
      <div class="loc-banner-text"><div class="loc-banner-title">Finding hotels near you…</div></div>
    </div>`;
  grid.innerHTML = renderSkeletonCards(3);

  try {
    const loc = await LocationEngine.detectUserLocation();
    const res = LocationEngine.resolveHotelsByLocation(loc, { limit: 6 });

    banner.innerHTML = `
      <div class="loc-banner">
        <span class="loc-banner-icon">${res.emoji}</span>
        <div class="loc-banner-text">
          <div class="loc-banner-title">${res.label}</div>
          <div class="loc-banner-sub">${res.sublabel}</div>
        </div>
        <button class="loc-banner-btn" data-sheet-open="locSheet">Change</button>
      </div>`;
    grid.innerHTML = res.hotels.length ? res.hotels.map(renderHotelCard).join('') : renderEmptyState('No hotels nearby yet', 'Try browsing all cities instead.');
    paintWishlistButtons();
    initReveal();
    initSheets(); // re-bind new [data-sheet-open]
  } catch {
    banner.innerHTML = '';
    grid.innerHTML = getFeaturedHotels(6).map(renderHotelCard).join('');
    paintWishlistButtons();
  }
}

/* ============================================================
   HOTELS LIST PAGE
   ============================================================ */
let activeHotelFilters = {};

function initHotelsPage() {
  const params = new URLSearchParams(window.location.search);
  activeHotelFilters = {
    city: params.get('city') || '',
    type: params.get('type') || '',
    budget: params.get('budget') || '',
    q: params.get('q') || '',
    state: params.get('state') || '',
    sort: params.get('sort') || 'featured',
  };

  updatePageHeading();
  runHotelFilter();

  document.querySelectorAll('.filter-pill[data-filter]').forEach(pill => {
    pill.addEventListener('click', () => {
      const key = pill.dataset.filter;
      const val = pill.dataset.value;
      activeHotelFilters[key] = activeHotelFilters[key] === val ? '' : val;
      document.querySelectorAll(`.filter-pill[data-filter="${key}"]`).forEach(p => p.classList.remove('active'));
      if (activeHotelFilters[key]) pill.classList.add('active');
      updatePageHeading();
      runHotelFilter();
    });
  });

  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.value = activeHotelFilters.sort;
    sortSelect.addEventListener('change', () => {
      activeHotelFilters.sort = sortSelect.value;
      runHotelFilter();
    });
  }
}

function updatePageHeading() {
  const h1 = document.getElementById('pageHeading');
  if (!h1) return;
  let title = 'All Hotels';
  if (activeHotelFilters.city) {
    const c = CITIES.find(c => c.id === activeHotelFilters.city);
    title = `Hotels in ${c ? c.name : activeHotelFilters.city}`;
  } else if (activeHotelFilters.state) {
    title = `Hotels in ${activeHotelFilters.state}`;
  } else if (activeHotelFilters.type) {
    title = `${activeHotelFilters.type.charAt(0).toUpperCase()+activeHotelFilters.type.slice(1)} Hotels`;
  } else if (activeHotelFilters.q) {
    title = `Results for "${activeHotelFilters.q}"`;
  }
  h1.textContent = title;
  document.title = `${title} — HotelRadar`;
}

function runHotelFilter() {
  const grid = document.getElementById('hotelsGrid');
  const count = document.getElementById('resultCount');
  if (!grid) return;

  grid.innerHTML = renderSkeletonCards(6);

  setTimeout(() => {
    let results;
    if (activeHotelFilters.q) {
      results = searchHotels(activeHotelFilters.q);
    } else if (activeHotelFilters.state) {
      results = HOTELS.filter(h => h.approved && h.active && h.state === activeHotelFilters.state);
    } else {
      results = getHotels({
        city: activeHotelFilters.city ? (CITIES.find(c=>c.id===activeHotelFilters.city)?.name || activeHotelFilters.city) : undefined,
        type: activeHotelFilters.type || undefined,
        budget: activeHotelFilters.budget || undefined,
        sort: activeHotelFilters.sort,
      });
    }

    if (count) count.textContent = `${results.length} hotel${results.length!==1?'s':''} found`;
    grid.innerHTML = results.length
      ? results.map(renderHotelCard).join('')
      : renderEmptyState('No hotels found', 'Try a different city, category, or search term.');
    paintWishlistButtons();
    initReveal();
  }, 280);
}

/* ============================================================
   HOTEL DETAIL PAGE
   ============================================================ */
function initDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const hotel = id ? getHotelById(id) : null;

  if (!hotel) {
    const root = document.getElementById('detailRoot');
    if (root) root.innerHTML = renderEmptyState('Hotel not found', 'This listing may have been removed. Browse our other hotels instead.');
    return;
  }

  document.title = `${hotel.name} — ${hotel.city} | HotelRadar`;

  const media = document.getElementById('detailMedia');
  if (media) media.style.background = hotel.gradient;
  const mediaEmoji = document.getElementById('detailMediaEmoji');
  if (mediaEmoji) mediaEmoji.textContent = hotel.emoji;

  const favBtn = document.getElementById('detailFavBtn');
  if (favBtn) {
    favBtn.dataset.favId = hotel.id;
    favBtn.onclick = () => toggleWishlist(hotel.id, favBtn);
  }

  const crumb = document.getElementById('detailCrumb');
  if (crumb) crumb.innerHTML = `<a href="index.html">Home</a> › <a href="hotels.html?city=${hotel.city.toLowerCase().replace(/\s+/g,'-')}">${hotel.city}</a> › <span class="current">${hotel.name}</span>`;

  const tags = document.getElementById('detailTags');
  if (tags) tags.innerHTML = hotel.badges.map(b => {
    const t = getBadgeTag(b);
    return t ? `<span class="tag ${t.cls}">${t.label}</span>` : '';
  }).join('');

  setText('detailName', hotel.name);
  const starsEl = document.getElementById('detailStars');
  if (starsEl) starsEl.innerHTML = '★'.repeat(Math.round(hotel.rating)) + '☆'.repeat(5-Math.round(hotel.rating));
  setText('detailScore', hotel.rating);
  setText('detailReviews', `(${hotel.reviewCount} reviews)`);
  setText('detailLoc', `${hotel.area}, ${hotel.city}, ${hotel.state} — ${hotel.pin}`);
  setText('detailDesc', hotel.desc);

  setText('qfCheckin', hotel.checkIn);
  setText('qfCheckout', hotel.checkOut);
  setText('qfType', hotel.type.charAt(0).toUpperCase()+hotel.type.slice(1));

  const amEl = document.getElementById('detailAmenities');
  if (amEl) amEl.innerHTML = hotel.amenities.map(a =>
    `<div class="amenity-row"><span class="a-ic">${AMENITY_ICONS[a]||'✓'}</span>${a}</div>`).join('');

  const revEl = document.getElementById('detailReviewsList');
  const revs = REVIEWS[hotel.id] || [];
  if (revEl) revEl.innerHTML = revs.length ? revs.map(r => `
    <div class="review-card">
      <div class="review-top">
        <div class="review-avatar">${r.name.charAt(0)}</div>
        <div>
          <div class="review-name">${r.name}</div>
          <div class="review-date">${r.date}</div>
        </div>
        <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
      </div>
      <div class="review-text">${r.text}</div>
    </div>`).join('') : '<p style="color:var(--ink-faint);font-size:13.5px;padding:8px 0">No reviews yet for this hotel.</p>';

  setText('ctaPrice', formatPrice(hotel.price));

  const ctaBtn = document.getElementById('ctaBtn');
  if (ctaBtn) {
    ctaBtn.onclick = () => {
      document.querySelector('[data-tab="location"]')?.click();
      document.getElementById('dtab-location')?.scrollIntoView({ behavior:'smooth', block:'start' });
    };
  }

  const simEl = document.getElementById('similarGrid');
  if (simEl) {
    const sim = getSimilarHotels(hotel, 3);
    simEl.innerHTML = sim.length ? sim.map(renderHotelCard).join('') : '';
    const simSection = document.getElementById('similarSection');
    if (simSection) simSection.style.display = sim.length ? '' : 'none';
  }

  initDetailTabs();
  paintWishlistButtons();
  initReveal();
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function initDetailTabs() {
  const tabs = document.querySelectorAll('.dtab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.dpanel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('dpanel-' + tab.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ============================================================
   WISHLIST PAGE
   ============================================================ */
function initWishlistPage() {
  renderWishlistPage();
}

function renderWishlistPage() {
  const grid = document.getElementById('wishlistGrid');
  const emptyWrap = document.getElementById('wishlistEmpty');
  if (!grid) return;

  const items = HOTELS.filter(h => wishlist.has(h.id));

  if (!items.length) {
    grid.style.display = 'none';
    if (emptyWrap) emptyWrap.style.display = 'block';
    return;
  }

  grid.style.display = '';
  if (emptyWrap) emptyWrap.style.display = 'none';
  grid.innerHTML = items.map(renderHotelCard).join('');
  paintWishlistButtons();
  initReveal();

  const count = document.getElementById('wishlistCount');
  if (count) count.textContent = `${items.length} saved hotel${items.length!==1?'s':''}`;
}
