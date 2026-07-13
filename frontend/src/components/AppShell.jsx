import React from 'react';
import { LayoutDashboard, Activity, Settings, AlertTriangle, Database } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
      active ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
    }`}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </div>
);

const AppShell = ({ children, activeTab, setActiveTab }) => {
  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-gray-800">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Activity size={24} className="text-white" />
          </div>
          <h1 className="font-bold text-lg tracking-tight">Predictive AI</h1>
        </div>
        
        <nav className="flex-1 py-6 space-y-1">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarItem 
            icon={Database} 
            label="Machine Fleet" 
            active={activeTab === 'fleet'} 
            onClick={() => setActiveTab('fleet')} 
          />
          <SidebarItem 
            icon={AlertTriangle} 
            label="Alerts" 
            active={activeTab === 'alerts'} 
            onClick={() => setActiveTab('alerts')} 
          />
          <SidebarItem 
            icon={Settings} 
            label="Settings" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
        </nav>
        
        <div className="p-4 border-t border-gray-800">
          <div className="bg-gray-900 p-3 rounded-lg border border-gray-800 text-xs text-gray-500">
            System Status: <span className="text-green-500 font-medium">ONLINE</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-8">
          <h2 className="text-xl font-semibold capitalize">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">Admin Panel v1.0</div>
            <div className="w-8 h-8 bg-gray-700 rounded-full"></div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppShell;
