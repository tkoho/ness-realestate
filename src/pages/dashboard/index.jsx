import React, { useState, useEffect } from 'react';
import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';
import ApiService from '../../services/api';

import AutomationStatus from './components/AutomationStatus';
import CallQueue from './components/CallQueue';
import FunnelPerformance from './components/FunnelPerformance';

const AutomationControlCenter = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const data = await ApiService.getDashboardStats();
      setDashboardData(data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate metrics from real dashboard data
  const getAutomationMetrics = () => {
    if (!dashboardData) {
      return [
        {
          id: 1,
          title: "Ready for Calls",
          value: "-",
          change: "Loading...",
          changeType: "neutral",
          icon: "Phone",
          color: "secondary",
          description: "Leads ready for your closing call",
          urgent: false
        },
        {
          id: 2,
          title: "Auto-Contacted Today",
          value: "-",
          change: "Loading...",
          changeType: "neutral",
          icon: "MessageCircle",
          color: "secondary",
          description: "New leads entered automation"
        },
        {
          id: 3,
          title: "Email Sequence Active",
          value: "-",
          change: "Loading...",
          changeType: "neutral",
          icon: "Mail",
          color: "secondary",
          description: "Leads in automated follow-up"
        },
        {
          id: 4,
          title: "Contracts This Month",
          value: "-",
          change: "Loading...",
          changeType: "neutral",
          icon: "FileText",
          color: "secondary",
          description: "Signed from your calls"
        }
      ];
    }

    const { leads, automation, contracts } = dashboardData;

    return [
      {
        id: 1,
        title: "Ready for Calls",
        value: leads.qualified_leads.toString(),
        change: leads.qualified_leads > 0 ? `${leads.qualified_leads} Priority Leads` : "No Priority Leads",
        changeType: leads.qualified_leads > 0 ? "increase" : "neutral",
        icon: "Phone",
        color: leads.qualified_leads > 0 ? "primary" : "secondary",
        description: "Leads ready for your closing call",
        urgent: leads.qualified_leads > 5
      },
      {
        id: 2,
        title: "Auto-Contacted Today",
        value: automation.messages_sent_today.toString(),
        change: automation.messages_sent_today > 0 ? "Active automation" : "System ready",
        changeType: automation.messages_sent_today > 0 ? "increase" : "neutral",
        icon: "MessageCircle",
        color: automation.messages_sent_today > 0 ? "success" : "secondary",
        description: "Messages sent through automation today"
      },
      {
        id: 3,
        title: "Email Sequence Active",
        value: automation.total_leads_in_automation.toString(),
        change: automation.active_sequences > 0 ? `${automation.active_sequences} active sequences` : "No active sequences",
        changeType: automation.active_sequences > 0 ? "increase" : "neutral",
        icon: "Mail",
        color: automation.active_sequences > 0 ? "primary" : "secondary",
        description: "Leads in automated follow-up"
      },
      {
        id: 4,
        title: "Contracts This Month",
        value: contracts.active_listings.toString(),
        change: contracts.total_contracts > 0 ? `฿${contracts.total_commission_earned.toLocaleString()} earned` : "Getting started",
        changeType: contracts.total_contracts > 0 ? "increase" : "neutral",
        icon: "FileText",
        color: contracts.total_contracts > 0 ? "success" : "secondary",
        description: "Active property listings"
      }
    ];
  };

  const automationMetrics = getAutomationMetrics();

  const getAutomationHealth = () => {
    if (!dashboardData) {
      return {
        status: "loading",
        percentage: 0,
        nextScrape: "Loading...",
        lastRun: "Loading...",
        dailyTarget: 0,
        todayCount: 0
      };
    }

    const { automation, leads } = dashboardData;
    const hasActiveSequences = automation.active_sequences > 0;
    const hasData = leads.total_leads > 0;

    return {
      status: hasActiveSequences && hasData ? "healthy" : hasData ? "ready" : "ready",
      percentage: hasData ? Math.min(((automation.messages_sent_today / 100) * 100), 100) : 0,
      nextScrape: hasActiveSequences ? "Next automated message: 2:00 PM" : "Set up automation sequences first",
      lastRun: hasData ? "Last automated contact: 1 hour ago" : "No automation runs yet",
      dailyTarget: hasActiveSequences ? 50 : 0,
      todayCount: automation.messages_sent_today
    };
  };

  const automationHealth = getAutomationHealth();

  const formatTime = (date) => {
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getChangeColor = (changeType) => {
    switch (changeType) {
      case 'increase':
        return 'text-success';
      case 'decrease':
        return 'text-error';
      case 'urgent':
        return 'text-error animate-pulse';
      case 'neutral':
      default:
        return 'text-text-secondary';
    }
  };

  const getHealthStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-success bg-success-50 border-success-200';
      case 'warning':
        return 'text-warning bg-warning-50 border-warning-200';
      case 'error':
        return 'text-error bg-error-50 border-error-200';
      case 'ready':
      default:
        return 'text-secondary bg-secondary-50 border-secondary-200';
    }
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  const renderMetricsLoading = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-surface rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-secondary-200 rounded-lg"></div>
              <div className="w-16 h-4 bg-secondary-200 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-8 bg-secondary-200 rounded"></div>
              <div className="w-24 h-3 bg-secondary-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

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
                Monitor your lead automation and track ready-to-close opportunities
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-text-secondary">System Status</div>
                <div className={`text-lg font-semibold ${getHealthStatusColor(automationHealth.status).split(' ')[0]}`}>
                  {automationHealth.status === 'ready' ? 'Ready to Start' : 'Running'}
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${
                automationHealth.status === 'healthy' ? 'bg-success animate-pulse' :
                automationHealth.status === 'warning' ? 'bg-warning animate-pulse' :
                automationHealth.status === 'error' ? 'bg-error animate-pulse' :
                'bg-secondary-300'
              }`}></div>
            </div>
          </div>

          {/* Automation Metrics */}
          <div className="mb-8">
            {isLoading ? renderMetricsLoading() : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {automationMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    className={`
                      bg-surface rounded-lg border border-border p-6 nav-transition
                      ${metric.urgent ? 'ring-2 ring-error-200 bg-gradient-to-br from-white to-error-50' : 'hover:shadow-elevated'}
                    `}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-${metric.color}-50 rounded-lg flex items-center justify-center`}>
                        <Icon name={metric.icon} size={24} color={`var(--color-${metric.color})`} />
                      </div>
                      <span className={`text-xs font-medium ${getChangeColor(metric.changeType)} px-2 py-1 rounded-full bg-opacity-20`}>
                        {metric.change}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <div className={`text-2xl font-bold text-${metric.color}`}>
                        {metric.value}
                      </div>
                      <h3 className="font-medium text-text-primary text-sm">
                        {metric.title}
                      </h3>
                      <p className="text-xs text-text-secondary">
                        {metric.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Automation Health Status */}
          <div className="mb-8">
            <div className="bg-surface rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
                  <Icon name="Activity" size={20} />
                  <span>Automation Health</span>
                </h2>
                <button
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className={`
                    w-8 h-8 rounded-lg border border-border flex items-center justify-center nav-transition
                    ${isLoading 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:bg-secondary-50 hover:border-secondary-300'
                    }
                  `}
                >
                  <Icon 
                    name="RefreshCw" 
                    size={16} 
                    className={`text-text-secondary ${isLoading ? 'animate-spin' : ''}`} 
                  />
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getHealthStatusColor(automationHealth.status).split(' ')[0]}`}>
                    {automationHealth.percentage}%
                  </div>
                  <div className="text-sm text-text-secondary">System Health</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-text-primary">
                    {automationHealth.nextScrape}
                  </div>
                  <div className="text-sm text-text-secondary">Next Discovery</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-text-primary">
                    {automationHealth.lastRun}
                  </div>
                  <div className="text-sm text-text-secondary">Last Run</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-text-primary">
                    {automationHealth.todayCount}/{automationHealth.dailyTarget}
                  </div>
                  <div className="text-sm text-text-secondary">Today's Progress</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">Daily Target Progress</span>
                  <span className="text-sm text-text-secondary">
                    {automationHealth.dailyTarget > 0 ? Math.round((automationHealth.todayCount / automationHealth.dailyTarget) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-secondary-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      automationHealth.status === 'healthy' ? 'bg-success' :
                      automationHealth.status === 'warning' ? 'bg-warning' :
                      automationHealth.status === 'error' ? 'bg-error' : 'bg-secondary-300'
                    }`}
                    style={{ 
                      width: automationHealth.dailyTarget > 0 
                        ? `${Math.min((automationHealth.todayCount / automationHealth.dailyTarget) * 100, 100)}%` 
                        : '0%' 
                    }}
                  ></div>
                </div>
              </div>

              {/* System Status Info */}
              <div className="mt-4 p-3 bg-secondary-50 rounded-lg">
                <div className="text-sm text-text-secondary">
                  {automationHealth.status === 'ready' ? (
                    "🚀 System is ready. Configure your first automation sequence to begin lead discovery and nurturing."
                  ) : (
                    `⚡ Automation sequences are ${automationHealth.status}. Last updated: ${formatTime(currentTime)}`
                  )}
                </div>
              </div>
            </div>
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