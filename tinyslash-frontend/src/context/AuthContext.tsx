import React, { createContext, useContext, useState, useEffect } from 'react';
import { googleAuthService, GoogleUserInfo } from '../services/googleAuth';
import { normalizePlanName } from '../constants/planPolicy';
import * as api from '../services/api';

// Extend window interface for auth intervals
declare global {
  interface Window {
    authIntervals: NodeJS.Timeout[];
  }
}

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  avatar?: string;
  picture?: string;
  phone?: string;
  location?: string;
  bio?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
  timezone?: string;
  language?: string;
  createdAt?: string;
  isAuthenticated?: boolean;
  authProvider?: 'email' | 'google';
  subscriptionPlan?: string;
  subscriptionExpiry?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  setUser: (user: User | null, token?: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean; // Add loading state to interface
  redirectAfterAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cookie helper functions
const getRootDomain = () => {
  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1') return hostname;

  // For domains like dev.tinyslash.com, we want .tinyslash.com
  const parts = hostname.split('.');
  if (parts.length >= 2) {
    // Check if it's an IP address (simplified check)
    if (parts.every(part => !isNaN(parseInt(part)))) {
      return hostname;
    }
    return '.' + parts.slice(-2).join('.');
  }
  return hostname;
};

const setCookie = (name: string, value: string, days: number) => {
  const domain = getRootDomain();
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  const secure = window.location.protocol === 'https:' ? 'Secure;' : '';

  // Set cookie for root domain to share across subdomains
  document.cookie = `${name}=${value};${expires};domain=${domain};path=/;${secure}SameSite=Lax`;
  console.log(`Setting cookie: ${name} for domain ${domain}`);
};

const getCookie = (name: string) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const removeCookie = (name: string) => {
  const domain = getRootDomain();
  // To delete a cookie, we set the expires date to a past date
  // We need to match the domain path to ensure it's deleted
  document.cookie = `${name}=; Max-Age=-99999999; domain=${domain}; path=/;`;
  // Also try to remove it without domain just in case
  document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
  console.log(`Removing cookie: ${name}`);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Single atomic state — prevents race conditions between isLoading and isAuthenticated
  // If these were separate useState values, React could render a frame where
  // isLoading=false AND isAuthenticated=false simultaneously, causing AuthRedirect
  // to wrongly push the user to '/' right after a valid login.
  const [authState, setAuthState] = useState<{
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
  }>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Convenience destructures
  const { user, token, isAuthenticated, isLoading } = authState;

  const setUserWithAuth = (newUser: User | null, authToken?: string | null) => {
    console.log('=== setUserWithAuth called ===');
    console.log('New user:', newUser ? newUser.email : 'null');

    if (newUser) {
      try {
        localStorage.setItem('user', JSON.stringify(newUser));
        if (authToken) {
          localStorage.setItem('token', authToken);
          setCookie('token', authToken, 7);
          // Always set tokenExpiry when we have a new token
          localStorage.setItem('tokenExpiry', (Date.now() + 86400000).toString());
          console.log('Token + expiry saved');
        }
      } catch (error) {
        console.error('Failed to save to localStorage:', error);
      }
      // Single atomic update — no intermediate renders with inconsistent state
      setAuthState({
        user: newUser,
        token: authToken ?? null,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      console.log('Clearing authentication data');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
      removeCookie('token');
      // Single atomic update
      setAuthState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  useEffect(() => {
    console.log('=== AuthContext useEffect - Checking stored auth ===');

    // Listen for auth events from API interceptor
    const handleAuthLogout = () => {
      console.log('Received auth-logout event, clearing user state');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
      removeCookie('token');
      // Clear any intervals
      if (window.authIntervals) {
        window.authIntervals.forEach(clearInterval);
        window.authIntervals = [];
      }
      // Single atomic state clear
      setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
      // Redirect to home page
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    };

    const handleTokenRefresh = (event: CustomEvent) => {
      console.log('Received auth-token-refreshed event, updating user state');
      const { token: newToken, user: userData } = event.detail;

      const refreshedUser: User = {
        id: userData.id,
        name: `${userData.firstName} ${userData.lastName}`.trim() || userData.email.split('@')[0],
        email: userData.email,
        plan: normalizePlanName(userData.subscriptionPlan || 'FREE'),
        subscriptionPlan: userData.subscriptionPlan,
        subscriptionExpiry: userData.subscriptionExpiry || undefined,
        avatar: userData.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.firstName || userData.email.split('@')[0])}&background=3b82f6&color=fff`,
        picture: userData.profilePicture,
        createdAt: userData.createdAt,
        timezone: 'Asia/Kolkata',
        language: 'en',
        isAuthenticated: true,
        authProvider: userData.authProvider === 'GOOGLE' ? 'google' : 'email'
      };

      setAuthState(prev => ({ ...prev, user: refreshedUser, token: newToken, isAuthenticated: true }));

      // Update cookie and localStorage
      setCookie('token', newToken, 7);
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(refreshedUser));
      localStorage.setItem('tokenExpiry', (Date.now() + 86400000).toString());
    };

    window.addEventListener('auth-logout', handleAuthLogout);
    window.addEventListener('auth-token-refreshed', handleTokenRefresh as EventListener);

    // Handle user updates (e.g., after successful payment)
    const handleUserUpdate = (event: CustomEvent) => {
      const { user: updatedUser } = event.detail;
      console.log('User update event received:', updatedUser);

      if (updatedUser && user) {
        const newUser: User = {
          ...user,
          plan: normalizePlanName(updatedUser.subscriptionPlan || updatedUser.plan || 'FREE'),
          subscriptionPlan: updatedUser.subscriptionPlan,
          subscriptionExpiry: updatedUser.subscriptionExpiry
        };

        localStorage.setItem('user', JSON.stringify(newUser));
        setAuthState(prev => ({ ...prev, user: newUser }));
        console.log('User context updated with new subscription:', newUser.plan);
        window.dispatchEvent(new CustomEvent('subscription-updated'));
      }
    };

    window.addEventListener('auth-user-updated', handleUserUpdate as EventListener);

    // Helper: detect transient network/timeout errors vs real auth failures
    const isNetworkOrTimeoutError = (error: any): boolean => {
      if (!error) return false;
      // Axios timeout
      if (error.code === 'ECONNABORTED') return true;
      // Axios network error (no response)
      if (error.code === 'NETWORK_ERROR' || !error.response) return true;
      // Server-side errors (5xx) — backend unavailable, not a token problem
      if (error.response?.status >= 500) return true;
      return false;
    };

    // Helper: restore user from cached localStorage data (offline/timeout fallback)
    const restoreFromCache = (savedUser: string, savedToken: string) => {
      try {
        const parsedUser: User = JSON.parse(savedUser);
        console.log('🔄 Restoring auth from cache (backend unreachable):', parsedUser.email);
        // Single atomic update — isLoading goes false at same time as isAuthenticated goes true
        setAuthState({ user: parsedUser, token: savedToken, isAuthenticated: true, isLoading: false });
        startSessionManagement();
      } catch (parseError) {
        console.error('Failed to parse cached user:', parseError);
        // Even on parse error, stop loading
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    const initializeAuth = async () => {
      try {
        // Check if user is logged in from localStorage or check for cookie
        const savedUser = localStorage.getItem('user');
        let savedToken = localStorage.getItem('token');

        // Try getting token from cookie if not in localStorage
        const cookieToken = getCookie('token');
        if (cookieToken) {
          console.log('Found token in cookie');
          savedToken = cookieToken;
        }

        const googleUserInfo = googleAuthService.getStoredUserInfo();

        console.log('Saved user:', savedUser ? 'exists' : 'null');
        console.log('Saved token:', savedToken ? 'exists' : 'null');
        console.log('Google user info:', googleUserInfo ? 'exists' : 'null');

        if (savedToken) {
          // ── FAST PATH: Token is still fresh locally ──────────────────────────
          // Check local expiry before making any network call.
          // JWT is issued with 24h expiry; we track this in localStorage.
          // If the token hasn't expired locally yet, trust it and skip the
          // backend round-trip entirely. This prevents sign-out caused by
          // backend cold-start timeouts (Render.com free tier).
          const tokenExpiry = localStorage.getItem('tokenExpiry');
          const isTokenFresh = tokenExpiry && Date.now() < parseInt(tokenExpiry);

          if (isTokenFresh && savedUser) {
            console.log('✅ Token is still fresh — restoring from localStorage (skipping backend call)');
            restoreFromCache(savedUser, savedToken);
            // Refresh the expiry window to keep the user logged in on each visit
            localStorage.setItem('tokenExpiry', (Date.now() + 86400000).toString());
          } else {
            // ── SLOW PATH: Token may have expired — check with backend ──────────
            console.log('⏰ Token expiry passed or unknown — validating with backend...');
            try {
              const data = await api.validateToken(savedToken);

              if (data.success && data.user) {
                console.log('Token validated successfully, restoring user:', data.user.email);
                const validatedUser: User = {
                  id: data.user.id,
                  name: `${data.user.firstName} ${data.user.lastName}`.trim() || data.user.email.split('@')[0],
                  email: data.user.email,
                  plan: normalizePlanName(data.user.subscriptionPlan || 'FREE'),
                  subscriptionPlan: data.user.subscriptionPlan,
                  subscriptionExpiry: data.user.subscriptionExpiry || undefined,
                  avatar: data.user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.firstName || data.user.email.split('@')[0])}&background=3b82f6&color=fff`,
                  picture: data.user.profilePicture,
                  createdAt: data.user.createdAt,
                  timezone: 'Asia/Kolkata',
                  language: 'en',
                  isAuthenticated: true,
                  authProvider: data.user.authProvider === 'GOOGLE' ? 'google' : 'email'
                };

                // Single atomic update — isLoading=false & isAuthenticated=true in one render
                setAuthState({ user: validatedUser, token: savedToken, isAuthenticated: true, isLoading: false });

                // Sync cookie and localstorage
                setCookie('token', savedToken, 7);
                localStorage.setItem('token', savedToken);
                localStorage.setItem('user', JSON.stringify(validatedUser));
                // Reset local expiry
                localStorage.setItem('tokenExpiry', (Date.now() + 86400000).toString());

                startSessionManagement();
                console.log('Authentication restored successfully via backend validation');
              } else {
                throw new Error('Token validation failed');
              }
            } catch (validationError: any) {
              console.warn('Token validation error:', validationError);

              // ── KEY FIX: Don't sign out on transient network errors ──────────
              // If the backend is unreachable (timeout, 5xx, no response), keep
              // the user logged in using cached data. Only clear auth on a genuine
              // 401 Unauthorized response, which means the token is actually invalid.
              if (isNetworkOrTimeoutError(validationError)) {
                console.warn('⚠️ Backend unreachable during token validation — keeping user logged in from cache');
                if (savedUser) {
                  restoreFromCache(savedUser, savedToken);
                }
                // Don't clear auth — they'll be validated on next successful request
              } else {
                // Genuine token failure (401) — try to refresh
                console.log('Token rejected by backend — attempting refresh...');
                try {
                  const apiUrl = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8080/api');
                  const refreshResponse = await fetch(`${apiUrl}/v1/auth/refresh`, {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${savedToken}`,
                      'Content-Type': 'application/json',
                    },
                  });

                  const refreshData = await refreshResponse.json();

                  if (refreshData.success && refreshData.token && refreshData.user) {
                    console.log('Token refreshed successfully during initialization');

                    const refreshedUser: User = {
                      id: refreshData.user.id,
                      name: `${refreshData.user.firstName} ${refreshData.user.lastName}`.trim() || refreshData.user.email.split('@')[0],
                      email: refreshData.user.email,
                      plan: normalizePlanName(refreshData.user.subscriptionPlan || 'FREE'),
                      subscriptionPlan: refreshData.user.subscriptionPlan,
                      subscriptionExpiry: refreshData.user.subscriptionExpiry || undefined,
                      avatar: refreshData.user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(refreshData.user.firstName || refreshData.user.email.split('@')[0])}&background=3b82f6&color=fff`,
                      picture: refreshData.user.profilePicture,
                      createdAt: refreshData.user.createdAt,
                      timezone: 'Asia/Kolkata',
                      language: 'en',
                      isAuthenticated: true,
                      authProvider: refreshData.user.authProvider === 'GOOGLE' ? 'google' : 'email'
                    };

                    localStorage.setItem('token', refreshData.token);
                    localStorage.setItem('user', JSON.stringify(refreshedUser));
                    localStorage.setItem('tokenExpiry', (Date.now() + 86400000).toString());
                    setCookie('token', refreshData.token, 7);

                    setAuthState({ user: refreshedUser, token: refreshData.token, isAuthenticated: true, isLoading: false });
                    console.log('Authentication restored via token refresh');
                  } else {
                    throw new Error('Token refresh failed');
                  }
                } catch (refreshError: any) {
                  // Only clear auth if this is also a real auth failure, not a network issue
                  if (isNetworkOrTimeoutError(refreshError)) {
                    console.warn('⚠️ Backend unreachable during refresh — keeping user logged in from cache');
                    if (savedUser) restoreFromCache(savedUser, savedToken);
                  } else {
                    console.error('Token refresh truly failed — clearing auth');
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    localStorage.removeItem('tokenExpiry');
                    removeCookie('token');
                    setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
                  }
                }
              }
            }
          }
        } else if (googleUserInfo && googleAuthService.isAuthenticated()) {
          console.log('Authenticating with Google info');
          await handleGoogleAuth(googleUserInfo);
        } else {
          console.log('No valid authentication found');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Only clear auth state on unexpected errors if we have no saved user
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiry');
          removeCookie('token');
          setAuthState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        } else {
          // Had cached user — stop loading but preserve auth state
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } finally {
        // isLoading is set to false atomically within each branch above.
        // This catch-all ensures we NEVER get stuck in loading if something
        // unexpected happens mid-initialization.
        setAuthState(prev => (prev.isLoading ? { ...prev, isLoading: false } : prev));
      }
    };

    initializeAuth();

    // Cleanup event listeners
    return () => {
      window.removeEventListener('auth-logout', handleAuthLogout);
      window.removeEventListener('auth-token-refreshed', handleTokenRefresh as EventListener);
      window.removeEventListener('auth-user-updated', handleUserUpdate as EventListener);
    };
  }, []);

  const handleGoogleAuth = async (googleUserInfo: GoogleUserInfo) => {
    try {
      console.log('=== Google Auth attempt ===');
      console.log('Google user info:', googleUserInfo);

      const response = await api.googleAuth({
        email: googleUserInfo.email,
        googleId: googleUserInfo.id,
        firstName: googleUserInfo.given_name || googleUserInfo.name.split(' ')[0] || '',
        lastName: googleUserInfo.family_name || googleUserInfo.name.split(' ').slice(1).join(' ') || '',
        profilePicture: googleUserInfo.picture
      });

      console.log('Google auth response:', response);

      if (response.success && response.user && response.token) {
        const user: User = {
          id: response.user.id,
          name: `${response.user.firstName} ${response.user.lastName}`.trim() || response.user.email.split('@')[0],
          email: response.user.email,
          plan: normalizePlanName(response.user.subscriptionPlan || 'FREE'),
          subscriptionPlan: response.user.subscriptionPlan,
          subscriptionExpiry: response.user.subscriptionExpiry,
          avatar: response.user.profilePicture || googleUserInfo.picture,
          picture: response.user.profilePicture || googleUserInfo.picture,
          createdAt: response.user.createdAt,
          timezone: 'Asia/Kolkata',
          language: 'en',
          isAuthenticated: true,
          authProvider: 'google'
        };

        console.log('Setting Google user with token:', user.email);
        setUserWithAuth(user, response.token);
        // Set tokenExpiry so the fast-path local check works on next page load
        localStorage.setItem('tokenExpiry', (Date.now() + 86400000).toString());
      } else {
        console.error('Google auth failed - invalid response:', response);
        throw new Error('Google authentication failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Google auth error details:', error);

      // Clear Google auth state
      googleAuthService.logout();

      // Throw a user-friendly error
      if (error.message.includes('503') || error.code === 'NETWORK_ERROR') {
        throw new Error('Server is currently unavailable. Please try again later.');
      } else {
        throw new Error('Google authentication failed. Please ensure you have the correct permissions and try again.');
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('=== Login attempt ===');
      console.log('Email:', email);
      console.log('API URL:', process.env.REACT_APP_API_URL);

      const response = await api.login({ email, password });

      console.log('Login response:', response);

      if (response.success && response.user && response.token) {
        const user: User = {
          id: response.user.id,
          name: `${response.user.firstName} ${response.user.lastName}`.trim() || response.user.email.split('@')[0],
          email: response.user.email,
          plan: normalizePlanName(response.user.subscriptionPlan || 'FREE'),
          subscriptionPlan: response.user.subscriptionPlan,
          subscriptionExpiry: response.user.subscriptionExpiry,
          avatar: response.user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(response.user.firstName || response.user.email.split('@')[0])}&background=3b82f6&color=fff`,
          createdAt: response.user.createdAt,
          timezone: 'Asia/Kolkata',
          language: 'en',
          isAuthenticated: true,
          authProvider: 'email'
        };

        console.log('Setting user with token:', user.email);
        setUserWithAuth(user, response.token);

        // Set up token expiry tracking and session management
        localStorage.setItem('tokenExpiry', (Date.now() + 86400000).toString());
        startSessionManagement();
      } else {
        console.error('Login failed - invalid response:', response);
        throw new Error(response.message || 'Login failed - invalid credentials');
      }
    } catch (error: any) {
      console.error('Login error details:', error);

      // Handle different types of errors
      if (error.code === 'NETWORK_ERROR' || error.message.includes('503')) {
        throw new Error('Server is currently unavailable. Please try again later.');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid email or password. Please check your credentials.');
      } else if (error.response?.status === 404) {
        throw new Error('User not found. Please check your email or sign up.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error(error.message || 'Login failed. Please try again.');
      }
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const nameParts = name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const response = await api.signup({
        email,
        password,
        firstName,
        lastName
      });

      if (response.success && response.user) {
        const user: User = {
          id: response.user.id,
          name: `${response.user.firstName} ${response.user.lastName}`.trim() || response.user.email.split('@')[0],
          email: response.user.email,
          plan: normalizePlanName(response.user.subscriptionPlan || 'FREE'),
          subscriptionPlan: response.user.subscriptionPlan,
          subscriptionExpiry: response.user.subscriptionExpiry || undefined,
          avatar: response.user.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(response.user.firstName || response.user.email.split('@')[0])}&background=3b82f6&color=fff`,
          createdAt: response.user.createdAt,
          timezone: 'Asia/Kolkata',
          language: 'en',
          isAuthenticated: true,
          authProvider: 'email'
        };

        setUserWithAuth(user, response.token);

        // Set up token expiry tracking and session management
        localStorage.setItem('tokenExpiry', (Date.now() + 86400000).toString());
        startSessionManagement();
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.response?.data?.message || error.message || 'Signup failed');
    }
  };

  const loginWithGoogle = async () => {
    try {
      console.log('Initiating Google OAuth flow directly...');
      // Initiate Google OAuth flow directly without checking backend config
      // The backend config check endpoint /v1/auth/google/config does not exist
      googleAuthService.initiateAuth();
    } catch (error) {
      console.error('Google OAuth init error:', error);
      throw error;
    }
  };

  const logout = () => {
    setUserWithAuth(null);

    // Also logout from Google if authenticated via Google
    if (user?.authProvider === 'google') {
      googleAuthService.logout();
    }
  };

  const redirectAfterAuth = () => {
    // This will be called by components that have access to navigate
    window.location.href = '/dashboard';
  };

  // Session management functions - TEMPORARILY DISABLED DUE TO BACKEND ISSUES
  const startSessionManagement = () => {
    console.log('⚠️ Session management temporarily disabled due to backend connectivity issues');

    // Clear any existing intervals
    if (window.authIntervals) {
      window.authIntervals.forEach(clearInterval);
      window.authIntervals = [];
    }

    // TODO: Re-enable when backend is stable
    // For now, we'll rely on manual token validation only

    /* DISABLED - CAUSING TIMEOUTS
    // Proactive token refresh every 30 minutes
    const refreshInterval = setInterval(async () => {
      if (isAuthenticated) {
        try {
          const success = await api.proactiveTokenRefresh();
          if (!success) {
            console.warn('Proactive token refresh failed, user may be logged out soon');
          }
        } catch (error) {
          console.error('Proactive token refresh error:', error);
        }
      }
    }, 30 * 60 * 1000); // 30 minutes

    // Session heartbeat every 5 minutes
    const heartbeatInterval = setInterval(async () => {
      if (isAuthenticated) {
        try {
          const isValid = await api.sessionHeartbeat();
          if (!isValid) {
            console.warn('Session heartbeat failed, logging out user');
            logout();
          }
        } catch (error) {
          console.error('Session heartbeat error:', error);
        }
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Store intervals for cleanup
    window.authIntervals.push(refreshInterval, heartbeatInterval);
    */
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      setUser: setUserWithAuth,
      login,
      signup,
      loginWithGoogle,
      logout,
      isAuthenticated,
      isLoading,
      redirectAfterAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};