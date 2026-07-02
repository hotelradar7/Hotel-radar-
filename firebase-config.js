/**
 * HotelRadar — Hotel Directory
 * firebase-config.js — LIVE Firebase Configuration
 *
 * Project: hotel-radar-india
 * Realtime DB: https://hotel-radar-india-default-rtdb.firebaseio.com/
 *
 * SERVICES USED:
 *  ✅ Firebase Authentication   (Google + Email/Password)
 *  ✅ Firebase Realtime Database (hotels, users, reviews, invitations)
 *  ✅ Firebase Storage           (hotel photos)
 *  ✅ Firebase Firestore         (structured queries)
 *
 * DATABASE STRUCTURE (Realtime DB):
 *
 *  hotels/
 *    {hotelId}/
 *      name, city, state, area, pin, lat, lng
 *      type, price, rating, reviewCount
 *      badges[], tags[], amenities[]
 *      desc, phone, whatsapp, email
 *      website, facebook, instagram, youtube
 *      coverImage (Storage URL)
 *      gallery[]  (Storage URLs)
 *      plan       (basic | priority | spotlight)
 *      approved   (true/false)
 *      active     (true/false)
 *      ownerId    (user uid)
 *      createdAt  (timestamp ms)
 *      checkIn, checkOut
 *
 *  locations/
 *    {locationId}/
 *      country, state, city, area, pin
 *      hotelCount, approved, createdAt
 *
 *  users/
 *    {uid}/
 *      name, email, phone
 *      role  (visitor | owner | admin)
 *      favourites/ { hotelId: true }
 *      createdAt
 *
 *  reviews/
 *    {reviewId}/
 *      hotelId, userId, userName
 *      rating, text, date, approved
 *
 *  invitations/
 *    {code}/
 *      type (single-use | reusable)
 *      expiresAt, usedBy, active
 *      createdBy, createdAt
 */

'use strict';

/* ============================================================
   FIREBASE CONFIG — hotel-radar-india
   ============================================================ */
const firebaseConfig = {
  apiKey:            "AIzaSyDoBNdJEAos6Ofj-KDzvarg_mH1Nz3nQls",
  authDomain:        "hotel-radar-india.firebaseapp.com",
  databaseURL:       "https://hotel-radar-india-default-rtdb.firebaseio.com",
  projectId:         "hotel-radar-india",
  storageBucket:     "hotel-radar-india.firebasestorage.app",
  messagingSenderId: "492786665359",
  appId:             "1:492786665359:web:7033614463c044cf4fadfa"
};

const RTDB_URL = "https://hotel-radar-india-default-rtdb.firebaseio.com";

/* ============================================================
   FIREBASE SDK — loaded via CDN (ES modules compatible)
   Using Firebase v10 compat (window-global) for script-tag usage
   ============================================================ */

/* Load Firebase scripts dynamically so page doesn't block */
(function loadFirebaseSDK() {
  const scripts = [
    'https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth-compat.js',
    'https://www.gstatic.com/firebasejs/10.12.0/firebase-database-compat.js',
    'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js',
    'https://www.gstatic.com/firebasejs/10.12.0/firebase-storage-compat.js',
  ];

  let loaded = 0;

  scripts.forEach(src => {
    const s = document.createElement('script');
    s.src   = src;
    s.async = false; // maintain order
    s.onload = () => {
      loaded++;
      if (loaded === scripts.length) initFirebase();
    };
    s.onerror = () => {
      console.warn('[Firebase] Failed to load:', src, '— using local data.');
      window.FIREBASE_AVAILABLE = false;
    };
    document.head.appendChild(s);
  });
})();

/* ============================================================
   FIREBASE INITIALIZATION
   ============================================================ */
function initFirebase() {
  try {
    /* Prevent double-init */
    if (firebase.apps?.length > 0) {
      window.fbApp = firebase.apps[0];
    } else {
      window.fbApp = firebase.initializeApp(firebaseConfig);
    }

    window.fbAuth     = firebase.auth();
    window.fbDB       = firebase.database();       // Realtime Database
    window.fbStore    = firebase.firestore();       // Firestore
    window.fbStorage  = firebase.storage();
    window.FIREBASE_AVAILABLE = true;

    console.log(
      '%c🏨 HotelRadar · Firebase Connected\n' +
      '%cProject: hotel-radar-india · RTDB: hotel-radar-india-default-rtdb',
      'color:#FF7A00;font-weight:bold;font-size:13px',
      'color:#10B981;font-size:11px'
    );

    /* Fire event so other modules know Firebase is ready */
    window.dispatchEvent(new CustomEvent('firebase:ready'));

    /* Start real-time hotel listener on homepage */
    if (document.getElementById('smartGrid')) {
      listenToApprovedHotels();
    }

    /* Auth state observer — updates nav button */
    fbAuth.onAuthStateChanged(user => {
      const loginBtn = document.getElementById('loginBtn');
      if (!loginBtn) return;
      if (user) {
        loginBtn.textContent = user.displayName?.split(' ')[0] || 'Account';
        loginBtn.onclick = () => {
          fbAuth.signOut().then(() => showToast && showToast('👋 Signed out', ''));
        };
      } else {
        loginBtn.textContent = 'Sign In';
        loginBtn.onclick = () => openAuth && openAuth('login');
      }
    });

  } catch (err) {
    console.error('[Firebase] Init failed:', err);
    window.FIREBASE_AVAILABLE = false;
  }
}

