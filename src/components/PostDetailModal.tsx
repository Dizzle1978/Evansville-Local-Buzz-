import React from 'react';
import { FeedItem } from '../types';
import { CardVisual } from './CardVisual';
import { X, Calendar, MapPin, Share2, ThumbsUp, Bookmark, ExternalLink, Check, Navigation } from 'lucide-react';

interface PostDetailModalProps {
  item: FeedItem | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onUpvote: (id: string) => void;
  hasUpvoted: boolean;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  item,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onUpvote,
  hasUpvoted,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!item) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    item.locationName || `${item.cityOrArea}, Indiana`
  )}`;

  const handleDownloadIcs = () => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border-2 border-stone-300 dark:border-stone-800 my-6 transition-colors">
        {/* Visual Hero */}
        <div className="relative border-b-2 border-stone-200 dark:border-stone-800">
          <CardVisual
            theme={item.imageTheme}
            title={item.locationName}
            imageUrl={item.imageUrl}
            imageCaption={item.imageCaption}
            className="h-64 sm:h-72"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-stone-900/80 hover:bg-stone-950 text-white rounded-full transition-colors cursor-pointer border border-stone-700"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Metadata */}
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2">
              <span className="font-extrabold text-amber-900 dark:text-amber-400">{item.countyLabel}</span>
              <span aria-hidden="true">·</span>
              <span>{item.cityOrArea}</span>
              <span aria-hidden="true">·</span>
              <span>{item.timestamp}</span>
              {item.isBreaking && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-amber-700 dark:text-amber-400 font-extrabold uppercase tracking-wider text-[11px]">
                    Breaking Alert
                  </span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 leading-tight font-display">
              {item.title}
            </h1>
          </div>

          {/* Event Details Box */}
          {item.eventDetails && (
            <div className="bg-amber-50/70 dark:bg-stone-800/80 rounded-2xl p-4 sm:p-5 border-2 border-amber-200/80 dark:border-amber-950/60 space-y-3">
              <div className="flex items-center gap-2 text-amber-950 dark:text-amber-200 font-bold text-sm font-display">
                <Calendar className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                <span>Event Information</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-stone-500 dark:text-stone-400 block">Date & Time</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">{item.eventDetails.dateTimeText}</span>
                </div>
                <div>
                  <span className="text-stone-500 dark:text-stone-400 block">Admission</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">{item.eventDetails.cost}</span>
                </div>
                <div>
                  <span className="text-stone-500 dark:text-stone-400 block">Venue</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">{item.eventDetails.venue}</span>
                </div>
                <div>
                  <span className="text-stone-500 dark:text-stone-400 block">Organizer</span>
                  <span className="font-bold text-stone-900 dark:text-stone-100">{item.eventDetails.organizer}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  onClick={handleDownloadIcs}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-900 hover:bg-amber-950 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors border border-amber-950 dark:border-amber-400 shadow-2xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Download .ics Calendar Invite</span>
                </button>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Open Directions</span>
                </a>
              </div>
            </div>
          )}

          {/* Traffic Details Box */}
          {item.trafficDetails && (
            <div className="bg-stone-50 dark:bg-stone-800/80 rounded-2xl p-4 border-2 border-stone-200 dark:border-stone-700 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-stone-900 dark:text-stone-100">{item.trafficDetails.corridor}</span>
                <span className="capitalize font-bold text-amber-800 dark:text-amber-400">
                  {item.trafficDetails.incidentType}
                </span>
              </div>
              <p className="text-stone-600 dark:text-stone-300">{item.trafficDetails.alternateRoute}</p>
            </div>
          )}

          {/* Main Story Content */}
          <div className="prose prose-stone dark:prose-invert text-sm sm:text-base leading-relaxed text-stone-700 dark:text-stone-300">
            <p className="font-semibold text-stone-900 dark:text-stone-100 text-base sm:text-lg mb-3">
              {item.summary}
            </p>
            <p>
              {item.content}
            </p>
          </div>

          {/* Location details */}
          <div className="p-3.5 bg-stone-50 dark:bg-stone-800/70 rounded-xl flex items-center justify-between text-xs text-stone-600 dark:text-stone-300 border-2 border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2 truncate pr-2">
              <MapPin className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
              <span className="truncate font-medium">{item.locationName}</span>
            </div>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-800 dark:text-amber-400 hover:underline font-bold shrink-0 flex items-center gap-1"
            >
              <span>Map</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Citation & Source */}
          <div className="pt-2 border-t-2 border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs text-stone-400 dark:text-stone-500 font-medium">
            <div>
              Reported by: <span className="text-stone-700 dark:text-stone-300 font-bold">{item.sourceName}</span>
            </div>
            <div>
              {item.userSubmitted ? 'Verified Local Submission' : 'Official Press Wire'}
            </div>
          </div>

          {/* Button-Centric Action strip */}
          <div className="pt-4 border-t-2 border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onUpvote(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border cursor-pointer transition-colors ${
                  hasUpvoted
                    ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800'
                    : 'bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Helpful ({item.upvotes + (hasUpvoted ? 1 : 0)})</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>

            <button
              onClick={() => onToggleBookmark(item.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors border shadow-2xs ${
                isBookmarked
                  ? 'bg-amber-800 hover:bg-amber-900 text-white border-amber-950 dark:border-amber-500'
                  : 'bg-stone-900 hover:bg-stone-800 text-white border-stone-950 dark:border-stone-700'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
              <span>{isBookmarked ? 'Saved in Buzz' : 'Save Story'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
