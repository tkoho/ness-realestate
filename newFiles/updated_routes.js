import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// Page imports - Updated for automation focus
import Login from "pages/login";
import AutomationControlCenter from "pages/automation-control-center"; // New main dashboard
import MessageAutomation from "pages/message-automation"; // Updated scraping management
import CallQueue from "pages/call-queue"; // New priority page
import Contracts from "pages/contracts"; // New contracts page
import LeadDetails from "pages/lead-details"; // Keep existing but updated
import Settings from "pages/settings";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          
          {/* Main automation-focused routes */}
          <Route path="/automation-control" element={<AutomationControlCenter />} />
          <Route path="/message-automation" element={<MessageAutomation />} />
          <Route path="/call-queue" element={<CallQueue />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/lead-details" element={<LeadDetails />} />
          <Route path="/lead-details/:id" element={<LeadDetails />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Default routes */}
          <Route path="/" element={<AutomationControlCenter />} />
          <Route path="/dashboard" element={<AutomationControlCenter />} />
          
          {/* Legacy redirects for existing routes */}
          <Route path="/scraping-management" element={<MessageAutomation />} />
          <Route path="/leads-database" element={<CallQueue />} />
          
          {/* 404 fallback */}
          <Route path="*" element={<Login />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;