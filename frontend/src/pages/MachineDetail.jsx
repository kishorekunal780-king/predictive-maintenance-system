import React from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import TelemetryChart from '../components/TelemetryChart';
import { machineApi } from '../api/machineApi';

const MachineDetail = ({ id, onBack }) => {
  const [telemetry, setTelemetry] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        setLoading(true);
        const response = await machineApi.getTelemetry(id);
        const data = response.data;
        setTelemetry(data);
      } catch (err) {
        setError(err.message || 'Machine not found');
      } finally {
        setLoading(false);
      }
    };
    fetchTelemetry();
  }, [id]);

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-red-400 p-12 text-center">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h3 className="text-2xl font-bold">Asset Details: {id}</h3>
          <p className="text-gray-400 text-sm">Real-time telemetry and failure probability</p>
        </div>
      </div>

      {telemetry.length === 0 ? (
        <div className="bg-gray-800 p-12 rounded-xl border border-gray-700 text-center">
          <AlertCircle className="mx-auto mb-4 text-gray-500" size={48} />
          <p className="text-gray-400">No telemetry records found for this asset.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Telemetry Stats Card */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h4 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">Current Metrics</h4>
                <div className="space-y-4">
                  {[
                    { label: 'Air Temp', value: telemetry[0].air_temperature, unit: 'K' },
                    { label: 'Process Temp', value: telemetry[0].process_temperature, unit: 'K' },
                    { label: 'Rotational Speed', value: telemetry[0].rotational_speed, unit: 'rpm' },
                    { label: 'Torque', value: telemetry[0].torque, unit: 'Nm' },
                    { label: 'Tool Wear', value: telemetry[0].tool_wear, unit: 'min' },
                  ].map((metric) => (
                    <div key={metric.label} className="flex justify-between items-center border-b border-gray-700 pb-2">
                      <span className="text-gray-400">{metric.label}</span>
                      <span className="font-mono font-bold">{metric.value} <span className="text-xs text-gray-500">{metric.unit}</span></span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* History Table */}
            <div className="lg:col-span-2 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-700">
                <h4 className="font-semibold">Telemetry History</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-900 text-gray-400 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-3">Log ID</th>
                      <th className="px-4 py-3">Temp Diff</th>
                      <th className="px-4 py-3">Power</th>
                      <th className="px-4 py-3">Overstrain</th>
                      <th className="px-4 py-3">Failure</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {telemetry.map((log) => (
                      <tr key={log.log_id} className="hover:bg-gray-700/50 transition-colors">
                        <td className="px-4 py-3 font-mono">{log.log_id}</td>
                        <td className="px-4 py-3">{log.temp_diff.toFixed(2)}</td>
                        <td className="px-4 py-3">{log.machine_power.toFixed(2)}</td>
                        <td className="px-4 py-3">{log.overstrain.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          {log.machine_failure === 1 ? (
                            <span className="bg-red-900 text-red-200 px-2 py-0.5 rounded text-xs font-bold">FAIL</span>
                          ) : (
                            <span className="bg-green-900 text-green-200 px-2 py-0.5 rounded text-xs font-bold">PASS</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Visualization Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TelemetryChart 
              data={telemetry} 
              metric="Process Temperature" 
              color="#ef4444" 
              unit="K" 
            />
            <TelemetryChart 
              data={telemetry} 
              metric="Rotational Speed" 
              color="#3b82f6" 
              unit="rpm" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MachineDetail;
