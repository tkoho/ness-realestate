import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const JobDetailsPanel = ({ job, onJobAction }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!job) {
    return (
      <div className="bg-surface rounded-lg border border-border p-6 text-center">
        <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="FileText" size={24} className="text-text-secondary" />
        </div>
        <h4 className="text-lg font-medium text-text-primary mb-2">No Job Selected</h4>
        <p className="text-text-secondary">Select a job from the table to view details and controls.</p>
      </div>
    );
  }

  const mockErrorLogs = [
    {
      id: 1,
      timestamp: new Date(Date.now() - 300000),
      level: 'error',
      message: 'Failed to connect to Facebook API',
      details: 'Rate limit exceeded. Retrying in 15 minutes.'
    },
    {
      id: 2,
      timestamp: new Date(Date.now() - 600000),
      level: 'warning',
      message: 'Slow response from Google Maps',
      details: 'Response time: 8.5s (threshold: 5s)'
    },
    {
      id: 3,
      timestamp: new Date(Date.now() - 900000),
      level: 'info',
      message: 'Successfully scraped 50 listings',
      details: 'Found 12 new contacts, 38 duplicates filtered'
    }
  ];

  const mockScheduleOptions = [
    { id: 'immediate', label: 'Run Immediately', description: 'Start the job right now' },
    { id: 'hourly', label: 'Every Hour', description: 'Run every hour during business hours' },
    { id: 'daily', label: 'Daily at 9 AM', description: 'Run once daily at 9:00 AM local time' },
    { id: 'weekly', label: 'Weekly on Monday', description: 'Run every Monday at 9:00 AM' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'text-accent bg-accent-50 border-accent-200';
      case 'completed':
        return 'text-success bg-success-50 border-success-200';
      case 'scheduled':
        return 'text-primary bg-primary-50 border-primary-200';
      case 'failed':
        return 'text-error bg-error-50 border-error-200';
      case 'paused':
        return 'text-warning bg-warning-50 border-warning-200';
      default:
        return 'text-secondary bg-secondary-100 border-secondary-200';
    }
  };

  const getLogLevelColor = (level) => {
    switch (level) {
      case 'error':
        return 'text-error bg-error-50';
      case 'warning':
        return 'text-warning bg-warning-50';
      case 'info':
        return 'text-accent bg-accent-50';
      default:
        return 'text-secondary bg-secondary-100';
    }
  };

  const formatTimestamp = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'schedule', label: 'Schedule', icon: 'Clock' },
    { id: 'logs', label: 'Logs', icon: 'FileText' }
  ];

  return (
    <div className="bg-surface rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-text-primary">Job Details</h3>
          <span className={`
            px-3 py-1 rounded-full text-xs font-medium border
            ${getStatusColor(job.status)}
          `}>
            {job.status}
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-2 px-3 py-1.5 rounded-md text-sm font-medium nav-transition
                ${activeTab === tab.id
                  ? 'bg-primary-50 text-primary' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                }
              `}
            >
              <Icon name={tab.icon} size={14} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Job Info */}
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-3">Job Information</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Source:</span>
                  <span className="text-sm font-medium text-text-primary">{job.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Target:</span>
                  <span className="text-sm font-medium text-text-primary">{job.targetLocation}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Started:</span>
                  <span className="text-sm font-medium text-text-primary">
                    {job.startTime.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-text-secondary">Items Found:</span>
                  <span className="text-sm font-medium text-text-primary">{job.itemsFound}</span>
                </div>
                {job.errorCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-text-secondary">Errors:</span>
                    <span className="text-sm font-medium text-error">{job.errorCount}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress */}
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-3">Progress</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Completion</span>
                  <span className="font-medium text-text-primary">{job.progress}%</span>
                </div>
                <div className="w-full bg-secondary-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      job.status === 'running' ? 'bg-accent' :
                      job.status === 'completed' ? 'bg-success' :
                      job.status === 'failed' ? 'bg-error' :
                      job.status === 'paused'? 'bg-warning' : 'bg-primary'
                    }`}
                    style={{ width: `${job.progress}%` }}
                  ></div>
                </div>
                <div className="text-xs text-text-secondary">
                  {job.estimatedCompletion}
                </div>
              </div>
            </div>

            {/* Controls */}
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-3">Controls</h4>
              <div className="grid grid-cols-2 gap-2">
                {job.status === 'running' && (
                  <>
                    <button
                      onClick={() => onJobAction(job.id, 'pause')}
                      className="flex items-center justify-center space-x-2 px-3 py-2 bg-warning text-white rounded-lg text-sm font-medium hover:bg-warning-600 nav-transition"
                    >
                      <Icon name="Pause" size={14} />
                      <span>Pause</span>
                    </button>
                    <button
                      onClick={() => onJobAction(job.id, 'stop')}
                      className="flex items-center justify-center space-x-2 px-3 py-2 bg-error text-white rounded-lg text-sm font-medium hover:bg-error-600 nav-transition"
                    >
                      <Icon name="Square" size={14} />
                      <span>Stop</span>
                    </button>
                  </>
                )}
                
                {job.status === 'paused' && (
                  <>
                    <button
                      onClick={() => onJobAction(job.id, 'resume')}
                      className="flex items-center justify-center space-x-2 px-3 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-700 nav-transition"
                    >
                      <Icon name="Play" size={14} />
                      <span>Resume</span>
                    </button>
                    <button
                      onClick={() => onJobAction(job.id, 'stop')}
                      className="flex items-center justify-center space-x-2 px-3 py-2 bg-error text-white rounded-lg text-sm font-medium hover:bg-error-600 nav-transition"
                    >
                      <Icon name="Square" size={14} />
                      <span>Stop</span>
                    </button>
                  </>
                )}
                
                {(job.status === 'completed' || job.status === 'failed') && (
                  <button className="col-span-2 flex items-center justify-center space-x-2 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-700 nav-transition">
                    <Icon name="Download" size={14} />
                    <span>Export Results</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-text-primary mb-3">Schedule Options</h4>
              <div className="space-y-2">
                {mockScheduleOptions.map((option) => (
                  <label key={option.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:bg-secondary-50 cursor-pointer nav-transition">
                    <input
                      type="radio"
                      name="schedule"
                      value={option.id}
                      className="mt-0.5 text-primary focus:ring-primary"
                    />
                    <div>
                      <div className="text-sm font-medium text-text-primary">{option.label}</div>
                      <div className="text-xs text-text-secondary">{option.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-text-primary mb-3">Advanced Settings</h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Auto-retry on failure</span>
                  <input type="checkbox" defaultChecked className="text-primary focus:ring-primary" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Send notifications</span>
                  <input type="checkbox" defaultChecked className="text-primary focus:ring-primary" />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Auto-export results</span>
                  <input type="checkbox" className="text-primary focus:ring-primary" />
                </label>
              </div>
            </div>

            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-700 nav-transition">
              <Icon name="Save" size={16} />
              <span>Save Schedule</span>
            </button>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-text-primary">Recent Activity</h4>
              <button className="text-xs text-primary hover:text-primary-700 nav-transition">
                View All
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {mockErrorLogs.map((log) => (
                <div key={log.id} className="p-3 border border-border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <span className={`
                      px-2 py-0.5 rounded-full text-xs font-medium
                      ${getLogLevelColor(log.level)}
                    `}>
                      {log.level}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {formatTimestamp(log.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-text-primary mb-1">
                    {log.message}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {log.details}
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-secondary-100 text-text-primary rounded-lg font-medium hover:bg-secondary-200 nav-transition">
              <Icon name="Download" size={16} />
              <span>Export Logs</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetailsPanel;