import React, { useState } from 'react';
import { CountryInfo, CartItem, RegisteredUser } from '../types';
import { COUNTRIES } from '../data/mockData';
import { ShoppingBag, Globe, Shield, Scale, MapPin, KeyRound, Menu, X, Headphones, User, Sparkles, UserCheck } from 'lucide-react';

interface NavbarProps {
  country: CountryInfo;
  onSelectCountry: (c: CountryInfo) => void;
  cartCount: number;
  totalWeightKg: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenVIP: () => void;
  onOpenTracker: () => void;
  onOpenWorldModal: () => void;
  currentUser?: RegisteredUser | null;
  onOpenSignUp: () => void;
  onOpenSupport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  country,
  onSelectCountry,
  cartCount,
  totalWeightKg,
  onOpenCart,
  onOpenAdmin,
  onOpenVIP,
  onOpenTracker,
  onOpenWorldModal,
  currentUser,
  onOpenSignUp,
  onOpenSupport
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState<boolean>(false);
  const [countrySearch, setCountrySearch] = useState<string>('');

  return (
    <header className="sticky top-0 z-40 w-full bg-[#121316]/95 backdrop-blur-md border-b border-neutral-800/80">
      
      {/* Top Single Dismissible Announcement Bar (Complimentary Freight info) */}
      <div className="bg-[#18191e] border-b border-neutral-800/60 px-4 py-1.5 text-center text-[11px] font-mono-spec text-neutral-400 flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#c5a880]" />
        <span>Strict Cash on Delivery (COD) Exclusivity · Doorstep Inspection Guarantee</span>
        <span className="hidden sm:inline text-neutral-600">|</span>
        <button
          type="button"
          onClick={onOpenSupport}
          className="text-[#c5a880] hover:underline flex items-center gap-1 font-mono-spec"
        >
          <Headphones className="w-3 h-3" />
          <span>Report Issue & Support</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Zone 1: Single Line Brand Title */}
        <a href="#" className="font-serif-brand text-xl sm:text-2xl font-bold tracking-widest text-white hover:text-[#c5a880] transition-colors">
          PRYZM
        </a>

        {/* Zone 2: 4-6 Clean Text Nav Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs uppercase tracking-wider font-medium text-neutral-400">
          <a href="#collection" className="hover:text-white transition-colors">
            Collection
          </a>
          <a href="#configurator" className="hover:text-white transition-colors">
            Bespoke Studio
          </a>
          <a href="#community" className="hover:text-white transition-colors">
            Patron Spaces
          </a>
          <button
            type="button"
            onClick={onOpenVIP}
            className="hover:text-[#c5a880] transition-colors"
          >
            VIP Guild
          </button>
          <button
            type="button"
            onClick={onOpenTracker}
            className="hover:text-white transition-colors"
          >
            Track Order
          </button>
          <button
            type="button"
            onClick={onOpenSupport}
            className="text-neutral-300 hover:text-white transition-colors flex items-center gap-1"
          >
            <Headphones className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Support</span>
          </button>
        </nav>

        {/* Zone 3: Actions (Sign Up / User, Country Selector, Shopping Bag, Admin) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Sign Up / Patron Badge */}
          {currentUser ? (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#1a1b22] border border-emerald-800/40 rounded text-xs text-emerald-300 font-mono-spec">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[100px]">{currentUser.fullName || currentUser.email.split('@')[0]}</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenSignUp}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#18191e] hover:bg-[#22242a] text-xs font-medium text-neutral-200 border border-neutral-700 transition-colors"
              title="Sign Up & Receive +250 VIP Points"
            >
              <Sparkles className="w-3 h-3 text-[#c5a880]" />
              <span className="hidden sm:inline">Sign Up</span>
              <span className="text-[10px] text-[#c5a880] font-mono-spec hidden md:inline">+250 Pts</span>
            </button>
          )}

