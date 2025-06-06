import React from 'react';
import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';
import AutomationStatus from 'pages/dashboard/components/AutomationStatus';

const MessageAutomation = () => {
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
                <Icon name="MessageCircle" size={32} className="text-primary" />
                <span>Message Automation</span>
              </h1>
              <p className="text-text-secondary">
                Manage your automated lead nurturing sequences and templates
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-text-secondary">Automation Status</div>
                <div className="text-lg font-semibold text-success">
                  Running
                </div>
              </div>
              <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-primary-50 rounded-lg border border-primary-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="Users" size={24} color="white" />
                </div>
                <span className="text-xs font-medium text-primary bg-primary-100 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              <div className="text-2xl font-bold text-primary mb-1">315</div>
              <p className="text-sm text-primary-600">Leads in Sequences</p>
            </div>

            <div className="bg-accent-50 rounded-lg border border-accent-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <Icon name="Send" size={24} color="white" />
                </div>
                <span className="text-xs font-medium text-accent bg-accent-100 px-2 py-1 rounded-full">
                  Today
                </span>
              </div>
              <div className="text-2xl font-bold text-accent mb-1">69</div>
              <p className="text-sm text-accent-600">Messages Sent</p>
            </div>

            <div className="bg-success-50 rounded-lg border border-success-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center">
                  <Icon name="TrendingUp" size={24} color="white" />
                </div>
                <span className="text-xs font-medium text-success bg-success-100 px-2 py-1 rounded-full">
                  Average
                </span>
              </div>
              <div className="text-2xl font-bold text-success mb-1">42%</div>
              <p className="text-sm text-success-600">Response Rate</p>
            </div>

            <div className="bg-warning-50 rounded-lg border border-warning-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center">
                  <Icon name="AlertTriangle" size={24} color="white" />
                </div>
                <span className="text-xs font-medium text-warning bg-warning-100 px-2 py-1 rounded-full">
                  Issues
                </span>
              </div>
              <div className="text-2xl font-bold text-warning mb-1">2</div>
              <p className="text-sm text-warning-600">Errors Today</p>
            </div>
          </div>

          {/* Automation Status Component */}
          <AutomationStatus />

          {/* Quick Actions */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface rounded-lg border border-border p-6">
              <h4 className="font-semibold text-text-primary mb-3 flex items-center space-x-2">
                <Icon name="Plus" size={18} />
                <span>Quick Actions</span>
              </h4>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-secondary-50 nav-transition">
                  <div className="font-medium text-text-primary">Create New Sequence</div>
                  <div className="text-sm text-text-secondary">Set up automated follow-up</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-secondary-50 nav-transition">
                  <div className="font-medium text-text-primary">Edit Templates</div>
                  <div className="text-sm text-text-secondary">Customize message content</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-border hover:bg-secondary-50 nav-transition">
                  <div className="font-medium text-text-primary">View Analytics</div>
                  <div className="text-sm text-text-secondary">Performance insights</div>
                </button>
              </div>
            </div>

            <div className="bg-surface rounded-lg border border-border p-6">
              <h4 className="font-semibold text-text-primary mb-3 flex items-center space-x-2">
                <Icon name="Settings" size={18} />
                <span>Configuration</span>
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Daily Send Limit</span>
                  <span className="font-medium text-text-primary">130 messages</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Active Sequences</span>
                  <span className="font-medium text-text-primary">4 running</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Next Execution</span>
                  <span className="font-medium text-text-primary">15 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Rate Limit Status</span>
                  <span className="font-medium text-success">Healthy</span>
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-lg border border-border p-6">
              <h4 className="font-semibold text-text-primary mb-3 flex items-center space-x-2">
                <Icon name="BarChart" size={18} />
                <span>Performance</span>
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Best Performing</span>
                  <span className="font-medium text-success">Day 7 Email (68%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Needs Attention</span>
                  <span className="font-medium text-warning">Day 14 Email (15%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Conversion Rate</span>
                  <span className="font-medium text-text-primary">25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Avg. Response Time</span>
                  <span className="font-medium text-text-primary">4.2 hours</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MessageAutomation; 