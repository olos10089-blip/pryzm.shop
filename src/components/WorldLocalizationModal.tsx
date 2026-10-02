import React, { useState, useMemo } from 'react';
import { CountryInfo } from '../types';
import { COUNTRIES } from '../data/mockData';
import { Search, Globe, X, Check, ArrowRight, DollarSign } from 'lucide-react';
import { formatPrice } from '../utils/formatters';

interface WorldLocalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountry: CountryInfo;
  onSelectCountry: (c: CountryInfo) => void;
}

export const WorldLocalizationModal: React.FC<WorldLocalizationModalProps> = ({
  isOpen,
  onClose,
  selectedCountry,
  onSelectCountry
}) => {
  const [search, setSearch] = useState<string>('');
  const [regionFilter, setRegionFilter] = useState<string>('all');

  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter((c) => {
      const q = search.toLowerCase().trim();
      const matchesSearch = !q || (
        c.name.toLowerCase().includes(q) ||
        c.currency.toLowerCase().includes(q) ||
        c.languageName.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
      );

      if (!matchesSearch) return false;

      if (regionFilter === 'all') return true;
      if (regionFilter === 'europe') {
        return ['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'CH', 'SE', 'NO', 'DK', 'FI', 'BE', 'AT', 'IE', 'PT', 'GR', 'PL', 'CZ', 'HU', 'RO', 'HR', 'LU', 'MC', 'IS', 'CY', 'MT', 'EE', 'LV', 'LT', 'SK', 'SI', 'BG', 'RS', 'UA'].includes(c.code);
      }
      if (regionFilter === 'americas') {
        return ['US', 'CA', 'MX', 'BS', 'BB', 'JM', 'TT', 'CR', 'PA', 'DO', 'PR', 'GT', 'BR', 'AR', 'CL', 'CO', 'PE', 'UY', 'EC'].includes(c.code);
      }
      if (regionFilter === 'middle_east') {
        return ['AE', 'SA', 'QA', 'KW', 'BH', 'OM', 'JO', 'LB', 'TR', 'IL', 'EG', 'MA'].includes(c.code);
      }
      if (regionFilter === 'asia_pacific') {
        return ['JP', 'CN', 'KR', 'SG', 'HK', 'TW', 'IN', 'ID', 'MY', 'TH', 'VN', 'PH', 'PK', 'BD', 'LK', 'AU', 'NZ', 'FJ'].includes(c.code);
      }
      if (regionFilter === 'africa') {
        return ['ZA', 'NG', 'KE', 'GH', 'TN', 'DZ', 'MU', 'SC', 'EG', 'MA'].includes(c.code);
      }
      return true;
    });
  }, [search, regionFilter]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5">
      <div className="relative w-full max-w-4xl bg-[#141518] rounded-xl border border-neutral-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#17181c] border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#c5a880]/15 border border-[#c5a880]/30 flex items-center justify-center text-[#c5a880]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono-spec tracking-widest uppercase text-[#c5a880]">
                GLOBAL LOCALIZATION & EXCHANGE DIRECTORY
              </span>
              <h2 className="font-serif-brand text-xl sm:text-2xl font-bold text-white">
                World Countries, Languages & Currencies
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

        {/* Search & Region Filter Bar */}
        <div className="p-4 bg-[#191a20] border-b border-neutral-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search any country name, primary language, or currency code (e.g. Norway, JPY, Español, د.إ)..."
              autoFocus
              className="w-full bg-[#111215] border border-neutral-700 focus:border-[#c5a880] rounded pl-9 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {[
              { id: 'all', label: `All Countries (${COUNTRIES.length})` },
              { id: 'europe', label: 'Europe' },
              { id: 'middle_east', label: 'Middle East & GCC' },
              { id: 'americas', label: 'Americas' },
              { id: 'asia_pacific', label: 'Asia & Oceania' },
              { id: 'africa', label: 'Africa' }
            ].map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRegionFilter(r.id)}
                className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap transition-colors ${
                  regionFilter === r.id
                    ? 'bg-[#c5a880] text-black font-semibold'
                    : 'bg-[#15161a] text-neutral-400 hover:text-white border border-neutral-800'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table & Grid of Countries */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0f1013]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCountries.map((c) => {
              const isSelected = selectedCountry.code === c.code;

              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onSelectCountry(c);
                    onClose();
                  }}
                  className={`p-3.5 rounded-lg border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'border-[#c5a880] bg-[#22242c] shadow-lg shadow-[#c5a880]/10'
                      : 'border-neutral-800 bg-[#16171b] hover:border-neutral-700 hover:bg-[#1b1d22]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{c.flag}</span>
                      <div>
                        <div className="text-xs font-semibold text-white truncate max-w-[170px]">
                          {c.name}
                        </div>
                        <div className="text-[10px] text-neutral-400 truncate max-w-[170px]">
                          {c.languageName}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="px-1.5 py-0.5 rounded bg-[#c5a880] text-black text-[9px] font-mono-spec font-bold flex items-center gap-0.5 flex-shrink-0">
                        <Check className="w-2.5 h-2.5" /> ACTIVE
                      </span>
                    )}
                  </div>

                  <div className="pt-3 mt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono-spec">
                    <div>
                      <span className="text-neutral-500 text-[10px] uppercase block">Currency</span>
                      <span className="text-white font-bold">{c.currency}</span>
                      <span className="text-neutral-400 ml-1">({c.symbol.trim()})</span>
                    </div>

                    <div className="text-right">
                      <span className="text-neutral-500 text-[10px] uppercase block">Sample Rate</span>
                      <span className="text-[#c5a880]">
                        {formatPrice(195, c)}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {filteredCountries.length === 0 && (
            <div className="py-16 text-center text-neutral-500 text-xs">
              No country matching "{search}" found. Try another query.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#141518] border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Active Region: <strong className="text-white">{selectedCountry.flag} {selectedCountry.name}</strong> ({selectedCountry.currency} · {selectedCountry.languageName})</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs transition-colors"
          >
            Close Directory
          </button>
        </div>

      </div>
    </div>
  );
};
