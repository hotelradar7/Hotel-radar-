/**
 * HotelRadar — Data Layer
 * data.js
 */
'use strict';

/* ============================================================
   CITIES
   ============================================================ */
const CITIES = [
  { id: 'haridwar',  name: 'Haridwar',  state: 'Uttarakhand', emoji: '🛕', count: 48 },
  { id: 'rishikesh', name: 'Rishikesh', state: 'Uttarakhand', emoji: '🧘', count: 39 },
  { id: 'dehradun',  name: 'Dehradun',  state: 'Uttarakhand', emoji: '🏔️', count: 62 },
  { id: 'mussoorie', name: 'Mussoorie', state: 'Uttarakhand', emoji: '🌲', count: 27 },
  { id: 'delhi',     name: 'New Delhi', state: 'Delhi',       emoji: '🏛️', count: 210 },
  { id: 'gurgaon',   name: 'Gurgaon',   state: 'Haryana',     emoji: '🏙️', count: 85 },
  { id: 'noida',     name: 'Noida',     state: 'Uttar Pradesh', emoji: '🌆', count: 67 },
  { id: 'faridabad', name: 'Faridabad', state: 'Haryana',     emoji: '🏘️', count: 23 },
  { id: 'jaipur',    name: 'Jaipur',    state: 'Rajasthan',   emoji: '🏰', count: 145 },
  { id: 'udaipur',   name: 'Udaipur',   state: 'Rajasthan',   emoji: '🏯', count: 92 },
  { id: 'jaisalmer', name: 'Jaisalmer', state: 'Rajasthan',   emoji: '🐫', count: 58 },
  { id: 'jodhpur',   name: 'Jodhpur',   state: 'Rajasthan',   emoji: '🌟', count: 76 },
  { id: 'pushkar',   name: 'Pushkar',   state: 'Rajasthan',   emoji: '🌹', count: 34 },
  { id: 'bikaner',   name: 'Bikaner',   state: 'Rajasthan',   emoji: '🦚', count: 28 },
  { id: 'ajmer',     name: 'Ajmer',     state: 'Rajasthan',   emoji: '🕌', count: 45 },
  { id: 'mount-abu', name: 'Mount Abu', state: 'Rajasthan',   emoji: '🌄', count: 62 },
  { id: 'shimla',    name: 'Shimla',    state: 'Himachal Pradesh', emoji: '🍎', count: 88 },
  { id: 'manali',    name: 'Manali',    state: 'Himachal Pradesh', emoji: '❄️', count: 112 },
  { id: 'dharamshala', name: 'Dharamshala', state: 'Himachal Pradesh', emoji: '🌺', count: 65 },
  { id: 'kasol',     name: 'Kasol',     state: 'Himachal Pradesh', emoji: '🌊', count: 24 },
  { id: 'spiti',     name: 'Spiti Valley', state: 'Himachal Pradesh', emoji: '🏔️', count: 18 },
  { id: 'dalhousie', name: 'Dalhousie', state: 'Himachal Pradesh', emoji: '🌲', count: 32 },
  { id: 'agra',      name: 'Agra',      state: 'Uttar Pradesh', emoji: '🕌', count: 98 },
  { id: 'varanasi',  name: 'Varanasi',  state: 'Uttar Pradesh', emoji: '🪔', count: 74 },
  { id: 'lucknow',   name: 'Lucknow',   state: 'Uttar Pradesh', emoji: '🌆', count: 118 },
  { id: 'mathura',   name: 'Mathura',   state: 'Uttar Pradesh', emoji: '🕍', count: 42 },
  { id: 'vrindavan', name: 'Vrindavan', state: 'Uttar Pradesh', emoji: '🌸', count: 31 },
  { id: 'ayodhya',   name: 'Ayodhya',   state: 'Uttar Pradesh', emoji: '🔱', count: 26 },
  { id: 'prayagraj', name: 'Prayagraj', state: 'Uttar Pradesh', emoji: '🌊', count: 55 },
  { id: 'meerut',    name: 'Meerut',    state: 'Uttar Pradesh', emoji: '🏙️', count: 41 },
];

/* ============================================================
   CATEGORIES
   ============================================================ */
const CATEGORIES = [
  { id: 'luxury',      label: 'Luxury',    emoji: '👑' },
  { id: 'budget',      label: 'Budget',    emoji: '💰' },
  { id: 'resort',      label: 'Resorts',   emoji: '🌿' },
  { id: 'ashram',      label: 'Ashrams',   emoji: '🧘' },
  { id: 'dharamshala', label: 'Dharamshala', emoji: '🛕' },
  { id: 'family',      label: 'Family',    emoji: '👨‍👩‍👧' },
  { id: 'guesthouse',  label: 'Guest House', emoji: '🏡' },
  { id: 'couple',      label: 'Couples',   emoji: '💑' },
];

/* ============================================================
   HOTELS
   ============================================================ */
const HOTELS = [
  {
    id: 'h001', name: 'Ganga Darshan Palace', city: 'Haridwar', state: 'Uttarakhand',
    area: 'Har Ki Pauri Road', pin: '249401', lat: 29.9457, lng: 78.1642,
    type: 'hotel', price: 2800, rating: 4.9, reviewCount: 312,
    badges: ['featured', 'verified'], tags: ['ganga-view', 'ac', 'veg', 'family'],
    amenities: ['AC', 'WiFi', 'Restaurant', 'Pure Veg', 'Ganga View', 'Parking', 'Room Service', '24hr Reception'],
    emoji: '🏨', gradient: 'linear-gradient(135deg,#E8631C,#F2A65A)',
    desc: 'Premium riverside hotel with breathtaking Ganga Aarti views from private balconies. Spacious AC suites, rooftop restaurant serving pure vegetarian cuisine.',
    phone: '+91-12345-67890', checkIn: '12:00 PM', checkOut: '11:00 AM',
    plan: 'spotlight', approved: true, active: true, createdAt: new Date('2026-01-15'),
  },
  {
    id: 'h002', name: 'Forest Valley Resort & Spa', city: 'Dehradun', state: 'Uttarakhand',
    area: 'Rajpur Road', pin: '248001', lat: 30.3753, lng: 78.0322,
    type: 'resort', price: 3800, rating: 4.9, reviewCount: 289,
    badges: ['featured', 'verified'], tags: ['mountain-view', 'pool', 'spa', 'ac'],
    amenities: ['AC', 'WiFi', 'Pool', 'Spa', 'Restaurant', 'Parking', 'Gym', 'Bar'],
    emoji: '🌲', gradient: 'linear-gradient(135deg,#1F7A4D,#5BAE85)',
    desc: 'Luxury hilltop resort with panoramic Mussoorie views. Infinity pool, full-service Ayurvedic spa, fine dining, set in Sal forest.',
    phone: '+91-12345-67891', checkIn: '2:00 PM', checkOut: '12:00 PM',
    plan: 'spotlight', approved: true, active: true, createdAt: new Date('2026-01-20'),
  },
  {
    id: 'h003', name: 'Triveni Yoga & Wellness Retreat', city: 'Rishikesh', state: 'Uttarakhand',
    area: 'Laxman Jhula', pin: '249302', lat: 30.1285, lng: 78.3210,
    type: 'ashram', price: 2200, rating: 4.9, reviewCount: 418,
    badges: ['featured', 'verified'], tags: ['yoga', 'ganga-view', 'veg'],
    amenities: ['WiFi', 'Yoga Classes', 'Satvik Food', 'Ganga View', 'Meditation Hall', 'Ayurveda'],
    emoji: '🧘', gradient: 'linear-gradient(135deg,#2D6A9E,#5FA3D6)',
    desc: 'Riverside ashram-style retreat with certified yoga & meditation sessions daily. Satvik meals, Ayurvedic treatments, Ganga view rooms.',
    phone: '+91-12345-67892', checkIn: '11:00 AM', checkOut: '10:00 AM',
    plan: 'priority', approved: true, active: true, createdAt: new Date('2026-02-01'),
  },
  {
    id: 'h004', name: 'Dev Bhoomi Grand Hotel', city: 'Haridwar', state: 'Uttarakhand',
    area: 'Moti Bazar', pin: '249401', lat: 29.9430, lng: 78.1585,
    type: 'hotel', price: 1800, rating: 4.7, reviewCount: 187,
    badges: ['verified', 'priority'], tags: ['ac', 'veg', 'family'],
    amenities: ['AC', 'WiFi', 'Satvik Food', 'Parking', 'Room Service', '24hr Reception'],
    emoji: '🛕', gradient: 'linear-gradient(135deg,#1F7A4D,#3CA374)',
    desc: 'Heritage-style hotel 5 min walk from Har Ki Pauri. All AC rooms, pure Satvik kitchen, complimentary Ganga Aarti transfer.',
    phone: '+91-12345-67893', checkIn: '12:00 PM', checkOut: '11:00 AM',
    plan: 'priority', approved: true, active: true, createdAt: new Date('2026-02-10'),
  },
  {
    id: 'h005', name: 'Savoy Mussoorie Heritage Hotel', city: 'Mussoorie', state: 'Uttarakhand',
    area: 'The Mall', pin: '248179', lat: 30.4598, lng: 78.0664,
    type: 'hotel', price: 5500, rating: 4.9, reviewCount: 341,
    badges: ['featured', 'verified'], tags: ['valley-view', 'pool', 'heritage'],
    amenities: ['AC', 'WiFi', 'Heated Pool', 'Fine Dining', 'Spa', 'Heritage Property', 'Valet Parking'],
    emoji: '🏰', gradient: 'linear-gradient(135deg,#6B4A8A,#9B7CB8)',
    desc: 'Grand 1902 colonial estate on The Mall. Panoramic Doon Valley views, Victorian interiors, heated indoor pool.',
    phone: '+91-12345-67894', checkIn: '2:00 PM', checkOut: '12:00 PM',
    plan: 'spotlight', approved: true, active: true, createdAt: new Date('2026-01-05'),
  },
  {
    id: 'h006', name: 'White Water Adventure Camp', city: 'Rishikesh', state: 'Uttarakhand',
    area: 'Shivpuri', pin: '249192', lat: 30.1702, lng: 78.3050,
    type: 'resort', price: 1800, rating: 4.7, reviewCount: 523,
    badges: ['verified'], tags: ['adventure', 'camping', 'ganga-view'],
    amenities: ['WiFi', 'River Rafting', 'Bonfire', 'Kayaking', 'Camping', 'Meals Included'],
    emoji: '⛺', gradient: 'linear-gradient(135deg,#1F7A4D,#6FB890)',
    desc: 'Luxury tents right on the Ganga banks. Full-day river rafting packages, evening bonfire, kayaking.',
    phone: '+91-12345-67895', checkIn: '11:00 AM', checkOut: '10:00 AM',
    plan: 'priority', approved: true, active: true, createdAt: new Date('2026-02-14'),
  },
  {
    id: 'h007', name: 'Shanti Niwas Guest House', city: 'Haridwar', state: 'Uttarakhand',
    area: 'Railway Road', pin: '249401', lat: 29.9412, lng: 78.1524,
    type: 'guesthouse', price: 650, rating: 4.3, reviewCount: 94,
    badges: ['verified'], tags: ['budget', 'veg', 'family'],
    amenities: ['WiFi', 'Pure Veg Food', '24hr Reception'],
    emoji: '🏡', gradient: 'linear-gradient(135deg,#5C5955,#948F89)',
    desc: 'Clean, affordable rooms near Haridwar Railway Station. Home-cooked Satvik meals.',
    phone: '+91-12345-67896', checkIn: '12:00 PM', checkOut: '11:00 AM',
    plan: 'basic', approved: true, active: true, createdAt: new Date('2026-03-01'),
  },
  {
    id: 'h008', name: 'Aastha Resort & Ayurveda Spa', city: 'Haridwar', state: 'Uttarakhand',
    area: 'Jwalapur', pin: '249407', lat: 29.9200, lng: 78.1450,
    type: 'resort', price: 2200, rating: 4.5, reviewCount: 162,
    badges: ['verified'], tags: ['spa', 'ac', 'pool', 'family'],
    amenities: ['AC', 'WiFi', 'Spa', 'Pool', 'Restaurant', 'Yoga', 'Parking'],
    emoji: '🌸', gradient: 'linear-gradient(135deg,#9B5A8A,#C18FB5)',
    desc: 'Modern resort with Ayurvedic spa, rooftop garden, meditation hall, and yoga sessions.',
    phone: '+91-12345-67897', checkIn: '1:00 PM', checkOut: '11:00 AM',
    plan: 'basic', approved: true, active: true, createdAt: new Date('2026-03-05'),
  },
  {
    id: 'h009', name: 'The Imperial New Delhi', city: 'New Delhi', state: 'Delhi',
    area: 'Connaught Place', pin: '110001', lat: 28.6139, lng: 77.2090,
    type: 'hotel', price: 12000, rating: 4.9, reviewCount: 892,
    badges: ['featured', 'verified'], tags: ['luxury', 'pool', 'spa', 'family'],
    amenities: ['AC', 'WiFi', 'Pool', 'Spa', 'Fine Dining', 'Bar', 'Business Centre', 'Valet'],
    emoji: '👑', gradient: 'linear-gradient(135deg,#C23B2E,#8A3FA8)',
    desc: 'Iconic 5-star heritage hotel in Lutyens\' Delhi. Art Deco interiors, Michelin-level restaurants, grand ballroom.',
    phone: '+91-11-2334-1234', checkIn: '3:00 PM', checkOut: '12:00 PM',
    plan: 'spotlight', approved: true, active: true, createdAt: new Date('2026-01-10'),
  },
  {
    id: 'h010', name: 'Moksha Yoga Ashram', city: 'Rishikesh', state: 'Uttarakhand',
    area: 'Swarg Ashram', pin: '249302', lat: 30.1135, lng: 78.3198,
    type: 'ashram', price: 900, rating: 4.4, reviewCount: 278,
    badges: ['verified'], tags: ['yoga', 'veg', 'budget'],
    amenities: ['WiFi', 'Morning Yoga', 'Satvik Meals', 'Ganga Aarti View', 'Meditation'],
    emoji: '🪷', gradient: 'linear-gradient(135deg,#1F7A4D,#52A37E)',
    desc: 'Traditional ashram accommodation with morning yoga, Ganga Aarti views, and meals included.',
    phone: '+91-12345-67898', checkIn: '10:00 AM', checkOut: '9:00 AM',
    plan: 'basic', approved: true, active: true, createdAt: new Date('2026-03-08'),
  },
  {
    id: 'h011', name: 'Cedar View Family Resort', city: 'Mussoorie', state: 'Uttarakhand',
    area: "Camel's Back Road", pin: '248179', lat: 30.4578, lng: 78.0590,
    type: 'resort', price: 2400, rating: 4.6, reviewCount: 198,
    badges: ['verified', 'family'], tags: ['family', 'valley-view', 'ac'],
    amenities: ['AC', 'WiFi', 'Restaurant', 'Kids Play Area', 'Parking', 'Room Service'],
    emoji: '🌳', gradient: 'linear-gradient(135deg,#1F7A4D,#4F9D70)',
    desc: 'Family-favourite resort with cedar forest views, spacious rooms, children\'s play area.',
    phone: '+91-12345-67899', checkIn: '1:00 PM', checkOut: '11:00 AM',
    plan: 'priority', approved: true, active: true, createdAt: new Date('2026-02-20'),
  },
  {
    id: 'h012', name: 'Doon Heritage Business Hotel', city: 'Dehradun', state: 'Uttarakhand',
    area: 'EC Road', pin: '248001', lat: 30.3245, lng: 78.0420,
    type: 'hotel', price: 1600, rating: 4.6, reviewCount: 156,
    badges: ['verified'], tags: ['ac', 'business'],
    amenities: ['AC', 'WiFi', 'Restaurant', 'Parking', 'Business Centre', 'Conference Room'],
    emoji: '🏛️', gradient: 'linear-gradient(135deg,#2D6A9E,#4F8FC2)',
    desc: 'Colonial-era building with modern amenities. Centrally located near ISBT and Clock Tower.',
    phone: '+91-12345-67800', checkIn: '12:00 PM', checkOut: '11:00 AM',
    plan: 'basic', approved: true, active: true, createdAt: new Date('2026-03-12'),
  },
];

/* ============================================================
   AMENITY ICON MAP
   ============================================================ */
const AMENITY_ICONS = {
  'AC':'❄️','WiFi':'📶','Pool':'🏊','Spa':'🧖','Restaurant':'🍽️','Parking':'🅿️',
  'Pure Veg':'🙏','Satvik Food':'🌿','Ganga View':'🌊','Yoga Classes':'🧘',
  'River Rafting':'🚣','Bonfire':'🔥','Gym':'💪','Bar':'🍸','Fine Dining':'👑',
  'Valet':'🚗','Morning Yoga':'🌅','Satvik Meals':'🍃','Meditation':'🕊️',
  'Heritage Property':'🏛️','Room Service':'🛎️','24hr Reception':'🕐',
  'Business Centre':'💼','Conference Room':'👥','Kids Play Area':'🎠',
  'Heated Pool':'♨️','Meals Included':'🍱','Kayaking':'🚣','Camping':'⛺',
  'Ganga Aarti View':'🪔','Meditation Hall':'🧘','Valet Parking':'🚗',
};

/* ============================================================
   REVIEWS
   ============================================================ */
const REVIEWS = {
  h001: [
    { name:'Suresh K.', rating:5, date:'March 2026', text:'Spectacular Ganga view from the balcony. The aarti view at sunrise was unforgettable.' },
    { name:'Meera R.', rating:5, date:'February 2026', text:'Best hotel experience in Haridwar. Staff was extremely helpful, room was spotless.' },
    { name:'Amit T.', rating:4, date:'January 2026', text:'Great location and beautiful views. Slightly expensive but worth it.' },
  ],
  h002: [
    { name:'Deepika S.', rating:5, date:'March 2026', text:'Absolutely stunning resort. The infinity pool with Mussoorie views is breathtaking.' },
    { name:'Rahul M.', rating:5, date:'February 2026', text:'Came for a weekend and wished we could stay longer. Rooms are luxurious.' },
  ],
  h003: [
    { name:'Anjali V.', rating:5, date:'March 2026', text:'Transformative experience. Yoga sessions are authentic, food is pure.' },
    { name:'Kumar D.', rating:5, date:'February 2026', text:'Perfect for a digital detox. Peaceful, clean, great yoga instructors.' },
  ],
};

