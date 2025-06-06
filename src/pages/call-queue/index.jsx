import React from 'react';
import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';
import CallQueue from 'pages/dashboard/components/CallQueue';

const CallQueuePage = () => {
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
                <Icon name="Phone" size={32} className="text-error" />
                <span>Priority Call Queue</span>
              </h1>
              <p className="text-text-secondary">
                High-priority leads ready for your closing calls - sorted by conversion probability
              </p>
            </div>
            
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-text-secondary">Queue Status</div>
                <div className="text-lg font-semibold text-error">
                  8 Leads Ready
                </div>
              </div>
              <div className="w-3 h-3 bg-error rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Priority Alert */}
          <div className="mb-6 p-4 bg-error-50 border-l-4 border-l-error rounded-lg">
            <div className="flex items-center space-x-3">
              <Icon name="AlertTriangle" size={20} className="text-error" />
              <div>
                <h3 className="font-semibold text-error">🔥 URGENT: High-Value Leads Waiting</h3>
                <p className="text-sm text-error-600">
                  These leads have responded positively to your automation sequences. Call now for maximum conversion rates.
                </p>
              </div>
            </div>
          </div>

          {/* Call Queue Component */}
          <CallQueue />

          {/* Call Tips */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-success-50 rounded-lg border border-success-200 p-6">
              <h4 className="font-semibold text-success-700 mb-3 flex items-center space-x-2">
                <Icon name="CheckCircle" size={18} />
                <span>Best Practices</span>
              </h4>
              <ul className="space-y-2 text-sm text-success-600">
                <li>• Call within 2 hours of their last response</li>
                <li>• Reference their specific property and location</li>
                <li>• Mention their automation stage (email response, etc.)</li>
                <li>• Have commission structure ready to discuss</li>
                <li>• Schedule follow-up immediately if interested</li>
              </ul>
            </div>

            <div className="bg-primary-50 rounded-lg border border-primary-200 p-6">
              <h4 className="font-semibold text-primary-700 mb-3 flex items-center space-x-2">
                <Icon name="Clock" size={18} />
                <span>Optimal Call Times</span>
              </h4>
              <ul className="space-y-2 text-sm text-primary-600">
                <li>• <strong>Morning:</strong> 9:00 AM - 11:00 AM (Business owners)</li>
                <li>• <strong>Afternoon:</strong> 2:00 PM - 4:00 PM (Retirees)</li>
                <li>• <strong>Evening:</strong> 6:00 PM - 8:00 PM (Working professionals)</li>
                <li>• <strong>Avoid:</strong> Lunch hours (12-1 PM) and late evenings</li>
                <li>• <strong>Weekend:</strong> Saturday mornings work well</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CallQueuePage; 