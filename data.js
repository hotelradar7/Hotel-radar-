/**
 * StayIndia — Hotel Directory
 * data.js — Static hotel & city data (replaces Firebase in demo)
 * In production: replace with Firebase Firestore queries
 */

'use strict';

/* ============================================================
   CITY DATA
   ============================================================ */
const CITIES = [
  { id:'haridwar',   name:'Haridwar',   state:'Uttarakhand', emoji:'🕉️',  count:48, slug:'haridwar'   },
  { id:'rishikesh',  name:'Rishikesh',  state:'Uttarakhand', emoji:'🧘',  count:39, slug:'rishikesh'  },
  { id:'dehradun',   name:'Dehradun',   state:'Uttarakhand', emoji:'🏔️', count:62, slug:'dehradun'   },
  { id:'mussoorie',  name:'Mussoorie',  state:'Uttarakhand', emoji:'🌄',  count:27, slug:'mussoorie'  },
  { id:'delhi',      name:'New Delhi',  state:'Delhi',        emoji:'🏛️', count:210,slug:'delhi'      },
  { id:'agra',       name:'Agra',       state:'Uttar Pradesh',emoji:'🕌', count:98, slug:'agra'       },
  { id:'varanasi',   name:'Varanasi',   state:'Uttar Pradesh',emoji:'🪔', count:74, slug:'varanasi'   },
  { id:'jaipur',     name:'Jaipur',     state:'Rajasthan',   emoji:'🏰',  count:145,slug:'jaipur'     },
  { id:'manali',     name:'Manali',     state:'Himachal Pradesh',emoji:'❄️',count:112,slug:'manali'   },
  { id:'shimla',     name:'Shimla',     state:'Himachal Pradesh',emoji:'🍎',count:88, slug:'shimla'   },
  { id:'nainital',   name:'Nainital',   state:'Uttarakhand', emoji:'⛵',  count:56, slug:'nainital'   },
  { id:'dharamshala',name:'Dharamshala',state:'Himachal Pradesh',emoji:'🌺',count:65,slug:'dharamshala'},
];

/* ============================================================
   HOTEL DATA
   ============================================================ */
