import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';

// Page Components
import DashboardPage from './pages/dashboard/DashboardPage';
import UsersPage from './pages/users/UsersPage';
import TeamsPage from './pages/teams/TeamsPage';
import DomainsPage from './pages/domains/DomainsPage';
import LinksPage from './pages/links/LinksPage';
import QrCodesPage from './pages/qrcodes/QrCodesPage';
import FilesPage from './pages/files/FilesPage';
import BillingPage from './pages/billing/BillingPage';
import CouponsPage from './pages/coupons/CouponsPage';
// Support page
import SupportPage from './pages/support/SupportPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import ResourceManagementPage from './pages/resources/ResourceManagementPage';
import SystemHealthPage from './pages/system/SystemHealthPage';
import AuditLogsPage from './pages/audit/AuditLogsPage';
import CareersPage from './pages/careers/CareersPage';
import JobApplicantsPage from './pages/careers/JobApplicantsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import SettingsPage from './pages/settings/SettingsPage';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const { isAuthenticated, user, login, hasPermission, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />;
  }

  // Check if user has permission to access current page
  const checkPageAccess = (page: string) => {
    const pagePermissions: Record<string, { resource: string; action: string }> = {
      dashboard: { resource: 'dashboard', action: 'read' },
      users: { resource: 'users', action: 'read' },
      teams: { resource: 'teams', action: 'read' },
      domains: { resource: 'domains', action: 'read' },
      links: { resource: 'links', action: 'read' },
      qrcodes: { resource: 'qr', action: 'read' },
      files: { resource: 'files', action: 'read' },
      billing: { resource: 'billing', action: 'read' },
      coupons: { resource: 'coupons', action: 'read' },
      support: { resource: 'support', action: 'read' },
      analytics: { resource: 'analytics', action: 'read' },
      resources: { resource: 'resources', action: 'read' },
      system: { resource: 'system', action: 'read' },
      audit: { resource: 'audit', action: 'read' },
      careers: { resource: 'jobs', action: 'read' },
      'job-applicants': { resource: 'jobs', action: 'read' },
      admins: { resource: 'employees', action: 'read' },
      employees: { resource: 'employees', action: 'read' },
      settings: { resource: 'settings', action: 'read' }
    };

    const permission = pagePermissions[page];
    return permission ? hasPermission(permission.resource, permission.action) : false;
  };

  const renderPage = () => {
    // Check access before rendering
    if (!checkPageAccess(currentPage)) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="text-6xl mb-4">🚫</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Access Denied</h3>
            <p className="text-gray-600 dark:text-gray-400">You don't have permission to access this page.</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Current role: <span className="font-medium">{user?.role?.displayName}</span>
            </p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'dashboard':
        // @ts-ignore
        return <DashboardPage hasPermission={hasPermission} user={user} />;
      case 'careers':
        return <CareersPage onViewApplicants={(id: string) => { setSelectedJobId(id); setCurrentPage('job-applicants'); }} />;
      case 'job-applicants':
        return <JobApplicantsPage jobId={selectedJobId} onBack={() => { setSelectedJobId(null); setCurrentPage('careers'); }} />;
      case 'users':
        // @ts-ignore
        return <UsersPage hasPermission={hasPermission} />;
      case 'teams':
        // @ts-ignore
        return <TeamsPage hasPermission={hasPermission} />;
      case 'domains':
        // @ts-ignore
        return <DomainsPage hasPermission={hasPermission} />;
      case 'links':
        // @ts-ignore
        return <LinksPage hasPermission={hasPermission} />;
      case 'qrcodes':
        // @ts-ignore
        return <QrCodesPage hasPermission={hasPermission} />;
      case 'files':
        // @ts-ignore
        return <FilesPage hasPermission={hasPermission} />;
      case 'billing':
        // @ts-ignore
        return <BillingPage hasPermission={hasPermission} />;
      case 'coupons':
        // @ts-ignore
        return <CouponsPage hasPermission={hasPermission} />;
      case 'support':
        // @ts-ignore
        return <SupportPage hasPermission={hasPermission} />;
      case 'analytics':
        // @ts-ignore
        return <AnalyticsPage hasPermission={hasPermission} />;
      case 'resources':
        // @ts-ignore
        return <ResourceManagementPage hasPermission={hasPermission} />;
      case 'system':
        // @ts-ignore
        return <SystemHealthPage hasPermission={hasPermission} />;
      case 'audit':
        // @ts-ignore
        return <AuditLogsPage hasPermission={hasPermission} />;
      case 'admins':
        return <AdminUsersPage hasPermission={hasPermission} viewType="admins" />;
      case 'employees':
        return <AdminUsersPage hasPermission={hasPermission} viewType="employees" />;
      case 'settings':
        return <SettingsPage />;
      default:
        // @ts-ignore
        return <DashboardPage hasPermission={hasPermission} user={user} />;
    }
  };

  return (
    <Layout currentPage={currentPage} setCurrentPage={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <AppContent />
    </AuthProvider>
  );
};

export default App;