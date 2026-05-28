import { useState, useEffect } from 'react';
import { AlertTriangle, Info, Zap, Activity, ServerCrash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// A library of realistic ML pipeline alerts to cycle through
const MOCK_ALERTS = [
  {
    id: 1,
    type: 'warning',
    icon: AlertTriangle,
    color: 'text-amber-400',
    title: 'Mild Spatial Drift',
    desc: 'Target zone variance exceeds 1.2σ bounds. Compensating via Lag Matrix.',
  },
  {
    id: 2,
    type: 'info',
    icon: Info,
    color: 'text-cyan-400',
    title: 'Imputation Active',
    desc: 'Missing sensor reads at Node 42 padded using Expanding Window baseline.',
  },
  {
    id: 3,
    type: 'critical',
    icon: ServerCrash,
    color: 'text-rose-400',
    title: 'Upstream API Latency',
    desc: 'Open-Meteo endpoint response > 800ms. Falling back to cached atmospheric state.',
  },
  {
    id: 4,
    type: 'system',
    icon: Zap,
    color: 'text-purple-400',
    title: 'Feature Skew Detected',
    desc: 'Precipitation matrix deviates from historical distribution. Adjusting weights.',
  },
  {
    id: 5,
    type: 'success',
    icon: Activity,
    color: 'text-emerald-400',
    title: 'Recursion Stabilized',
    desc: 'Multi-step forecast converged at optimal RMSE bound across all horizons.',
  }
];

export function SystemAlerts() {
  // Start with the first two alerts
  const [activeAlerts, setActiveAlerts] = useState([MOCK_ALERTS[0], MOCK_ALERTS[1]]);

  // Simulate live data by swapping an alert every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAlerts((current) => {
        // Pick a random alert that isn't currently displayed
        const available = MOCK_ALERTS.filter(a => !current.find(c => c.id === a.id));
        const nextAlert = available[Math.floor(Math.random() * available.length)];
        
        // Keep the newest alert at the top, drop the oldest
        return [nextAlert, current[0]];
      });
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-start justify-between">
        <h3 className="flex items-center gap-2 text-sm font-bold text-white">
          System Alerts
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500"></span>
          </span>
        </h3>
      </div>
      
      <div className="flex-1 overflow-hidden rounded-xl border border-slate-700/50 bg-slate-900/50 p-3">
        <div className="flex h-full flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {activeAlerts.map((alert, index) => {
              const Icon = alert.icon;
              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ duration: 0.4, type: "spring" }}
                  className={`flex items-start gap-3 ${index === 0 ? 'border-b border-slate-700/50 pb-3' : ''}`}
                >
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${alert.color}`} />
                  <div>
                    <div className={`mb-0.5 text-[10px] font-bold uppercase tracking-widest ${alert.color}`}>
                      {alert.title}
                    </div>
                    <div className="leading-tight text-[11px] text-slate-400">
                      {alert.desc}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}