const HOTELS = [
  /* ---- FEATURED / SPOTLIGHT (plan: spotlight) ---- */
  {
    id:'h001',
    name:'Ganga Darshan Palace',
    city:'Haridwar', state:'Uttarakhand', area:'Har Ki Pauri Road',
    pin:'249401', lat:29.9457, lng:78.1642,
    type:'hotel', price:2800,
    rating:4.9, reviewCount:312,
    badges:['featured','verified','premium'],
    tags:['ganga-view','ac','veg','family'],
    amenities:['AC','WiFi','Restaurant','Pure Veg','Ganga View','Parking','Room Service','24hr Reception'],
    emoji:'🏨',
    gradient:'linear-gradient(135deg,#FF6B35,#F7931E)',
    desc:'Premium riverside hotel with breathtaking Ganga Aarti views from private balconies. Spacious AC suites, rooftop restaurant serving pure vegetarian cuisine, and a front-row seat to one of India\'s most sacred rituals.',
    phone:'+91-12345-67890',
    whatsapp:'911234567890',
    checkIn:'12:00 PM', checkOut:'11:00 AM',
    website:'https://gangadarshan.example.com',
    plan:'spotlight', approved:true, active:true,
    createdAt: new Date('2026-01-15'),
  },
  {
    id:'h002',
    name:'Forest Valley Resort & Spa',
    city:'Dehradun', state:'Uttarakhand', area:'Rajpur Road',
    pin:'248001', lat:30.3753, lng:78.0322,
    type:'resort', price:3800,
    rating:4.9, reviewCount:289,
    badges:['featured','verified','premium'],
    tags:['mountain-view','pool','spa','ac'],
    amenities:['AC','WiFi','Pool','Spa','Restaurant','Parking','Gym','Bar'],
    emoji:'🌲',
    gradient:'linear-gradient(135deg,#2ECC71,#1ABC9C)',
    desc:'Luxury hilltop resort with panoramic Mussoorie views. Infinity pool, full-service Ayurvedic spa, fine dining, and individually designed suites set in Sal forest.',
    phone:'+91-12345-67891',
    whatsapp:'911234567891',
    checkIn:'2:00 PM', checkOut:'12:00 PM',
    plan:'spotlight', approved:true, active:true,
    createdAt: new Date('2026-01-20'),
  },
  {
    id:'h003',
    name:'Triveni Yoga & Wellness Retreat',
    city:'Rishikesh', state:'Uttarakhand', area:'Laxman Jhula',
    pin:'249302', lat:30.1285, lng:78.3210,
    type:'ashram', price:2200,
    rating:4.9, reviewCount:418,
    badges:['featured','verified'],
    tags:['yoga','ganga-view','veg','couple'],
    amenities:['WiFi','Yoga Classes','Satvik Food','Ganga View','Meditation Hall','Ayurveda'],
    emoji:'🧘',
    gradient:'linear-gradient(135deg,#3498DB,#1A535C)',
    desc:'Riverside ashram-style retreat with certified yoga & meditation sessions daily. Satvik meals, Ayurvedic treatments, Ganga view rooms, and nightly Aarti. No alcohol property.',
    phone:'+91-12345-67892',
    whatsapp:'911234567892',
    checkIn:'11:00 AM', checkOut:'10:00 AM',
    plan:'priority', approved:true, active:true,
    createdAt: new Date('2026-02-01'),
  },
  /* ---- PRIORITY PLAN ---- */
  {
    id:'h004',
    name:'Dev Bhoomi Grand Hotel',
    city:'Haridwar', state:'Uttarakhand', area:'Moti Bazar',
    pin:'249401', lat:29.9430, lng:78.1585,
    type:'hotel', price:1800,
    rating:4.7, reviewCount:187,
    badges:['verified','priority'],
    tags:['ac','veg','parking','family'],
    amenities:['AC','WiFi','Satvik Food','Parking','Room Service','24hr Reception'],
    emoji:'🛕',
    gradient:'linear-gradient(135deg,#1A535C,#4ECDC4)',
    desc:'Heritage-style hotel 5 min walk from Har Ki Pauri. All AC rooms, pure Satvik kitchen, complimentary Ganga Aarti transfer.',
    phone:'+91-12345-67893',
    whatsapp:'911234567893',
    checkIn:'12:00 PM', checkOut:'11:00 AM',
    plan:'priority', approved:true, active:true,
    createdAt: new Date('2026-02-10'),
  },
  {
    id:'h005',
    name:'Savoy Mussoorie Heritage Hotel',
    city:'Mussoorie', state:'Uttarakhand', area:'The Mall',
    pin:'248179', lat:30.4598, lng:78.0664,
    type:'hotel', price:5500,
    rating:4.9, reviewCount:341,
    badges:['featured','verified','premium'],
    tags:['valley-view','pool','heritage','luxury'],
    amenities:['AC','WiFi','Heated Pool','Fine Dining','Spa','Heritage Property','Valet Parking'],
    emoji:'🏰',
    gradient:'linear-gradient(135deg,#9B59B6,#6C3483)',
    desc:'Grand 1902 colonial estate on The Mall. Panoramic Doon Valley views, Victorian interiors, heated indoor pool, award-winning Indian & Continental restaurant.',
    phone:'+91-12345-67894',
    whatsapp:'911234567894',
    checkIn:'2:00 PM', checkOut:'12:00 PM',
    plan:'spotlight', approved:true, active:true,
    createdAt: new Date('2026-01-05'),
  },
  {
    id:'h006',
    name:'White Water Adventure Camp',
    city:'Rishikesh', state:'Uttarakhand', area:'Shivpuri',
    pin:'249192', lat:30.1702, lng:78.3050,
    type:'resort', price:1800,
    rating:4.7, reviewCount:523,
    badges:['verified','trending'],
    tags:['adventure','camping','ganga-view','couple'],
    amenities:['WiFi','River Rafting','Bonfire','Kayaking','Camping','Meals Included'],
    emoji:'⛺',
    gradient:'linear-gradient(135deg,#27AE60,#1E8449)',
    desc:'Luxury tents right on the Ganga banks. Full-day river rafting packages, evening bonfire, kayaking, and stunning starry skies. Meals included.',
    phone:'+91-12345-67895',
    whatsapp:'911234567895',
    checkIn:'11:00 AM', checkOut:'10:00 AM',
    plan:'priority', approved:true, active:true,
    createdAt: new Date('2026-02-14'),
  },
  /* ---- BASIC PLAN ---- */
  {
    id:'h007',
    name:'Shanti Niwas Guest House',
    city:'Haridwar', state:'Uttarakhand', area:'Railway Road',
    pin:'249401', lat:29.9412, lng:78.1524,
    type:'guesthouse', price:650,
    rating:4.3, reviewCount:94,
    badges:['verified'],
    tags:['budget','veg','family'],
    amenities:['WiFi','Pure Veg Food','24hr Reception'],
    emoji:'🌿',
    gradient:'linear-gradient(135deg,#2D6A4F,#52B788)',
    desc:'Clean, affordable rooms near Haridwar Railway Station. Home-cooked Satvik meals. Ideal for pilgrims and budget travellers.',
    phone:'+91-12345-67896',
    whatsapp:'911234567896',
    checkIn:'12:00 PM', checkOut:'11:00 AM',
    plan:'basic', approved:true, active:true,
    createdAt: new Date('2026-03-01'),
  },
  {
    id:'h008',
    name:'Aastha Resort & Ayurveda Spa',
    city:'Haridwar', state:'Uttarakhand', area:'Jwalapur',
    pin:'249407', lat:29.9200, lng:78.1450,
    type:'resort', price:2200,
    rating:4.5, reviewCount:162,
    badges:['verified'],
    tags:['spa','ac','pool','family'],
    amenities:['AC','WiFi','Spa','Pool','Restaurant','Yoga','Parking'],
    emoji:'🌸',
    gradient:'linear-gradient(135deg,#9B59B6,#8E44AD)',
    desc:'Modern resort with Ayurvedic spa, rooftop garden, meditation hall, and yoga sessions. Perfect for wellness retreats and weekend getaways.',
    phone:'+91-12345-67897',
    whatsapp:'911234567897',
    checkIn:'1:00 PM', checkOut:'11:00 AM',
    plan:'basic', approved:true, active:true,
    createdAt: new Date('2026-03-05'),
  },
  {
    id:'h009',
    name:'The Imperial New Delhi',
    city:'New Delhi', state:'Delhi', area:'Connaught Place',
    pin:'110001', lat:28.6139, lng:77.2090,
    type:'hotel', price:12000,
    rating:4.9, reviewCount:892,
    badges:['featured','verified','premium','luxury'],
    tags:['luxury','pool','spa','business','couple'],
    amenities:['AC','WiFi','Pool','Spa','Fine Dining','Bar','Business Centre','Valet','Concierge'],
    emoji:'👑',
    gradient:'linear-gradient(135deg,#E74C3C,#8E44AD)',
    desc:'Iconic 5-star heritage hotel in Lutyens\' Delhi. Art Deco interiors, Michelin-level restaurants, grand ballroom, luxury spa — India\'s most celebrated address.',
    phone:'+91-11-2334-1234',
    whatsapp:'911123456789',
    checkIn:'3:00 PM', checkOut:'12:00 PM',
    plan:'spotlight', approved:true, active:true,
    createdAt: new Date('2026-01-10'),
  },
  {
    id:'h010',
    name:'Moksha Yoga Ashram',
    city:'Rishikesh', state:'Uttarakhand', area:'Swarg Ashram',
    pin:'249302', lat:30.1135, lng:78.3198,
    type:'ashram', price:900,
    rating:4.4, reviewCount:278,
    badges:['verified'],
    tags:['yoga','veg','budget','ganga-view'],
    amenities:['WiFi','Morning Yoga','Satvik Meals','Ganga Aarti View','Meditation'],
    emoji:'🌿',
    gradient:'linear-gradient(135deg,#16A085,#1ABC9C)',
    desc:'Traditional ashram accommodation with morning yoga, Ganga Aarti views, and meals included. Ideal for solo travellers and yoga students seeking an authentic experience.',
    phone:'+91-12345-67898',
    whatsapp:'911234567898',
    checkIn:'10:00 AM', checkOut:'9:00 AM',
    plan:'basic', approved:true, active:true,
    createdAt: new Date('2026-03-08'),
  },
  {
    id:'h011',
    name:'Cedar View Family Resort',
    city:'Mussoorie', state:'Uttarakhand', area:"Camel's Back Road",
    pin:'248179', lat:30.4578, lng:78.0590,
    type:'resort', price:2400,
    rating:4.6, reviewCount:198,
    badges:['verified','family'],
    tags:['family','valley-view','ac','parking'],
    amenities:['AC','WiFi','Restaurant','Kids Play Area','Parking','Room Service'],
    emoji:'🌲',
    gradient:'linear-gradient(135deg,#2ECC71,#27AE60)',
    desc:'Family-favourite resort with cedar forest views, spacious rooms, children\'s play area, and easy access to Camel\'s Back Road. Wholesome family dining available.',
    phone:'+91-12345-67899',
    whatsapp:'911234567899',
    checkIn:'1:00 PM', checkOut:'11:00 AM',
    plan:'priority', approved:true, active:true,
    createdAt: new Date('2026-02-20'),
  },
  {
    id:'h012',
    name:'Doon Heritage Business Hotel',
    city:'Dehradun', state:'Uttarakhand', area:'EC Road',
    pin:'248001', lat:30.3245, lng:78.0420,
    type:'hotel', price:1600,
    rating:4.6, reviewCount:156,
    badges:['verified'],
    tags:['ac','business','parking','family'],
    amenities:['AC','WiFi','Restaurant','Parking','Business Centre','Conference Room'],
    emoji:'🏔️',
    gradient:'linear-gradient(135deg,#3498DB,#2980B9)',
    desc:'Colonial-era building with modern amenities. Centrally located near ISBT and Clock Tower. Business and leisure rooms, conference facilities.',
    phone:'+91-12345-67800',
    whatsapp:'911234567800',
    checkIn:'12:00 PM', checkOut:'11:00 AM',
    plan:'basic', approved:true, active:true,
    createdAt: new Date('2026-03-12'),
  },
];

