import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Link as LinkIcon, BarChart3, Globe, Zap, Shield } from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';
import LandingPageShortener from '../components/LandingPageShortener';
import { SEO } from '../components/SEO';
import AuthModal from '../components/AuthModal';

const ShortLinks: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const handleSignupPrompt = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO
        fullTitle="Short Link Generator with Analytics – TinySlash"
        description="Create branded, trackable short links with TinySlash. Perfect for social media, marketing, and business."
      />
      <PublicHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Short Link Generator <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                with Analytics
              </span>
            </h1>
            <p className="text-xl text-gray-500 mb-8">
              Transform long, ugly URLs into short, branded links that you can track and manage.
            </p>

            <LandingPageShortener onSignupPrompt={handleSignupPrompt} />
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-24">
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Real-time Analytics</h3>
              <p className="text-gray-600">Track clicks, geographic location, devices, and referrers instantly.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Custom Domains</h3>
              <p className="text-gray-600">Use your own domain (link.yourbrand.com) to build trust and authority.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Enterprise Security</h3>
              <p className="text-gray-600">Password protection, link expiration, and detailed access logs.</p>
            </div>
          </div>

          <div className="mt-20 text-center">
            <button
              onClick={handleSignupPrompt}
              className="inline-block bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-transform hover:scale-105"
            >
              Start Shortening for Free
            </button>
          </div>
        </div>
      </main>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default ShortLinks;
