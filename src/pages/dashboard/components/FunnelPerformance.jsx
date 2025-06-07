import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import Icon from 'components/AppIcon';

const FunnelPerformance = () => {
  const [activeTab, setActiveTab] = useState('funnel');
  const [isLoading, setIsLoading] = useState(false);

  // Empty state - no mock data
  const funnelData = [];
  const responseData = [];
  const funnelMetrics = {
    discovered_today: 0,
    contacted_rate: 0,
    open_rate: 0,
    response_rate: 0,
    interest_rate: 0,
    call_conversion: 0,
    total_pipeline_value: 0,
    avg_property_value: 0
  };

  const tabs = [
    { id: 'funnel', label: 'Conversion Funnel', icon: 'TrendingUp' },
    { id: 'responses', label: 'Response Rates', icon: 'MessageSquare' },
    { id: 'pipeline', label: 'Pipeline Value', icon: 'DollarSign' }
  ];

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount) => {
    return `฿${(amount / 1000000).toFixed(1)}M`;
  };

  const renderEmptyState = (tabType) => {
    const emptyStates = {
      funnel: {
        icon: 'TrendingUp',
        title: 'No Conversion Data',
        description: 'Conversion funnel data will appear here once leads start flowing through your automation sequences.'
      },
      responses: {
        icon: 'MessageSquare',
        title: 'No Response Data',
        description: 'Response rate analytics will be available after automation sequences have been running.'
      },
      pipeline: {
        icon: 'DollarSign',
        title: 'No Pipeline Data',
        description: 'Pipeline value metrics will show once you have leads progressing to calls and contracts.'
      }
    };

    const state = emptyStates[tabType] || emptyStates.funnel;

    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-secondary-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name={state.icon} size={24} className="text-secondary-400" />
        </div>
        <h3 className="text-lg font-medium text-text-primary mb-2">{state.title}</h3>
        <p className="text-text-secondary mb-6 max-w-sm mx-auto">
          {state.description}
        </p>
        <div className="text-sm text-text-secondary">
          Start by configuring your automation sequences to begin tracking performance
        </div>
      </div>
    );
  };

  const renderLoadingState = () => (
    <div className="space-y-6">
      <div className="animate-pulse">
        <div className="h-64 bg-secondary-100 rounded-lg"></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-16 bg-secondary-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFunnelChart = () => {
    if (funnelData.length === 0) {
      return renderEmptyState('funnel');
    }

    return (
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
            <Tooltip />
            <Line type="monotone" dataKey="discovered" stroke="#1E40AF" strokeWidth={2} name="Discovered" />
            <Line type="monotone" dataKey="contacted" stroke="#059669" strokeWidth={2} name="Auto-Contacted" />
            <Line type="monotone" dataKey="responded" stroke="#F59E0B" strokeWidth={2} name="Responded" />
            <Line type="monotone" dataKey="contracts" stroke="#EF4444" strokeWidth={3} name="Contracts Signed" />
          </LineChart>
        </ResponsiveContainer>

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
  };

  const renderResponseChart = () => {
    if (responseData.length === 0) {
      return renderEmptyState('responses');
    }

    return (
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
            <Tooltip />
            <Bar dataKey="facebook" fill="#1E40AF" name="Facebook Message" />
            <Bar dataKey="email_day3" fill="#059669" name="Day 3 Email" />
            <Bar dataKey="email_day7" fill="#F59E0B" name="Day 7 Email" />
            <Bar dataKey="email_day14" fill="#EF4444" name="Day 14 Email" />
          </BarChart>
        </ResponsiveContainer>

        <div className="space-y-2">
          <div className="p-3 bg-secondary-50 rounded-lg border border-secondary-200">
            <div className="flex items-center space-x-2">
              <Icon name="Info" size={16} className="text-secondary-600" />
              <span className="text-sm font-medium text-secondary-700">No optimization insights available yet</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPipelineValue = () => {
    if (funnelMetrics.total_pipeline_value === 0) {
      return renderEmptyState('pipeline');
    }

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
            <h4 className="text-sm font-medium text-primary-700 mb-2">Total Pipeline Value</h4>
            <div className="text-2xl font-bold text-primary">{formatCurrency(funnelMetrics.total_pipeline_value)}</div>
            <p className="text-xs text-primary-600">From 0 ready-to-close leads</p>
          </div>
          <div className="p-4 bg-success-50 rounded-lg border border-success-200">
            <h4 className="text-sm font-medium text-success-700 mb-2">Potential Commission</h4>
            <div className="text-2xl font-bold text-success">{formatCurrency(funnelMetrics.total_pipeline_value * 0.1)}</div>
            <p className="text-xs text-success-600">At 10% commission rate</p>
          </div>
        </div>
      </div>
    );
  };

  const renderChart = () => {
    if (isLoading) {
      return renderLoadingState();
    }

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