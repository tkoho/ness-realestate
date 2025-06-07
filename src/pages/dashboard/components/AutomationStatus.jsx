import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const AutomationStatus = () => {
  const [refreshTime, setRefreshTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

  // Empty state - no mock data
  const automationSequences = [];

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshTime(new Date());
      setIsLoading(false);
    }, 1000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="MessageCircle" size={24} className="text-primary-400" />
      </div>
      <h3 className="text-lg font-medium text-text-primary mb-2">No Active Sequences</h3>
      <p className="text-text-secondary mb-6">
        Your automation sequences will appear here once configured and running.
      </p>
      <button className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 nav-transition">
        <Icon name="Plus" size={16} />
        <span>Create First Sequence</span>
      </button>
    </div>
  );

  const renderLoadingState = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-secondary-200 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 bg-secondary-200 rounded w-32"></div>
                <div className="h-3 bg-secondary-200 rounded w-24"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-secondary-200 rounded w-16"></div>
              <div className="h-3 bg-secondary-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-surface rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
              <Icon name="MessageCircle" size={18} color="var(--color-primary)" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Message Automation</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs text-text-secondary">Last updated</div>
              <div className="text-sm font-medium text-text-primary">
                {formatTime(refreshTime)}
              </div>
            </div>
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
        </div>
      </div>
      
      <div className="p-6">
        {isLoading ? renderLoadingState() : automationSequences.length === 0 ? renderEmptyState() : null}
      </div>
    </div>
  );
};

export default AutomationStatus; 