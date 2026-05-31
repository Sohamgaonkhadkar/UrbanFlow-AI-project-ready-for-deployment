import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertTriangle, Info, Activity } from 'lucide-react';

// Mock Data: Real-time system telemetry and anomalies
const MOCK_ALERTS = [
  {
    id: 'EVT-9091',
    severity: 'CRITICAL',
    message: 'Demand surge anomaly detected in Sector 15 (Times Square). +420% vs baseline.',
    time: '00:10:42',
  },
  {
    id: 'EVT-9092',
    severity: 'WARNING',
    message: 'API rate limit warning: Open-Meteo endpoint nearing threshold.',
    time: '00:11:05',
  },
  {
    id: 'EVT-9093',
    severity: 'INFO',
    message: 'LGBM Pipeline auto-retraining scheduled in T-45 minutes.',
    time: '00:11:30',
  },
  {
    id: 'EVT-9094',
    severity: 'WARNING',
    message: 'VRAM utilization at 88%. GPU-02 memory allocation high.',
    time: '00:12:15',
  },
];

const SystemAlerts = () => {
  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return {
          icon: <ShieldAlert className="w-4 h-4 text-pink-500" />,
          bg: 'bg-pink-500/10',
          border: 'border-pink-500/30',
          text: 'text-pink-400',
        };
      case 'WARNING':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-amber-500" />,
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'text-amber-400',
        };
      default:
        return {
          icon: <Info className="w-4 h-4 text-cyan-500" />,
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/30',
          text: 'text-cyan-400',
        };
    }
  };

  return (
    <div className="h-full min-h-[280px] w-full rounded-xl border border-gray-800 bg-gray-900/50 backdrop-blur-md p-5 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-semibold tracking-wider text-gray-200 uppercase">
            System Alerts
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-amber-400 font-mono tracking-widest bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
            4 ACTIVE
          </span>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
        <AnimatePresence>
          {MOCK_ALERTS.map((alert, index) => {
            const styles = getSeverityStyles(alert.severity);
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className={`flex items-start gap-3 p-3 rounded-lg border backdrop-blur-sm ${styles.bg} ${styles.border}`}
              >
                <div className="mt-0.5">{styles.icon}</div>
                <div className="flex-1 flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold tracking-wider ${styles.text}`}>
                      {alert.severity}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {alert.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    {alert.message}
                  </p>
                  <span className="text-[9px] text-gray-600 font-mono mt-1">
                    REF: {alert.id}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Embedded CSS for custom scrollbar (if not already globally defined) */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #374151; border-radius: 4px; }
      `}} />
    </div>
  );
};

export default SystemAlerts;