/* ============================================================
   REALTIME DATABASE — LIVE HOTEL LISTENER
   Automatically updates homepage when any hotel is added/changed
   ============================================================ */
function listenToApprovedHotels() {
  if (!window.fbDB) return;

  const hotelsRef = fbDB.ref('hotels').orderByChild('approved').equalTo(true);

  hotelsRef.on('value', snap => {
    const rtdbHotels = [];
    snap.forEach(child => {
      const h = child.val();
      if (h.active !== false) {
        rtdbHotels.push({ id: child.key, ...h });
      }
    });

    if (rtdbHotels.length > 0) {
      /* Merge RTDB hotels into local HOTELS array (avoid duplicates) */
      const existingIds = new Set(HOTELS.map(h => h.id));
      rtdbHotels.forEach(h => {
        if (!existingIds.has(h.id)) {
          HOTELS.push(normalizeRTDBHotel(h));
        } else {
          /* Update existing entry */
          const idx = HOTELS.findIndex(x => x.id === h.id);
          if (idx !== -1) HOTELS[idx] = { ...HOTELS[idx], ...normalizeRTDBHotel(h) };
        }
      });

      console.log(`[Firebase] ✓ ${rtdbHotels.length} hotels loaded from Realtime DB`);

      /* Re-run location resolution with fresh data */
      if (window.LocationUI && window.LocationEngine) {
        const cached = LocationEngine.getCachedLocation();
        if (cached) {
          const resolution = LocationEngine.resolveHotelsByLocation(cached, { limit: 12 });
          if (window.LS) window.LS.currentResolution = resolution;
          const grid = document.getElementById('smartGrid');
          if (grid && typeof renderHotelCard === 'function') {
            grid.innerHTML = resolution.hotels.map(renderHotelCard).join('');
            typeof initScrollReveal === 'function' && initScrollReveal();
            typeof restoreFavourites === 'function' && restoreFavourites();
          }
        }
      }

      /* Refresh other sections */
      typeof renderSection === 'function' && renderSection('featuredGrid', getFeaturedHotels(6));
      typeof renderSection === 'function' && renderSection('trendingGrid', getTrendingHotels(3));
    }
  }, err => {
    console.warn('[Firebase] RTDB listen error:', err.message);
  });
}

/* ============================================================
   NORMALIZE RTDB HOTEL → matches local HOTELS schema
   ============================================================ */
function normalizeRTDBHotel(h) {
  return {
    id:          h.id,
    name:        h.name        || 'Unnamed Hotel',
    city:        h.city        || '',
    state:       h.state       || '',
    area:        h.area        || '',
    pin:         h.pin         || '',
    lat:         parseFloat(h.lat)  || 0,
    lng:         parseFloat(h.lng)  || 0,
    type:        h.type        || 'hotel',
    price:       parseInt(h.price)  || 999,
    rating:      parseFloat(h.rating) || 4.0,
    reviewCount: parseInt(h.reviewCount) || 0,
    badges:      Array.isArray(h.badges) ? h.badges : ['verified'],
    tags:        Array.isArray(h.tags)   ? h.tags   : [],
    amenities:   Array.isArray(h.amenities) ? h.amenities : [],
    emoji:       h.emoji       || '🏨',
    gradient:    h.gradient    || 'linear-gradient(135deg,#FF7A00,#D4AF37)',
    desc:        h.desc        || h.description || '',
    phone:       h.phone       || '',
    whatsapp:    h.whatsapp    || h.phone?.replace(/\D/g,'') || '',
    checkIn:     h.checkIn     || '12:00 PM',
    checkOut:    h.checkOut    || '11:00 AM',
    website:     h.website     || '',
    plan:        h.plan        || 'basic',
    approved:    true,
    active:      true,
    createdAt:   new Date(h.createdAt || Date.now()),
  };
}

/* ============================================================
   AUTH HELPERS — callable from app.js
   ============================================================ */

