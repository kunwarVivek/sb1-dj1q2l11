import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const PostMergerAnalysis: React.FC = () => {
  const synergyData = [
    { name: 'Q1', actual: 2, projected: 1.5 },
    { name: 'Q2', actual: 3.5, projected: 3 },
    { name: 'Q3', actual: 4.2, projected: 4.5 },
    { name: 'Q4', actual: 5.8, projected: 6 },
  ];

  const integrationProgress = [
    { name: 'IT Systems', completed: 75 },
    { name: 'HR Integration', completed: 90 },
    { name: 'Product Lines', completed: 60 },
    { name: 'Sales Channels', completed: 85 },
    { name: 'Customer Base', completed: 70 },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Post-Merger Analysis</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Synergy Realization</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={synergyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="actual" stroke="#8884d8" name="Actual" />
              <Line type="monotone" dataKey="projected" stroke="#82ca9d" name="Projected" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Integration Progress</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={integrationProgress} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="completed" fill="#8884d8" name="Completed %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Synergy Calculations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SynergyCard title="Cost Savings" value="$25M" change="+10%" />
          <SynergyCard title="Revenue Synergies" value="$15M" change="+5%" />
          <SynergyCard title="Tax Benefits" value="$8M" change="+15%" />
          <SynergyCard title="Operational Efficiency" value="18%" change="+3%" />
        </div>
      </div>
    </div>
  );
};

const SynergyCard: React.FC<{ title: string; value: string; change: string }> = ({ title, value, change }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
    <p className="text-3xl font-bold text-indigo-600 mb-1">{value}</p>
    <p className="text-sm text-green-600">{change} from projection</p>
  </div>
);

export default PostMergerAnalysis;