import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';

const ScrapingStatus = () => {
  const [refreshTime, setRefreshTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshTime(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(timer);
  }, []);

  // Mock data for scraping jobs
  const scrapingJobs = [
    {
      id: 1,
      source: "Facebook Groups",
      icon: "Facebook",
      status: "running",
      progress: 67,
      totalTargets: 15,
      completedTargets: 10,
      leadsFound: 234,
      estimatedCompletion: "12 minutes",
      lastUpdate: "2 minutes ago",
      color: "primary"
    },
    {
      id: 2,
      source: "Google Maps",
      icon: "MapPin",
      status: "running",
      progress: 89,
      totalTargets: 8,
      completedTargets: 7,
      leadsFound: 156,
      estimatedCompletion: "4 minutes",
      lastUpdate: "1 minute ago",
      color: "accent"
    },
    {
      id: 3,
      source: "Thai Classifieds",
      icon: "Globe",
      status: "completed",
      progress: 100,
      totalTargets: 12,
      completedTargets: 12,
      leadsFound: 89,
      estimatedCompletion: "Completed",
      lastUpdate: "5 minutes ago",
      color: "success"
    },
    {
      id: 4,
      source: "Pantip Forum",
      icon: "MessageSquare",
      status: "queued",
      progress: 0,
      totalTargets: 6,
      completedTargets: 0,
      leadsFound: 0,
      estimatedCompletion: "Waiting...",
      lastUpdate: "Queued",
      color: "warning"
    }
  ];

  const getStatusColor = (status) => {
    const statusMap = {
      running: 'text-primary bg-primary-50 border-primary-200',
      completed: 'text-success bg-success-50 border-success-200',
      queued: 'text-warning bg-warning-50 border-warning-200',
      error: 'text-error bg-error-50 border-error-200'
    };
    return statusMap[status] || statusMap.queued;
  };

  const getProgressColor = (status) => {
    const colorMap = {
      running: 'bg-primary',
      completed: 'bg-success',
      queued: 'bg-warning',
      error: 'bg-error'
    };
    return colorMap[status] || colorMap.queued;
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      running: 'Play',
      completed: 'CheckCircle',
      queued: 'Clock',
      error: 'AlertCircle'
    };
    return iconMap[status] || 'Clock';
  };

  const totalActiveJobs = scrapingJobs.filter(job => job.status === 'running').length;
  const totalLeadsToday = scrapingJobs.reduce((sum, job) => sum + job.leadsFound, 0);

  return (
    <div className="bg-surface rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
              <Icon name="Search" size={18} color="var(--color-primary)" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Scraping Operations</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-xs text-text-secondary">Last Updated</div>
              <div className="text-sm font-medium text-text-primary">
                {refreshTime.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-secondary-50 nav-transition">
              <Icon name="RefreshCw" size={16} className="text-text-secondary" />
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{totalActiveJobs}</div>
            <div className="text-xs text-text-secondary">Active Jobs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{totalLeadsToday}</div>
            <div className="text-xs text-text-secondary">Leads Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success">4</div>
            <div className="text-xs text-text-secondary">Data Sources</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning">92%</div>
            <div className="text-xs text-text-secondary">Success Rate</div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {scrapingJobs.map((job) => (
            <div key={job.id} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary-50 rounded-lg flex items-center justify-center">
                    <Icon name={job.icon} size={20} className="text-text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-medium text-text-primary">{job.source}</h3>
                    <p className="text-sm text-text-secondary">
                      {job.completedTargets}/{job.totalTargets} targets • {job.leadsFound} leads
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(job.status)}`}>
                    <Icon name={getStatusIcon(job.status)} size={12} className="inline mr-1" />
                    {job.status}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">Progress</span>
                  <span className="text-sm text-text-secondary">{job.progress}%</span>
                </div>
                <div className="w-full bg-secondary-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(job.status)}`}
                    style={{ width: `${job.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Job Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-secondary">Estimated Completion:</span>
                  <div className="font-medium text-text-primary">{job.estimatedCompletion}</div>
                </div>
                <div>
                  <span className="text-text-secondary">Last Update:</span>
                  <div className="font-medium text-text-primary">{job.lastUpdate}</div>
                </div>
              </div>

              {/* Action Buttons */}
              {job.status === 'running' && (
                <div className="mt-4 flex items-center space-x-2">
                  <button className="px-3 py-1 text-xs bg-error-50 text-error border border-error-200 rounded-lg hover:bg-error-100 nav-transition">
                    <Icon name="Pause" size={12} className="inline mr-1" />
                    Pause
                  </button>
                  <button className="px-3 py-1 text-xs bg-secondary-50 text-text-secondary border border-secondary-200 rounded-lg hover:bg-secondary-100 nav-transition">
                    <Icon name="Eye" size={12} className="inline mr-1" />
                    View Details
                  </button>
                </div>
              )}

              {job.status === 'completed' && (
                <div className="mt-4 flex items-center space-x-2">
                  <button className="px-3 py-1 text-xs bg-primary-50 text-primary border border-primary-200 rounded-lg hover:bg-primary-100 nav-transition">
                    <Icon name="Download" size={12} className="inline mr-1" />
                    Export Results
                  </button>
                  <button className="px-3 py-1 text-xs bg-secondary-50 text-text-secondary border border-secondary-200 rounded-lg hover:bg-secondary-100 nav-transition">
                    <Icon name="Eye" size={12} className="inline mr-1" />
                    View Leads
                  </button>
                </div>
              )}

              {job.status === 'queued' && (
                <div className="mt-4 flex items-center space-x-2">
                  <button className="px-3 py-1 text-xs bg-success-50 text-success border border-success-200 rounded-lg hover:bg-success-100 nav-transition">
                    <Icon name="Play" size={12} className="inline mr-1" />
                    Start Now
                  </button>
                  <button className="px-3 py-1 text-xs bg-secondary-50 text-text-secondary border border-secondary-200 rounded-lg hover:bg-secondary-100 nav-transition">
                    <Icon name="Settings" size={12} className="inline mr-1" />
                    Configure
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScrapingStatus;