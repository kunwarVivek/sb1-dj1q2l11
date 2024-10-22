import React from 'react';
import { Link } from '@tanstack/react-router';
import { BarChart3, FileText, Briefcase, LayoutDashboard, Search, Database, GitMerge, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-indigo-600 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Briefcase className="w-8 h-8" />
            <span className="text-xl font-bold">M&A Pro</span>
          </Link>
          <div className="hidden md:flex space-x-4">
            <NavLink to="/" icon={<LayoutDashboard className="w-5 h-5" />} text="Dashboard" />
            <NavLink to="/deals" icon={<Briefcase className="w-5 h-5" />} text="Deals" />
            <NavLink to="/documents" icon={<FileText className="w-5 h-5" />} text="Documents" />
            <NavLink to="/analytics" icon={<BarChart3 className="w-5 h-5" />} text="Analytics" />
            <NavLink to="/prospecting" icon={<Search className="w-5 h-5" />} text="Prospecting" />
            <NavLink to="/vdr" icon={<Database className="w-5 h-5" />} text="VDR" />
            <NavLink to="/post-merger-analysis" icon={<GitMerge className="w-5 h-5" />} text="Post-Merger" />
            <NavLink to="/tenant-settings" icon={<Settings className="w-5 h-5" />} text="Settings" />
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ to: string; icon: React.ReactNode; text: string }> = ({ to, icon, text }) => (
  <Link to={to} className="flex items-center space-x-1 hover:text-indigo-200 transition-colors duration-200">
    {icon}
    <span className="hidden lg:inline">{text}</span>
  </Link>
);

export default Navbar;