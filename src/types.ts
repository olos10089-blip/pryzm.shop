export interface Product {
  id: string;
  name: string;
  category: 'vessels' | 'lighting' | 'furniture' | 'decor';
  priceUSD: number;
  weightKg: number;
  dimensions: string; // e.g. "32 × 18 × 18 cm"
  finishOptions: string[];
  image: string;
  secondaryImage?: string;
  description: string;
  architecturalNote: string;
  leadTimeDays: number;
  inStock: boolean;
  featured?: boolean;
}

export interface BespokeConfig {
  shape: 'monolith_plinth' | 'fluted_cylinder' | 'arch_niche' | 'hexagonal_prism' | 'pebble_catchall';
  finishColor: 'charcoal_basalt' | 'raw_brutalist_grey' | 'alabaster_chalk' | 'terracotta_blend' | 'obsidian_aggregate';
  texture: 'smooth_microcement' | 'exposed_aggregate' | 'brass_terrazzo' | 'pitted_travertine';
  widthCm: number;
  heightCm: number;
  depthCm: number;
  customEngraving: string;
  engravingFont: 'serif' | 'sans' | 'monospaced';
  calculatedWeightKg: number;
  priceUSD: number;
}

export interface CartItem {
  id: string; // unique item cart id
  productId: string;
  productName: string;
  category: string;
  unitPriceUSD: number;
  quantity: number;
  weightKg: number;
  selectedFinish?: string;
  image: string;
  bespokeConfig?: BespokeConfig;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  countryCode: string;
  city: string;
  streetAddress: string;
  buildingOrVilla: string;
  floorApartment: string;
  courierDeliveryNotes: string;
  coordinates: Coordinates;
}

export type OrderStatus = 
  | 'pending_verification'
  | 'casting_curing'
  | 'freight_dispatched'
  | 'out_for_delivery'
  | 'delivered_and_paid'
  | 'cancelled';

export interface RefundRequest {
  orderId: string;
  date: string;
  reason: string;
  notes: string;
  desiredResolution: 'cash_refund' | 'replacement';
  status: 'pending' | 'approved' | 'refunded' | 'declined';
  adminReply?: string;
}

export interface Order {
  id: string;
  date: string;
  customer: CustomerDetails;
  items: CartItem[];
  subtotal: number;
  weightTotalKg: number;
  shippingFee: number;
  cratingProtectionFee: number;
  discountAmount: number;
  discountCode?: string;
  totalAmount: number;
  currency: string;
  paymentMethod: 'CASH_ON_DELIVERY';
  status: OrderStatus;
  trackingNumber: string;
  estimatedDeliveryDate: string;
  adminNotes?: string;
  refundRequest?: RefundRequest;
}

export interface CallbackRequest {
  id: string;
  fullName: string;
  phone: string;
  preferredTime: string;
  topic: string;
  requestedAt: string;
  status: 'pending' | 'completed';
}

export interface VIPLeaderboardUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  totalPoints: number;
  lifetimeSpentUSD: number;
  tier: string;
  memberSince: string;
}

export interface RegisteredUser {
  email: string;
  phone: string;
  countryCode: string;
  fullName?: string;
  registeredAt: string;
}

export interface Coupon {
  code: string;
  label: string;
  pointsCost: number;
  discountType: 'percentage' | 'fixed' | 'free_shipping';
  discountValue: number; // e.g. 15 for 15% or 50 for $50
  minSpendUSD: number;
  description: string;
}

export interface VIPPointsRecord {
  id: string;
  date: string;
  amount: number;
  type: 'earned' | 'redeemed';
  reason: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  location: string;
  title: string;
  productReferenced: string;
  image: string;
  likes: number;
  date: string;
  approved: boolean;
  featured: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'client' | 'concierge';
  text: string;
  timestamp: string;
  orderReference?: string;
}

export interface CountryInfo {
  code: string;
  name: string;
  currency: string;
  symbol: string;
  exchangeRate: number; // relative to USD
  language: string;
  languageName: string;
  flag: string;
  shippingBaseRateUSD: number;
  shippingPerKgUSD: number;
  freeShippingWeightLimitKg: number;
  defaultCenter: Coordinates;
}
