import React, { useState, useEffect, useMemo } from 'react';
import { CountyId, CategoryId, FeedItem, OhioRiverGauge, WeatherSummary, TrafficCorridorStatus } from './types';
import {
  COUNTIES,
  INITIAL_FEED_ITEMS,
  INITIAL_RIVER_GAUGE,
  INITIAL_WEATHER,
  INITIAL_CORRIDORS,
  SIMULATED_STREAM_UPDATES,
} from './data/mockData';
import { Header } from './components/Header';
import { BreakingTicker } from './components/BreakingTicker';
import { CountyFilter } from './components/CountyFilter';
import { FeedCustomizer, FilterState } from './components/FeedCustomizer';
import { FeedCard } from './components/FeedCard';
import { RiverAndWeatherWidget } from './components/RiverAndWeatherWidget';
import { TrafficCorridorWidget } from './components/TrafficCorridorWidget';
import { AudioBriefingModal } from './components/AudioBriefingModal';
import { SubmitReportModal } from './components/SubmitReportModal';
import { PostDetailModal } from './components/PostDetailModal';
import { MapView } from './components/MapView';
import { CalendarView } from './components/CalendarView';
import { SavedBookmarksDrawer } from './components/SavedBookmarksDrawer';
import { ArrowUp, ShieldCheck, Sun, Moon } from 'lucide-react';

