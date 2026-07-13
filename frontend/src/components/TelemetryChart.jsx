import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TelemetryChart = ({ data, metric, color, unit }) => {
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-80">
      <div className="flex justify-between items-center mb-6">
        <h4 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{metric}</h4>
        <span className="text-xs text-gray-500 font-mono">{unit}</span>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="log_id" 
            stroke="#9CA3AF" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            label={{ value: 'Log Index', position: 'insideBottom', offset: -5, fill: '#9CA3AF', fontSize: 10 }}
          />
          <YAxis 
            stroke="#9CA3AF" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
            itemStyle={{ color: color }}
          />
          <Legend verticalAlign="top" align="right" height={36}/>
          <Line 
            type="monotone" 
            dataKey={metric.toLowerCase().replace(' ', '_')} 
            stroke={color} 
            strokeWidth={2} 
            dot={false} 
            activeDot={{ r: 6 }} 
            name={metric}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TelemetryChart;
