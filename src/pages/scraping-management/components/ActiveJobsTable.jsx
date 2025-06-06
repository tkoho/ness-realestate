import React from 'react';
import Icon from 'components/AppIcon';

const ActiveJobsTable = ({ 
  jobs, 
  selectedJobs, 
  onJobSelect, 
  onJobsSelect, 
  onJobAction, 
  selectedJob 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'running':
        return 'text-accent bg-accent-50';
      case 'completed':
        return 'text-success bg-success-50';
      case 'scheduled':
        return 'text-primary bg-primary-50';
      case 'failed':
        return 'text-error bg-error-50';
      case 'paused':
        return 'text-warning bg-warning-50';
      default:
        return 'text-secondary bg-secondary-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running':
        return 'Play';
      case 'completed':
        return 'CheckCircle';
      case 'scheduled':
        return 'Clock';
      case 'failed':
        return 'XCircle';
      case 'paused':
        return 'Pause';
      default:
        return 'Circle';
    }
  };

  const formatDuration = (startTime) => {
    const now = new Date();
    const diff = now - startTime;
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onJobsSelect(jobs.map(job => job.id));
    } else {
      onJobsSelect([]);
    }
  };

  const handleSelectJob = (jobId, checked) => {
    if (checked) {
      onJobsSelect([...selectedJobs, jobId]);
    } else {
      onJobsSelect(selectedJobs.filter(id => id !== jobId));
    }
  };

  const isAllSelected = jobs.length > 0 && selectedJobs.length === jobs.length;
  const isIndeterminate = selectedJobs.length > 0 && selectedJobs.length < jobs.length;

  return (
    <div className="bg-surface rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-1">Active Jobs</h3>
        <p className="text-sm text-text-secondary">Monitor scraping operations in real-time</p>
      </div>

      <div className="overflow-hidden">
        {jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary-50">
                <tr>
                  <th className="w-12 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={input => {
                        if (input) input.indeterminate = isIndeterminate;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-secondary-300 text-primary focus:ring-primary"
                    />
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Source
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Location
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Items
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobs.map((job) => (
                  <tr
                    key={job.id}
                    onClick={() => onJobSelect(job)}
                    className={`
                      cursor-pointer hover:bg-secondary-50 nav-transition
                      ${selectedJob?.id === job.id ? 'bg-primary-50 border-l-4 border-l-primary' : ''}
                    `}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedJobs.includes(job.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleSelectJob(job.id, e.target.checked);
                        }}
                        className="rounded border-secondary-300 text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <div>
                        <div className="text-sm font-medium text-text-primary">{job.source}</div>
                        <div className="text-xs text-text-secondary">{job.sourceDetails}</div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-text-primary">{job.targetLocation}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${getStatusColor(job.status)}
                      `}>
                        <Icon name={getStatusIcon(job.status)} size={12} className="mr-1" />
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="w-full">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-text-secondary">{job.progress}%</span>
                        </div>
                        <div className="w-full bg-secondary-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              job.status === 'running' ? 'bg-accent' :
                              job.status === 'completed' ? 'bg-success' :
                              job.status === 'failed' ? 'bg-error' :
                              job.status === 'paused'? 'bg-warning' : 'bg-primary'
                            }`}
                            style={{ width: `${job.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-text-primary">{job.itemsFound}</div>
                      {job.errorCount > 0 && (
                        <div className="text-xs text-error">{job.errorCount} errors</div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-text-primary">
                        {job.status === 'running' || job.status === 'paused' 
                          ? formatDuration(job.startTime)
                          : job.estimatedCompletion
                        }
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        {job.status === 'running' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onJobAction(job.id, 'pause');
                            }}
                            className="p-1.5 text-warning hover:bg-warning-50 rounded nav-transition"
                            title="Pause"
                          >
                            <Icon name="Pause" size={14} />
                          </button>
                        )}
                        
                        {job.status === 'paused' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onJobAction(job.id, 'resume');
                            }}
                            className="p-1.5 text-accent hover:bg-accent-50 rounded nav-transition"
                            title="Resume"
                          >
                            <Icon name="Play" size={14} />
                          </button>
                        )}
                        
                        {(job.status === 'running' || job.status === 'paused') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onJobAction(job.id, 'stop');
                            }}
                            className="p-1.5 text-error hover:bg-error-50 rounded nav-transition"
                            title="Stop"
                          >
                            <Icon name="Square" size={14} />
                          </button>
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onJobSelect(job);
                          }}
                          className="p-1.5 text-text-secondary hover:bg-secondary-100 rounded nav-transition"
                          title="View Details"
                        >
                          <Icon name="Eye" size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Search" size={24} className="text-text-secondary" />
            </div>
            <h4 className="text-lg font-medium text-text-primary mb-2">No Jobs Found</h4>
            <p className="text-text-secondary mb-4">No scraping jobs match the current filter criteria.</p>
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-700 nav-transition mx-auto">
              <Icon name="Plus" size={18} />
              <span>Create New Job</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveJobsTable;