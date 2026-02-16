
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Layout, Palette, BarChart3, Share2, Globe, Smartphone,
  Zap, CheckCircle, Users, Instagram, Youtube, Twitter,
  FileImage, Star, MousePointerClick, TrendingUp
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

const TinySlashPages: React.FC = () => {
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
        title="TinySlash Pages | Link in Bio Tool & Microsite Builder"
        description="Create stunning bio pages for your social media. Share all your links, videos, and content in one place with TinySlash Pages."

      />
      <PublicHeader />

      <main className="pt-32">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-bold mb-8">
                <Layout size={16} />
                <span>The Ultimate Link-in-Bio Solution</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                One Link to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                  Showcase Everything
                </span>
              </h1>
              <p className="text-xl text-gray-500 mb-10 leading-relaxed">
                Consolidate your digital presence. Share your videos, music, store, and social profiles with a single beautiful link.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleSignupPrompt}
                  className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-black transition-all hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                >
                  Create Your Page Free
                </button>
              </div>
            </motion.div>

            {/* Right Content - Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative flex justify-center lg:justify-end"
            >
              <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden ring-1 ring-gray-900/50 transform rotate-[-2deg] hover:rotate-0 transition-all duration-500">
                <div className="absolute top-0 inset-x-0 h-7 w-40 mx-auto bg-gray-900 rounded-b-2xl z-20"></div>
                <div className="w-full h-full bg-white overflow-y-auto no-scrollbar relative flex flex-col">
                  {/* Header */}
                  <div className="h-32 bg-gradient-to-br from-purple-500 to-pink-500 w-full relative shrink-0">
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                      <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-200 shadow-sm overflow-hidden">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" alt="Profile" className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </div>
                  {/* Profile */}
                  <div className="mt-12 text-center px-6 pb-2 shrink-0">
                    <h3 className="font-bold text-lg text-gray-900">Julia Designer</h3>
                    <p className="text-gray-500 text-sm">UI/UX Designer & Content Creator</p>
                    <div className="flex justify-center gap-3 mt-4 text-gray-400">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"><Instagram size={16} /></div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"><Twitter size={16} /></div>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"><Youtube size={16} /></div>
                    </div>
                  </div>
                  {/* Links */}
                  <div className="px-5 py-6 space-y-3 flex-1">
                    {[
                      { text: "My Design Portfolio", icon: <Palette size={16} className="text-purple-500" /> },
                      { text: "Latest YouTube Tutorial", icon: <Youtube size={16} className="text-red-500" /> },
                      { text: "Book a Consultation", icon: <Users size={16} className="text-blue-500" /> },
                    ].map((link, i) => (
                      <div key={i} className="flex items-center p-3 bg-gray-50 rounded-xl border border-gray-100 shadow-sm">
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-gray-600 shrink-0">{link.icon}</div>
                        <span className="ml-3 text-sm font-semibold text-gray-700 flex-1">{link.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="pb-6 text-center">
                    <span className="text-[10px] font-bold text-gray-300 uppercase">Powered by TinySlash</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Grid */}
        <FeatureSection
          title="Designed for Creators & Brands"
          description="Everything you need to build a high-converting bio page in minutes."
          className="bg-gray-50"
        >
          <FeatureCard
            icon={Palette}
            title="Fully Customizable"
            description="Choose from professionally designed themes or customize colors, fonts, and layouts to match your brand identity perfectly."
            colorClass="bg-purple-100 text-purple-600"
          />
          <FeatureCard
            icon={BarChart3}
            title="In-Depth Analytics"
            description="Track views, clicks, and CTR for every single link. Understand your audience with geolocation and device data."
            colorClass="bg-blue-100 text-blue-600"
          />
          <FeatureCard
            icon={Share2}
            title="Embed Anything"
            description="Don't just share links. Embed YouTube videos, Spotify tracks, Tweets, and more directly onto your page."
            colorClass="bg-green-100 text-green-600"
          />
        </FeatureSection>

        {/* Growth Features */}
        <FeatureSection
          title="Grow Your Audience"
          description="Tools built to convert followers into customers."
        >
          <FeatureCard
            icon={Users}
            title="Lead Capture"
            description="Collect emails and phone numbers directly from your bio page. Sync with your favorite CRM tools."
            colorClass="bg-orange-100 text-orange-600"
          />
          <FeatureCard
            icon={Globe}
            title="Custom Domain"
            description="Connect your own domain (e.g., links.yourname.com) for a fully branded experience that builds trust."
            colorClass="bg-pink-100 text-pink-600"
          />
          <FeatureCard
            icon={Zap}
            title="Retargeting"
            description="Add Facebook Pixel and Google Analytics to re-engage visitors who visited your bio page."
            colorClass="bg-yellow-100 text-yellow-600"
          />
        </FeatureSection>

        {/* CTA Section */}
        <div className="bg-gray-900 py-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]"></div>

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl font-bold text-white mb-6">Claim Your TinySlash Page</h2>
            <p className="text-xl text-gray-400 mb-10">
              Join thousands of creators who use TinySlash to share more.
            </p>
            <button
              onClick={handleSignupPrompt}
              className="bg-white text-gray-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              Get Started for Free
            </button>
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

export default TinySlashPages;
