import React, { useState } from 'react';
import { CountryInfo, RegisteredUser } from '../types';
import { COUNTRIES } from '../data/mockData';
import { Mail, Phone, Globe, Shield, Sparkles, Check, X, ArrowRight, User } from 'lucide-react';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountry: CountryInfo;
  onSelectCountry: (c: CountryInfo) => void;
  onRegisterSuccess: (user: RegisteredUser) => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({
  isOpen,
  onClose,
  selectedCountry,
  onSelectCountry,
  onRegisterSuccess
}) => {
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [countryCode, setCountryCode] = useState<string>(selectedCountry.code);
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ email?: string; phone?: string }>({});
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentCountry = COUNTRIES.find((c) => c.code === countryCode) || selectedCountry;

  const handleCountryPick = (c: CountryInfo) => {
    setCountryCode(c.code);
    onSelectCountry(c); // Automatically adjusts store currency and language preferences!
    setIsDropdownOpen(false);
  };

  const validate = () => {
    const errs: { email?: string; phone?: string } = {};
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      errs.email = 'Valid email address is required (e.g. patron@domain.com)';
    }
    if (!phone.trim() || phone.replace(/\D/g, '').length < 6) {
      errs.phone = 'Valid phone number required for courier dispatch and account security';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newUser: RegisteredUser = {
      email: email.trim(),
      phone: phone.trim(),
      countryCode,
      fullName: fullName.trim() || undefined,
      registeredAt: new Date().toISOString()
    };

    onRegisterSuccess(newUser);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  const filteredCountries = COUNTRIES.filter((c) => {
    if (!countrySearch.trim()) return true;
    const q = countrySearch.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.currency.toLowerCase().includes(q) ||
      c.languageName.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-lg bg-[#141518] rounded-xl border border-neutral-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Top Header */}
        <div className="p-6 bg-[#17181c] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#c5a880]/15 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono-spec tracking-widest uppercase text-[#c5a880]">
                FOUNDRY PATRON REGISTRATION
              </span>
              <h2 className="font-serif-brand text-xl font-bold text-white">
                Join the PRYZM Guild
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

        {/* Bonus Incentive Banner */}
        <div className="bg-[#191a20] px-6 py-2.5 border-b border-neutral-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-neutral-300">
            <Sparkles className="w-3.5 h-3.5 text-[#c5a880]" />
            <span>Welcome Patron Privilege: <strong>+250 VIP Points</strong></span>
          </div>
          <span className="text-[10px] font-mono-spec text-[#c5a880]">INSTANT CREDIT</span>
        </div>

        {isSuccess ? (
          <div className="p-10 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-950 border border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
              <Check className="w-7 h-7" />
            </div>
            <h3 className="font-serif-brand text-2xl font-bold text-white">
              Patron Profile Registered
            </h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto">
              Welcome to PRYZM. Your region has been set to <strong>{currentCountry.name}</strong> ({currentCountry.currency}). +250 VIP points have been credited to your foundry balance.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                Full Name / Representative (Optional)
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Elena Rostova"
                  className="w-full bg-[#111215] border border-neutral-700 focus:border-[#c5a880] rounded pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 outline-none"
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="patron@architects.com"
                  className="w-full bg-[#111215] border border-neutral-700 focus:border-[#c5a880] rounded pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 outline-none"
                />
              </div>
              {errors.email && <p className="text-[10px] text-rose-400 mt-1">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1">
                Phone Number (Courier Logistics & Verification) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-3 text-neutral-500" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-[#111215] border border-neutral-700 focus:border-[#c5a880] rounded pl-9 pr-3 py-2.5 text-xs text-white placeholder-neutral-500 outline-none"
                />
              </div>
              {errors.phone && <p className="text-[10px] text-rose-400 mt-1">{errors.phone}</p>}
            </div>

            {/* Country Selection Dropdown (Auto adjusts store currency & language) */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs uppercase tracking-wider text-neutral-400">
                  Target Country & Region *
                </label>
                <span className="text-[10px] text-[#c5a880] font-mono-spec">
                  Auto-updates store currency & language
                </span>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full bg-[#111215] border border-neutral-700 focus:border-[#c5a880] rounded px-3 py-2.5 text-xs text-white flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{currentCountry.flag}</span>
                    <span className="font-semibold">{currentCountry.name}</span>
                    <span className="text-neutral-400 text-[11px]">· {currentCountry.languageName}</span>
                  </div>

                  <div className="text-right font-mono-spec text-[#c5a880]">
                    {currentCountry.currency} ({currentCountry.symbol.trim()})
                  </div>
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#16171b] border border-neutral-700 rounded-lg shadow-2xl z-50 max-h-60 overflow-hidden flex flex-col">
                    <div className="p-2 border-b border-neutral-800">
                      <input
                        type="text"
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder="Search country, currency, or language..."
                        className="w-full bg-[#111215] border border-neutral-700 rounded px-2.5 py-1 text-xs text-white outline-none"
                      />
                    </div>

                    <div className="overflow-y-auto divide-y divide-neutral-800/60 max-h-48">
                      {filteredCountries.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleCountryPick(c)}
                          className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#202228] transition-colors ${
                            c.code === countryCode ? 'bg-[#22242c] text-[#c5a880] font-semibold' : 'text-neutral-300'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{c.flag}</span>
                            <span>{c.name}</span>
                            <span className="text-[10px] text-neutral-500">({c.languageName})</span>
                          </div>
                          <span className="font-mono-spec text-[11px] text-neutral-400">{c.currency}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Dynamic Currency & Language readout */}
              <div className="mt-2 p-2 bg-[#18191e] border border-neutral-800 rounded flex items-center justify-between text-[11px] font-mono-spec text-neutral-400">
                <span>Active Currency: <strong className="text-white">{currentCountry.currency} ({currentCountry.symbol.trim()})</strong></span>
                <span>Language: <strong className="text-white">{currentCountry.languageName}</strong></span>
              </div>
            </div>

            {/* Privacy notice */}
            <p className="text-[10px] text-neutral-500 leading-relaxed pt-1">
              PRYZM never conducts unauthorized telemetry or marketing calls. Phone numbers are utilized exclusively by specialized freight handlers to coordinate secure doorstep uncrating and physical Cash on Delivery verification.
            </p>

            <button
              type="submit"
              className="w-full py-3 bg-[#c5a880] hover:bg-[#b89a70] text-black font-semibold text-xs uppercase tracking-wider rounded transition-colors shadow-lg flex items-center justify-center gap-2"
            >
              <span>Complete Patron Registration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
