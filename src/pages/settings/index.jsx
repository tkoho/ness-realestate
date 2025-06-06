import React, { useState } from 'react';
import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('scraping');
  const [settings, setSettings] = useState({
    scraping: {
      targetLocation: 'Hua Hin',
      radius: 25,
      keywords: ['rent', 'sale', 'property', 'house', 'condo'],
      scheduleEnabled: true,
      scheduleFrequency: 'daily',
      scheduleTime: '09:00',
      maxResults: 1000,
      duplicateThreshold: 85
    },
    dataSources: {
      facebook: {
        enabled: true,
        connected: true,
        groups: ['Hua Hin Property', 'Thailand Real Estate', 'Expat Housing Thailand']
      },
      googleMaps: {
        enabled: true,
        connected: true,
        apiKey: '••••••••••••••••'
      },
      thaiPlatforms: {
        enabled: true,
        connected: false,
        platforms: ['Pantip', 'BahtSold', 'Kaidee']
      }
    },
    preferences: {
      language: 'en',
      notifications: {
        email: true,
        browser: true,
        scrapingComplete: true,
        newLeads: true,
        errors: true
      },
      exportFormat: 'xlsx',
      timezone: 'Asia/Bangkok',
      currency: 'THB'
    },
    system: {
      dataRetention: 365,
      autoBackup: true,
      backupFrequency: 'weekly',
      teamAccess: true,
      apiAccess: false
    }
  });

  const tabs = [
    { id: 'scraping', label: 'Scraping Configuration', icon: 'Search' },
    { id: 'sources', label: 'Data Sources', icon: 'Database' },
    { id: 'preferences', label: 'User Preferences', icon: 'User' },
    { id: 'system', label: 'System Settings', icon: 'Settings' }
  ];

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleNestedSettingChange = (category, parentKey, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [parentKey]: {
          ...prev[category][parentKey],
          [key]: value
        }
      }
    }));
  };

  const handleSaveSettings = () => {
    // Mock save functionality
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  const testConnection = (source) => {
    // Mock connection test
    alert(`Testing connection to ${source}...`);
    setTimeout(() => {
      alert(`Connection to ${source} successful!`);
    }, 1000);
  };

  const renderScrapingConfig = () => (
    <div className="space-y-8">
      {/* Location Targeting */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
          <Icon name="MapPin" size={20} />
          <span>Location Targeting</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Target Location
            </label>
            <input
              type="text"
              value={settings.scraping.targetLocation}
              onChange={(e) => handleSettingChange('scraping', 'targetLocation', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter location"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Search Radius (km)
            </label>
            <input
              type="number"
              value={settings.scraping.radius}
              onChange={(e) => handleSettingChange('scraping', 'radius', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              min="1"
              max="100"
            />
          </div>
        </div>

        {/* Map Interface */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Area Selection
          </label>
          <div className="w-full h-64 bg-secondary-50 rounded-lg border border-border overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title="Hua Hin Area"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=12.5706,99.9576&z=12&output=embed">
            </iframe>
          </div>
        </div>
      </div>

      {/* Keywords & Filters */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
          <Icon name="Filter" size={20} />
          <span>Keywords & Filters</span>
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Search Keywords
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {settings.scraping.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-50 text-primary border border-primary-100"
                >
                  {keyword}
                  <button
                    onClick={() => {
                      const newKeywords = settings.scraping.keywords.filter((_, i) => i !== index);
                      handleSettingChange('scraping', 'keywords', newKeywords);
                    }}
                    className="ml-2 hover:text-primary-700"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="Add new keyword and press Enter"
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && e.target.value.trim()) {
                  const newKeywords = [...settings.scraping.keywords, e.target.value.trim()];
                  handleSettingChange('scraping', 'keywords', newKeywords);
                  e.target.value = '';
                }
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Maximum Results per Run
              </label>
              <input
                type="number"
                value={settings.scraping.maxResults}
                onChange={(e) => handleSettingChange('scraping', 'maxResults', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                min="100"
                max="10000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Duplicate Detection Threshold (%)
              </label>
              <input
                type="number"
                value={settings.scraping.duplicateThreshold}
                onChange={(e) => handleSettingChange('scraping', 'duplicateThreshold', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                min="50"
                max="100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Scheduling */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
          <Icon name="Clock" size={20} />
          <span>Automated Scheduling</span>
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="scheduleEnabled"
              checked={settings.scraping.scheduleEnabled}
              onChange={(e) => handleSettingChange('scraping', 'scheduleEnabled', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="scheduleEnabled" className="text-sm font-medium text-text-primary">
              Enable Automated Scraping
            </label>
          </div>

          {settings.scraping.scheduleEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-7">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Frequency
                </label>
                <select
                  value={settings.scraping.scheduleFrequency}
                  onChange={(e) => handleSettingChange('scraping', 'scheduleFrequency', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="hourly">Every Hour</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={settings.scraping.scheduleTime}
                  onChange={(e) => handleSettingChange('scraping', 'scheduleTime', e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderDataSources = () => (
    <div className="space-y-6">
      {/* Facebook */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
            <Icon name="Facebook" size={20} />
            <span>Facebook Groups</span>
          </h3>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              settings.dataSources.facebook.connected 
                ? 'bg-success-50 text-success-600' :'bg-error-50 text-error-600'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-1 ${
                settings.dataSources.facebook.connected ? 'bg-success-500' : 'bg-error-500'
              }`}></div>
              {settings.dataSources.facebook.connected ? 'Connected' : 'Disconnected'}
            </span>
            <button
              onClick={() => testConnection('Facebook')}
              className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary-700 nav-transition"
            >
              Test Connection
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="facebookEnabled"
              checked={settings.dataSources.facebook.enabled}
              onChange={(e) => handleNestedSettingChange('dataSources', 'facebook', 'enabled', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="facebookEnabled" className="text-sm font-medium text-text-primary">
              Enable Facebook Scraping
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Target Groups
            </label>
            <div className="space-y-2">
              {settings.dataSources.facebook.groups.map((group, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <span className="text-sm text-text-primary">{group}</span>
                  <button
                    onClick={() => {
                      const newGroups = settings.dataSources.facebook.groups.filter((_, i) => i !== index);
                      handleNestedSettingChange('dataSources', 'facebook', 'groups', newGroups);
                    }}
                    className="text-error-500 hover:text-error-700"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Google Maps */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
            <Icon name="Map" size={20} />
            <span>Google Maps</span>
          </h3>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              settings.dataSources.googleMaps.connected 
                ? 'bg-success-50 text-success-600' :'bg-error-50 text-error-600'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-1 ${
                settings.dataSources.googleMaps.connected ? 'bg-success-500' : 'bg-error-500'
              }`}></div>
              {settings.dataSources.googleMaps.connected ? 'Connected' : 'Disconnected'}
            </span>
            <button
              onClick={() => testConnection('Google Maps')}
              className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary-700 nav-transition"
            >
              Test Connection
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="googleMapsEnabled"
              checked={settings.dataSources.googleMaps.enabled}
              onChange={(e) => handleNestedSettingChange('dataSources', 'googleMaps', 'enabled', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="googleMapsEnabled" className="text-sm font-medium text-text-primary">
              Enable Google Maps Scraping
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              API Key
            </label>
            <input
              type="password"
              value={settings.dataSources.googleMaps.apiKey}
              onChange={(e) => handleNestedSettingChange('dataSources', 'googleMaps', 'apiKey', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter Google Maps API Key"
            />
          </div>
        </div>
      </div>

      {/* Thai Platforms */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary flex items-center space-x-2">
            <Icon name="Globe" size={20} />
            <span>Thai Platforms</span>
          </h3>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              settings.dataSources.thaiPlatforms.connected 
                ? 'bg-success-50 text-success-600' :'bg-error-50 text-error-600'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-1 ${
                settings.dataSources.thaiPlatforms.connected ? 'bg-success-500' : 'bg-error-500'
              }`}></div>
              {settings.dataSources.thaiPlatforms.connected ? 'Connected' : 'Disconnected'}
            </span>
            <button
              onClick={() => testConnection('Thai Platforms')}
              className="px-3 py-1 text-sm bg-primary text-white rounded-lg hover:bg-primary-700 nav-transition"
            >
              Test Connection
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="thaiPlatformsEnabled"
              checked={settings.dataSources.thaiPlatforms.enabled}
              onChange={(e) => handleNestedSettingChange('dataSources', 'thaiPlatforms', 'enabled', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="thaiPlatformsEnabled" className="text-sm font-medium text-text-primary">
              Enable Thai Platforms Scraping
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Supported Platforms
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {settings.dataSources.thaiPlatforms.platforms.map((platform, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary-50 rounded-lg">
                  <span className="text-sm text-text-primary">{platform}</span>
                  <Icon name="CheckCircle" size={16} className="text-success-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUserPreferences = () => (
    <div className="space-y-6">
      {/* Language & Localization */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
          <Icon name="Globe" size={20} />
          <span>Language & Localization</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Interface Language
            </label>
            <select
              value={settings.preferences.language}
              onChange={(e) => handleNestedSettingChange('preferences', 'language', '', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="th">ไทย (Thai)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Timezone
            </label>
            <select
              value={settings.preferences.timezone}
              onChange={(e) => handleNestedSettingChange('preferences', 'timezone', '', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="Asia/Bangkok">Asia/Bangkok (UTC+7)</option>
              <option value="UTC">UTC (UTC+0)</option>
              <option value="America/New_York">America/New_York (UTC-5)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Currency
            </label>
            <select
              value={settings.preferences.currency}
              onChange={(e) => handleNestedSettingChange('preferences', 'currency', '', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="THB">Thai Baht (฿)</option>
              <option value="USD">US Dollar ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Export Format
            </label>
            <select
              value={settings.preferences.exportFormat}
              onChange={(e) => handleNestedSettingChange('preferences', 'exportFormat', '', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="xlsx">Excel (.xlsx)</option>
              <option value="csv">CSV (.csv)</option>
              <option value="json">JSON (.json)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
          <Icon name="Bell" size={20} />
          <span>Notification Preferences</span>
        </h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-text-primary">Delivery Methods</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={settings.preferences.notifications.email}
                    onChange={(e) => handleNestedSettingChange('preferences', 'notifications', 'email', e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <label htmlFor="emailNotifications" className="text-sm text-text-primary">
                    Email Notifications
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="browserNotifications"
                    checked={settings.preferences.notifications.browser}
                    onChange={(e) => handleNestedSettingChange('preferences', 'notifications', 'browser', e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <label htmlFor="browserNotifications" className="text-sm text-text-primary">
                    Browser Notifications
                  </label>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-text-primary">Event Types</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="scrapingCompleteNotif"
                    checked={settings.preferences.notifications.scrapingComplete}
                    onChange={(e) => handleNestedSettingChange('preferences', 'notifications', 'scrapingComplete', e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <label htmlFor="scrapingCompleteNotif" className="text-sm text-text-primary">
                    Scraping Complete
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="newLeadsNotif"
                    checked={settings.preferences.notifications.newLeads}
                    onChange={(e) => handleNestedSettingChange('preferences', 'notifications', 'newLeads', e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <label htmlFor="newLeadsNotif" className="text-sm text-text-primary">
                    New Leads Found
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="errorsNotif"
                    checked={settings.preferences.notifications.errors}
                    onChange={(e) => handleNestedSettingChange('preferences', 'notifications', 'errors', e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <label htmlFor="errorsNotif" className="text-sm text-text-primary">
                    Errors & Issues
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6">
      {/* Data Management */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
          <Icon name="Database" size={20} />
          <span>Data Management</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Data Retention Period (days)
            </label>
            <input
              type="number"
              value={settings.system.dataRetention}
              onChange={(e) => handleNestedSettingChange('system', 'dataRetention', '', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              min="30"
              max="3650"
            />
            <p className="text-xs text-text-secondary mt-1">
              Data older than this will be automatically archived
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Backup Frequency
            </label>
            <select
              value={settings.system.backupFrequency}
              onChange={(e) => handleNestedSettingChange('system', 'backupFrequency', '', e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="autoBackup"
              checked={settings.system.autoBackup}
              onChange={(e) => handleNestedSettingChange('system', 'autoBackup', '', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="autoBackup" className="text-sm font-medium text-text-primary">
              Enable Automatic Backups
            </label>
          </div>
        </div>
      </div>

      {/* Access Control */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
          <Icon name="Shield" size={20} />
          <span>Access Control</span>
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="teamAccess"
              checked={settings.system.teamAccess}
              onChange={(e) => handleNestedSettingChange('system', 'teamAccess', '', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="teamAccess" className="text-sm font-medium text-text-primary">
              Enable Team Access
            </label>
          </div>
          
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="apiAccess"
              checked={settings.system.apiAccess}
              onChange={(e) => handleNestedSettingChange('system', 'apiAccess', '', e.target.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="apiAccess" className="text-sm font-medium text-text-primary">
              Enable API Access
            </label>
          </div>
        </div>

        {settings.system.teamAccess && (
          <div className="mt-6 p-4 bg-secondary-50 rounded-lg">
            <h4 className="text-sm font-medium text-text-primary mb-3">Team Members</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-surface rounded border">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} color="#1E40AF" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">Admin User</p>
                    <p className="text-xs text-text-secondary">admin@fazwaz.com</p>
                  </div>
                </div>
                <span className="text-xs bg-primary-50 text-primary px-2 py-1 rounded">Admin</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* System Information */}
      <div className="bg-surface rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center space-x-2">
          <Icon name="Info" size={20} />
          <span>System Information</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-text-secondary">Version:</span>
              <span className="text-sm font-medium text-text-primary">v2.1.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-secondary">Last Updated:</span>
              <span className="text-sm font-medium text-text-primary">Dec 15, 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-secondary">Database Size:</span>
              <span className="text-sm font-medium text-text-primary">2.4 GB</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-text-secondary">Total Leads:</span>
              <span className="text-sm font-medium text-text-primary">15,847</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-secondary">Active Scrapers:</span>
              <span className="text-sm font-medium text-text-primary">3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-text-secondary">Uptime:</span>
              <span className="text-sm font-medium text-text-primary">99.8%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">Settings</h1>
            <p className="text-text-secondary">
              Configure scraping parameters, data sources, and system preferences
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <div className="bg-surface rounded-lg border border-border p-2">
                <nav className="space-y-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium
                        nav-transition
                        ${activeTab === tab.id
                          ? 'bg-primary-50 text-primary border border-primary-100' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
                        }
                      `}
                    >
                      <Icon name={tab.icon} size={18} />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="bg-surface rounded-lg border border-border">
                <div className="p-6 border-b border-border">
                  <h2 className="text-xl font-semibold text-text-primary">
                    {tabs.find(tab => tab.id === activeTab)?.label}
                  </h2>
                </div>
                
                <div className="p-6">
                  {activeTab === 'scraping' && renderScrapingConfig()}
                  {activeTab === 'sources' && renderDataSources()}
                  {activeTab === 'preferences' && renderUserPreferences()}
                  {activeTab === 'system' && renderSystemSettings()}
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4 border-t border-border bg-secondary-50 rounded-b-lg">
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => window.location.reload()}
                      className="px-4 py-2 text-sm font-medium text-text-secondary bg-surface border border-border rounded-lg hover:bg-secondary-50 nav-transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveSettings}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary-700 nav-transition flex items-center space-x-2"
                    >
                      <Icon name="Save" size={16} />
                      <span>Save Settings</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;