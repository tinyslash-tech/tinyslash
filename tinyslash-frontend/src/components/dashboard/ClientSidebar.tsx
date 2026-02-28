import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BarChart3,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  ShoppingBag,
  CalendarDays
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface ClientSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

type ClientSidebarSection = 'dashboard' | 'business-orders' | 'business-bookings' | 'analytics';

const ClientSidebar: React.FC<ClientSidebarProps> = ({ isOpen, onClose, collapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<ClientSidebarSection>('dashboard');

  // Sync active section with URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard') setActiveSection('dashboard');
    else if (path.includes('/dashboard/analytics')) setActiveSection('analytics');
    else if (path.includes('/dashboard/business/orders')) setActiveSection('business-orders');
    else if (path.includes('/dashboard/business/bookings')) setActiveSection('business-bookings');
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigationGroups = [
    {
      title: 'Overview',
      items: [
        {
          id: 'dashboard' as ClientSidebarSection,
          label: 'Dashboard',
          icon: LayoutDashboard,
        }
      ]
    },
    {
      title: 'Commerce',
      items: [
        {
          id: 'business-orders' as ClientSidebarSection,
          label: 'Orders',
          icon: ShoppingBag,
        },
        {
          id: 'business-bookings' as ClientSidebarSection,
          label: 'Bookings',
          icon: CalendarDays,
        }
      ]
    },
    {
      title: 'Insights',
      items: [
        {
          id: 'analytics' as ClientSidebarSection,
          label: 'Analytics',
          icon: BarChart3,
        }
      ]
    }
  ];

  const handleItemClick = (item: any) => {
    switch (item.id) {
      case 'dashboard': navigate('/dashboard'); break;
      case 'analytics': navigate('/dashboard/analytics'); break;
      case 'business-orders': navigate('/dashboard/business/orders'); break;
      case 'business-bookings': navigate('/dashboard/business/bookings'); break;
      default: break;
    }
    if (window.innerWidth < 1024) {
      onClose();
    }
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
          bg-white border-r border-gray-200 text-gray-900
          flex flex-col h-full shadow-xl lg:shadow-none
        `}
      >
        {/* Header (Mobile Only) */}
        <div className="h-16 flex items-center justify-between px-4 lg:hidden border-b border-gray-100">
          <span className="font-bold text-xl text-indigo-600">Client Portal</span>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300">
          <div className="p-4 py-6 space-y-8">
            {navigationGroups.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-2">
                {!collapsed && (
                  <h3 className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 select-none">
                    {group.title}
                  </h3>
                )}

                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = activeSection === item.id;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleItemClick(item)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                          ${isActive
                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }
                          ${collapsed ? 'justify-center' : ''}
                        `}
                      >
                        <div className={`
                          flex items-center justify-center p-1 rounded-lg transition-colors
                          ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}
                        `}>
                          <Icon className="w-5 h-5" />
                        </div>

                        {!collapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Area */}
        <div className="p-4 border-t border-gray-100 space-y-2 bg-gray-50/50">
          {/* User Profile Summary */}
          {!collapsed && user && (
            <div className="px-3 py-3 mb-2 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-inner flex-shrink-0">
                {user.firstName?.[0] || user.email[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <div className={`flex items-center ${collapsed ? 'flex-col gap-2' : 'justify-between'}`}>
            <button
              onClick={handleLogout}
              className={`
                flex items-center justify-center gap-2 p-2.5 rounded-xl text-gray-600 
                hover:bg-red-50 hover:text-red-600 transition-colors group
                ${collapsed ? 'w-full' : 'flex-1'}
              `}
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span className="font-medium text-sm">Sign Out</span>}
            </button>

            {/* Collapse Toggle (Desktop only) */}
            <button
              onClick={onToggleCollapse}
              className={`
                hidden lg:flex items-center justify-center p-2.5 rounded-xl 
                text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors
                ${collapsed ? 'w-full' : ''}
              `}
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? (
                <PanelLeftOpen className="w-5 h-5" />
              ) : (
                <PanelLeftClose className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default ClientSidebar;
