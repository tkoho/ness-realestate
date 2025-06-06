import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getBreadcrumbItems = () => {
    const path = location.pathname;
    const items = [];

    // Always start with Dashboard as home
    items.push({
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'Home'
    });

    switch (path) {
      case '/dashboard':
        return items;
        
      case '/scraping-management':
        items.push({
          label: 'Scraping Management',
          path: '/scraping-management',
          icon: 'Search'
        });
        break;
        
      case '/leads-database':
        items.push({
          label: 'Leads Database',
          path: '/leads-database',
          icon: 'Users'
        });
        break;
        
      case '/lead-details':
        items.push({
          label: 'Leads Database',
          path: '/leads-database',
          icon: 'Users'
        });
        items.push({
          label: 'Lead Details',
          path: '/lead-details',
          icon: 'User'
        });
        break;
        
      case '/settings':
        items.push({
          label: 'Settings',
          path: '/settings',
          icon: 'Settings'
        });
        break;
        
      default:
        return items;
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  if (breadcrumbItems.length <= 1) {
    return null;
  }

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      {breadcrumbItems.map((item, index) => (
        <div key={item.path} className="flex items-center space-x-2">
          {index > 0 && (
            <Icon 
              name="ChevronRight" 
              size={14} 
              className="text-secondary-400" 
            />
          )}
          
          {index === breadcrumbItems.length - 1 ? (
            <div className="flex items-center space-x-2 text-text-primary font-medium">
              <Icon name={item.icon} size={14} />
              <span>{item.label}</span>
            </div>
          ) : (
            <button
              onClick={() => handleNavigation(item.path)}
              className="flex items-center space-x-2 text-text-secondary hover:text-primary nav-transition"
            >
              <Icon name={item.icon} size={14} />
              <span>{item.label}</span>
            </button>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;