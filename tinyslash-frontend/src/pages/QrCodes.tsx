import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, Paintbrush, Download, Edit3, Smartphone, Zap, Monitor, Share2 } from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';
import { SEO } from '../components/SEO';
import AuthModal from '../components/AuthModal';

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
  >
    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
      <Icon size={24} />
    </div>
    <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
  </motion.div>
);

const QrCodes: React.FC = () => {
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
        fullTitle="Free Custom QR Code Generator | Dynamic QR Codes | TinySlash"
        description="Create dynamic, customizable QR codes with logo, colors, and frames. Track scans in real-time. Best free QR code generator for business."

      />
      <PublicHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                QR Code Generator <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  Designed for Business
                </span>
              </h1>
              <p className="text-xl text-gray-500 mb-8 leading-relaxed">
                Create dynamic QR codes that connect the physical world to your digital content.
                Track scans, edit destinations without reprinting, and customize to match your brand.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSignupPrompt}
                  className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all hover:scale-105 shadow-lg"
                >
                  Create QR Code Now
                </button>
              </div>

              <div className="mt-12 p-6 bg-gray-50 rounded-2xl border border-gray-100 inline-block">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="text-yellow-500" size={20} fill="currentColor" />
                  <span className="font-bold text-gray-900">Why Use Dynamic QR Codes?</span>
                </div>
                <p className="text-sm text-gray-600 max-w-md">
                  Dynamic QR codes allow you to change the destination URL anytime, even after you've printed the code.
                  Save money on reprinting and always keep your content fresh.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-green-200 to-blue-200 rounded-3xl blur-3xl opacity-30"></div>
              <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 p-8 transform hover:scale-[1.01] transition-transform duration-500">
                <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200 mb-8 relative overflow-hidden group">
                  <QrCode size={180} className="text-gray-800 z-10" />

                  {/* Decorative scan line */}
                  <motion.div
                    animate={{ top: ['5%', '90%', '5%'] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[80%] h-1 bg-red-500 blur-sm z-20 opacity-60"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                    <div className="text-xs text-gray-500 mb-1">Total Scans</div>
                    <div className="text-xl font-bold text-gray-900">12,450</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
                    <div className="text-xs text-gray-500 mb-1">Active Locations</div>
                    <div className="text-xl font-bold text-gray-900">14 Cities</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Unlock Powerful Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={Edit3}
                title="Fully Editable"
                description="Mistake in the URL? Changing your promotion? Edit the link destination instantly without reprinting the QR code."
              />
              <FeatureCard
                icon={Paintbrush}
                title="Custom Design"
                description="Add your logo, change colors, choose custom patterns and frames to make your QR code stand out."
              />
              <FeatureCard
                icon={Smartphone}
                title="Scan Analytics"
                description="Track how many people scan your code, where they are located, and what device they are using."
              />
              <FeatureCard
                icon={Download}
                title="High Quality"
                description="Download your QR codes in high-resolution PNG, SVG, PDF, or EPS formats for professional printing."
              />
              <FeatureCard
                icon={Monitor}
                title="Multi-Platform"
                description="Create QR codes for websites, WiFi, vCards, App Downloads, Social Media, and more."
              />
              <FeatureCard
                icon={Share2}
                title="Easy Sharing"
                description="Share your QR codes directly via email or social media from your dashboard."
              />
            </div>
          </div>

          <div className="bg-gray-900 rounded-3xl p-12 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-6">Ready to create your first QR Code?</h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-lg">
                Join thousands of businesses using TinySlash to bridge the offline and online worlds.
              </p>
              <button
                onClick={handleSignupPrompt}
                className="bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl"
              >
                Get Started for Free
              </button>
            </div>
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

export default QrCodes;
