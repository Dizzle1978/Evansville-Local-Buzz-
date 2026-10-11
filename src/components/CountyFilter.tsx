import React from 'react';
import { CountyId } from '../types';
import { COUNTIES } from '../data/mockData';
import { MapPin } from 'lucide-react';

interface CountyFilterProps {
  selectedCounty: CountyId;
  onSelectCounty: (county: CountyId) => void;
  countsByCounty: Record<CountyId, number>;
}

export const CountyFilter: React.FC<CountyFilterProps> = ({
  selectedCounty,
  onSelectCounty,
  countsByCounty,
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b-2 border-stone-200 dark:border-stone-800">
        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-200 uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
          <span>Select County or Tri-State Area</span>
        </div>
        <div className="text-xs text-stone-600 dark:text-stone-400">
          Showing: <span className="font-extrabold text-amber-900 dark:text-amber-400">{COUNTIES.find(c => c.id === selectedCounty)?.name}</span>
        </div>
      </div>

      {/* Button-centric segmented controls with clearly defined borders */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {COUNTIES.map((county) => {
          const isSelected = selectedCounty === county.id;
          const count = countsByCounty[county.id] || 0;

          return (
            <button
              key={county.id}
              onClick={() => onSelectCounty(county.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer border-2 ${
                isSelected
                  ? 'bg-amber-900 text-white border-amber-950 dark:bg-amber-600 dark:border-amber-400 shadow-xs'
                  : 'bg-white dark:bg-stone-800/90 text-stone-700 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 hover:border-stone-400'
              }`}
            >
              <span>{county.name}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold ${
                  isSelected
                    ? 'bg-amber-950 text-amber-200 dark:bg-amber-800 dark:text-white'
                    : 'bg-stone-200/90 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
