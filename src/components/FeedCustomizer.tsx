import React, { useState } from 'react';
import { CategoryId, CountyId } from '../types';
import { Search, Plus, X, SlidersHorizontal, RotateCcw, Check, Sparkles } from 'lucide-react';
import { COUNTIES } from '../data/mockData';

export interface FilterState {
  selectedCategories: CategoryId[];
  keywords: string[];
  searchQuery: string;
  selectedCounty: CountyId;
  onlyUrgent: boolean;
  matchMode: 'any' | 'all';
}

interface FeedCustomizerProps {
  filters: FilterState;
  onUpdateFilters: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  totalFilteredCount: number;
  totalAvailableCount: number;
}

const PRIMARY_CATEGORIES: { id: CategoryId; label: string; description: string }[] = [
  { id: 'breaking', label: 'Breaking News', description: 'Alerts & police/fire/river wire' },
  { id: 'events', label: 'Local Events', description: 'Concerts, sports, festivals & arts' },
  { id: 'community', label: 'Community Updates', description: 'Schools, neighborhood boards & civic' },
  { id: 'traffic', label: 'Traffic & Bridges', description: 'Twin Bridges, Lloyd Expwy & I-69' },
  { id: 'weather', label: 'River & Weather', description: 'Ohio River gauge & forecasts' },
  { id: 'food', label: 'Food & Dining', description: 'Local eateries, trucks & markets' },
];

const SUGGESTED_KEYWORDS = [
  'Riverfront',
  'Franklin St',
  'Ford Center',
  'Twin Bridges',
  'Newburgh',
  'Lloyd',
  'New Harmony',
  'EVSC',
  'Bosse Field',
  'Toyota',
];

