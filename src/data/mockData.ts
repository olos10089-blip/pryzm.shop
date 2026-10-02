import { Product, CountryInfo, Coupon, CommunityPost, Order, ChatMessage, CallbackRequest, VIPLeaderboardUser } from '../types';
import { ALL_WORLD_COUNTRIES } from './countries';

export const COUNTRIES: CountryInfo[] = ALL_WORLD_COUNTRIES;

export const PRODUCTS: Product[] = [
  {
    id: 'prz-vessel-01',
    name: 'Vessel No. IV / Fluted Amphora',
    category: 'vessels',
    priceUSD: 195,
    weightKg: 4.8,
    dimensions: '38 × 16 × 16 cm',
    finishOptions: ['Charcoal Basalt', 'Raw Brutalist Grey', 'Alabaster Chalk'],
    image: '/src/assets/images/product_fluted_vessel_1790949065067.jpg',
    description: 'Monolithic fluted concrete vessel individually poured using high-density architectural micro-cement with subtle porous cavities along the vertical fluting.',
    architecturalNote: 'Treated with food-safe breathable fluoropolymer hydrophobic sealant to ensure botanical water retention without dark moisture seepage.',
    leadTimeDays: 4,
    inStock: true,
    featured: true
  },
  {
    id: 'prz-light-02',
    name: 'Aethel Brutalist Table Monolith',
    category: 'lighting',
    priceUSD: 340,
    weightKg: 7.2,
    dimensions: '42 × 22 × 18 cm',
    finishOptions: ['Raw Brutalist Grey', 'Volcanic Aggregate', 'Dark Basalt'],
    image: '/src/assets/images/product_brutalist_lamp_1790949076221.jpg',
    description: 'Cast from raw volcanic aggregate concrete with integrated solid brass dimmer rotary switch and frosted mouth-blown diffusion orb.',
    architecturalNote: 'Internal vibration-damped cable conduit with grounded fabric-sheathed braided cord. Weighs 7.2 kg for immovable tactile desk grounding.',
    leadTimeDays: 5,
    inStock: true,
    featured: true
  },
  {
    id: 'prz-tray-03',
    name: 'Caelum Heavy Valet Platter',
    category: 'decor',
    priceUSD: 135,
    weightKg: 3.1,
    dimensions: '34 × 21 × 3.5 cm',
    finishOptions: ['Polished Terrazzo Inlay', 'Charcoal Basalt', 'Raw Grey'],
    image: '/src/assets/images/product_monolith_tray_1790949086812.jpg',
    description: 'Hand-ground architectural concrete catchall with genuine brushed brass divider inlays and hand-waxed natural bees-seal patina.',
    architecturalNote: 'Bottom surface lined with 2mm laser-cut Italian saddle suede to protect delicate marble and fine wooden credenza surfaces.',
    leadTimeDays: 3,
    inStock: true,
    featured: true
  },
  {
    id: 'prz-basin-04',
    name: 'Kratos Monolithic Pedestal Plinth',
    category: 'furniture',
    priceUSD: 680,
    weightKg: 28.5,
    dimensions: '90 × 30 × 30 cm',
    finishOptions: ['Raw Brutalist Grey', 'Charcoal Basalt', 'Alabaster Chalk'],
    image: '/src/assets/images/hero_concrete_art_1790949052419.jpg',
    description: 'Structural architectural sculpture stand designed to bear up to 200 kg. Cast with internal rebar grid reinforcement and tapered chamfer bevels.',
    architecturalNote: 'Shipped via specialized heavy architectural crate. Requires two persons for placement. Guaranteed against surface micro-fracturing.',
    leadTimeDays: 7,
    inStock: true,
    featured: true
  },
  {
    id: 'prz-decor-05',
    name: 'Solace Geometric Bookends (Pair)',
    category: 'decor',
    priceUSD: 160,
    weightKg: 5.4,
    dimensions: '18 × 12 × 10 cm each',
    finishOptions: ['Raw Brutalist Grey', 'Terracotta Clay Blend'],
    image: '/src/assets/images/community_client_loft_1790949097239.jpg',
    description: 'A pair of weighted asymmetric cantilever wedges cast from ultra-dense quartz-aggregate concrete to anchor substantial art monographs.',
    architecturalNote: 'Each block weighs 2.7 kg with recessed rubber stabilization pads preventing slippage on polished glass or lacquered shelves.',
    leadTimeDays: 3,
    inStock: true,
    featured: false
  }
];

