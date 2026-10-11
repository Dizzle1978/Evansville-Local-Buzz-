import React, { useState, useEffect } from 'react';
import { FeedItem } from '../types';
import { Play, Pause, SkipForward, X, Radio } from 'lucide-react';

interface AudioBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: FeedItem[];
  onSelectItem: (item: FeedItem) => void;
}

export const AudioBriefingModal: React.FC<AudioBriefingModalProps> = ({
  isOpen,
  onClose,
  items,
  onSelectItem,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSupported, setIsSupported] = useState(true);

  const topItems = items.slice(0, 4);
  const currentItem = topItems[currentIndex];

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
    }
  }, []);

  const speakCurrent = (index: number) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const item = topItems[index];
    if (!item) {
      setIsPlaying(false);
      return;
    }

    const textToSpeak = `From ${item.countyLabel}. ${item.title}. ${item.summary}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      if (index + 1 < topItems.length) {
        setCurrentIndex(index + 1);
        speakCurrent(index + 1);
      } else {
        setIsPlaying(false);
      }
    };

    utterance.onerror = () => {
      setIsPlaying(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      speakCurrent(currentIndex);
    }
  };

  const handleNext = () => {
    window.speechSynthesis.cancel();
    const nextIdx = (currentIndex + 1) % topItems.length;
    setCurrentIndex(nextIdx);
    if (isPlaying) {
      speakCurrent(nextIdx);
    }
  };

  const handleClose = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-stone-300 dark:border-stone-800 transition-colors">
        {/* Header */}
        <div className="p-5 bg-amber-950 text-white flex items-center justify-between border-b-2 border-amber-900">
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
            <div>
              <h3 className="font-black text-base font-display">Tri-State Audio Digest</h3>
              <p className="text-xs text-amber-200">60-Second Evansville Local Buzz Briefing</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-lg text-amber-200 hover:text-white hover:bg-amber-900 transition-colors cursor-pointer"
            aria-label="Close audio player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Body */}
        <div className="p-6 space-y-6">
          {/* Equalizer Waveform */}
          <div className="flex items-center justify-center gap-1.5 h-14 py-2">
            {[40, 75, 50, 90, 60, 30, 85, 45, 95, 70, 55, 80].map((height, i) => (
              <span
                key={i}
                className={`w-1.5 bg-amber-700 dark:bg-amber-500 rounded-full transition-all duration-300 ${
                  isPlaying ? 'opacity-100' : 'opacity-30'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(18, (height * (i % 2 === 0 ? 1 : 0.7)))}%` : '20%',
                }}
              />
            ))}
          </div>

          {/* Current Headline Card with defined borders */}
          {currentItem && (
            <div className="bg-amber-50/60 dark:bg-stone-800/80 rounded-2xl p-4 border-2 border-amber-200/80 dark:border-stone-700">
              <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                <span className="font-extrabold text-stone-800 dark:text-stone-200 uppercase tracking-wider text-[11px]">
                  Story {currentIndex + 1} of {topItems.length}
                </span>
                <span className="font-bold text-amber-900 dark:text-amber-400">{currentItem.countyLabel}</span>
              </div>
              <h4 className="font-black text-stone-900 dark:text-stone-100 text-sm leading-snug mb-2 font-display">
                {currentItem.title}
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 leading-relaxed">
                {currentItem.summary}
              </p>
            </div>
          )}

          {/* Player Buttons with defined borders */}
          <div className="flex items-center justify-center gap-4 pt-1">
            <button
              onClick={handleTogglePlay}
              className="flex items-center justify-center w-14 h-14 bg-amber-900 hover:bg-amber-950 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-full shadow-lg border-2 border-amber-950 dark:border-amber-400 transition-transform hover:scale-105 cursor-pointer"
              aria-label={isPlaying ? 'Pause briefing' : 'Play briefing'}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
            </button>

            <button
              onClick={handleNext}
              className="p-3 text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 border border-stone-300 dark:border-stone-700 rounded-full transition-colors cursor-pointer"
              title="Next headline"
              aria-label="Next headline"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {!isSupported && (
            <p className="text-xs text-amber-900 dark:text-amber-200 text-center bg-amber-100 dark:bg-amber-950/60 p-2.5 rounded-xl border border-amber-300">
              Note: Speech synthesis is not supported on this device. You can read transcripts below.
            </p>
          )}

          {/* Playlist with borders */}
          <div className="space-y-1.5 pt-2 border-t-2 border-stone-100 dark:border-stone-800 text-xs">
            <span className="text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
              Stories in this digest:
            </span>
            {topItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  if (isPlaying) speakCurrent(idx);
                }}
                className={`p-2.5 rounded-xl flex items-center justify-between cursor-pointer border transition-colors ${
                  idx === currentIndex
                    ? 'bg-amber-100 dark:bg-amber-950/80 font-bold text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                    : 'hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border-transparent hover:border-stone-200'
                }`}
              >
                <span className="truncate pr-2">{idx + 1}. {item.title}</span>
                <span className="text-[10px] text-stone-500 dark:text-stone-400 shrink-0">{item.countyLabel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
