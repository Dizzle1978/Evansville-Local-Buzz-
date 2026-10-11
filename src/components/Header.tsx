import React from 'react';
import { Bookmark, Radio, Volume2, Plus, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  activeTab: 'feed' | 'events' | 'traffic' | 'weather' | 'map';
  setActiveTab: (tab: 'feed' | 'events' | 'traffic' | 'weather' | 'map') => void;
  savedCount: number;
  onOpenSaved: () => void;
  onOpenSubmit: () => void;
  onOpenAudioBriefing: () => void;
  isLiveStreaming: boolean;
  onToggleLiveStream: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  onOpenSaved,
  onOpenSubmit,
  onOpenAudioBriefing,
  isLiveStreaming,
  onToggleLiveStream,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b-2 border-stone-300 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveTab('feed')}
          className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-800 dark:focus-visible:ring-amber-400 rounded-lg p-1"
        >
          <div className="text-xl sm:text-2xl font-black tracking-tight text-stone-950 dark:text-stone-50 font-display flex items-center gap-2 whitespace-nowrap shrink-0">
            <span className="bg-gradient-to-r from-amber-800 via-stone-900 to-amber-950 dark:from-amber-400 dark:via-stone-200 dark:to-amber-300 bg-clip-text text-transparent">
              Evansville Local Buzz
            </span>
            <span className="hidden lg:inline-block text-xs font-semibold text-amber-800 dark:text-amber-400 font-sans tracking-normal border-l-2 border-stone-300 dark:border-stone-700 pl-2">
              Tri-State Real-Time
            </span>
          </div>
        </button>

        {/* Zone 2: Button-Centric Navigation Strip */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 bg-stone-100 dark:bg-stone-800/80 rounded-xl border border-stone-300 dark:border-stone-700 text-xs font-bold whitespace-nowrap">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeTab === 'feed'
                ? 'bg-amber-900 text-white border-amber-950 dark:bg-amber-600 dark:border-amber-500 shadow-xs'
                : 'border-transparent text-stone-700 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-700 hover:text-stone-950 dark:hover:text-white'
            }`}
          >
            Live Feed
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeTab === 'events'
                ? 'bg-amber-900 text-white border-amber-950 dark:bg-amber-600 dark:border-amber-500 shadow-xs'
                : 'border-transparent text-stone-700 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-700 hover:text-stone-950 dark:hover:text-white'
            }`}
          >
            Events Calendar
          </button>
          <button
            onClick={() => setActiveTab('traffic')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeTab === 'traffic'
                ? 'bg-amber-900 text-white border-amber-950 dark:bg-amber-600 dark:border-amber-500 shadow-xs'
                : 'border-transparent text-stone-700 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-700 hover:text-stone-950 dark:hover:text-white'
            }`}
          >
            Bridges & Traffic
          </button>
          <button
            onClick={() => setActiveTab('weather')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeTab === 'weather'
                ? 'bg-amber-900 text-white border-amber-950 dark:bg-amber-600 dark:border-amber-500 shadow-xs'
                : 'border-transparent text-stone-700 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-700 hover:text-stone-950 dark:hover:text-white'
            }`}
          >
            River & Weather
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'bg-amber-900 text-white border-amber-950 dark:bg-amber-600 dark:border-amber-500 shadow-xs'
                : 'border-transparent text-stone-700 dark:text-stone-300 hover:bg-stone-200/80 dark:hover:bg-stone-700 hover:text-stone-950 dark:hover:text-white'
            }`}
          >
            County Map
          </button>
        </nav>

        {/* Zone 3: Button-Centric Actions Strip */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Global Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle light and dark theme"
            className="flex items-center justify-center w-9 h-9 text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-stone-700" />
            )}
          </button>

          {/* Audio Morning Briefing Button */}
          <button
            onClick={onOpenAudioBriefing}
            title="Listen to 60-second Tri-State audio briefing"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-800 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-amber-100 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 rounded-lg transition-colors cursor-pointer shadow-2xs"
          >
            <Volume2 className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            <span className="hidden lg:inline">Audio Brief</span>
          </button>

          {/* Live stream toggle button */}
          <button
            onClick={onToggleLiveStream}
            title={isLiveStreaming ? 'Live stream active' : 'Live stream paused'}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer shadow-2xs ${
              isLiveStreaming
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-400 dark:border-emerald-700'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-300 dark:border-stone-700 hover:bg-stone-200'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${isLiveStreaming ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400'}`} />
            <span className="hidden md:inline">{isLiveStreaming ? 'Live Stream' : 'Paused'}</span>
          </button>

          {/* Saved Bookmarks Button */}
          <button
            onClick={onOpenSaved}
            title="View saved items"
            className="relative flex items-center justify-center w-9 h-9 text-stone-700 dark:text-stone-200 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 rounded-lg transition-colors cursor-pointer shadow-2xs"
            aria-label="View saved bookmarks"
          >
            <Bookmark className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            {savedCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-700 dark:bg-amber-500 text-white rounded-full text-[10px] font-black flex items-center justify-center shadow-xs">
                {savedCount}
              </span>
            )}
          </button>

          {/* Primary CTA Button */}
          <button
            onClick={onOpenSubmit}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-900 hover:bg-amber-950 dark:bg-amber-600 dark:hover:bg-amber-500 border border-amber-950 dark:border-amber-400 rounded-lg transition-colors shadow-xs cursor-pointer whitespace-nowrap active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Post Buzz</span>
          </button>
        </div>
      </div>

      {/* Mobile button navigation strip */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-stone-200 dark:border-stone-800 gap-1.5 bg-stone-100/90 dark:bg-stone-900/90 text-xs">
        {[
          { id: 'feed', label: 'Live Feed' },
          { id: 'events', label: 'Events' },
          { id: 'traffic', label: 'Bridges & Traffic' },
          { id: 'weather', label: 'River & Weather' },
          { id: 'map', label: 'Map' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg border whitespace-nowrap font-bold transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-amber-900 dark:bg-amber-600 text-white border-amber-950 dark:border-amber-500 shadow-2xs'
                : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </header>
  );
};
