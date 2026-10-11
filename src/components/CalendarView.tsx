import React, { useState } from 'react';
import { FeedItem, CountyId } from '../types';
import { Calendar, MapPin, Download, ArrowRight } from 'lucide-react';
import { CardVisual } from './CardVisual';

interface CalendarViewProps {
  events: FeedItem[];
  selectedCounty: CountyId;
  onSelectCounty: (county: CountyId) => void;
  onSelectItem: (item: FeedItem) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  selectedCounty,
  onSelectCounty,
  onSelectItem,
}) => {
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'weekend'>('all');

  const filteredEvents = events.filter((ev) => {
    if (selectedCounty !== 'all' && ev.county !== selectedCounty) return false;
    if (timeFilter === 'today' && !ev.eventDetails?.dateTimeText.toLowerCase().includes('today') && !ev.eventDetails?.dateTimeText.toLowerCase().includes('tonight')) {
      return false;
    }
    if (timeFilter === 'weekend' && !ev.eventDetails?.dateTimeText.toLowerCase().includes('weekend') && !ev.eventDetails?.dateTimeText.toLowerCase().includes('saturday') && !ev.eventDetails?.dateTimeText.toLowerCase().includes('sunday')) {
      return false;
    }
    return true;
  });

  const handleDownloadIcs = (item: FeedItem, e: React.MouseEvent) => {
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
    <div className="space-y-6">
      {/* Calendar Header with defined borders */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-300 dark:border-stone-800 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div>
          <h2 className="text-xl font-black text-stone-900 dark:text-stone-100 font-display flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            <span>Tri-State Community Events & Culture</span>
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 font-medium">
            Concerts, festivals, sports, farmers markets & arts across Evansville and neighboring counties
          </p>
        </div>

        {/* Time Filter Segmented Buttons */}
        <div className="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800 p-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-xs">
          <button
            onClick={() => setTimeFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              timeFilter === 'all'
                ? 'bg-amber-900 text-white dark:bg-amber-600 shadow-2xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
            }`}
          >
            All Dates
          </button>
          <button
            onClick={() => setTimeFilter('today')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              timeFilter === 'today'
                ? 'bg-amber-900 text-white dark:bg-amber-600 shadow-2xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
            }`}
          >
            Today & Tonight
          </button>
          <button
            onClick={() => setTimeFilter('weekend')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              timeFilter === 'weekend'
                ? 'bg-amber-900 text-white dark:bg-amber-600 shadow-2xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
            }`}
          >
            This Weekend
          </button>
        </div>
      </div>

      {/* Events Grid with clearly defined card borders */}
      {filteredEvents.length === 0 ? (
        <div className="bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-300 dark:border-stone-800 p-12 text-center text-stone-500 shadow-xs">
          <Calendar className="w-10 h-10 text-stone-400 mx-auto mb-3" />
          <h3 className="font-bold text-stone-800 dark:text-stone-200 text-sm">No events found for this filter</h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">Try switching to 'All Dates' or choosing 'All Tri-State' counties.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((item) => (
            <article
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="group bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-300 dark:border-stone-800 overflow-hidden hover:border-amber-700 dark:hover:border-amber-500 transition-all cursor-pointer flex flex-col justify-between shadow-xs hover:shadow-md"
            >
              <div>
                <div className="border-b-2 border-stone-200 dark:border-stone-800">
                  <CardVisual
                    theme={item.imageTheme}
                    title={item.eventDetails?.venue || item.locationName}
                    imageUrl={item.imageUrl}
                    imageCaption={item.imageCaption}
                  />
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-2">
                    <span className="font-extrabold text-amber-900 dark:text-amber-400">{item.countyLabel}</span>
                    <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">·</span>
                    <span>{item.cityOrArea}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-stone-900 dark:text-stone-100 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition-colors leading-snug font-display mb-3">
                    {item.title}
                  </h3>

                  <div className="bg-amber-50/70 dark:bg-stone-800/80 rounded-xl p-3 text-xs border-2 border-amber-200/80 dark:border-amber-950/60 space-y-1.5 mb-3">
                    <div className="font-extrabold text-amber-950 dark:text-amber-200 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
                      <span>{item.eventDetails?.dateTimeText}</span>
                    </div>
                    <div className="text-stone-600 dark:text-stone-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span className="truncate">{item.eventDetails?.venue}</span>
                    </div>
                    <div className="text-stone-600 dark:text-stone-400 font-medium">
                      Admission: <span className="font-bold text-stone-900 dark:text-stone-100">{item.eventDetails?.cost}</span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>

              {/* Action buttons with borders */}
              <div className="px-5 py-3.5 bg-stone-50 dark:bg-stone-950/50 border-t-2 border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
                <button
                  onClick={(e) => handleDownloadIcs(item, e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-lg hover:bg-amber-100 font-bold transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.ics Invite</span>
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectItem(item);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-stone-900 dark:bg-stone-800 hover:bg-amber-900 dark:hover:bg-amber-600 text-white rounded-lg border border-stone-950 dark:border-stone-700 font-bold transition-colors cursor-pointer shadow-2xs"
                >
                  <span>Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
