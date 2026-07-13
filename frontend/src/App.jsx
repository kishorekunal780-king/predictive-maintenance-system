import React, { useState, useEffect } from 'react';
import AppShell from './components/AppShell';
import MachineFleet from './pages/MachineFleet';
import MachineDetail from './pages/MachineDetail';
import AlertsDashboard from './pages/AlertsDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import { machineApi } from './api/machineApi';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoadingAlerts(true);
        const response = await machineApi.getAlerts();
        // Since getAlerts returns { critical: [...], stable: [...] }
        setAlerts(response.data.critical || []);
      } catch (err) {
        console.error('Failed to fetch alerts:', err);
      } finally {
        setLoadingAlerts(false);
      }
    };
    fetchAlerts();
  }, []);

  const totalAssets = 10000;
  const criticalCount = alerts.length;
  const systemHealth = (((totalAssets - criticalCount) / totalAssets) * 100).toFixed(1);

  return (
    <ErrorBoundary>
      <AppShell activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Total Assets</h3>
              <p className="text-3xl font-bold">10,000</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-gray-400 text-sm font-medium mb-2">Critical Alerts</h3>
              <p className="text-3xl font-bold text-red-500">{loadingAlerts ? '...' : criticalCount}</p>
            </div>
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-gray-400 text-sm font-medium mb-2">System Health</h3>
              <p className="text-3xl font-bold text-green-500">{loadingAlerts ? '...' : `${systemHealth}%`}</p>
            </div>
          </div>
        )}
        {activeTab === 'fleet' && (
          selectedMachine ? (
            <MachineDetail 
              id={selectedMachine} 
              onBack={() => setSelectedMachine(null)} 
            />
          ) : (
            <MachineFleet onSelectMachine={setSelectedMachine} />
          )
        )}
        {activeTab === 'alerts' && (
          <AlertsDashboard />
        )}
        {activeTab === 'settings' && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
            <p className="text-gray-400">System settings coming soon...</p>
          </div>
        )}
      </AppShell>
    </ErrorBoundary>
  );
}

export default App;

