import React, { useState, useMemo } from 'react';
import { BespokeConfig, CartItem, Product, CountryInfo } from '../types';
import { formatPrice } from '../utils/formatters';
import { Eye, Sliders, Sparkles, Layers, Box, Check, RefreshCw } from 'lucide-react';

interface BespokeConfiguratorProps {
  country: CountryInfo;
  onAddToCart: (item: CartItem) => void;
  onLaunchAR: (mockProduct: Product, config: BespokeConfig) => void;
}

export const BespokeConfigurator: React.FC<BespokeConfiguratorProps> = ({
  country,
  onAddToCart,
  onLaunchAR
}) => {
  const [shape, setShape] = useState<BespokeConfig['shape']>('monolith_plinth');
  const [finishColor, setFinishColor] = useState<BespokeConfig['finishColor']>('raw_brutalist_grey');
  const [texture, setTexture] = useState<BespokeConfig['texture']>('smooth_microcement');
  const [widthCm, setWidthCm] = useState<number>(30);
  const [heightCm, setHeightCm] = useState<number>(45);
  const [depthCm, setDepthCm] = useState<number>(30);
  const [customEngraving, setCustomEngraving] = useState<string>('RESIDENCE IX · 2026');
  const [engravingFont, setEngravingFont] = useState<BespokeConfig['engravingFont']>('serif');
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  // Calculate concrete mass & pricing
  const { weightKg, priceUSD } = useMemo(() => {
    // Volume in liters = (W * H * D) / 1000
    const volumeLiters = (widthCm * heightCm * depthCm) / 1000;
    
    // Hollow architectural casting factor ~ 0.28, density 2.35 kg/L
    let mass = volumeLiters * 2.35 * 0.28;
    if (shape === 'fluted_cylinder') mass *= 0.85;
    if (shape === 'arch_niche') mass *= 0.75;
    if (shape === 'pebble_catchall') mass *= 0.6;
    
    const finalWeight = Math.max(3.2, Number(mass.toFixed(1)));

    // Price formula: Base mold casting fee + material volume + finish premium + engraving
    let basePrice = 180;
    const materialCost = volumeLiters * 3.8;
    const texturePremium = texture === 'brass_terrazzo' ? 85 : texture === 'exposed_aggregate' ? 40 : 0;
    const engravingFee = customEngraving.trim().length > 0 ? 35 : 0;

    const finalPrice = Math.round(basePrice + materialCost + texturePremium + engravingFee);

    return {
      weightKg: finalWeight,
      priceUSD: finalPrice
    };
  }, [shape, finishColor, texture, widthCm, heightCm, depthCm, customEngraving]);

  const currentConfig: BespokeConfig = {
    shape,
    finishColor,
    texture,
    widthCm,
    heightCm,
    depthCm,
    customEngraving: customEngraving.toUpperCase(),
    engravingFont,
    calculatedWeightKg: weightKg,
    priceUSD
  };

  const getShapeName = (s: string) => {
    switch (s) {
      case 'monolith_plinth': return 'Monolith Plinth / Pedestal';
      case 'fluted_cylinder': return 'Fluted Cylindrical Column';
      case 'arch_niche': return 'Brutalist Arch Alcove';
      case 'hexagonal_prism': return 'Hexagonal Stepped Prism';
      case 'pebble_catchall': return 'Organic Pebble Sculptural Tray';
      default: return s;
    }
  };

  const getFinishDetails = (f: string) => {
    switch (f) {
      case 'charcoal_basalt': return { name: 'Charcoal Basalt', color: '#1a1b1f', border: '#2e3038' };
      case 'raw_brutalist_grey': return { name: 'Raw Brutalist Grey', color: '#686a70', border: '#8b8e96' };
      case 'alabaster_chalk': return { name: 'Alabaster Chalk', color: '#d8d7cf', border: '#abaa9f', textColor: '#222' };
      case 'terracotta_blend': return { name: 'Terracotta Clay Cast', color: '#7c4335', border: '#a35a47' };
      case 'obsidian_aggregate': return { name: 'Obsidian Mineral', color: '#0d0e12', border: '#252732' };
      default: return { name: f, color: '#555', border: '#777' };
    }
  };

  // Simulated representative image based on shape
  const getShapeImage = () => {
    if (shape === 'fluted_cylinder') return '/src/assets/images/product_fluted_vessel_1790949065067.jpg';
    if (shape === 'monolith_plinth') return '/src/assets/images/hero_concrete_art_1790949052419.jpg';
    if (shape === 'pebble_catchall') return '/src/assets/images/product_monolith_tray_1790949086812.jpg';
    return '/src/assets/images/product_brutalist_lamp_1790949076221.jpg';
  };

  const handleAddCustomToCart = () => {
    const bespokeItem: CartItem = {
      id: `bespoke-${Date.now()}`,
      productId: `custom-${shape}`,
      productName: `Bespoke ${getShapeName(shape)}`,
      category: 'furniture',
      unitPriceUSD: priceUSD,
      quantity: 1,
      weightKg: weightKg,
      selectedFinish: getFinishDetails(finishColor).name,
      image: getShapeImage(),
      bespokeConfig: currentConfig
    };

    onAddToCart(bespokeItem);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  };

  const handlePreviewAR = () => {
    const mockProduct: Product = {
      id: `custom-preview-${Date.now()}`,
      name: `Bespoke ${getShapeName(shape)}`,
      category: 'furniture',
      priceUSD,
      weightKg,
      dimensions: `${widthCm} × ${heightCm} × ${depthCm} cm`,
      finishOptions: [getFinishDetails(finishColor).name],
      image: getShapeImage(),
      description: `Bespoke concrete sculpture with ${texture} finish.`,
      architecturalNote: 'Reinforced architectural concrete casting.',
      leadTimeDays: 7,
      inStock: true
    };
    onLaunchAR(mockProduct, currentConfig);
  };

  return (
    <div className="bg-[#15161a] border border-neutral-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Module Title */}
      <div className="p-6 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono-spec uppercase tracking-widest text-[#c5a880]">
            BESPOKE ARCHITECTURAL FOUNDRY
          </span>
          <h2 className="font-serif-brand text-2xl sm:text-3xl font-semibold text-white mt-1">
            Custom Concrete Configurator
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm mt-1 max-w-xl">
            Specify customized geometric proportions, mineral pigments, surface aggregate treatments, and deep laser-cut inscriptions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePreviewAR}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#202228] hover:bg-[#282b34] text-neutral-200 border border-neutral-700 rounded-lg text-xs font-medium transition-colors"
          >
            <Eye className="w-4 h-4 text-[#c5a880]" />
            <span>Test Bespoke Scale in AR</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* Left Side: Real-Time Visual Model & Debossing Inscription Preview */}
        <div className="lg:col-span-6 bg-[#0f1013] p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-neutral-800 relative">
          
          {/* Casting Technical Spec HUD */}
          <div className="flex items-center justify-between z-10">
            <div className="text-[11px] font-mono-spec text-neutral-400">
              <span className="text-[#c5a880]">FOUNDRY ORDER:</span> PRY-MOD-2026
            </div>
            <div className="text-[11px] font-mono-spec px-2 py-0.5 rounded bg-black/60 border border-neutral-800 text-neutral-300">
              {widthCm}W × {heightCm}H × {depthCm}D CM
            </div>
          </div>

          {/* Central 3D Visual Studio Preview */}
          <div className="my-8 relative flex items-center justify-center min-h-[300px] select-none">
            {/* Background studio glow */}
            <div
              className="absolute w-64 h-64 rounded-full blur-3xl opacity-30 pointer-events-none transition-colors duration-700"
              style={{ backgroundColor: getFinishDetails(finishColor).color }}
            />

            {/* Architectural Plinth Shadow */}
            <div className="relative flex flex-col items-center">
              <div
                className="relative transition-all duration-300 transform hover:scale-105"
                style={{
                  width: `${Math.min(260, Math.max(160, widthCm * 3.5))}px`,
                  height: `${Math.min(320, Math.max(180, heightCm * 3.5))}px`
                }}
              >
                {/* Simulated concrete material block */}
                <div
                  className="w-full h-full rounded-md shadow-2xl relative overflow-hidden flex flex-col justify-end p-4 border transition-colors duration-500"
                  style={{
                    backgroundColor: getFinishDetails(finishColor).color,
                    borderColor: getFinishDetails(finishColor).border,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
                  }}
                >
                  {/* Subtle surface texture simulation overlay */}
                  <div
                    className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none"
                    style={{
                      backgroundImage: texture === 'brass_terrazzo' 
                        ? 'radial-gradient(circle, #f3d085 1.5px, transparent 1.5px), radial-gradient(circle, #222 2px, transparent 2px)'
                        : texture === 'exposed_aggregate'
                        ? 'radial-gradient(circle, #000 2px, transparent 2px)'
                        : 'none',
                      backgroundSize: '16px 16px'
                    }}
                  />

                  {/* Surface specular lighting facet */}
                  <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

                  {/* Custom Laser Inscription Debossing Preview */}
                  {customEngraving && (
                    <div
                      className={`relative z-10 text-center py-2 px-3 rounded border border-black/20 bg-black/30 backdrop-blur-[2px] shadow-inner transition-all ${
                        engravingFont === 'serif' ? 'font-serif-brand' : engravingFont === 'monospaced' ? 'font-mono-spec' : 'font-sans'
                      }`}
                      style={{
                        color: finishColor === 'alabaster_chalk' ? '#2c2d30' : 'rgba(255,255,255,0.85)',
                        textShadow: finishColor === 'alabaster_chalk' 
                          ? '1px 1px 1px rgba(255,255,255,0.8), -1px -1px 1px rgba(0,0,0,0.3)'
                          : '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 1px rgba(255,255,255,0.2)'
                      }}
                    >
                      <span className="text-[11px] sm:text-xs tracking-widest uppercase font-semibold">
                        {customEngraving}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Realistic Ground Shadow */}
              <div className="w-56 h-4 bg-black/80 rounded-full blur-md -mt-2" />
            </div>
          </div>

          {/* Mass & Delivery Metrics */}
          <div className="grid grid-cols-3 gap-2 bg-[#141518] p-3 rounded-lg border border-neutral-800 text-center">
            <div>
              <div className="text-[10px] uppercase text-neutral-400">Dry Cured Mass</div>
              <div className="text-sm font-mono-spec text-white font-semibold">{weightKg} kg</div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-neutral-400">Freight Grade</div>
              <div className="text-sm font-mono-spec text-[#c5a880]">
                {weightKg > 15 ? 'Reinforced Crate' : 'Courier Box'}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase text-neutral-400">Casting Duration</div>
              <div className="text-sm font-mono-spec text-white">6-8 Days</div>
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Parametric Controls */}
        <div className="lg:col-span-6 p-6 space-y-6 bg-[#15161a]">
          
          {/* 1. Shape Selection */}
          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-neutral-300 block mb-2.5">
              1. Architectural Form
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: 'monolith_plinth', label: 'Monolith Plinth' },
                { id: 'fluted_cylinder', label: 'Fluted Cylinder' },
                { id: 'arch_niche', label: 'Arch Alcove' },
                { id: 'hexagonal_prism', label: 'Hex Prism' },
                { id: 'pebble_catchall', label: 'Pebble Platter' }
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setShape(s.id as any)}
                  className={`px-3 py-2 text-xs rounded text-left border transition-all ${
                    shape === s.id
                      ? 'bg-[#22242b] border-[#c5a880] text-white shadow-sm'
                      : 'bg-[#18191d] border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="font-medium truncate">{s.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Concrete Mineral Pigment */}
          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-neutral-300 block mb-2.5">
              2. Concrete Mineral Pigment
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                'raw_brutalist_grey',
                'charcoal_basalt',
                'alabaster_chalk',
                'terracotta_blend',
                'obsidian_aggregate'
              ].map((f) => {
                const info = getFinishDetails(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFinishColor(f as any)}
                    className={`flex items-center gap-2 p-2 rounded border text-xs text-left transition-all ${
                      finishColor === f
                        ? 'border-[#c5a880] bg-[#22242c] text-white'
                        : 'border-neutral-800 bg-[#18191d] text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0"
                      style={{ backgroundColor: info.color }}
                    />
                    <span className="truncate">{info.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Surface Aggregate Texture */}
          <div>
            <label className="text-xs uppercase tracking-wider font-semibold text-neutral-300 block mb-2.5">
              3. Aggregate & Surface Treatment
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'smooth_microcement', label: 'Smooth Micro-Cement', extra: 'Included' },
                { id: 'exposed_aggregate', label: 'River Stone Aggregate', extra: '+$40' },
                { id: 'brass_terrazzo', label: 'Polished Brass Terrazzo', extra: '+$85' },
                { id: 'pitted_travertine', label: 'Pitted Travertine Texture', extra: 'Included' }
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTexture(t.id as any)}
                  className={`p-2.5 rounded border text-xs text-left transition-all flex justify-between items-center ${
                    texture === t.id
                      ? 'border-[#c5a880] bg-[#22242c] text-white'
                      : 'border-neutral-800 bg-[#18191d] text-neutral-400 hover:text-white'
                  }`}
                >
                  <span className="truncate">{t.label}</span>
                  <span className="text-[10px] text-[#c5a880] font-mono-spec ml-1 flex-shrink-0">{t.extra}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Proportions & Dimensions */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs uppercase tracking-wider font-semibold text-neutral-300">
                4. Proportions (Centimeters)
              </label>
              <span className="text-[11px] font-mono-spec text-neutral-400">
                Volume: {((widthCm * heightCm * depthCm) / 1000).toFixed(1)} L
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Width</span>
                  <span className="font-mono-spec text-white">{widthCm} cm</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="65"
                  value={widthCm}
                  onChange={(e) => setWidthCm(parseInt(e.target.value))}
                  className="w-full accent-[#c5a880] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Height</span>
                  <span className="font-mono-spec text-white">{heightCm} cm</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="90"
                  value={heightCm}
                  onChange={(e) => setHeightCm(parseInt(e.target.value))}
                  className="w-full accent-[#c5a880] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Depth</span>
                  <span className="font-mono-spec text-white">{depthCm} cm</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="65"
                  value={depthCm}
                  onChange={(e) => setDepthCm(parseInt(e.target.value))}
                  className="w-full accent-[#c5a880] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 5. Custom Laser-Engraved Inscription */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs uppercase tracking-wider font-semibold text-neutral-300">
                5. Custom Laser-Engraved Inscription
              </label>
              <span className="text-[11px] text-neutral-400 font-mono-spec">Max 32 chars</span>
            </div>
            
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                maxLength={32}
                value={customEngraving}
                onChange={(e) => setCustomEngraving(e.target.value)}
                placeholder="e.g. STUDIO 401 · ATELIER NORD"
                className="flex-1 bg-[#18191d] border border-neutral-700 focus:border-[#c5a880] rounded px-3 py-2 text-xs text-white uppercase placeholder-neutral-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-400">Typography:</span>
              {(['serif', 'sans', 'monospaced'] as const).map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => setEngravingFont(font)}
                  className={`text-[11px] px-2.5 py-1 rounded border transition-colors ${
                    engravingFont === font
                      ? 'bg-[#c5a880] text-black border-[#c5a880] font-semibold'
                      : 'border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {font === 'serif' ? 'Roman Serif' : font === 'sans' ? 'Brutalist Sans' : 'Technical Mono'}
                </button>
              ))}
            </div>
          </div>

          {/* Final Action Bar with Price & COD Assurance */}
          <div className="pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[11px] text-neutral-400 uppercase tracking-wider">
                Total Custom Casting Quote
              </div>
              <div className="text-2xl font-serif-brand font-semibold text-white">
                {formatPrice(priceUSD, country)}
              </div>
              <div className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                <span>Pay via Cash on Delivery after doorstep inspection</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddCustomToCart}
              className={`px-6 py-3 rounded text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 ${
                addedSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#c5a880] hover:bg-[#b89a70] text-black shadow-lg hover:shadow-[#c5a880]/20'
              }`}
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <span>Commission Bespoke Piece</span>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
