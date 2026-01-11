import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Share2, BarChart3, Globe } from 'lucide-react';
import PublicHeader from '../../components/PublicHeader';
import Footer from '../../components/Footer';
import { SEO } from '../../components/SEO';

const SocialMedia: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        fullTitle="Social Media URL Shortener & Link Management – TinySlash"
        description="Optimize your social media links with TinySlash. Track clicks, customize previews, and boost engagement on Instagram, Twitter, LinkedIn, and Facebook."
      />
      <PublicHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Supercharge Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Social Media Strategy
              </span>
            </h1>
            <p className="text-xl text-gray-500 mb-8">
              Transform your bio links and post URLs into powerful engagement tools. Track every click and optimize your content strategy.
            </p>
            <Link to="/signup" className="inline-block bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-transform hover:scale-105">
              Get Started for Free
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Share2 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Branded Links</h3>
              <p className="text-gray-600">Create recognizable short links (e.g., brand.social/post) that increase click-through rates by up to 34%.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <BarChart3 size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Audience Insights</h3>
              <p className="text-gray-600">Understand your followers better with detailed analytics on location, device, and time of engagement.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <Globe size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Cross-Platform Tracking</h3>
              <p className="text-gray-600">Manage all your links for Instagram, Twitter, LinkedIn, and YouTube from a single dashboard.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SocialMedia;
