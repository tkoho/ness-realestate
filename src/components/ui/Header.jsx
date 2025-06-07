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
      urgent: false // No mock data, so no urgency
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

  // Empty state - no mock data
  const notifications = {
    '/call-queue': 0, // No leads ready for calls
    '/automation-control': 0,
    '/message-automation': 0, // No automation issues
    '/contracts': 0 // No pending contracts
  };

  // Automation status
  const automationStatus = {
    isRunning: false,
    hasIssues: false,
    isConfigured: false
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActivePath = (path) => {
    if (path === '/automation-control') {
      return location.pathname === '/' || location.pathname === '/automation-control';
    }
    return location.pathname === path;
  };

  const getItemClasses = (item) => {
    const baseClasses = "relative flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium nav-transition";
    const isActive = isActivePath(item.path);
    
    if (isActive) {
      return `${baseClasses} bg-primary text-white shadow-soft`;
    }
    
    if (item.urgent && notifications[item.path] > 0) {
      return `${baseClasses} text-error bg-error-50 hover:bg-error-100 border border-error-200`;
    }
    
    return `${baseClasses} text-text-secondary hover:text-text-primary hover:bg-secondary-50`;
  };

  const renderNotificationBadge = (item) => {
    const count = notifications[item.path];
    
    if (count === 0) return null;
    
    return (
      <div className={`
        absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-xs font-bold
        ${item.urgent ? 'bg-error text-white animate-pulse' : 'bg-warning text-white'}
      `}>
        {count > 99 ? '99+' : count}
      </div>
    );
  };

  const renderAutomationStatusIndicator = () => {
    if (!automationStatus.isConfigured) {
      return (
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-secondary-50 rounded-lg border border-secondary-200">
          <div className="w-2 h-2 bg-secondary-300 rounded-full"></div>
          <span className="text-xs text-text-secondary">Ready to Configure</span>
        </div>
      );
    }

    if (automationStatus.hasIssues) {
      return (
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-warning-50 rounded-lg border border-warning-200">
          <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
          <span className="text-xs text-warning-700">Issues Detected</span>
        </div>
      );
    }

    if (automationStatus.isRunning) {
      return (
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-success-50 rounded-lg border border-success-200">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs text-success-700">Running</span>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-2 px-3 py-1.5 bg-primary-50 rounded-lg border border-primary-200">
        <div className="w-2 h-2 bg-primary rounded-full"></div>
        <span className="text-xs text-primary-700">Configured</span>
      </div>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border shadow-soft">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div 
              onClick={() => navigate('/automation-control')}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={18} color="white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-text-primary">LeadGen Pro</h1>
                <div className="text-xs text-text-secondary">Automation Platform</div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <div key={item.path} className="relative">
                <button
                  onClick={() => navigate(item.path)}
                  className={getItemClasses(item)}
                  title={item.tooltip}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                  {renderNotificationBadge(item)}
                </button>
              </div>
            ))}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            {/* Automation Status */}
            <div className="hidden md:block">
              {renderAutomationStatusIndicator()}
            </div>

            {/* Language Toggle */}
            <button
              onClick={() => setCurrentLanguage(currentLanguage === 'EN' ? 'TH' : 'EN')}
              className="px-2 py-1 text-sm font-medium text-text-secondary bg-secondary-50 rounded border border-secondary-200 hover:bg-secondary-100 nav-transition"
            >
              {currentLanguage}
            </button>

            {/* Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-medium text-sm hover:bg-primary-600 nav-transition"
              >
                A
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border rounded-lg shadow-elevated py-2 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <div className="font-medium text-text-primary">Agent User</div>
                    <div className="text-sm text-text-secondary">agent@fazwaz.com</div>
                  </div>
                  
                  {profileMenuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        item.action();
                        setIsProfileOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-secondary-50 nav-transition flex items-center space-x-2"
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
              className="lg:hidden w-8 h-8 flex items-center justify-center text-text-secondary hover:text-text-primary nav-transition"
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full ${getItemClasses(item)} justify-start`}
                >
                  <Icon name={item.icon} size={16} />
                  <span>{item.label}</span>
                  {renderNotificationBadge(item)}
                </button>
              ))}
            </nav>
            
            {/* Mobile Automation Status */}
            <div className="mt-4 pt-4 border-t border-border">
              {renderAutomationStatusIndicator()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;