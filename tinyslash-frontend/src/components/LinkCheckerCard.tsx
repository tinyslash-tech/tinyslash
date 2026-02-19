import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ShieldCheck, ShieldAlert, Shield, ArrowRight, Loader2, Lock } from 'lucide-react';

export type CheckStatus = 'idle' | 'loading' | 'safe' | 'caution' | 'unsafe';

export interface CheckResult {
  simpleStatus: string;
  decision: {
    decision: string;
    reason?: string;
    message?: string;
  };
}

interface LinkCheckerCardProps {
  onClose?: () => void;
  isModal?: boolean;
}

const LinkCheckerCard: React.FC<LinkCheckerCardProps> = ({ onClose, isModal = false }) => {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<CheckStatus>('idle');
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    if (!url) return;

    let urlToCheck = url;
    if (!url.startsWith('http')) {
      urlToCheck = 'https://' + url;
    }

    setStatus('loading');
    setError('');
    setResult(null);

    try {
      const response = await fetch('http://localhost:8080/api/v1/urls/precheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlToCheck }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        setStatus(data.simpleStatus.toLowerCase() as CheckStatus);
      } else {
        setError(data.message || 'Failed to analyze URL');
        setStatus('idle');
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
      setStatus('idle');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCheck();
  };

  const reset = () => {
    setUrl('');
    setStatus('idle');
    setResult(null);
    setError('');
  };

  return (
    <div className={`relative w-full ${isModal ? 'max-w-lg' : 'max-w-2xl'} bg-white rounded-2xl shadow-2xl overflow-hidden`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            title="Close"
          >
            <X size={20} />
          </button>
        )}
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-2xl font-bold">Link Safety Check</h2>
        </div>
        <p className="text-blue-100">
          Verify if a link is safe before you open it. Powered by TinySlash Security Engine.
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        {status === 'idle' || status === 'loading' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Paste URL to check
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="e.g. google.com or tinyslash.com/example"
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  autoFocus
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={16} />
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <button
              onClick={handleCheck}
              disabled={status === 'loading' || !url}
              className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing...
                </>
              ) : (
                <>
                  Scan Link
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="text-center py-4">
            {status === 'safe' && (
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto"
                >
                  <ShieldCheck size={40} />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Safe to Open</h3>
                  <p className="text-gray-600">
                    We didn't find any security threats associated with this link.
                  </p>
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    onClick={reset}
                    className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Check Another
                  </button>
                  <a
                    href={url.startsWith('http') ? url : `https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                  >
                    Open Link
                  </a>
                </div>
              </div>
            )}

            {status === 'caution' && (
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto"
                >
                  <ShieldAlert size={40} />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Proceed with Caution</h3>
                  <p className="text-gray-600">
                    This link shows potential risks. Only open it if you trust the sender.
                  </p>
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    onClick={reset}
                    className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Check Another
                  </button>
                  <a
                    href={url.startsWith('http') ? url : `https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition-colors shadow-lg shadow-yellow-200"
                  >
                    Open Anyway
                  </a>
                </div>
              </div>
            )}

            {status === 'unsafe' && (
              <div className="space-y-4">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto"
                >
                  <Shield size={40} />
                </motion.div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">Unsafe / Malicious</h3>
                  <p className="text-gray-600 mb-2">
                    This link is identified as dangerous. It may be trying to steal your information.
                  </p>
                  <div className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-100">
                    Reason: {result?.decision.message || 'Security Risk Detected'}
                  </div>
                </div>
                <div className="pt-6">
                  <button
                    onClick={reset}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                  >
                    Back to Safety
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer trust badge */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
        <span>Analyzed by TinySlash Engine</span>
        <div className="flex items-center gap-1">
          <Lock size={10} />
          <span>Secure Check</span>
        </div>
      </div>
    </div>
  );
};

export default LinkCheckerCard;