/* ============================================================
   SEARCH SUGGESTIONS DATA
   ============================================================ */
const SUGGESTIONS = [
  { type:'city',  icon:'📍', label:'Haridwar',   sub:'Uttarakhand · 48 hotels',  link:'hotels.html?city=haridwar'   },
  { type:'city',  icon:'📍', label:'Rishikesh',  sub:'Uttarakhand · 39 hotels',  link:'hotels.html?city=rishikesh'  },
  { type:'city',  icon:'📍', label:'Dehradun',   sub:'Uttarakhand · 62 hotels',  link:'hotels.html?city=dehradun'   },
  { type:'city',  icon:'📍', label:'Mussoorie',  sub:'Uttarakhand · 27 hotels',  link:'hotels.html?city=mussoorie'  },
  { type:'city',  icon:'📍', label:'Delhi',      sub:'Delhi · 210 hotels',       link:'hotels.html?city=delhi'      },
  { type:'city',  icon:'📍', label:'Agra',       sub:'Uttar Pradesh · 98 hotels',link:'hotels.html?city=agra'       },
  { type:'city',  icon:'📍', label:'Jaipur',     sub:'Rajasthan · 145 hotels',   link:'hotels.html?city=jaipur'     },
  { type:'city',  icon:'📍', label:'Manali',     sub:'Himachal Pradesh · 112 hotels',link:'hotels.html?city=manali' },
  { type:'city',  icon:'📍', label:'Varanasi',   sub:'Uttar Pradesh · 74 hotels',link:'hotels.html?city=varanasi'   },
  { type:'area',  icon:'🗺️', label:'Har Ki Pauri',sub:'Haridwar, Uttarakhand',  link:'hotels.html?area=har-ki-pauri'},
  { type:'area',  icon:'🗺️', label:'Laxman Jhula',sub:'Rishikesh, Uttarakhand', link:'hotels.html?area=laxman-jhula'},
  { type:'area',  icon:'🗺️', label:'The Mall Road',sub:'Mussoorie, Uttarakhand',link:'hotels.html?area=mall-road'  },
  { type:'area',  icon:'🗺️', label:'Connaught Place',sub:'New Delhi',            link:'hotels.html?area=cp'         },
  { type:'type',  icon:'🧘', label:'Ashrams',    sub:'Yoga & Spiritual Stays',   link:'hotels.html?type=ashram'     },
  { type:'type',  icon:'🕉️', label:'Dharamshalas',sub:'Pilgrim Accommodations', link:'hotels.html?type=dharamshala'},
  { type:'type',  icon:'👑', label:'Luxury Hotels',sub:'5-Star Premium Stays',   link:'hotels.html?type=luxury'     },
  { type:'type',  icon:'💚', label:'Budget Stays',sub:'Under ₹1,000 per night',  link:'hotels.html?budget=budget'   },
  { type:'hotel', icon:'🏨', label:'Ganga Darshan Palace',sub:'Haridwar · ₹2,800/night', link:'hotel-detail.html?id=h001'},
  { type:'hotel', icon:'🌲', label:'Forest Valley Resort',sub:'Dehradun · ₹3,800/night', link:'hotel-detail.html?id=h002'},
  { type:'hotel', icon:'🧘', label:'Triveni Yoga Retreat',sub:'Rishikesh · ₹2,200/night',link:'hotel-detail.html?id=h003'},
];

