import React from 'react';
import { FeedItem } from '../types';
import { CardVisual } from './CardVisual';
import { Bookmark, Share2, ThumbsUp, Calendar, MapPin, ArrowRight, Check } from 'lucide-react';

interface FeedCardProps {
  item: FeedItem;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onSelectItem: (item: FeedItem) => void;
  onUpvote: (id: string) => void;
  hasUpvoted: boolean;
}

export const FeedCard: React.FC<FeedCardProps> = ({
  item,
  isBookmarked,
  onToggleBookmark,
  onSelectItem,
  onUpvote,
  hasUpvoted,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(`${window.location.origin}/#${item.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadIcs = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.eventDetails) return;

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Evansville Local Buzz//Evansville Events//EN
BEGIN:VEVENT
UID:${item.id}@evansvillelocalbuzz.in
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART:${item.eventDetails.isoDate.replace(/-/g, '')}T180000Z
SUMMARY:${item.title.replace(/,/g, '\\,')}
DESCRIPTION:${item.summary.replace(/,/g, '\\,')}
LOCATION:${item.eventDetails.address.replace(/,/g, '\\,')}
ORGANIZER:${item.eventDetails.organizer.replace(/,/g, '\\,')}
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${item.title.slice(0, 25).replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <article
      onClick={() => onSelectItem(item)}
      className="group bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-300 dark:border-stone-800 overflow-hidden hover:border-amber-700 dark:hover:border-amber-500 transition-all cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md"
    >
      <div>
        {/* Visual Header with subtle bottom border */}
        <div className="border-b-2 border-stone-200 dark:border-stone-800">
          <CardVisual
            theme={item.imageTheme}
            title={item.locationName}
            imageUrl={item.imageUrl}
            imageCaption={item.imageCaption}
          />
        </div>

        <div className="p-5">
          {/* Unboxed Metadata with Typographic Separator */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-2.5">
            <span className="font-extrabold text-amber-900 dark:text-amber-400">{item.countyLabel}</span>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
            <span>{item.cityOrArea}</span>
            <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
            <span>{item.timestamp}</span>
            {item.isBreaking && (
              <>
                <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
                <span className="text-amber-700 dark:text-amber-400 font-bold uppercase tracking-wider text-[11px]">
                  Breaking Buzz
                </span>
              </>
            )}
          </div>

          {/* Primary Title with text-wrap balance */}
          <h2 className="text-lg font-extrabold text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors leading-snug tracking-tight mb-2.5 font-display">
            {item.title}
          </h2>

          {/* Summary */}
          <p className="text-sm text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed mb-4 font-normal">
            {item.summary}
          </p>

          {/* Special metadata fields if event or traffic */}
          {item.eventDetails && (
            <div className="bg-amber-50/70 dark:bg-stone-800/80 rounded-xl p-3 text-xs border-2 border-amber-200/70 dark:border-amber-950/60 mb-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-amber-950 dark:text-amber-200 font-bold">
                <Calendar className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
                <span>{item.eventDetails.dateTimeText}</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-600 dark:text-stone-300">
                <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span className="truncate">{item.eventDetails.venue} · {item.eventDetails.cost}</span>
              </div>
            </div>
          )}

          {item.trafficDetails && (
            <div className="bg-amber-50/60 dark:bg-stone-800/80 rounded-xl p-3 text-xs border-2 border-amber-300/70 dark:border-amber-900/60 mb-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 dark:text-amber-200">{item.trafficDetails.corridor}</span>
                <span className="text-stone-700 dark:text-stone-300 capitalize font-bold">{item.trafficDetails.incidentType}</span>
              </div>
              <p className="text-amber-900 dark:text-amber-300/90 text-[11px]">{item.trafficDetails.alternateRoute}</p>
            </div>
          )}

          {/* Unboxed Source Citation */}
          <div className="text-xs text-stone-500 dark:text-stone-400">
            Source: <span className="text-stone-700 dark:text-stone-200 font-semibold">{item.sourceName}</span>
          </div>
        </div>
      </div>

      {/* Button-Centric Card Action Footer */}
      <div className="px-4 py-3 bg-stone-50 dark:bg-stone-950/50 border-t-2 border-stone-200 dark:border-stone-800 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          {/* Upvote Button with border */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onUpvote(item.id);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors cursor-pointer ${
              hasUpvoted
                ? 'text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800 font-bold'
                : 'text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
            }`}
            title="Helpful update"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="font-mono tabular-nums font-bold">{item.upvotes + (hasUpvoted ? 1 : 0)}</span>
          </button>

          {/* Share Button with border */}
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-2.5 py-1.5 text-stone-700 dark:text-stone-300 bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
            title="Share story link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline font-semibold">{copied ? 'Copied' : 'Share'}</span>
          </button>

          {/* Add to Cal Button with border if event */}
          {item.eventDetails && (
            <button
              onClick={handleDownloadIcs}
              className="flex items-center gap-1 px-2.5 py-1.5 text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer font-bold"
              title="Add event to calendar (.ics)"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Cal</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Bookmark Button with border */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(item.id);
            }}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isBookmarked
                ? 'text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/80 border-amber-300 dark:border-amber-800'
                : 'text-stone-600 dark:text-stone-400 bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this update'}
            aria-label="Bookmark"
          >
            <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>

          {/* Details CTA button with defined border */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelectItem(item);
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-stone-900 dark:bg-stone-800 hover:bg-amber-900 dark:hover:bg-amber-600 text-white rounded-lg border border-stone-950 dark:border-stone-700 font-bold transition-colors cursor-pointer shadow-2xs"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};
