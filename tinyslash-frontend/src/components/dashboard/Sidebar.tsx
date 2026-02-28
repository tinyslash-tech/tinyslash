import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Link as LinkIcon,
  QrCode,
  Upload,
  BarChart3,
  Plus,
  X,
  Crown,
  Zap,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  Settings,
  Globe,
  ChevronRight,
  ChevronLeft,
  LogOut,
  HelpCircle,
  Shield,
  Target, // Added Target icon for Pixels
  Tag,
  ShoppingBag,
  CalendarDays,
  CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTeam } from '../../context/TeamContext';
import { useUpgradeModal } from '../../context/ModalContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

type SidebarSection = 'dashboard' | 'create' | 'links' | 'qr-codes' | 'pages' | 'file-to-url' | 'leads' | 'trust-badge' | 'analytics' | 'domains' | 'team-members' | 'team-settings' | 'pixels' | 'business-orders' | 'business-bookings' | 'business-payouts' | 'clients';
type CreateMode = 'url' | 'qr' | 'file';

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, collapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const { currentScope } = useTeam();
  const upgradeModal = useUpgradeModal();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<SidebarSection>('dashboard');
  const [createMode, setCreateMode] = useState<CreateMode>('url');

  // Is user PRO or BUSINESS?
  const isPro = user?.plan?.includes('PRO') || user?.plan?.includes('BUSINESS') || false;

  // Sync active section with URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard') {
      if (!location.state?.activeSection) {
        setActiveSection('dashboard');
      }
    }
    else if (path.includes('/dashboard/links')) setActiveSection('links');
    else if (path.includes('/dashboard/pages')) setActiveSection('pages');
    else if (path.includes('/dashboard/leads')) setActiveSection('leads');
    else if (path.includes('/dashboard/trust-badge')) setActiveSection('trust-badge');
    else if (path.includes('/dashboard/qr-codes')) setActiveSection('qr-codes');
    else if (path.includes('/dashboard/file-links')) setActiveSection('file-to-url');
    else if (path.includes('/dashboard/pixels')) setActiveSection('pixels');
    else if (path.includes('/dashboard/analytics')) setActiveSection('analytics');
    else if (path.includes('/dashboard/domains')) setActiveSection('domains');
    else if (path.includes('/dashboard/business/orders')) setActiveSection('business-orders');
    else if (path.includes('/dashboard/business/bookings')) setActiveSection('business-bookings');
    else if (path.includes('/dashboard/business/payouts')) setActiveSection('business-payouts');
    else if (path.includes('/dashboard/clients')) setActiveSection('clients');
  }, [location.pathname, location.state]);

  const handleUpgradeClick = () => {
    localStorage.setItem('returnToDashboard', 'true');
    localStorage.setItem('dashboardSection', activeSection);
    navigate('/pricing');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Navigation Group Definitions
  const navigationGroups = [
    {
      title: 'Create',
      items: [
        {
          id: 'dashboard' as SidebarSection,
          label: 'Overview',
          icon: LayoutDashboard,
        },
        {
          id: 'pages' as SidebarSection,
          label: 'Pages',
          icon: LayoutDashboard,
          badge: 'NEW'
        },
        {
          id: 'links' as SidebarSection,
          label: 'Links',
          icon: LinkIcon,
        },
        {
          id: 'qr-codes' as SidebarSection,
          label: 'QR Codes',
          icon: QrCode,
        },
        {
          id: 'file-to-url' as SidebarSection,
          label: 'Files',
          icon: Upload,
        }
      ]
    },
    {
      title: 'Business',
      items: [
        {
          id: 'business-orders' as SidebarSection,
          label: 'Orders',
          icon: ShoppingBag,
        },
        {
          id: 'business-bookings' as SidebarSection,
          label: 'Bookings',
          icon: CalendarDays,
        },
        {
          id: 'business-payouts' as SidebarSection,
          label: 'Payouts',
          icon: CreditCard,
        },
        ...(user?.plan === 'BUSINESS' || user?.roles?.includes('ROLE_AGENCY') ? [
          {
            id: 'clients' as SidebarSection,
            label: 'Clients',
            icon: Users,
          },
          {
            id: 'agency-settings' as SidebarSection,
            label: 'Workspace',
            icon: Settings,
          }
        ] : []),
      ]
    },
    {
      title: 'Grow',
      items: [
        {
          id: 'analytics' as SidebarSection,
          label: 'Analytics',
          icon: BarChart3,
          isPro: true,
          badge: !isPro ? 'PRO' : undefined
        },
        {
          id: 'pixels' as SidebarSection,
          label: 'Pixels',
          icon: Target,
        },
        {
          id: 'leads' as SidebarSection,
          label: 'Leads',
          icon: Users,
          isPro: true,
          badge: !isPro ? 'PRO' : undefined
        }
      ]
    },
    {
      title: 'Settings',
      items: [
        {
          id: 'domains' as SidebarSection,
          label: 'Domains',
          icon: Globe,
          isPro: false,
          badge: !isPro ? 'PRO' : undefined
        },
        {
          id: 'utm-templates' as SidebarSection,
          label: 'UTM Templates',
          icon: Tag,
          isPro: true,
          badge: !isPro ? 'PRO' : undefined
        },
        ...(currentScope.type === 'TEAM' ? [
          {
            id: 'team-members' as SidebarSection,
            label: 'Members',
            icon: Users,
          },
          {
            id: 'team-settings' as SidebarSection,
            label: 'Settings',
            icon: Settings,
          }
        ] : []),
        {
          id: 'trust-badge' as SidebarSection,
          label: 'Trust Badge',
          icon: Shield,
        }
      ]
    }
  ];

  const handleItemClick = (item: any) => {
    if (item.id === 'analytics' && !isPro) {
      upgradeModal.open('Analytics', 'Unlock detailed analytics', false);
      return;
    } else if (item.id === 'utm-templates' && !isPro) {
      upgradeModal.open('UTM Templates', 'Upgrade to PRO or BUSINESS to unlock templates', false);
      return;
    }

    // Default navigation
    switch (item.id) {
      case 'dashboard': navigate('/dashboard'); break;
      case 'links': navigate('/dashboard/links'); break;
      case 'pages': navigate('/dashboard/pages'); break;
      case 'qr-codes': navigate('/dashboard/qr-codes'); break;
      case 'file-to-url': navigate('/dashboard/file-links'); break;
      case 'pixels': navigate('/dashboard/pixels'); break;
      case 'leads': navigate('/dashboard/leads'); break;
      case 'trust-badge': navigate('/dashboard/trust-badge'); break;
      case 'analytics': navigate('/dashboard/analytics'); break;
      case 'domains': navigate('/dashboard/domains'); break;
      case 'team-members': navigate('/dashboard/team/members'); break;
      case 'team-settings': navigate('/dashboard/team/settings'); break;
      case 'utm-templates':
        if (currentScope.type === 'TEAM') {
          navigate('/dashboard/team/utm-templates');
        } else {
          navigate('/dashboard/utm-templates');
        }
        break;
      case 'business-orders': navigate('/dashboard/business/orders'); break;
      case 'business-bookings': navigate('/dashboard/business/bookings'); break;
      case 'business-payouts': navigate('/dashboard/business/payouts'); break;
      case 'clients': navigate('/dashboard/clients'); break;
      case 'agency-settings': navigate('/dashboard/business/settings'); break;
      default: break;
    }
  };

  const handleCreateClick = () => {
    setActiveSection('create');
    navigate('/dashboard', { state: { activeSection: 'create' } });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <motion.aside
        initial={false}
        animate={{
          width: collapsed ? 80 : 280,
          translateX: isOpen ? 0 : window.innerWidth >= 1024 ? 0 : -300
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          bg-[#ffffff] border-r-2 border-gray-900 text-gray-900
          flex flex-col h-full shadow-[4px_0px_0px_rgba(0,0,0,1)] lg:shadow-[4px_0px_0px_rgba(0,0,0,1)]
        `}
      >
        {/* Toggle Button - Hanging on the right edge */}
        <button
          onClick={onToggleCollapse}
          className={`
            hidden lg:flex absolute -right-3 top-9 z-50
            items-center justify-center w-6 h-6
            bg-white border-2 border-gray-900 rounded-full shadow-[2px_2px_0px_rgba(0,0,0,1)]
            text-gray-900 hover:bg-gray-100 transition-all font-bold hover:translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_rgba(0,0,0,1)]
          `}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Header Section - Modified to remove Logo */}
        {/* Only show Mobile Close header on mobile. On desktop, this area is removed or minimized. */}
        <div className="flex items-center justify-end p-4 lg:hidden h-16 border-b border-gray-100">
          <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Spacer for Desktop (since we removed header) or just padding */}
        <div className="hidden lg:block h-6"></div>

        {/* Create Button Area */}
        <div className="px-4 pb-4">
          <button
            onClick={handleCreateClick}
            className={`
               w-full flex items-center justify-center
               bg-gray-900 border-2 border-gray-900 text-white
               hover:bg-black hover:shadow-[4px_4px_0px_#2563eb] hover:-translate-y-0.5
               transition-all duration-200 rounded-xl font-bold
               ${collapsed ? 'h-12 w-12 p-0' : 'h-12 px-4 space-x-2'}
             `}
          >
            <Plus className="w-6 h-6" />
            {!collapsed && <span>Create New</span>}
          </button>
        </div>

        {/* Scrollable Navigation */}
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar py-2">
          {navigationGroups.map((group, groupIndex) => (
            <div key={group.title} className="mb-6 px-4">
              {!collapsed && (
                <div className="text-xs font-black text-gray-900 uppercase tracking-widest mb-2 px-2">
                  {group.title}
                </div>
              )}
              {collapsed && groupIndex > 0 && <div className="h-px bg-gray-100 mx-2 my-2" />}

              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = activeSection === item.id;

                  return (
                    <div key={item.id} className="relative group">
                      <button
                        onClick={() => handleItemClick(item)}
                        className={`
                          w-full flex items-center
                          ${collapsed ? 'justify-center h-10 w-10 mx-auto rounded-lg' : 'px-3 py-2.5 rounded-lg space-x-3'}
                          transition-all duration-200 border-2
                          ${isActive
                            ? 'bg-blue-50 border-gray-900 text-gray-900 font-bold shadow-[2px_2px_0px_rgba(0,0,0,1)] -translate-y-0.5'
                            : 'border-transparent text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-900 hover:text-gray-900 hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5'
                          }
                        `}
                      >
                        <item.icon className={`${collapsed ? 'w-5 h-5' : 'w-5 h-5'} ${isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-900'}`} />

                        {!collapsed && (
                          <div className="flex-1 flex items-center justify-between">
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className={`text-[10px] px-1.5 py-0.5 rounded border-2 font-bold ${isActive ? 'bg-white border-gray-900 text-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)]' : 'bg-green-100 border-green-300 text-green-800'}`}>
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}

                        {collapsed && (
                          <div className="absolute left-full ml-4 px-2 py-1 bg-[#ffffff] border-2 border-gray-900 shadow-[2px_2px_0px_rgba(0,0,0,1)] font-bold text-gray-900 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                            {item.label}
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Upgrade / Copyright */}
        <div className="flex-shrink-0 border-t-2 border-gray-900 p-4 mt-auto">
          {!isPro && !collapsed && (
            <div className="mb-3 bg-[#ffffff] rounded-xl p-4 border-2 border-gray-900 shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all text-gray-900">
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 bg-yellow-100 border-2 border-yellow-300 rounded-lg">
                  <Crown className="w-5 h-5 text-yellow-600" />
                </div>
                <button onClick={() => navigate('/pricing')} className="text-xs font-bold bg-gray-900 text-white hover:bg-black px-3 py-1.5 rounded-lg transition-colors shadow-sm">
                  Upgrade
                </button>
              </div>
              <h4 className="font-black tracking-widest uppercase text-sm mt-1">Upgrade to Pro</h4>
              <p className="text-xs font-medium text-gray-600 leading-snug mt-1">
                Analytics, custom domains & more.
              </p>
            </div>
          )}

          <div className="flex items-center justify-center py-2">
            <span className="text-xs font-bold tracking-widest uppercase text-gray-500">© 2025 TinySlash</span>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
