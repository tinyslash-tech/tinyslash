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
  const [otpInput, setOtpInput] = useState('');

  // Mock Config (This would come from API in real implementation)
  const config = {
    type: 'BOTH', // WHATSAPP, EMAIL, BOTH
    message: 'Unlock this exclusive content by verifying your details.',
    otpEnabled: true
  };

  // Use process.env.REACT_APP_API_URL or default to localhost
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const body = {
        leadType: config.type,
        whatsapp: whatsapp || undefined,
        email: email || undefined
      };

      // Call Init Endpoint
      // Check if OTP enabled in config (frontend knows config or fetches it?)
      // Ideally we fetch config first. For now we assume config is known or partially mocked.
      // But initiateUnlock handles OTP generation.

      if (config.otpEnabled) {
        const res = await fetch(`${API_BASE}/v1/leads/unlock/${shortCode}/init`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (!res.ok) throw new Error("Failed to send verify");
        setStep(2);
      } else {
        // Direct Verify (No OTP)
        const verifyRes = await fetch(`${API_BASE}/v1/leads/unlock/${shortCode}/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...body, otp: null }) // No OTP
        });
        const data = await verifyRes.json();
        if (data.redirectUrl) {
          // Set cookie
          document.cookie = `${data.token}=true; path=/; max-age=86400`;
          window.location.href = data.redirectUrl;
        }
      }
    } catch (err) {
      alert('Error: ' + err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Collect OTP from inputs (simplified for now to single input or prompt)
    // For UI simplicity let's assume '1234' or user entered value.
    // We need a state for OTP.

    try {
      const body = {
        whatsapp: whatsapp || undefined,
        email: email || undefined,
        otp: otpInput
      };

      const res = await fetch(`${API_BASE}/v1/leads/unlock/${shortCode}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (res.ok && data.redirectUrl) {
        // Set cookie
        document.cookie = `${data.token}=true; path=/; max-age=86400`;
        window.location.href = data.redirectUrl;
      } else {
        alert("Invalid OTP");
      }
    } catch (err) {
      alert("Verification failed");
    } finally {
      setLoading(false);
    }
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
                className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-all flex items-center justify-center space-x-2"
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
                <input
                  type="text"
                  maxLength={4}
                  placeholder="1 2 3 4"
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  className="w-32 h-12 text-center text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 tracking-widest"
                />
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
