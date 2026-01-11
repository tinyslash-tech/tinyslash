import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, BookOpen, Users } from 'lucide-react';
import PublicHeader from '../../components/PublicHeader';
import Footer from '../../components/Footer';
import { SEO } from '../../components/SEO';

const CustomerSupport: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        fullTitle="Link Solution for Customer Support Teams – TinySlash"
        description="Streamline customer support with easy-to-share short links for help articles, documentation, and resources."
      />
      <PublicHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Faster Resolutions <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                Happy Customers
              </span>
            </h1>
            <p className="text-xl text-gray-500 mb-8">
              Empower your support team with quick, reliable, and trackable links to knowledge base articles and solutions.
            </p>
            <Link to="/signup" className="inline-block bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-transform hover:scale-105">
              Equip Your Team
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Quick Responses</h3>
              <p className="text-gray-600">Shorten long help desk URLs into tidy links that are easy to share in chats, emails, or SMS.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Knowledge Base</h3>
              <p className="text-gray-600">Direct customers exactly where they need to go with deep links to specific sections of your documentation.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-xl flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Team Collaboration</h3>
              <p className="text-gray-600">Share standard response links across your team to ensure consistency and up-to-date information.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CustomerSupport;
