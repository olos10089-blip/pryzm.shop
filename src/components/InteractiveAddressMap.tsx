import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Coordinates } from '../types';
import { MapPin, Navigation, ZoomIn, ZoomOut, Compass, CheckCircle2, Crosshair } from 'lucide-react';

interface InteractiveAddressMapProps {
  coordinates: Coordinates;
  onChangeCoordinates: (coords: Coordinates) => void;
  streetAddress: string;
  onAddressChange: (field: string, value: string) => void;
  buildingOrVilla: string;
  floorApartment: string;
  courierDeliveryNotes: string;
}

export const InteractiveAddressMap: React.FC<InteractiveAddressMapProps> = ({
  coordinates,
  onChangeCoordinates,
  streetAddress,
  onAddressChange,
  buildingOrVilla,
  floorApartment,
  courierDeliveryNotes
}) => {
  const [zoom, setZoom] = useState<number>(16);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationSuccess, setLocationSuccess] = useState<string | null>(null);
  const [isDraggingPin, setIsDraggingPin] = useState<boolean>(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Approximate city/street reverse name generator based on coordinates
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationSuccess(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCoords = {
          lat: Number(latitude.toFixed(6)),
          lng: Number(longitude.toFixed(6))
        };
        onChangeCoordinates(newCoords);
        setIsLocating(false);
        setLocationSuccess(`GPS Lock acquired: ±${Math.round(position.coords.accuracy || 10)}m precision`);
        
        // Auto-fill street if empty
        if (!streetAddress) {
          onAddressChange('streetAddress', `Architectural Site @ ${newCoords.lat.toFixed(4)}°N, ${newCoords.lng.toFixed(4)}°W`);
        }
      },
      (error) => {
        setIsLocating(false);
        // Fallback gracefully without breaking
        console.warn('Geolocation access:', error.message);
        setLocationSuccess('Using regional baseline. Click or drag pin to your exact building entrance.');
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Convert map click to coordinate shift relative to center
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Offset from center in pixels
    const offsetX = x - rect.width / 2;
    const offsetY = y - rect.height / 2;

    // Degree conversion factor scaled by zoom level
    const scale = 0.00008 * Math.pow(2, 16 - zoom);
    const newLat = Number((coordinates.lat - offsetY * scale).toFixed(6));
    const newLng = Number((coordinates.lng + offsetX * scale).toFixed(6));

    onChangeCoordinates({ lat: newLat, lng: newLng });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDraggingPin(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingPin || !mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const offsetX = x - rect.width / 2;
    const offsetY = y - rect.height / 2;
    const scale = 0.00008 * Math.pow(2, 16 - zoom);
    
    onChangeCoordinates({
      lat: Number((coordinates.lat - offsetY * scale * 0.1).toFixed(6)),
      lng: Number((coordinates.lng + offsetX * scale * 0.1).toFixed(6))
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDraggingPin(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-4">
      {/* Geolocation Top Action */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#191a1e] p-3 rounded border border-neutral-800">
        <div className="flex items-center gap-2 text-xs text-neutral-300">
          <Compass className="w-4 h-4 text-[#c5a880] animate-pulse" />
          <span>Pinpoint Delivery Entrance (Heavy Freight Pallet Access)</span>
        </div>

        <button
          type="button"
          onClick={handleGetLocation}
          disabled={isLocating}
          className="flex items-center gap-2 px-3 py-1.5 bg-[#252830] hover:bg-[#2e323c] text-white text-xs font-medium rounded transition-colors border border-neutral-700 disabled:opacity-50"
        >
          <Navigation className={`w-3.5 h-3.5 text-[#c5a880] ${isLocating ? 'animate-spin' : ''}`} />
          {isLocating ? 'Detecting GPS...' : 'Allow GPS Geolocation'}
        </button>
      </div>

      {locationSuccess && (
        <div className="text-[11px] text-emerald-400 bg-emerald-950/30 border border-emerald-800/50 p-2 rounded flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{locationSuccess}</span>
        </div>
      )}

      {/* Interactive Map Visualizer */}
      <div className="relative w-full h-64 sm:h-72 rounded-lg overflow-hidden border border-neutral-800 bg-[#0f1013] select-none">
        {/* Architectural Dark Vector Grid & Roads */}
        <div
          ref={mapContainerRef}
          onClick={handleMapClick}
          className="w-full h-full cursor-crosshair relative overflow-hidden"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: `${20 * (zoom / 15)}px ${20 * (zoom / 15)}px`
          }}
        >
          {/* Simulated architectural road layout centered on coordinates */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="city-blocks" width="120" height="120" patternUnits="userSpaceOnUse">
                <rect x="10" y="10" width="45" height="45" fill="#1b1d22" rx="2" />
                <rect x="65" y="10" width="45" height="45" fill="#17181c" rx="2" />
                <rect x="10" y="65" width="45" height="45" fill="#17181c" rx="2" />
                <rect x="65" y="65" width="45" height="45" fill="#1e2026" rx="2" />
                <line x1="0" y1="60" x2="120" y2="60" stroke="#2c2f38" strokeWidth="6" />
                <line x1="60" y1="0" x2="60" y2="120" stroke="#2c2f38" strokeWidth="6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#city-blocks)" />
            {/* Main boulevard */}
            <line x1="0" y1="45%" x2="100%" y2="55%" stroke="#383c47" strokeWidth="12" />
            <line x1="50%" y1="0" x2="50%" y2="100%" stroke="#383c47" strokeWidth="10" />
            {/* Courier transit line */}
            <line x1="20%" y1="20%" x2="80%" y2="80%" stroke="#c5a880" strokeWidth="1" strokeDasharray="4 4" opacity="0.6" />
          </svg>

          {/* Center Coordinates & Radar Ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="w-24 h-24 rounded-full border border-[#c5a880]/20 animate-ping opacity-30" />
            <div className="w-16 h-16 -mt-20 -ml-4 rounded-full border border-[#c5a880]/40" />
          </div>

          {/* Draggable Delivery Pin */}
          <div
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full cursor-grab active:cursor-grabbing transition-transform z-10 ${
              isDraggingPin ? 'scale-125' : 'hover:scale-110'
            }`}
          >
            <div className="relative flex flex-col items-center">
              <div className="bg-[#c5a880] text-black font-mono-spec text-[9px] font-bold px-2 py-0.5 rounded shadow-lg flex items-center gap-1 whitespace-nowrap">
                <Crosshair className="w-2.5 h-2.5" />
                <span>DROP GATE</span>
              </div>
              <MapPin className="w-8 h-8 text-[#c5a880] drop-shadow-[0_4px_12px_rgba(197,168,128,0.5)] fill-[#c5a880]/20 -mt-1" />
              <div className="w-3 h-1.5 bg-black/60 rounded-full blur-[1px] -mt-1" />
            </div>
          </div>
        </div>

        {/* Map Overlay Controls */}
        <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-20">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(19, z + 1))}
            className="w-8 h-8 bg-[#1a1c22]/90 hover:bg-[#242730] text-neutral-200 border border-neutral-700 rounded flex items-center justify-center text-sm shadow transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(12, z - 1))}
            className="w-8 h-8 bg-[#1a1c22]/90 hover:bg-[#242730] text-neutral-200 border border-neutral-700 rounded flex items-center justify-center text-sm shadow transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </div>

        {/* Coordinates HUD */}
        <div className="absolute top-3 left-3 bg-[#121316]/90 border border-neutral-800 px-2.5 py-1 rounded text-[11px] font-mono-spec text-neutral-400 z-20 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>LAT: {coordinates.lat.toFixed(5)}</span>
          <span className="text-neutral-600">|</span>
          <span>LNG: {coordinates.lng.toFixed(5)}</span>
        </div>

        <div className="absolute bottom-3 left-3 text-[10px] text-neutral-400 bg-black/70 px-2 py-0.5 rounded pointer-events-none">
          Click map or drag gold pin to adjust delivery gate
        </div>
      </div>

      {/* Detailed Address Fields Required */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        <div>
          <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
            Street Address & Number *
          </label>
          <input
            type="text"
            required
            value={streetAddress}
            onChange={(e) => onAddressChange('streetAddress', e.target.value)}
            placeholder="e.g. 450 Mission Street / Koenigstrasse 14"
            className="w-full bg-[#18191d] border border-neutral-700 focus:border-[#c5a880] rounded px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
            Building Name / Villa / Residence *
          </label>
          <input
            type="text"
            required
            value={buildingOrVilla}
            onChange={(e) => onAddressChange('buildingOrVilla', e.target.value)}
            placeholder="e.g. Skyline Tower / Villa 24 / Bauhaus Complex"
            className="w-full bg-[#18191d] border border-neutral-700 focus:border-[#c5a880] rounded px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
            Floor, Suite or Apartment Number *
          </label>
          <input
            type="text"
            required
            value={floorApartment}
            onChange={(e) => onAddressChange('floorApartment', e.target.value)}
            placeholder="e.g. Floor 12, Penthouse B / Ground Floor Studio"
            className="w-full bg-[#18191d] border border-neutral-700 focus:border-[#c5a880] rounded px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-[11px] uppercase tracking-wider text-neutral-400 mb-1">
            Freight & Gate Access Notes
          </label>
          <input
            type="text"
            value={courierDeliveryNotes}
            onChange={(e) => onAddressChange('courierDeliveryNotes', e.target.value)}
            placeholder="e.g. Freight elevator passcode #4920, security call required"
            className="w-full bg-[#18191d] border border-neutral-700 focus:border-[#c5a880] rounded px-3 py-2 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
          />
        </div>
      </div>
    </div>
  );
};
