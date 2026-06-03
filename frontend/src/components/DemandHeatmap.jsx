import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Activity } from 'lucide-react';

const DemandHeatmap = ({ heatmapData = [] }) => {
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const getGlowColor = (level) => {
    switch (level) {
      case 'High':
        return 'bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]';

      case 'Medium':
        return 'bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]';

      default:
        return 'bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.4)]';
    }
  };

  const getOpacity = (demand) => {
    const normalized = Math.min(demand / 1000, 1);
    return 0.3 + normalized * 0.7;
  };

  if (!heatmapData || heatmapData.length === 0) {
    return (
      <div className="relative h-full min-h-[320px] w-full rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-md p-5 flex items-center justify-center">
        <span className="text-slate-500">
          No spatial data available
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[320px] w-full rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-md p-5 flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-cyan-400" />
          <h3 className="text-sm font-semibold tracking-wider text-gray-200 uppercase">
            Spatial Matrix
          </h3>
        </div>

        <div className="flex items-center gap-1">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>

          <span className="text-xs text-cyan-400 font-mono tracking-widest ml-1">
            LIVE
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 flex items-center justify-center relative">
        <div className="grid grid-cols-6 gap-2 sm:gap-3 w-full max-w-[400px]">

          {heatmapData.map((region) => (
            <motion.div
              key={region.id}
              whileHover={{ scale: 1.2, zIndex: 10 }}
              onHoverStart={() => setHoveredRegion(region)}
              onHoverEnd={() => setHoveredRegion(null)}
              className={`aspect-square rounded-sm cursor-pointer transition-colors duration-300 ${getGlowColor(region.level)}`}
              style={{
                opacity:
                  hoveredRegion &&
                  hoveredRegion.id !== region.id
                    ? 0.2
                    : getOpacity(region.demand)
              }}
            />
          ))}

        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {hoveredRegion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="absolute bottom-0 left-0 right-0 bg-gray-950/90 border border-gray-700 backdrop-blur-xl p-3 rounded-lg shadow-2xl pointer-events-none"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-gray-100 uppercase">
                  {hoveredRegion.name}
                </span>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                    hoveredRegion.level === 'High'
                      ? 'text-pink-400 border-pink-400/50 bg-pink-400/10'
                      : hoveredRegion.level === 'Medium'
                      ? 'text-purple-400 border-purple-400/50 bg-purple-400/10'
                      : 'text-cyan-400 border-cyan-400/50 bg-cyan-400/10'
                  }`}
                >
                  {hoveredRegion.level}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-400 text-xs font-mono">
                <Activity className="w-3 h-3" />

                <span>
                  Predicted Volume:{' '}
                  <strong className="text-gray-100">
                    {hoveredRegion.demand}
                  </strong>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default DemandHeatmap;