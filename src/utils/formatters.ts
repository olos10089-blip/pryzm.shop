import { CountryInfo } from '../types';

export function formatPrice(amountUSD: number, country: CountryInfo): string {
  const converted = amountUSD * country.exchangeRate;
  if (country.currency === 'JPY') {
    return `${country.symbol}${Math.round(converted).toLocaleString()}`;
  }
  return `${country.symbol}${converted.toFixed(2)}`;
}

export function calculateShipping(
  totalWeightKg: number,
  country: CountryInfo,
  subtotalUSD: number,
  isFreeShippingCouponApplied: boolean = false
): {
  shippingFeeUSD: number;
  cratingFeeUSD: number;
  totalFreightUSD: number;
  isEligibleForFreeShipping: boolean;
  needsHeavyCrating: boolean;
} {
  // Heavy crating is required if any single order weighs over 15kg or total order > 20kg
  const needsHeavyCrating = totalWeightKg > 15;
  const cratingFeeUSD = needsHeavyCrating ? 25 : (totalWeightKg > 5 ? 12 : 0);

  // If subtotal >= 450 USD and weight <= country.freeShippingWeightLimitKg
  const isEligibleForFreeShipping = subtotalUSD >= 450 && totalWeightKg <= country.freeShippingWeightLimitKg;

  let shippingFeeUSD = 0;
  if (!isEligibleForFreeShipping && !isFreeShippingCouponApplied) {
    shippingFeeUSD = country.shippingBaseRateUSD + (totalWeightKg * country.shippingPerKgUSD);
  }

  const totalFreightUSD = isFreeShippingCouponApplied ? 0 : (shippingFeeUSD + cratingFeeUSD);

  return {
    shippingFeeUSD: isFreeShippingCouponApplied ? 0 : Number(shippingFeeUSD.toFixed(2)),
    cratingFeeUSD: isFreeShippingCouponApplied ? 0 : cratingFeeUSD,
    totalFreightUSD: Number(totalFreightUSD.toFixed(2)),
    isEligibleForFreeShipping,
    needsHeavyCrating
  };
}

