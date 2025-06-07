import React, { useState } from 'react';
import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const Contracts = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [sortBy, setSortBy] = useState('date_signed');
  const [isLoading, setIsLoading] = useState(false);

  // Empty state - no mock data
  const contracts = [];

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

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

  const formatCurrency = (amount) => {
    return `฿${(amount / 1000000).toFixed(1)}M`;
  };

  const renderEmptyState = () => (
    <div className="text-center py-16">
      <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon name="FileText" size={24} className="text-primary-400" />
      </div>
      <h3 className="text-xl font-medium text-text-primary mb-2">No Contracts Yet</h3>
      <p className="text-text-secondary mb-8 max-w-md mx-auto">
        Your signed contracts and commission tracking will appear here once you start closing deals from your call queue.
      </p>
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
          <Icon name="Phone" size={16} />
          <span>First, focus on calling your high-priority leads</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
          <Icon name="MessageCircle" size={16} />
          <span>Then use automation to nurture and qualify more prospects</span>
        </div>
        <div className="flex items-center justify-center space-x-2 text-sm text-text-secondary">
          <Icon name="TrendingUp" size={16} />
          <span>Watch your contract pipeline grow over time</span>
        </div>
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="space-y-4">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-surface rounded-lg border border-border p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-secondary-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-secondary-200 rounded w-1/3"></div>
                <div className="h-4 bg-secondary-200 rounded w-1/2"></div>
                <div className="h-3 bg-secondary-200 rounded w-1/4"></div>
              </div>
              <div className="space-y-2">
                <div className="h-6 bg-secondary-200 rounded w-20"></div>
                <div className="h-4 bg-secondary-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const filteredContracts = contracts.filter(contract => {
    switch (activeTab) {
      case 'active':
        return ['listed', 'under_offer'].includes(contract.status);
      case 'sold':
        return contract.status === 'sold';
      case 'all':
      default:
        return true;
    }
  });

  const sortedContracts = [...filteredContracts].sort((a, b) => {
    switch (sortBy) {
      case 'date_signed':
        return new Date(b.date_signed) - new Date(a.date_signed);
      case 'property_value':
        return b.property_value - a.property_value;
      case 'commission':
        return b.commission_amount - a.commission_amount;
      case 'location':
        return a.location.localeCompare(b.location);
      default:
        return 0;
    }
  });

  // Summary stats for current filter
  const totalContracts = filteredContracts.length;
  const totalValue = filteredContracts.reduce((sum, contract) => sum + contract.property_value, 0);
  const totalCommission = filteredContracts.reduce((sum, contract) => 
    sum + (contract.commission_earned || contract.commission_amount), 0);
  const avgDaysOnMarket = filteredContracts.length > 0 
    ? Math.round(filteredContracts.reduce((sum, contract) => sum + (contract.days_on_market || 0), 0) / filteredContracts.length)
    : 0;

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
                <Icon name="FileText" size={32} className="text-primary" />
                <span>Contract Management</span>
              </h1>
              <p className="text-text-secondary">
                Track signed contracts, commission earnings, and property listings performance
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-text-secondary">Total Contracts</div>
                <div className="text-lg font-semibold text-text-primary">
                  {totalContracts}
                </div>
              </div>
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className={`
                  w-8 h-8 rounded-lg border border-border flex items-center justify-center nav-transition
                  ${isLoading 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-secondary-50 hover:border-secondary-300'
                  }
                `}
              >
                <Icon 
                  name="RefreshCw" 
                  size={16} 
                  className={`text-text-secondary ${isLoading ? 'animate-spin' : ''}`} 
                />
              </button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-primary-50 rounded-lg border border-primary-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                  <Icon name="FileText" size={24} color="white" />
                </div>
                <span className="text-xs font-medium text-primary bg-primary-100 px-2 py-1 rounded-full">
                  Total
                </span>
              </div>
              <div className="text-2xl font-bold text-primary mb-1">{totalContracts}</div>
              <p className="text-sm text-primary-600">Active Contracts</p>
            </div>

            <div className="bg-success-50 rounded-lg border border-success-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center">
                  <Icon name="DollarSign" size={24} color="white" />
                </div>
                <span className="text-xs font-medium text-success bg-success-100 px-2 py-1 rounded-full">
                  Value
                </span>
              </div>
              <div className="text-2xl font-bold text-success mb-1">{formatCurrency(totalValue)}</div>
              <p className="text-sm text-success-600">Portfolio Value</p>
            </div>

            <div className="bg-accent-50 rounded-lg border border-accent-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                  <Icon name="Percent" size={24} color="white" />
                </div>
                <span className="text-xs font-medium text-accent bg-accent-100 px-2 py-1 rounded-full">
                  Commission
                </span>
              </div>
              <div className="text-2xl font-bold text-accent mb-1">{formatCurrency(totalCommission)}</div>
              <p className="text-sm text-accent-600">Total Earnings</p>
            </div>

            <div className="bg-warning-50 rounded-lg border border-warning-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-warning rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={24} color="white" />
                </div>
                <span className="text-xs font-medium text-warning bg-warning-100 px-2 py-1 rounded-full">
                  Average
                </span>
              </div>
              <div className="text-2xl font-bold text-warning mb-1">{avgDaysOnMarket}</div>
              <p className="text-sm text-warning-600">Days on Market</p>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="bg-surface rounded-lg border border-border mb-6">
            <div className="p-6 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                {/* Status Filter Tabs */}
                <div className="flex items-center space-x-1 bg-secondary-50 rounded-lg p-1">
                  {[
                    { id: 'active', label: 'Active', count: contracts.filter(c => ['listed', 'under_offer'].includes(c.status)).length },
                    { id: 'sold', label: 'Sold', count: contracts.filter(c => c.status === 'sold').length },
                    { id: 'all', label: 'All', count: contracts.length }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium nav-transition
                        ${activeTab === tab.id
                          ? 'bg-surface text-primary shadow-soft'
                          : 'text-text-secondary hover:text-text-primary'
                        }
                      `}
                    >
                      <span>{tab.label}</span>
                      <span className="text-xs bg-secondary-200 px-2 py-0.5 rounded-full">
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Sort Options */}
                <div className="flex items-center space-x-3">
                  <label className="text-sm text-text-secondary">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="date_signed">Date Signed</option>
                    <option value="property_value">Property Value</option>
                    <option value="commission">Commission</option>
                    <option value="location">Location</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contract List */}
            <div className="p-6">
              {isLoading ? renderLoadingState() : 
               sortedContracts.length === 0 ? renderEmptyState() : (
                <div className="space-y-4">
                  {sortedContracts.map((contract) => (
                    <div
                      key={contract.id}
                      className="border border-border rounded-lg p-6 hover:shadow-elevated nav-transition bg-gradient-to-r from-white to-primary-50/20"
                    >
                      <div className="flex items-start space-x-4">
                        {/* Property Image */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary-100 flex-shrink-0">
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
                                  <span>Signed: {new Date(contract.date_signed).toLocaleDateString()}</span>
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(contract.status)}`}>
                                {contract.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                          </div>

                          {/* Financial Info */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <span className="text-sm text-text-secondary">Property Value:</span>
                              <div className="font-bold text-text-primary">
                                {formatCurrency(contract.property_value)}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-text-secondary">Commission Rate:</span>
                              <div className="font-bold text-accent">
                                {contract.commission_rate}%
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-text-secondary">Commission Amount:</span>
                              <div className="font-bold text-success">
                                {formatCurrency(contract.commission_earned || contract.commission_amount)}
                              </div>
                            </div>
                            <div>
                              <span className="text-sm text-text-secondary">Days on Market:</span>
                              <div className="font-bold text-warning">
                                {contract.days_on_market || 0} days
                              </div>
                            </div>
                          </div>

                          {/* Performance Metrics */}
                          {contract.status !== 'sold' && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-3 bg-secondary-50 rounded-lg">
                              <div className="text-center">
                                <div className="text-lg font-bold text-primary">{contract.views || 0}</div>
                                <div className="text-xs text-text-secondary">Views</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-accent">{contract.inquiries || 0}</div>
                                <div className="text-xs text-text-secondary">Inquiries</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-warning">{contract.viewings || 0}</div>
                                <div className="text-xs text-text-secondary">Viewings</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-bold text-success">{contract.offers || 0}</div>
                                <div className="text-xs text-text-secondary">Offers</div>
                              </div>
                            </div>
                          )}

                          {/* Notes */}
                          {contract.notes && (
                            <div className="mb-4 p-3 bg-primary-50 rounded-lg border border-primary-100">
                              <p className="text-sm text-primary-700">
                                <strong>Notes:</strong> {contract.notes}
                              </p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <button className="px-3 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-600 nav-transition">
                                View Details
                              </button>
                              <button className="px-3 py-2 bg-secondary-100 text-text-primary rounded-lg text-sm font-medium hover:bg-secondary-200 nav-transition">
                                Edit Contract
                              </button>
                              {contract.status === 'listed' && (
                                <button className="px-3 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent-600 nav-transition">
                                  Mark as Sold
                                </button>
                              )}
                            </div>

                            <div className="text-xs text-text-secondary">
                              ID: {contract.id}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contracts;