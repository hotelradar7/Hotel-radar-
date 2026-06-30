/**
 * StayIndia — Theme Toggle System
 * theme.js
 *
 * Handles Night Mode (default, dark navy) <-> Day Mode (light ivory) switching.
 * - Persists choice in localStorage
 * - Applies theme INSTANTLY on page load (before paint) to avoid flash
 * - Zero layout shift — design structure stays 100% identical
 * - Floating toggle button auto-injected on every page
 */

'use strict';

const THEME_KEY = 'si_theme'; // 'night' | 'day'

/* ============================================================
   APPLY THEME IMMEDIATELY (before DOM paints — prevents flash)
   This runs the instant the script loads, not waiting for DOMContentLoaded
   ============================================================ */
(function applyThemeEarly() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'day') {
      document.documentElement.setAttribute('data-theme', 'day');
    }
    // night = default, no attribute needed
  } catch {}
})();

/* ============================================================
   TOGGLE BUTTON — injected into every page on DOMContentLoaded
   ============================================================ */
document.addEventListener('DOMContentLoaded', initThemeToggle);

function initThemeToggle() {
  // Avoid duplicate injection
  if (document.getElementById('themeToggleBtn')) return;

  const isDay = document.documentElement.getAttribute('data-theme') === 'day';

  const btn = document.createElement('button');
  btn.id = 'themeToggleBtn';
  btn.className = 'theme-toggle';
  btn.setAttribute('aria-label', isDay ? 'Switch to night mode' : 'Switch to day mode');
  btn.setAttribute('title', isDay ? 'Switch to Night Mode' : 'Switch to Day Mode');
  btn.innerHTML = `
    <span class="theme-toggle-icon" id="themeToggleIcon">${isDay ? '🌙' : '☀️'}</span>
    <span class="theme-toggle-label">${isDay ? 'Night' : 'Day'}</span>
  `;
  btn.addEventListener('click', toggleTheme);

  document.body.appendChild(btn);
}

/* ============================================================
   TOGGLE LOGIC
   ============================================================ */
function toggleTheme() {
  const html = document.documentElement;
  const isDay = html.getAttribute('data-theme') === 'day';

  if (isDay) {
    // Switch to NIGHT
    html.removeAttribute('data-theme');
    try { localStorage.setItem(THEME_KEY, 'night'); } catch {}
    updateToggleUI(false);
  } else {
    // Switch to DAY
    html.setAttribute('data-theme', 'day');
    try { localStorage.setItem(THEME_KEY, 'day'); } catch {}
    updateToggleUI(true);
  }

  // Brief pulse animation for tactile feedback
  const btn = document.getElementById('themeToggleBtn');
  if (btn) {
    btn.style.transform = 'translateY(-50%) scale(0.92)';
    setTimeout(() => { btn.style.transform = ''; }, 150);
  }
}

function updateToggleUI(isDay) {
  const icon  = document.getElementById('themeToggleIcon');
  const btn   = document.getElementById('themeToggleBtn');
  const label = btn?.querySelector('.theme-toggle-label');

  if (icon)  icon.textContent  = isDay ? '🌙' : '☀️';
  if (label) label.textContent = isDay ? 'Night' : 'Day';
  if (btn)   btn.setAttribute('aria-label', isDay ? 'Switch to night mode' : 'Switch to day mode');
}

/* ============================================================
   EXPOSE GLOBALLY (optional manual control)
   ============================================================ */
window.ThemeToggle = { toggleTheme };
