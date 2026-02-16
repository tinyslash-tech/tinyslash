import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Lock, AlertCircle } from 'lucide-react';

import { SmartLinkPreview } from '../components/dashboard/CreateSection/types';
import { SEO } from '../components/SEO';

const RedirectPage: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState('');
  const [smartPreviewData, setSmartPreviewData] = useState<SmartLinkPreview | null>(null);
  const [targetUrl, setTargetUrl] = useState('');

  useEffect(() => {
    if (shortCode) {
      handleRedirect();
    }
  }, [shortCode]);

  const handleRedirect = async (passwordInput?: string) => {
    try {
      setLoading(true);
      setError(null);

      // Use relative URL in production to prevent backend URL exposure
      const API_BASE_URL = process.env.REACT_APP_API_URL || (process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:8080/api');

      // Determine the type of redirect based on shortCode pattern
      let endpoint = '';
      if (shortCode?.startsWith('file_')) {
        endpoint = `/v1/files/${shortCode}/redirect`;
      } else if (shortCode?.startsWith('qr_')) {
        endpoint = `/v1/qr/${shortCode}/redirect`;
      } else {
        endpoint = `/v1/urls/${shortCode}/redirect`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: passwordInput || undefined,
          userAgent: navigator.userAgent,
          referrer: document.referrer,
        }),
      });

      if (response.status === 401) {
        // Password required
        setPasswordRequired(true);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        if (response.status === 404) {
          setError('Link not found or has expired');
        } else if (response.status === 403) {
          setError('Access denied. Please check your password.');
        } else {
          setError('An error occurred while processing your request');
        }
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success && data.data) {
        // Handle different types of redirects
        if (data.data.originalUrl) {
          // URL redirect
          let finalUrl = data.data.originalUrl;

          // Helper to ensure protocol
          if (!/^https?:\/\//i.test(finalUrl)) {
            finalUrl = 'https://' + finalUrl;
          }

          // Prevent self-redirect loop
          if (finalUrl === window.location.href || finalUrl === window.location.href.replace(/\/$/, '')) {
            setError('Redirect loop detected. Destination cannot be the same as source.');
            setLoading(false);
            return;
          }

          // Check for Smart Link Preview Data
          const smartPreview = data.data.smartLinkPreview;
          if (smartPreview && smartPreview.enabled) {
            setSmartPreviewData(smartPreview);
            setTargetUrl(finalUrl);
            setLoading(false);
            // Auto redirect after 3s if not clicked
            setTimeout(() => {
              window.location.href = finalUrl;
            }, 3000);
            return;
          }

          setTimeout(() => {
            window.location.href = finalUrl;
          }, 1000);
        } else if (data.data.fileUrl || data.data.downloadUrl) {
          // Navigate to File Preview Page
          window.location.replace(`/file/${data.data.fileCode || shortCode}`);
        } else if (data.data.content) {
          // QR code content redirect
          setTimeout(() => {
            let finalContent = data.data.content;
            // Attempt to redirect if it looks like a URL
            if (/^https?:\/\//i.test(finalContent) || /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/.test(finalContent)) {
              if (!/^https?:\/\//i.test(finalContent)) {
                finalContent = 'https://' + finalContent;
              }
              window.location.href = finalContent;
            } else {
              // It's just text, maybe show it? For now, standard behavior
              window.location.href = data.data.content;
            }
          }, 1000);
        } else {
          setError('Invalid link or unable to redirect');
          setLoading(false);
        }
      } else {
        setError('Invalid link or unable to redirect');
        setLoading(false);
      }
    } catch (err) {
      console.error('Redirect error:', err);
      setError('An error occurred while processing your request');
      setLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      handleRedirect(password);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Redirecting...</h2>
          <p className="text-gray-600">Please wait while we redirect you to your destination</p>
        </div>
      </div>
    );
  }

  if (smartPreviewData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <SEO
          title={smartPreviewData.title}
          description={smartPreviewData.description}
          image={smartPreviewData.image}
          noindex={true}
        />
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
          {smartPreviewData.image && (
            <div className="w-full h-48 sm:h-64 bg-gray-100 relative">
              <img
                src={smartPreviewData.image}
                alt={smartPreviewData.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6 sm:p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">{smartPreviewData.title || 'Redirecting...'}</h1>
            <p className="text-gray-600 mb-8">{smartPreviewData.description || 'You are being redirected to your destination.'}</p>

            <button
              onClick={() => window.location.href = targetUrl}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 transform hover:-translate-y-0.5"
            >
              Continue to Site
            </button>
            <div className="mt-4 text-xs text-gray-400">
              Auto-redirecting in 3 seconds...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (passwordRequired) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-6">
            <Lock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Password Required</h2>
            <p className="text-gray-600">This link is password protected. Please enter the password to continue.</p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Verifying...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-black text-white py-2 px-6 rounded-lg hover:bg-gray-800 font-medium"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default RedirectPage;