import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const SourceConfiguration = ({ sources, onSourceUpdate }) => {
  const [expandedSections, setExpandedSections] = useState({
    facebook: true,
    googlemaps: true,
    thaiclassifieds: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected':
        return 'text-success bg-success-50';
      case 'error':
        return 'text-error bg-error-50';
      case 'disconnected':
        return 'text-secondary bg-secondary-100';
      default:
        return 'text-secondary bg-secondary-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected':
        return 'CheckCircle';
      case 'error':
        return 'AlertCircle';
      case 'disconnected':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const formatLastSync = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const groupedSources = {
    facebook: sources.filter(s => s.type === 'Facebook Groups'),
    googlemaps: sources.filter(s => s.type === 'Google Maps'),
    thaiclassifieds: sources.filter(s => s.type === 'Thai Classifieds')
  };

  const sectionConfig = {
    facebook: {
      title: 'Facebook Groups',
      icon: 'Users',
      color: 'text-blue-600'
    },
    googlemaps: {
      title: 'Google Maps',
      icon: 'MapPin',
      color: 'text-green-600'
    },
    thaiclassifieds: {
      title: 'Thai Classifieds',
      icon: 'Globe',
      color: 'text-orange-600'
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-text-primary mb-1">Source Configuration</h3>
        <p className="text-sm text-text-secondary">Manage data collection sources</p>
      </div>

      <div className="p-4 space-y-4">
        {Object.entries(sectionConfig).map(([key, config]) => (
          <div key={key} className="border border-border rounded-lg">
            <button
              onClick={() => toggleSection(key)}
              className="w-full flex items-center justify-between p-3 hover:bg-secondary-50 nav-transition"
            >
              <div className="flex items-center space-x-3">
                <Icon name={config.icon} size={18} className={config.color} />
                <div className="text-left">
                  <h4 className="text-sm font-medium text-text-primary">{config.title}</h4>
                  <p className="text-xs text-text-secondary">
                    {groupedSources[key].length} source{groupedSources[key].length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`text-text-secondary transition-transform duration-200 ${
                  expandedSections[key] ? 'rotate-180' : ''
                }`}
              />
            </button>

            {expandedSections[key] && (
              <div className="border-t border-border">
                {groupedSources[key].length > 0 ? (
                  <div className="p-3 space-y-3">
                    {groupedSources[key].map((source) => (
                      <div key={source.id} className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h5 className="text-sm font-medium text-text-primary truncate">
                              {source.name}
                            </h5>
                            <span className={`
                              inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                              ${getStatusColor(source.status)}
                            `}>
                              <Icon name={getStatusIcon(source.status)} size={10} className="mr-1" />
                              {source.status}
                            </span>
                          </div>
                          
                          <div className="space-y-1">
                            <p className="text-xs text-text-secondary">
                              Last sync: {formatLastSync(source.lastSync)}
                            </p>
                            {source.memberCount && (
                              <p className="text-xs text-text-secondary">
                                {source.memberCount.toLocaleString()} members
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-1 ml-2">
                          <button
                            className="p-1 text-text-secondary hover:text-primary nav-transition"
                            title="Configure"
                          >
                            <Icon name="Settings" size={14} />
                          </button>
                          
                          <button
                            className="p-1 text-text-secondary hover:text-accent nav-transition"
                            title="Test Connection"
                          >
                            <Icon name="RefreshCw" size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center">
                    <p className="text-sm text-text-secondary">No sources configured</p>
                    <button className="mt-2 text-xs text-primary hover:text-primary-700 nav-transition">
                      Add Source
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <button className="w-full flex items-center justify-center space-x-2 p-3 border-2 border-dashed border-secondary-300 rounded-lg text-text-secondary hover:text-primary hover:border-primary nav-transition">
          <Icon name="Plus" size={18} />
          <span className="text-sm font-medium">Add New Source</span>
        </button>
      </div>
    </div>
  );
};

export default SourceConfiguration;