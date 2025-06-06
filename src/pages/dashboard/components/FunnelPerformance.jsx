import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from 'components/AppIcon';

const FunnelPerformance = () => {
  const [activeTab, setActiveTab] = useState('funnel');

  // Automation funnel data (last 7 days)
  const funnelData = [
    { name: 'Mon', discovered: 45, contacted: 45, opened: 18, responded: 5, interested: 2, called: 2, contracts: 1 },
    { name: 'Tue', discovered: 52, contacted: 52, opened: 23, responded: 7, interested: 3, called: 3, contracts: 1 },
    { name: 'Wed', discovered: 38, contacted: 38, opened: 15, responded: 4, interested: 2, called: 2, contracts: 0 },
    { name: 'Thu', discovered: 61, contacted: 61, opened: 28, responded: 9, interested: 4, called: 4, contracts: 2 },
    { name: 'Fri', discovered: 48, contacted: 48, opened: 21, responded: 6, interested: 3, called: 3, contracts: 1 },
    { name: 'Sat', discovered: 55, contacted: 55, opened: 22, responded: 8, interested: 3, called: 3, contracts: 1 },
    { name: 'Sun', discovered: 42, contacted: 42, opened: 19, responded: 6, interested: 2, called: 2, contracts: 1 }
  ];

  // Response rate trends
  const responseData = [
    { name: 'Week 1', facebook: 12, email_day3: 8, email_day7: 15, email_day14: 6 },
    { name: 'Week 2', facebook: 15, email_day3: 11, email_day7: 18, email_day14: 8 },
    { name: 'Week 3', facebook: 18, email_day3: 13, email_day7: 21, email_day14: 9 },
    { name: 'Week 4', facebook: 16, email_day3: 12, email_day7: 19, email_day14: 7 }
  ];

  // Current funnel metrics
  const funnelMetrics = {
    discovered_today: 31,
    contacted_rate: 100,
    open_rate: 42,
    response_rate: 12,
    interest_rate: 32, // of responders
    call_conversion: 25, // of interested leads that convert on calls
    total_pipeline_value: 2300000,
    avg_property_value: 6500000
  };

  const tabs = [
    { id: 'funnel', label: 'Conversion Funnel', icon: 'TrendingUp' },
    { id: 'responses', label: 'Response Rates', icon: 'MessageSquare' },
    { id: 'pipeline', label: 'Pipeline Value', icon: 'DollarSign' }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface border border-border rounded-lg p-3 shadow-elevated">
          <p className="font-medium text-text-primary mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.dataKey}: {entry.value}
              {entry.dataKey.includes('rate') ? '%' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const formatCurrency = (amount) => {
    return `฿${(amount / 1000000).toFixed(1)}M`;
  };

  const renderFunnelChart = () => (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={funnelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          <Line type="monotone" dataKey="discovered" stroke="#1E40AF" strokeWidth={2} name="Discovered" />
          <Line type="monotone" dataKey="contacted" stroke="#059669" strokeWidth={2} name="Auto-Contacted" />
          <Line type="monotone" dataKey="responded" stroke="#F59E0B" strokeWidth={2} name="Responded" />
          <Line type="monotone" dataKey="contracts" stroke="#EF4444" strokeWidth={3} name="Contracts Signed" />
        </LineChart>
      </ResponsiveContainer>

      {/* Funnel Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="text-center p-3 bg-primary-50 rounded-lg">
          <div className="text-lg font-bold text-primary">{funnelMetrics.contacted_rate}%</div>
          <div className="text-xs text-text-secondary">Auto-Contact Rate</div>
        </div>
        <div className="text-center p-3 bg-accent-50 rounded-lg">
          <div className="text-lg font-bold text-accent">{funnelMetrics.open_rate}%</div>
          <div className="text-xs text-text-secondary">Message Open Rate</div>
        </div>
        <div className="text-center p-3 bg-warning-50 rounded-lg">
          <div className="text-lg font-bold text-warning">{funnelMetrics.response_rate}%</div>
          <div className="text-xs text-text-secondary">Response Rate</div>
        </div>
        <div className="text-center p-3 bg-error-50 rounded-lg">
          <div className="text-lg font-bold text-error">{funnelMetrics.call_conversion}%</div>
          <div className="text-xs text-text-secondary">Call Close Rate</div>
        </div>
      </div>
    </div>
  );

  const renderResponseChart = () => (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={responseData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
          <Bar dataKey="facebook" fill="#1E40AF" name="Facebook Message" />
          <Bar dataKey="email_day3" fill="#059669" name="Day 3 Email" />
          <Bar dataKey="email_day7" fill="#F59E0B" name="Day 7 Email" />
          <Bar dataKey="email_day14" fill="#EF4444" name="Day 14 Email" />
        </BarChart>
      </ResponsiveContainer>

      {/* Optimization Insights */}
      <div className="space-y-2">
        <div className="p-3 bg-success-50 rounded-lg border border-success-200">
          <div className="flex items-center space-x-2">
            <Icon name="TrendingUp" size={16} className="text-success-600" />
            <span className="text-sm font-medium text-success-700">Day 7 emails performing +21% above average</span>
          </div>
        </div>
        <div className="p-3 bg-warning-50 rounded-lg border border-warning-200">
          <div className="flex items-center space-x-2">
            <Icon name="AlertTriangle" size={16} className="text-warning-600" />
            <span className="text-sm font-medium text-warning-700">Day 14 response rate dropped 15% - consider A/B testing new template</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPipelineValue = () => (
    <div className="space-y-6">
      {/* Pipeline Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
          <h4 className="text-sm font-medium text-primary-700 mb-2">Total Pipeline Value</h4>
          <div className="text-2xl font-bold text-primary">{formatCurrency(funnelMetrics.total_pipeline_value)}</div>
          <p className="text-xs text-primary-600">From 8 ready-to-close leads</p>
        </div>
        <div className="p-4 bg-success-50 rounded-lg border border-success-200">
          <h4 className="text-sm font-medium text-success-700 mb-2">Potential Commission</h4>
          <div className="text-2xl font-bold text-success">{formatCurrency(funnelMetrics.total_pipeline_value * 0.1)}</div>
          <p className="text-xs text-success-600">At 10% commission rate</p>
        </div>
      </div>

      {/* Value Breakdown */}
      <div className="space-y-3">
        <h4 className="font-medium text-text-primary">Pipeline by Lead Score</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-error-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-error rounded-full"></div>
              <span className="text-sm font-medium text-text-primary">Score 90-100 (Urgent)</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-error">฿1.2M</div>
              <div className="text-xs text-text-secondary">3 leads</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-warning-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-warning rounded-full"></div>
              <span className="text-sm font-medium text-text-primary">Score 80-89 (High)</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-warning">฿0.8M</div>
              <div className="text-xs text-text-secondary">3 leads</div>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-3 bg-accent-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-accent rounded-full"></div>
              <span className="text-sm font-medium text-text-primary">Score 70-79 (Medium)</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-accent">฿0.3M</div>
              <div className="text-xs text-text-secondary">2 leads</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-secondary-50 rounded-lg">
        <h4 className="font-medium text-text-primary mb-3">Optimization Actions</h4>
        <div className="space-y-2">
          <button className="w-full text-left p-2 hover:bg-surface rounded text-sm text-text-secondary hover:text-text-primary nav-transition">
            → Focus on 3 urgent leads (potential ฿120k commission)
          </button>
          <button className="w-full text-left p-2 hover:bg-surface rounded text-sm text-text-secondary hover:text-text-primary nav-transition">
            → Test new Day 14 email template to improve response rate
          </button>
          <button className="w-full text-left p-2 hover:bg-surface rounded text-sm text-text-secondary hover:text-text-primary nav-transition">
            → Increase daily discovery target to 50 leads
          </button>
        </div>
      </div>
    </div>
  );

  const renderChart = () => {
    switch (activeTab) {
      case 'funnel':
        return renderFunnelChart();
      case 'responses':
        return renderResponseChart();
      case 'pipeline':
        return renderPipelineValue();
      default:
        return renderFunnelChart();
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent-50 rounded-lg flex items-center justify-center">
              <Icon name="BarChart3" size={18} color="var(--color-accent)" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Automation Performance</h2>
          </div>
          
          <div className="flex items-center space-x-1 bg-secondary-50 rounded-lg p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium nav-transition
                  ${activeTab === tab.id
                    ? 'bg-surface text-accent shadow-soft'
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
        {renderChart()}
      </div>
    </div>
  );
};

export default FunnelPerformance; 