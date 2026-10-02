/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, CartItem, CountryInfo, Order, Coupon, CommunityPost, ChatMessage, BespokeConfig, OrderStatus, RegisteredUser, CallbackRequest, RefundRequest, VIPLeaderboardUser } from './types';
import { COUNTRIES, PRODUCTS, REWARD_COUPONS, INITIAL_COMMUNITY_POSTS, INITIAL_ORDERS, INITIAL_CHAT, INITIAL_CALLBACKS, INITIAL_VIP_LEADERBOARD } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCatalog } from './components/ProductCatalog';
import { BespokeConfigurator } from './components/BespokeConfigurator';
import { CommunityGallery } from './components/CommunityGallery';
import { SmartCartDrawer } from './components/SmartCartDrawer';
import { ARRoomPreview } from './components/ARRoomPreview';
import { VIPClubModal } from './components/VIPClubModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { AdminDashboard } from './components/AdminDashboard';
import { LiveConciergeChat } from './components/LiveConciergeChat';
import { WorldLocalizationModal } from './components/WorldLocalizationModal';
import { SignUpModal } from './components/SignUpModal';
import { MultiChannelSupportModal } from './components/MultiChannelSupportModal';
import { Footer } from './components/Footer';

export default function App() {
  // Localization & Region
  const [selectedCountry, setSelectedCountry] = useState<CountryInfo>(COUNTRIES[0]);

  // Registered Customer Profile
  const [registeredUser, setRegisteredUser] = useState<RegisteredUser | null>(null);

  // Cart & Orders State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'init-cart-1',
      productId: 'prz-vessel-01',
      productName: 'Vessel No. IV / Fluted Amphora',
      category: 'vessels',
      unitPriceUSD: 195,
      quantity: 1,
      weightKg: 4.8,
      selectedFinish: 'Raw Brutalist Grey',
      image: '/src/assets/images/product_fluted_vessel_1790949065067.jpg'
    }
  ]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);

  // VIP Club Loyalty State
  const [vipPointsBalance, setVipPointsBalance] = useState<number>(1250);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [vipLeaderboard, setVipLeaderboard] = useState<VIPLeaderboardUser[]>(INITIAL_VIP_LEADERBOARD);

  // Community Posts
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);

  // Support & Callbacks
  const [callbacks, setCallbacks] = useState<CallbackRequest[]>(INITIAL_CALLBACKS);

  // Real-Time Live Support Chat Feed
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT);

  // Modals & Navigation Overlays
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isVIPOpen, setIsVIPOpen] = useState<boolean>(false);
  const [isTrackerOpen, setIsTrackerOpen] = useState<boolean>(false);
  const [trackerOrderId, setTrackerOrderId] = useState<string | undefined>(undefined);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isWorldModalOpen, setIsWorldModalOpen] = useState<boolean>(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState<boolean>(false);
  const [isSupportOpen, setIsSupportOpen] = useState<boolean>(false);

  // AR Preview Modal Target
  const [arTarget, setArTarget] = useState<{
    product: Product;
    bespokeConfig?: BespokeConfig;
  } | null>(null);

  // Helper Cart Handlers
  const handleAddToCart = (item: CartItem) => {
    setCartItems((prev) => {
      // Check if item already exists with identical config
      const existingIdx = prev.findIndex(
        (i) => i.productId === item.productId && i.selectedFinish === item.selectedFinish && !i.bespokeConfig
      );
      if (existingIdx >= 0 && !item.bespokeConfig) {
        const copy = [...prev];
        copy[existingIdx].quantity += item.quantity;
        return copy;
      }
      return [...prev, item];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)));
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Coupon Logic
  const handleApplyCouponCode = (code: string): boolean => {
    const found = REWARD_COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (found) {
      setActiveCoupon(found);
      return true;
    }
    // Also allow generic test code "PRYZM10"
    if (code.toUpperCase() === 'PRYZM10') {
      const genericCoupon: Coupon = {
        code: 'PRYZM10',
        label: '10% Welcome Patron Credit',
        pointsCost: 0,
        discountType: 'percentage',
        discountValue: 10,
        minSpendUSD: 50,
        description: 'Initial patron credit applied.'
      };
      setActiveCoupon(genericCoupon);
      return true;
    }
    return false;
  };

  const handleDeductPoints = (amount: number, reason: string) => {
    setVipPointsBalance((prev) => Math.max(0, prev - amount));
  };

  // User Registration
  const handleRegisterUser = (user: RegisteredUser) => {
    setRegisteredUser(user);
    // Find picked country and adjust store currency/language
    const foundCountry = COUNTRIES.find((c) => c.code === user.countryCode);
    if (foundCountry) {
      setSelectedCountry(foundCountry);
    }
    // Award +250 welcome VIP points
    setVipPointsBalance((prev) => prev + 250);

    // Add to VIP Leaderboard
    setVipLeaderboard((prev) => {
      const exists = prev.find((u) => u.email === user.email);
      if (exists) return prev;
      const newVip: VIPLeaderboardUser = {
        id: `vip-user-${Date.now()}`,
        name: user.fullName || user.email.split('@')[0],
        email: user.email,
        phone: user.phone,
        country: foundCountry?.name || 'Global Patron',
        totalPoints: 250,
        lifetimeSpentUSD: 0,
        tier: 'Patron Candidate',
        memberSince: 'Oct 2026'
      };
      return [...prev, newVip];
    });
  };

  // Post-Delivery Refund Request
  const handleRequestRefund = (orderId: string, refund: RefundRequest) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, refundRequest: refund } : o))
    );
    const notice: ChatMessage = {
      id: `refund-${Date.now()}`,
      sender: 'client',
      text: `[RETURN / REFUND CLAIM LODGED] Order #${orderId}: "${refund.reason}". Resolution requested: ${refund.desiredResolution === 'cash_refund' ? 'Cash Refund' : 'Replacement Piece'}.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, notice]);
  };

  const handleApproveRefund = (orderId: string, resolution: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId && o.refundRequest) {
          return {
            ...o,
            refundRequest: {
              ...o.refundRequest,
              status: resolution as any
            }
          };
        }
        return o;
      })
    );
    const notice: ChatMessage = {
      id: `refund-status-${Date.now()}`,
      sender: 'concierge',
      text: `Order #${orderId} return claim has been updated to "${resolution.toUpperCase()}". Our freight team will handle the courier cash settlement directly.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, notice]);
  };

  // Callback handling
  const handleRequestCallback = (req: CallbackRequest) => {
    setCallbacks((prev) => [req, ...prev]);
    const notice: ChatMessage = {
      id: `cb-${Date.now()}`,
      sender: 'client',
      text: `[CALLBACK REQUESTED] Phone: ${req.phone} (${req.preferredTime}). Topic: ${req.topic}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, notice]);
  };

  const handleCompleteCallback = (id: string) => {
    setCallbacks((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'completed' } : c))
    );
  };

  // Award bonus points to a customer from Admin Dashboard
  const handleAwardBonusPoints = (userId: string, points: number) => {
    setVipLeaderboard((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, totalPoints: u.totalPoints + points } : u))
    );
    setVipPointsBalance((prev) => prev + points);
  };

  // Order Placement (Cash on Delivery)
  const handleOrderCreated = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    // Clear cart
    setCartItems([]);
    setActiveCoupon(null);

    // Award VIP Points: 10 points per $1 spent!
    const earnedPoints = Math.round(newOrder.totalAmount * 10);
    setVipPointsBalance((prev) => prev + earnedPoints);

    // Add automated concierge notification in chat
    const orderChatNotice: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: 'concierge',
      text: `Consignment #${newOrder.id} has been logged in the PRYZM Foundry queue. Total due upon doorstep inspection: ${newOrder.totalAmount.toFixed(2)} ${newOrder.currency}. You earned +${earnedPoints} VIP Points!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, orderChatNotice]);
  };

  // Chat message handlers (bidirectional client <-> admin)
  const handleSendMessage = (text: string, sender: 'client' | 'concierge') => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, newMsg]);
  };

  // Admin order status update
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // Community post handlers
  const handleUploadCommunityPost = (post: CommunityPost) => {
    setCommunityPosts((prev) => [post, ...prev]);
    // Award 300 VIP points for submitting space!
    setVipPointsBalance((prev) => prev + 300);
  };

  const handleLikeCommunityPost = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  const totalCartWeightKg = Number(
    cartItems.reduce((sum, item) => sum + item.weightKg * item.quantity, 0).toFixed(1)
  );

  return (
    <div className="min-h-screen bg-[#121316] text-[#e5e5e4] flex flex-col font-sans selection:bg-[#c5a880] selection:text-black">
      
      {/* 1. Navbar */}
      <Navbar
        country={selectedCountry}
        onSelectCountry={setSelectedCountry}
        cartCount={cartItems.reduce((sum, i) => sum + i.quantity, 0)}
        totalWeightKg={totalCartWeightKg}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenVIP={() => setIsVIPOpen(true)}
        onOpenTracker={() => {
          setTrackerOrderId(orders[0]?.id);
          setIsTrackerOpen(true);
        }}
        onOpenWorldModal={() => setIsWorldModalOpen(true)}
        currentUser={registeredUser}
        onOpenSignUp={() => setIsSignUpOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
      />

      {/* 2. Hero Section */}
      <Hero
        country={selectedCountry}
        onExploreCollection={() => {
          const el = document.getElementById('collection');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenConfigurator={() => {
          const el = document.getElementById('configurator');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 3. Product Catalog with AR Quick Action & Detail Inspector */}
      <ProductCatalog
        products={PRODUCTS}
        country={selectedCountry}
        onAddToCart={handleAddToCart}
        onLaunchAR={(prod) => setArTarget({ product: prod })}
      />

      {/* 4. Custom Concrete Configurator (Parametric Order Builder) */}
      <section id="configurator" className="py-20 border-t border-neutral-800 bg-[#101114]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BespokeConfigurator
            country={selectedCountry}
            onAddToCart={handleAddToCart}
            onLaunchAR={(mockProduct, config) => setArTarget({ product: mockProduct, bespokeConfig: config })}
          />
        </div>
      </section>

      {/* 5. Community Gallery (Client Installations with Photo Upload) */}
      <CommunityGallery
        posts={communityPosts}
        products={PRODUCTS}
        onUploadPost={handleUploadCommunityPost}
        onLikePost={handleLikeCommunityPost}
      />

      {/* 6. Footer */}
      <Footer onOpenWorldModal={() => setIsWorldModalOpen(true)} />

      {/* MODAL 0: World Localization & Exchange Rates Directory */}
      <WorldLocalizationModal
        isOpen={isWorldModalOpen}
        onClose={() => setIsWorldModalOpen(false)}
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
      />

      {/* MODAL 1: Smart Shopping Bag & Cash on Delivery Checkout */}
      <SmartCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
        activeCoupon={activeCoupon}
        onApplyCouponCode={handleApplyCouponCode}
        onRemoveCoupon={() => setActiveCoupon(null)}
        onOpenVIPStore={() => {
          setIsCartOpen(false);
          setIsVIPOpen(true);
        }}
        onOrderCreated={handleOrderCreated}
        onOpenOrderTracker={(orderId) => {
          setTrackerOrderId(orderId);
          setIsTrackerOpen(true);
        }}
      />

      {/* MODAL 2: Augmented Reality (AR) Preview */}
      {arTarget && (
        <ARRoomPreview
          product={arTarget.product}
          bespokeConfig={arTarget.bespokeConfig}
          onClose={() => setArTarget(null)}
          onAddToCart={() => {
            const item: CartItem = {
              id: `ar-${arTarget.product.id}-${Date.now()}`,
              productId: arTarget.product.id,
              productName: arTarget.product.name,
              category: arTarget.product.category,
              unitPriceUSD: arTarget.bespokeConfig ? arTarget.bespokeConfig.priceUSD : arTarget.product.priceUSD,
              quantity: 1,
              weightKg: arTarget.bespokeConfig ? arTarget.bespokeConfig.calculatedWeightKg : arTarget.product.weightKg,
              selectedFinish: arTarget.product.finishOptions[0],
              image: arTarget.product.image,
              bespokeConfig: arTarget.bespokeConfig
            };
            handleAddToCart(item);
            setArTarget(null);
          }}
        />
      )}

      {/* MODAL 3: PRYZM VIP Club Loyalty & Points Redemption Store */}
      {isVIPOpen && (
        <VIPClubModal
          pointsBalance={vipPointsBalance}
          onDeductPoints={handleDeductPoints}
          onApplyCouponToCart={(coupon) => {
            setActiveCoupon(coupon);
            setIsVIPOpen(false);
            setIsCartOpen(true);
          }}
          onClose={() => setIsVIPOpen(false)}
          activeCouponCode={activeCoupon?.code}
        />
      )}

      {/* MODAL 4: Architectural Consignment Real-Time Tracker with Refund Request */}
      {isTrackerOpen && (
        <OrderTrackerModal
          orders={orders}
          initialOrderId={trackerOrderId}
          onClose={() => setIsTrackerOpen(false)}
          onRequestRefund={handleRequestRefund}
        />
      )}

      {/* MODAL 5: Secure Admin Dashboard (RBAC with VIP Leaderboard & Callbacks) */}
      {isAdminOpen && (
        <AdminDashboard
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          communityPosts={communityPosts}
          onApprovePost={(postId, approved) =>
            setCommunityPosts((prev) =>
              prev.map((p) => (p.id === postId ? { ...p, approved } : p))
            )
          }
          onToggleFeaturePost={(postId) =>
            setCommunityPosts((prev) =>
              prev.map((p) => (p.id === postId ? { ...p, featured: !p.featured } : p))
            )
          }
          chatMessages={chatMessages}
          onAdminSendMessage={(text) => handleSendMessage(text, 'concierge')}
          products={PRODUCTS}
          onCloseAdmin={() => setIsAdminOpen(false)}
          vipLeaderboard={vipLeaderboard}
          onAwardBonusPoints={handleAwardBonusPoints}
          callbacks={callbacks}
          onCompleteCallback={handleCompleteCallback}
          onApproveRefund={handleApproveRefund}
        />
      )}

      {/* MODAL 6: Enhanced Sign-Up & Localization Modal */}
      <SignUpModal
        isOpen={isSignUpOpen}
        onClose={() => setIsSignUpOpen(false)}
        selectedCountry={selectedCountry}
        onSelectCountry={setSelectedCountry}
        onRegisterSuccess={handleRegisterUser}
      />

      {/* MODAL 7: Multi-Channel Support Center ("Report an Issue / Support") */}
      <MultiChannelSupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        adminMessages={chatMessages}
        onSendAdminMessage={(text) => handleSendMessage(text, 'client')}
        onRequestCallback={handleRequestCallback}
      />

      {/* WIDGET: Real-Time Live Support Chat */}
      <LiveConciergeChat
        messages={chatMessages}
        onSendMessage={(text, sender) => handleSendMessage(text, sender)}
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />

    </div>
  );
}
