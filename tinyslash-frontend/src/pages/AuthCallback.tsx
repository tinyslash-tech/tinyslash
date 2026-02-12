
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { googleAuthService } from '../services/googleAuth';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

console.log('MODULE LOADED: AuthCallback.tsx (v2 - with debug logs)');

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  // Message state removed as requested

  // Use ref to prevent double execution in Strict Mode
  const processedRef = React.useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      // Prevent double execution
      if (processedRef.current) return;
      processedRef.current = true;

      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`OAuth error: ${error} `);
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        console.log('Starting auth code exchange...');
        try {
          console.log('Calling googleAuthService.handleCallback with code:', code.substring(0, 10) + '...');
          // Message updates removed

          // Handle the OAuth callback
          const authResponse = await googleAuthService.handleCallback(code);
          console.log('Auth response received:', authResponse);

          // Message updates removed

          // The response now contains both user info and tokens
          if (authResponse.user && authResponse.token) {
            console.log('Valid user and token found');
            // Store user info
            googleAuthService.storeUserInfo(authResponse.user);

            // Update auth context with the user data from backend
            const userData = {
              id: authResponse.user.id,
              name: `${authResponse.user.firstName} ${authResponse.user.lastName} `,
              email: authResponse.user.email,
              plan: authResponse.user.subscriptionPlan || 'free',
              avatar: authResponse.user.profilePicture,
              picture: authResponse.user.profilePicture,
              createdAt: authResponse.user.createdAt || new Date().toISOString(),
              timezone: 'Asia/Kolkata',
              language: 'en',
              isAuthenticated: true,
              authProvider: 'google' as 'google'
            };

            console.log('Setting user data:', userData);
            console.log('Setting token:', authResponse.token ? 'provided' : 'missing');

            // Store token first
            if (authResponse.token) {
              localStorage.setItem('token', authResponse.token);
            }

            // Set user with token
            setUser(userData, authResponse.token);

            setStatus('success');
            // Message updates removed

            toast.success('Successfully signed in with Google!');

            // Redirect immediately after setting user
            console.log('Redirecting to dashboard...');
            navigate('/dashboard', { replace: true });

          } else {
            throw new Error('Invalid response from authentication server - missing user or token');
          }

        } catch (error) {
          console.error('Auth callback error:', error);
          setStatus('error');

          let errorMessage = 'Authentication failed';
          if (error instanceof Error) {
            errorMessage = error.message;
          }

          // Add more specific error messages
          if (errorMessage.includes('503') || errorMessage.includes('Service unavailable')) {
            errorMessage = 'Server is currently unavailable. Please try again later.';
          } else if (errorMessage.includes('Failed to exchange code')) {
            errorMessage = 'Failed to verify with Google. Please check your internet connection and try again.';
          } else if (errorMessage.includes('Authentication failed')) {
            errorMessage = `Google authentication failed: ${errorMessage.replace('Authentication failed: ', '')}`;
          } else if (errorMessage.includes('Network')) {
            errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
          }

          // setMessage(errorMessage); // Removed to avoid showing text
          toast.error(errorMessage);

          // Redirect to home page after error
          setTimeout(() => {
            navigate('/', { replace: true });
          }, 8000); // Increased timeout to read error
        }
      } catch (error) { // This catch block was missing in the original code, causing the syntax error.
        console.error('Initial auth callback error:', error);
        setStatus('error');

        let errorMessage = 'Authentication failed';
        if (error instanceof Error) {
          errorMessage = error.message;
        }

        // Add more specific error messages
        if (errorMessage.includes('503') || errorMessage.includes('Service unavailable')) {
          errorMessage = 'Server is currently unavailable. Please try again later.';
        } else if (errorMessage.includes('Failed to exchange code')) {
          errorMessage = 'Failed to verify with Google. Please check your internet connection and try again.';
        } else if (errorMessage.includes('Authentication failed')) {
          errorMessage = `Google authentication failed: ${errorMessage.replace('Authentication failed: ', '')}`;
        } else if (errorMessage.includes('Network')) {
          errorMessage = 'Unable to connect to server. Please check your internet connection and try again.';
        }

        // setMessage(errorMessage); // Removed to avoid showing text
        toast.error(errorMessage);

        // Redirect to home page after error
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 8000); // Increased timeout to read error
      }
    };

    handleCallback();
  }, [searchParams, navigate, setUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          {status === 'loading' && (
            // Spinner removed
            null
          )}

          {status === 'success' && (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          )}

          {status === 'error' && (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {status === 'loading' && null}
          {status === 'success' && 'Welcome to Pebly!'}
          {status === 'error' && 'Authentication Failed'}
        </h2>

        {/* Message display removed */}

        {status === 'loading' && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-black rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        )}

        {status === 'error' && (
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;