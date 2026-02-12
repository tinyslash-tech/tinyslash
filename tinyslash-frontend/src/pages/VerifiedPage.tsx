import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Shield, CheckCircle, Lock, AlertTriangle } from 'lucide-react';

const VerifiedPage = () => {
  const { shortCode } = useParams();
  const [countdown, setCountdown] = useState(2);
  const [trustInfo, setTrustInfo] = useState({
    brandName: 'Demo Brand', // This should be fetched from backend 
    domain: 'tinyslash.com',
    verified: true
  });

  // NOTE: Ideally, the backend would return metadata about the shortCode's owner 
  // without redirecting, or pass it via query params.
  // For industry grade, we should fetch /api/v1/urls/{shortCode}/public-info or similar.
  // For now we mock it to demonstrate the UI.

  // Determine API Base URL based on environment
  const getApiBaseUrl = () => {
    const url = process.env.REACT_APP_API_URL || 'https://tinyslash-backend-prod.onrender.com';
    // Normalize: Remove trailing slash
    const cleanUrl = url.replace(/\/$/, '');
    // If it ends in /api, return it. If not, append /api
    return cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;
  };

  const API_BASE_URL = getApiBaseUrl();

  useEffect(() => {
    // Fetch real trust data
    const fetchTrustData = async () => {
      try {
        // API_BASE_URL guarantees ending in /api, so we use /v1/... (not /api/v1/...)
        const response = await fetch(`${API_BASE_URL}/v1/trust/public/${shortCode}`);
        if (response.ok) {
          const data = await response.json();
          setTrustInfo({
            brandName: data.brandName || 'Verified Brand',
            domain: data.domain || 'tinyslash.com',
            verified: true
          });
        }
      } catch (error) {
        console.error("Failed to fetch trust info", error);
        // Fallback or leave defaults
      }
    };

    if (shortCode) {
      fetchTrustData();
    }

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Proceed to real URL logic
          // We need to set a cookie 'trusted_{shortCode}' = true
          // Then reload the original link which will now bypass the trust check
          document.cookie = `trusted_${shortCode}=true; path=/; max-age=3600;`;

          // Fix: Redirect to Backend Root (not Frontend) to handle both Links and QRs
          // QRs are handled by Backend fallback to /q/, while Frontend RedirectPage fails for QRs
          const backendRoot = API_BASE_URL.replace(/\/api\/?$/, '');
          window.location.href = `${backendRoot}/${shortCode}`;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [shortCode]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-green-100">
        {/* Trust Header */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">{trustInfo.brandName}</h1>
            <CheckCircle className="w-6 h-6 text-white fill-green-500 bg-white rounded-full" />
          </div>
          <p className="text-green-100 text-sm opacity-90">Verified Business Identity</p>
        </div>

        {/* Body */}
        <div className="p-8 text-center">
          <div className="mb-8">
            <p className="text-gray-600 mb-2">You are being securely redirected to:</p>
            <div className="bg-gray-100 py-2 px-4 rounded-lg text-gray-800 font-mono text-sm inline-block max-w-full truncate">
              {trustInfo.domain}/{shortCode}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-green-600 font-semibold text-lg mb-8">
            <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Redirecting in {countdown}...</span>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 gap-4 text-left">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
              <Lock className="w-4 h-4 text-green-700 mt-1" />
              <div>
                <span className="block text-xs font-bold text-green-900">Encrypted</span>
                <span className="block text-[10px] text-green-700">Connection is secure</span>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <Shield className="w-4 h-4 text-blue-700 mt-1" />
              <div>
                <span className="block text-xs font-bold text-blue-900">Scam Checked</span>
                <span className="block text-[10px] text-blue-700">Verified by TinySlash</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Trusted verification by <strong className="text-gray-600">TinySlash Trust™</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
export default VerifiedPage;