/* ============================================================
   HELPERS
   ============================================================ */
function getHotels({ city, type, budget, area, sort = 'featured', limit = 100 } = {}) {
  let results = HOTELS.filter(h => h.approved && h.active);
  if (city) results = results.filter(h => h.city.toLowerCase() === city.toLowerCase());
  if (type) results = results.filter(h => h.type === type || h.tags.includes(type));
  if (area) results = results.filter(h => h.area.toLowerCase().includes(area.toLowerCase()));
  if (budget === 'budget')  results = results.filter(h => h.price < 1000);
  if (budget === 'mid')     results = results.filter(h => h.price >= 1000 && h.price < 3000);
  if (budget === 'premium') results = results.filter(h => h.price >= 3000 && h.price < 8000);
  if (budget === 'luxury')  results = results.filter(h => h.price >= 8000);

  if (sort === 'rating')      results.sort((a,b)=>b.rating-a.rating);
  else if (sort === 'priceLow')  results.sort((a,b)=>a.price-b.price);
  else if (sort === 'priceHigh') results.sort((a,b)=>b.price-a.price);
  else if (sort === 'newest')    results.sort((a,b)=>b.createdAt-a.createdAt);
  else {
    const order = { spotlight:0, priority:1, basic:2 };
    results.sort((a,b)=> (order[a.plan]||2)-(order[b.plan]||2) || b.rating-a.rating);
  }
  return results.slice(0, limit);
}

