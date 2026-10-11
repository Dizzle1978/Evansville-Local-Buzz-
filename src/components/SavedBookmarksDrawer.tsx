import React from 'react';
import { FeedItem } from '../types';
import { Bookmark, X, ArrowRight, Trash2 } from 'lucide-react';

interface SavedBookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedItems: FeedItem[];
  onSelectItem: (item: FeedItem) => void;
  onRemoveBookmark: (id: string) => void;
}

export const SavedBookmarksDrawer: React.FC<SavedBookmarksDrawerProps> = ({
  isOpen,
  onClose,
  savedItems,
  onSelectItem,
  onRemoveBookmark,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-stone-900/50 backdrop-blur-2xs">
      <div className="w-full max-w-md bg-white dark:bg-stone-900 h-full shadow-2xl flex flex-col justify-between border-l-2 border-stone-300 dark:border-stone-800 animate-in slide-in-from-right duration-200 transition-colors">
        <div>
          {/* Header */}
          <div className="p-5 border-b-2 border-stone-200 dark:border-stone-800 flex items-center justify-between bg-amber-50/40 dark:bg-stone-950/40">
            <div className="flex items-center gap-2.5">
              <Bookmark className="w-5 h-5 text-amber-700 dark:text-amber-400" />
              <div>
                <h3 className="font-black text-stone-900 dark:text-stone-100 text-base font-display">My Saved Buzz</h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">{savedItems.length} bookmarked alerts & events</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List with clearly defined entry borders */}
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-140px)] space-y-3">
            {savedItems.length === 0 ? (
              <div className="py-14 text-center text-stone-400 dark:text-stone-500">
                <Bookmark className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-bold text-stone-700 dark:text-stone-300">No saved updates yet</p>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-xs mx-auto">
                  Click the bookmark button on any card in the feed to save it here for quick access.
                </p>
              </div>
            ) : (
              savedItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectItem(item);
                    onClose();
                  }}
                  className="group p-4 rounded-2xl border-2 border-stone-300 dark:border-stone-800 hover:border-amber-700 dark:hover:border-amber-500 bg-white dark:bg-stone-850 hover:bg-amber-50/30 dark:hover:bg-stone-800 transition-all cursor-pointer flex flex-col justify-between shadow-2xs"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-1.5">
                      <span className="font-extrabold text-amber-900 dark:text-amber-400">{item.countyLabel}</span>
                      <span>{item.cityOrArea}</span>
                    </div>
                    <h4 className="text-sm font-black text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 leading-snug line-clamp-2">
                      {item.title}
                    </h4>
                  </div>

                  {/* Button row */}
                  <div className="mt-3.5 pt-2.5 border-t-2 border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBookmark(item.id);
                      }}
                      className="text-stone-500 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 font-bold cursor-pointer"
                      title="Remove bookmark"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>

                    <button
                      onClick={() => {
                        onSelectItem(item);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-stone-900 dark:bg-stone-800 text-white rounded-lg font-bold flex items-center gap-1 hover:bg-amber-900 transition-colors shadow-2xs"
                    >
                      <span>Open</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-stone-800 dark:text-stone-200 bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-xl transition-colors cursor-pointer"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
