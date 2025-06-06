import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import ContactHistory from './components/ContactHistory';
import ActionPanel from './components/ActionPanel';
import RelatedProperties from './components/RelatedProperties';

const LeadDetails = () => {
  const navigate = useNavigate();
  const [isTranslated, setIsTranslated] = useState(false);
  const [contactStatus, setContactStatus] = useState('new');

  // Mock lead data
  const leadData = {
    id: 'LD001',
    ownerName: 'สมชาย วงศ์ใหญ่',
    ownerNameEn: 'Somchai Wongyai',
    phone: '+66 89 123 4567',
    messengerLink: 'https://m.me/somchai.wongyai',
    email: 'somchai.wongyai@gmail.com',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    status: 'new',
    source: 'Facebook Group',
    sourceUrl: 'https://facebook.com/groups/huahin-property/posts/123456',
    dateScraped: '2024-01-15',
    property: {
      type: 'Condo',
      location: 'Hua Hin Center, Prachuap Khiri Khan',
      coordinates: { lat: 12.5706, lng: 99.9576 },
      listingType: 'rent',
      price: '฿25,000/month',
      descriptionTh: `คอนโดใหม่ใจกลางหัวหิน วิวทะเล 2 ห้องนอน 2 ห้องน้ำ ตกแต่งครบ เฟอร์นิเจอร์ครบ แอร์ 3 เครื่อง ใกล้ชายหาด เดินทางสะดวก มีสระว่ายน้ำ ฟิตเนส รปภ. 24 ชม. เหมาะสำหรับครอบครัวหรือคู่รัก ราคาต่อรองได้`,
      descriptionEn: `New condo in the heart of Hua Hin with sea view. 2 bedrooms, 2 bathrooms, fully furnished with complete furniture, 3 air conditioners. Close to beach, convenient transportation. Swimming pool, fitness center, 24-hour security. Perfect for families or couples. Price negotiable.`,
      images: [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
      ]
    },
    tags: ['High Priority', 'Sea View', 'Furnished'],
    lastContact: '2024-01-20',
    nextFollowUp: '2024-01-25'
  };

  const contactHistory = [
    {
      id: 1,
      type: 'call',
      date: '2024-01-20',
      time: '14:30',
      duration: '5 min',
      outcome: 'interested',
      notes: 'Owner showed interest in listing on FazWaz. Requested more information about commission structure.',
      agent: 'John Smith'
    },
    {
      id: 2,
      type: 'message',
      date: '2024-01-18',
      time: '10:15',
      outcome: 'no_response',
      notes: 'Sent initial introduction message via Facebook Messenger. No response yet.',
      agent: 'Sarah Johnson'
    },
    {
      id: 3,
      type: 'email',
      date: '2024-01-16',
      time: '09:00',
      outcome: 'bounced',
      notes: 'Welcome email bounced back. Email address may be invalid.',
      agent: 'System'
    }
  ];

  const relatedProperties = [
    {
      id: 'RP001',
      type: 'Villa',
      location: 'Hua Hin Hills',
      price: '฿45,000/month',
      source: 'Google Maps',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400'
    },
    {
      id: 'RP002',
      type: 'Townhouse',
      location: 'Cha-Am Beach',
      price: '฿8,500,000',
      source: 'Thai Property Portal',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
    }
  ];

  const handleStatusChange = (newStatus) => {
    setContactStatus(newStatus);
  };

  const handleContactAction = (action) => {
    console.log(`Performing ${action} action`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <button
                onClick={() => navigate('/leads-database')}
                className="p-2 rounded-lg hover:bg-secondary-50 nav-transition"
              >
                <Icon name="ArrowLeft" size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-text-primary">
                  {isTranslated ? leadData.ownerNameEn : leadData.ownerName}
                </h1>
                <p className="text-text-secondary">Lead ID: {leadData.id}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                leadData.status === 'new' ? 'bg-primary-50 text-primary' :
                leadData.status === 'contacted' ? 'bg-warning-50 text-warning-600' :
                leadData.status === 'interested'? 'bg-success-50 text-success-600' : 'bg-secondary-100 text-secondary-600'
              }`}>
                {leadData.status.charAt(0).toUpperCase() + leadData.status.slice(1)}
              </span>
              
              {leadData.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-accent-50 text-accent-700 rounded text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Lead Information Card */}
              <div className="bg-surface rounded-lg border border-border p-6">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary-100">
                    <Image 
                      src={leadData.avatar} 
                      alt={leadData.ownerName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      Owner Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-text-secondary">Name</label>
                        <p className="text-text-primary">
                          {isTranslated ? leadData.ownerNameEn : leadData.ownerName}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-text-secondary">Phone</label>
                        <p className="text-text-primary">{leadData.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-text-secondary">Email</label>
                        <p className="text-text-primary">{leadData.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-text-secondary">Source</label>
                        <a 
                          href={leadData.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-700 flex items-center space-x-1"
                        >
                          <span>{leadData.source}</span>
                          <Icon name="ExternalLink" size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Information */}
                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-primary">Property Details</h3>
                    <button
                      onClick={() => setIsTranslated(!isTranslated)}
                      className="flex items-center space-x-2 px-3 py-1 bg-secondary-50 rounded-lg text-sm font-medium text-text-secondary hover:bg-secondary-100 nav-transition"
                    >
                      <Icon name="Languages" size={16} />
                      <span>{isTranslated ? 'Show Thai' : 'Translate'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Type</label>
                      <p className="text-text-primary">{leadData.property.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Location</label>
                      <p className="text-text-primary">{leadData.property.location}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-secondary">Price</label>
                      <p className="text-text-primary font-semibold">{leadData.property.price}</p>
                    </div>
                  </div>

                  {/* Property Images */}
                  <div className="mb-6">
                    <label className="text-sm font-medium text-text-secondary mb-3 block">Property Images</label>
                    <div className="grid grid-cols-3 gap-3">
                      {leadData.property.images.map((image, index) => (
                        <div key={index} className="aspect-video rounded-lg overflow-hidden bg-secondary-100">
                          <Image 
                            src={image} 
                            alt={`Property ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Property Description */}
                  <div>
                    <label className="text-sm font-medium text-text-secondary mb-2 block">Description</label>
                    <div className="bg-secondary-50 rounded-lg p-4">
                      <p className="text-text-primary leading-relaxed">
                        {isTranslated ? leadData.property.descriptionEn : leadData.property.descriptionTh}
                      </p>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="mt-6">
                    <label className="text-sm font-medium text-text-secondary mb-3 block">Location Map</label>
                    <div className="h-64 rounded-lg overflow-hidden border border-border">
                      <iframe
                        width="100%"
                        height="100%"
                        loading="lazy"
                        title={leadData.property.location}
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://www.google.com/maps?q=${leadData.property.coordinates.lat},${leadData.property.coordinates.lng}&z=14&output=embed`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact History */}
              <ContactHistory history={contactHistory} />
            </div>

            {/* Right Column - Action Panel */}
            <div className="space-y-6">
              <ActionPanel 
                leadData={leadData}
                contactStatus={contactStatus}
                onStatusChange={handleStatusChange}
                onContactAction={handleContactAction}
              />
              
              <RelatedProperties properties={relatedProperties} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeadDetails;