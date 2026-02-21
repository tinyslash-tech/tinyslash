import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Lock, AlertCircle } from 'lucide-react';
import { ThreeDotsLoader } from '../components/ui/ThreeDotsLoader';

import { SmartLinkPreview } from '../components/dashboard/CreateSection/types';
import { SEO } from '../components/SEO';

// Deep Link Utility
const getDeepLink = (url: string): string => {
  if (!url) return url;
  try {
    const u = new URL(url);
    const host = u.hostname.replace('www.', '').replace('m.', '');

    // Instagram
    if (host === 'instagram.com') {
      const path = u.pathname.replace(/^\//, '').replace(/\/$/, '');
      if (path) return `instagram://user?username=${path}`;
    }
    // WhatsApp
    if (host === 'whatsapp.com' || host === 'chat.whatsapp.com' || host === 'wa.me') {
      return `whatsapp://send?text=&phone=` + u.pathname.replace('/', '') || url;
    }
    // YouTube
    if (host === 'youtube.com' || host === 'youtu.be') {
      const videoId = u.searchParams.get('v') || u.pathname.replace('/', '');
      if (videoId) return `vnd.youtube://${videoId}`;
    }
    // Twitter / X
    if (host === 'twitter.com' || host === 'x.com') {
      return `twitter://user?screen_name=${u.pathname.replace('/', '')}`;
    }
    // LinkedIn
    if (host === 'linkedin.com') {
      return `linkedin://in/${u.pathname.split('/in/')[1] || ''}`;
    }
    // Facebook
    if (host === 'facebook.com' || host === 'fb.com') {
      return `fb://profile/${u.pathname.replace('/', '')}`;
    }
    // Telegram
    if (host === 't.me' || host === 'telegram.me') {
      return `tg://resolve?domain=${u.pathname.replace('/', '')}`;
    }
    // Amazon
    if (host.includes('amazon.')) {
      return `com.amazon.mobile.shopping://www.amazon.com${u.pathname}`;
    }
    // Flipkart
    if (host.includes('flipkart.com')) {
      return `flipkart://fk${u.pathname}`;
    }
  } catch {
    // Invalid URL
  }
  return url;
};

interface LeadLockConfig {
  enabled: boolean;
  leadType: 'WHATSAPP' | 'EMAIL' | 'BOTH';
  message?: string;
  otpEnabled?: boolean;
  askOnce?: boolean;
  redirectUrl?: string;
}

const RedirectPage: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState('');
  const [smartPreviewData, setSmartPreviewData] = useState<SmartLinkPreview | null>(null);
  const [targetUrl, setTargetUrl] = useState('');

  // Lead Lock State
  const [showLeadLock, setShowLeadLock] = useState(false);
  const [leadLockConfig, setLeadLockConfig] = useState<LeadLockConfig | null>(null);
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadOtp, setLeadOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);

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

          // Check for Geo Redirection
          const geoConfig = data.data.geoConfig;
          if (geoConfig && geoConfig.enabled && geoConfig.rules && geoConfig.rules.length > 0) {
            try {
              const userLang = navigator.language || (navigator.languages && navigator.languages[0]);
              if (userLang) {
                const countryCode = userLang.split('-')[1]; // e.g. "US" from "en-US"
                if (countryCode) {
                  const matchedRule = geoConfig.rules.find((r: any) => r.country === countryCode.toUpperCase());
                  if (matchedRule) {
                    console.log('🌍 Geo Redirect matched:', countryCode, '->', matchedRule.url);
                    finalUrl = matchedRule.url;
                    // Make sure it has protocol
                    if (!/^https?:\/\//i.test(finalUrl)) {
                      finalUrl = 'https://' + finalUrl;
                    }
                  }
                }
              }
            } catch (e) {
              console.error('Geo logic error', e);
            }
          }

          // Check for Lead Lock
          const leadLockConfig = data.data.leadLockConfig;
          if (leadLockConfig && leadLockConfig.enabled) {
            // Check if already captured (localStorage)
            const capturedKey = `tinyslash_lead_${shortCode}`;
            const isCaptured = localStorage.getItem(capturedKey);

            if (!isCaptured) {
              console.log('🔒 Lead Lock enabled');
              setLeadLockConfig(leadLockConfig);
              setShowLeadLock(true);
              setLoading(false);
              return;
            }
          }

          // Check for smart link preview
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

          // Check for Trust Badge / Verified Page
          const trustBadge = data.data.trustBadge;
          if (trustBadge && trustBadge.enabled) {
            console.log('🛡️ Trust Badge enabled, redirecting to verified page');
            window.location.replace(`/verified/${shortCode}`);
            return;
          }

          // Check for Deep Linking
          const deepLinkConfig = data.data.deepLinkConfig;
          if (deepLinkConfig && deepLinkConfig.enabled) {
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            if (isMobile) {
              const deepLink = getDeepLink(finalUrl);
              if (deepLink !== finalUrl) {
                console.log('📱 Deep Link detected:', deepLink);
                // Try to open the app
                window.location.href = deepLink;

                // Fallback to web URL if app doesn't open (after 2.5s)
                setTimeout(() => {
                  window.location.href = finalUrl;
                }, 2500);
                return;
              }
            }
          }

          setTimeout(() => {
            window.location.href = finalUrl;
          }, 1000);
        } else if (data.data.fileUrl || data.data.downloadUrl) {
          // Check for Trust Badge on file links
          const fileTrustBadge = data.data.trustBadge;
          if (fileTrustBadge && fileTrustBadge.enabled) {
            console.log('🛡️ Trust Badge enabled for file, redirecting to verified page');
            window.location.replace(`/verified/${shortCode}`);
            return;
          }
          // Navigate to File Preview Page
          window.location.replace(`/file/${data.data.fileCode || shortCode}`);
        } else if (data.data.content) {
          // Check for Trust Badge on QR code scans
          const qrTrustBadge = data.data.trustBadge;
          if (qrTrustBadge && qrTrustBadge.enabled) {
            console.log('🛡️ Trust Badge enabled for QR, redirecting to verified page');
            const code = data.data.shortCode || shortCode;
            window.location.replace(`/verified/${code}`);
            return;
          }
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

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadEmail && !leadPhone) {
      setError('Please provide your email or phone number');
      return;
    }

    setIsSubmittingLead(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'https://api.tinyslash.com/api'}/v1/leads/unlock/${shortCode}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: leadEmail,
          whatsapp: leadPhone,
          otp: leadOtp
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success
        localStorage.setItem(`tinyslash_lead_${shortCode}`, 'true');
        window.location.href = data.redirectUrl || targetUrl;
      } else {
        setError(data.error || 'Failed to verify. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please check your connection.');
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      handleRedirect(password);
    }
  };

  if (showLeadLock && leadLockConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <SEO title={leadLockConfig.message || "Content Locked"} />
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {leadLockConfig.message || "Unlock this Link"}
            </h2>
            <p className="text-gray-500 mb-8">
              Please enter your details to continue to the destination.
            </p>

            <form onSubmit={handleLeadSubmit} className="space-y-4 text-left">
              {(leadLockConfig.leadType === 'EMAIL' || leadLockConfig.leadType === 'BOTH') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              )}

              {(leadLockConfig.leadType === 'WHATSAPP' || leadLockConfig.leadType === 'BOTH') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                  <input
                    type="tel"
                    required={leadLockConfig.leadType === 'WHATSAPP'}
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmittingLead}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmittingLead ? (
                  <>
                    <ThreeDotsLoader size="sm" color="bg-white" />
                    Unlocking...
                  </>
                ) : (
                  'Unlock Link'
                )}
              </button>
            </form>

            <p className="mt-6 text-xs text-gray-400">
              Powered by TinySlash
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <ThreeDotsLoader size="lg" color="bg-blue-600" className="mb-5" />
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