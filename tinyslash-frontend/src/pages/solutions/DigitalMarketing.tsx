import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, TrendingUp, Zap } from 'lucide-react';
import PublicHeader from '../../components/PublicHeader';
import Footer from '../../components/Footer';
import { SEO } from '../../components/SEO';

const DigitalMarketing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        fullTitle="Link Management for Digital Marketers – TinySlash"
        description="Enhance your digital marketing campaigns with trackable short links, pixel retargeting, and UTM parameter management."
      />
      <PublicHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Marketing Campaigns <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-teal-500">
                That Deliver Results
              </span>
            </h1>
            <p className="text-xl text-gray-500 mb-8">
              Maximize your ROI with advanced link tracking, A/B testing, and campaign management tools built for marketers.
            </p>
            <Link to="/signup" className="inline-block bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-transform hover:scale-105">
              Start Your Campaign
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-4">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Precise Targeting</h3>
              <p className="text-gray-600">Use device-based and geo-targeted redirection to ensure users land on the right page for them.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Campaign Analytics</h3>
              <p className="text-gray-600">Measure the performance of your email, SMS, and ad campaigns in real-time with granular data.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Conversion Tracking</h3>
              <p className="text-gray-600">Track user journeys from click to conversion, optimizing your spend for maximum impact.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DigitalMarketing;
