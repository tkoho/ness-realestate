import React, { useState, useEffect } from 'react';
import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';

import AutomationStatus from './components/AutomationStatus';
import CallQueue from './components/CallQueue';
import FunnelPerformance from './components/FunnelPerformance';

const AutomationControlCenter = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Updated metrics for automation focus
  const automationMetrics = [
    {
      id: 1,
      title: "Ready for Calls",
      value: "8",
      change: "High Priority",
      changeType: "urgent",
      icon: "Phone",
      color: "error",
      description: "Leads ready for your closing call",
      urgent: true
    },
    {
      id: 2,
      title: "Auto-Contacted Today",
      value: "31",
      change: "100% success",
      changeType: "neutral",
      icon: "MessageCircle",
      color: "primary",
      description: "New leads entered automation"
    },
    {
      id: 3,
      title: "Email Sequence Active",
      value: "156",
      change: "12% response rate",
      changeType: "increase",
      icon: "Mail",
      color: "accent",
      description: "Leads in automated follow-up"
    },
    {
      id: 4,
      title: "Contracts This Month",
      value: "12",
      change: "25% close rate",
      changeType: "increase",
      icon: "FileText",
      color: "success",
      description: "Signed from your calls"
    }
  ];

  const automationHealth = {
    status: "healthy",
    percentage: 98,
    nextScrape: "6:00 AM",
    lastRun: "5 minutes ago",
    dailyTarget: 50,
    todayCount: 31
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('th-TH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getMetricColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary-50 text-primary border-primary-100',
      accent: 'bg-accent-50 text-accent border-accent-100',
      success: 'bg-success-50 text-success border-success-100',
      error: 'bg-error-50 text-error border-error-100'
    };
    return colorMap[color] || colorMap.primary;
  };

  const getChangeColorClasses = (changeType) => {
    const changeMap = {
      increase: 'text-success-600 bg-success-50',
      decrease: 'text-error-600 bg-error-50',
      neutral: 'text-secondary-600 bg-secondary-50',
      urgent: 'text-error-600 bg-error-50 animate-pulse'
    };
    return changeMap[changeType] || changeMap.neutral;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2 flex items-center space-x-3">
                <Icon name="Zap" size={32} className="text-primary" />
                <span>Automation Control Center</span>
              </h1>
              <p className="text-text-secondary">
                Monitor automated lead generation and prioritize your closing calls
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-text-secondary">Current Time</div>
                <div className="text-lg font-semibold text-text-primary">
                  {formatTime(currentTime)} | {formatDate(currentTime)}
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                automationHealth.status === 'healthy' ? 'bg-success animate-pulse' : 'bg-error'
              }`}></div>
            </div>
          </div>

          {/* Automation Health Status */}
          <div className="mb-6 p-4 bg-primary-50 border border-primary-100 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Activity" size={20} className="text-primary" />
                <div>
                  <h3 className="font-semibold text-primary">Automation Status: Running</h3>
                  <p className="text-sm text-primary-600">
                    Next scrape: {automationHealth.nextScrape} • Last run: {automationHealth.lastRun}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">{automationHealth.todayCount}/{automationHealth.dailyTarget}</div>
                <div className="text-sm text-primary-600">Today's discoveries</div>
              </div>
            </div>
          </div>

          {/* Priority Alert */}
          <div className="mb-6 p-4 bg-error-50 border-l-4 border-l-error rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-error" />
              <div>
                <h3 className="font-semibold text-error">🔥 8 HIGH-PRIORITY LEADS READY FOR YOUR CALLS</h3>
                <p className="text-sm text-error-600">
                  These leads have responded positively to automation - call now for best results
                </p>
              </div>
              <button className="ml-auto px-4 py-2 bg-error text-white rounded-lg font-medium hover:bg-error-600 nav-transition">
                View Call Queue
              </button>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {automationMetrics.map((metric) => (
              <div
                key={metric.id}
                className={`bg-surface rounded-lg border p-6 hover:shadow-elevated nav-transition ${
                  metric.urgent ? 'ring-2 ring-error-200 shadow-lg' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getMetricColorClasses(metric.color)}`}>
                    <Icon name={metric.icon} size={24} />
                    {metric.urgent && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full animate-ping"></div>
                    )}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getChangeColorClasses(metric.changeType)}`}>
                    {metric.change}
                  </div>
                </div>
                
                <div className="mb-2">
                  <h3 className="text-sm font-medium text-text-secondary mb-1">
                    {metric.title}
                  </h3>
                  <div className="text-2xl font-bold text-text-primary">
                    {metric.value}
                  </div>
                </div>
                
                <p className="text-xs text-text-secondary">
                  {metric.description}
                </p>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Call Queue & Automation Status */}
            <div className="lg:col-span-2 space-y-6">
              <CallQueue />
              <AutomationStatus />
            </div>

            {/* Right Column - Performance & Quick Actions */}
            <div className="space-y-6">
              <FunnelPerformance />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AutomationControlCenter;