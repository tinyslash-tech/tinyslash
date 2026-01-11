import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { QrCode, Paintbrush, Download, Edit3, Smartphone } from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';
import { SEO } from '../components/SEO';

const QrCodes: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        fullTitle="QR Code Generator for Links & Files – TinySlash"
        description="Create dynamic custom QR codes for your links and files. Change destinations anytime without reprinting."
      />
      <PublicHeader />

      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                QR Code Generator <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                  for Links & Files
                </span>
              </h1>
              <p className="text-xl text-gray-500 mb-8 leading-relaxed">
                Create dynamic QR codes that you can track, edit, and customize.
                Perfect for packaging, business cards, and digital displays.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup" className="bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-all text-center">
                  Create QR Code
                </Link>
                <Link to="/contact" className="px-8 py-4 rounded-full font-bold border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all text-center">
                  Contact Sales
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-2 gap-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                    <Edit3 size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Fully Dynamic</h3>
                    <p className="text-sm text-gray-500">Edit content anytime</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Paintbrush size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Custom Design</h3>
                    <p className="text-sm text-gray-500">Colors, logos & frames</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                    <Download size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">High Quality</h3>
                    <p className="text-sm text-gray-500">Vector SVG & PNG</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Track Scans</h3>
                    <p className="text-sm text-gray-500">Real-time analytics</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-200 to-blue-200 rounded-3xl blur-3xl opacity-30"></div>
              <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
                <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200 mb-6">
                  <QrCode size={160} className="text-gray-800" />
                </div>
                <div className="space-y-4">
                  <div className="h-2 bg-gray-100 rounded-full w-3/4"></div>
                  <div className="h-2 bg-gray-100 rounded-full w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default QrCodes;
