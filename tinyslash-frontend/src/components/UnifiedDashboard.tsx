import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTeam } from '../context/TeamContext';
import { useUpgradeModal } from '../context/ModalContext';
import { CardDotsLoader } from '../components/ui/ThreeDotsLoader';

// Lazy load dashboard sections to split bundles
const DashboardOverview = lazy(() => import('./dashboard/DashboardOverview'));
const TeamManagement = lazy(() => import('./TeamManagement'));
const TeamSettings = lazy(() => import('./TeamSettings'));
const CreateSection = lazy(() => import('./dashboard/CreateSection'));
const LinksManager = lazy(() => import('./dashboard/LinksManager'));
const QRManageSection = lazy(() => import('./dashboard/QRManageSection'));
const FileToUrlManager = lazy(() => import('./dashboard/FileToUrlManager'));
const AnalyticsSection = lazy(() => import('./dashboard/AnalyticsSection'));
const CustomDomainManager = lazy(() => import('./CustomDomainManager'));
const Leads = lazy(() => import('../pages/dashboard/Leads'));
const TrustBadge = lazy(() => import('../pages/dashboard/TrustBadge'));
const UtmTemplatesManager = lazy(() => import('./dashboard/settings/UtmTemplatesManager'));

type SidebarSection = 'dashboard' | 'create' | 'links' | 'qr-codes' | 'file-to-url' | 'leads' | 'trust-badge' | 'analytics' | 'domains' | 'team-members' | 'team-settings' | 'utm-templates';
type CreateMode = 'url' | 'qr' | 'file';

const DashboardLoader = () => <CardDotsLoader className="h-64" />;

const UnifiedDashboard: React.FC = () => {
  const { user } = useAuth();
  const { currentScope } = useTeam();
  const upgradeModal = useUpgradeModal();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<SidebarSection>('dashboard');
  const [createMode, setCreateMode] = useState<CreateMode>('url');

  // Set active section based on current URL
  useEffect(() => {
    const path = location.pathname;

    if (path === '/dashboard') {
      // Only set to dashboard if we're not in create mode
      // This prevents resetting to dashboard when clicking Create buttons if the effect runs
      // But we actually want to rely on the dependency array to prevent running at all
      if (activeSection !== 'create') {
        setActiveSection('dashboard');
      }
    } else if (path.includes('/dashboard/links')) {
      setActiveSection('links');
    } else if (path.includes('/dashboard/leads')) {
      setActiveSection('leads');
    } else if (path.includes('/dashboard/trust-badge')) {
      setActiveSection('trust-badge');
    } else if (path.includes('/dashboard/qr-codes')) {
      setActiveSection('qr-codes');
    } else if (path.includes('/dashboard/file-links')) {
      setActiveSection('file-to-url');
    } else if (path.includes('/dashboard/analytics')) {
      setActiveSection('analytics');
    } else if (path.includes('/dashboard/domains')) {
      setActiveSection('domains');
    } else if (path.includes('/dashboard/team/members')) {
      setActiveSection('team-members');
    } else if (path.includes('/dashboard/team/settings')) {
      setActiveSection('team-settings');
    } else if (path.includes('/dashboard/team/utm-templates') || path.includes('/dashboard/utm-templates')) {
      setActiveSection('utm-templates');
    }
  }, [location.pathname]); // Remove activeSection dependency to allow external updates

  // Handle Analytics access restriction
  useEffect(() => {
    if (activeSection === 'analytics' && user && !(user?.plan?.includes('PRO') || user?.plan?.includes('BUSINESS'))) {
      // Redirect free users to dashboard and show upgrade modal
      navigate('/dashboard');
      upgradeModal.open(
        'Analytics',
        'Unlock detailed analytics and insights with PRO or BUSINESS plan',
        false
      );
    }
  }, [activeSection, user, navigate, upgradeModal]);

  // Check if returning from pricing page or navigating from profile
  useEffect(() => {
    const returnToDashboard = localStorage.getItem('returnToDashboard');
    const savedSection = localStorage.getItem('dashboardSection');

    if (returnToDashboard === 'true') {
      localStorage.removeItem('returnToDashboard');
      localStorage.removeItem('dashboardSection');
      if (savedSection && savedSection !== activeSection) {
        setActiveSection(savedSection as SidebarSection);
      }
    }

    if (location.state?.activeSection) {
      setActiveSection(location.state.activeSection as SidebarSection);
      if (location.state?.createMode) {
        setCreateMode(location.state.createMode as CreateMode);
      }
      if (!location.state?.editQRData) {
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state, navigate, activeSection]);

  const handleCreateClick = (mode: CreateMode) => {
    setCreateMode(mode);
    setActiveSection('create');
  };

  const renderContent = () => {
    if (user?.roles?.includes('ROLE_CLIENT')) {
      if (activeSection === 'analytics') return <AnalyticsSection />;
      return <DashboardOverview onCreateClick={handleCreateClick} />;
    }

    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview onCreateClick={handleCreateClick} />;
      case 'create':
        return <CreateSection
          mode={createMode}
          onModeChange={setCreateMode}
          onNavigateToFiles={() => setActiveSection('file-to-url')}
          onNavigateToQR={() => {
            setActiveSection('qr-codes');
            navigate('/dashboard/qr-codes');
          }}
          onNavigateToLinks={() => {
            setActiveSection('links');
            navigate('/dashboard/links');
          }}
        />;
      case 'links':
        return <LinksManager onCreateClick={() => handleCreateClick('url')} />;
      case 'qr-codes':
        return <QRManageSection onCreateClick={() => handleCreateClick('qr')} />;
      case 'file-to-url':
        return <FileToUrlManager onCreateClick={() => handleCreateClick('file')} />;
      case 'leads':
        return <Leads />;
      case 'trust-badge':
        return <TrustBadge />;
      case 'analytics':
        if (user?.plan?.includes('PRO') || user?.plan?.includes('BUSINESS')) {
          return <AnalyticsSection />;
        } else {
          return <DashboardOverview onCreateClick={handleCreateClick} />;
        }
      case 'domains':
        return <CustomDomainManager
          ownerType={currentScope.type}
          ownerId={currentScope.type === 'TEAM' ? currentScope.id : user?.id}
        />;
      case 'team-members':
        return currentScope.type === 'TEAM' ? <TeamManagement teamId={currentScope.id} /> : <DashboardOverview onCreateClick={handleCreateClick} />;
      case 'team-settings':
        return currentScope.type === 'TEAM' ? <TeamSettings teamId={currentScope.id} /> : <DashboardOverview onCreateClick={handleCreateClick} />;
      case 'utm-templates':
        return <UtmTemplatesManager />;
      default:
        return <DashboardOverview onCreateClick={handleCreateClick} />;
    }
  };

  return (
    <Suspense fallback={<DashboardLoader />}>
      {renderContent()}
    </Suspense>
  );
};

export default UnifiedDashboard;