function getHotelById(id) { return HOTELS.find(h => h.id === id) || null; }
function getFeaturedHotels(limit=6) { return getHotels({ sort:'featured', limit }); }
function getTrendingHotels(limit=3) { return [...HOTELS].filter(h=>h.approved&&h.active).sort((a,b)=>b.reviewCount-a.reviewCount).slice(0,limit); }
function getSimilarHotels(hotel, limit=3) { return HOTELS.filter(h=>h.city===hotel.city && h.id!==hotel.id).slice(0,limit); }

function searchHotels(query) {
  const q = query.toLowerCase().trim();
  if (!q) return HOTELS.filter(h=>h.approved&&h.active);
  return HOTELS.filter(h => h.approved && h.active && (
    h.name.toLowerCase().includes(q) ||
    h.city.toLowerCase().includes(q) ||
    h.area.toLowerCase().includes(q) ||
    h.state.toLowerCase().includes(q) ||
    h.type.toLowerCase().includes(q)
  ));
}

/** Build live suggestion list: hotels + cities + states matching query */
function getSuggestions(query) {
  const q = query.toLowerCase().trim();
  if (q.length < 1) return [];
  const out = [];

  // Hotel name matches first (most specific)
  HOTELS.filter(h => h.approved && h.active && h.name.toLowerCase().includes(q))
    .slice(0, 4)
    .forEach(h => out.push({
      type: 'hotel', icon: h.emoji, label: h.name,
      sub: `${h.area}, ${h.city} · ₹${h.price}/night`,
      link: `hotel-detail.html?id=${h.id}`,
    }));

  // City matches
  CITIES.filter(c => c.name.toLowerCase().includes(q))
    .slice(0, 4)
    .forEach(c => out.push({
      type: 'city', icon: c.emoji, label: c.name,
      sub: `${c.state} · ${c.count} hotels`,
      link: `hotels.html?city=${c.id}`,
    }));

  // State matches → show city list under that state
  const states = [...new Set(CITIES.map(c => c.state))];
  states.filter(s => s.toLowerCase().includes(q))
    .slice(0, 2)
    .forEach(s => {
      const stateCities = CITIES.filter(c => c.state === s);
      const totalHotels = stateCities.reduce((sum,c)=>sum+c.count,0);
      out.push({
        type: 'state', icon: '📍', label: s,
        sub: `${stateCities.length} cities · ${totalHotels} hotels`,
        link: `hotels.html?state=${encodeURIComponent(s)}`,
      });
    });

  return out.slice(0, 8);
}

function formatPrice(p) { return '₹' + p.toLocaleString('en-IN'); }

function getBadgeTag(badge) {
  const map = {
    featured: { cls:'tag-featured', label:'Featured' },
    verified: { cls:'tag-verified', label:'Verified' },
    priority: { cls:'tag-priority', label:'Priority' },
  };
  return map[badge] || null;
}
