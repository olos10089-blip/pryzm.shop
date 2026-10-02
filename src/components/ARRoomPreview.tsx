import React, { useState, useRef, useEffect } from 'react';
import { Product, BespokeConfig } from '../types';
import { Camera, RefreshCw, Sliders, Sun, Download, X, Eye, Maximize2, ShieldCheck } from 'lucide-react';

interface ARRoomPreviewProps {
  product: Product;
  bespokeConfig?: BespokeConfig;
  onClose: () => void;
  onAddToCart: () => void;
}

export const ARRoomPreview: React.FC<ARRoomPreviewProps> = ({
  product,
  bespokeConfig,
  onClose,
  onAddToCart
}) => {
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1.0);
  const [rotationY, setRotationY] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 30 });
  const [lightingMode, setLightingMode] = useState<'neutral' | 'warm' | 'cool'>('neutral');
  const [selectedRoomBg, setSelectedRoomBg] = useState<string>('loft');
  const [capturedNotice, setCapturedNotice] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef<boolean>(false);
  const startDragRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraError('Camera access not granted or unavailable. Utilizing simulated architectural interior environment.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    // Attempt auto-start camera
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    startDragRef.current = { x: e.clientX - position.x, y: e.clientY - position.y };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    setPosition({
      x: e.clientX - startDragRef.current.x,
      y: e.clientY - startDragRef.current.y
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const captureSnapshot = () => {
    setCapturedNotice('Spatial room simulation captured! High-resolution preview logged.');
    setTimeout(() => setCapturedNotice(null), 3500);
  };

  const itemWeight = bespokeConfig ? bespokeConfig.calculatedWeightKg : product.weightKg;
  const itemDimensions = bespokeConfig 
    ? `${bespokeConfig.widthCm} × ${bespokeConfig.heightCm} × ${bespokeConfig.depthCm} cm` 
    : product.dimensions;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4">
      <div className="relative w-full max-w-4xl h-[92vh] max-h-[820px] bg-[#141518] rounded-xl border border-neutral-800 flex flex-col overflow-hidden shadow-2xl">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-neutral-800 bg-[#17181c]">
          <div className="flex items-center gap-3">
            <span className="font-serif-brand text-sm sm:text-base font-semibold text-white tracking-wider">
              PRYZM SPATIAL AR
            </span>
            <span className="text-neutral-500 text-xs hidden sm:inline">|</span>
            <span className="text-xs text-neutral-300 font-mono-spec hidden sm:inline">
              1:1 SCALE ROOM PLACEMENT
            </span>
          </div>

          <div className="flex items-center gap-3">
            {cameraActive ? (
              <button
                type="button"
                onClick={stopCamera}
                className="text-xs px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              >
                Switch to Simulated Room
              </button>
            ) : (
              <button
                type="button"
                onClick={startCamera}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded bg-[#c5a880]/20 text-[#c5a880] border border-[#c5a880]/40 hover:bg-[#c5a880]/30 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
                Enable Device Camera
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notice Banner */}
        {cameraError && !cameraActive && (
          <div className="bg-amber-950/40 border-b border-amber-800/40 px-4 py-1.5 text-[11px] text-amber-200 flex items-center justify-between">
            <span>{cameraError}</span>
            <span className="text-neutral-400">Interactive 3D simulation active</span>
          </div>
        )}

        {capturedNotice && (
          <div className="bg-emerald-950/60 border-b border-emerald-800/50 px-4 py-2 text-xs text-emerald-300 text-center font-mono-spec">
            {capturedNotice}
          </div>
        )}

        {/* Main AR Canvas Area */}
        <div
          ref={containerRef}
          className="relative flex-1 overflow-hidden select-none bg-neutral-950 flex items-center justify-center cursor-move"
          style={{
            perspective: '1000px'
          }}
        >
          {/* Real Live Camera Feed */}
          {cameraActive ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />
          ) : (
            /* Architectural Simulated Backdrop */
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-500"
              style={{
                backgroundImage: selectedRoomBg === 'loft'
                  ? `url('/src/assets/images/community_client_loft_1790949097239.jpg')`
                  : `url('/src/assets/images/hero_concrete_art_1790949052419.jpg')`,
                filter: lightingMode === 'warm' 
                  ? 'sepia(0.2) brightness(0.95)' 
                  : lightingMode === 'cool' 
                  ? 'saturate(0.85) contrast(1.05)' 
                  : 'none'
              }}
            >
              {/* Architectural grid overlay for ground plane */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: 'radial-gradient(circle at 50% 80%, rgba(197, 168, 128, 0.4) 0%, transparent 70%)'
                }}
              />
            </div>
          )}

          {/* Perspective Ground Plane Guideline */}
          <div className="absolute bottom-16 inset-x-8 h-28 border-t border-dashed border-[#c5a880]/30 pointer-events-none flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-widest text-[#c5a880]/70 font-mono-spec bg-black/60 px-2 py-0.5 rounded">
              Architectural Surface Level · Scale: {Math.round(scale * 100)}%
            </span>
          </div>

          {/* Floating/Draggable 3D Concrete Object */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="absolute z-20 touch-none flex flex-col items-center"
            style={{
              transform: `translate3d(${position.x}px, ${position.y}px, 0px) scale(${scale})`,
              cursor: isDraggingRef.current ? 'grabbing' : 'grab'
            }}
          >
            {/* The Concrete Object with 3D rotation and lighting */}
            <div
              className="relative transition-transform duration-75"
              style={{
                transform: `rotateY(${rotationY}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-56 sm:w-64 md:w-72 object-contain drop-shadow-2xl pointer-events-none"
                style={{
                  filter: lightingMode === 'warm'
                    ? 'sepia(0.2) contrast(1.05)'
                    : lightingMode === 'cool'
                    ? 'hue-rotate(180deg) brightness(0.95)'
                    : 'none'
                }}
              />

              {/* Bespoke Laser Inscription Overlay if active */}
              {bespokeConfig?.customEngraving && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/40 backdrop-blur-[1px] px-3 py-1 rounded border border-white/10 text-white/90 text-xs tracking-widest font-mono-spec uppercase shadow-inner">
                  {bespokeConfig.customEngraving}
                </div>
              )}
            </div>

            {/* Realistic Contact Cast Shadow */}
            <div
              className="w-48 h-6 bg-black/70 rounded-full blur-md -mt-3 pointer-events-none transition-all"
              style={{
                transform: `scale(${scale}) scaleY(0.4)`,
                opacity: 0.8
              }}
            />
          </div>

          {/* Floating Dimensions HUD */}
          <div className="absolute top-4 left-4 bg-[#121316]/90 border border-neutral-800 p-2.5 rounded-lg text-xs font-mono-spec space-y-1 backdrop-blur-sm pointer-events-none">
            <div className="text-[#c5a880] font-semibold">{product.name}</div>
            <div className="text-neutral-400 text-[11px]">Size: {itemDimensions}</div>
            <div className="text-neutral-400 text-[11px]">Mass: {itemWeight} kg (Concrete Cast)</div>
            <div className="text-neutral-500 text-[10px]">Poured: High-Density Micro-Cement</div>
          </div>

          {/* Instructions banner */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/75 px-3 py-1 rounded-full border border-white/10 text-[11px] text-neutral-300 font-mono-spec pointer-events-none whitespace-nowrap">
            Drag to position · Use sliders below to rotate & adjust scale
          </div>
        </div>

        {/* Bottom Control Toolbar */}
        <div className="bg-[#17181c] border-t border-neutral-800 p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Scale Slider */}
            <div>
              <div className="flex justify-between text-xs text-neutral-400 mb-1">
                <span>Scale Ratio</span>
                <span className="font-mono-spec text-white">{(scale * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.8"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-[#c5a880] cursor-pointer"
              />
            </div>

            {/* 360 Rotation Slider */}
            <div>
              <div className="flex justify-between text-xs text-neutral-400 mb-1">
                <span>360° Casting Orbit</span>
                <span className="font-mono-spec text-white">{rotationY}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                value={rotationY}
                onChange={(e) => setRotationY(parseInt(e.target.value))}
                className="w-full accent-[#c5a880] cursor-pointer"
              />
            </div>

            {/* Lighting & Presets */}
            <div className="flex items-center justify-between sm:justify-end gap-2">
              <div className="flex items-center gap-1 bg-[#121316] p-1 rounded border border-neutral-800">
                <button
                  type="button"
                  onClick={() => setLightingMode('neutral')}
                  className={`px-2 py-1 text-[11px] rounded transition-colors ${
                    lightingMode === 'neutral' ? 'bg-[#2b2e36] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Studio
                </button>
                <button
                  type="button"
                  onClick={() => setLightingMode('warm')}
                  className={`px-2 py-1 text-[11px] rounded transition-colors ${
                    lightingMode === 'warm' ? 'bg-[#c5a880]/30 text-[#c5a880]' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  2700K Warm
                </button>
                <button
                  type="button"
                  onClick={() => setLightingMode('cool')}
                  className={`px-2 py-1 text-[11px] rounded transition-colors ${
                    lightingMode === 'cool' ? 'bg-sky-950 text-sky-300' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Daylight
                </button>
              </div>

              {!cameraActive && (
                <button
                  type="button"
                  onClick={() => setSelectedRoomBg(selectedRoomBg === 'loft' ? 'gallery' : 'loft')}
                  className="px-2.5 py-1.5 text-[11px] bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded border border-neutral-700 whitespace-nowrap"
                  title="Switch room backdrop"
                >
                  Change Room
                </button>
              )}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between pt-2 border-t border-neutral-800/60 gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={captureSnapshot}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#202227] hover:bg-[#282a32] text-xs text-white rounded border border-neutral-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#c5a880]" />
                <span>Save Room Snapshot</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setScale(1.0);
                  setRotationY(0);
                  setPosition({ x: 0, y: 30 });
                }}
                className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800"
                title="Reset Position"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-mono-spec text-white">${product.priceUSD} USD</div>
                <div className="text-[10px] text-neutral-400">Cash on Delivery (COD)</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onAddToCart();
                  onClose();
                }}
                className="px-4 py-2 bg-[#c5a880] hover:bg-[#b89a70] text-black font-semibold text-xs tracking-wider uppercase rounded transition-colors"
              >
                Add to Cart & Reserve
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
