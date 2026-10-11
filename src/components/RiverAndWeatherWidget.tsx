import React, { useState } from 'react';
import { OhioRiverGauge, WeatherSummary } from '../types';
import { Waves, CloudSun, Wind, Droplets, Sun } from 'lucide-react';

interface RiverAndWeatherWidgetProps {
  gauge: OhioRiverGauge;
  weather: WeatherSummary;
}

export const RiverAndWeatherWidget: React.FC<RiverAndWeatherWidgetProps> = ({
  gauge,
  weather,
}) => {
  const [viewMode, setViewMode] = useState<'gauge' | 'forecast'>('gauge');

  const stagePercent = Math.min(100, Math.round((gauge.stageFeet / gauge.floodStageFeet) * 100));

  return (
    <div className="bg-white dark:bg-stone-900 rounded-2xl border-2 border-stone-300 dark:border-stone-800 overflow-hidden shadow-xs transition-colors">
      {/* Widget Header with segmented button toggle */}
      <div className="p-4 border-b-2 border-stone-200 dark:border-stone-800 flex items-center justify-between bg-amber-50/30 dark:bg-stone-950/40">
        <div className="flex items-center gap-2">
          <Waves className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
          <h2 className="text-sm font-extrabold text-stone-900 dark:text-stone-100 font-display">
            Ohio River & Weather
          </h2>
        </div>

        <div className="flex items-center p-1 bg-stone-200/80 dark:bg-stone-800 rounded-xl border border-stone-300 dark:border-stone-700 text-xs">
          <button
            onClick={() => setViewMode('gauge')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'gauge'
                ? 'bg-amber-900 text-white dark:bg-amber-600 shadow-2xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
            }`}
          >
            River Gauge
          </button>
          <button
            onClick={() => setViewMode('forecast')}
            className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              viewMode === 'forecast'
                ? 'bg-amber-900 text-white dark:bg-amber-600 shadow-2xs'
                : 'text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
            }`}
          >
            Weather
          </button>
        </div>
      </div>

      {viewMode === 'gauge' ? (
        <div className="p-4 space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-black font-mono tabular-nums text-stone-900 dark:text-stone-100">
                {gauge.stageFeet} <span className="text-sm font-sans font-normal text-stone-500 dark:text-stone-400">feet</span>
              </div>
              <div className="text-xs text-stone-600 dark:text-stone-400 mt-0.5">
                Evansville Gauge (EVVI3) · Flood Stage is 42.0 ft
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-cyan-900 dark:text-cyan-200 bg-cyan-100 dark:bg-cyan-950/80 px-2.5 py-1 rounded-lg border border-cyan-300 dark:border-cyan-800 inline-block">
                {gauge.status}
              </span>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-1 capitalize font-medium">
                Trend: {gauge.trend}
              </div>
            </div>
          </div>

          {/* Visual Gauge Bar */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 font-medium mb-1.5">
              <span>Pool Level</span>
              <span>Action (38 ft)</span>
              <span>Flood Stage (42 ft)</span>
            </div>
            <div className="w-full bg-stone-200 dark:bg-stone-800 h-3 rounded-full overflow-hidden relative border border-stone-300 dark:border-stone-700">
              <div
                className="bg-cyan-600 dark:bg-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${stagePercent}%` }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-amber-500"
                style={{ left: `${(38 / 42) * 100}%` }}
                title="Action Stage (38 ft)"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t-2 border-stone-100 dark:border-stone-800">
            <div className="text-stone-600 dark:text-stone-300">
              Water Temp: <span className="font-bold text-stone-900 dark:text-stone-100 font-mono">{gauge.waterTempF}°F</span>
            </div>
            <div className="text-right text-stone-500 dark:text-stone-400">
              Esplanade: <span className="font-bold text-emerald-700 dark:text-emerald-400">Open & Dry</span>
            </div>
          </div>

          <div className="text-[11px] text-stone-400 dark:text-stone-500 font-mono">
            Updated {gauge.updatedAt}
          </div>
        </div>
      ) : (
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CloudSun className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              <div>
                <div className="text-2xl font-black font-mono text-stone-900 dark:text-stone-100">
                  {weather.tempF}°F
                </div>
                <div className="text-xs text-stone-600 dark:text-stone-300 font-semibold">{weather.condition}</div>
              </div>
            </div>

            <div className="text-right text-xs">
              <div className="font-bold text-stone-800 dark:text-stone-200">
                H: {weather.highF}° · L: {weather.lowF}°
              </div>
              <div className="text-stone-500 dark:text-stone-400 mt-0.5">Evansville Regional</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t-2 border-stone-100 dark:border-stone-800 text-xs text-stone-600 dark:text-stone-300">
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              <span className="font-medium">{weather.humidity}% Hum</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
              <span className="font-medium">{weather.windMph} mph</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="truncate font-medium">{weather.airQuality}</span>
            </div>
          </div>

          <div className="text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between pt-1">
            <span>Sunset on Riverfront: 6:18 PM CDT</span>
            <span className="text-amber-800 dark:text-amber-400 font-bold">NWS Paducah</span>
          </div>
        </div>
      )}
    </div>
  );
};