/* ============================================================
   TESTIMONIALS DATA
   ============================================================ */
const TESTIMONIALS = [
  { stars:5, text:'"Found the perfect Ganga view hotel in Haridwar within 5 minutes. Called directly, got a 10% discount. This site is a game changer!"', author:'Priya Sharma', location:'Delhi' },
  { stars:5, text:'"As a solo traveller to Rishikesh, I found exactly the kind of quiet ashram stay I was looking for. Real photos made all the difference."', author:'Arjun Mehta', location:'Mumbai' },
  { stars:4, text:'"No booking fees, no surprise charges. Just direct contact with the hotel. Booked a family resort in Mussoorie — 5 of us loved it."', author:'Sunita Kapoor', location:'Lucknow' },
  { stars:5, text:'"Used StayIndia for my Char Dham yatra planning. Checked dharamshalas in all four cities. Everything matched the photos exactly."', author:'Ramesh Patel', location:'Ahmedabad' },
];

/* ============================================================
   REVIEWS DATA (keyed by hotel id)
   ============================================================ */
const REVIEWS = {
  h001: [
    { name:'Suresh K.', rating:5, date:'March 2026', text:'Spectacular Ganga view from the balcony. The aarti view at sunrise was unforgettable. Rooms are spacious and food is excellent.' },
    { name:'Meera R.', rating:5, date:'February 2026', text:'Best hotel experience in Haridwar. Staff was extremely helpful, room was spotless, and the rooftop restaurant was fantastic.' },
    { name:'Amit T.', rating:4, date:'January 2026', text:'Great location and beautiful views. Slightly expensive but worth it for the Ganga view rooms. Would return.' },
  ],
  h002: [
    { name:'Deepika S.', rating:5, date:'March 2026', text:'Absolutely stunning resort. The infinity pool with Mussoorie views is breathtaking. Spa treatments are world class.' },
    { name:'Rahul M.', rating:5, date:'February 2026', text:'Came for a weekend and wished we could stay longer. The forest setting is magical, rooms are luxurious.' },
  ],
  h003: [
    { name:'Anjali V.', rating:5, date:'March 2026', text:'Transformative experience. The yoga sessions are authentic, food is pure, and the Ganga views from the meditation hall are stunning.' },
    { name:'Kumar D.', rating:5, date:'February 2026', text:'Perfect for a digital detox. Peaceful, clean, great yoga instructors. The satvik food is delicious.' },
    { name:'Pooja N.', rating:4, date:'January 2026', text:'Loved the overall vibe. Rooms are simple but clean. Morning yoga at sunrise by the Ganga is an experience you cannot describe.' },
  ],
};

