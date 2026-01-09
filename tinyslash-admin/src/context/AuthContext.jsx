import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// RBAC System - Industry Grade Admin Roles
export const ADMIN_ROLES = {
  SUPER_ADMIN: {
    name: 'SUPER_ADMIN',
    displayName: 'Super Admin',
    level: 1,
    permissions: ['*'] // Full access
  },
  ADMIN: {
    name: 'ADMIN',
    displayName: 'Platform Manager',
    level: 2,
    permissions: ['users:*', 'teams:*', 'domains:*', 'links:*', 'qr:*', 'files:*', 'resources:*', 'support:*', 'analytics:read', 'billing:read']
  },
  SUPPORT: {
    name: 'SUPPORT',
    displayName: 'Support Admin',
    level: 3,
    permissions: ['users:read', 'users:impersonate', 'links:read', 'qr:read', 'files:read', 'support:*', 'tickets:*', 'analytics:read']
  },
  BILLING: {
    name: 'BILLING',
    displayName: 'Billing Manager',
    level: 3,
    permissions: ['billing:*', 'subscriptions:*', 'coupons:*', 'analytics:billing', 'users:read', 'resources:read']
  },
  TECH: {
    name: 'TECH',
    displayName: 'Technical Admin',
    level: 3,
    permissions: ['system:*', 'resources:*', 'files:*', 'qr:read', 'domains:verify', 'ssl:*', 'cache:*', 'jobs:*', 'analytics:system']
  },
  MODERATOR: {
    name: 'MODERATOR',
    displayName: 'Content Moderator',
    level: 4,
    permissions: ['links:moderate', 'qr:read', 'files:read', 'domains:moderate', 'users:read', 'reports:*']
  },
  AUDITOR: {
    name: 'AUDITOR',
    displayName: 'Read-Only Auditor',
    level: 5,
    permissions: ['*:read', 'audit:*', 'export:*']
  },
  HR: {
    name: 'HR',
    displayName: 'HR Manager',
    level: 2,
    permissions: ['users:*', 'employees:*', 'jobs:*', 'teams:read']
  }
};

// Permission checker
const hasPermission = (userRole, resource, action) => {
  if (!userRole || !userRole.permissions) return false;

  // Super admin has all permissions
  if (userRole.permissions.includes('*')) return true;

  // Check specific permissions
  const fullPermission = `${resource}:${action}`;
  const resourceWildcard = `${resource}:*`;
  const actionWildcard = `*:${action}`;

  return userRole.permissions.some(permission =>
    permission === fullPermission ||
    permission === resourceWildcard ||
    permission === actionWildcard
  );
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Check for existing token on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        const { token, user: apiUser } = response.data;

        // Map API user to Frontend Role
        // The backend returns a list of roles (Set<String>), e.g. ["ROLE_TECH", "ROLE_ADMIN"]
        // We need to find the highest privilege role (lowest level)

        const backendRoles = apiUser.roles || [];
        let assignedRole = ADMIN_ROLES.USER; // Default

        // Helper to find role config by ID
        const findRoleConfig = (roleId) => {
          for (const key in ADMIN_ROLES) {
            // Check if the key matches the role string (e.g. ROLE_TECH matches TECH key?)
            // Actually the backend sends "ROLE_TECH", our keys are "TECH".
            // Let's strip "ROLE_" prefix
            if (roleId === `ROLE_${key}`) {
              return ADMIN_ROLES[key];
            }
            // Also check direct match just in case
            if (roleId === key) return ADMIN_ROLES[key];
          }
          return null;
        };

        // Iterate through user roles and find the most powerful one
        let bestLevel = 100; // Start high (low privilege)

        if (backendRoles.includes('ROLE_SUPER_ADMIN')) {
          assignedRole = ADMIN_ROLES.SUPER_ADMIN;
        } else {
          backendRoles.forEach(r => {
            const config = findRoleConfig(r);
            if (config && config.level < bestLevel) {
              bestLevel = config.level;
              assignedRole = config;
            }
          });
        }

        // Fallback for generic admins if not caught above
        if (assignedRole === ADMIN_ROLES.USER && backendRoles.includes('ROLE_ADMIN')) {
          assignedRole = ADMIN_ROLES.ADMIN;
        }

        const userData = {
          name: apiUser.firstName + ' ' + apiUser.lastName,
          email: apiUser.email,
          role: assignedRole,
          avatar: apiUser.profilePicture || apiUser.firstName?.charAt(0),
          permissions: assignedRole.permissions,
          id: apiUser.id
        };

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  const checkPermission = (resource, action) => {
    return hasPermission(user?.role, resource, action);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, hasPermission: checkPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
