import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const CallQueue = () => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState('score');

  // High-priority leads ready for closing calls
  const priorityLeads = [
    {
      id: 'lead_001',
      score: 95,
      ownerName: 'สมชาย วงศ์ใหญ่',
      ownerNameEn: 'Somchai Wongyai',
      phone: '+66 89 123 4567',
      propertyType: 'Villa',
      location: 'Hua Hin Center',
      propertyValue: 8500000,
      commission: 850000,
      lastResponse: 'Asked about commission rates and contract terms',
      responseTime: '2 hours ago',
      bestCallTime: '2-4 PM',
      automationStage: 'day_7_email_responded',
      urgency: 'urgent',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      propertyImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400'
    },
    {
      id: 'lead_002', 
      score: 92,
      ownerName: 'นิรันดร์ ธนกิจ',
      ownerNameEn: 'Niran Thanakit',
      phone: '+66 92 345 6789',
      propertyType: 'Condo',
      location: 'Cha-Am Beach',
      propertyValue: 6200000,
      commission: 620000,
      lastResponse: 'Interested in listing, wants to know timeline',
      responseTime: '4 hours ago',
      bestCallTime: '10 AM - 12 PM',
      automationStage: 'contract_inquiry',
      urgency: 'high',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      propertyImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'
    },
    {
      id: 'lead_003',
      score: 88,
      ownerName: 'อภิญญา ศรีสวัสดิ์',
      ownerNameEn: 'Apinya Srisawat',
      phone: '+66 81 567 8901',
      propertyType: 'Townhouse',
      location: 'Pranburi',
      propertyValue: 4500000,
      commission: 450000,
      lastResponse: 'Wants to meet this week',
      responseTime: '1 day ago',
      bestCallTime: 'Evenings 6-8 PM',
      automationStage: 'meeting_request',
      urgency: 'high',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      propertyImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
    },
    {
      id: 'lead_004',
      score: 85,
      ownerName: 'ธีรศักดิ์ พูลสวัสดิ์',
      ownerNameEn: 'Teerasak Poolsawat',
      phone: '+66 95 432 1098',
      propertyType: 'House',
      location: 'Hua Hin Hills',
      propertyValue: 7800000,
      commission: 780000,
      lastResponse: 'Price comparison with competitors',
      responseTime: '6 hours ago',
      bestCallTime: 'Mornings 9-11 AM',
      automationStage: 'price_negotiation',
      urgency: 'medium',
      avatar: 'https://randomuser.me/api/portraits/men/51.jpg',
      propertyImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400'
    }
  ];

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return 'bg-error text-white';
      case 'high':
        return 'bg-warning text-white';
      case 'medium':
        return 'bg-accent text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  const getUrgencyIcon = (urgency) => {
    switch (urgency) {
      case 'urgent':
        return '🔥';
      case 'high':
        return '📞';
      case 'medium':
        return '⏰';
      default:
        return '📋';
    }
  };

  const formatCurrency = (amount) => {
    return `฿${(amount / 1000000).toFixed(1)}M`;
  };

  const formatCommission = (amount) => {
    return `฿${(amount / 1000).toFixed(0)}k`;
  };

  const handleCallLead = (lead) => {
    // In real app, this would integrate with phone system
    window.open(`tel:${lead.phone}`);
  };

  const handleViewDetails = (lead) => {
    navigate(`/lead-details/${lead.id}`);
  };

  const sortedLeads = [...priorityLeads].sort((a, b) => {
    if (sortBy === 'score') return b.score - a.score;
    if (sortBy === 'value') return b.propertyValue - a.propertyValue;
    if (sortBy === 'urgency') {
      const urgencyOrder = { urgent: 3, high: 2, medium: 1 };
      return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
    }
    return 0;
  });

  return (
    <div className="bg-surface rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-error-50 rounded-lg flex items-center justify-center relative">
              <Icon name="Phone" size={18} color="var(--color-error)" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full animate-ping"></div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Call Queue - Ready to Close</h2>
              <p className="text-sm text-text-secondary">Leads that responded positively to automation</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="score">Sort by Score</option>
              <option value="value">Sort by Value</option>
              <option value="urgency">Sort by Urgency</option>
            </select>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-error">{priorityLeads.length}</div>
              <div className="text-xs text-text-secondary">Leads Ready</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {sortedLeads.map((lead) => (
            <div
              key={lead.id}
              className="border border-border rounded-lg p-4 hover:shadow-elevated nav-transition bg-gradient-to-r from-white to-error-50/20"
            >
              <div className="flex items-start space-x-4">
                {/* Priority Badge */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${getUrgencyColor(lead.urgency)}`}>
                    <span className="text-lg">{lead.score}</span>
                  </div>
                  {lead.urgency === 'urgent' && (
                    <div className="w-12 text-center mt-1">
                      <span className="text-xs font-medium text-error animate-pulse">URGENT</span>
                    </div>
                  )}
                </div>

                {/* Lead Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary mb-1">
                        {lead.ownerNameEn}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-text-secondary">
                        <span className="flex items-center space-x-1">
                          <Icon name="Home" size={14} />
                          <span>{lead.propertyType} • {lead.location}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Icon name="DollarSign" size={14} />
                          <span>{formatCurrency(lead.propertyValue)}</span>
                        </span>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-success">{formatCommission(lead.commission)}</div>
                      <div className="text-xs text-text-secondary">Commission</div>
                    </div>
                  </div>

                  {/* Last Response */}
                  <div className="mb-3 p-3 bg-primary-50 rounded-lg border border-primary-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm text-primary-700 font-medium mb-1">Latest Response:</p>
                        <p className="text-sm text-text-primary">"{lead.lastResponse}"</p>
                      </div>
                      <span className="text-xs text-text-secondary ml-3">{lead.responseTime}</span>
                    </div>
                  </div>

                  {/* Call Info */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="flex items-center space-x-1 text-text-secondary">
                        <Icon name="Clock" size={14} />
                        <span>Best time: {lead.bestCallTime}</span>
                      </span>
                      <span className="flex items-center space-x-1 text-text-secondary">
                        <Icon name="MessageSquare" size={14} />
                        <span>{lead.automationStage.replace('_', ' ')}</span>
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(lead)}
                        className="px-3 py-2 bg-secondary-100 text-text-primary rounded-lg text-sm font-medium hover:bg-secondary-200 nav-transition"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleCallLead(lead)}
                        className="px-4 py-2 bg-error text-white rounded-lg text-sm font-medium hover:bg-error-600 nav-transition flex items-center space-x-2"
                      >
                        <Icon name="Phone" size={16} />
                        <span>Call Now</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Property Image */}
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-secondary-100 flex-shrink-0">
                  <Image 
                    src={lead.propertyImage} 
                    alt={lead.propertyType}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call Script Helper */}
        <div className="mt-6 p-4 bg-accent-50 rounded-lg border border-accent-100">
          <h4 className="font-medium text-accent-700 mb-2 flex items-center space-x-2">
            <Icon name="FileText" size={16} />
            <span>Quick Call Script</span>
          </h4>
          <p className="text-sm text-accent-600">
            "Hello [Name], this is [Your Name] from [Company]. You responded to our email about listing your [Property Type] in [Location]. 
            I understand you're interested in our commission structure - I have 5 minutes to explain how we can help you sell faster..."
          </p>
        </div>
      </div>
    </div>
  );
};

export default CallQueue; 