export const TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    tagline: 'Handmade Architectural Concrete Decor',
    brandQuote: 'Monolithic raw forms grounded in brutalist serenity and timeless tactile weight.',
    exploreCatalog: 'Explore Collection',
    bespokeStudio: 'Custom Configurator',
    spatialAR: 'View in Your Room (AR)',
    vipClub: 'PRYZM VIP Guild',
    community: 'Patron Gallery',
    codBadge: 'Strict Cash on Delivery (COD) Exclusivity',
    codExplainer: 'Inspect your cast piece at your doorstep before settling payment with our white-glove freight courier.',
    addToCart: 'Add to Cart',
    customOrder: 'Craft Bespoke Order',
    weight: 'Gross Weight',
    dimensions: 'Dimensions',
    inStock: 'In Stock · Ready to Crate',
    leadTime: 'Hand-Casting Lead Time',
    cart: 'Shopping Bag',
    checkout: 'Complete COD Reservation',
    freeFreightNotice: 'Complimentary freight unlocked for orders over $450 under weight limit',
    adminLogin: 'Studio Admin Console',
    chatWithUs: 'Architect Concierge',
    tracking: 'Track Architectural Consignment'
  },
  de: {
    tagline: 'Handgefertigte Architektonische Beton-Unikate',
    brandQuote: 'Monolithische Rohformen gegründet in brutalistischer Gelassenheit und taktiler Schwere.',
    exploreCatalog: 'Kollektion Entdecken',
    bespokeStudio: 'Maßanfertigung Studio',
    spatialAR: 'Im Raum Ansehen (AR)',
    vipClub: 'PRYZM VIP Gilde',
    community: 'Kunden-Galerie',
    codBadge: 'Ausschließliche Zahlung per Nachnahme (COD)',
    codExplainer: 'Überprüfen Sie Ihr gegossenes Kunstwerk an der Haustür, bevor Sie die Zahlung bar an die Spezialspedition übergeben.',
    addToCart: 'In den Warenkorb',
    customOrder: 'Individuelle Anfertigung',
    weight: 'Rohgewicht',
    dimensions: 'Abmessungen',
    inStock: 'Auf Lager · Versandbereit',
    leadTime: 'Guss- & Härtungsdauer',
    cart: 'Warenkorb',
    checkout: 'Nachnahme-Bestellung Aufgeben',
    freeFreightNotice: 'Kostenlose Spedition freigeschaltet ab 450 € innerhalb der Gewichtsgrenze',
    adminLogin: 'Studio Admin-Bereich',
    chatWithUs: 'Atelier Concierge',
    tracking: 'Sendung Verfolgen'
  },
  fr: {
    tagline: 'Décor Architectural en Béton Fait Main',
    brandQuote: 'Formes brutes monolithiques ancrées dans la sérénité brutaliste et le poids tactile intemporel.',
    exploreCatalog: 'Explorer la Collection',
    bespokeStudio: 'Studio Sur Mesure',
    spatialAR: 'Voir Dans Votre Pièce (AR)',
    vipClub: 'Guilde VIP PRYZM',
    community: 'Galerie des Clients',
    codBadge: 'Exclusivité Paiement à la Livraison (COD)',
    codExplainer: 'Inspectez votre œuvre coulée sur le pas de votre porte avant de régler en espèces auprès de notre coursier.',
    addToCart: 'Ajouter au Panier',
    customOrder: 'Créer Sur Mesure',
    weight: 'Poids Brut',
    dimensions: 'Dimensions',
    inStock: 'En Stock · Prêt pour Caisse',
    leadTime: 'Délai de Coulage Artisanal',
    cart: 'Panier d’Achat',
    checkout: 'Finaliser la Commande COD',
    freeFreightNotice: 'Fret offert pour les commandes de plus de 450 € sous la limite de poids',
    adminLogin: 'Console d’Administration',
    chatWithUs: 'Concierge Atelier',
    tracking: 'Suivi de Livraison'
  },
  ar: {
    tagline: 'قطع فنية ديكورية معمارية خرسانية مصنوعة يدوياً',
    brandQuote: 'أشكال متجانسة خام مستوحاة من العمارة التجريدية والوزن الملموس الفاخر.',
    exploreCatalog: 'استكشاف التشكيلة',
    bespokeStudio: 'مختبر التصميم المخصص',
    spatialAR: 'المعاينة في غرفتك (AR)',
    vipClub: 'نادي كبار الشخصيات PRYZM',
    community: 'معرض العملاء',
    codBadge: 'الدفع نقداً عند الاستلام حصرياً (COD)',
    codExplainer: 'عاين قطعتك المعمارية عند باب منزلك قبل تسليم المبلغ نقداً لمندوب الشحن المتخصص.',
    addToCart: 'إضافة إلى الحقيبة',
    customOrder: 'طلب قطعة مصممة خصيصاً',
    weight: 'الوزن الإجمالي',
    dimensions: 'الأبعاد',
    inStock: 'متوفر · جاهز للتعبئة في صناديق خشبية',
    leadTime: 'مدة الصب والتصليد اليدوي',
    cart: 'حقيبة التسوق',
    checkout: 'تأكيد الحجز والدفع عند الاستلام',
    freeFreightNotice: 'شحن مجاني للطلبات فوق 450 دولار ضمن حدود الوزن المسموح',
    adminLogin: 'بوابة إدارة الاستوديو',
    chatWithUs: 'مستشار الاستوديو المباشر',
    tracking: 'تتبع الشحنة المعمارية'
  },
  ja: {
    tagline: '手作業による建築的コンクリート・ホームアート',
    brandQuote: 'ブルータリズムの静寂と時代を超越した重厚感を纏うモノリス・フォルム。',
    exploreCatalog: 'コレクションを見る',
    bespokeStudio: 'カスタムオーダー設定',
    spatialAR: '空間ARプレビュー',
    vipClub: 'PRYZM VIPギルド',
    community: 'パトロン・ギャラリー',
    codBadge: '代金引換（着払い）限定システム',
    codExplainer: '専門の美術品運送員からお荷物を受け取る際、現物をご確認の上で現金にてお支払いいただけます。',
    addToCart: 'バッグに追加',
    customOrder: 'カスタム作品を注文',
    weight: '総重量',
    dimensions: '外形寸法',
    inStock: '在庫あり · 木箱梱包準備完了',
    leadTime: '手作業注型・養生期間',
    cart: 'ショッピングバッグ',
    checkout: '着払い予約を確定する',
    freeFreightNotice: '重量制限内の450ドル以上のご注文で配送料無料',
    adminLogin: 'スタジオ管理コンソール',
    chatWithUs: '建築コンシェルジュ',
    tracking: '作品追跡'
  }
};
