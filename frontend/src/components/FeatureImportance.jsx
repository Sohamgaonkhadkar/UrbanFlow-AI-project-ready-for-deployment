import React from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

// Mock Data: Top 10 LightGBM Features
const MOCK_FEATURES = [
  { name: 'region_lag_1', score: 1420, percentage: 85 },
  { name: 'rolling_mean_24', score: 1150, percentage: 70 },
  { name: 'hour_sin', score: 980, percentage: 62 },
  { name: 'region', score: 890, percentage: 55 },
  { name: 'lag_168', score: 750, percentage: 48 },
  { name: 'is_peak_hour', score: 620, percentage: 38 },
  { name: 'temperature_2m', score: 450, percentage: 28 },
  { name: 'day_of_week', score: 320, percentage: 22 },
  { name: 'is_raining', score: 210, percentage: 15 },
  { name: 'rolling_std_24', score: 150, percentage: 10 },
];

const FeatureImportance = () => {
  return (
    <div className="h-full min-h-[320px] w-full rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-md p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-purple-400" />
          <h3 className="text-sm font-semibold tracking-wider text-gray-200 uppercase">
            Model Telemetry
          </h3>
        </div>
        <span className="text-[10px] text-gray-500 font-mono">LGBM_GAIN_METRIC</span>
      </div>

      {/* Feature Bars */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
        {MOCK_FEATURES.map((feat, index) => (
          <div key={feat.name} className="flex flex-col gap-1">
            <div className="flex justify-between items-baseline text-xs font-mono">
              <span className="text-gray-300 truncate pr-2">{feat.name}</span>
              <span className="text-gray-400">{feat.score}</span>
            </div>
            
            {/* Glowing Track */}
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${feat.percentage}%` }}
                transition={{ duration: 1.2, delay: index * 0.1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-400 relative"
              >
                {/* Internal Glow Effect */}
                <div className="absolute inset-0 bg-white/20 blur-[2px]"></div>
              </motion.div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Optional: Global CSS for scrollbar to put in your index.css if desired */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
      `}} />
    </div>
  );
};

export default FeatureImportance;
