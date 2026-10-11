import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { FeedItem } from '../types';

interface BreakingTickerProps {
  items: FeedItem[];
  onSelectItem: (item: FeedItem) => void;
}

export const BreakingTicker: React.FC<BreakingTickerProps> = ({ items, onSelectItem }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const tickerItems = items.filter(
    (item) => item.isBreaking || item.category === 'breaking' || item.category === 'traffic'
  ).slice(0, 5);

  useEffect(() => {
    if (tickerItems.length === 0 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % tickerItems.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [tickerItems.length, isPaused]);

  if (tickerItems.length === 0) return null;

  const currentItem = tickerItems[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + tickerItems.length) % tickerItems.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % tickerItems.length);
  };

  return (
    <div className="bg-stone-900 dark:bg-stone-950 text-stone-100 border-b-2 border-stone-800 dark:border-stone-800 py-2.5 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex items-center gap-1.5 shrink-0 uppercase tracking-wider font-extrabold text-[11px] text-amber-400 bg-amber-950/80 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/80">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="whitespace-nowrap">Local Buzz Alert</span>
          </div>

          <div
            className="flex items-center gap-2 overflow-hidden cursor-pointer hover:text-amber-200 transition-colors"
            onClick={() => onSelectItem(currentItem)}
            title="Click to view full bulletin"
          >
            <span className="text-amber-400 font-bold shrink-0">
              [{currentItem.countyLabel}]
            </span>
            <span className="truncate text-stone-100 dark:text-stone-200 font-medium">
              {currentItem.title}
            </span>
            <span className="hidden sm:inline text-stone-400 shrink-0 font-mono text-[11px]">
              — {currentItem.timestamp}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="hidden md:inline text-[11px] font-mono mr-1 text-stone-400">
            {currentIndex + 1}/{tickerItems.length}
          </span>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="p-1.5 bg-stone-800 dark:bg-stone-900 hover:bg-stone-700 text-stone-200 rounded-md border border-stone-700 dark:border-stone-800 transition-colors cursor-pointer"
            aria-label={isPaused ? 'Resume ticker rotation' : 'Pause ticker rotation'}
          >
            {isPaused ? <Play className="w-3 h-3 text-amber-400" /> : <Pause className="w-3 h-3" />}
          </button>
          <button
            onClick={handlePrev}
            className="p-1.5 bg-stone-800 dark:bg-stone-900 hover:bg-stone-700 text-stone-200 rounded-md border border-stone-700 dark:border-stone-800 transition-colors cursor-pointer"
            aria-label="Previous alert"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 bg-stone-800 dark:bg-stone-900 hover:bg-stone-700 text-stone-200 rounded-md border border-stone-700 dark:border-stone-800 transition-colors cursor-pointer"
            aria-label="Next alert"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
