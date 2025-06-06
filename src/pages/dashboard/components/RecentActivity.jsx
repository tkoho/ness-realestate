import React from 'react';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const RecentActivity = () => {
  // Mock data for recent activities
  const recentActivities = [
    {
      id: 1,
      type: "lead_scraped",
      title: "New Property Lead",
      description: "2-bedroom condo in Hua Hin Center",
      source: "Facebook Groups",
      contact: "Somchai Jaidee",
      phone: "+66 81 234 5678",
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      status: "new",
      propertyImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop"
    },
    {
      id: 2,
      type: "scraping_completed",
      title: "Scraping Job Completed",
      description: "Google Maps - Hua Hin Rentals",
      source: "Google Maps",
      contact: "System",
      phone: "47 new leads",
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      status: "completed",
      propertyImage: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=400&h=300&fit=crop"
    },
    {
      id: 3,
      type: "lead_contacted",
      title: "Lead Contacted",
      description: "Villa owner responded via Messenger",
      source: "Facebook Messenger",
      contact: "Niran Thanakit",
      phone: "+66 89 876 5432",
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      status: "contacted",
      propertyImage: "https://images.pixabay.com/photo/2016/06/24/10/47/house-1477041_1280.jpg?w=400&h=300&fit=crop"
    },
    {
      id: 4,
      type: "lead_scraped",
      title: "Beachfront Property",
      description: "3-bedroom house near Cha-Am Beach",
      source: "Thai Classifieds",
      contact: "Apinya Srisawat",
      phone: "+66 92 345 6789",
      timestamp: new Date(Date.now() - 2700000), // 45 minutes ago
      status: "new",
      propertyImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop"
    },
    {
      id: 5,
      type: "scraping_started",
      title: "New Scraping Job Started",
      description: "Pantip Real Estate Forum - Hua Hin",
      source: "Pantip Forum",
      contact: "System",
      phone: "In progress...",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      status: "running",
      propertyImage: "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?w=400&h=300&fit=crop"
    }
  ];

  const getActivityIcon = (type) => {
    const iconMap = {
      lead_scraped: 'UserPlus',
      scraping_completed: 'CheckCircle',
      lead_contacted: 'MessageCircle',
      scraping_started: 'Play'
    };
    return iconMap[type] || 'Activity';
  };

  const getActivityColor = (status) => {
    const colorMap = {
      new: 'text-primary bg-primary-50',
      completed: 'text-success bg-success-50',
      contacted: 'text-accent bg-accent-50',
      running: 'text-warning bg-warning-50'
    };
    return colorMap[status] || 'text-secondary bg-secondary-50';
  };

  const getStatusBadge = (status) => {
    const badgeMap = {
      new: 'bg-primary-100 text-primary border-primary-200',
      completed: 'bg-success-100 text-success border-success-200',
      contacted: 'bg-accent-100 text-accent border-accent-200',
      running: 'bg-warning-100 text-warning border-warning-200'
    };
    return badgeMap[status] || 'bg-secondary-100 text-secondary border-secondary-200';
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
    <div className="bg-surface rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-50 rounded-lg flex items-center justify-center">
              <Icon name="Activity" size={18} color="var(--color-primary)" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">Recent Activity</h2>
          </div>
          <button className="text-sm text-primary hover:text-primary-700 font-medium nav-transition">
            View All
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-4 p-4 rounded-lg hover:bg-secondary-50 nav-transition"
            >
              {/* Activity Icon */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.status)}`}>
                <Icon name={getActivityIcon(activity.type)} size={18} />
              </div>

              {/* Property Image */}
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={activity.propertyImage}
                  alt={activity.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Activity Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-sm font-medium text-text-primary truncate">
                    {activity.title}
                  </h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(activity.status)}`}>
                    {activity.status}
                  </span>
                </div>
                
                <p className="text-sm text-text-secondary mb-2 line-clamp-2">
                  {activity.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Icon name="Globe" size={12} />
                      <span>{activity.source}</span>
                    </span>
                    {activity.contact !== 'System' && (
                      <span className="flex items-center space-x-1">
                        <Icon name="User" size={12} />
                        <span>{activity.contact}</span>
                      </span>
                    )}
                  </div>
                  <span>{formatTimeAgo(activity.timestamp)}</span>
                </div>
                
                {activity.phone && activity.contact !== 'System' && (
                  <div className="mt-2 flex items-center space-x-1 text-xs text-text-secondary">
                    <Icon name="Phone" size={12} />
                    <span>{activity.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-6 text-center">
          <button className="w-full py-2 text-sm text-primary hover:text-primary-700 font-medium border border-primary-200 rounded-lg hover:bg-primary-50 nav-transition">
            Load More Activities
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentActivity;