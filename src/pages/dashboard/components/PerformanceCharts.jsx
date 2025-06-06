import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import Icon from 'components/AppIcon';

const PerformanceCharts = () => {
  const [activeTab, setActiveTab] = useState('leads');

  // Mock data for charts
  const leadsData = [
    { name: 'Mon', facebook: 45, googleMaps: 32, thaiSites: 18, total: 95 },
    { name: 'Tue', facebook: 52, googleMaps: 28, thaiSites: 22, total: 102 },
    { name: 'Wed', facebook: 38, googleMaps: 41, thaiSites: 15, total: 94 },
    { name: 'Thu', facebook: 61, googleMaps: 35, thaiSites: 28, total: 124 },
    { name: 'Fri', facebook: 48, googleMaps: 39, thaiSites: 21, total: 108 },
    { name: 'Sat', facebook: 55, googleMaps: 44, thaiSites: 25, total: 124 },
    { name: 'Sun', facebook: 42, googleMaps: 31, thaiSites: 19, total: 92 }
  ];

  const conversionData = [
    { name: 'Mon', contacted: 23, responded: 18, interested: 12, converted: 8 },
    { name: 'Tue', contacted: 28, responded: 22, interested: 15, converted: 10 },
    { name: 'Wed', contacted: 25, responded: 19, interested: 13, converted: 9 },
    { name: 'Thu', contacted: 32, responded: 26, interested: 18, converted: 12 },
    { name: 'Fri', contacted: 29, responded: 23, interested: 16, converted: 11 },
    { name: 'Sat', contacted: 31, responded: 25, interested: 17, converted: 13 },
    { name: 'Sun', contacted: 24, responded: 18, interested: 12, converted: 8 }
  ];

  const sourceDistribution = [
    { name: 'Facebook Groups', value: 45, color: '#1E40AF' },
    { name: 'Google Maps', value: 32, color: '#059669' },
    { name: 'Thai Classifieds', value: 18, color: '#F59E0B' },
    { name: 'Pantip Forum', value: 5, color: '#64748B' }
  ];

  const tabs = [
    { id: 'leads', label: 'Lead Generation', icon: 'Users' },
    { id: 'conversion', label: 'Conversion Funnel', icon: 'TrendingUp' },
    { id: 'sources', label: 'Source Distribution', icon: 'PieChart' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-elevated">
          <p className="font-medium text-text-primary mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderLeadsChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={leadsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis 
          dataKey="name" 
          stroke="#64748B"
          fontSize={12}
        />
        <YAxis 
          stroke="#64748B"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="facebook" stackId="a" fill="#1E40AF" name="Facebook" />
        <Bar dataKey="googleMaps" stackId="a" fill="#059669" name="Google Maps" />
        <Bar dataKey="thaiSites" stackId="a" fill="#F59E0B" name="Thai Sites" />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderConversionChart = () => (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={conversionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
        <XAxis 
          dataKey="name" 
          stroke="#64748B"
          fontSize={12}
        />
        <YAxis 
          stroke="#64748B"
          fontSize={12}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="contacted" stroke="#1E40AF" strokeWidth={2} name="Contacted" />
        <Line type="monotone" dataKey="responded" stroke="#059669" strokeWidth={2} name="Responded" />
        <Line type="monotone" dataKey="interested" stroke="#F59E0B" strokeWidth={2} name="Interested" />
        <Line type="monotone" dataKey="converted" stroke="#EF4444" strokeWidth={2} name="Converted" />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderSourceChart = () => (
    <div className="flex flex-col lg:flex-row items-center space-y-4 lg:space-y-0 lg:space-x-8">
      <div className="w-full lg:w-1/2">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={sourceDistribution}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {sourceDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      <div className="w-full lg:w-1/2 space-y-3">
        {sourceDistribution.map((source, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-secondary-50">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: source.color }}
              ></div>
              <span className="font-medium text-text-primary">{source.name}</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-text-primary">{source.value}%</div>
              <div className="text-xs text-text-secondary">of total leads</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderChart = () => {
    switch (activeTab) {
      case 'leads':
        return renderLeadsChart();
      case 'conversion':
        return renderConversionChart();
      case 'sources':
        return renderSourceChart();
      default:
        return renderLeadsChart();
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
              <Icon name="BarChart3" size={18} color="var(--color-primary)" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Performance Analytics</h2>
          </div>
          
          <div className="flex items-center space-x-1 bg-secondary-50 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium nav-transition
                  ${activeTab === tab.id
                    ? 'bg-surface text-primary shadow-soft'
                    : 'text-text-secondary hover:text-text-primary'
                  }
                `}
              >
                <Icon name={tab.icon} size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Chart Description */}
        <div className="mb-6">
          {activeTab === 'leads' && (
            <p className="text-sm text-text-secondary">
              Daily lead generation breakdown by data source over the past week
            </p>
          )}
          {activeTab === 'conversion' && (
            <p className="text-sm text-text-secondary">
              Lead conversion funnel showing progression from contact to conversion
            </p>
          )}
          {activeTab === 'sources' && (
            <p className="text-sm text-text-secondary">
              Distribution of leads by data source for current month
            </p>
          )}
        </div>

        {/* Chart Container */}
        <div className="w-full" aria-label={`${tabs.find(tab => tab.id === activeTab)?.label} Chart`}>
          {renderChart()}
        </div>

        {/* Chart Legend for Bar and Line Charts */}
        {(activeTab === 'leads' || activeTab === 'conversion') && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
            {activeTab === 'leads' && (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-text-secondary">Facebook Groups</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <span className="text-text-secondary">Google Maps</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <span className="text-text-secondary">Thai Sites</span>
                </div>
              </>
            )}
            {activeTab === 'conversion' && (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <span className="text-text-secondary">Contacted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-accent rounded-full"></div>
                  <span className="text-text-secondary">Responded</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-warning rounded-full"></div>
                  <span className="text-text-secondary">Interested</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-error rounded-full"></div>
                  <span className="text-text-secondary">Converted</span>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformanceCharts;