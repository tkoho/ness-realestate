import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';

const QuickActions = () => {
  const navigate = useNavigate();

  // Mock data for quick actions
  const quickActions = [
    {
      id: 1,
      title: "Start New Scraping",
      description: "Launch a new data collection job",
      icon: "Play",
      color: "primary",
      action: () => navigate('/scraping-management'),
      badge: null
    },
    {
      id: 2,
      title: "View All Leads",
      description: "Browse complete leads database",
      icon: "Users",
      color: "accent",
      action: () => navigate('/leads-database'),
      badge: "1,247"
    },
    {
      id: 3,
      title: "Export Data",
      description: "Download leads in Excel format",
      icon: "Download",
      color: "success",
      action: () => {},
      badge: null
    },
    {
      id: 4,
      title: "System Settings",
      description: "Configure scraping parameters",
      icon: "Settings",
      color: "warning",
      action: () => navigate('/settings'),
      badge: null
    }
  ];

  const recentExports = [
    {
      id: 1,
      name: "Facebook_Leads_Today.xlsx",
      size: "2.4 MB",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      status: "ready"
    },
    {
      id: 2,
      name: "Google_Maps_Hua_Hin.xlsx",
      size: "1.8 MB",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: "ready"
    },
    {
      id: 3,
      name: "All_Sources_Weekly.xlsx",
      size: "5.2 MB",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      status: "ready"
    }
  ];

  const getActionColorClasses = (color) => {
    const colorMap = {
      primary: 'bg-primary-50 text-primary border-primary-200 hover:bg-primary-100',
      accent: 'bg-accent-50 text-accent border-accent-200 hover:bg-accent-100',
      success: 'bg-success-50 text-success border-success-200 hover:bg-success-100',
      warning: 'bg-warning-50 text-warning border-warning-200 hover:bg-warning-100'
    };
    return colorMap[color] || colorMap.primary;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now - timestamp) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="bg-surface rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={18} color="var(--color-primary)" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Quick Actions</h2>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className={`w-full p-4 rounded-lg border text-left nav-transition ${getActionColorClasses(action.color)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Icon name={action.icon} size={20} />
                    <div>
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-sm opacity-80">{action.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {action.badge && (
                      <span className="px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs font-medium">
                        {action.badge}
                      </span>
                    )}
                    <Icon name="ChevronRight" size={16} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Exports */}
      <div className="bg-surface rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-success-50 rounded-lg flex items-center justify-center">
                <Icon name="FileText" size={18} color="var(--color-success)" />
              </div>
              <h2 className="text-lg font-semibold text-text-primary">Recent Exports</h2>
            </div>
            <button className="text-sm text-primary hover:text-primary-700 font-medium nav-transition">
              View All
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-3">
            {recentExports.map((exportFile) => (
              <div
                key={exportFile.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary-50 nav-transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-success-50 rounded-lg flex items-center justify-center">
                    <Icon name="FileSpreadsheet" size={16} color="var(--color-success)" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-text-primary truncate">
                      {exportFile.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-xs text-text-secondary">
                      <span>{exportFile.size}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(exportFile.timestamp)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-success-50 text-success text-xs font-medium rounded-full border border-success-200">
                    Ready
                  </span>
                  <button className="p-1 rounded hover:bg-secondary-100 nav-transition">
                    <Icon name="Download" size={14} className="text-text-secondary" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <button className="w-full py-2 text-sm text-primary hover:text-primary-700 font-medium border border-primary-200 rounded-lg hover:bg-primary-50 nav-transition">
              <Icon name="Plus" size={14} className="inline mr-2" />
              Create New Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;