/* ============================================================
   FIREBASE CONFIG PLACEHOLDER
   ============================================================ */
const FIREBASE_CONFIG = {
  // Replace with your actual Firebase project config
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

/* ============================================================
   DATA ACCESS HELPERS
   ============================================================ */

/** Get all hotels, optionally filtered */
function getHotels({ city, type, budget, area, tags, sort = 'featured', limit = 100 } = {}) {
  let results = [...HOTELS];

  if (city)   results = results.filter(h => h.city.toLowerCase() === city.toLowerCase());
  if (type)   results = results.filter(h => h.type === type);
  if (area)   results = results.filter(h => h.area.toLowerCase().includes(area.toLowerCase()));
  if (tags && tags.length) results = results.filter(h => tags.some(t => h.tags.includes(t)));

  if (budget === 'budget')    results = results.filter(h => h.price < 1000);
  if (budget === 'mid')       results = results.filter(h => h.price >= 1000 && h.price < 3000);
  if (budget === 'premium')   results = results.filter(h => h.price >= 3000 && h.price < 8000);
  if (budget === 'luxury')    results = results.filter(h => h.price >= 8000);

  // Sorting
  if (sort === 'rating')      results.sort((a,b) => b.rating - a.rating);
  else if (sort === 'priceLow')  results.sort((a,b) => a.price - b.price);
  else if (sort === 'priceHigh') results.sort((a,b) => b.price - a.price);
  else if (sort === 'newest')    results.sort((a,b) => b.createdAt - a.createdAt);
  else if (sort === 'reviews')   results.sort((a,b) => b.reviewCount - a.reviewCount);
  else {
    // Default: spotlight first, then priority, then basic
    const planOrder = { spotlight:0, priority:1, basic:2 };
    results.sort((a,b) => (planOrder[a.plan]||2) - (planOrder[b.plan]||2) || b.rating - a.rating);
  }

  return results.slice(0, limit);
}

/** Get single hotel by id */
function getHotelById(id) {
  return HOTELS.find(h => h.id === id) || null;
}

/** Get featured hotels */
function getFeaturedHotels(limit = 6) {
  return getHotels({ sort: 'featured', limit });
}

/** Get trending (most reviewed) */
function getTrendingHotels(limit = 3) {
  return getHotels({ sort: 'reviews', limit });
}

/** Get newest hotels */
function getNewHotels(limit = 3) {
  return getHotels({ sort: 'newest', limit });
}

/** Get budget hotels */
function getBudgetHotels(limit = 3) {
  return getHotels({ budget: 'budget', limit });
}

/** Get hotels near Har Ki Pauri */
function getHKPHotels(limit = 3) {
  return getHotels({ city: 'Haridwar', sort: 'featured', limit });
}

/** Get similar hotels (same city, different id) */
function getSimilarHotels(hotel, limit = 3) {
  return HOTELS
    .filter(h => h.city === hotel.city && h.id !== hotel.id)
    .slice(0, limit);
}

/** Full text search */
function searchHotels(query) {
  const q = query.toLowerCase().trim();
  if (!q) return HOTELS;
  return HOTELS.filter(h =>
    h.name.toLowerCase().includes(q) ||
    h.city.toLowerCase().includes(q) ||
    h.area.toLowerCase().includes(q) ||
    h.desc.toLowerCase().includes(q) ||
    h.type.toLowerCase().includes(q) ||
    h.amenities.some(a => a.toLowerCase().includes(q))
  );
}

/** Get suggestions for search */
function getSuggestions(query) {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  return SUGGESTIONS.filter(s =>
    s.label.toLowerCase().includes(q) ||
    s.sub.toLowerCase().includes(q)
  ).slice(0, 6);
}

/** Format price */
function formatPrice(price) {
  return '₹' + price.toLocaleString('en-IN');
}

/** Render star rating */
function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  let stars = '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - half);
  return `<span style="color:var(--gold)">${stars}</span>`;
}

/** Get badge HTML */
function getBadgeHTML(badges = []) {
  const map = {
    featured:  { cls:'badge-featured',  label:'⭐ Featured' },
    verified:  { cls:'badge-verified',  label:'✓ Verified'  },
    premium:   { cls:'badge-premium',   label:'👑 Premium'  },
    trending:  { cls:'badge-new',       label:'🔥 Trending' },
    'new':     { cls:'badge-new',       label:'✨ New'      },
    priority:  { cls:'badge-ganga',     label:'⬆ Priority'  },
    family:    { cls:'badge-verified',  label:'👨‍👩‍👧 Family' },
    luxury:    { cls:'badge-featured',  label:'💎 Luxury'   },
    budget:    { cls:'badge-budget',    label:'💚 Budget'   },
  };
  return badges.map(b => {
    const info = map[b];
    return info ? `<span class="badge ${info.cls}">${info.label}</span>` : '';
  }).join('');
}

/** Render hotel card HTML */
function renderHotelCard(hotel) {
  const badgesHTML  = getBadgeHTML(hotel.badges);
  const amenitiesHTML = hotel.amenities.slice(0,4).map(a =>
    `<span class="amenity-chip">${AMENITY_ICONS[a] || '•'} ${a}</span>`
  ).join('');

  return `
<article class="hotel-card reveal" onclick="openDetail('${hotel.id}')" tabindex="0" 
  role="article" aria-label="${hotel.name}, ${hotel.city}">
  <div class="hc-img">
    <div class="hc-img-bg" style="background:${hotel.gradient}">${hotel.emoji}</div>
    <div class="hc-img-overlay"></div>
    <div class="hc-badges">${badgesHTML}</div>
    <button class="hc-fav" onclick="toggleFav(event,'${hotel.id}')" 
      aria-label="Save to favourites" id="fav-${hotel.id}">♡</button>
    <div class="hc-rating-badge">⭐ ${hotel.rating} <span style="opacity:.6">(${hotel.reviewCount})</span></div>
  </div>
  <div class="hc-body">
    <div class="hc-location">📍 ${hotel.area}, ${hotel.city}</div>
    <h3 class="hc-name">${hotel.name}</h3>
    <p class="hc-desc">${hotel.desc}</p>
    <div class="hc-amenities">${amenitiesHTML}</div>
    <div class="hc-footer">
      <div class="hc-price">
        <span>Starting from</span>
        <strong>${formatPrice(hotel.price)}<span style="font-size:.75rem;font-weight:500;color:var(--gray-400)">/night</span></strong>
      </div>
      <div class="hc-actions">
        <a href="https://wa.me/${hotel.whatsapp}" target="_blank" rel="noopener" 
          class="btn-wa" onclick="event.stopPropagation()" aria-label="WhatsApp ${hotel.name}">
          💬 WhatsApp
        </a>
        <a href="tel:${hotel.phone}" class="btn-call" 
          onclick="event.stopPropagation()" aria-label="Call ${hotel.name}">
          📞 Call
        </a>
      </div>
    </div>
  </div>
</article>`;
}