/** Google Sign-In */
async function signInWithGoogle() {
  if (!window.FIREBASE_AVAILABLE) { showToast('Firebase not ready', ''); return; }
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result   = await fbAuth.signInWithPopup(provider);
    await ensureUserRecord(result.user);
    closeAuth && closeAuth();
    showToast(`👋 Welcome, ${result.user.displayName?.split(' ')[0]}!`, 'success');
  } catch (err) {
    showToast('Sign-in failed: ' + err.message, 'error');
  }
}

/** Email/Password Sign-In */
async function signInWithEmail(email, password) {
  if (!window.FIREBASE_AVAILABLE) return;
  try {
    await fbAuth.signInWithEmailAndPassword(email, password);
    closeAuth && closeAuth();
    showToast('✅ Signed in!', 'success');
  } catch (err) {
    showToast('Sign-in failed: ' + err.message, '');
  }
}

/** Register with Email */
async function registerWithEmail(name, email, password) {
  if (!window.FIREBASE_AVAILABLE) return;
  try {
    const cred = await fbAuth.createUserWithEmailAndPassword(email, password);
    await cred.user.updateProfile({ displayName: name });
    await ensureUserRecord(cred.user);
    closeAuth && closeAuth();
    showToast(`🎉 Welcome, ${name}!`, 'success');
  } catch (err) {
    showToast('Registration failed: ' + err.message, '');
  }
}

/** Ensure user record exists in RTDB */
async function ensureUserRecord(user) {
  if (!window.fbDB) return;
  const userRef = fbDB.ref(`users/${user.uid}`);
  const snap    = await userRef.once('value');
  if (!snap.exists()) {
    await userRef.set({
      name:      user.displayName || '',
      email:     user.email       || '',
      role:      'visitor',
      createdAt: Date.now(),
    });
  }
}

/* ============================================================
   FAVOURITES — sync to RTDB when user is logged in
   ============================================================ */
async function syncFavouriteToRTDB(hotelId, isFav) {
  if (!window.fbDB || !window.fbAuth?.currentUser) return;
  const uid = fbAuth.currentUser.uid;
  await fbDB.ref(`users/${uid}/favourites/${hotelId}`).set(isFav ? true : null);
}

/* ============================================================
   HOTEL REGISTRATION — submit to RTDB (pending admin approval)
   ============================================================ */
async function submitHotelToRTDB(formData) {
  if (!window.fbDB) {
    showToast('Firebase not available. Please try again.', '');
    return;
  }

  const newRef = fbDB.ref('hotels').push();
  await newRef.set({
    ...formData,
    approved:    false,
    active:      false,
    rating:      0,
    reviewCount: 0,
    createdAt:   Date.now(),
  });

  return newRef.key;
}

/* ============================================================
   PHOTO UPLOAD — Firebase Storage
   ============================================================ */
async function uploadHotelPhoto(file, hotelId) {
  if (!window.fbStorage) throw new Error('Storage not ready');
  const path      = `hotels/${hotelId}/${Date.now()}_${file.name}`;
  const storageRef = fbStorage.ref(path);
  const snapshot  = await storageRef.put(file);
  return await snapshot.ref.getDownloadURL();
}

/* ============================================================
   INVITATION CODE VALIDATION
   ============================================================ */
async function validateInviteCode(code) {
  if (!window.fbDB) return null;
  const snap = await fbDB.ref(`invitations/${code}`).once('value');
  if (!snap.exists()) return null;
  const inv = snap.val();
  if (!inv.active) return null;
  if (inv.expiresAt && inv.expiresAt < Date.now()) return null;
  if (inv.type === 'single-use' && inv.usedBy) return null;
  return inv;
}

/* ============================================================
   REVIEWS
   ============================================================ */
async function submitReview(hotelId, rating, text) {
  if (!window.fbDB || !fbAuth.currentUser) {
    openAuth && openAuth('login'); return;
  }
  const user = fbAuth.currentUser;
  const ref  = fbDB.ref('reviews').push();
  await ref.set({
    hotelId,
    userId:   user.uid,
    userName: user.displayName || 'Guest',
    rating,
    text,
    date:     new Date().toLocaleDateString('en-IN', { month:'long', year:'numeric' }),
    approved: false,
    createdAt: Date.now(),
  });
  showToast('✅ Review submitted! It will appear after moderation.', 'success');
}

/* ============================================================
   EXPOSE GLOBALLY
   ============================================================ */
window.FB = {
  signInWithGoogle,
  signInWithEmail,
  registerWithEmail,
  submitHotelToRTDB,
  uploadHotelPhoto,
  validateInviteCode,
  submitReview,
  syncFavouriteToRTDB,
  RTDB_URL,
};
