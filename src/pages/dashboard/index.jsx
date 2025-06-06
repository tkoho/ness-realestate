import React, { useState, useEffect } from 'react';
import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';

import RecentActivity from './components/RecentActivity';
import ScrapingStatus from './components/ScrapingStatus';
import QuickActions from './components/QuickActions';
import PerformanceCharts from './components/PerformanceCharts';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Mock data for dashboard metrics
  const dashboardMetrics = [
    {
      id: 1,
      title: "Total Leads Today",
      value: "1,247",
      change: "+12.5%",
      changeType: "increase",
      icon: "Users",
      color: "primary",
      description: "New leads scraped in last 24 hours"
    },
    {
      id: 2,
      title: "Active Scraping Jobs",
      value: "8",
      change: "3 running",
      changeType: "neutral",
      icon: "Search",
      color: "accent",
      description: "Currently processing data sources"
    },
    {
      id: 3,
      title: "Conversion Rate",
      value: "23.8%",
      change: "+2.1%",
      changeType: "increase",
      icon: "TrendingUp",
      color: "success",
      description: "Leads converted to contacts"
    },
    {
      id: 4,
      title: "Data Sources",
      value: "12",
      change: "All active",
      changeType: "neutral",
      icon: "Database",
      color: "warning",
      description: "Facebook, Google Maps, Thai sites"
    }
  ];

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
      warning: 'bg-warning-50 text-warning border-warning-100'
    };
    return colorMap[color] || colorMap.primary;
  };

  const getChangeColorClasses = (changeType) => {
    const changeMap = {
      increase: 'text-success-600 bg-success-50',
      decrease: 'text-error-600 bg-error-50',
      neutral: 'text-secondary-600 bg-secondary-50'
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
              <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2">
                Dashboard Overview
              </h1>
              <p className="text-text-secondary">
                Monitor your lead generation and scraping operations in real-time
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-text-secondary">Current Time</div>
                <div className="text-lg font-semibold text-text-primary">
                  {formatTime(currentTime)} | {formatDate(currentTime)}
                </div>
              </div>
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {dashboardMetrics.map((metric) => (
              <div
                key={metric.id}
                className="bg-surface rounded-lg border border-border p-6 hover:shadow-elevated nav-transition"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getMetricColorClasses(metric.color)}`}>
                    <Icon name={metric.icon} size={24} />
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
            {/* Left Column - Scraping Status & Charts */}
            <div className="lg:col-span-2 space-y-6">
              <ScrapingStatus />
              <PerformanceCharts />
            </div>

            {/* Right Column - Quick Actions & Recent Activity */}
            <div className="space-y-6">
              <QuickActions />
              <RecentActivity />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;