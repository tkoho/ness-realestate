import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('EN');
  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Updated navigation for automation focus
  const navigationItems = [
    { 
      label: 'Control Center', 
      path: '/automation-control', 
      icon: 'Zap',
      tooltip: 'Monitor automation and view call queue'
    },
    { 
      label: 'Call Queue', 
      path: '/call-queue', 
      icon: 'Phone',
      tooltip: 'Leads ready for your closing calls',
      urgent: true // This will show a notification badge
    },
    { 
      label: 'Automation', 
      path: '/message-automation', 
      icon: 'MessageCircle',
      tooltip: 'Manage automated message sequences'
    },
    { 
      label: 'Contracts', 
      path: '/contracts', 
      icon: 'FileText',
      tooltip: 'Track signed contracts and commissions'
    },
    { 
      label: 'Settings', 
      path: '/settings', 
      icon: 'Settings',
      tooltip: 'Configure automation and templates'
    }
  ];

  const profileMenuItems = [
    { label: 'Profile Settings', icon: 'User', action: () => navigate('/settings') },
    { label: 'Templates', icon: 'FileText', action: () => navigate('/message-automation') },
    { label: 'Help & Support', icon: 'HelpCircle', action: () => {} },
    { label: 'Logout', icon: 'LogOut', action: () => navigate('/login') }
  ];

  // Mock notification counts for urgent items
  const notifications = {
    '/call-queue': 8, // 8 leads ready for calls
    '/automation-control': 0,
    '/message-automation': 2, // 2 automation issues
    '/contracts': 3 // 3 pending contracts
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setCurrentLanguage(prev => prev === 'EN' ? 'TH' : 'EN');
  };

  const isActivePath = (path) => {
    // Handle dynamic routes
    if (path === '/call-queue' && location.pathname.startsWith('/lead-details')) {
      return true;
    }
    if (path === '/automation-control' && location.pathname === '/') {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-surface border-b border-border z-1000">
      <div className="h-16 px-4 lg:px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg relative">
            <Icon name="Zap" size={20} color="white" />
            {/* Automation status indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-success rounded-full animate-pulse"></div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-text-primary">LeadGen Pro</h1>
            <p className="text-xs text-text-secondary">Automated Real Estate Intelligence</p>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`
                flex items-center space-x-2 px-6 py-3 rounded-lg font-medium text-sm
                nav-transition relative group
                ${isActivePath(item.path)
                  ? 'bg-primary-50 text-primary border border-primary-100' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                }
                ${item.urgent && notifications[item.path] > 0 ? 'animate-pulse' : ''}
              `}
              title={item.tooltip}
            >
              <Icon name={item.icon} size={18} />
              <span>{item.label}</span>
              
              {/* Notification Badge */}
              {notifications[item.path] > 0 && (
                <span className={`
                  absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white
                  ${item.urgent ? 'bg-error animate-pulse' : 'bg-warning'}
                `}>
                  {notifications[item.path]}
                </span>
              )}
              
              {isActivePath(item.path) && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
              )}
            </button>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Automation Health Indicator */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg bg-success-50 text-success-600">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Auto: ON</span>
          </div>

          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-secondary-50 nav-transition"
          >
            <Icon name="Globe" size={16} />
            <span>{currentLanguage}</span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-50 nav-transition"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <Icon name="User" size={16} color="#1E40AF" />
              </div>
              <Icon 
                name="ChevronDown" 
                size={16} 
                className={`text-text-secondary transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-lg shadow-elevated border border-border py-2 z-1010">
                {profileMenuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      item.action();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-secondary-50 nav-transition"
                  >
                    <Icon name={item.icon} size={16} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary-50 nav-transition relative"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            {/* Mobile notification indicator */}
            {Object.values(notifications).some(count => count > 0) && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full animate-ping"></div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-border z-1020">
          <nav className="px-4 py-4 space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium
                  nav-transition
                  ${isActivePath(item.path)
                    ? 'bg-primary-50 text-primary border border-primary-100' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon name={item.icon} size={18} />
                  <span>{item.label}</span>
                </div>
                
                {notifications[item.path] > 0 && (
                  <span className={`
                    w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center text-white
                    ${item.urgent ? 'bg-error' : 'bg-warning'}
                  `}>
                    {notifications[item.path]}
                  </span>
                )}
              </button>
            ))}
            
            {/* Mobile Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-secondary-50 nav-transition"
            >
              <Icon name="Globe" size={18} />
              <span>Language: {currentLanguage}</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;