/** Amenity icon map */
const AMENITY_ICONS = {
  'AC':'❄️', 'WiFi':'📶', 'Pool':'🏊', 'Spa':'🧖', 'Restaurant':'🍽️',
  'Parking':'🅿️', 'Pure Veg':'🙏', 'Satvik Food':'🌿', 'Ganga View':'🌊',
  'Yoga Classes':'🧘', 'River Rafting':'🚣', 'Bonfire':'🔥', 'Gym':'💪',
  'Bar':'🍸', 'Fine Dining':'👑', 'Valet':'🚗', 'Concierge':'🛎️',
  'Morning Yoga':'🌅', 'Satvik Meals':'🍃', 'Meditation':'🕊️',
  'Heritage Property':'🏛️', 'Room Service':'🛎️', '24hr Reception':'🕐',
  'Business Centre':'💼', 'Conference Room':'👥', 'Kids Play Area':'🎠',
  'Heated Pool':'♨️', 'Ayurveda':'🌿', 'Meals Included':'🍱',
  'Kayaking':'🚣', 'Camping':'⛺', 'Meditation Hall':'🧘',
};

/** Render skeleton loader cards */
function renderSkeletons(count = 3) {
  return Array(count).fill(0).map(() => `
<div class="skeleton-card">
  <div class="skeleton-img skeleton"></div>
  <div class="skeleton-body">
    <div class="sk-line skeleton" style="width:40%;margin-bottom:.25rem"></div>
    <div class="sk-line skeleton" style="width:75%;height:16px;margin-bottom:.5rem"></div>
    <div class="sk-line skeleton" style="width:90%"></div>
    <div class="sk-line skeleton" style="width:85%"></div>
    <div class="sk-line skeleton" style="width:60%;margin-top:.5rem;height:32px;border-radius:20px"></div>
  </div>
</div>`).join('');
}

/** Render city card */
function renderCityCard(city) {
  return `
<a href="hotels.html?city=${city.id}" class="city-card reveal">
  <div class="city-emoji">${city.emoji}</div>
  <div class="city-name">${city.name}</div>
  <div class="city-state">${city.state}</div>
  <span class="city-count">${city.count} Hotels</span>
</a>`;
}
