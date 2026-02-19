import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
import { SupportProvider } from './context/SupportContext';
import { TeamProvider } from './context/TeamContext';
import { ModalProvider } from './context/ModalContext';
import { QueryProvider } from './providers/QueryProvider';
import { Loader2 } from 'lucide-react';

// Eagerly loaded components (Critical for initial render)
import Header from './components/Header';
import DashboardLayout from './components/layouts/DashboardLayout';
import AuthCallback from './pages/AuthCallback';
import AuthRedirect from './components/AuthRedirect'; // Kept eager as it wraps routes

// Lazy loaded components
const UpgradeModal = lazy(() => import('./components/UpgradeModal'));
const SupportWidget = lazy(() => import('./components/support/SupportWidget'));

// Pages - Marketing
const LandingPage = lazy(() => import('./pages/LandingPage/index'));
const Home = lazy(() => import('./pages/Home'));
const Pricing = lazy(() => import('./pages/Pricing'));
const ContactUs = lazy(() => import('./pages/ContactUs'));
const About = lazy(() => import('./pages/About'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));
const TermsAndConditions = lazy(() => import('./pages/TermsAndConditions'));
const CancellationRefund = lazy(() => import('./pages/CancellationRefund'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Careers = lazy(() => import('./pages/Careers'));
const JobDetail = lazy(() => import('./pages/JobDetail'));
const Apply = lazy(() => import('./pages/Apply'));
const ShortLinks = lazy(() => import('./pages/ShortLinks'));
const QrCodes = lazy(() => import('./pages/QrCodes'));
const FileToLink = lazy(() => import('./pages/FileToLink'));
const TinySlashPages = lazy(() => import('./pages/TinySlashPages'));
const FAQ = lazy(() => import('./pages/FAQ'));
const BlogList = lazy(() => import('./pages/Blog/BlogList'));
const BlogPostPage = lazy(() => import('./pages/Blog/BlogPost'));
const LinkCheckerPage = lazy(() => import('./pages/LinkCheckerPage'));

// Solutions
const SocialMedia = lazy(() => import('./pages/solutions/SocialMedia'));
const DigitalMarketing = lazy(() => import('./pages/solutions/DigitalMarketing'));
const CustomerSupport = lazy(() => import('./pages/solutions/CustomerSupport'));
const PagesSolution = lazy(() => import('./pages/solutions/Pages'));
const FileSharing = lazy(() => import('./pages/solutions/FileSharing'));

// Pages - Dashboard & App
const UnifiedDashboard = lazy(() => import('./components/UnifiedDashboard'));
const PagesDashboard = lazy(() => import('./pages/dashboard/PagesDashboard'));
const PageBuilder = lazy(() => import('./pages/dashboard/PageBuilder'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Profile = lazy(() => import('./pages/Profile'));
const AccountSettings = lazy(() => import('./pages/AccountSettings'));
const TeamInvite = lazy(() => import('./pages/TeamInvite'));
const AdvancedQRGenerator = lazy(() => import('./components/AdvancedQRGenerator'));
const CustomDomainManager = lazy(() => import('./components/CustomDomainManager'));
const FileViewer = lazy(() => import('./pages/FileViewer'));
const QRAnalyticsPage = lazy(() => import('./pages/QRAnalyticsPage'));
const FileAnalyticsPage = lazy(() => import('./pages/FileAnalyticsPage'));
const UnlockPage = lazy(() => import('./pages/UnlockPage'));
const VerifiedPage = lazy(() => import('./pages/VerifiedPage'));
const RedirectPage = lazy(() => import('./pages/RedirectPage'));
const PublicPage = lazy(() => import('./pages/public/PublicPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PixelManager = lazy(() => import('./components/pixels/PixelManager'));

import './App.css';

console.log('MODULE LOADED: App.tsx');

// Loading Fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Loader2 className="w-10 h-10 animate-spin text-blue-600 opacity-50" />
  </div>
);

const AppContent: React.FC = () => {
  console.log('RENDERING: AppContent');
  return (
    <>
      <Router>
        <div className="min-h-screen">
          <Suspense fallback={<PageLoader />}>
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

              <Route path="/dashboard/pixels" element={
                <AuthRedirect requireAuth={true}>
                  <DashboardLayout>
                    <PixelManager />
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
              <Route path="/pages" element={<TinySlashPages />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />

              {/* Solutions Pages */}
              <Route path="/solutions/social-media" element={<SocialMedia />} />
              <Route path="/solutions/digital-marketing" element={<DigitalMarketing />} />
              <Route path="/solutions/customer-support" element={<CustomerSupport />} />
              <Route path="/solutions/pages" element={<PagesSolution />} />
              <Route path="/solutions/file-sharing" element={<FileSharing />} />
              <Route path="/link-checker" element={<LinkCheckerPage />} />

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

              {/* Public Page Route */}
              <Route path="/p/:slug" element={<PublicPage />} />

              {/* Short Link Redirect */}
              <Route path="/:shortCode" element={<RedirectPage />} />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>

            {/* Global Upgrade Modal - Lazy Loaded */}
            <UpgradeModal />

            {/* Global Support Widget - Lazy Loaded */}
            <SupportWidget />
          </Suspense>
        </div>
      </Router>
      <Toaster position="top-right" />
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