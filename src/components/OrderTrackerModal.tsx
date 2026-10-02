import React, { useState } from 'react';
import { Order, OrderStatus, RefundRequest } from '../types';
import { 
  Search, X, CheckCircle, Clock, Truck, ShieldCheck, MapPin, 
  Package, Calendar, Phone, DollarSign, RotateCcw, AlertTriangle, Check 
} from 'lucide-react';

interface OrderTrackerModalProps {
  orders: Order[];
  initialOrderId?: string;
  onClose: () => void;
  onRequestRefund?: (orderId: string, refund: RefundRequest) => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  orders,
  initialOrderId,
  onClose,
  onRequestRefund
}) => {
  const [searchId, setSearchId] = useState<string>(initialOrderId || (orders[0]?.id ?? 'PRZ-9041'));
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(
    orders.find((o) => o.id === (initialOrderId || orders[0]?.id)) || orders[0]
  );

  // Refund Form State
  const [isRefundFormOpen, setIsRefundFormOpen] = useState<boolean>(false);
  const [refundReason, setRefundReason] = useState<string>('Surface micro-fracture / crack detected upon uncrating');
  const [refundNotes, setRefundNotes] = useState<string>('');
  const [refundResolution, setRefundResolution] = useState<'cash_refund' | 'replacement'>('cash_refund');
  const [refundSuccessNotice, setRefundSuccessNotice] = useState<string | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchId.trim().toUpperCase();
    const found = orders.find(
      (o) => o.id.toUpperCase() === query || o.trackingNumber.toUpperCase() === query
    );
    if (found) {
      setSelectedOrder(found);
      setIsRefundFormOpen(false);
      setRefundSuccessNotice(null);
    } else {
      alert(`Consignment "${query}" not found. Try sample order "PRZ-9025" (Delivered) or "PRZ-9041".`);
    }
  };

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    const newRefund: RefundRequest = {
      orderId: selectedOrder.id,
      date: new Date().toISOString().split('T')[0],
      reason: refundReason,
      notes: refundNotes.trim() || 'Client requested post-delivery return via portal.',
      desiredResolution: refundResolution,
      status: 'pending'
    };

    if (onRequestRefund) {
      onRequestRefund(selectedOrder.id, newRefund);
    }

    // Update local state copy
    setSelectedOrder({
      ...selectedOrder,
      refundRequest: newRefund
    });

    setIsRefundFormOpen(false);
    setRefundSuccessNotice('Your Return / Refund Request has been lodged with Studio Administration.');
  };

  const getStatusStepIndex = (status: OrderStatus): number => {
    switch (status) {
      case 'pending_verification': return 0;
      case 'casting_curing': return 1;
      case 'freight_dispatched': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered_and_paid': return 4;
      default: return 0;
    }
  };

  const steps = [
    { title: 'Consignment Verified', desc: 'Dimensions & architectural mix approved' },
    { title: 'Hand-Casting & Curing', desc: 'High-density micro-cement & hydration curing' },
    { title: 'Reinforced Crating & Dispatched', desc: 'ISPM-15 wooden freight crating in transit' },
    { title: 'Out with White-Glove Courier', desc: 'Courier en route with heavy hydraulic lift' },
    { title: 'Inspected & Settled via COD', desc: 'Client verified piece & paid physical cash' }
  ];

  const currentStep = selectedOrder ? getStatusStepIndex(selectedOrder.status) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5">
      <div className="relative w-full max-w-3xl bg-[#141518] rounded-xl border border-neutral-800 shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-neutral-800 bg-[#17181c] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono-spec tracking-widest uppercase text-[#c5a880]">
              REAL-TIME CONSIGNMENT TELEMETRY
            </span>
            <h2 className="font-serif-brand text-lg sm:text-xl font-bold text-white">
              Track Architectural Consignment
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Quick Order Select */}
        <div className="p-4 bg-[#191a20] border-b border-neutral-800 space-y-2.5">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Order ID (e.g. PRZ-9041, PRZ-9025) or Tracking #..."
                className="w-full bg-[#121316] border border-neutral-700 focus:border-[#c5a880] rounded pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 font-mono-spec outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-[#282b35] hover:bg-[#323642] text-white text-xs font-medium rounded border border-neutral-700 transition-colors"
            >
              Locate
            </button>
          </form>

          {/* Quick-switch between orders */}
          <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-mono-spec">
            <span className="text-neutral-500 whitespace-nowrap">Your Orders:</span>
            {orders.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => {
                  setSelectedOrder(o);
                  setSearchId(o.id);
                  setIsRefundFormOpen(false);
                  setRefundSuccessNotice(null);
                }}
                className={`px-2.5 py-1 rounded border transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                  selectedOrder?.id === o.id
                    ? 'bg-[#c5a880]/20 text-[#c5a880] border-[#c5a880]/50 font-semibold'
                    : 'bg-[#141519] text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                <span>{o.id}</span>
                <span className={`text-[9px] px-1 py-0.2 rounded uppercase ${
                  o.status === 'delivered_and_paid'
                    ? 'bg-emerald-950 text-emerald-400'
                    : 'bg-neutral-800 text-neutral-400'
                }`}>
                  {o.status === 'delivered_and_paid' ? 'Delivered' : 'In Transit'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {selectedOrder ? (
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
            
            {/* Top Info Banner */}
            <div className="p-4 bg-[#18191e] border border-neutral-800 rounded-lg flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="text-[11px] text-neutral-400 font-mono-spec">
                  ORDER: <strong className="text-white">{selectedOrder.id}</strong> · {selectedOrder.date}
                </div>
                <div className="text-sm font-semibold text-white mt-0.5">
                  Tracking: <span className="text-[#c5a880] font-mono-spec">{selectedOrder.trackingNumber}</span>
                </div>
                <div className="text-xs text-neutral-400 mt-1">
                  Recipient: {selectedOrder.customer.fullName} ({selectedOrder.customer.city})
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase text-neutral-400">Cash on Delivery Settlement</div>
                <div className="text-xl font-mono-spec font-bold text-emerald-400">
                  {selectedOrder.totalAmount.toFixed(2)} {selectedOrder.currency}
                </div>
                <div className="text-[10px] text-neutral-400">Due at Doorstep Inspection</div>
              </div>
            </div>

            {/* Stage Progress Timeline */}
            <div className="space-y-4">
              <span className="text-xs uppercase tracking-wider font-semibold text-neutral-300 block">
                Consignment Milestones
              </span>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-800">
                {steps.map((st, idx) => {
                  const isCompleted = idx < currentStep;
                  const isCurrent = idx === currentStep;

                  return (
                    <div key={st.title} className="relative flex items-start gap-4">
                      {/* Node Icon */}
                      <span
                        className={`absolute -left-6 top-0.5 flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold ${
                          isCompleted
                            ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                            : isCurrent
                            ? 'bg-[#c5a880] border-[#c5a880] text-black animate-pulse'
                            : 'bg-neutral-900 border-neutral-700 text-neutral-500'
                        }`}
                      >
                        {isCompleted ? <CheckCircle className="w-3.5 h-3.5" /> : idx + 1}
                      </span>

                      <div>
                        <div
                          className={`text-xs font-semibold ${
                            isCurrent
                              ? 'text-[#c5a880]'
                              : isCompleted
                              ? 'text-white'
                              : 'text-neutral-500'
                          }`}
                        >
                          {st.title}
                          {isCurrent && (
                            <span className="ml-2 text-[10px] px-2 py-0.5 rounded bg-[#c5a880]/20 text-[#c5a880] font-mono-spec border border-[#c5a880]/40">
                              ACTIVE STAGE
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">{st.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier Delivery Details & Map Location Pin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#18191e] border border-neutral-800 rounded-lg space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
                  <MapPin className="w-4 h-4 text-[#c5a880]" />
                  <span>Delivery Address & Gate Access</span>
                </div>
                <div className="text-neutral-300">
                  {selectedOrder.customer.streetAddress}, {selectedOrder.customer.buildingOrVilla}
                </div>
                <div className="text-neutral-400">
                  {selectedOrder.customer.floorApartment} · {selectedOrder.customer.city}
                </div>
                {selectedOrder.customer.courierDeliveryNotes && (
                  <div className="text-[11px] text-neutral-400 italic bg-[#121316] p-2 rounded border border-neutral-800 mt-2">
                    Note: "{selectedOrder.customer.courierDeliveryNotes}"
                  </div>
                )}
                <div className="text-[11px] font-mono-spec text-neutral-500 pt-1">
                  GPS Coordinates: {selectedOrder.customer.coordinates.lat.toFixed(5)}°N, {selectedOrder.customer.coordinates.lng.toFixed(5)}°W
                </div>
              </div>

              <div className="p-4 bg-[#18191e] border border-neutral-800 rounded-lg space-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
                  <Package className="w-4 h-4 text-[#c5a880]" />
                  <span>Crate Inventory & Physical Mass</span>
                </div>
                <div className="space-y-1 divide-y divide-neutral-800">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="pt-1.5 first:pt-0 flex justify-between">
                      <span className="text-neutral-300 truncate max-w-[200px]">{item.productName}</span>
                      <span className="font-mono-spec text-neutral-400">{item.weightKg} kg</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-800 font-semibold">
                  <span className="text-neutral-400">Total Pallet Weight:</span>
                  <span className="font-mono-spec text-white">{selectedOrder.weightTotalKg} kg</span>
                </div>
              </div>
            </div>

            {/* Post-Delivery Refund Request Section (Displayed once order status is Delivered) */}
            {selectedOrder.status === 'delivered_and_paid' && (
              <div className="p-5 bg-[#17181e] border border-neutral-800 rounded-lg space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-[#c5a880]" />
                    <div>
                      <h4 className="font-serif-brand text-sm font-semibold text-white">
                        Post-Delivery Warranty & Refund Request
                      </h4>
                      <p className="text-[11px] text-neutral-400">
                        14-day structural pledge for delivered architectural castings.
                      </p>
                    </div>
                  </div>

                  {!selectedOrder.refundRequest && !isRefundFormOpen && (
                    <button
                      type="button"
                      onClick={() => setIsRefundFormOpen(true)}
                      className="px-3.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded text-xs font-medium transition-colors"
                    >
                      Request Refund / Return
                    </button>
                  )}
                </div>

                {refundSuccessNotice && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-800/50 rounded text-xs text-emerald-300 flex items-center gap-2 font-mono-spec">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{refundSuccessNotice}</span>
                  </div>
                )}

                {/* Already Submitted Refund Claim View */}
                {selectedOrder.refundRequest && (
                  <div className="p-4 bg-[#121316] border border-neutral-800 rounded space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">LODGED RETURN CLAIM:</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-spec uppercase font-bold bg-amber-950 text-amber-300 border border-amber-800">
                        Status: {selectedOrder.refundRequest.status}
                      </span>
                    </div>

                    <div className="text-neutral-300">
                      Reason: <strong className="text-white">{selectedOrder.refundRequest.reason}</strong>
                    </div>

                    <div className="text-neutral-400">
                      Desired Resolution: <strong className="text-neutral-200 font-mono-spec">
                        {selectedOrder.refundRequest.desiredResolution === 'cash_refund'
                          ? 'Full Cash Refund upon Doorstep Courier Collection (COD Return)'
                          : 'Priority Hand-Cast Replacement Piece'}
                      </strong>
                    </div>

                    <div className="text-neutral-400 italic">
                      Client Notes: "{selectedOrder.refundRequest.notes}"
                    </div>

                    <div className="text-[10px] text-neutral-500 font-mono-spec pt-1">
                      Submitted on: {selectedOrder.refundRequest.date} · Consignment #{selectedOrder.id}
                    </div>
                  </div>
                )}

                {/* Form to submit a new refund request */}
                {!selectedOrder.refundRequest && isRefundFormOpen && (
                  <form onSubmit={handleRefundSubmit} className="space-y-4 pt-1">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                        Reason for Return / Refund *
                      </label>
                      <select
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        className="w-full bg-[#121316] border border-neutral-700 focus:border-[#c5a880] rounded px-3 py-2 text-xs text-white outline-none"
                      >
                        <option value="Surface micro-fracture / crack detected upon uncrating">
                          Surface micro-fracture / crack detected upon uncrating
                        </option>
                        <option value="Dimensional variance beyond architectural tolerance (&gt;5mm)">
                          Dimensional variance beyond architectural tolerance (&gt;5mm)
                        </option>
                        <option value="Mineral pigment tone discrepancy from order specification">
                          Mineral pigment tone discrepancy from order specification
                        </option>
                        <option value="Fluted vertical alignment defect / casting air pocket">
                          Fluted vertical alignment defect / casting air pocket
                        </option>
                        <option value="Packaging crate breached / damaged in transit">
                          Packaging crate breached / damaged in transit
                        </option>
                        <option value="General architectural aesthetic dissatisfaction">
                          General architectural aesthetic dissatisfaction
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                        Desired Resolution *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <label
                          className={`p-3 rounded border cursor-pointer flex items-center gap-2 ${
                            refundResolution === 'cash_refund'
                              ? 'bg-[#22242c] border-[#c5a880] text-white'
                              : 'bg-[#121316] border-neutral-800 text-neutral-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="resolution"
                            value="cash_refund"
                            checked={refundResolution === 'cash_refund'}
                            onChange={() => setRefundResolution('cash_refund')}
                            className="accent-[#c5a880]"
                          />
                          <span>Full Cash Refund (Courier Cash Pickup)</span>
                        </label>

                        <label
                          className={`p-3 rounded border cursor-pointer flex items-center gap-2 ${
                            refundResolution === 'replacement'
                              ? 'bg-[#22242c] border-[#c5a880] text-white'
                              : 'bg-[#121316] border-neutral-800 text-neutral-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="resolution"
                            value="replacement"
                            checked={refundResolution === 'replacement'}
                            onChange={() => setRefundResolution('replacement')}
                            className="accent-[#c5a880]"
                          />
                          <span>Priority Replacement Casting</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                        Inspection Details / Photo Verification Notes *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={refundNotes}
                        onChange={(e) => setRefundNotes(e.target.value)}
                        placeholder="Please describe the defect, location of micro-crack, or reason for return..."
                        className="w-full bg-[#121316] border border-neutral-700 focus:border-[#c5a880] rounded px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none resize-none"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsRefundFormOpen(false)}
                        className="px-4 py-2 bg-neutral-800 text-xs text-neutral-300 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#c5a880] hover:bg-[#b89a70] text-black font-semibold text-xs uppercase tracking-wider rounded transition-colors"
                      >
                        Submit Refund Request
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

          </div>
        ) : (
          <div className="p-8 text-center text-neutral-400 text-sm">
            Select or search for an active order to view tracking.
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-[#121316] border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-400">
          <span>Freight Courier Contact: +1 (800) 492-PRYZM</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