export const REWARD_COUPONS: Coupon[] = [
  {
    code: 'PRYZM-10PCT',
    label: '10% Off Entire Bespoke Cart',
    pointsCost: 400,
    discountType: 'percentage',
    discountValue: 10,
    minSpendUSD: 100,
    description: 'Grants an immediate 10% reduction across all catalogue items and custom casting orders.'
  },
  {
    code: 'FREE-CRATING-FREIGHT',
    label: 'Complimentary Heavy Freight Crating',
    pointsCost: 650,
    discountType: 'free_shipping',
    discountValue: 100, // 100% off shipping fee
    minSpendUSD: 200,
    description: 'Waives all heavy freight weight charges and custom wooden pallet crate fees.'
  },
  {
    code: 'ARCHITECT-75OFF',
    label: '$75 Concrete Guild Credit',
    pointsCost: 900,
    discountType: 'fixed',
    discountValue: 75,
    minSpendUSD: 250,
    description: 'Direct cash deduction on substantial architectural statement pieces and furniture plinths.'
  },
  {
    code: 'PRYZM-VIP-20PCT',
    label: '20% Master Collector Privilege',
    pointsCost: 1500,
    discountType: 'percentage',
    discountValue: 20,
    minSpendUSD: 350,
    description: 'Exclusive tier discount reserved for verified patrons of PRYZM architectural studio.'
  }
];

