import React, { useState } from 'react';
import { Coupon, VIPPointsRecord } from '../types';
import { REWARD_COUPONS } from '../data/mockData';
import { Award, Gift, ArrowRight, Check, Sparkles, X, Shield, History, Tag } from 'lucide-react';

interface VIPClubModalProps {
  pointsBalance: number;
  onDeductPoints: (amount: number, reason: string) => void;
  onApplyCouponToCart: (coupon: Coupon) => void;
  onClose: () => void;
  activeCouponCode?: string;
}

export const VIPClubModal: React.FC<VIPClubModalProps> = ({
  pointsBalance,
  onDeductPoints,
  onApplyCouponToCart,
  onClose,
  activeCouponCode
}) => {
  const [historyTab, setHistoryTab] = useState<'rewards' | 'ledger'>('rewards');
  const [redeemedCode, setRedeemedCode] = useState<string | null>(null);

  const pointsHistory: VIPPointsRecord[] = [
    {
      id: 'rec-1',
      date: '2026-09-28',
      amount: 475,
      type: 'earned',
      reason: 'Order #PRZ-9041 (Aethel Lamp & Platter) · 10 pts per $1'
    },
    {
      id: 'rec-2',
      date: '2026-09-20',
      amount: 300,
      type: 'earned',
      reason: 'Community Architectural Loft Photo Submission approved'
    },
    {
      id: 'rec-3',
      date: '2026-09-15',
      amount: 475,
      type: 'earned',
      reason: 'Founding Patron Welcome Allocation'
    }
  ];

  const handleRedeem = (coupon: Coupon) => {
    if (pointsBalance < coupon.pointsCost) return;

    onDeductPoints(coupon.pointsCost, `Redeemed ${coupon.label}`);
    onApplyCouponToCart(coupon);
    setRedeemedCode(coupon.code);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-5">
      <div className="relative w-full max-w-2xl bg-[#141518] rounded-xl border border-neutral-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#17181d] via-[#1d1f26] to-[#17181d] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#c5a880]/15 border border-[#c5a880]/30 flex items-center justify-center">
              <Award className="w-5 h-5 text-[#c5a880]" />
            </div>
            <div>
              <span className="text-[10px] font-mono-spec tracking-widest uppercase text-[#c5a880]">
                PATRON LOYALTY PRIVILEGE
              </span>
              <h2 className="font-serif-brand text-xl sm:text-2xl font-bold text-white">
                PRYZM Architects Club
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patron Points Balance & Tier Status */}
        <div className="px-6 py-4 bg-[#191a20] border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] text-neutral-400 uppercase tracking-wider">
              Available Foundry Balance
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-mono-spec font-bold text-white">{pointsBalance}</span>
              <span className="text-xs text-[#c5a880] font-mono-spec">POINTS</span>
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">
              Earn 10 points per $1 on every hand-cast architectural commission
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#121316] px-3 py-1.5 rounded-lg border border-neutral-800">
            <Shield className="w-4 h-4 text-[#c5a880]" />
            <div className="text-right">
              <div className="text-[9px] uppercase tracking-wider text-neutral-500">Tier Status</div>
              <div className="text-xs font-semibold text-neutral-200">Guild Fellow</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-800 px-6 bg-[#16171b]">
          <button
            type="button"
            onClick={() => setHistoryTab('rewards')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
              historyTab === 'rewards'
                ? 'border-[#c5a880] text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Points Redemption Store</span>
          </button>

          <button
            type="button"
            onClick={() => setHistoryTab('ledger')}
            className={`py-3 px-4 text-xs font-medium border-b-2 transition-colors flex items-center gap-2 ${
              historyTab === 'ledger'
                ? 'border-[#c5a880] text-white font-semibold'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <History className="w-3.5 h-3.5 text-neutral-400" />
            <span>Activity Ledger</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {historyTab === 'rewards' ? (
            <div className="space-y-3">
              <p className="text-xs text-neutral-400 mb-2">
                Convert your accumulated patron points into active checkout discount codes. Redeemed vouchers are immediately loaded into your shopping bag.
              </p>

              {REWARD_COUPONS.map((coupon) => {
                const canAfford = pointsBalance >= coupon.pointsCost;
                const isCurrentActive = activeCouponCode === coupon.code || redeemedCode === coupon.code;

                return (
                  <div
                    key={coupon.code}
                    className={`p-4 rounded-lg border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isCurrentActive
                        ? 'border-emerald-500/60 bg-emerald-950/20'
                        : canAfford
                        ? 'border-neutral-800 bg-[#18191e] hover:border-neutral-700'
                        : 'border-neutral-800/60 bg-[#141518]/50 opacity-60'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-[#c5a880]" />
                        <span className="font-semibold text-white text-sm">{coupon.label}</span>
                        {isCurrentActive && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-mono-spec">
                            Active in Checkout
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 max-w-md">{coupon.description}</p>
                      <div className="text-[11px] text-neutral-500 font-mono-spec">
                        Code: <span className="text-neutral-300 font-semibold">{coupon.code}</span> · Min Spend: ${coupon.minSpendUSD}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 sm:flex-col sm:items-end flex-shrink-0">
                      <div className="font-mono-spec text-sm font-bold text-[#c5a880]">
                        {coupon.pointsCost} <span className="text-xs text-neutral-400">PTS</span>
                      </div>

                      <button
                        type="button"
                        disabled={!canAfford || isCurrentActive}
                        onClick={() => handleRedeem(coupon)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-colors ${
                          isCurrentActive
                            ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 cursor-default'
                            : canAfford
                            ? 'bg-[#c5a880] hover:bg-[#b89a70] text-black shadow'
                            : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                        }`}
                      >
                        {isCurrentActive ? 'Applied' : canAfford ? 'Redeem & Apply' : 'Insufficient Points'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-xs text-neutral-400">Recent Points Accrual & Redemption Events:</div>
              <div className="divide-y divide-neutral-800 border border-neutral-800 rounded-lg overflow-hidden bg-[#18191e]">
                {pointsHistory.map((item) => (
                  <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-medium text-neutral-200">{item.reason}</div>
                      <div className="text-[10px] text-neutral-500 font-mono-spec mt-0.5">{item.date}</div>
                    </div>
                    <div className="font-mono-spec text-emerald-400 font-semibold text-right">
                      +{item.amount} PTS
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#111215] border-t border-neutral-800 flex justify-between items-center text-xs text-neutral-400">
          <span>Points never expire for active patrons.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs transition-colors"
          >
            Return to Store
          </button>
        </div>

      </div>
    </div>
  );
};
