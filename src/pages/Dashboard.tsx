import React from 'react';
import { BarChart3, Briefcase, FileText, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <DashboardCard
          title="Active Deals"
          value="12"
          icon={<Briefcase className="w-8 h-8 text-blue-500" />}
          change="+2 this month"
        />
        <DashboardCard
          title="Documents Processed"
          value="1,234"
          icon={<FileText className="w-8 h-8 text-green-500" />}
          change="+15% from last month"
        />
        <DashboardCard
          title="Deal Value"
          value="$2.5B"
          icon={<TrendingUp className="w-8 h-8 text-purple-500" />}
          change="+5% YoY"
        />
        <DashboardCard
          title="Analytics Insights"
          value="78"
          icon={<BarChart3 className="w-8 h-8 text-orange-500" />}
          change="3 new insights"
        />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white shadow rounded-lg p-4">
          <ActivityItem
            title="New deal added"
            description="Tech Innovators Inc. acquisition of AI Dynamics"
            time="2 hours ago"
          />
          <ActivityItem
            title="Document uploaded"
            description="Financial statements for Project Horizon"
            time="5 hours ago"
          />
          <ActivityItem
            title="Deal status updated"
            description="Merger with Global Solutions moved to Due Diligence"
            time="1 day ago"
          />
        </div>
      </div>
    </div>
  );
};

const DashboardCard: React.FC<{ title: string; value: string; icon: React.ReactNode; change: string }> = ({
  title,
  value,
  icon,
  change,
}) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      {icon}
    </div>
    <p className="text-3xl font-bold text-gray-800 mb-2">{value}</p>
    <p className="text-sm text-gray-500">{change}</p>
  </div>
);

const ActivityItem: React.FC<{ title: string; description: string; time: string }> = ({
  title,
  description,
  time,
}) => (
  <div className="border-b border-gray-200 py-3 last:border-b-0">
    <h4 className="font-semibold text-gray-800">{title}</h4>
    <p className="text-gray-600">{description}</p>
    <p className="text-sm text-gray-400 mt-1">{time}</p>
  </div>
);

export default Dashboard;