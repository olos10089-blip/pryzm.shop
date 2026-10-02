import React from 'react';
import { ArrowRight, Eye, ShieldCheck, Scale, Sparkles } from 'lucide-react';
import { CountryInfo } from '../types';

interface HeroProps {
  country: CountryInfo;
  onExploreCollection: () => void;
  onOpenConfigurator: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  country,
  onExploreCollection,
  onOpenConfigurator
}) => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#121316] border-b border-neutral-800">
      
      {/* Background Architectural Canvas Image with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_concrete_art_1790949052419.jpg"
          alt="PRYZM Architectural Concrete Sculpture"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-45 scale-105 transition-transform duration-1000"
        />
        {/* Measured Scrim for WCAG AA Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121316] via-[#121316]/75 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#121316] via-[#121316]/60 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          
          {/* Natural Editorial Kicker */}
          <div className="flex items-center gap-2 text-xs font-mono-spec text-[#c5a880] tracking-widest uppercase">
            <span>HAND-CAST ARCHITECTURAL MONOLITHS</span>
            <span aria-hidden="true">·</span>
            <span>FOUNDRY EDITION 2026</span>
          </div>

          {/* Primary Headline with Balance */}
          <h1 className="font-serif-brand text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.08] text-balance">
            Tactile Serenity in Cast Concrete
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed font-light">
            Individually poured, 7-day hydration-cured architectural vessels, monolithic lighting, and pedestals. Delivered directly to your space under our strict Cash on Delivery guarantee.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={onExploreCollection}
              className="px-6 py-3.5 bg-[#c5a880] hover:bg-[#b89a70] text-black font-semibold text-xs uppercase tracking-wider rounded-lg transition-all shadow-xl hover:shadow-[#c5a880]/20 flex items-center gap-2"
            >
              <span>Explore Permanent Collection</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onOpenConfigurator}
              className="px-6 py-3.5 bg-[#1e2026]/90 hover:bg-[#282b34] text-white font-medium text-xs uppercase tracking-wider rounded-lg border border-neutral-700 transition-colors backdrop-blur-sm"
            >
              Parametric Configurator
            </button>
          </div>

          {/* Clean Unboxed Metadata & Trust Rigor (No Pill Capsules!) */}
          <div className="pt-8 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs text-neutral-400">
            <div>
              <span className="block text-white font-mono-spec font-bold text-sm">Strict COD Model</span>
              <span className="text-[11px] text-neutral-400">Doorstep physical inspection prior to cash settlement</span>
            </div>

            <div>
              <span className="block text-white font-mono-spec font-bold text-sm">2.35 g/cm³ Density</span>
              <span className="text-[11px] text-neutral-400">Quartz-aggregate micro-cement with steel rebar core</span>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <span className="block text-white font-mono-spec font-bold text-sm">Spatial AR Preview</span>
              <span className="text-[11px] text-neutral-400">1:1 true scale camera simulation in your interior</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
