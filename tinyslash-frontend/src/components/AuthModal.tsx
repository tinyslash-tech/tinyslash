import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Chrome, Github, Sparkles, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
  onSwitchMode: (mode: 'login' | 'signup') => void;
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, mode, onSwitchMode, onSuccess }) => {
  const { sendOtp, verifyOtp, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    otp: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Reset step when modal closes or mode switches
  React.useEffect(() => {
    if (!isOpen) {
      setStep('email');
      setFormData(prev => ({ ...prev, otp: '' }));
    }
  }, [isOpen, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      if (step === 'email') {
        // Step 1: Send OTP
        await sendOtp(formData.email);
        toast.success(`Login code sent to ${formData.email}`);
        setStep('otp');
      } else {
        // Step 2: Verify OTP
        if (formData.otp.length !== 6) {
          toast.error('Please enter a valid 6-digit code');
          setIsLoading(false);
          return;
        }
        await verifyOtp(formData.email, formData.otp);
        toast.success('Successfully authenticated!');
        onClose();
        navigate('/dashboard');
        if (onSuccess) onSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    try {
      // Debug: Log environment variables
      console.log('Google Client ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);
      console.log('All env vars:', process.env);

      if (!process.env.REACT_APP_GOOGLE_CLIENT_ID) {
        toast.error('Google OAuth is not configured. Please restart your development server.');
        console.error('REACT_APP_GOOGLE_CLIENT_ID is not set');
        return;
      }

      setIsLoading(true);
      // Use the Google OAuth service to initiate authentication
      loginWithGoogle();
      onClose(); // Close modal as user will be redirected
    } catch (error) {
      setIsLoading(false);
      toast.error('Failed to initiate Google authentication');
      console.error('Google auth error:', error);
    }
  };

  const handleGithubAuth = async () => {
    try {
      setIsLoading(true);
      // Simulate GitHub OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock successful GitHub auth
      toast.success('Successfully signed in with GitHub!');
      setIsLoading(false);
      onClose();
      navigate('/dashboard');

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setIsLoading(false);
      toast.error('GitHub authentication failed');
      console.error('GitHub auth error:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-8"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <img src="/logo.webp" alt="Tinyslash Logo" className="w-full h-full object-contain" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-600">
                {mode === 'login'
                  ? 'Sign in to your account'
                  : 'Join thousands of users'
                }
              </p>
            </div>

            {/* Google Auth Button */}
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 mb-6"
            >
              <div className="w-5 h-5 mr-3">
                <svg viewBox="0 0 24 24" className="w-full h-full">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
              </div>
              <span className="font-medium text-gray-700">
                Continue with Google
              </span>
            </button>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            {/* Email / OTP Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {step === 'email' ? (
                <>
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Enter the 6-digit code sent to <br />
                    <strong className="text-gray-900">{formData.email}</strong>
                  </p>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Login Code
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    maxLength={6}
                    className="w-full px-3 py-3 text-center tracking-widest text-2xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all uppercase"
                    placeholder="------"
                    required
                  />
                  <div className="mt-4 text-sm text-gray-500">
                    <button type="button" onClick={() => setStep('email')} className="text-blue-600 hover:text-black">
                      Wrong email?
                    </button>
                    {" • "}
                    <button type="button" onClick={handleSubmit} disabled={isLoading} className="text-blue-600 hover:text-black">
                      Resend code
                    </button>
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-600" />
                    <span className="ml-2 text-sm text-gray-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm text-blue-600 hover:text-black font-medium">
                    Forgot password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {step === 'email' ? 'Sending Code...' : 'Verifying...'}
                  </div>
                ) : (
                  step === 'email' ? 'Continue with Email' : 'Verify & Sign In'
                )}
              </button>
            </form>

            {/* Switch Mode */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => onSwitchMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-blue-600 hover:text-black font-semibold transition-colors"
                >
                  {mode === 'login' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;