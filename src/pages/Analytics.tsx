import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Analytics: React.FC = () => {
  const dealValueData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 700 },
  ];

  const dealTypeData = [
    { name: 'Acquisition', value: 400 },
    { name: 'Merger', value: 300 },
    { name: 'Investment', value: 200 },
    { name: 'Partnership', value: 100 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Deal Value Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dealValueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Deal Types Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dealTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {dealTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Total Deal Value" value="$3.2B" change="+15%" />
          <KPICard title="Average Deal Size" value="$250M" change="+5%" />
          <KPICard title="Deal Success Rate" value="75%" change="+2%" />
          <KPICard title="Time to Close" value="45 days" change="-10%" />
        </div>
      </div>
    </div>
  );
};

const KPICard: React.FC<{ title: string; value: string; change: string }> = ({ title, value, change }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
    <p className="text-3xl font-bold text-indigo-600 mb-1">{value}</p>
    <p className={`text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
      {change} from last period
    </p>
  </div>
);

export default Analytics;