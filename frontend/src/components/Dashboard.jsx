// 1. Add this import at the top
import DemandHeatmap from "./DemandHeatmap";
import FeatureImportance from "./FeatureImportance";
import SystemAlerts from "./SystemAlerts";
import AnimatedCard from './AnimatedCard';
console.log("Heatmap:", heatmapData);
// ... 
const [heatmapData, setHeatmapData] = useState([]);
const [featureImportance, setFeatureImportance] = useState([]);
const [alerts, setAlerts] = useState([]);
{/* C. Secondary Intelligence Modules */}
<div className="grid grid-cols-1 gap-6 md:grid-cols-3">

  {/* Weather */}
  <AnimatedCard glowColor="cyan" className="h-72">
    <WeatherWidget weather={weather} />
  </AnimatedCard>

  {/* Heatmap */}
  <AnimatedCard glowColor="purple" className="h-72">
    <DemandHeatmap
      heatmapData={heatmapData}
    />
  </AnimatedCard>

  {/* Feature Importance */}
  <AnimatedCard glowColor="pink" className="h-72">
    <FeatureImportance
      features={featureImportance}
    />
  </AnimatedCard>

</div>

{/* D. System Alerts */}
<AnimatedCard glowColor="amber" className="mt-6">
  <SystemAlerts
    alerts={alerts}
  />
</AnimatedCard>