export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post-1',
    author: 'Julian Vane (Vane Studio Architekten)',
    location: 'Berlin, DE · Mitte Penthouse',
    title: 'Morning light striking the fluted concrete amphora',
    productReferenced: 'Vessel No. IV / Fluted Amphora',
    image: '/src/assets/images/product_fluted_vessel_1790949065067.jpg',
    likes: 84,
    date: '2026-09-18',
    approved: true,
    featured: true
  },
  {
    id: 'post-2',
    author: 'Elena Rostova',
    location: 'Zurich, CH · Lake Residence',
    title: 'Monolithic Kratos pedestal anchoring the reading salon',
    productReferenced: 'Kratos Monolithic Pedestal Plinth',
    image: '/src/assets/images/community_client_loft_1790949097239.jpg',
    likes: 126,
    date: '2026-09-24',
    approved: true,
    featured: true
  },
  {
    id: 'post-3',
    author: 'Kareem & Sara Al-Mansoor',
    location: 'Dubai, UAE · Al Barari Villa',
    title: 'Aethel lamp warm glow against raw lime wash walls',
    productReferenced: 'Aethel Brutalist Table Monolith',
    image: '/src/assets/images/product_brutalist_lamp_1790949076221.jpg',
    likes: 95,
    date: '2026-09-29',
    approved: true,
    featured: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'PRZ-9041',
    date: '2026-10-01',
    customer: {
      fullName: 'Marcus Sterling',
      email: 'm.sterling@architects-group.com',
      phone: '+1 (415) 890-4421',
      countryCode: 'US',
      city: 'San Francisco, CA',
      streetAddress: '450 Mission Street',
      buildingOrVilla: 'Tower Suite 28B',
      floorApartment: 'Floor 28, Apt 2802',
      courierDeliveryNotes: 'Freight elevator access through loading dock on Minna St. Cash payment ready at reception.',
      coordinates: { lat: 37.7909, lng: -122.3995 }
    },
    items: [
      {
        id: 'cart-101',
        productId: 'prz-light-02',
        productName: 'Aethel Brutalist Table Monolith',
        category: 'lighting',
        unitPriceUSD: 340,
        quantity: 1,
        weightKg: 7.2,
        selectedFinish: 'Raw Brutalist Grey',
        image: '/src/assets/images/product_brutalist_lamp_1790949076221.jpg'
      },
      {
        id: 'cart-102',
        productId: 'prz-tray-03',
        productName: 'Caelum Heavy Valet Platter',
        category: 'decor',
        unitPriceUSD: 135,
        quantity: 1,
        weightKg: 3.1,
        selectedFinish: 'Polished Terrazzo Inlay',
        image: '/src/assets/images/product_monolith_tray_1790949086812.jpg'
      }
    ],
    subtotal: 475,
    weightTotalKg: 10.3,
    shippingFee: 47.66,
    cratingProtectionFee: 15,
    discountAmount: 0,
    totalAmount: 537.66,
    currency: 'USD',
    paymentMethod: 'CASH_ON_DELIVERY',
    status: 'freight_dispatched',
    trackingNumber: 'PRZ-FRT-98441-US',
    estimatedDeliveryDate: '2026-10-04',
    adminNotes: 'Customer requested arrival notification 30 minutes prior to delivery.'
  },
  {
    id: 'PRZ-9038',
    date: '2026-09-29',
    customer: {
      fullName: 'Tariq Al-Sabah',
      email: 'tariq.alsabah@investments.ae',
      phone: '+971 50 491 8820',
      countryCode: 'AE',
      city: 'Dubai',
      streetAddress: 'Jumeirah Bay Island',
      buildingOrVilla: 'Villa 14, Palm Avenue',
      floorApartment: 'Private Residence Ground Floor',
      courierDeliveryNotes: 'Security clearance registered at main gate under PRYZM Couriers.',
      coordinates: { lat: 25.2155, lng: 55.2440 }
    },
    items: [
      {
        id: 'cart-201',
        productId: 'prz-basin-04',
        productName: 'Kratos Monolithic Pedestal Plinth',
        category: 'furniture',
        unitPriceUSD: 680,
        quantity: 1,
        weightKg: 28.5,
        selectedFinish: 'Charcoal Basalt',
        image: '/src/assets/images/hero_concrete_art_1790949052419.jpg'
      }
    ],
    subtotal: 680,
    weightTotalKg: 28.5,
    shippingFee: 71.30,
    cratingProtectionFee: 25,
    discountAmount: 68,
    discountCode: 'PRYZM-10PCT',
    totalAmount: 708.30,
    currency: 'USD',
    paymentMethod: 'CASH_ON_DELIVERY',
    status: 'out_for_delivery',
    trackingNumber: 'PRZ-FRT-11029-AE',
    estimatedDeliveryDate: '2026-10-02',
    adminNotes: 'Specialized 2-man freight handling crew dispatched with heavy hydraulic trolley.'
  },
  {
    id: 'PRZ-9025',
    date: '2026-09-22',
    customer: {
      fullName: 'Helena Lindqvist',
      email: 'helena.lindqvist@scandic-interiors.se',
      phone: '+46 8 123 4567',
      countryCode: 'SE',
      city: 'Stockholm',
      streetAddress: 'Strandvägen 48',
      buildingOrVilla: 'Palatset Residence',
      floorApartment: '4th Floor, Suite 402',
      courierDeliveryNotes: 'Specialized freight delivered. Signed and settled in cash.',
      coordinates: { lat: 59.3326, lng: 18.0649 }
    },
    items: [
      {
        id: 'cart-301',
        productId: 'prz-vessel-01',
        productName: 'Vessel No. IV / Fluted Amphora',
        category: 'vessels',
        unitPriceUSD: 195,
        quantity: 2,
        weightKg: 4.8,
        selectedFinish: 'Raw Brutalist Grey',
        image: '/src/assets/images/product_fluted_vessel_1790949065067.jpg'
      }
    ],
    subtotal: 390,
    weightTotalKg: 9.6,
    shippingFee: 54.00,
    cratingProtectionFee: 12,
    discountAmount: 0,
    totalAmount: 456.00,
    currency: 'SEK',
    paymentMethod: 'CASH_ON_DELIVERY',
    status: 'delivered_and_paid',
    trackingNumber: 'PRZ-FRT-88201-SE',
    estimatedDeliveryDate: '2026-09-25',
    adminNotes: 'Consignment successfully delivered. COD payment verified and signed.'
  }
];

