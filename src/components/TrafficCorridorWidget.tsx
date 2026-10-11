import React from 'react';
import { TrafficCorridorStatus } from '../types';
import { Navigation, Clock } from 'lucide-react';

interface TrafficCorridorWidgetProps {
  corridors: TrafficCorridorStatus[];
  onOpenTrafficFilter: () => void;
}

export const TrafficCorridorWidget: React.FC<TrafficCorridorWidgetProps> = ({
  corridors,
  onOpenTrafficFilter,
}) => {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-300 dark:border-stone-800 overflow-hidden shadow-xs transition-colors">
      <div className="p-4 border-b-2 border-stone-200 dark:border-stone-800 flex items-center justify-between bg-amber-50/30 dark:bg-stone-950/40">
        <div className="flex items-center gap-2">
          <Navigation className="w-4 h-4 text-amber-700 dark:text-amber-400" />
          <h2 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 font-display">
            Tri-State Bridges & Corridors
          </h2>
        </div>
        <button
          onClick={onOpenTrafficFilter}
          className="px-2.5 py-1 text-xs font-bold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 border border-amber-300 dark:border-stone-700 rounded-lg cursor-pointer transition-colors"
        >
          View All
        </button>
      </div>

      <div className="divide-y-2 divide-stone-100 dark:divide-stone-800/80">
        {corridors.map((c) => {
          const isSmooth = c.status === 'Normal';
          return (
            <div key={c.id} className="p-3.5 hover:bg-amber-50/20 dark:hover:bg-stone-800/50 transition-colors">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-extrabold text-stone-900 dark:text-stone-100 truncate pr-2">{c.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold shrink-0 border ${
                    isSmooth
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                      : 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                  }`}
                >
                  {c.status}
                </span>
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 mb-1 font-medium">{c.segment}</div>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-snug">{c.note}</p>
              {c.delayMinutes > 0 && (
                <div className="flex items-center gap-1 text-[11px] text-amber-800 dark:text-amber-400 mt-1 font-mono font-bold">
                  <Clock className="w-3 h-3" />
                  <span>+{c.delayMinutes} min delay</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
