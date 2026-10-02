import React, { useState } from 'react';
import { Order, OrderStatus, CommunityPost, ChatMessage, Product, VIPLeaderboardUser, CallbackRequest, RefundRequest } from '../types';
import { 
  ShieldCheck, Lock, Unlock, Package, MessageSquare, Image, 
  Settings, LogOut, CheckCircle, Clock, Truck, DollarSign, 
  MapPin, Phone, Mail, User, Eye, Send, Filter, Check, X, Award, PhoneCall, RotateCcw, AlertTriangle, Sparkles
} from 'lucide-react';

interface AdminDashboardProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  communityPosts: CommunityPost[];
  onApprovePost: (postId: string, approved: boolean) => void;
  onToggleFeaturePost: (postId: string) => void;
  chatMessages: ChatMessage[];
  onAdminSendMessage: (text: string) => void;
  products: Product[];
  onCloseAdmin: () => void;
  vipLeaderboard?: VIPLeaderboardUser[];
  onAwardBonusPoints?: (userId: string, points: number) => void;
  callbacks?: CallbackRequest[];
  onCompleteCallback?: (id: string) => void;
  onApproveRefund?: (orderId: string, resolution: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  orders,
  onUpdateOrderStatus,
  communityPosts,
  onApprovePost,
  onToggleFeaturePost,
  chatMessages,
  onAdminSendMessage,
  products,
  onCloseAdmin,
  vipLeaderboard = [],
  onAwardBonusPoints,
  callbacks = [],
  onCompleteCallback,
  onApproveRefund
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'orders' | 'chat' | 'gallery' | 'catalog' | 'leaderboard' | 'callbacks'>('orders');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null);
  const [adminChatInput, setAdminChatInput] = useState<string>('');
  const [bonusNotice, setBonusNotice] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default passcode is PRYZM2026 or admin
    if (passcode.trim().toUpperCase() === 'PRYZM2026' || passcode.trim() === 'admin') {
      setIsAuthenticated(true);
      setLoginError(null);
    } else {
      setLoginError('Invalid security credentials. Use master passcode: PRYZM2026');
    }
  };

  const handleAdminChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminChatInput.trim()) return;
    onAdminSendMessage(adminChatInput.trim());
    setAdminChatInput('');
  };

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  const totalCODReceivables = orders
    .filter((o) => o.status !== 'delivered_and_paid' && o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const totalPalletMassShipped = orders.reduce((sum, o) => sum + o.weightTotalKg, 0);

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
        <div className="w-full max-w-md bg-[#16171b] rounded-xl border border-neutral-800 shadow-2xl p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-[#c5a880]/15 border border-[#c5a880]/30 flex items-center justify-center mx-auto text-[#c5a880]">
              <Lock className="w-6 h-6" />
            </div>
            <div className="text-[10px] uppercase font-mono-spec tracking-widest text-[#c5a880]">
              RBAC SECURITY GATEWAY
            </div>
            <h2 className="font-serif-brand text-2xl font-bold text-white">
              Studio Admin Dashboard
            </h2>
            <p className="text-xs text-neutral-400">
              Restricted portal for foundry casting schedules, COD cash auditing, and real-time live dispatch.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                Master Foundry Passcode
              </label>
              <input
                type="password"
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter passcode (Hint: PRYZM2026)"
                className="w-full bg-[#111215] border border-neutral-700 focus:border-[#c5a880] rounded px-3 py-2.5 text-xs text-white placeholder-neutral-500 font-mono-spec outline-none"
              />
            </div>

            {loginError && (
              <div className="p-2.5 bg-rose-950/40 border border-rose-800/50 rounded text-xs text-rose-300">
                {loginError}
              </div>
            )}

            <div className="p-3 bg-[#111215] border border-neutral-800 rounded text-[11px] text-neutral-400">
              Passcode for evaluation: <code className="text-[#c5a880] font-mono-spec font-bold">PRYZM2026</code>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onCloseAdmin}
                className="flex-1 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold uppercase tracking-wider rounded transition-colors"
              >
                Exit to Store
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#c5a880] hover:bg-[#b89a70] text-black text-xs font-semibold uppercase tracking-wider rounded transition-colors shadow-lg"
              >
                Authenticate
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0f1013] text-[#e5e5e4] overflow-hidden">
      
      {/* Top Navbar */}
      <header className="h-16 px-6 bg-[#15161a] border-b border-neutral-800 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-serif-brand text-lg font-bold tracking-widest text-white">
            PRYZM ADMIN CONSOLE
          </span>
          <span className="text-neutral-600">|</span>
          <span className="text-[11px] font-mono-spec text-emerald-400 flex items-center gap-1.5 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            DIRECTOR ACCESS ACTIVE
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onCloseAdmin}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#202228] hover:bg-[#282a32] text-xs font-medium text-neutral-200 border border-neutral-700 rounded transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Return to Client Storefront</span>
          </button>
        </div>
      </header>

      {/* KPI Ticker Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-neutral-800 border-b border-neutral-800 bg-[#121316] text-xs">
        <div className="p-3 sm:px-6">
          <div className="text-[10px] uppercase text-neutral-500 font-mono-spec">Pending COD Receivables</div>
          <div className="text-base font-bold font-mono-spec text-[#c5a880] mt-0.5">
            ${totalCODReceivables.toFixed(2)} USD
          </div>
        </div>
        <div className="p-3 sm:px-6">
          <div className="text-[10px] uppercase text-neutral-500 font-mono-spec">Active Orders in Pipeline</div>
          <div className="text-base font-bold font-mono-spec text-white mt-0.5">
            {orders.length} Consignments
          </div>
        </div>
        <div className="p-3 sm:px-6">
          <div className="text-[10px] uppercase text-neutral-500 font-mono-spec">Gross Freight Mass</div>
          <div className="text-base font-bold font-mono-spec text-white mt-0.5">
            {totalPalletMassShipped.toFixed(1)} KG Cast Concrete
          </div>
        </div>
        <div className="p-3 sm:px-6">
          <div className="text-[10px] uppercase text-neutral-500 font-mono-spec">Community Patron Submissions</div>
          <div className="text-base font-bold font-mono-spec text-emerald-400 mt-0.5">
            {communityPosts.filter((p) => p.approved).length} Approved / {communityPosts.length} Total
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 bg-[#16171b] border-b border-neutral-800 flex items-center gap-2 overflow-x-auto flex-shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-[#c5a880] text-white font-semibold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Package className="w-3.5 h-3.5 text-[#c5a880]" />
          <span>Consignments & COD Orders ({orders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'chat'
              ? 'border-[#c5a880] text-white font-semibold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-[#c5a880]" />
          <span>Live Concierge Terminal ({chatMessages.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('gallery')}
          className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'gallery'
              ? 'border-[#c5a880] text-white font-semibold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Image className="w-3.5 h-3.5 text-[#c5a880]" />
          <span>Patron Photos ({communityPosts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('leaderboard')}
          className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'leaderboard'
              ? 'border-[#c5a880] text-white font-semibold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-[#c5a880]" />
          <span>VIP Leaderboard ({vipLeaderboard.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('callbacks')}
          className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'callbacks'
              ? 'border-[#c5a880] text-white font-semibold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <PhoneCall className="w-3.5 h-3.5 text-[#c5a880]" />
          <span>Callbacks ({callbacks.filter((c) => c.status === 'pending').length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`py-3 px-4 text-xs font-medium border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'catalog'
              ? 'border-[#c5a880] text-white font-semibold'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-neutral-400" />
          <span>Casting Specs</span>
        </button>
      </div>

      {/* Main Tab Views */}
      <div className="flex-1 overflow-hidden p-6 bg-[#0f1013]">
        
        {/* TAB 1: ORDERS & COD STATUS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="h-full grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
            
            {/* Orders List Pane */}
            <div className="lg:col-span-5 flex flex-col h-full bg-[#15161a] border border-neutral-800 rounded-xl overflow-hidden">
              <div className="p-3 bg-[#18191e] border-b border-neutral-800 flex items-center justify-between">
                <span className="text-xs uppercase font-semibold text-neutral-300">
                  All Consignments
                </span>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-[#111215] border border-neutral-700 text-xs text-neutral-300 rounded px-2 py-1 outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending_verification">Pending Verification</option>
                  <option value="casting_curing">Casting & Curing</option>
                  <option value="freight_dispatched">Freight Dispatched</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered_and_paid">Delivered & Paid (COD)</option>
                </select>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-neutral-800">
                {filteredOrders.map((order) => {
                  const isSelected = selectedOrder?.id === order.id;

                  return (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`p-3.5 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#22242c] border-l-2 border-[#c5a880]'
                          : 'hover:bg-[#18191e]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono-spec font-bold text-xs text-white">
                          #{order.id}
                        </span>
                        <span className="text-[10px] font-mono-spec text-neutral-400">
                          {order.date}
                        </span>
                      </div>

                      <div className="text-xs text-neutral-300 font-medium mt-1 truncate">
                        {order.customer.fullName} · {order.customer.city}
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[11px] font-mono-spec text-[#c5a880] font-semibold">
                          ${order.totalAmount.toFixed(2)} {order.currency} (COD)
                        </span>

                        <span
                          className={`text-[9px] uppercase font-mono-spec px-2 py-0.5 rounded font-semibold ${
                            order.status === 'delivered_and_paid'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : order.status === 'out_for_delivery'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Order Detailed Inspector */}
            <div className="lg:col-span-7 flex flex-col h-full bg-[#15161a] border border-neutral-800 rounded-xl overflow-hidden">
              {selectedOrder ? (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {/* Top Bar with Status Changer */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-800">
                    <div>
                      <div className="text-[11px] font-mono-spec text-[#c5a880]">CONSIGNMENT INSPECTOR</div>
                      <h3 className="font-serif-brand text-xl font-bold text-white mt-0.5">
                        Order #{selectedOrder.id}
                      </h3>
                      <div className="text-xs text-neutral-400 font-mono-spec">
                        Tracking: {selectedOrder.trackingNumber}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-neutral-400">Pipeline Status:</span>
                      <select
                        value={selectedOrder.status}
                        onChange={(e) => {
                          const newStatus = e.target.value as OrderStatus;
                          onUpdateOrderStatus(selectedOrder.id, newStatus);
                          setSelectedOrder({ ...selectedOrder, status: newStatus });
                        }}
                        className="bg-[#121316] border border-[#c5a880] text-xs text-[#c5a880] font-semibold rounded px-3 py-1.5 outline-none font-mono-spec"
                      >
                        <option value="pending_verification">Pending Verification</option>
                        <option value="casting_curing">Casting & Curing</option>
                        <option value="freight_dispatched">Freight Dispatched</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered_and_paid">Delivered & Paid (COD)</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer Information & Precise Map Pin Coordinates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#18191e] border border-neutral-800 rounded-lg space-y-2 text-xs">
                      <div className="text-xs uppercase font-semibold text-neutral-300 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#c5a880]" />
                        <span>Customer Contact</span>
                      </div>
                      <div className="text-neutral-200 font-medium">{selectedOrder.customer.fullName}</div>
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <Mail className="w-3 h-3" />
                        <span>{selectedOrder.customer.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-400">
                        <Phone className="w-3 h-3" />
                        <span>{selectedOrder.customer.phone}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-[#18191e] border border-neutral-800 rounded-lg space-y-2 text-xs">
                      <div className="text-xs uppercase font-semibold text-neutral-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#c5a880]" />
                        <span>Delivery Entrance & GPS Pin</span>
                      </div>
                      <div className="text-neutral-300">
                        {selectedOrder.customer.streetAddress}, {selectedOrder.customer.buildingOrVilla}
                      </div>
                      <div className="text-neutral-400">{selectedOrder.customer.floorApartment}</div>
                      <div className="text-[11px] font-mono-spec text-[#c5a880] pt-1">
                        GPS: {selectedOrder.customer.coordinates.lat.toFixed(5)}°N, {selectedOrder.customer.coordinates.lng.toFixed(5)}°E
                      </div>
                    </div>
                  </div>

                  {/* Courier & Gate Access Notes */}
                  {selectedOrder.customer.courierDeliveryNotes && (
                    <div className="p-3 bg-[#111215] border border-neutral-800 rounded text-xs">
                      <span className="text-neutral-400 font-semibold block mb-0.5">
                        Courier Access Instructions:
                      </span>
                      <p className="text-neutral-300 italic">"{selectedOrder.customer.courierDeliveryNotes}"</p>
                    </div>
                  )}

                  {/* Concrete Castings & Crate Breakdown */}
                  <div className="space-y-2">
                    <span className="text-xs uppercase font-semibold text-neutral-300 block">
                      Ordered Architectural Items ({selectedOrder.weightTotalKg} KG Total)
                    </span>
                    <div className="border border-neutral-800 rounded-lg divide-y divide-neutral-800 bg-[#18191e] text-xs">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="p-3 flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-white">{item.productName}</div>
                            {item.selectedFinish && (
                              <div className="text-[11px] text-[#c5a880]">{item.selectedFinish}</div>
                            )}
                            {item.bespokeConfig?.customEngraving && (
                              <div className="text-[10px] text-neutral-400 font-mono-spec">
                                Inscription: "{item.bespokeConfig.customEngraving}"
                              </div>
                            )}
                          </div>
                          <div className="text-right font-mono-spec">
                            <div className="text-white">${item.unitPriceUSD} × {item.quantity}</div>
                            <div className="text-[10px] text-neutral-500">{item.weightKg} kg</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Post-Delivery Return & Refund Request Review */}
                  {selectedOrder.refundRequest && (
                    <div className="p-4 bg-amber-950/40 border border-amber-800/60 rounded-lg space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-amber-200 flex items-center gap-2">
                          <RotateCcw className="w-4 h-4 text-[#c5a880]" />
                          Client Lodged Return / Refund Claim
                        </span>
                        <span className="font-mono-spec px-2 py-0.5 rounded bg-amber-900/60 text-amber-200 border border-amber-700 uppercase font-bold text-[10px]">
                          Claim: {selectedOrder.refundRequest.status}
                        </span>
                      </div>

                      <div className="text-neutral-300">
                        Reason: <strong className="text-white">{selectedOrder.refundRequest.reason}</strong>
                      </div>

                      <div className="text-neutral-400 italic bg-[#111215] p-2.5 rounded border border-neutral-800">
                        Client Inspection Notes: "{selectedOrder.refundRequest.notes}"
                      </div>

                      <div className="flex flex-wrap items-center justify-between pt-2 border-t border-amber-900/40 gap-2">
                        <span className="text-[11px] text-neutral-400">
                          Requested Resolution: <strong className="text-white font-mono-spec">
                            {selectedOrder.refundRequest.desiredResolution === 'cash_refund' ? 'Full Cash COD Refund' : 'Replacement Casting'}
                          </strong>
                        </span>

                        {selectedOrder.refundRequest.status === 'pending' && onApproveRefund && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => onApproveRefund(selectedOrder.id, 'approved')}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                            >
                              Approve Return Pickup
                            </button>
                            <button
                              type="button"
                              onClick={() => onApproveRefund(selectedOrder.id, 'declined')}
                              className="px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded text-xs"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Cash on Delivery Settlement Audit */}
                  <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-lg flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-emerald-300">
                        Cash on Delivery Receivable
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Specialized courier collects cash at recipient doorstep.
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xl font-mono-spec font-bold text-emerald-400">
                        ${selectedOrder.totalAmount.toFixed(2)} {selectedOrder.currency}
                      </div>
                      {selectedOrder.status !== 'delivered_and_paid' ? (
                        <button
                          type="button"
                          onClick={() => {
                            onUpdateOrderStatus(selectedOrder.id, 'delivered_and_paid');
                            setSelectedOrder({ ...selectedOrder, status: 'delivered_and_paid' });
                          }}
                          className="mt-1 text-[11px] px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition-colors"
                        >
                          Mark Cash Collected
                        </button>
                      ) : (
                        <div className="text-[10px] text-emerald-400 font-mono-spec mt-1 flex items-center gap-1 justify-end">
                          <Check className="w-3 h-3" /> Settled & Deposited
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center text-neutral-500 text-xs">
                  Select a consignment on the left to inspect details.
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 2: LIVE CONCIERGE TERMINAL */}
        {activeTab === 'chat' && (
          <div className="h-full bg-[#15161a] border border-neutral-800 rounded-xl flex flex-col overflow-hidden max-w-4xl mx-auto">
            <div className="p-4 bg-[#18191e] border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="font-serif-brand text-sm font-semibold text-white">
                  Studio Concierge Live Feed
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Direct communication link with client storefront shoppers.
                </p>
              </div>
              <span className="text-xs font-mono-spec text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                Live Sync Active
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0f1013]">
              {chatMessages.map((msg) => {
                const isAdmin = msg.sender === 'concierge';

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-neutral-500 font-mono-spec mb-0.5 px-1">
                      {isAdmin ? 'PRYZM Concierge (You)' : 'Client Shopper'} · {msg.timestamp}
                    </div>
                    <div
                      className={`max-w-[75%] rounded-lg p-3 text-xs leading-relaxed ${
                        isAdmin
                          ? 'bg-[#252830] text-white border border-neutral-700'
                          : 'bg-[#c5a880] text-black font-medium'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleAdminChatSend} className="p-4 bg-[#18191e] border-t border-neutral-800 flex gap-2">
              <input
                type="text"
                value={adminChatInput}
                onChange={(e) => setAdminChatInput(e.target.value)}
                placeholder="Reply as PRYZM Chief Casting Director..."
                className="flex-1 bg-[#121316] border border-neutral-700 focus:border-[#c5a880] rounded px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#c5a880] hover:bg-[#b89a70] text-black font-semibold text-xs rounded transition-colors"
              >
                Send Dispatch
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: PATRON COMMUNITY CURATION */}
        {activeTab === 'gallery' && (
          <div className="h-full overflow-y-auto space-y-4 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif-brand text-lg font-bold text-white">
                  Patron Community Gallery Curation
                </h3>
                <p className="text-xs text-neutral-400">
                  Moderate client architectural installations before displaying them publicly on the homepage.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {communityPosts.map((post) => (
                <div
                  key={post.id}
                  className="bg-[#15161a] border border-neutral-800 rounded-lg overflow-hidden flex flex-col"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-44 object-cover bg-neutral-900"
                  />
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                        <span>{post.location}</span>
                        <span className="font-mono-spec">{post.date}</span>
                      </div>
                      <h4 className="text-xs font-semibold text-white line-clamp-2">{post.title}</h4>
                      <p className="text-[11px] text-neutral-400 mt-1">By {post.author}</p>
                      <div className="text-[10px] text-[#c5a880] font-mono-spec mt-1">
                        Ref: {post.productReferenced}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => onApprovePost(post.id, !post.approved)}
                        className={`px-3 py-1.5 text-xs rounded font-medium transition-colors ${
                          post.approved
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                        }`}
                      >
                        {post.approved ? 'Approved' : 'Pending Approval'}
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleFeaturePost(post.id)}
                        className={`px-2.5 py-1.5 text-xs rounded font-medium transition-colors ${
                          post.featured
                            ? 'bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/40'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                      >
                        {post.featured ? 'Featured' : 'Standard'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CATALOG & MASS SPECIFICATIONS */}
        {activeTab === 'catalog' && (
          <div className="h-full overflow-y-auto space-y-4 max-w-5xl mx-auto">
            <div>
              <h3 className="font-serif-brand text-lg font-bold text-white">
                Foundry Inventory & Concrete Weight Calibrations
              </h3>
              <p className="text-xs text-neutral-400">
                Inspect physical item mass, lead time, and pallet crate specifications.
              </p>
            </div>

            <div className="border border-neutral-800 rounded-xl overflow-hidden bg-[#15161a]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#191a20] border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Product</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 font-mono-spec">Dry Mass (KG)</th>
                    <th className="p-3">Dimensions</th>
                    <th className="p-3 font-mono-spec">Base Price (USD)</th>
                    <th className="p-3">Casting Lead Time</th>
                    <th className="p-3">Stock State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-200">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#1b1c22]">
                      <td className="p-3 font-medium text-white flex items-center gap-2">
                        <img
                          src={p.image}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded object-cover bg-neutral-900"
                        />
                        <span>{p.name}</span>
                      </td>
                      <td className="p-3 uppercase text-[10px] text-neutral-400 font-mono-spec">{p.category}</td>
                      <td className="p-3 font-mono-spec text-[#c5a880] font-semibold">{p.weightKg} kg</td>
                      <td className="p-3 text-neutral-400">{p.dimensions}</td>
                      <td className="p-3 font-mono-spec text-white">${p.priceUSD}</td>
                      <td className="p-3 text-neutral-400">{p.leadTimeDays} Days</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                          Ready to Crate
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: VIP POINTS LEADERBOARD (PRYZM VIP CLUB) */}
        {activeTab === 'leaderboard' && (
          <div className="h-full overflow-y-auto space-y-6 max-w-6xl mx-auto">
            {/* Header & KPI Summary */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono-spec tracking-widest uppercase text-[#c5a880]">
                  ARCHITECTS GUILD LOYALTY INTELLIGENCE
                </span>
                <h3 className="font-serif-brand text-xl sm:text-2xl font-bold text-white mt-0.5">
                  PRYZM VIP Club — Patron Points Leaderboard
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Patrons ranked by accumulated foundry loyalty points earned across architectural commissions.
                </p>
              </div>

              {bonusNotice && (
                <div className="p-2.5 bg-emerald-950/60 border border-emerald-800/60 rounded text-xs text-emerald-300 font-mono-spec animate-in fade-in">
                  {bonusNotice}
                </div>
              )}
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-4 bg-[#15161a] border border-neutral-800 rounded-lg">
                <span className="text-[10px] uppercase text-neutral-500 font-mono-spec">Top Patron Balance</span>
                <div className="text-lg font-mono-spec font-bold text-[#c5a880] mt-0.5">
                  {vipLeaderboard[0]?.totalPoints || 0} PTS
                </div>
                <div className="text-[11px] text-neutral-400 truncate mt-0.5">{vipLeaderboard[0]?.name}</div>
              </div>

              <div className="p-4 bg-[#15161a] border border-neutral-800 rounded-lg">
                <span className="text-[10px] uppercase text-neutral-500 font-mono-spec">Guild Members</span>
                <div className="text-lg font-mono-spec font-bold text-white mt-0.5">
                  {vipLeaderboard.length} Patrons
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Verified Accounts</div>
              </div>

              <div className="p-4 bg-[#15161a] border border-neutral-800 rounded-lg">
                <span className="text-[10px] uppercase text-neutral-500 font-mono-spec">Points in Circulation</span>
                <div className="text-lg font-mono-spec font-bold text-emerald-400 mt-0.5">
                  {vipLeaderboard.reduce((sum, u) => sum + u.totalPoints, 0).toLocaleString()} PTS
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Available for Vouchers</div>
              </div>

              <div className="p-4 bg-[#15161a] border border-neutral-800 rounded-lg">
                <span className="text-[10px] uppercase text-neutral-500 font-mono-spec">Guild Total Volume</span>
                <div className="text-lg font-mono-spec font-bold text-white mt-0.5">
                  ${vipLeaderboard.reduce((sum, u) => sum + u.lifetimeSpentUSD, 0).toLocaleString()} USD
                </div>
                <div className="text-[11px] text-neutral-400 mt-0.5">Lifetime Commissions</div>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="border border-neutral-800 rounded-xl overflow-hidden bg-[#15161a] shadow-xl">
              <div className="p-4 bg-[#18191e] border-b border-neutral-800 flex items-center justify-between">
                <span className="text-xs uppercase font-semibold text-neutral-300 flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#c5a880]" />
                  Patron Loyalty Rankings & Contact Roster
                </span>
                <span className="text-[10px] font-mono-spec text-neutral-500">
                  Updated Live · 10 PTS / $1 COD Rate
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#121316] border-b border-neutral-800 text-neutral-400 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5 text-center w-14">Rank</th>
                      <th className="p-3.5">Patron Name & Tier</th>
                      <th className="p-3.5">Contact Email</th>
                      <th className="p-3.5">Phone Number</th>
                      <th className="p-3.5">Residence Location</th>
                      <th className="p-3.5 font-mono-spec text-right">Lifetime Spend</th>
                      <th className="p-3.5 font-mono-spec text-right">Total Points</th>
                      <th className="p-3.5 text-center">Reward Patron</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800 text-neutral-200">
                    {vipLeaderboard.map((user, idx) => {
                      const rank = idx + 1;

                      return (
                        <tr key={user.id} className="hover:bg-[#1a1b22] transition-colors">
                          <td className="p-3.5 text-center">
                            <span
                              className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-mono-spec font-bold text-xs ${
                                rank === 1
                                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/50'
                                  : rank === 2
                                  ? 'bg-neutral-300/20 text-neutral-200 border border-neutral-400/50'
                                  : rank === 3
                                  ? 'bg-amber-700/20 text-amber-500 border border-amber-700/50'
                                  : 'text-neutral-500'
                              }`}
                            >
                              {rank}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <div className="font-semibold text-white">{user.name}</div>
                            <span className="text-[10px] text-[#c5a880] font-mono-spec">
                              {user.tier} · Since {user.memberSince}
                            </span>
                          </td>

                          <td className="p-3.5 text-neutral-300 font-mono-spec">
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-neutral-500" />
                              <span>{user.email}</span>
                            </div>
                          </td>

                          <td className="p-3.5 text-neutral-300 font-mono-spec">
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3 h-3 text-neutral-500" />
                              <span>{user.phone}</span>
                            </div>
                          </td>

                          <td className="p-3.5 text-neutral-400">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-neutral-500" />
                              <span>{user.country}</span>
                            </div>
                          </td>

                          <td className="p-3.5 font-mono-spec text-white text-right font-medium">
                            ${user.lifetimeSpentUSD.toLocaleString()} USD
                          </td>

                          <td className="p-3.5 font-mono-spec text-right font-bold text-[#c5a880] text-sm">
                            {user.totalPoints.toLocaleString()} <span className="text-[10px] text-neutral-400">PTS</span>
                          </td>

                          <td className="p-3.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  if (onAwardBonusPoints) onAwardBonusPoints(user.id, 100);
                                  setBonusNotice(`Awarded +100 courtesy points to ${user.name}`);
                                  setTimeout(() => setBonusNotice(null), 3000);
                                }}
                                className="px-2 py-1 bg-[#252830] hover:bg-[#303440] text-neutral-200 border border-neutral-700 rounded text-[10px] font-mono-spec transition-colors"
                                title="Award +100 Points"
                              >
                                +100
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (onAwardBonusPoints) onAwardBonusPoints(user.id, 250);
                                  setBonusNotice(`Awarded +250 VIP bonus points to ${user.name}`);
                                  setTimeout(() => setBonusNotice(null), 3000);
                                }}
                                className="px-2 py-1 bg-[#c5a880]/20 hover:bg-[#c5a880]/30 text-[#c5a880] border border-[#c5a880]/40 rounded text-[10px] font-mono-spec transition-colors"
                                title="Award +250 Points"
                              >
                                +250
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SCHEDULED CALLBACK REQUESTS */}
        {activeTab === 'callbacks' && (
          <div className="h-full overflow-y-auto space-y-6 max-w-5xl mx-auto">
            <div>
              <span className="text-[10px] font-mono-spec tracking-widest uppercase text-[#c5a880]">
                TELEPHONE CONCIERGE QUEUE
              </span>
              <h3 className="font-serif-brand text-xl sm:text-2xl font-bold text-white mt-0.5">
                Client Callback Requests
              </h3>
              <p className="text-xs text-neutral-400 mt-1">
                Requested telephone consultations logged via the Support Center.
              </p>
            </div>

            <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-xl overflow-hidden bg-[#15161a]">
              {callbacks.length === 0 ? (
                <div className="p-12 text-center text-neutral-500 text-xs">
                  No pending callback requests.
                </div>
              ) : (
                callbacks.map((cb) => (
                  <div key={cb.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#18191e] transition-colors">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white text-sm">{cb.fullName}</span>
                        <span
                          className={`text-[9px] font-mono-spec uppercase px-2 py-0.5 rounded font-bold ${
                            cb.status === 'completed'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                          }`}
                        >
                          {cb.status === 'completed' ? 'Completed' : 'Pending Callback'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-300 font-mono-spec">
                        <span className="flex items-center gap-1.5 text-[#c5a880]">
                          <Phone className="w-3.5 h-3.5" /> {cb.phone}
                        </span>
                        <span className="flex items-center gap-1.5 text-neutral-400">
                          <Clock className="w-3.5 h-3.5" /> Preferred Time: {cb.preferredTime}
                        </span>
                      </div>

                      <p className="text-xs text-neutral-400 italic">
                        Topic: "{cb.topic}"
                      </p>

                      <div className="text-[10px] text-neutral-500 font-mono-spec">
                        Requested: {cb.requestedAt}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {cb.status === 'pending' && onCompleteCallback && (
                        <button
                          type="button"
                          onClick={() => onCompleteCallback(cb.id)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded transition-colors"
                        >
                          Mark as Completed
                        </button>
                      )}
                      <a
                        href={`tel:${cb.phone}`}
                        className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded text-xs transition-colors"
                      >
                        Call Now
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
