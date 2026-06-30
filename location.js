/**
 * HotelRadar — Location Engine
 * location.js
 *
 * Detects approximate location (IP-based, no permission prompt needed)
 * and resolves which hotels to show: city → state → country → featured.
 */
'use strict';

const LOC_CACHE_KEY = 'hr_location';
const LOC_CACHE_TTL = 24 * 60 * 60 * 1000;

const CITY_ALIASES = {
  haridwar:'Haridwar', rishikesh:'Rishikesh', dehradun:'Dehradun',
  mussoorie:'Mussoorie', delhi:'New Delhi', 'new delhi':'New Delhi',
  agra:'Agra', jaipur:'Jaipur', manali:'Manali',
};
const STATE_ALIASES = {
  uttarakhand:'Uttarakhand', delhi:'Delhi', 'nct of delhi':'Delhi',
  rajasthan:'Rajasthan', 'himachal pradesh':'Himachal Pradesh',
  'uttar pradesh':'Uttar Pradesh',
};

async function detectUserLocation() {
  const cached = getCachedLocation();
  if (cached) return { ...cached, source: 'cache' };

  try {
    const ipLoc = await getIPLocation();
    if (ipLoc) { cacheLocation(ipLoc); return ipLoc; }
  } catch {}

  return { country: 'India', countryCode: 'IN', state: '', city: '', source: 'default', detectedAt: Date.now() };
}

async function getIPLocation() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  const res = await fetch('https://ipapi.co/json/', { signal: controller.signal });
  clearTimeout(timeout);
  if (!res.ok) throw new Error('ip lookup failed');
  const data = await res.json();
  if (data.error) throw new Error(data.reason || 'ip lookup error');
  return {
    country: data.country_name || 'India',
    countryCode: data.country_code || 'IN',
    state: normalize(data.region || '', STATE_ALIASES),
    city: normalize(data.city || '', CITY_ALIASES),
    source: 'ip', detectedAt: Date.now(),
  };
}

function normalize(raw, map) {
  if (!raw) return '';
  return map[raw.toLowerCase().trim()] || raw.trim();
}

function getCachedLocation() {
  try {
    const raw = localStorage.getItem(LOC_CACHE_KEY);
    if (!raw) return null;
    const loc = JSON.parse(raw);
    if (Date.now() - loc.detectedAt > LOC_CACHE_TTL) { localStorage.removeItem(LOC_CACHE_KEY); return null; }
    return loc;
  } catch { return null; }
}

function cacheLocation(loc) { try { localStorage.setItem(LOC_CACHE_KEY, JSON.stringify(loc)); } catch {} }
function clearLocationCache() { try { localStorage.removeItem(LOC_CACHE_KEY); } catch {} }

function setManualLocation(country, state, city) {
  const loc = { country: country||'India', countryCode:'IN', state: state||'', city: city||'', source:'manual', detectedAt: Date.now() };
  cacheLocation(loc);
  return loc;
}

/** Priority cascade: city → state → country → featured */
function resolveHotelsByLocation(location, { limit = 6 } = {}) {
  const { city, state, country, countryCode } = location;
  const isIndia = countryCode === 'IN' || country === 'India';

  if (city) {
    const cityHotels = getHotels({ city, sort: 'featured', limit });
    if (cityHotels.length) return {
      priority: 1, emoji: '📍',
      label: `Showing hotels in ${city}`,
      sublabel: `${cityHotels.length} verified hotels near you`,
      hotels: cityHotels,
    };
  }

  if (state && isIndia) {
    const stateHotels = HOTELS.filter(h => h.approved && h.active && h.state === state).slice(0, limit);
    if (stateHotels.length) return {
      priority: 2, emoji: '🗺️',
      label: `Hotels in ${state}`,
      sublabel: city ? `No hotels in ${city} yet — showing nearby options` : `Showing hotels across ${state}`,
      hotels: stateHotels,
    };
  }

  if (isIndia) {
    const all = getFeaturedHotels(limit);
    if (all.length) return {
      priority: 3, emoji: '🇮🇳',
      label: 'Popular hotels in India',
      sublabel: 'Top-rated, verified stays',
      hotels: all,
    };
  }

  return {
    priority: 4, emoji: '⭐',
    label: 'Featured hotels',
    sublabel: 'Hand-picked stays for you',
    hotels: getFeaturedHotels(limit),
  };
}

window.LocationEngine = {
  detectUserLocation, resolveHotelsByLocation,
  setManualLocation, clearLocationCache, getCachedLocation,
};
