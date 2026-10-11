import React, { useState } from 'react';
import { CountyId, CategoryId, FeedItem } from '../types';
import { COUNTIES } from '../data/mockData';
import { X, Send, Calendar, MapPin, Image as ImageIcon } from 'lucide-react';

interface SubmitReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (item: FeedItem) => void;
}

const LOCAL_PHOTO_PRESETS = [
  {
    label: 'Evansville Riverfront & Pagoda',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Pagoda%2C_Evansville%2C_Indiana.jpg/800px-Pagoda%2C_Evansville%2C_Indiana.jpg',
  },
  {
    label: 'Historic West Franklin St Corridor',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/Bosse_Field_entrance.jpg/800px-Bosse_Field_entrance.jpg',
  },
  {
    label: 'Downtown Ford Center Arena',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Ford_Center_Evansville.jpg/800px-Ford_Center_Evansville.jpg',
  },
  {
    label: 'Historic Newburgh Riverfront',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Historic_Newburgh_Riverfront_Park.jpg/800px-Historic_Newburgh_Riverfront_Park.jpg',
  },
  {
    label: 'Historic New Harmony Atheneum',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/The_Atheneum_New_Harmony_Indiana.jpg/800px-The_Atheneum_New_Harmony_Indiana.jpg',
  },
  {
    label: 'US-41 Twin Bridges Crossing',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Bi-State_Vietnam_Gold_Star_Twin_Bridges_over_the_Ohio_River.jpg/800px-Bi-State_Vietnam_Gold_Star_Twin_Bridges_over_the_Ohio_River.jpg',
  },
];

