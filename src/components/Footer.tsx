import React from 'react';
import { ShieldCheck, Truck, Scale, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenWorldModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenWorldModal }) => {
  return (
    <footer className="bg-[#0f1013] border-t border-neutral-800 text-neutral-400 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Architectural Principles Adjacency */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-neutral-800/80">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-[#c5a880]" />
              <span>Cash on Delivery Exclusivity</span>
            </div>
            <p className="text-[11px] leading-relaxed text-neutral-400">
              We never hold user card credentials. Every piece is transported via specialized freight and paid directly in physical cash upon door verification.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Truck className="w-4 h-4 text-[#c5a880]" />
              <span>ISPM-15 Certified Crating</span>
            </div>
            <p className="text-[11px] leading-relaxed text-neutral-400">
              Heavy architectural castings over 15kg are suspended inside shock-damped heat-treated timber crates to eliminate transit stress.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Scale className="w-4 h-4 text-[#c5a880]" />
              <span>Fluoropolymer Hydrophobic Seal</span>
            </div>
            <p className="text-[11px] leading-relaxed text-neutral-400">
              Impregnated with breathable microscopic sealants preserving the raw brutalist mineral patina while resisting red wine and botanical stains.
            </p>
          </div>
        </div>

        {/* Links & Brand */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-serif-brand text-lg font-bold text-white tracking-widest">
              PRYZM CONCRETE HOME ART
            </div>
            <p className="text-[11px] text-neutral-500">
              Atelier & Foundry · Fine Architectural Monoliths · Founded 2026
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] font-mono-spec">
            <a href="#collection" className="hover:text-white transition-colors">Catalog</a>
            <a href="#configurator" className="hover:text-white transition-colors">Bespoke Configurator</a>
            <a href="#community" className="hover:text-white transition-colors">Patron Archives</a>
            {onOpenWorldModal && (
              <button
                type="button"
                onClick={onOpenWorldModal}
                className="text-[#c5a880] hover:underline"
              >
                World Currencies & Languages
              </button>
            )}
            <span className="text-neutral-600">·</span>
            <span className="text-neutral-500">COD Freight Protection Active</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t border-neutral-800/40 text-center text-[10px] text-neutral-600 font-mono-spec">
          © 2026 PRYZM Concrete Home Art. All rights reserved. Handcrafted with architectural quartz micro-cement.
        </div>

      </div>
    </footer>
  );
};
