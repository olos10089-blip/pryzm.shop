import React, { useState } from 'react';
import { CartItem, CountryInfo, CustomerDetails, Order, Coupon } from '../types';
import { calculateShipping, formatPrice } from '../utils/formatters';
import { InteractiveAddressMap } from './InteractiveAddressMap';
import { COUNTRIES, REWARD_COUPONS } from '../data/mockData';
import { 
  X, Trash2, ShoppingBag, ShieldCheck, Truck, Scale, MapPin, 
  ArrowRight, CheckCircle, Tag, AlertTriangle, Phone, Mail, User, Info
} from 'lucide-react';

interface SmartCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  selectedCountry: CountryInfo;
  onSelectCountry: (country: CountryInfo) => void;
  activeCoupon: Coupon | null;
  onApplyCouponCode: (code: string) => boolean;
  onRemoveCoupon: () => void;
  onOpenVIPStore: () => void;
  onOrderCreated: (order: Order) => void;
  onOpenOrderTracker: (orderId: string) => void;
}

export const SmartCartDrawer: React.FC<SmartCartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  selectedCountry,
  onSelectCountry,
  activeCoupon,
  onApplyCouponCode,
  onRemoveCoupon,
  onOpenVIPStore,
  onOrderCreated,
  onOpenOrderTracker
}) => {
  const [step, setStep] = useState<'cart' | 'checkout' | 'confirmation'>('cart');
  const [couponInput, setCouponInput] = useState<string>('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  // Customer Form State
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [streetAddress, setStreetAddress] = useState<string>('');
  const [buildingOrVilla, setBuildingOrVilla] = useState<string>('');
  const [floorApartment, setFloorApartment] = useState<string>('');
  const [courierDeliveryNotes, setCourierDeliveryNotes] = useState<string>('');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number }>(selectedCountry.defaultCenter);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // When country changes, update default coordinates
  const handleCountryChange = (c: CountryInfo) => {
    onSelectCountry(c);
    setCoordinates(c.defaultCenter);
  };

  // Calculations
  const subtotalUSD = cartItems.reduce((sum, item) => sum + (item.unitPriceUSD * item.quantity), 0);
  const totalWeightKg = Number(cartItems.reduce((sum, item) => sum + (item.weightKg * item.quantity), 0).toFixed(1));

  const isFreeShippingApplied = activeCoupon?.discountType === 'free_shipping';
  const shippingCalculation = calculateShipping(
    totalWeightKg, 
    selectedCountry, 
    subtotalUSD,
    isFreeShippingApplied
  );

  // Discount calculation
  let discountUSD = 0;
  if (activeCoupon) {
    if (activeCoupon.discountType === 'percentage') {
      discountUSD = (subtotalUSD * activeCoupon.discountValue) / 100;
    } else if (activeCoupon.discountType === 'fixed') {
      discountUSD = Math.min(subtotalUSD, activeCoupon.discountValue);
    }
  }

  const grandTotalUSD = Math.max(0, subtotalUSD + shippingCalculation.totalFreightUSD - discountUSD);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponError(null);
    const success = onApplyCouponCode(couponInput.trim().toUpperCase());
    if (success) {
      setCouponInput('');
    } else {
      setCouponError('Invalid voucher or minimum spend requirement not satisfied.');
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) errors.fullName = 'Full Name is required';
    if (!email.trim() || !email.includes('@')) errors.email = 'Valid contact email is required';
    if (!phone.trim() || phone.length < 7) errors.phone = 'Valid phone number required for courier arrival verification';
    if (!streetAddress.trim()) errors.streetAddress = 'Street name & number required';
    if (!buildingOrVilla.trim()) errors.buildingOrVilla = 'Building or Villa name required';
    if (!floorApartment.trim()) errors.floorApartment = 'Floor & Apt # required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceCODOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const customer: CustomerDetails = {
      fullName,
      email,
      phone,
      countryCode: selectedCountry.code,
      city: city || selectedCountry.name,
      streetAddress,
      buildingOrVilla,
      floorApartment,
      courierDeliveryNotes,
      coordinates
    };

    const newOrder: Order = {
      id: `PRZ-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      customer,
      items: [...cartItems],
      subtotal: subtotalUSD,
      weightTotalKg: totalWeightKg,
      shippingFee: shippingCalculation.shippingFeeUSD,
      cratingProtectionFee: shippingCalculation.cratingFeeUSD,
      discountAmount: discountUSD,
      discountCode: activeCoupon?.code,
      totalAmount: grandTotalUSD,
      currency: selectedCountry.currency,
      paymentMethod: 'CASH_ON_DELIVERY',
      status: 'pending_verification',
      trackingNumber: `PRZ-FRT-${Math.floor(10000 + Math.random() * 90000)}-${selectedCountry.code}`,
      estimatedDeliveryDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      adminNotes: 'New reservation received via COD portal. Requires courier dispatch call.'
    };

    setLastPlacedOrder(newOrder);
    onOrderCreated(newOrder);
    setStep('confirmation');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-sm flex justify-end">
      <div className="relative w-full max-w-xl h-full bg-[#131418] border-l border-neutral-800 shadow-2xl flex flex-col">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-neutral-800 bg-[#16171b] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#c5a880]" />
            <h2 className="font-serif-brand text-lg font-semibold text-white tracking-wide">
              {step === 'cart' && 'ARCHITECTURAL BAG'}
              {step === 'checkout' && 'CASH ON DELIVERY RESERVATION'}
              {step === 'confirmation' && 'ORDER REGISTERED'}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {step === 'checkout' && (
              <button
                type="button"
                onClick={() => setStep('cart')}
                className="text-xs text-neutral-400 hover:text-white"
              >
                ← Back to Bag
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STEP 1: CART VIEW */}
        {step === 'cart' && (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {cartItems.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <ShoppingBag className="w-12 h-12 text-neutral-600 mx-auto stroke-[1.2]" />
                <div className="text-neutral-400 text-sm">Your architectural bag is currently empty.</div>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs text-white rounded font-medium"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              <>
                {/* Items List */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs text-neutral-400 pb-1 border-b border-neutral-800">
                    <span>SELECTED CASTINGS ({cartItems.length})</span>
                    <span className="font-mono-spec">TOTAL WEIGHT: {totalWeightKg} KG</span>
                  </div>

                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-[#18191e] border border-neutral-800/80 rounded-lg flex gap-3.5 items-center"
                    >
                      <img
                        src={item.image}
                        alt={item.productName}
                        referrerPolicy="no-referrer"
                        className="w-16 h-16 object-cover rounded bg-neutral-900 border border-neutral-800 flex-shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-white truncate">{item.productName}</h4>
                        {item.selectedFinish && (
                          <div className="text-[11px] text-[#c5a880]">{item.selectedFinish}</div>
                        )}
                        {item.bespokeConfig?.customEngraving && (
                          <div className="text-[10px] text-neutral-400 font-mono-spec truncate">
                            Engraved: "{item.bespokeConfig.customEngraving}"
                          </div>
                        )}
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-400">
                          <span className="font-mono-spec text-white">
                            {formatPrice(item.unitPriceUSD, selectedCountry)}
                          </span>
                          <span className="text-[10px] font-mono-spec text-neutral-500">
                            {item.weightKg} kg each
                          </span>
                        </div>
                      </div>

                      {/* Quantity & Delete */}
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="flex items-center border border-neutral-700 rounded bg-[#121316]">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="px-2 py-0.5 text-xs text-neutral-400 hover:text-white"
                          >
                            -
                          </button>
                          <span className="px-2 text-xs font-mono-spec text-white">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs text-neutral-400 hover:text-white"
                          >
                            +
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-neutral-500 hover:text-rose-400 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Country Destination Selector & Weight Tariff */}
                <div className="bg-[#17181d] border border-neutral-800 p-4 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-semibold text-neutral-300">
                      Destination Country & Currency
                    </span>
                    <span className="text-xs font-mono-spec text-[#c5a880]">{selectedCountry.currency}</span>
                  </div>

                  <select
                    value={selectedCountry.code}
                    onChange={(e) => {
                      const c = COUNTRIES.find((x) => x.code === e.target.value);
                      if (c) handleCountryChange(c);
                    }}
                    className="w-full bg-[#121316] border border-neutral-700 focus:border-[#c5a880] rounded px-3 py-2 text-xs text-white outline-none"
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.name} · {c.languageName} — {c.currency} ({c.symbol})
                      </option>
                    ))}
                  </select>

                  {/* Smart Freight & Weight Calculator Breakdown */}
                  <div className="pt-2 border-t border-neutral-800 space-y-1.5 text-xs">
                    <div className="flex justify-between text-neutral-400">
                      <span className="flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-[#c5a880]" />
                        Total Physical Mass:
                      </span>
                      <span className="font-mono-spec text-white">{totalWeightKg} kg</span>
                    </div>

                    <div className="flex justify-between text-neutral-400">
                      <span>Freight & Transit Handling:</span>
                      <span className="font-mono-spec text-white">
                        {shippingCalculation.shippingFeeUSD === 0 
                          ? 'FREE' 
                          : formatPrice(shippingCalculation.shippingFeeUSD, selectedCountry)}
                      </span>
                    </div>

                    {shippingCalculation.needsHeavyCrating && (
                      <div className="flex justify-between text-amber-400/90 text-[11px]">
                        <span>Reinforced ISPM-15 Wood Crating:</span>
                        <span className="font-mono-spec">
                          {formatPrice(shippingCalculation.cratingFeeUSD, selectedCountry)}
                        </span>
                      </div>
                    )}

                    {shippingCalculation.isEligibleForFreeShipping && (
                      <div className="text-[11px] text-emerald-400 bg-emerald-950/30 p-1.5 rounded flex items-center gap-1.5">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>Order qualifies for complimentary global freight crating!</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* VIP Club Voucher Redemption Box */}
                <div className="bg-[#17181d] border border-neutral-800 p-4 rounded-lg space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider font-semibold text-neutral-300 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#c5a880]" />
                      Patron Discount Code
                    </span>
                    <button
                      type="button"
                      onClick={onOpenVIPStore}
                      className="text-[11px] text-[#c5a880] hover:underline font-mono-spec"
                    >
                      Redeem VIP Points →
                    </button>
                  </div>

                  {activeCoupon ? (
                    <div className="p-2.5 bg-emerald-950/30 border border-emerald-800/40 rounded flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold text-emerald-300 font-mono-spec">{activeCoupon.code}</div>
                        <div className="text-[10px] text-neutral-400">{activeCoupon.label}</div>
                      </div>
                      <button
                        type="button"
                        onClick={onRemoveCoupon}
                        className="text-xs text-neutral-400 hover:text-white"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        placeholder="e.g. PRYZM-10PCT"
                        className="flex-1 bg-[#121316] border border-neutral-700 focus:border-[#c5a880] rounded px-3 py-1.5 text-xs text-white uppercase placeholder-neutral-500 outline-none font-mono-spec"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 bg-[#252830] hover:bg-[#2f333e] text-xs font-medium text-white rounded border border-neutral-700"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {couponError && (
                    <div className="text-[11px] text-rose-400">{couponError}</div>
                  )}
                </div>

                {/* Strict COD Model Transparency Card */}
                <div className="bg-[#1b1c22] border border-neutral-800 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#c5a880]">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                    <span>Strict Cash on Delivery (COD) Exclusivity Model</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    At PRYZM, we never accept online card payments upfront. Because each architectural concrete piece is a heavy handmade original, our specialized freight team delivers directly to your door. You inspect the piece in person, verify its structural integrity, and hand physical cash in <strong className="text-neutral-200">{selectedCountry.currency}</strong> to the courier.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* STEP 2: CHECKOUT WITH MAP & ADDRESS */}
        {step === 'checkout' && (
          <form onSubmit={handlePlaceCODOrder} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* Contact Information (Required Phone & Email) */}
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-300 block">
                1. Customer & Courier Verification
              </span>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                  Full Name / Client Representative *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Sebastian Meyer"
                    className="w-full bg-[#18191d] border border-neutral-700 focus:border-[#c5a880] rounded pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 outline-none"
                  />
                </div>
                {formErrors.fullName && <p className="text-[10px] text-rose-400 mt-0.5">{formErrors.fullName}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                    Email Address (Order Specs & Tracking) *
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="client@atelier.com"
                      className="w-full bg-[#18191d] border border-neutral-700 focus:border-[#c5a880] rounded pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 outline-none"
                    />
                  </div>
                  {formErrors.email && <p className="text-[10px] text-rose-400 mt-0.5">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
                    Phone Number (Courier Arrival Call) *
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-2.5 text-neutral-500" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (555) 019-2834"
                      className="w-full bg-[#18191d] border border-neutral-700 focus:border-[#c5a880] rounded pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 outline-none"
                    />
                  </div>
                  {formErrors.phone && <p className="text-[10px] text-rose-400 mt-0.5">{formErrors.phone}</p>}
                </div>
              </div>
            </div>

            {/* Interactive Map & Geolocation */}
            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-300 block">
                2. Precise Delivery Entrance & Address Pin
              </span>

              <InteractiveAddressMap
                coordinates={coordinates}
                onChangeCoordinates={setCoordinates}
                streetAddress={streetAddress}
                onAddressChange={(field, val) => {
                  if (field === 'streetAddress') setStreetAddress(val);
                  if (field === 'buildingOrVilla') setBuildingOrVilla(val);
                  if (field === 'floorApartment') setFloorApartment(val);
                  if (field === 'courierDeliveryNotes') setCourierDeliveryNotes(val);
                }}
                buildingOrVilla={buildingOrVilla}
                floorApartment={floorApartment}
                courierDeliveryNotes={courierDeliveryNotes}
              />
              {formErrors.streetAddress && <p className="text-[10px] text-rose-400">{formErrors.streetAddress}</p>}
            </div>

            {/* Final Cash on Delivery Consent Check */}
            <div className="p-3 bg-[#191a20] border border-neutral-800 rounded-lg space-y-2">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  required
                  id="cod-terms"
                  defaultChecked
                  className="mt-0.5 accent-[#c5a880]"
                />
                <label htmlFor="cod-terms" className="text-xs text-neutral-300 leading-snug">
                  I understand that this is a <strong>Cash on Delivery (COD) reservation</strong>. I will settle the exact sum of <strong>{formatPrice(grandTotalUSD, selectedCountry)}</strong> directly with the freight courier upon doorstep inspection.
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#c5a880] hover:bg-[#b89a70] text-black font-semibold text-xs uppercase tracking-wider rounded transition-colors shadow-lg"
            >
              Confirm Cash on Delivery Reservation
            </button>
          </form>
        )}

        {/* STEP 3: CONFIRMATION RECEIPT */}
        {step === 'confirmation' && lastPlacedOrder && (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-widest text-[#c5a880] font-mono-spec">
                CONSIGNMENT RESERVED · CASH ON DELIVERY
              </div>
              <h3 className="font-serif-brand text-2xl font-bold text-white">
                Order #{lastPlacedOrder.id} Confirmed
              </h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto">
                Our master caster has queued your order for hydration curing. The freight courier will call <strong>{lastPlacedOrder.customer.phone}</strong> prior to arrival.
              </p>
            </div>

            {/* Tracking Reference & COD amount */}
            <div className="bg-[#17181d] border border-neutral-800 p-4 rounded-lg text-left space-y-3 font-mono-spec text-xs">
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Tracking Code:</span>
                <span className="text-[#c5a880] font-bold">{lastPlacedOrder.trackingNumber}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Estimated Delivery:</span>
                <span className="text-white">{lastPlacedOrder.estimatedDeliveryDate}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-2">
                <span className="text-neutral-400">Total Due at Doorstep (COD):</span>
                <span className="text-lg text-emerald-400 font-bold">
                  {formatPrice(lastPlacedOrder.totalAmount, selectedCountry)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Delivery Gate Pin:</span>
                <span className="text-neutral-300">
                  {lastPlacedOrder.customer.coordinates.lat.toFixed(4)}°N, {lastPlacedOrder.customer.coordinates.lng.toFixed(4)}°E
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenOrderTracker(lastPlacedOrder.id);
                }}
                className="w-full py-2.5 bg-[#c5a880] hover:bg-[#b89a70] text-black text-xs font-semibold uppercase tracking-wider rounded transition-colors"
              >
                Track Architectural Consignment
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs rounded transition-colors"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}

        {/* Bottom Cart Summary Bar (When on step 1) */}
        {step === 'cart' && cartItems.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-neutral-800 bg-[#16171b] space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Subtotal:</span>
                <span className="font-mono-spec text-white">{formatPrice(subtotalUSD, selectedCountry)}</span>
              </div>

              {discountUSD > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>VIP Discount Applied:</span>
                  <span className="font-mono-spec">-{formatPrice(discountUSD, selectedCountry)}</span>
                </div>
              )}

              <div className="flex justify-between text-neutral-400">
                <span>Freight & Protection:</span>
                <span className="font-mono-spec text-white">
                  {shippingCalculation.totalFreightUSD === 0
                    ? 'COMPLIMENTARY'
                    : formatPrice(shippingCalculation.totalFreightUSD, selectedCountry)}
                </span>
              </div>

              <div className="flex justify-between text-sm font-semibold text-white pt-2 border-t border-neutral-800">
                <span>Cash on Delivery Total:</span>
                <span className="font-mono-spec text-base text-[#c5a880]">
                  {formatPrice(grandTotalUSD, selectedCountry)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep('checkout')}
              className="w-full py-3 bg-[#c5a880] hover:bg-[#b89a70] text-black font-semibold text-xs uppercase tracking-wider rounded transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>Proceed to Cash on Delivery</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