export const INITIAL_CALLBACKS: CallbackRequest[] = [
  {
    id: 'cb-1',
    fullName: 'Sir Arthur Wellesley',
    phone: '+44 20 7946 0912',
    preferredTime: 'Today 2:00 PM – 4:00 PM GMT',
    topic: 'Custom 90cm fluted concrete plinth for private gallery',
    requestedAt: '2026-10-02 09:15 AM',
    status: 'pending'
  },
  {
    id: 'cb-2',
    fullName: 'Fatima Al-Qasimi',
    phone: '+971 50 882 1904',
    preferredTime: 'Tomorrow 10:00 AM GST',
    topic: 'Inquiring about multi-piece freight crating for Dubai penthouse',
    requestedAt: '2026-10-01 04:30 PM',
    status: 'completed'
  }
];

export const INITIAL_VIP_LEADERBOARD: VIPLeaderboardUser[] = [
  {
    id: 'vip-1',
    name: 'Helena Lindqvist',
    email: 'helena.lindqvist@scandic-interiors.se',
    phone: '+46 8 123 4567',
    country: 'Sweden (Stockholm)',
    totalPoints: 4560,
    lifetimeSpentUSD: 3840,
    tier: 'Grand Master Patron',
    memberSince: 'Jan 2026'
  },
  {
    id: 'vip-2',
    name: 'Tariq Al-Sabah',
    email: 'tariq.alsabah@investments.ae',
    phone: '+971 50 491 8820',
    country: 'United Arab Emirates (Dubai)',
    totalPoints: 3750,
    lifetimeSpentUSD: 2950,
    tier: 'Master Patron',
    memberSince: 'Mar 2026'
  },
  {
    id: 'vip-3',
    name: 'Marcus Sterling',
    email: 'm.sterling@architects-group.com',
    phone: '+1 (415) 890-4421',
    country: 'United States (San Francisco)',
    totalPoints: 2890,
    lifetimeSpentUSD: 2180,
    tier: 'Architect Guild Fellow',
    memberSince: 'Feb 2026'
  },
  {
    id: 'vip-4',
    name: 'Julian Vane',
    email: 'julian.vane@vane-architekten.de',
    phone: '+49 30 901820',
    country: 'Germany (Berlin)',
    totalPoints: 2150,
    lifetimeSpentUSD: 1720,
    tier: 'Architect Guild Fellow',
    memberSince: 'May 2026'
  },
  {
    id: 'vip-5',
    name: 'Kenji Takahashi',
    email: 'k.takahashi@omotesando-atelier.jp',
    phone: '+81 3 5555 0149',
    country: 'Japan (Tokyo)',
    totalPoints: 1840,
    lifetimeSpentUSD: 1450,
    tier: 'Studio Collector',
    memberSince: 'Jun 2026'
  }
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'concierge',
    text: 'Welcome to PRYZM Concrete Home Art. I am Lucas, Chief Casting Director at our studio. How may I assist your space or custom dimensions today?',
    timestamp: '10:00 AM'
  },
  {
    id: 'msg-2',
    sender: 'client',
    text: 'Hello! I am considering the Aethel Table Monolith for my reading desk. Does the dimming dial support warm 2200K amber bulbs?',
    timestamp: '10:02 AM'
  },
  {
    id: 'msg-3',
    sender: 'concierge',
    text: 'Yes indeed! The solid brass rotary switch uses a trailing-edge TRIAC dimmer circuit engineered specifically for smooth 0-100% flicker-free dimming down to deep candlelight warmth.',
    timestamp: '10:03 AM'
  }
];
