import React, { useState } from 'react';
import { Product, CountryInfo, CartItem } from '../types';
import { formatPrice } from '../utils/formatters';
import { Eye, ShoppingBag, ShieldCheck, Scale, Ruler, Sparkles, ArrowRight, X, Check } from 'lucide-react';

interface ProductCatalogProps {
  products: Product[];
  country: CountryInfo;
  onAddToCart: (item: CartItem) => void;
  onLaunchAR: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  country,
  onAddToCart,
  onLaunchAR
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inspectProduct, setInspectProduct] = useState<Product | null>(null);
  const [selectedFinish, setSelectedFinish] = useState<string>('');
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleOpenInspect = (product: Product) => {
    setInspectProduct(product);
    setSelectedFinish(product.finishOptions[0] || 'Default');
  };

  const handleQuickAdd = (product: Product, finish?: string) => {
    const item: CartItem = {
      id: `cart-${product.id}-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      category: product.category,
      unitPriceUSD: product.priceUSD,
      quantity: 1,
      weightKg: product.weightKg,
      selectedFinish: finish || product.finishOptions[0],
      image: product.image
    };

    onAddToCart(item);
    setAddedItemNotice(`Added "${product.name}" to your bag.`);
    setTimeout(() => setAddedItemNotice(null), 3000);
  };

  return (
    <section id="collection" className="py-20 bg-[#121316]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-mono-spec tracking-widest uppercase text-[#c5a880] mb-2">
              ARCHITECTURAL OBJECTS · EDITION 2026
            </div>
            <h2 className="font-serif-brand text-3xl sm:text-4xl font-semibold text-white tracking-tight">
              The Permanent Concrete Collection
            </h2>
            <p className="text-neutral-400 text-sm mt-2 max-w-xl">
              Cast individually from high-density quartz micro-cement. Each sculpture is cured for 7 days in wooden molds, hand-waxed, and verified for structural balance.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#191a20] rounded-lg border border-neutral-800 self-start md:self-auto overflow-x-auto">
            {[
              { id: 'all', label: 'All Pieces' },
              { id: 'vessels', label: 'Vessels' },
              { id: 'lighting', label: 'Lighting' },
              { id: 'furniture', label: 'Furniture' },
              { id: 'decor', label: 'Platters & Art' }
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#c5a880] text-black font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Global Added Notice */}
        {addedItemNotice && (
          <div className="mb-6 p-3 bg-emerald-950/40 border border-emerald-800/50 rounded-lg text-xs text-emerald-300 flex items-center justify-between font-mono-spec animate-in fade-in duration-200">
            <span>{addedItemNotice}</span>
            <span className="text-neutral-400 text-[10px]">Inspect in cart anytime</span>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-[#16171b] border border-neutral-800/90 rounded-xl overflow-hidden flex flex-col hover:border-neutral-700 transition-all duration-300 shadow-xl"
            >
              {/* Product Image Area with AR Overlay Trigger */}
              <div
                onClick={() => handleOpenInspect(product)}
                className="relative h-72 sm:h-80 bg-[#141518] overflow-hidden cursor-pointer flex items-center justify-center p-6"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                />

                {/* Subtle Gradient Backlight */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#16171b] via-transparent to-transparent opacity-60 pointer-events-none" />

                {/* AR View Quick Action Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLaunchAR(product);
                  }}
                  className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 hover:bg-black/90 backdrop-blur-md rounded text-xs text-white border border-white/10 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-[#c5a880]" />
                  <span className="text-[11px] font-mono-spec">View in Room (AR)</span>
                </button>

                {/* Weight Tag */}
                <div className="absolute bottom-3 right-3 text-[10px] font-mono-spec text-neutral-400 bg-black/60 px-2 py-0.5 rounded border border-white/5">
                  {product.weightKg} KG MASS
                </div>
              </div>

              {/* Card Metadata */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono-spec uppercase tracking-widest text-neutral-500">
                      {product.category} · {product.dimensions}
                    </span>
                    <span className="text-[10px] text-emerald-400 font-mono-spec">
                      In Stock · COD Ready
                    </span>
                  </div>

                  <h3
                    onClick={() => handleOpenInspect(product)}
                    className="font-serif-brand text-lg font-semibold text-white group-hover:text-[#c5a880] transition-colors cursor-pointer"
                  >
                    {product.name}
                  </h3>

                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Price & Action Row */}
                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase text-neutral-500 font-mono-spec">
                      Cash on Delivery Price
                    </div>
                    <div className="text-base font-serif-brand font-bold text-white">
                      {formatPrice(product.priceUSD, country)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenInspect(product)}
                      className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 rounded transition-colors"
                    >
                      Inspect
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickAdd(product)}
                      className="px-3.5 py-2 bg-[#c5a880] hover:bg-[#b89a70] text-black text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 shadow"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* INSPECTION DETAIL MODAL */}
      {inspectProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <div className="relative w-full max-w-3xl bg-[#15161a] rounded-xl border border-neutral-800 shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Left Image View */}
            <div className="md:w-1/2 bg-[#0f1013] p-8 flex flex-col justify-between items-center relative border-b md:border-b-0 md:border-r border-neutral-800">
              <div className="w-full flex justify-between items-center z-10">
                <span className="text-[10px] font-mono-spec text-[#c5a880] uppercase tracking-wider">
                  ARCHITECTURAL SPEC SHEET
                </span>
                <span className="text-[10px] font-mono-spec text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded">
                  {inspectProduct.dimensions}
                </span>
              </div>

              <div className="my-auto py-6">
                <img
                  src={inspectProduct.image}
                  alt={inspectProduct.name}
                  referrerPolicy="no-referrer"
                  className="max-h-72 object-contain drop-shadow-2xl"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  onLaunchAR(inspectProduct);
                  setInspectProduct(null);
                }}
                className="w-full py-2 bg-[#22242c] hover:bg-[#2b2e38] text-neutral-200 border border-neutral-700 rounded text-xs font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Eye className="w-4 h-4 text-[#c5a880]" />
                <span>Launch Camera AR Simulation</span>
              </button>
            </div>

            {/* Right Information & Purchase Actions */}
            <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-5 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono-spec tracking-widest text-[#c5a880]">
                      {inspectProduct.category}
                    </span>
                    <h2 className="font-serif-brand text-2xl font-bold text-white mt-1">
                      {inspectProduct.name}
                    </h2>
                  </div>

                  <button
                    onClick={() => setInspectProduct(null)}
                    className="p-1 text-neutral-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-xl font-serif-brand font-semibold text-white">
                  {formatPrice(inspectProduct.priceUSD, country)}
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed">
                  {inspectProduct.description}
                </p>

                {/* Architectural Specifications Table */}
                <div className="p-3 bg-[#18191e] border border-neutral-800 rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-[#c5a880]" />
                      Net Casting Mass:
                    </span>
                    <span className="font-mono-spec text-white">{inspectProduct.weightKg} kg</span>
                  </div>

                  <div className="flex justify-between text-neutral-400">
                    <span className="flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5 text-[#c5a880]" />
                      Physical Dimensions:
                    </span>
                    <span className="font-mono-spec text-white">{inspectProduct.dimensions}</span>
                  </div>

                  <div className="text-[11px] text-neutral-400 pt-1 border-t border-neutral-800/80">
                    {inspectProduct.architecturalNote}
                  </div>
                </div>

                {/* Finish Options */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-2">
                    Select Surface Finish:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {inspectProduct.finishOptions.map((finish) => (
                      <button
                        key={finish}
                        type="button"
                        onClick={() => setSelectedFinish(finish)}
                        className={`px-3 py-1.5 rounded text-xs border transition-colors ${
                          selectedFinish === finish
                            ? 'bg-[#c5a880] text-black border-[#c5a880] font-semibold'
                            : 'bg-[#18191e] border-neutral-700 text-neutral-300 hover:text-white'
                        }`}
                      >
                        {finish}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cash on Delivery Notice */}
                <div className="p-2.5 bg-neutral-900 border border-neutral-800 rounded flex items-center gap-2 text-[11px] text-neutral-400">
                  <ShieldCheck className="w-4 h-4 text-[#c5a880] flex-shrink-0" />
                  <span>Strict COD model: Settle cash in {country.currency} upon door inspection.</span>
                </div>
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={() => {
                  handleQuickAdd(inspectProduct, selectedFinish);
                  setInspectProduct(null);
                }}
                className="w-full py-3 bg-[#c5a880] hover:bg-[#b89a70] text-black font-semibold text-xs uppercase tracking-wider rounded transition-colors shadow-lg mt-4 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Reserve with Cash on Delivery</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};