export default function App() {
  // Global Light/Dark Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem('evansville_buzz_theme');
      if (stored === 'light' || stored === 'dark') return stored;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // fallback
    }
    return 'light';
  });

  // Synchronize theme to document root
  useEffect(() => {
    try {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('evansville_buzz_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'feed' | 'events' | 'traffic' | 'weather' | 'map'>('feed');

  // Feed items state
  const [items, setItems] = useState<FeedItem[]>(() => {
    try {
      const stored = localStorage.getItem('evansville_buzz_items');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge with initial items to ensure all imageUrls are up to date
          const userCreated = parsed.filter((p: FeedItem) => p.userSubmitted);
          return [...userCreated, ...INITIAL_FEED_ITEMS];
        }
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_FEED_ITEMS;
  });

  // Bookmarked item IDs
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('evansville_buzz_bookmarks');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Upvoted item IDs
  const [upvotedIds, setUpvotedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('evansville_buzz_upvotes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Custom filter state (initial or loaded from preset)
  const [filters, setFilters] = useState<FilterState>(() => {
    try {
      const stored = localStorage.getItem('evansville_buzz_preset');
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          selectedCategories: parsed.selectedCategories || [],
          keywords: parsed.keywords || [],
          searchQuery: parsed.searchQuery || '',
          selectedCounty: parsed.selectedCounty || 'all',
          onlyUrgent: parsed.onlyUrgent || false,
          matchMode: parsed.matchMode || 'any',
        };
      }
    } catch {
      // fallback
    }
    return {
      selectedCategories: [],
      keywords: [],
      searchQuery: '',
      selectedCounty: 'all',
      onlyUrgent: false,
      matchMode: 'any',
    };
  });

  // Modals & Drawers state
  const [selectedItem, setSelectedItem] = useState<FeedItem | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isAudioBriefOpen, setIsAudioBriefOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  // Live stream simulation
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [newIncomingCount, setNewIncomingCount] = useState(0);

  // River and weather live data
  const [riverGauge] = useState<OhioRiverGauge>(INITIAL_RIVER_GAUGE);
  const [weather] = useState<WeatherSummary>(INITIAL_WEATHER);
  const [corridors] = useState<TrafficCorridorStatus[]>(INITIAL_CORRIDORS);

  // Save items to localStorage whenever updated
  useEffect(() => {
    try {
      localStorage.setItem('evansville_buzz_items', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  // Save bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('evansville_buzz_bookmarks', JSON.stringify(bookmarkedIds));
    } catch {
      // ignore
    }
  }, [bookmarkedIds]);

  // Save upvotes
  useEffect(() => {
    try {
      localStorage.setItem('evansville_buzz_upvotes', JSON.stringify(upvotedIds));
    } catch {
      // ignore
    }
  }, [upvotedIds]);

  // Simulated live feed updates
  useEffect(() => {
    if (!isLiveStreaming) return;

    let streamIndex = 0;
    const interval = setInterval(() => {
      const candidate = SIMULATED_STREAM_UPDATES[streamIndex % SIMULATED_STREAM_UPDATES.length];
      streamIndex++;

      const newItem: FeedItem = {
        ...candidate,
        id: `stream-${Date.now()}`,
        timestamp: 'Just now',
        publishedAt: new Date().toISOString(),
      };

      setItems((prev) => [newItem, ...prev]);
      setNewIncomingCount((c) => c + 1);
    }, 45000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  // Handle bookmark toggle
  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Handle upvote
  const handleUpvote = (id: string) => {
    setUpvotedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Handle new item published by user
  const handleCreatePost = (newItem: FeedItem) => {
    setItems((prev) => [newItem, ...prev]);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      selectedCategories: [],
      keywords: [],
      searchQuery: '',
      selectedCounty: 'all',
      onlyUrgent: false,
      matchMode: 'any',
    });
  };

  // County quick counts
  const countsByCounty = useMemo(() => {
    const acc: Record<CountyId, number> = {
      all: items.length,
      vanderburgh: 0,
      warrick: 0,
      posey: 0,
      gibson: 0,
      henderson: 0,
      spencer: 0,
    };
    items.forEach((i) => {
      if (acc[i.county] !== undefined) {
        acc[i.county]++;
      }
    });
    return acc;
  }, [items]);

  // Filtered items based on all active criteria
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. County filter
      if (filters.selectedCounty !== 'all' && item.county !== filters.selectedCounty) {
        return false;
      }

      // 2. Urgent / breaking filter
      if (filters.onlyUrgent && !item.isBreaking && item.category !== 'breaking') {
        return false;
      }

      // 3. Category multi-selection filter ('events', 'breaking', 'community', etc.)
      if (filters.selectedCategories.length > 0) {
        if (!filters.selectedCategories.includes(item.category)) {
          return false;
        }
      }

      // 4. Live search query filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const searchableText = `${item.title} ${item.summary} ${item.content} ${item.locationName} ${item.cityOrArea} ${item.sourceName} ${(item.tags || []).join(' ')}`.toLowerCase();
        if (!searchableText.includes(query)) {
          return false;
        }
      }

      // 5. Custom keywords refinement
      if (filters.keywords.length > 0) {
        const itemText = `${item.title} ${item.summary} ${item.content} ${item.locationName} ${item.cityOrArea} ${(item.tags || []).join(' ')}`.toLowerCase();

        if (filters.matchMode === 'any') {
          const hasAny = filters.keywords.some((kw) => itemText.includes(kw.toLowerCase()));
          if (!hasAny) return false;
        } else {
          const hasAll = filters.keywords.every((kw) => itemText.includes(kw.toLowerCase()));
          if (!hasAll) return false;
        }
      }

      return true;
    });
  }, [items, filters]);

  // Saved items list
  const savedItems = useMemo(() => {
    return items.filter((item) => bookmarkedIds.includes(item.id));
  }, [items, bookmarkedIds]);

  // Events list for calendar
  const eventItems = useMemo(() => {
    return items.filter((item) => item.category === 'events' || Boolean(item.eventDetails));
  }, [items]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setNewIncomingCount(0);
  };

  return (
    <div className="min-h-screen bg-stone-100/80 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Bar with Global Theme Toggle */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={bookmarkedIds.length}
        onOpenSaved={() => setIsSavedDrawerOpen(true)}
        onOpenSubmit={() => setIsSubmitOpen(true)}
        onOpenAudioBriefing={() => setIsAudioBriefOpen(true)}
        isLiveStreaming={isLiveStreaming}
        onToggleLiveStream={() => setIsLiveStreaming(!isLiveStreaming)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Breaking News Ticker */}
      <BreakingTicker
        items={items}
        onSelectItem={(item) => setSelectedItem(item)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Floating New Incoming Update Pill */}
        {newIncomingCount > 0 && activeTab === 'feed' && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 px-5 py-3 bg-amber-900 dark:bg-amber-600 hover:bg-amber-950 dark:hover:bg-amber-500 text-white rounded-full shadow-2xl text-xs font-bold border-2 border-amber-950 dark:border-amber-400 cursor-pointer transition-transform hover:scale-105 active:scale-95"
            >
              <ArrowUp className="w-4 h-4 text-amber-300" />
              <span>{newIncomingCount} new Local Buzz update{newIncomingCount > 1 ? 's' : ''}</span>
              <span className="text-amber-200/80 font-normal">· View top</span>
            </button>
          </div>
        )}

        {/* TAB 1: LIVE FEED */}
        {activeTab === 'feed' && (
          <div className="space-y-6">
            {/* County Quick Selector Bar with clear borders */}
            <div className="bg-white dark:bg-stone-900 p-4 rounded-2xl border-2 border-stone-300 dark:border-stone-800 shadow-xs transition-colors">
              <CountyFilter
                selectedCounty={filters.selectedCounty}
                onSelectCounty={(county) => setFilters({ ...filters, selectedCounty: county })}
                countsByCounty={countsByCounty}
              />
            </div>

            {/* Customizer: Categories & Custom Keywords Refinement */}
            <FeedCustomizer
              filters={filters}
              onUpdateFilters={(newFilters) => setFilters(newFilters)}
              onResetFilters={handleResetFilters}
              totalFilteredCount={filteredItems.length}
              totalAvailableCount={items.length}
            />

            {/* Feed Main Grid (2-Column split: Stream Cards + Live Conditions Rail) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Primary Feed Column */}
              <div className="lg:col-span-2 space-y-5">
                {filteredItems.length === 0 ? (
                  <div className="bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-300 dark:border-stone-800 p-12 text-center text-stone-500 dark:text-stone-400 shadow-xs">
                    <p className="text-base font-bold text-stone-800 dark:text-stone-200">No matching updates found</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 mb-5">
                      No posts match your selected categories or keywords. Try expanding your search or clearing active filters.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="px-5 py-2.5 text-xs font-bold text-white bg-amber-900 hover:bg-amber-950 dark:bg-amber-600 dark:hover:bg-amber-500 border border-amber-950 dark:border-amber-400 rounded-xl cursor-pointer shadow-xs transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {filteredItems.map((item) => (
                      <FeedCard
                        key={item.id}
                        item={item}
                        isBookmarked={bookmarkedIds.includes(item.id)}
                        onToggleBookmark={handleToggleBookmark}
                        onSelectItem={(post) => setSelectedItem(post)}
                        onUpvote={handleUpvote}
                        hasUpvoted={upvotedIds.includes(item.id)}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar Rail: River Gauge, Weather & Highway Corridors */}
              <div className="space-y-5">
                {/* Ohio River & Weather Card */}
                <RiverAndWeatherWidget
                  gauge={riverGauge}
                  weather={weather}
                />

                {/* Live Bridges & Corridors Status */}
                <TrafficCorridorWidget
                  corridors={corridors}
                  onOpenTrafficFilter={() => {
                    setFilters({ ...filters, selectedCategories: ['traffic'] });
                  }}
                />

                {/* Community Voice Callout with defined earthy border */}
                <div className="bg-stone-900 dark:bg-stone-900 text-stone-100 rounded-2xl p-5 border-2 border-amber-950 dark:border-stone-800 shadow-xs">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Evansville Local Buzz</span>
                  </div>
                  <h3 className="font-black text-sm text-white mb-1.5 font-display">
                    Have local news, a road alert, or an event?
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed mb-4">
                    Share updates with neighbors across Vanderburgh, Warrick, Posey, Gibson, and Henderson counties in real time.
                  </p>
                  <button
                    onClick={() => setIsSubmitOpen(true)}
                    className="w-full py-2.5 px-3 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl cursor-pointer transition-colors shadow-2xs border border-amber-500"
                  >
                    + Submit Bulletin or Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EVENTS CALENDAR */}
        {activeTab === 'events' && (
          <CalendarView
            events={eventItems}
            selectedCounty={filters.selectedCounty}
            onSelectCounty={(county) => setFilters({ ...filters, selectedCounty: county })}
            onSelectItem={(post) => setSelectedItem(post)}
          />
        )}

        {/* TAB 3: BRIDGES & TRAFFIC */}
        {activeTab === 'traffic' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-300 dark:border-stone-800 p-5 shadow-xs transition-colors">
              <h2 className="text-xl font-black text-stone-900 dark:text-stone-100 font-display">
                Tri-State Bridges & Major Highway Corridors
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 font-medium">
                Real-time travel advisories for US-41 Twin Bridges, Lloyd Expressway (SR-66), I-69 Gateway, and county bypasses
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {corridors.map((c) => (
                <div key={c.id} className="bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-300 dark:border-stone-800 p-5 shadow-xs space-y-3 transition-colors">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-base text-stone-900 dark:text-stone-100 font-display">{c.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                        c.status === 'Normal'
                          ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                          : 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                      }`}
                    >
                      {c.status}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 font-bold">Segment: {c.segment}</div>
                  <p className="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-normal">{c.note}</p>
                  <div className="pt-2 border-t-2 border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 font-medium">
                    <span>Monitored via INDOT & KYTC Traffic Operations</span>
                    <span className="font-mono text-stone-900 dark:text-stone-100 font-extrabold">
                      {c.delayMinutes === 0 ? 'No Delay' : `+${c.delayMinutes} min delay`}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Traffic-related feed posts */}
            <div>
              <h3 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 uppercase tracking-wider mb-3.5">
                Recent Roadway & Transit Advisories
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {items
                  .filter((i) => i.category === 'traffic' || i.trafficDetails)
                  .map((item) => (
                    <FeedCard
                      key={item.id}
                      item={item}
                      isBookmarked={bookmarkedIds.includes(item.id)}
                      onToggleBookmark={handleToggleBookmark}
                      onSelectItem={(post) => setSelectedItem(post)}
                      onUpvote={handleUpvote}
                      hasUpvoted={upvotedIds.includes(item.id)}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RIVER & WEATHER */}
        {activeTab === 'weather' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-300 dark:border-stone-800 p-5 shadow-xs transition-colors">
              <h2 className="text-xl font-black text-stone-900 dark:text-stone-100 font-display">
                Ohio River Basin & Regional Tri-State Weather
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 font-medium">
                Official river stages, water temperature, flood threshold monitoring and forecasts for Evansville & Henderson
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RiverAndWeatherWidget gauge={riverGauge} weather={weather} />

              <div className="bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-300 dark:border-stone-800 p-5 shadow-xs space-y-4 text-xs transition-colors">
                <h3 className="font-extrabold text-sm text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                  Evansville Ohio Riverfront Guide
                </h3>
                <div className="space-y-2.5 text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
                  <p>
                    • <strong>Current Stage:</strong> At 34.2 feet, the Ohio River is in its normal safe pool stage.
                  </p>
                  <p>
                    • <strong>Flood Threshold:</strong> Action stage is reached at 38.0 feet, and minor flood stage begins at 42.0 feet.
                  </p>
                  <p>
                    • <strong>Esplanade Walking Trail:</strong> Fully open and dry from Court Street down to the Four Seasons Fountain and Pagoda Welcome Center.
                  </p>
                  <p>
                    • <strong>Boating & Marina:</strong> Public boat ramps at Sunset Park and Angel Mounds are accessible with normal navigation currents.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: COUNTY MAP */}
        {activeTab === 'map' && (
          <MapView
            items={items}
            selectedCounty={filters.selectedCounty}
            onSelectCounty={(county) => setFilters({ ...filters, selectedCounty: county })}
            onSelectItem={(post) => setSelectedItem(post)}
          />
        )}
      </main>

      {/* Footer with defined border */}
      <footer className="mt-auto border-t-2 border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900 py-6 text-xs text-stone-600 dark:text-stone-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-stone-900 dark:text-stone-100 font-display">Evansville Local Buzz</span>
            <span>·</span>
            <span>Real-time community feed for Evansville, Vanderburgh, Warrick, Posey, Gibson & Henderson</span>
          </div>
          <div className="flex items-center gap-4 text-stone-500 dark:text-stone-400">
            <span>Data updated real-time</span>
            <span>·</span>
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="text-amber-800 dark:text-amber-400 hover:underline font-bold cursor-pointer"
            >
              Post an Update
            </button>
          </div>
        </div>
      </footer>

      {/* Detail Modal */}
      <PostDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        isBookmarked={selectedItem ? bookmarkedIds.includes(selectedItem.id) : false}
        onToggleBookmark={handleToggleBookmark}
        onUpvote={handleUpvote}
        hasUpvoted={selectedItem ? upvotedIds.includes(selectedItem.id) : false}
      />

      {/* Submit Community Post Modal */}
      <SubmitReportModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSubmit={handleCreatePost}
      />

      {/* Audio Digest Modal */}
      <AudioBriefingModal
        isOpen={isAudioBriefOpen}
        onClose={() => setIsAudioBriefOpen(false)}
        items={items}
        onSelectItem={(item) => setSelectedItem(item)}
      />

      {/* Saved Bookmarks Drawer */}
      <SavedBookmarksDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        savedItems={savedItems}
        onSelectItem={(item) => setSelectedItem(item)}
        onRemoveBookmark={handleToggleBookmark}
      />
    </div>
  );
}
