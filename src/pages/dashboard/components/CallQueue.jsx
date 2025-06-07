import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const CallQueue = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('score');
  const [isLoading, setIsLoading] = useState(false);

  // Empty state - no mock data
  const priorityLeads = [];

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  const renderEmptyState = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-error-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="Phone" size={24} className="text-error-400" />
      </div>
      <h3 className="text-lg font-medium text-text-primary mb-2">No Leads Ready for Calls</h3>
      <p className="text-text-secondary mb-6">
        High-priority leads will appear here when they're ready for your closing calls.
      </p>
      <div className="space-y-3">
        <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
          <Icon name="MessageCircle" size={16} />
          <span>Leads need to progress through automation sequences first</span>
        </div>
        <button 
          onClick={() => navigate('/message-automation')}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-600 nav-transition"
        >
          <Icon name="Settings" size={16} />
          <span>Configure Automation</span>
        </button>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="space-y-4">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="flex items-center space-x-4 p-4 bg-surface rounded-lg border border-border">
            <div className="w-12 h-12 bg-secondary-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-secondary-200 rounded w-1/3"></div>
              <div className="h-3 bg-secondary-200 rounded w-1/2"></div>
            </div>
            <div className="space-y-2">
              <div className="h-6 bg-secondary-200 rounded w-16"></div>
              <div className="h-3 bg-secondary-200 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-error text-white';
      case 'high':
        return 'bg-warning text-white';
      case 'medium':
        return 'bg-accent text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return '🔥';
      case 'high':
        return '📞';
      case 'medium':
        return '⏰';
      default:
        return '📋';
    }
  };

  const formatCurrency = (amount) => {
    return `฿${(amount / 1000000).toFixed(1)}M`;
  };

  const formatCommission = (amount) => {
    return `฿${(amount / 1000).toFixed(0)}k`;
  };

  const handleCallLead = (lead) => {
    // In real app, this would integrate with phone system
    window.open(`tel:${lead.phone}`);
  };

  const handleViewDetails = (lead) => {
    navigate(`/lead-details/${lead.id}`);
  };

  const sortedLeads = [...priorityLeads].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'value') return b.propertyValue - a.propertyValue;
    if (sortBy === 'urgency') {
      const urgencyOrder = { urgent: 3, high: 2, medium: 1 };
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    }
    return 0;
  });

  return (
    <div className="bg-surface rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-error-50 rounded-lg flex items-center justify-center">
              <Icon name="Phone" size={18} color="var(--color-error)" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Priority Call Queue</h2>
              <p className="text-sm text-text-secondary">Leads ready for closing calls</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs text-text-secondary">Queue Status</div>
              <div className="text-sm font-medium text-text-primary">
                {priorityLeads.length} Ready
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
        {isLoading ? renderLoadingState() : priorityLeads.length === 0 ? renderEmptyState() : null}
      </div>
    </div>
  );
};

export default CallQueue; 