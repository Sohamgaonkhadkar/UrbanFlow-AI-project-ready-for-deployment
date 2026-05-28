// 1. Add this import at the top
import { SystemAlerts } from './SystemAlerts';

// ... 

// 2. Find this section in your file and replace it:
{/* C. Secondary Intelligence Modules */}
<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
  
  {/* Atmospheric snapshot */}
  <AnimatedCard glowColor="cyan" className="h-72">
    <WeatherWidget weather={weather} />
  </AnimatedCard>

  {/* Spatial Activity Heatmap */}
  <AnimatedCard glowColor="purple" className="h-72">
    <DemandHeatmap
      activeRegion={region}
      onSelectRegion={setRegion}
    />
  </AnimatedCard>

  {/* NEW: System Alerts */}
  <AnimatedCard glowColor="amber" className="h-72">
    <SystemAlerts />
  </AnimatedCard>

</div>