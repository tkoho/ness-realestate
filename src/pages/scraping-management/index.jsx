import React, { useState, useEffect } from 'react';
import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';
import SourceConfiguration from './components/SourceConfiguration';
import ActiveJobsTable from './components/ActiveJobsTable';
import JobDetailsPanel from './components/JobDetailsPanel';

const ScrapingManagement = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [sources, setSources] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);

  // Mock data for scraping jobs
  const mockJobs = [
    {
      id: 'job_001',
      source: 'Facebook Groups',
      targetLocation: 'Hua Hin, Thailand',
      status: 'running',
      progress: 65,
      itemsFound: 142,
      estimatedCompletion: '15 minutes',
      startTime: new Date(Date.now() - 1800000),
      sourceDetails: 'Hua Hin Property Owners',
      errorCount: 0,
      lastUpdate: new Date(Date.now() - 300000)
    },
    {
      id: 'job_002',
      source: 'Google Maps',
      targetLocation: 'Cha-Am, Thailand',
      status: 'completed',
      progress: 100,
      itemsFound: 89,
      estimatedCompletion: 'Completed',
      startTime: new Date(Date.now() - 7200000),
      sourceDetails: 'Real Estate Listings',
      errorCount: 2,
      lastUpdate: new Date(Date.now() - 1800000)
    },
    {
      id: 'job_003',
      source: 'Thai Classifieds',
      targetLocation: 'Pranburi, Thailand',
      status: 'scheduled',
      progress: 0,
      itemsFound: 0,
      estimatedCompletion: 'Starts in 2 hours',
      startTime: new Date(Date.now() + 7200000),
      sourceDetails: 'BahtSold.com',
      errorCount: 0,
      lastUpdate: new Date()
    },
    {
      id: 'job_004',
      source: 'Facebook Groups',
      targetLocation: 'Hua Hin, Thailand',
      status: 'failed',
      progress: 25,
      itemsFound: 23,
      estimatedCompletion: 'Failed',
      startTime: new Date(Date.now() - 3600000),
      sourceDetails: 'Hua Hin Rentals & Sales',
      errorCount: 15,
      lastUpdate: new Date(Date.now() - 1200000)
    },
    {
      id: 'job_005',
      source: 'Google Maps',
      targetLocation: 'Hua Hin, Thailand',
      status: 'paused',
      progress: 45,
      itemsFound: 67,
      estimatedCompletion: 'Paused',
      startTime: new Date(Date.now() - 2400000),
      sourceDetails: 'Property Agents',
      errorCount: 1,
      lastUpdate: new Date(Date.now() - 600000)
    }
  ];

  // Mock data for sources
  const mockSources = [
    {
      id: 'fb_001',
      type: 'Facebook Groups',
      name: 'Hua Hin Property Owners',
      status: 'connected',
      lastSync: new Date(Date.now() - 300000),
      memberCount: 15420,
      isActive: true
    },
    {
      id: 'fb_002',
      type: 'Facebook Groups',
      name: 'Hua Hin Rentals & Sales',
      status: 'error',
      lastSync: new Date(Date.now() - 1200000),
      memberCount: 8930,
      isActive: false
    },
    {
      id: 'gm_001',
      type: 'Google Maps',
      name: 'Real Estate Listings',
      status: 'connected',
      lastSync: new Date(Date.now() - 1800000),
      memberCount: null,
      isActive: true
    },
    {
      id: 'tc_001',
      type: 'Thai Classifieds',
      name: 'BahtSold.com',
      status: 'connected',
      lastSync: new Date(Date.now() - 600000),
      memberCount: null,
      isActive: true
    },
    {
      id: 'tc_002',
      type: 'Thai Classifieds',
      name: 'Kaidee.com',
      status: 'disconnected',
      lastSync: new Date(Date.now() - 86400000),
      memberCount: null,
      isActive: false
    }
  ];

  const tabs = [
    { id: 'active', label: 'Active', count: mockJobs.filter(job => job.status === 'running').length },
    { id: 'scheduled', label: 'Scheduled', count: mockJobs.filter(job => job.status === 'scheduled').length },
    { id: 'completed', label: 'Completed', count: mockJobs.filter(job => job.status === 'completed').length },
    { id: 'failed', label: 'Failed', count: mockJobs.filter(job => job.status === 'failed').length }
  ];

  useEffect(() => {
    setJobs(mockJobs);
    setSources(mockSources);
    if (mockJobs.length > 0) {
      setSelectedJob(mockJobs[0]);
    }
  }, []);

  const filteredJobs = jobs.filter(job => {
    switch (activeTab) {
      case 'active':
        return job.status === 'running' || job.status === 'paused';
      case 'scheduled':
        return job.status === 'scheduled';
      case 'completed':
        return job.status === 'completed';
      case 'failed':
        return job.status === 'failed';
      default:
        return true;
    }
  });

  const handleJobSelect = (job) => {
    setSelectedJob(job);
  };

  const handleBulkAction = (action) => {
    console.log(`Performing ${action} on jobs:`, selectedJobs);
    // Implement bulk actions
  };

  const handleJobAction = (jobId, action) => {
    setJobs(prevJobs => 
      prevJobs.map(job => {
        if (job.id === jobId) {
          switch (action) {
            case 'pause':
              return { ...job, status: 'paused' };
            case 'resume':
              return { ...job, status: 'running' };
            case 'stop':
              return { ...job, status: 'failed', progress: job.progress };
            default:
              return job;
          }
        }
        return job;
      })
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold text-text-primary mb-2">Scraping Management</h1>
                <p className="text-text-secondary">Monitor and control automated data collection from multiple sources</p>
              </div>
              
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 bg-accent text-white rounded-lg font-medium hover:bg-accent-700 nav-transition">
                  <Icon name="Plus" size={18} />
                  <span>New Job</span>
                </button>
                
                <button className="flex items-center space-x-2 px-4 py-2 bg-secondary-100 text-text-primary rounded-lg font-medium hover:bg-secondary-200 nav-transition">
                  <Icon name="RefreshCw" size={18} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center space-x-1 bg-secondary-50 p-1 rounded-lg w-fit">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium nav-transition
                    ${activeTab === tab.id
                      ? 'bg-surface text-primary shadow-soft'
                      : 'text-text-secondary hover:text-text-primary'
                    }
                  `}
                >
                  <span>{tab.label}</span>
                  <span className={`
                    px-2 py-0.5 rounded-full text-xs font-medium
                    ${activeTab === tab.id
                      ? 'bg-primary-50 text-primary' :'bg-secondary-200 text-text-secondary'
                    }
                  `}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedJobs.length > 0 && (
            <div className="mb-6 p-4 bg-primary-50 border border-primary-100 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-primary">
                    {selectedJobs.length} job{selectedJobs.length > 1 ? 's' : ''} selected
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleBulkAction('pause')}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-warning text-white rounded-md text-sm font-medium hover:bg-warning-600 nav-transition"
                  >
                    <Icon name="Pause" size={14} />
                    <span>Pause</span>
                  </button>
                  
                  <button
                    onClick={() => handleBulkAction('export')}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-accent text-white rounded-md text-sm font-medium hover:bg-accent-700 nav-transition"
                  >
                    <Icon name="Download" size={14} />
                    <span>Export</span>
                  </button>
                  
                  <button
                    onClick={() => setSelectedJobs([])}
                    className="p-1.5 text-text-secondary hover:text-text-primary nav-transition"
                  >
                    <Icon name="X" size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Source Configuration Panel */}
            <div className="lg:col-span-1">
              <SourceConfiguration 
                sources={sources}
                onSourceUpdate={setSources}
              />
            </div>

            {/* Active Jobs Table */}
            <div className="lg:col-span-2">
              <ActiveJobsTable
                jobs={filteredJobs}
                selectedJobs={selectedJobs}
                onJobSelect={handleJobSelect}
                onJobsSelect={setSelectedJobs}
                onJobAction={handleJobAction}
                selectedJob={selectedJob}
              />
            </div>

            {/* Job Details Panel */}
            <div className="lg:col-span-1">
              <JobDetailsPanel
                job={selectedJob}
                onJobAction={handleJobAction}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ScrapingManagement;