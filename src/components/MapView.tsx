import React, { useState } from 'react';
import { FeedItem, CountyId } from '../types';
import { COUNTIES } from '../data/mockData';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';

interface MapViewProps {
  items: FeedItem[];
  selectedCounty: CountyId;
  onSelectCounty: (county: CountyId) => void;
  onSelectItem: (item: FeedItem) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  items,
  selectedCounty,
  onSelectCounty,
  onSelectItem,
}) => {
  const [activePin, setActivePin] = useState<FeedItem | null>(items[0] || null);

  const minLat = 37.80;
  const maxLat = 38.35;
  const minLng = -88.00;
  const maxLng = -86.90;

  const getPositionPercent = (lat: number, lng: number) => {
    const top = ((maxLat - lat) / (maxLat - minLat)) * 100;
    const left = ((lng - minLng) / (maxLng - minLng)) * 100;
    return {
      top: Math.max(8, Math.min(92, top)),
      left: Math.max(8, Math.min(92, left)),
    };
  };

  const filteredItems = selectedCounty === 'all'
    ? items
    : items.filter(i => i.county === selectedCounty);

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-300 dark:border-stone-800 overflow-hidden shadow-xs transition-colors">
      {/* Top Map Bar */}
      <div className="p-4 bg-amber-50/40 dark:bg-stone-950/40 border-b-2 border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-stone-900 dark:text-stone-100 font-display flex items-center gap-2">
            <Navigation className="w-4 h-4 text-amber-700 dark:text-amber-400" />
            <span>Interactive Tri-State Community Map</span>
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">
            Events, incidents & roadwork across Evansville and surrounding river counties
          </p>
        </div>

        {/* County Switcher Button Dropdown with defined border */}
        <select
          value={selectedCounty}
          onChange={(e) => onSelectCounty(e.target.value as CountyId)}
          className="px-3.5 py-2 text-xs bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-bold cursor-pointer"
        >
          {COUNTIES.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name} ({filteredItems.filter(i => c.id === 'all' || i.county === c.id).length} pins)
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Map Canvas */}
        <div className="lg:col-span-2 relative h-[480px] sm:h-[540px] bg-stone-100 dark:bg-stone-950 overflow-hidden border-b-2 lg:border-b-0 lg:border-r-2 border-stone-300 dark:border-stone-800 select-none">
          <div className="absolute inset-0 bg-radial from-stone-50 to-stone-200 dark:from-stone-900 dark:to-stone-950 opacity-90" />
          
          {/* Ohio River & Wabash River styling */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 dark:opacity-30" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <path
              d="M 100,520 C 300,560 480,430 550,470 C 620,510 750,450 950,490"
              fill="none"
              stroke="#0284c7"
              strokeWidth="28"
              strokeLinecap="round"
            />
            <path
              d="M 50,50 C 90,200 80,350 100,520"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M 100,320 L 950,330"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="4"
              strokeDasharray="8 6"
            />
            <path
              d="M 520,50 L 520,580"
              fill="none"
              stroke="#94a3b8"
              strokeWidth="4"
              strokeDasharray="8 6"
            />
          </svg>

          {/* Regional County Labels */}
          <div className="absolute top-8 left-12 text-xs font-black text-stone-400 dark:text-stone-600 uppercase tracking-widest pointer-events-none">
            Posey County
          </div>
          <div className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-black text-stone-400 dark:text-stone-600 uppercase tracking-widest pointer-events-none">
            Gibson County (Princeton)
          </div>
          <div className="absolute top-28 left-1/2 -translate-x-1/2 text-sm font-black text-stone-600/70 dark:text-stone-500 uppercase tracking-widest pointer-events-none">
            Vanderburgh County (Evansville)
          </div>
          <div className="absolute top-24 right-16 text-xs font-black text-stone-400 dark:text-stone-600 uppercase tracking-widest pointer-events-none">
            Warrick County (Newburgh)
          </div>
          <div className="absolute bottom-8 right-12 text-xs font-black text-stone-400 dark:text-stone-600 uppercase tracking-widest pointer-events-none">
            Spencer County
          </div>
          <div className="absolute bottom-8 left-1/3 text-xs font-black text-stone-400 dark:text-stone-600 uppercase tracking-widest pointer-events-none">
            Henderson County, KY (Across Ohio River)
          </div>

          {/* Interactive Map Pins */}
          {filteredItems.map((item) => {
            const pos = getPositionPercent(item.coordinates.lat, item.coordinates.lng);
            const isSelected = activePin?.id === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActivePin(item)}
                style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform hover:scale-125 focus:outline-none z-10 ${
                  isSelected ? 'scale-125 z-20' : ''
                }`}
                aria-label={`Map pin for ${item.title}`}
              >
                <div
                  className={`w-7 h-7 rounded-full shadow-md flex items-center justify-center transition-colors border-2 border-white dark:border-stone-900 ${
                    item.category === 'events'
                      ? 'bg-purple-600 text-white'
                      : item.category === 'breaking'
                      ? 'bg-rose-600 text-white animate-pulse'
                      : item.category === 'traffic'
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-900 text-white'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                </div>

                <div className="hidden group-hover:block absolute left-1/2 -translate-x-1/2 top-8 whitespace-nowrap bg-stone-900 text-white text-[11px] font-bold px-2 py-1 rounded shadow-lg z-30 pointer-events-none">
                  {item.cityOrArea}
                </div>
              </button>
            );
          })}

          {/* Map Legend */}
          <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-stone-900/95 backdrop-blur-xs p-3 rounded-xl border-2 border-stone-300 dark:border-stone-800 text-[11px] space-y-1 shadow-xs">
            <div className="font-extrabold text-stone-900 dark:text-stone-100 mb-1">Buzz Map Legend:</div>
            <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span>Events & Culture</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span>Breaking Alerts</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              <span>Traffic & Bridges</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-900 dark:bg-stone-100" />
              <span>Community Board</span>
            </div>
          </div>
        </div>

        {/* Selected Pin Details Sidebar */}
        <div className="p-5 flex flex-col justify-between bg-white dark:bg-stone-900 h-[480px] sm:h-[540px] overflow-y-auto">
          {activePin ? (
            <div className="space-y-4">
              <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
                <span className="font-extrabold text-amber-900 dark:text-amber-400">{activePin.countyLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{activePin.cityOrArea}</span>
              </div>

              <h3 className="text-lg font-extrabold text-stone-900 dark:text-stone-100 font-display leading-snug">
                {activePin.title}
              </h3>

              <div className="p-3.5 bg-stone-50 dark:bg-stone-800/70 rounded-xl text-xs space-y-1.5 border-2 border-stone-200 dark:border-stone-800">
                <div className="font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                  <span>{activePin.locationName}</span>
                </div>
                <div className="text-stone-500 dark:text-stone-400 text-[11px] font-mono">
                  Coordinates: {activePin.coordinates.lat.toFixed(4)}°N, {Math.abs(activePin.coordinates.lng).toFixed(4)}°W
                </div>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                {activePin.summary}
              </p>

              {activePin.eventDetails && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl text-xs border border-amber-200 dark:border-amber-900/60 space-y-1">
                  <div className="font-bold text-amber-950 dark:text-amber-200">When: {activePin.eventDetails.dateTimeText}</div>
                  <div className="text-amber-900 dark:text-amber-300">Admission: {activePin.eventDetails.cost}</div>
                </div>
              )}

              <button
                onClick={() => onSelectItem(activePin)}
                className="w-full mt-2 py-2.5 px-3 bg-stone-900 dark:bg-stone-800 hover:bg-amber-900 dark:hover:bg-amber-600 text-white rounded-xl text-xs font-bold border border-stone-950 dark:border-stone-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
              >
                <span>Read Full Story & Details</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-stone-400 p-6">
              <MapPin className="w-8 h-8 mb-2 text-stone-300 dark:text-stone-600" />
              <p className="text-xs">Click any pinpoint on the Tri-State map to inspect local details.</p>
            </div>
          )}

          <div className="text-[11px] text-stone-400 dark:text-stone-500 pt-4 border-t-2 border-stone-100 dark:border-stone-800 flex items-center justify-between">
            <span>Evansville Regional Map</span>
            <span>{filteredItems.length} locations mapped</span>
          </div>
        </div>
      </div>
    </div>
  );
};