export const FeedCustomizer: React.FC<FeedCustomizerProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  totalFilteredCount,
  totalAvailableCount,
}) => {
  const [keywordInput, setKeywordInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [savedPresetSuccess, setSavedPresetSuccess] = useState(false);

  const isFilteringActive =
    filters.selectedCategories.length > 0 ||
    filters.keywords.length > 0 ||
    filters.searchQuery.trim().length > 0 ||
    filters.selectedCounty !== 'all' ||
    filters.onlyUrgent;

  const handleToggleCategory = (catId: CategoryId) => {
    let next: CategoryId[];
    if (filters.selectedCategories.includes(catId)) {
      next = filters.selectedCategories.filter((c) => c !== catId);
    } else {
      next = [...filters.selectedCategories, catId];
    }
    onUpdateFilters({ ...filters, selectedCategories: next });
  };

  const handleAddKeyword = (kwToAdd?: string) => {
    const raw = (kwToAdd || keywordInput).trim();
    if (!raw) return;

    const normalized = raw.toLowerCase();
    if (!filters.keywords.some((k) => k.toLowerCase() === normalized)) {
      onUpdateFilters({
        ...filters,
        keywords: [...filters.keywords, raw],
      });
    }
    setKeywordInput('');
  };

  const handleRemoveKeyword = (kwToRemove: string) => {
    onUpdateFilters({
      ...filters,
      keywords: filters.keywords.filter((k) => k !== kwToRemove),
    });
  };

  const handleSaveAsDefault = () => {
    try {
      localStorage.setItem('evansville_buzz_preset', JSON.stringify(filters));
      setSavedPresetSuccess(true);
      setTimeout(() => setSavedPresetSuccess(false), 2500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-300 dark:border-stone-800 overflow-hidden shadow-xs transition-colors">
      {/* Top search & quick controls bar */}
      <div className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-amber-50/30 dark:bg-stone-950/40 border-b-2 border-stone-200 dark:border-stone-800">
        {/* Search Box with solid border */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-500 dark:text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onUpdateFilters({ ...filters, searchQuery: e.target.value })}
            placeholder="Search local events, breaking news, venues (e.g. Franklin, Ford Center, river)..."
            className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-white dark:bg-stone-800/90 border-2 border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 dark:focus:ring-amber-400 focus:border-amber-800 dark:focus:border-amber-400 text-stone-900 dark:text-stone-100 placeholder-stone-400 font-medium"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onUpdateFilters({ ...filters, searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-0.5"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Action Buttons with defined borders */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer ${
              isExpanded || isFilteringActive
                ? 'bg-amber-900 text-white border-amber-950 dark:bg-amber-600 dark:border-amber-400 shadow-2xs'
                : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Customize Feed</span>
            {isFilteringActive && (
              <span className="w-2 h-2 rounded-full bg-amber-400 inline-block ml-0.5" />
            )}
          </button>

          {isFilteringActive && (
            <button
              onClick={onResetFilters}
              title="Reset all filters"
              className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-xl transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Button-centric Category Filter Bar */}
      <div className="px-4 py-3 border-b-2 border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-stone-500 dark:text-stone-400 font-bold uppercase text-[11px] tracking-wider mr-1">
            Categories:
          </span>
          {PRIMARY_CATEGORIES.map((cat) => {
            const isSelected = filters.selectedCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => handleToggleCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer border-2 ${
                  isSelected
                    ? 'bg-amber-800 text-white border-amber-950 dark:bg-amber-600 dark:border-amber-400 shadow-2xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <span>{cat.label}</span>
                {isSelected && <Check className="w-3 h-3 text-amber-200" />}
              </button>
            );
          })}
          {filters.selectedCategories.length > 0 && (
            <button
              onClick={() => onUpdateFilters({ ...filters, selectedCategories: [] })}
              className="px-2 py-1 rounded text-[11px] font-bold text-stone-600 dark:text-stone-400 hover:text-amber-800 dark:hover:text-amber-400 hover:bg-stone-100 dark:hover:bg-stone-800 border border-transparent hover:border-stone-300 transition-colors cursor-pointer"
            >
              Clear categories
            </button>
          )}
        </div>

        {/* Counter */}
        <div className="text-xs text-stone-500 dark:text-stone-400 font-mono font-medium">
          Showing <span className="font-extrabold text-stone-900 dark:text-stone-100">{totalFilteredCount}</span> of {totalAvailableCount} updates
        </div>
      </div>

      {/* Active Custom Keyword Buttons Strip */}
      {filters.keywords.length > 0 && (
        <div className="px-4 py-2.5 bg-amber-50 dark:bg-amber-950/30 border-b-2 border-amber-200 dark:border-amber-900/60 flex items-center gap-2 flex-wrap text-xs">
          <span className="text-amber-900 dark:text-amber-300 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span>Active Keywords:</span>
          </span>
          {filters.keywords.map((kw) => (
            <span
              key={kw}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-stone-800 border-2 border-amber-400 dark:border-amber-600 text-amber-950 dark:text-amber-200 font-bold rounded-lg shadow-2xs"
            >
              <span>{kw}</span>
              <button
                onClick={() => handleRemoveKeyword(kw)}
                className="hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer p-0.5"
                aria-label={`Remove keyword ${kw}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ))}
          <button
            onClick={() => onUpdateFilters({ ...filters, keywords: [] })}
            className="px-2 py-1 text-[11px] font-bold text-amber-800 dark:text-amber-300 hover:underline cursor-pointer"
          >
            Clear all keywords
          </button>
        </div>
      )}

      {/* Expanded Customizer Panel */}
      {isExpanded && (
        <div className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-950/60 border-t-2 border-stone-200 dark:border-stone-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Custom Keywords Builder */}
            <div>
              <label className="block text-xs font-extrabold text-stone-800 dark:text-stone-200 uppercase tracking-wider mb-1.5">
                Refine with Custom Keywords
              </label>
              <p className="text-xs text-stone-600 dark:text-stone-400 mb-2">
                Type any street, landmark, school, or topic to filter the feed in real-time.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddKeyword();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="e.g. Mesker, USI, Purple Aces, Henderson..."
                  className="flex-1 px-3.5 py-2 text-xs bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 dark:focus:ring-amber-400 text-stone-900 dark:text-stone-100"
                />
                <button
                  type="submit"
                  disabled={!keywordInput.trim()}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-900 hover:bg-amber-950 dark:bg-amber-600 dark:hover:bg-amber-500 border-2 border-amber-950 dark:border-amber-400 disabled:opacity-40 rounded-xl cursor-pointer transition-colors shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Keyword</span>
                </button>
              </form>

              {/* Quick Add Buttons */}
              <div className="mt-3">
                <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 block mb-1.5">
                  Popular Evansville & Tri-State Keywords:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_KEYWORDS.map((sug) => {
                    const isAdded = filters.keywords.some((k) => k.toLowerCase() === sug.toLowerCase());
                    return (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => handleAddKeyword(sug)}
                        disabled={isAdded}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border-2 font-semibold transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-500 border-stone-200 dark:border-stone-800 cursor-default'
                            : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-amber-50 dark:hover:bg-stone-700 hover:border-amber-400'
                        }`}
                      >
                        +{sug}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* County & Match Strategy */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-extrabold text-stone-800 dark:text-stone-200 uppercase tracking-wider mb-1.5">
                  County Geographic Scope
                </label>
                <select
                  value={filters.selectedCounty}
                  onChange={(e) => onUpdateFilters({ ...filters, selectedCounty: e.target.value as CountyId })}
                  className="w-full px-3.5 py-2 text-xs bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-800 dark:focus:ring-amber-400 text-stone-900 dark:text-stone-100 font-bold"
                >
                  {COUNTIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.seat}, {c.state})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">
                    Match Mode
                  </label>
                  <div className="flex items-center gap-1 bg-stone-200/80 dark:bg-stone-800 p-1 rounded-xl border border-stone-300 dark:border-stone-700 text-xs">
                    <button
                      type="button"
                      onClick={() => onUpdateFilters({ ...filters, matchMode: 'any' })}
                      className={`flex-1 py-1 rounded-lg text-center font-bold cursor-pointer transition-colors ${
                        filters.matchMode === 'any'
                          ? 'bg-amber-900 text-white dark:bg-amber-600 shadow-2xs'
                          : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
                      }`}
                    >
                      Any Keyword
                    </button>
                    <button
                      type="button"
                      onClick={() => onUpdateFilters({ ...filters, matchMode: 'all' })}
                      className={`flex-1 py-1 rounded-lg text-center font-bold cursor-pointer transition-colors ${
                        filters.matchMode === 'all'
                          ? 'bg-amber-900 text-white dark:bg-amber-600 shadow-2xs'
                          : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
                      }`}
                    >
                      All Keywords
                    </button>
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2 bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 rounded-xl text-xs cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-750">
                    <input
                      type="checkbox"
                      checked={filters.onlyUrgent}
                      onChange={(e) => onUpdateFilters({ ...filters, onlyUrgent: e.target.checked })}
                      className="rounded text-amber-800 dark:text-amber-500 focus:ring-amber-800 h-4 w-4"
                    />
                    <span className="text-stone-800 dark:text-stone-200 font-bold">Breaking only</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Preset Actions */}
          <div className="pt-3 border-t-2 border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
            <button
              onClick={handleSaveAsDefault}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 rounded-xl font-bold border border-stone-300 dark:border-stone-700 cursor-pointer transition-colors"
            >
              {savedPresetSuccess ? <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" /> : null}
              <span>{savedPresetSuccess ? 'Saved Default View!' : 'Save as My Default View'}</span>
            </button>

            <button
              onClick={() => setIsExpanded(false)}
              className="px-3 py-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-bold cursor-pointer"
            >
              Close Filter Options
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
