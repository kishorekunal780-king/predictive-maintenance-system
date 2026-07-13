import React from 'react';
import { machineApi } from '../api/machineApi';

const MachineFleet = ({ onSelectMachine }) => {
  const [machines, setMachines] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchMachines = async () => {
      try {
        setLoading(true);
        const response = await machineApi.getMachines();
        const data = response.data;
        setMachines(data);
      } catch (err) {
        setError('Failed to load machine fleet data');
      } finally {
        setLoading(false);
      }
    };
    fetchMachines();
  }, []);

  if (loading) return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
  if (error) return <div className="text-red-400 p-12 text-center">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Active Asset Inventory</h3>
        <span className="bg-blue-900 text-blue-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
          {machines.length} Assets
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {machines.map((machine) => (
          <div 
            key={machine.product_id}
            onClick={() => onSelectMachine(machine.product_id)}
            className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-blue-500 cursor-pointer transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="bg-gray-700 p-2 rounded-lg group-hover:bg-blue-600 transition-colors">
                <svg className="w-5 h-5 text-gray-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
              </div>
              <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${
                machine.type === 'H' ? 'bg-purple-900 text-purple-200' : 
                machine.type === 'L' ? 'bg-green-900 text-green-200' : 'bg-gray-700 text-gray-300'
              }`}>
                {machine.type === 'H' ? 'High Perf' : machine.type === 'L' ? 'Low Perf' : 'Standard'}
              </span>
            </div>
            <div className="font-bold text-lg">{machine.product_id}</div>
            <div className="text-gray-400 text-sm">Click to view telemetry logs</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MachineFleet;
