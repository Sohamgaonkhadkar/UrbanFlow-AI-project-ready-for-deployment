import React from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ForecastChart({ data }) {
  if (!data || data.length === 0) return (
    <div className="h-[400px] w-full flex items-center justify-center text-slate-500 border border-dashed border-white/10 rounded-2xl bg-white/5">
      Awaiting simulation parameters...
    </div>
  );

  return (
    <div className="h-[450px] w-full mt-6 bg-panel backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-glow-gradient opacity-30 pointer-events-none"/>
      
      <div className="flex justify-between items-end mb-6 relative z-10">
        <div>
          <h2 className="text-lg font-bold text-white tracking-wide">Demand Trajectory</h2>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Recursive LightGBM Projection</p>
        </div>
        <div className="flex gap-4 text-xs font-medium">
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary/80"></span> Historical</div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-accent/80"></span> Forecast</div>
        </div>
      </div>

      <div className="h-[350px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00F0FF" stopOpacity={0.5}/>
                <stop offset="100%" stopColor="#00F0FF" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff15" vertical={false} />
            <XAxis dataKey="time" stroke="#64748B" tick={{fill: '#64748B', fontSize: 12}} tickFormatter={(tick) => new Date(tick).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} minTickGap={50}/>
            <YAxis stroke="#64748B" tick={{ fill: '#64748B', fontSize: 12 }} axisLine={false} tickLine={false} />
            
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(11, 18, 33, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
              itemStyle={{ color: '#F8FAFC', fontWeight: 'bold' }}
              labelStyle={{ color: '#94A3B8', fontSize: '12px', marginBottom: '4px' }}
              labelFormatter={(label) => new Date(label).toLocaleString()}
            />
            
            <Area type="monotone" dataKey="actual" stroke="#00F0FF" strokeWidth={3} fill="url(#colorActual)" name="Actual Pickups" />
            <Line type="monotone" dataKey="prediction" stroke="#9D4EDD" strokeWidth={3} strokeDasharray="6 6" dot={{r: 4, fill: '#9D4EDD', strokeWidth: 0}} activeDot={{r: 8, stroke: 'rgba(157,78,221,0.5)', strokeWidth: 4}} name="Forecasted Pickups" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}