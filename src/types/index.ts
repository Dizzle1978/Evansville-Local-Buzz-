export type CountyId = 'all' | 'vanderburgh' | 'warrick' | 'posey' | 'gibson' | 'henderson' | 'spencer';

export interface CountyInfo {
  id: CountyId;
  name: string;
  seat: string;
  state: 'IN' | 'KY';
  highlight: string;
}

export type CategoryId = 'all' | 'breaking' | 'events' | 'traffic' | 'community' | 'weather' | 'food';

export interface CategoryInfo {
  id: CategoryId;
  label: string;
  description: string;
}

export interface EventDetails {
  dateTimeText: string;
  isoDate: string; // YYYY-MM-DD
  venue: string;
  address: string;
  cost: string;
  organizer: string;
  ticketUrl?: string;
}

export interface TrafficDetails {
  corridor: string;
  status: 'smooth' | 'moderate' | 'heavy' | 'closed';
  incidentType: string;
  alternateRoute?: string;
}

export interface FeedItem {
  id: string;
  title: string;
  summary: string;
  content: string;
  county: CountyId;
  countyLabel: string;
  cityOrArea: string;
  category: CategoryId;
  timestamp: string; // e.g. "8 mins ago"
  publishedAt: string; // ISO date or time
  isBreaking?: boolean;
  isVerified?: boolean;
  sourceName: string;
  locationName: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  eventDetails?: EventDetails;
  trafficDetails?: TrafficDetails;
  userSubmitted?: boolean;
  authorName?: string;
  upvotes: number;
  tags?: string[];
  imageUrl?: string;
  imageCaption?: string;
  imageTheme: 'river' | 'arena' | 'historic' | 'civic' | 'traffic' | 'weather' | 'food' | 'community';
}

export interface OhioRiverGauge {
  stageFeet: number;
  trend: 'rising' | 'steady' | 'falling';
  floodStageFeet: number;
  status: 'Normal Pool' | 'Action Stage' | 'Minor Flood' | 'Moderate Flood';
  waterTempF: number;
  updatedAt: string;
}

export interface WeatherSummary {
  tempF: number;
  condition: string;
  highF: number;
  lowF: number;
  humidity: number;
  windMph: number;
  airQuality: string;
}

export interface TrafficCorridorStatus {
  id: string;
  name: string;
  segment: string;
  status: 'Normal' | 'Moderate Delay' | 'Heavy Congestion' | 'Restricted Lanes';
  delayMinutes: number;
  note: string;
}
