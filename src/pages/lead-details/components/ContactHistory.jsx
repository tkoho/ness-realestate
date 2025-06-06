import React, { useState } from 'react';
import Icon from 'components/AppIcon';

const ContactHistory = ({ history }) => {
  const [newNote, setNewNote] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  const getContactIcon = (type) => {
    switch (type) {
      case 'call': return 'Phone';
      case 'message': return 'MessageCircle';
      case 'email': return 'Mail';
      default: return 'Clock';
    }
  };

  const getOutcomeColor = (outcome) => {
    switch (outcome) {
      case 'interested': return 'text-success-600 bg-success-50';
      case 'not_interested': return 'text-error-600 bg-error-50';
      case 'no_response': return 'text-warning-600 bg-warning-50';
      case 'bounced': return 'text-error-600 bg-error-50';
      default: return 'text-secondary-600 bg-secondary-50';
    }
  };

  const getOutcomeLabel = (outcome) => {
    switch (outcome) {
      case 'interested': return 'Interested';
      case 'not_interested': return 'Not Interested';
      case 'no_response': return 'No Response';
      case 'bounced': return 'Bounced';
      default: return 'Unknown';
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      // In a real app, this would save to backend
      console.log('Adding note:', newNote);
      setNewNote('');
      setIsAddingNote(false);
    }
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Contact History</h3>
        <button
          onClick={() => setIsAddingNote(true)}
          className="flex items-center space-x-2 px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-700 nav-transition"
        >
          <Icon name="Plus" size={16} />
          <span>Add Note</span>
        </button>
      </div>

      {/* Add Note Form */}
      {isAddingNote && (
        <div className="mb-6 p-4 bg-secondary-50 rounded-lg border border-secondary-200">
          <div className="mb-3">
            <label className="block text-sm font-medium text-text-secondary mb-2">
              Add Contact Note
            </label>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter contact details, outcome, and next steps..."
              className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              rows={3}
            />
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleAddNote}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-700 nav-transition"
            >
              Save Note
            </button>
            <button
              onClick={() => {
                setIsAddingNote(false);
                setNewNote('');
              }}
              className="px-4 py-2 bg-secondary-100 text-text-secondary rounded-lg text-sm font-medium hover:bg-secondary-200 nav-transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {history.map((item, index) => (
          <div key={item.id} className="flex space-x-4">
            {/* Timeline Icon */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
                <Icon name={getContactIcon(item.type)} size={18} color="var(--color-primary)" />
              </div>
              {index < history.length - 1 && (
                <div className="w-px h-6 bg-secondary-200 mx-auto mt-2"></div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <h4 className="font-medium text-text-primary capitalize">
                    {item.type} Contact
                  </h4>
                  {item.duration && (
                    <span className="text-sm text-text-secondary">({item.duration})</span>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOutcomeColor(item.outcome)}`}>
                    {getOutcomeLabel(item.outcome)}
                  </span>
                </div>
                <div className="text-sm text-text-secondary">
                  {item.date} at {item.time}
                </div>
              </div>

              <p className="text-text-secondary mb-2">{item.notes}</p>

              <div className="flex items-center space-x-4 text-sm text-text-secondary">
                <span>Agent: {item.agent}</span>
              </div>
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className="text-center py-8">
            <Icon name="MessageCircle" size={48} className="mx-auto text-secondary-300 mb-4" />
            <p className="text-text-secondary">No contact history yet</p>
            <p className="text-sm text-text-secondary">Start by reaching out to this lead</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactHistory;