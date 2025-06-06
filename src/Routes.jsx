import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";

// Page imports - Updated for automation focus
import Login from "pages/login";
import AutomationControlCenter from "pages/dashboard"; // Updated dashboard
import CallQueuePage from "pages/call-queue";
import MessageAutomation from "pages/message-automation";
import Contracts from "pages/contracts";
import LeadDetails from "pages/lead-details"; // Keep existing but updated
import Settings from "pages/settings";
import ScrapingManagement from "pages/scraping-management"; // Legacy page

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
          <Route path="/call-queue" element={<CallQueuePage />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/lead-details" element={<LeadDetails />} />
          <Route path="/lead-details/:id" element={<LeadDetails />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Default routes */}
          <Route path="/" element={<AutomationControlCenter />} />
          <Route path="/dashboard" element={<AutomationControlCenter />} />
          
          {/* Legacy redirects for existing routes */}
          <Route path="/scraping-management" element={<ScrapingManagement />} />
          <Route path="/leads-database" element={<AutomationControlCenter />} />
          
          {/* 404 fallback */}
          <Route path="*" element={<Login />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;