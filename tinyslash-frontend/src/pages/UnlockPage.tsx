import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Lock, Smartphone, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

const UnlockPage = () => {
  const { shortCode } = useParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Form State
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');

  // Mock Config (This would come from API in real implementation)
  const config = {
    type: 'BOTH', // WHATSAPP, EMAIL, BOTH
    message: 'Unlock this exclusive content by verifying your details.',
    otpEnabled: true
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API verification
    setTimeout(() => {
      setLoading(false);
      if (config.otpEnabled) {
        setStep(2);
      } else {
        alert("Redirecting to content...");
      }
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      alert('OTP Verified! Redirecting...');
      // Logic to set cookie and redirect to original URL
    }, 1500);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center text-white">
          <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Content Locked</h1>
          <p className="text-blue-100 mt-2 text-sm">{config.message}</p>
        </div>

        {/* Body */}
        <div className="p-8">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {(config.type === 'WHATSAPP' || config.type === 'BOTH') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center border-r border-gray-300 pr-2">
                      <span className="text-gray-500 text-sm">🇮🇳 +91</span>
                    </div>
                    <input
                      type="tel"
                      className="w-full pl-20 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="98765 43210"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      required
                    />
                    <Smartphone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              )}

              {(config.type === 'EMAIL' || config.type === 'BOTH') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <span>Unlock Content</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fadeIn">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Verify OTP</h3>
                <p className="text-sm text-gray-500">Enter the code sent to your {config.type === 'WHATSAPP' ? 'WhatsApp' : 'Inbox'}</p>
              </div>

              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4].map((_, i) => (
                  <input key={i} type="text" maxLength={1} className="w-12 h-12 text-center text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
                ))}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all"
              >
                {loading ? 'Checking...' : 'Verify & Access'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <div className="flex items-center justify-center text-xs text-gray-400 space-x-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Powered by Tinyslash. Your data is secure.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnlockPage;
