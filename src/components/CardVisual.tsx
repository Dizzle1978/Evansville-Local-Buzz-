import React, { useState } from 'react';

interface CardVisualProps {
  theme: 'river' | 'arena' | 'historic' | 'civic' | 'traffic' | 'weather' | 'food' | 'community';
  title?: string;
  imageUrl?: string;
  imageCaption?: string;
  className?: string;
}

export const CardVisual: React.FC<CardVisualProps> = ({
  theme,
  title,
  imageUrl,
  imageCaption,
  className = 'h-48 sm:h-52',
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  // If a valid image URL is provided and has not failed, render the authentic local image with fallback protection
  if (imageUrl && !imageFailed) {
    return (
      <div className={`relative w-full overflow-hidden bg-stone-900 ${className} group`}>
        <img
          src={imageUrl}
          alt={title || 'Evansville area photograph'}
          referrerPolicy="no-referrer"
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Measured gradient scrim for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent pointer-events-none" />

        {/* Location & Photo source overlay tag */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between pointer-events-none">
          <div className="text-white text-xs font-bold drop-shadow-md truncate pr-2">
            {imageCaption || title || 'Evansville Local Area'}
          </div>
          <span className="text-[10px] font-mono text-amber-200/90 bg-stone-950/70 px-1.5 py-0.5 rounded backdrop-blur-xs shrink-0">
            Local View
          </span>
        </div>
      </div>
    );
  }

  // Graceful domain-authentic landmark fallback
  switch (theme) {
    case 'river':
      return (
        <div className={`relative w-full overflow-hidden bg-gradient-to-br from-cyan-950 via-sky-900 to-stone-950 flex items-center justify-center ${className}`}>
          <svg className="absolute inset-0 w-full h-full opacity-35" preserveAspectRatio="none" viewBox="0 0 400 200">
            <path d="M0,150 Q100,120 200,160 T400,130 L400,200 L0,200 Z" fill="#0284c7" />
            <path d="M0,165 Q120,140 240,175 T400,155 L400,200 L0,200 Z" fill="#0369a1" />
            <line x1="60" y1="50" x2="60" y2="160" stroke="#bae6fd" strokeWidth="2.5" />
            <line x1="140" y1="50" x2="140" y2="160" stroke="#bae6fd" strokeWidth="2.5" />
            <path d="M10,130 Q60,70 100,130 Q140,70 190,130" fill="none" stroke="#e0f2fe" strokeWidth="1.5" />
            <line x1="0" y1="130" x2="220" y2="130" stroke="#bae6fd" strokeWidth="2" />
          </svg>
          <div className="relative z-10 flex flex-col items-center text-center px-4">
            <span className="text-xs uppercase tracking-widest font-black text-cyan-200">Ohio Riverfront Corridor</span>
            <span className="text-white text-base font-bold mt-1 drop-shadow-sm">{title || 'Evansville River Esplanade'}</span>
          </div>
          <div className="absolute bottom-2 right-3 text-[11px] text-cyan-200/80 font-mono">37.97°N · 87.57°W</div>
        </div>
      );

    case 'arena':
      return (
        <div className={`relative w-full overflow-hidden bg-gradient-to-br from-purple-950 via-stone-900 to-indigo-950 flex items-center justify-center ${className}`}>
          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 200">
            <circle cx="200" cy="180" r="140" fill="none" stroke="#c084fc" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="200" cy="180" r="90" fill="none" stroke="#e9d5ff" strokeWidth="1" />
            <path d="M70,40 L200,100 L330,40" stroke="#f472b6" strokeWidth="1.5" fill="none" opacity="0.6" />
          </svg>
          <div className="relative z-10 flex flex-col items-center text-center px-4">
            <span className="text-xs uppercase tracking-widest font-black text-purple-200">Downtown Entertainment & Sports</span>
            <span className="text-white text-base font-bold mt-1 drop-shadow-sm">{title || 'Ford Center & Bosse Field'}</span>
          </div>
          <div className="absolute bottom-2 right-3 text-[11px] text-purple-200/80 font-mono">Arena Venue</div>
        </div>
      );

    case 'historic':
      return (
        <div className={`relative w-full overflow-hidden bg-gradient-to-br from-amber-950 via-stone-900 to-amber-900 flex items-center justify-center ${className}`}>
          <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 400 200">
            <rect x="40" y="80" width="70" height="120" fill="#d97706" />
            <rect x="130" y="60" width="85" height="140" fill="#b45309" />
            <rect x="235" y="90" width="75" height="110" fill="#92400e" />
            <line x1="0" y1="180" x2="400" y2="180" stroke="#fef3c7" strokeWidth="2" />
          </svg>
          <div className="relative z-10 flex flex-col items-center text-center px-4">
            <span className="text-xs uppercase tracking-widest font-black text-amber-200">Historic Districts & Heritage</span>
            <span className="text-white text-base font-bold mt-1 drop-shadow-sm">{title || 'Franklin St · New Harmony · Newburgh'}</span>
          </div>
          <div className="absolute bottom-2 right-3 text-[11px] text-amber-200/80 font-mono">Heritage Site</div>
        </div>
      );

    case 'traffic':
      return (
        <div className={`relative w-full overflow-hidden bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 flex items-center justify-center ${className}`}>
          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 200">
            <line x1="80" y1="200" x2="190" y2="70" stroke="#facc15" strokeWidth="2" strokeDasharray="8 6" />
            <line x1="320" y1="200" x2="210" y2="70" stroke="#facc15" strokeWidth="2" strokeDasharray="8 6" />
            <line x1="200" y1="200" x2="200" y2="70" stroke="#ffffff" strokeWidth="1" strokeDasharray="12 8" />
          </svg>
          <div className="relative z-10 flex flex-col items-center text-center px-4">
            <span className="text-xs uppercase tracking-widest font-black text-amber-300">INDOT & KYTC Regional Corridor</span>
            <span className="text-white text-base font-bold mt-1 drop-shadow-sm">{title || 'Lloyd Expwy · US-41 · I-69'}</span>
          </div>
          <div className="absolute bottom-2 right-3 text-[11px] text-stone-300 font-mono">Live Transit View</div>
        </div>
      );

    case 'food':
      return (
        <div className={`relative w-full overflow-hidden bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-950 flex items-center justify-center ${className}`}>
          <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 400 200">
            <circle cx="200" cy="100" r="60" fill="none" stroke="#34d399" strokeWidth="1.5" />
            <circle cx="200" cy="100" r="45" fill="none" stroke="#6ee7b7" strokeWidth="1" strokeDasharray="6 4" />
          </svg>
          <div className="relative z-10 flex flex-col items-center text-center px-4">
            <span className="text-xs uppercase tracking-widest font-black text-emerald-200">Local Flavor & Markets</span>
            <span className="text-white text-base font-bold mt-1 drop-shadow-sm">{title || 'Warrick & Vanderburgh Growers'}</span>
          </div>
          <div className="absolute bottom-2 right-3 text-[11px] text-emerald-200/80 font-mono">Local Cuisine</div>
        </div>
      );

    default:
      return (
        <div className={`relative w-full overflow-hidden bg-gradient-to-br from-stone-900 via-neutral-900 to-stone-950 flex items-center justify-center ${className}`}>
          <div className="relative z-10 flex flex-col items-center text-center px-4">
            <span className="text-xs uppercase tracking-widest font-black text-amber-300">Tri-State Community Bulletin</span>
            <span className="text-white text-base font-bold mt-1 drop-shadow-sm">{title || 'Evansville & Regional Hub'}</span>
          </div>
          <div className="absolute bottom-2 right-3 text-[11px] text-stone-400 font-mono">Local Bulletin</div>
        </div>
      );
  }
};
