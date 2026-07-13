import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle, Info } from 'lucide-react';
import { machineApi } from '../api/machineApi';

const RiskCard = ({ machine, probability, isCritical }) => (
  <div className={`p-6 rounded-xl border transition-all duration-500 ${
    isCritical 
    ? 'bg-red-900/20 border-red-500 animate-pulse' 
    : 'bg-gray-800 border-gray-700'
  }`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${isCritical ? 'bg-red-600' : 'bg-gray-700'}`}>
        {isCritical ? <ShieldAlert size={24} className="text-white" /> : <Info size={24} className="text-gray-300" />}
      </div>
      <div className={`text-xs font-bold px-2 py-1 rounded ${
        isCritical ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'
      }`}>
        {isCritical ? 'CRITICAL' : 'STABLE'}
      </div>
    </div>
    <div className="text-lg font-bold mb-1">{machine}</div>
    <div className="text-sm text-gray-400 mb-4">Failure Probability</div>
    <div className="flex items-end gap-2">
      <span className={`text-3xl font-mono font-bold ${isCritical ? 'text-red-500' : 'text-gray-200'}`}>
        {(probability * 100).toFixed(1)}%
      </span>
      <div className="flex-1 h-2 bg-gray-700 rounded-full mb-2 overflow-hidden">
        <div 
          className={`h-full transition-all duration-1000 ${isCritical ? 'bg-red-500' : 'bg-blue-500'}`}
          style={{ width: `${probability * 100}%` }}
        ></div>
      </div>
    </div>
  </div>
);

const AlertsDashboard = () => {
  const [criticalAssets, setCriticalAssets] = React.useState([]);
  const [stableAssets, setStableAssets] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        const response = await machineApi.getAlerts();
        setCriticalAssets(response.data.critical || []);
        setStableAssets(response.data.stable || []);
      } catch (err) {
        console.error('Alert Analysis Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 bg-red-900/10 border border-red-900/30 p-4 rounded-xl text-red-400">
        <AlertTriangle size={24} />
        <div>
          <span className="font-bold">Critical Risk Alert:</span>
          <span className="ml-2 text-sm"> {criticalAssets.length} assets require immediate maintenance.</span>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <ShieldAlert className="text-red-500" /> Critical Assets
        </h3>
        {criticalAssets.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 text-center text-gray-500">
            <CheckCircle className="mx-auto mb-2" size={32} />
            No critical risks detected in the current sample.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {criticalAssets.map(a => (
              <RiskCard key={a.product_id} machine={a.product_id} probability={a.probability} isCritical={true} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <CheckCircle className="text-green-500" /> Stable Assets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {stableAssets.map(a => (
            <RiskCard key={a.product_id} machine={a.product_id} probability={a.probability} isCritical={false} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AlertsDashboard;
