import { motion } from 'framer-motion';
import { MapPin, Calendar, Sliders, Play, RefreshCw } from 'lucide-react';

interface SidebarControlsProps {
  region: string;
  setRegion: (region: string) => void;
  datetime: string;
  setDatetime: (datetime: string) => void;
  horizon: number;
  setHorizon: (horizon: number) => void;
  regions: string[];
  onForecast: () => void;
  loading: boolean;
}

export function SidebarControls({
  region,
  setRegion,
  datetime,
  setDatetime,
  horizon,
  setHorizon,
  regions,
  onForecast,
  loading
}: SidebarControlsProps) {

  // Helper to instantly snap the calendar to common forecasting times
  const shiftTime = (hours: number) => {
    const d = new Date();
    d.setHours(d.getHours() + hours);
    d.setMinutes(0);
    // Format to local ISO-like string for datetime-local input
    const tzoffset = d.getTimezoneOffset() * 60000;
    const localISOTime = (new Date(d.getTime() - tzoffset)).toISOString().slice(0, 16);
    setDatetime(localISOTime);
  };

  return (
    <div className="flex flex-col space-y-6">
      
      {/* Header section */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-cyan-400">
          Inference Controls
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Adjust temporal memory parameters & trigger LightGBM step-ahead pipeline.
        </p>
      </div>

      <div className="space-y-5">
        
        {/* 1. Region Selector */}
        <div>
          <label className="mb-2 flex items-center text-xs font-medium text-slate-300">
            <MapPin className="mr-1.5 h-3.5 w-3.5 text-cyan-400" />
            Target Geo-Region
          </label>
          <div className="relative">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full appearance-none rounded-xl border border-slate-700 bg-slate-900/90 px-4 py-2.5 text-sm text-white shadow-inner transition-colors focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              {regions.map((reg) => (
                <option key={reg} value={reg} className="bg-slate-900 text-white">
                  {reg}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* 2. UPGRADED: Quick-Select DateTime Picker */}
        <div>
          <label className="mb-2 flex items-center text-xs font-medium text-slate-300">
            <Calendar className="mr-1.5 h-3.5 w-3.5 text-purple-400" />
            Forecast Origin Date & Time
          </label>
          <div className="rounded-xl border border-slate-700 bg-slate-900/90 p-2 shadow-inner transition-colors focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500">
            <input
              type="datetime-local"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              className="w-full bg-transparent p-2 text-sm text-white focus:outline-none [color-scheme:dark] font-mono"
            />
            {/* Quick-Action Pills */}
            <div className="mt-2 flex gap-2">
              <button onClick={() => shiftTime(0)} className="flex-1 rounded border border-cyan-900/50 bg-[#0b192c] py-1.5 text-[9px] font-bold uppercase text-cyan-400 transition-colors hover:bg-cyan-900/40">Live Now</button>
              <button onClick={() => shiftTime(1)} className="flex-1 rounded border border-slate-700 bg-slate-800 py-1.5 text-[9px] font-bold uppercase text-slate-300 transition-colors hover:bg-slate-700">+1 Hour</button>
              <button onClick={() => shiftTime(5)} className="flex-1 rounded border border-slate-700 bg-slate-800 py-1.5 text-[9px] font-bold uppercase text-slate-300 transition-colors hover:bg-slate-700">Next Peak</button>
            </div>
          </div>
        </div>

        {/* 3. Forecast Horizon Slider */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="flex items-center text-xs font-medium text-slate-300">
              <Sliders className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
              Forecast Horizon
            </label>
            <span className="rounded bg-emerald-950/60 px-2 py-0.5 text-xs font-mono font-bold text-emerald-400">
              {horizon} Hours ({horizon * 4} Steps)
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={24}
            step={1}
            value={horizon}
            onChange={(e) => setHorizon(parseInt(e.target.value, 10))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-800 accent-emerald-500 transition-all hover:bg-slate-700"
          />
        </div>

        {/* 4. Action Button */}
        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.985 }}
            onClick={onForecast}
            disabled={loading}
            className={`relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 p-[1px] font-medium text-white shadow-lg shadow-cyan-500/20 transition-all ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-cyan-500/40'
            }`}
          >
            <div className="relative flex w-full items-center justify-center space-x-2 rounded-[11px] bg-slate-950 py-3 transition-colors hover:bg-slate-900/60">
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
                  <span className="text-xs font-semibold tracking-wide text-cyan-300">
                    Executing Recursion...
                  </span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 text-cyan-400 fill-cyan-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Compute Forecast
                  </span>
                </>
              )}
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
}