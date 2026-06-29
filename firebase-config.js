/**
 * StayIndia — Firebase Configuration
 * firebase-config.js
 *
 * HOW TO CONNECT FIREBASE:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project (or use existing)
 * 3. Add a Web App to the project
 * 4. Copy the firebaseConfig object below and replace placeholders
 * 5. Enable Authentication (Google, Email/Password)
 * 6. Create Firestore Database
 * 7. Set up Storage for hotel photos
 * 8. Deploy using Firebase Hosting
 *
 * FIRESTORE COLLECTIONS STRUCTURE:
 *
 * /hotels/{hotelId}
 *   - name, city, state, area, pin, lat, lng
 *   - type, price, rating, reviewCount
 *   - badges[], tags[], amenities[]
 *   - desc, phone, whatsapp, email
 *   - website, facebook, instagram, youtube
 *   - coverImage (Storage URL)
 *   - gallery[] (Storage URLs)
 *   - plan (basic|priority|spotlight)
 *   - approved (boolean)
 *   - active (boolean)
 *   - ownerId (user UID)
 *   - createdAt (timestamp)
 *   - checkIn, checkOut
 *
 * /locations/{locationId}
 *   - country, state, city, area, pin
 *   - hotelCount
 *   - approved (boolean)
 *   - createdAt (timestamp)
 *
 * /users/{userId}
 *   - name, email, phone
 *   - role (visitor|owner|admin)
 *   - favourites[] (hotel IDs)
 *   - createdAt (timestamp)
 *
 * /reviews/{reviewId}
 *   - hotelId, userId, userName
 *   - rating, text, date
 *   - approved (boolean)
 *
 * /invitations/{code}
 *   - code (unique string)
 *   - type (single-use|reusable)
 *   - expiresAt (timestamp|null)
 *   - usedBy (userId|null)
 *   - active (boolean)
 *   - createdBy (admin userId)
 *   - createdAt (timestamp)
 *
 * /plans/{planId}
 *   - name (basic|priority|spotlight)
 *   - price (399|899|1499)
 *   - features[]
 *   - active (boolean)
 */

// ============================================================
// REPLACE WITH YOUR ACTUAL FIREBASE CONFIG
// ============================================================
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY_HERE",
  authDomain:        "YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId:             "YOUR_APP_ID",
  measurementId:     "YOUR_MEASUREMENT_ID"
};

// ============================================================
// FIREBASE INITIALIZATION (uncomment when config is ready)
// ============================================================
/*
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, getDocs, getDoc, doc, query, where, orderBy, limit, addDoc, updateDoc, serverTimestamp }
  from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL }
  from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";

const app     = initializeApp(firebaseConfig);
const db      = getFirestore(app);
const auth    = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// AUTH HELPERS
async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await ensureUserDoc(result.user);
    return result.user;
  } catch(err) { console.error(err); throw err; }
}

async function ensureUserDoc(user) {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await updateDoc(ref, {
      name: user.displayName,
      email: user.email,
      role: 'visitor',
      favourites: [],
      createdAt: serverTimestamp()
    });
  }
}

// HOTEL QUERIES
async function fetchHotels({ city, type, budget, sort='featured', limitN=20 } = {}) {
  let q = collection(db, 'hotels');
  const constraints = [where('approved','==',true), where('active','==',true)];
  if (city)   constraints.push(where('city','==',city));
  if (type)   constraints.push(where('type','==',type));
  if (sort === 'rating')   constraints.push(orderBy('rating','desc'));
  else if (sort === 'newest') constraints.push(orderBy('createdAt','desc'));
  else        constraints.push(orderBy('plan','asc'), orderBy('rating','desc'));
  constraints.push(limit(limitN));
  const snap = await getDocs(query(q, ...constraints));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// INVITATION VALIDATION
async function validateInvitationCode(code) {
  const snap = await getDoc(doc(db, 'invitations', code));
  if (!snap.exists()) return null;
  const data = snap.data();
  if (!data.active) return null;
  if (data.expiresAt && data.expiresAt.toDate() < new Date()) return null;
  if (data.type === 'single-use' && data.usedBy) return null;
  return data;
}

// HOTEL REGISTRATION (called from register-hotel.html)
async function submitHotelRegistration(formData, photos) {
  const user = auth.currentUser;
  if (!user) throw new Error('Must be logged in');

  // Upload photos
  const photoURLs = [];
  for (const photo of photos) {
    const storageRef = ref(storage, `hotels/${Date.now()}_${photo.name}`);
    await uploadBytes(storageRef, photo);
    photoURLs.push(await getDownloadURL(storageRef));
  }

  // Submit hotel doc (pending approval)
  await addDoc(collection(db, 'hotels'), {
    ...formData,
    coverImage: photoURLs[0] || null,
    gallery: photoURLs,
    ownerId: user.uid,
    approved: false,
    active: false,
    rating: 0,
    reviewCount: 0,
    createdAt: serverTimestamp(),
  });
}

// REAL-TIME AUTH STATE
onAuthStateChanged(auth, user => {
  const loginBtn = document.getElementById('loginBtn');
  if (loginBtn) {
    loginBtn.textContent = user ? user.displayName?.split(' ')[0] || 'Account' : 'Sign In';
    loginBtn.onclick = user ? () => signOut(auth) : () => openAuth('login');
  }
});
*/

// ============================================================
// CONSOLE NOTE
// ============================================================
console.log(
  '%c🏨 StayIndia Hotel Directory\n' +
  '%cFirebase not yet configured. Edit firebase-config.js with your project details.\n' +
  'Using local demo data for now.',
  'color:#FF7A00;font-size:14px;font-weight:bold',
  'color:#9CA3AF;font-size:12px'
);
