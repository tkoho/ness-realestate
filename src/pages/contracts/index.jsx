import React, { useState } from 'react';
import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const Contracts = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [sortBy, setSortBy] = useState('date_signed');

  // Mock contract data
  const contracts = [
    {
      id: 'contract_001',
      property_id: 'prop_001',
      owner_name: 'สมชาย วงศ์ใหญ่',
      owner_name_en: 'Somchai Wongyai',
      property_type: 'Villa',
      location: 'Hua Hin Center',
      property_value: 8500000,
      commission_rate: 3,
      commission_amount: 255000,
      date_signed: '2025-06-01',
      date_listed: '2025-06-02',
      status: 'listed',
      listing_price: 8800000,
      days_on_market: 6,
      views: 156,
      inquiries: 23,
      viewings: 8,
      offers: 2,
      property_image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
      notes: 'Owner motivated, flexible on timing'
    },
    {
      id: 'contract_002',
      property_id: 'prop_002',
      owner_name: 'นิรันดร์ ธนกิจ',
      owner_name_en: 'Niran Thanakit',
      property_type: 'Condo',
      location: 'Cha-Am Beach',
      property_value: 6200000,
      commission_rate: 3,
      commission_amount: 186000,
      date_signed: '2025-05-28',
      date_listed: '2025-05-29',
      status: 'under_offer',
      listing_price: 6400000,
      days_on_market: 10,
      views: 234,
      inquiries: 45,
      viewings: 18,
      offers: 4,
      offer_amount: 6300000,
      property_image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
      notes: 'Multiple offers received, negotiating'
    },
    {
      id: 'contract_003',
      property_id: 'prop_003',
      owner_name: 'อภิญญา ศรีสวัสดิ์',
      owner_name_en: 'Apinya Srisawat',
      property_type: 'Townhouse',
      location: 'Pranburi',
      property_value: 4500000,
      commission_rate: 3,
      commission_amount: 135000,
      date_signed: '2025-05-15',
      date_listed: '2025-05-16',
      status: 'sold',
      listing_price: 4700000,
      sale_price: 4600000,
      days_on_market: 22,
      date_sold: '2025-06-06',
      commission_earned: 138000,
      commission_paid: true,
      property_image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
      notes: 'Sold above asking, quick sale'
    },
    {
      id: 'contract_004',
      property_id: 'prop_004',
      owner_name: 'ธีรศักดิ์ พูลสวัสดิ์',
      owner_name_en: 'Teerasak Poolsawat',
      property_type: 'House',
      location: 'Hua Hin Hills',
      property_value: 7800000,
      commission_rate: 3,
      commission_amount: 234000,
      date_signed: '2025-05-20',
      date_listed: '2025-05-21',
      status: 'listed',
      listing_price: 8200000,
      days_on_market: 18,
      views: 189,
      inquiries: 31,
      viewings: 12,
      offers: 1,
      property_image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
      notes: 'Premium location, seeking qualified buyers'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'listed':
        return 'bg-primary-50 text-primary border-primary-200';
      case 'under_offer':
        return 'bg-warning-50 text-warning border-warning-200';
      case 'sold':
        return 'bg-success-50 text-success border-success-200';
      case 'expired':
        return 'bg-error-50 text-error border-error-200';
      default:
        return 'bg-secondary-50 text-secondary border-secondary-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'listed':
        return 'Home';
      case 'under_offer':
        return 'FileText';
      case 'sold':
        return 'CheckCircle';
      case 'expired':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const formatCurrency = (amount) => {
    return `฿${(amount / 1000000).toFixed(1)}M`;
  };

  const formatCommission = (amount) => {
    return `฿${(amount / 1000).toFixed(0)}k`;
  };

  const calculateTotalCommissions = (status) => {
    return contracts
      .filter(contract => status === 'all' || contract.status === status)
      .reduce((total, contract) => {
        return total + (contract.commission_earned || contract.commission_amount);
      }, 0);
  };

  const tabs = [
    { id: 'active', label: 'Active Listings', count: contracts.filter(c => ['listed', 'under_offer'].includes(c.status)).length },
    { id: 'sold', label: 'Sold Properties', count: contracts.filter(c => c.status === 'sold').length },
    { id: 'all', label: 'All Contracts', count: contracts.length }
  ];

  const filteredContracts = contracts.filter(contract => {
    if (activeTab === 'active') return ['listed', 'under_offer'].includes(contract.status);
    if (activeTab === 'sold') return contract.status === 'sold';
    return true;
  });

  const sortedContracts = [...filteredContracts].sort((a, b) => {
    switch (sortBy) {
      case 'date_signed':
        return new Date(b.date_signed) - new Date(a.date_signed);
      case 'value':
        return b.property_value - a.property_value;
      case 'commission':
        return (b.commission_earned || b.commission_amount) - (a.commission_earned || a.commission_amount);
      case 'days_on_market':
        return b.days_on_market - a.days_on_market;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-text-primary mb-2 flex items-center space-x-3">
                <Icon name="FileText" size={32} className="text-success" />
                <span>Contracts & Commissions</span>
              </h1>
              <p className="text-text-secondary">
                Track your listing contracts and commission earnings
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-primary-50 rounded-lg border border-primary-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <Icon name="FileText" size={24} className="text-primary" />
                <span className="text-xs font-medium text-primary bg-primary-100 px-2 py-1 rounded-full">
                  Total
                </span>
              </div>
              <div className="text-2xl font-bold text-primary">{contracts.length}</div>
              <div className="text-sm text-primary-600">Signed Contracts</div>
            </div>

            <div className="bg-warning-50 rounded-lg border border-warning-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <Icon name="Home" size={24} className="text-warning" />
                <span className="text-xs font-medium text-warning bg-warning-100 px-2 py-1 rounded-full">
                  Active
                </span>
              </div>
              <div className="text-2xl font-bold text-warning">
                {contracts.filter(c => ['listed', 'under_offer'].includes(c.status)).length}
              </div>
              <div className="text-sm text-warning-600">Active Listings</div>
            </div>

            <div className="bg-success-50 rounded-lg border border-success-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <Icon name="CheckCircle" size={24} className="text-success" />
                <span className="text-xs font-medium text-success bg-success-100 px-2 py-1 rounded-full">
                  Sold
                </span>
              </div>
              <div className="text-2xl font-bold text-success">
                {contracts.filter(c => c.status === 'sold').length}
              </div>
              <div className="text-sm text-success-600">Properties Sold</div>
            </div>

            <div className="bg-accent-50 rounded-lg border border-accent-200 p-6">
              <div className="flex items-center justify-between mb-2">
                <Icon name="DollarSign" size={24} className="text-accent" />
                <span className="text-xs font-medium text-accent bg-accent-100 px-2 py-1 rounded-full">
                  Earned
                </span>
              </div>
              <div className="text-2xl font-bold text-accent">
                {formatCommission(calculateTotalCommissions('sold'))}
              </div>
              <div className="text-sm text-accent-600">Commission Earned</div>
            </div>
          </div>

          {/* Tabs and Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div className="flex items-center space-x-1 bg-secondary-50 rounded-lg p-1 mb-4 sm:mb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium nav-transition
                    ${activeTab === tab.id
                      ? 'bg-surface text-primary shadow-soft'
                      : 'text-text-secondary hover:text-text-primary'
                    }
                  `}
                >
                  <span>{tab.label}</span>
                  <span className="px-2 py-1 bg-current text-white rounded-full text-xs opacity-20">
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="date_signed">Sort by Date Signed</option>
              <option value="value">Sort by Property Value</option>
              <option value="commission">Sort by Commission</option>
              <option value="days_on_market">Sort by Days on Market</option>
            </select>
          </div>

          {/* Contracts List */}
          <div className="space-y-4">
            {sortedContracts.map((contract) => (
              <div
                key={contract.id}
                className="bg-surface border border-border rounded-lg p-6 hover:shadow-elevated nav-transition"
              >
                <div className="flex items-start space-x-6">
                  {/* Property Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-secondary-100 flex-shrink-0">
                    <Image 
                      src={contract.property_image} 
                      alt={contract.property_type}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Contract Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-text-primary mb-1">
                          {contract.owner_name_en}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-text-secondary">
                          <span className="flex items-center space-x-1">
                            <Icon name="Home" size={14} />
                            <span>{contract.property_type} • {contract.location}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Icon name="Calendar" size={14} />
                            <span>Signed: {new Date(contract.date_signed).toLocaleDateString('en-GB')}</span>
                          </span>
                        </div>
                      </div>
                      
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(contract.status)}`}>
                        <Icon name={getStatusIcon(contract.status)} size={12} className="inline mr-1" />
                        {contract.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    {/* Property Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <span className="text-sm text-text-secondary">Property Value:</span>
                        <div className="font-semibold text-text-primary">{formatCurrency(contract.property_value)}</div>
                      </div>
                      <div>
                        <span className="text-sm text-text-secondary">Commission:</span>
                        <div className="font-semibold text-success">
                          {formatCommission(contract.commission_earned || contract.commission_amount)}
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-text-secondary">Days Listed:</span>
                        <div className="font-semibold text-text-primary">{contract.days_on_market}</div>
                      </div>
                      <div>
                        <span className="text-sm text-text-secondary">Views/Inquiries:</span>
                        <div className="font-semibold text-text-primary">{contract.views}/{contract.inquiries}</div>
                      </div>
                    </div>

                    {/* Progress for Active Listings */}
                    {['listed', 'under_offer'].includes(contract.status) && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-text-primary">Sales Progress</span>
                          <span className="text-sm text-text-secondary">
                            {contract.offers > 0 ? `${contract.offers} offer(s)` : 'No offers yet'}
                          </span>
                        </div>
                        <div className="w-full bg-secondary-100 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              contract.status === 'under_offer' ? 'bg-warning' : 'bg-primary'
                            }`}
                            style={{ 
                              width: `${Math.min(
                                (contract.inquiries / 50) * 100 + 
                                (contract.viewings / 20) * 100 + 
                                (contract.offers / 5) * 100, 
                                100
                              )}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Sale Info for Sold Properties */}
                    {contract.status === 'sold' && (
                      <div className="mb-4 p-3 bg-success-50 rounded-lg border border-success-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-medium text-success-700">Sold for {formatCurrency(contract.sale_price)}</span>
                            <div className="text-xs text-success-600">
                              On {new Date(contract.date_sold).toLocaleDateString('en-GB')} • 
                              Commission: {formatCommission(contract.commission_earned)}
                              {contract.commission_paid && ' ✓ Paid'}
                            </div>
                          </div>
                          {!contract.commission_paid && (
                            <button className="px-3 py-1 bg-success text-white rounded text-xs font-medium hover:bg-success-600 nav-transition">
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {contract.notes && (
                      <div className="text-sm text-text-secondary italic">
                        "{contract.notes}"
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col space-y-2">
                    <button className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 nav-transition">
                      View Details
                    </button>
                    {contract.status === 'listed' && (
                      <button className="px-3 py-2 bg-secondary-100 text-text-primary rounded-lg text-sm font-medium hover:bg-secondary-200 nav-transition">
                        Share Listing
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sortedContracts.length === 0 && (
            <div className="text-center py-12">
              <Icon name="FileText" size={48} className="text-text-tertiary mx-auto mb-4" />
              <h3 className="text-lg font-medium text-text-secondary mb-2">No contracts found</h3>
              <p className="text-text-tertiary">
                {activeTab === 'active' ? 'No active listings at the moment' : 
                 activeTab === 'sold' ? 'No sold properties yet' : 
                 'No contracts signed yet'}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Contracts;