export const SubmitReportModal: React.FC<SubmitReportModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [category, setCategory] = useState<CategoryId>('events');
  const [county, setCounty] = useState<CountyId>('vanderburgh');
  const [cityOrArea, setCityOrArea] = useState('Downtown Evansville');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [locationName, setLocationName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [imageUrl, setImageUrl] = useState(LOCAL_PHOTO_PRESETS[0].url);

  // Event specific fields
  const [dateTimeText, setDateTimeText] = useState('This Saturday · 10:00 AM');
  const [eventDate, setEventDate] = useState('2026-10-17');
  const [cost, setCost] = useState('Free');
  const [organizer, setOrganizer] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const countyObj = COUNTIES.find((c) => c.id === county);

    const newItem: FeedItem = {
      id: `user-post-${Date.now()}`,
      title: title.trim(),
      summary: summary.trim(),
      content: summary.trim(),
      county,
      countyLabel: countyObj ? countyObj.name : 'Vanderburgh Co.',
      cityOrArea: cityOrArea.trim() || 'Evansville',
      category,
      timestamp: 'Just now',
      publishedAt: new Date().toISOString(),
      isBreaking: category === 'breaking',
      isVerified: false,
      sourceName: authorName.trim() ? `Local Buzz: ${authorName.trim()}` : 'Community Member Post',
      locationName: locationName.trim() || `${cityOrArea}, IN`,
      coordinates: { lat: 37.9716, lng: -87.5711 },
      upvotes: 1,
      userSubmitted: true,
      authorName: authorName.trim() || 'Local Resident',
      tags: [category, county],
      imageUrl: imageUrl.trim() || undefined,
      imageCaption: `${locationName || cityOrArea} Local View`,
      imageTheme: category === 'events' ? 'arena' : category === 'breaking' ? 'civic' : 'historic',
      ...(category === 'events'
        ? {
            eventDetails: {
              dateTimeText,
              isoDate: eventDate,
              venue: locationName.trim() || 'Local Venue',
              address: locationName.trim() || `${cityOrArea}, IN`,
              cost: cost.trim() || 'Free',
              organizer: organizer.trim() || (authorName.trim() || 'Community Host'),
            },
          }
        : {}),
    };

    onSubmit(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white dark:bg-stone-900 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border-2 border-stone-300 dark:border-stone-800 my-8 transition-colors">
        <div className="p-5 bg-amber-950 text-white flex items-center justify-between border-b-2 border-amber-900">
          <div>
            <h3 className="font-black text-lg font-display">Post Evansville Local Buzz</h3>
            <p className="text-xs text-amber-200">Share events, breaking community tips, or notices across Tri-State</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-amber-200 hover:text-white hover:bg-amber-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {/* Category selection */}
          <div>
            <label className="block text-xs font-extrabold text-stone-800 dark:text-stone-200 uppercase tracking-wider mb-1.5">
              Type of Post
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'events', label: 'Local Event' },
                { id: 'breaking', label: 'Breaking News' },
                { id: 'community', label: 'Community Update' },
                { id: 'traffic', label: 'Traffic Alert' },
                { id: 'food', label: 'Food & Market' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id as CategoryId)}
                  className={`p-2.5 rounded-xl border-2 text-center font-bold transition-all cursor-pointer ${
                    category === cat.id
                      ? 'bg-amber-800 text-white border-amber-950 dark:bg-amber-600 dark:border-amber-400 shadow-2xs'
                      : 'bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Headline / Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. West Franklin Street Artisan Night Market"
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-medium focus:outline-none focus:ring-2 focus:ring-amber-800 dark:focus:ring-amber-400"
            />
          </div>

          {/* County & Neighborhood */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                County Area *
              </label>
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value as CountyId)}
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-bold focus:outline-none focus:ring-2 focus:ring-amber-800"
              >
                {COUNTIES.filter(c => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.seat})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Neighborhood / City *
              </label>
              <input
                type="text"
                value={cityOrArea}
                onChange={(e) => setCityOrArea(e.target.value)}
                placeholder="e.g. West Franklin, Newburgh, Mt Vernon"
                className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-medium focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>
          </div>

          {/* Image Selection / Preset */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
              <span>Area Photograph (Preset or Custom URL)</span>
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {LOCAL_PHOTO_PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setImageUrl(p.url)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border-2 font-bold cursor-pointer transition-colors ${
                    imageUrl === p.url
                      ? 'bg-amber-900 text-white border-amber-950 dark:bg-amber-600 dark:border-amber-400'
                      : 'bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-300 dark:border-stone-700 hover:bg-stone-100'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Paste public image URL or select from presets above"
              className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 font-mono"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Specific Location or Venue Address
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. 2100 W Franklin St or Old Lock & Dam Park"
                className="w-full pl-10 pr-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-medium"
              />
            </div>
          </div>

          {/* Event specifics if event */}
          {category === 'events' && (
            <div className="p-3.5 bg-amber-50/70 dark:bg-stone-800/80 rounded-2xl border-2 border-amber-200/80 dark:border-amber-950/60 space-y-3">
              <div className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Event Date & Details</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">Date & Time</label>
                  <input
                    type="text"
                    value={dateTimeText}
                    onChange={(e) => setDateTimeText(e.target.value)}
                    placeholder="e.g. Saturday · 2:00 PM"
                    className="w-full px-3 py-1.5 bg-white dark:bg-stone-700 border-2 border-stone-300 dark:border-stone-600 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">Admission</label>
                  <input
                    type="text"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    placeholder="e.g. Free or $5"
                    className="w-full px-3 py-1.5 bg-white dark:bg-stone-700 border-2 border-stone-300 dark:border-stone-600 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 dark:text-stone-400 mb-1">Organizer</label>
                  <input
                    type="text"
                    value={organizer}
                    onChange={(e) => setOrganizer(e.target.value)}
                    placeholder="e.g. Neighborhood Guild"
                    className="w-full px-3 py-1.5 bg-white dark:bg-stone-700 border-2 border-stone-300 dark:border-stone-600 rounded-lg text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Description & Details *
            </label>
            <textarea
              required
              rows={3}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Provide background, parking info, and details for neighbors..."
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-medium"
            />
          </div>

          {/* Author attribution */}
          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Your Name or Organization (Optional)
            </label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Sarah J., West Side Resident or Newburgh Guild"
              className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 font-medium"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t-2 border-stone-200 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-900 hover:bg-amber-950 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-xl font-bold cursor-pointer shadow-xs border border-amber-950 dark:border-amber-400 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Buzz</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
