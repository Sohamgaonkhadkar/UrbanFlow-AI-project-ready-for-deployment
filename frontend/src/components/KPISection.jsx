import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Thermometer, CloudRain, Activity } from 'lucide-react';

export default function KPISection({ data, region, horizon }) {
  const kpis = [
    { label: "T+1 Demand", value: data?.nextPred ? Math.round(data.nextPred) : '--', icon: Activity, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
    { label: "Active Region", value: region, icon: MapPin, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
    { label: "Est. Temp", value: data?.weather?.temperature ? `${data.weather.temperature}°C` : '--', icon: Thermometer, color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
    { label: "Condition", value: data?.weather?.condition || '--', icon: CloudRain, color: "text-accent", bg: "bg-accent/10", border: "border-accent/20" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {kpis.map((kpi, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-panel backdrop-blur-xl border border-white/5 p-5 rounded-2xl shadow-xl relative overflow-hidden group hover:border-white/10 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -mr-10 -mt-10 pointer-events-none"/>
          <div className="flex gap-3 text-slate-400 mb-3 items-center text-xs font-semibold uppercase tracking-widest">
            <div className={`p-1.5 rounded-md ${kpi.bg} ${kpi.border} border`}><kpi.icon size={16} className={kpi.color} /></div>
            {kpi.label}
          </div>
          <div className="text-3xl font-bold text-white tracking-tight">{kpi.value}</div>
        </motion.div>
      ))}
    </div>
  );
}