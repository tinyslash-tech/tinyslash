import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { SupportProvider } from './context/SupportContext';
import { TeamProvider } from './context/TeamContext';
import { ModalProvider } from './context/ModalContext';
import { QueryProvider } from './providers/QueryProvider';
import UpgradeModal from './components/UpgradeModal';
import SupportWidget from './components/support/SupportWidget';
// Removed unused import
import AuthRedirect from './components/AuthRedirect';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Analytics from './pages/Analytics';
import Pricing from './pages/Pricing';
import Profile from './pages/Profile';
import AccountSettings from './pages/AccountSettings';
import RedirectPage from './pages/RedirectPage';
import AuthCallback from './pages/AuthCallback';
import AdvancedQRGenerator from './components/AdvancedQRGenerator';
import CustomDomainManager from './components/CustomDomainManager';
import DashboardLayout from './components/layouts/DashboardLayout';
import UnifiedDashboard from './components/UnifiedDashboard';
import FileViewer from './pages/FileViewer';
import QRAnalyticsPage from './pages/QRAnalyticsPage';

import FileAnalyticsPage from './pages/FileAnalyticsPage';
import ContactUs from './pages/ContactUs';
import TeamInvite from './pages/TeamInvite';
import About from './pages/About';
import ShippingPolicy from './pages/ShippingPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import CancellationRefund from './pages/CancellationRefund';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Careers from './pages/Careers';
import JobDetail from './pages/JobDetail';
import Apply from './pages/Apply';

import Leads from './pages/dashboard/Leads';
import PagesDashboard from './pages/dashboard/PagesDashboard';
import PageBuilder from './pages/dashboard/PageBuilder'; // Import PageBuilder
import UnlockPage from './pages/UnlockPage';
import VerifiedPage from './pages/VerifiedPage';
import PublicPage from './pages/public/PublicPage';

// New Sitelinks Pages
import ShortLinks from './pages/ShortLinks';
import QrCodes from './pages/QrCodes';
import FileToLink from './pages/FileToLink';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import SocialMedia from './pages/solutions/SocialMedia';
import DigitalMarketing from './pages/solutions/DigitalMarketing';
import CustomerSupport from './pages/solutions/CustomerSupport';

import './App.css';

console.log('MODULE LOADED: App.tsx');

const AppContent: React.FC = () => {
  console.log('RENDERING: AppContent');
  return (
    <>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={
              <AuthRedirect>
                <LandingPage />
              </AuthRedirect>
            } />
            <Route path="/app" element={
              <AuthRedirect requireAuth={true}>
                <div className="min-h-screen bg-gray-50">
                  <div className="sticky top-0 z-50">
                    <Header />
                  </div>
                  <main>
                    <Home />
                  </main>
                </div>
              </AuthRedirect>
            } />
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
              <AuthRedirect requireAuth={true}>
                <DashboardLayout>
                  <UnifiedDashboard />
                </DashboardLayout>
              </AuthRedirect>
            } />

            <Route path="/dashboard/links" element={
              <AuthRedirect requireAuth={true}>
                <DashboardLayout>
                  <UnifiedDashboard />
                </DashboardLayout>
              </AuthRedirect>
            } />

            <Route path="/dashboard/qr-codes" element={
              <AuthRedirect requireAuth={true}>
                <DashboardLayout>
                  <UnifiedDashboard />
                </DashboardLayout>
              </AuthRedirect>
            } />

            <Route path="/dashboard/pages" element={
              <AuthRedirect requireAuth={true}>
                <DashboardLayout>
                  <PagesDashboard />
                </DashboardLayout>
              </AuthRedirect>
            } />

            <Route path="/dashboard/pages/builder/:id" element={
              <AuthRedirect requireAuth={true}>
                <PageBuilder />
                {/* Note: PageBuilder has its own layout or Sidebar management if needed, or wrap in DashboardLayout if it fits */}
                {/* For full screen editor experience, usually better without dashboard layout, or check requirement. I'll assume separate layout or just component for now. 
                      Actually, keeping consistent nav is safely done via DashboardLayout but Builder often needs validation. 
                      Let's use DashboardLayout for consistency for now, or just the component if it has its own sidebar. 
                      Looking at PageBuilder code, it has its own "Left Sidebar: Controls". So maybe NO DashboardLayout.
                   */}
              </AuthRedirect>
            } />

            <Route path="/dashboard/file-links" element={
              <AuthRedirect requireAuth={true}>
                <DashboardLayout>
                  <UnifiedDashboard />
                </DashboardLayout>
              </AuthRedirect>
            } />

            <Route path="/dashboard/analytics" element={
              <AuthRedirect requireAuth={true}>
                <DashboardLayout>
                  <UnifiedDashboard />
                </DashboardLayout>
              </AuthRedirect>
            } />

            <Route path="/dashboard/domains" element={
              <AuthRedirect requireAuth={true}>
                <DashboardLayout>
                  <UnifiedDashboard />
                </DashboardLayout>
              </AuthRedirect>
            } />

            <Route path="/dashboard/team/members" element={
              <AuthRedirect requireAuth={true}>
                <DashboardLayout>
                  <UnifiedDashboard />
                </DashboardLayout>
              </AuthRedirect>
            } />

            <Route path="/dashboard/team/settings" element={
              <AuthRedirect requireAuth={true}>
                <DashboardLayout>
                  <UnifiedDashboard />
                </DashboardLayout>
              </AuthRedirect>
            } />

            <Route path="/dashboard/leads" element={
              <AuthRedirect requireAuth={true}>
                <DashboardLayout>
                  <UnifiedDashboard />
                </DashboardLayout>
              </AuthRedirect>
            } />

            <Route path="/dashboard/trust-badge" element={
              <AuthRedirect requireAuth={true}>
                <DashboardLayout>
                  <UnifiedDashboard />
                </DashboardLayout>
              </AuthRedirect>
            } />

            {/* Individual Analytics Routes */}
            <Route path="/dashboard/links/:shortCode/analytics" element={
              <AuthRedirect requireAuth={true}>
                <Analytics />
              </AuthRedirect>
            } />

            <Route path="/dashboard/links/analytics/:shortCode" element={
              <AuthRedirect requireAuth={true}>
                <Analytics />
              </AuthRedirect>
            } />

            <Route path="/dashboard/analytics/url/:shortCode" element={
              <AuthRedirect requireAuth={true}>
                <Analytics />
              </AuthRedirect>
            } />

            <Route path="/dashboard/qr-codes/analytics/:qrCode" element={
              <AuthRedirect requireAuth={true}>
                <QRAnalyticsPage />
              </AuthRedirect>
            } />



            <Route path="/dashboard/file-links/analytics/:fileCode" element={
              <AuthRedirect requireAuth={true}>
                <FileAnalyticsPage />
              </AuthRedirect>
            } />

            {/* Legacy Individual Link Analytics */}
            <Route path="/analytics/:shortCode" element={
              <AuthRedirect requireAuth={true}>
                <Analytics />
              </AuthRedirect>
            } />

            {/* Legacy QR Generator Route */}
            <Route path="/qr-generator" element={
              <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-8">
                  <AdvancedQRGenerator />
                </main>
              </div>
            } />

            <Route path="/domains" element={
              <div className="min-h-screen bg-gray-50">
                <Header />
                <main className="container mx-auto px-4 py-8">
                  <CustomDomainManager />
                </main>
              </div>
            } />
            <Route path="/pricing" element={
              <AuthRedirect requireAuth={false}>
                <Pricing />
              </AuthRedirect>
            } />
            <Route path="/profile" element={
              <AuthRedirect requireAuth={true}>
                <Profile />
              </AuthRedirect>
            } />
            <Route path="/account-settings" element={
              <AuthRedirect requireAuth={true}>
                <AccountSettings />
              </AuthRedirect>
            } />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Policy Pages */}
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/about" element={<About />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/terms" element={<TermsAndConditions />} />
            <Route path="/cancellation-refund" element={<CancellationRefund />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />


            {/* Careers Routes */}
            <Route path="/careers" element={<Careers />} />
            <Route path="/careers/apply" element={<Apply />} />
            <Route path="/careers/:jobId" element={<JobDetail />} />



            {/* Sitelinks Feature Pages */}
            <Route path="/short-links" element={<ShortLinks />} />
            <Route path="/qr-codes" element={<QrCodes />} />
            <Route path="/file-to-link" element={<FileToLink />} />
            <Route path="/faq" element={<FAQ />} />
            {/* Overwriting existing /contact route to use new Contact component matching specific SEO requirements */}
            <Route path="/contact" element={<Contact />} />

            {/* Solutions Pages */}
            <Route path="/solutions/social-media" element={<SocialMedia />} />
            <Route path="/solutions/digital-marketing" element={<DigitalMarketing />} />
            <Route path="/solutions/customer-support" element={<CustomerSupport />} />

            {/* Team Invite Route */}
            <Route path="/invite/:inviteToken" element={
              <AuthRedirect requireAuth={true}>
                <TeamInvite />
              </AuthRedirect>
            } />

            <Route path="/file/:fileId" element={<FileViewer />} />
            <Route path="/unlock/:shortCode" element={<UnlockPage />} />
            <Route path="/verified/:shortCode" element={<VerifiedPage />} />
            <Route path="/redirect/:shortCode" element={<RedirectPage />} />

            {/* Public Page Route (e.g. tinyslash.com/p/my-page) */}
            <Route path="/p/:slug" element={<PublicPage />} />

            {/* Short Link Redirect (Root level e.g. tinyslash.com/abc) */}
            <Route path="/:shortCode" element={<RedirectPage />} />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </Router>

      {/* Global Upgrade Modal - New Context System */}
      <UpgradeModal />

      {/* Global Support Widget */}
      <SupportWidget />
    </>
  );
};

function App() {
  return (
    <QueryProvider>
      <HelmetProvider>
        <AuthProvider>
          <TeamProvider>
            <SubscriptionProvider>
              <SupportProvider>
                <ModalProvider>
                  <AppContent />
                </ModalProvider>
              </SupportProvider>
            </SubscriptionProvider>
          </TeamProvider>
        </AuthProvider>
      </HelmetProvider>
    </QueryProvider>
  );
}

export default App;