          {/* Country / Currency Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsCountryDropdownOpen(!isCountryDropdownOpen);
                setCountrySearch('');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-[#18191e] hover:bg-[#22242a] text-xs text-neutral-300 border border-neutral-800 transition-colors"
              title="Select Target Region, Language & Currency"
            >
              <span>{country.flag}</span>
              <span className="font-mono-spec font-medium">{country.currency}</span>
              <span className="text-[10px] text-neutral-500 font-mono-spec hidden sm:inline">({country.symbol})</span>
            </button>

            {isCountryDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-[#16171a] border border-neutral-800 rounded-lg shadow-2xl py-2 z-50 animate-in fade-in">
                <div className="px-3 pb-2 border-b border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase font-mono-spec text-neutral-400">
                    <span>World Countries ({COUNTRIES.length})</span>
                    <span className="text-[#c5a880]">{country.currency} · {country.languageName}</span>
                  </div>
                  <input
                    type="text"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    placeholder="Search country, currency, or language..."
                    autoFocus
                    className="w-full bg-[#111215] border border-neutral-700 focus:border-[#c5a880] rounded px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 outline-none"
                  />
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-neutral-800/40">
                  {COUNTRIES.filter((c) => {
                    if (!countrySearch.trim()) return true;
                    const q = countrySearch.toLowerCase();
                    return (
                      c.name.toLowerCase().includes(q) ||
                      c.currency.toLowerCase().includes(q) ||
                      c.languageName.toLowerCase().includes(q) ||
                      c.code.toLowerCase().includes(q)
                    );
                  }).map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        onSelectCountry(c);
                        setIsCountryDropdownOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#202228] transition-colors ${
                        country.code === c.code ? 'bg-[#22242c] text-[#c5a880] font-semibold' : 'text-neutral-300'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{c.flag}</span>
                          <span className="truncate">{c.name}</span>
                        </div>
                        <div className="text-[10px] text-neutral-500 pl-6 truncate">
                          Lang: {c.languageName}
                        </div>
                      </div>

                      <div className="text-right font-mono-spec flex-shrink-0">
                        <span className="text-xs text-white">{c.currency}</span>
                        <span className="text-[10px] text-neutral-400 ml-1">({c.symbol})</span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="p-2 border-t border-neutral-800 bg-[#121316]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsCountryDropdownOpen(false);
                      onOpenWorldModal();
                    }}
                    className="w-full py-1.5 px-2 text-center text-[11px] font-mono-spec text-[#c5a880] hover:text-white bg-[#191a20] hover:bg-[#22242c] rounded border border-neutral-800 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Browse All World Countries ({COUNTRIES.length})</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Shopping Bag Button */}
          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3 py-1.5 bg-[#c5a880] hover:bg-[#b89a70] text-black rounded text-xs font-semibold uppercase tracking-wider transition-colors shadow"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Bag</span>
            <span className="bg-black text-white text-[10px] font-mono-spec px-1.5 py-0.2 rounded-full">
              {cartCount}
            </span>
          </button>

          {/* Admin RBAC Trigger */}
          <button
            type="button"
            onClick={onOpenAdmin}
            className="p-2 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
            title="Studio Admin Console (Passcode: PRYZM2026)"
          >
            <KeyRound className="w-4 h-4 text-neutral-400 hover:text-[#c5a880]" />
          </button>

          {/* Mobile Menu Hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 md:hidden text-neutral-400 hover:text-white rounded"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* Mobile Nav Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#16171b] border-b border-neutral-800 px-6 py-4 space-y-3 text-xs uppercase tracking-wider">
          <a
            href="#collection"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-neutral-300 hover:text-white py-1"
          >
            Collection
          </a>
          <a
            href="#configurator"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-neutral-300 hover:text-white py-1"
          >
            Bespoke Studio
          </a>
          <a
            href="#community"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block text-neutral-300 hover:text-white py-1"
          >
            Patron Spaces
          </a>
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenVIP();
            }}
            className="block text-[#c5a880] py-1 text-left w-full"
          >
            VIP Architects Guild
          </button>
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenTracker();
            }}
            className="block text-neutral-300 hover:text-white py-1 text-left w-full"
          >
            Track Order
          </button>
          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenSupport();
            }}
            className="block text-[#c5a880] py-1 text-left w-full flex items-center gap-1.5"
          >
            <Headphones className="w-3.5 h-3.5" />
            <span>Report Issue & Support</span>
          </button>
          {!currentUser && (
            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenSignUp();
              }}
              className="block text-white bg-[#1a1b22] px-3 py-2 rounded text-left w-full mt-2 font-semibold flex items-center justify-between"
            >
              <span>Join Guild & Sign Up</span>
              <span className="text-[#c5a880] font-mono-spec text-[10px]">+250 Pts</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};
