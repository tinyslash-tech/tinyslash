import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3, Globe, Shield, Link as LinkIcon, Lock, Clock, CheckCircle,
  Rocket, Smartphone, MapPin, Users, Fingerprint, Eye, Zap, Search, Key, MousePointerClick, Edit3
} from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';
import { SEO } from '../components/SEO';
import AuthModal from '../components/AuthModal';

const FeatureSection = ({ title, description, children, className = "" }: { title: string, description: string, children: React.ReactNode, className?: string }) => (
  <div className={`py-24 ${className}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16 max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
        <p className="text-lg text-gray-500">{description}</p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {children}
      </div>
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, colorClass = "bg-blue-50 text-blue-600" }: { icon: any, title: string, description: string, colorClass?: string }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all text-left group"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${colorClass} group-hover:scale-110 transition-transform`}>
      <Icon size={28} />
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed font-medium text-sm">{description}</p>
  </motion.div>
);

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
        fullTitle="Advanced URL Shortener | Smart Routing & App Deep Linking | TinySlash"
        description="The smartest URL shortener for serious marketers. Features App Deep-Linking, Geo-Routing, Lead-Lock Access, and Trust Checks."
        keywords="app deep linking, geo routing, lead capture, secure links, verified links, smart url shortener"
      />
      <PublicHeader />

      <main className="pt-32">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-8">
                <Rocket size={16} />
                <span>New: TinySlash PreCheck® Technology</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                Links That Do More Than <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Just Redirect
                </span>
              </h1>
              <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed">
                Empower your links with App Deep-Linking, Geo-Routing, and Lead Generation layers.
                The only shortener built for maximizing conversion.
              </p>

              <div className="flex justify-center">
                <button
                  onClick={handleSignupPrompt}
                  className="bg-gray-900 text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-black transition-all hover:scale-105 shadow-xl"
                >
                  Get Started Free
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Smart Routing Section */}
        <FeatureSection
          title="Smart Routing Intelligence"
          description="Direct your traffic to the right place, every time. Optimize user experience based on device and location."
          className="bg-gray-50"
        >
          <FeatureCard
            icon={Smartphone}
            title="App Deep-Linking"
            description="Automatically open Amazon, Flipkart, YouTube, or your own app if installed. Fallback to web browser efficiently."
            colorClass="bg-purple-100 text-purple-600"
          />
          <FeatureCard
            icon={MapPin}
            title="Geo-Linguistic Routing"
            description="Route users to specific pages based on their country or state (e.g., Show Kannada page for Karnataka visitors)."
            colorClass="bg-green-100 text-green-600"
          />
          <FeatureCard
            icon={Globe}
            title="Device-Aware Targeting"
            description="Send iOS users to the App Store and Android users to Play Store from a single smart link."
            colorClass="bg-blue-100 text-blue-600"
          />
        </FeatureSection>

        {/* Growth & Lead Capture */}
        <FeatureSection
          title="Growth & Lead Capture"
          description="Turn anonymous clicks into identified leads. Capture data before you redirect."
        >
          <FeatureCard
            icon={Users}
            title="Lead-Lock Access"
            description="Gate your rigorous content. Require users to enter their Email or WhatsApp number to unlock the destination link."
            colorClass="bg-orange-100 text-orange-600"
          />
          <FeatureCard
            icon={Eye}
            title="Smart Link Previews"
            description="Customize exactly how your link looks on WhatsApp, Facebook, and Twitter/X. Increase click-through rates by 200%."
            colorClass="bg-pink-100 text-pink-600"
          />
          <FeatureCard
            icon={Zap}
            title="Retargeting Pixels"
            description="Add Meta Pixel, Google Analytics, or LinkedIn Insights to build custom audiences from everyone who clicks."
            colorClass="bg-yellow-100 text-yellow-600"
          />
        </FeatureSection>

        {/* Security & Trust */}
        <FeatureSection
          title="Trust & Safety Suite"
          description="Protect your brand reputation and your users with enterprise-grade security."
          className="bg-gray-900 text-white"
        >
          <div className="p-8 bg-gray-800 rounded-2xl border border-gray-700 shadow-lg hover:border-gray-600 transition-all text-left">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-green-500/20 text-green-400">
              <CheckCircle size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">TinySlash PreCheck®</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Every link is scanned in real-time against global blacklists. We block phishing, malware, and scam sites BEFORE verification.
            </p>
          </div>

          <div className="p-8 bg-gray-800 rounded-2xl border border-gray-700 shadow-lg hover:border-gray-600 transition-all text-left">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-blue-500/20 text-blue-400">
              <Shield size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Verified Trust Badge</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Show a verified checkmark and branded splash page. Let users know "This link is safe and verified by [Your Brand]".
            </p>
          </div>

          <div className="p-8 bg-gray-800 rounded-2xl border border-gray-700 shadow-lg hover:border-gray-600 transition-all text-left">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-red-500/20 text-red-400">
              <Lock size={28} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Scam Shield</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Our AI automatically flags and blocks suspicious redirection patterns to keep your audience safe.
            </p>
          </div>
        </FeatureSection>

        {/* Total Control & Branding (Core Features) */}
        <FeatureSection
          title="Total Control & Branding"
          description="Everything you need to manage your links with precision."
          className="bg-gray-50 from-gray-50 to-white bg-gradient-to-b"
        >
          <FeatureCard
            icon={Globe}
            title="Custom Domains"
            description="Connect your own domain (e.g., link.brand.com) to every link. Increase brand recognition and click trust instantly."
            colorClass="bg-indigo-100 text-indigo-600"
          />
          <FeatureCard
            icon={Edit3}
            title="Custom Aliases"
            description="Say goodbye to random characters. Create meaningful links like brand.com/winter-sale that are easy to remember."
            colorClass="bg-teal-100 text-teal-600"
          />
          <FeatureCard
            icon={Lock}
            title="Password Protection"
            description="Secure sensitive documents or offers. Require visitors to enter a password before accessing the destination."
            colorClass="bg-red-100 text-red-600"
          />
          <FeatureCard
            icon={Clock}
            title="Link Expiration"
            description="Set a specific date, time, or click count after which your link will automatically redirect to a fallback page."
            colorClass="bg-orange-100 text-orange-600"
          />
          <FeatureCard
            icon={MousePointerClick}
            title="Max Click Limits"
            description="Perfect for limited-time offers. Automatically disable a link after the first 50, 100, or any number of users."
            colorClass="bg-cyan-100 text-cyan-600"
          />
          <FeatureCard
            icon={Key}
            title="API Access"
            description="Developers love us. Create, manage, and analyze thousands of links programmatically with our robust API."
            colorClass="bg-slate-100 text-slate-800"
          />
        </FeatureSection>

        {/* PreCheck Notice */}
        <div className="bg-green-50 border-y border-green-100 py-4">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-3 text-center md:text-left">
            <Shield size={20} className="text-green-600" />
            <p className="text-green-800 font-medium text-sm">
              <strong className="font-bold">Safety First:</strong> TinySlash automatically scans all destinations to prevent scam links before creation.
            </p>
          </div>
        </div>

        <Footer />
      </main>

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
