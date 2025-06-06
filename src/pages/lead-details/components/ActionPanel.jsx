import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ActionPanel = ({ leadData, contactStatus, onStatusChange, onContactAction }) => {
  const [quickNote, setQuickNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState(contactStatus);

  const statusOptions = [
    { value: 'new', label: 'New Lead', color: 'bg-primary-50 text-primary' },
    { value: 'contacted', label: 'Contacted', color: 'bg-warning-50 text-warning-600' },
    { value: 'interested', label: 'Interested', color: 'bg-success-50 text-success-600' },
    { value: 'not_interested', label: 'Not Interested', color: 'bg-error-50 text-error-600' },
    { value: 'follow_up', label: 'Follow Up', color: 'bg-accent-50 text-accent-700' },
    { value: 'converted', label: 'Converted', color: 'bg-success-50 text-success-600' }
  ];

  const contactActions = [
    {
      type: 'call',
      label: 'Call Owner',
      icon: 'Phone',
      color: 'bg-primary text-white hover:bg-primary-700',
      href: `tel:${leadData.phone}`
    },
    {
      type: 'message',
      label: 'Send Message',
      icon: 'MessageCircle',
      color: 'bg-accent text-white hover:bg-accent-700',
      href: leadData.messengerLink
    },
    {
      type: 'email',
      label: 'Send Email',
      icon: 'Mail',
      color: 'bg-secondary-600 text-white hover:bg-secondary-700',
      href: `mailto:${leadData.email}`
    }
  ];

  const handleStatusUpdate = () => {
    onStatusChange(selectedStatus);
  };

  const handleQuickNote = () => {
    if (quickNote.trim()) {
      console.log('Quick note:', quickNote);
      setQuickNote('');
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-6">Quick Actions</h3>

      {/* Contact Actions */}
      <div className="space-y-3 mb-6">
        {contactActions.map((action) => (
          <a
            key={action.type}
            href={action.href}
            target={action.type === 'email' || action.type === 'message' ? '_blank' : undefined}
            rel={action.type === 'email' || action.type === 'message' ? 'noopener noreferrer' : undefined}
            onClick={() => onContactAction(action.type)}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium nav-transition ${action.color}`}
          >
            <Icon name={action.icon} size={18} />
            <span>{action.label}</span>
          </a>
        ))}
      </div>

      {/* Status Update */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-secondary mb-3">
          Update Status
        </label>
        <div className="space-y-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={handleStatusUpdate}
            className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-700 nav-transition"
          >
            Update Status
          </button>
        </div>
      </div>

      {/* Quick Notes */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-text-secondary mb-3">
          Quick Note
        </label>
        <div className="space-y-2">
          <textarea
            value={quickNote}
            onChange={(e) => setQuickNote(e.target.value)}
            placeholder="Add a quick note about this lead..."
            className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={3}
          />
          <button
            onClick={handleQuickNote}
            disabled={!quickNote.trim()}
            className="w-full px-4 py-2 bg-secondary-600 text-white rounded-lg font-medium hover:bg-secondary-700 nav-transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save Note
          </button>
        </div>
      </div>

      {/* Lead Information Summary */}
      <div className="border-t border-border pt-6">
        <h4 className="font-medium text-text-primary mb-4">Lead Summary</h4>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">Date Scraped:</span>
            <span className="text-text-primary">{leadData.dateScraped}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Last Contact:</span>
            <span className="text-text-primary">{leadData.lastContact}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Next Follow-up:</span>
            <span className="text-text-primary">{leadData.nextFollowUp}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Source:</span>
            <span className="text-text-primary">{leadData.source}</span>
          </div>
        </div>
      </div>

      {/* Workflow Actions */}
      <div className="border-t border-border pt-6 mt-6">
        <h4 className="font-medium text-text-primary mb-4">Workflow</h4>
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm text-text-secondary hover:bg-secondary-50 rounded-lg nav-transition">
            <Icon name="Calendar" size={16} />
            <span>Schedule Follow-up</span>
          </button>
          <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm text-text-secondary hover:bg-secondary-50 rounded-lg nav-transition">
            <Icon name="FileText" size={16} />
            <span>Generate Report</span>
          </button>
          <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm text-text-secondary hover:bg-secondary-50 rounded-lg nav-transition">
            <Icon name="Share" size={16} />
            <span>Share Lead</span>
          </button>
          <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm text-error-600 hover:bg-error-50 rounded-lg nav-transition">
            <Icon name="Archive" size={16} />
            <span>Archive Lead</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionPanel;