import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const AutomationStatus = () => {
  const [refreshTime, setRefreshTime] = useState(new Date());

  // Mock automation sequences data
  const automationSequences = [
    {
      id: 'seq_001',
      name: 'Initial Facebook Contact',
      type: 'facebook_message',
      status: 'running',
      leads_in_sequence: 47,
      last_sent: new Date(Date.now() - 300000), // 5 minutes ago
      success_rate: 68,
      template: 'สวัสดีครับ/ค่ะ เห็นโพสต์เรื่อง[PROPERTY_TYPE]ใน[LOCATION]...',
      next_execution: new Date(Date.now() + 3600000), // 1 hour from now
      daily_limit: 50,
      sent_today: 31
    },
    {
      id: 'seq_002', 
      name: 'Day 3 Follow-up Email',
      type: 'email',
      status: 'running',
      leads_in_sequence: 23,
      last_sent: new Date(Date.now() - 1800000), // 30 minutes ago
      success_rate: 45,
      template: 'Hi [OWNER_NAME], I wanted to follow up on the property listing opportunity...',
      next_execution: new Date(Date.now() + 7200000), // 2 hours from now
      daily_limit: 30,
      sent_today: 18
    },
    {
      id: 'seq_003',
      name: 'Day 7 Value Proposition',
      type: 'email',
      status: 'running', 
      leads_in_sequence: 156,
      last_sent: new Date(Date.now() - 900000), // 15 minutes ago
      success_rate: 32,
      template: 'Our clients typically sell 40% faster with our marketing approach...',
      next_execution: new Date(Date.now() + 10800000), // 3 hours from now
      daily_limit: 25,
      sent_today: 12
    },
    {
      id: 'seq_004',
      name: 'Contract Offer (Day 14)',
      type: 'email_with_attachment',
      status: 'running',
      leads_in_sequence: 89,
      last_sent: new Date(Date.now() - 2700000), // 45 minutes ago
      success_rate: 28,
      template: 'I\'ve attached a sample listing agreement for your review...',
      next_execution: new Date(Date.now() + 14400000), // 4 hours from now
      daily_limit: 15,
      sent_today: 8
    },
    {
      id: 'seq_005',
      name: 'Final Follow-up (Day 21)',
      type: 'email',
      status: 'paused',
      leads_in_sequence: 34,
      last_sent: new Date(Date.now() - 86400000), // 1 day ago
      success_rate: 15,
      template: 'This is my final outreach regarding your property listing...',
      next_execution: null,
      daily_limit: 10,
      sent_today: 0
    }
  ];

  const automationHealth = {
    facebook_api: 'connected',
    email_service: 'connected', 
    scheduler: 'running',
    rate_limits: 'healthy',
    error_count: 2,
    uptime: 99.8
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'text-accent bg-accent-50 border-accent-200';
      case 'paused':
        return 'text-warning bg-warning-50 border-warning-200';
      case 'error':
        return 'text-error bg-error-50 border-error-200';
      default:
        return 'text-secondary bg-secondary-100 border-secondary-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return 'Play';
      case 'paused':
        return 'Pause';
      case 'error':
        return 'AlertCircle';
      default:
        return 'Circle';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'facebook_message':
        return 'MessageCircle';
      case 'email':
        return 'Mail';
      case 'email_with_attachment':
        return 'Paperclip';
      default:
        return 'Send';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const formatNextExecution = (date) => {
    if (!date) return 'Paused';
    
    const now = new Date();
    const diffInMinutes = Math.floor((date - now) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const toggleSequence = (sequenceId) => {
    // In real app, this would call API to pause/resume sequence
    console.log(`Toggling sequence ${sequenceId}`);
  };

  const editTemplate = (sequenceId) => {
    // In real app, this would open template editor
    console.log(`Editing template for ${sequenceId}`);
  };

  return (
    <div className="bg-surface rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={18} color="var(--color-primary)" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Message Automation</h2>
              <p className="text-sm text-text-secondary">Automated lead nurturing sequences</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs text-text-secondary">Automation Health</div>
              <div className="text-sm font-medium text-success">
                {automationHealth.uptime}% Uptime
              </div>
            </div>
            <button 
              onClick={() => setRefreshTime(new Date())}
              className="p-2 rounded-lg hover:bg-secondary-50 nav-transition"
            >
              <Icon name="RefreshCw" size={16} className="text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">315</div>
            <div className="text-xs text-text-secondary">Total in Sequences</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">69</div>
            <div className="text-xs text-text-secondary">Sent Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">42%</div>
            <div className="text-xs text-text-secondary">Avg Response Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">{automationHealth.error_count}</div>
            <div className="text-xs text-text-secondary">Errors Today</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {automationSequences.map((sequence) => (
            <div key={sequence.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary-50 rounded-lg flex items-center justify-center">
                    <Icon name={getTypeIcon(sequence.type)} size={20} className="text-text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">{sequence.name}</h3>
                    <p className="text-sm text-text-secondary">
                      {sequence.leads_in_sequence} leads • {sequence.success_rate}% response rate
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(sequence.status)}`}>
                    <Icon name={getStatusIcon(sequence.status)} size={12} className="inline mr-1" />
                    {sequence.status}
                  </span>
                </div>
              </div>

              {/* Progress and Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <span className="text-sm text-text-secondary">Sent Today:</span>
                  <div className="font-medium text-text-primary">
                    {sequence.sent_today}/{sequence.daily_limit}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-text-secondary">Last Sent:</span>
                  <div className="font-medium text-text-primary">
                    {formatTimeAgo(sequence.last_sent)}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-text-secondary">Next Send:</span>
                  <div className="font-medium text-text-primary">
                    {formatNextExecution(sequence.next_execution)}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-text-secondary">Success Rate:</span>
                  <div className="font-medium text-success">
                    {sequence.success_rate}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">Daily Progress</span>
                  <span className="text-sm text-text-secondary">
                    {Math.round((sequence.sent_today / sequence.daily_limit) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-secondary-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      sequence.status === 'running' ? 'bg-accent' :
                      sequence.status === 'paused' ? 'bg-warning' : 'bg-error'
                    }`}
                    style={{ width: `${Math.min((sequence.sent_today / sequence.daily_limit) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Template Preview */}
              <div className="mb-4 p-3 bg-secondary-50 rounded-lg">
                <h4 className="text-sm font-medium text-text-secondary mb-2">Template Preview:</h4>
                <p className="text-sm text-text-primary italic truncate">
                  "{sequence.template}"
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleSequence(sequence.id)}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium nav-transition ${
                      sequence.status === 'running'
                        ? 'bg-warning text-white hover:bg-warning-600'
                        : 'bg-accent text-white hover:bg-accent-700'
                    }`}
                  >
                    <Icon 
                      name={sequence.status === 'running' ? 'Pause' : 'Play'} 
                      size={12} 
                      className="inline mr-1" 
                    />
                    {sequence.status === 'running' ? 'Pause' : 'Resume'}
                  </button>
                  
                  <button
                    onClick={() => editTemplate(sequence.id)}
                    className="px-3 py-1.5 text-xs bg-secondary-100 text-text-secondary rounded-lg font-medium hover:bg-secondary-200 nav-transition"
                  >
                    <Icon name="Edit" size={12} className="inline mr-1" />
                    Edit Template
                  </button>
                </div>

                <div className="text-xs text-text-secondary">
                  ID: {sequence.id}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* System Health */}
        <div className="mt-6 pt-6 border-t border-border">
          <h4 className="font-medium text-text-primary mb-3">System Health</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm text-text-secondary">Facebook API</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm text-text-secondary">Email Service</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm text-text-secondary">Scheduler</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-sm text-text-secondary">Rate Limits</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationStatus;