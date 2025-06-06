import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const RelatedProperties = ({ properties }) => {
  const navigate = useNavigate();

  const handleViewProperty = (propertyId) => {
    // In a real app, this would navigate to property details
    console.log('Viewing property:', propertyId);
  };

  return (
    <div className="bg-surface rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Related Properties</h3>
        <span className="text-sm text-text-secondary">{properties.length} properties</span>
      </div>

      {properties.length > 0 ? (
        <div className="space-y-4">
          {properties.map((property) => (
            <div key={property.id} className="border border-border rounded-lg p-4 hover:shadow-soft nav-transition">
              <div className="flex space-x-3">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-secondary-100 flex-shrink-0">
                  <Image 
                    src={property.image} 
                    alt={property.type}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-text-primary truncate">{property.type}</h4>
                    <span className="text-sm font-semibold text-primary ml-2">{property.price}</span>
                  </div>
                  
                  <p className="text-sm text-text-secondary mb-2 truncate">{property.location}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary bg-secondary-50 px-2 py-1 rounded">
                      {property.source}
                    </span>
                    <button
                      onClick={() => handleViewProperty(property.id)}
                      className="text-xs text-primary hover:text-primary-700 font-medium"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          <button
            onClick={() => navigate('/leads-database')}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 border border-border rounded-lg text-sm font-medium text-text-secondary hover:bg-secondary-50 nav-transition"
          >
            <Icon name="Search" size={16} />
            <span>View All Properties</span>
          </button>
        </div>
      ) : (
        <div className="text-center py-8">
          <Icon name="Home" size={48} className="mx-auto text-secondary-300 mb-4" />
          <p className="text-text-secondary mb-2">No related properties found</p>
          <p className="text-sm text-text-secondary">This owner has only one property listing</p>
        </div>
      )}

      {/* Property Statistics */}
      <div className="border-t border-border pt-4 mt-6">
        <h4 className="font-medium text-text-primary mb-3">Owner Statistics</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-secondary-50 rounded-lg">
            <div className="font-semibold text-text-primary">{properties.length + 1}</div>
            <div className="text-text-secondary">Total Properties</div>
          </div>
          <div className="text-center p-3 bg-secondary-50 rounded-lg">
            <div className="font-semibold text-text-primary">2</div>
            <div className="text-text-secondary">Active Sources</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-t border-border pt-4 mt-4">
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm text-text-secondary hover:bg-secondary-50 rounded-lg nav-transition">
            <Icon name="Plus" size={16} />
            <span>Add New Property</span>
          </button>
          <button className="w-full flex items-center space-x-2 px-3 py-2 text-left text-sm text-text-secondary hover:bg-secondary-50 rounded-lg nav-transition">
            <Icon name="Download" size={16} />
            <span>Export Property List</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RelatedProperties;