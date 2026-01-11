import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileImage, Lock, Clock, Cloud, Share2 } from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';
import { SEO } from '../components/SEO';

const FileToLink: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        fullTitle="Secure File to Link Sharing with Password & Expiry – TinySlash"
        description="Share files securely with short links. Set passwords, expiration dates, and track downloads."
      />
      <PublicHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Secure File to Link <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
                Sharing Simplified
              </span>
            </h1>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed">
              Upload documents, images, and PDFs. Get a secure, trackable short link instantly.
            </p>
            <Link to="/signup" className="inline-block bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-transform hover:scale-105">
              Upload File
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                <Cloud size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Instant Upload</h3>
              <p className="text-gray-500 text-sm">Drag & drop files to generate links instantly. No signup required for basic use.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-4">
                <Lock size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Password Protection</h3>
              <p className="text-gray-500 text-sm">Secure your confidential files with strict password access controls.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Clock size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Expiration Dates</h3>
              <p className="text-gray-500 text-sm">Set links to self-destruct after a specific time or number of downloads.</p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Share2 size={24} />
              </div>
              <h3 className="text-lg font-bold mb-2">Easy Sharing</h3>
              <p className="text-gray-500 text-sm">Share via WhatsApp, Email, or Slack with a simple short link.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FileToLink;
