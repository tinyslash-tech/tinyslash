
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Globe, QrCode, FileImage, Check } from 'lucide-react';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything you need to grow</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Powerful features packaged in a beautiful interface. Designed for speed, security, and scale.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          {/* Main Feature - Analytics */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl p-8 text-white relative overflow-hidden group"
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Deep Analytics</h3>
              <p className="text-blue-100 max-w-md">
                Track clicks, geolocation, devices, and referrers in real-time.
                Visualize your data with beautiful interactive charts.
              </p>
            </div>
            <div className="absolute right-0 bottom-0 w-64 h-48 bg-white/5 rounded-tl-3xl translate-x-10 translate-y-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-500"></div>
          </motion.div>

          {/* Custom Domains */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gray-50 rounded-3xl p-8 border border-gray-100 relative overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6 text-orange-600">
              <Globe />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Custom Domains</h3>
            <p className="text-gray-500 text-sm">
              Connect your own domain to build brand trust and improve click-through rates.
            </p>
          </motion.div>

          {/* QR Codes */}
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-gray-50 rounded-3xl p-8 border border-gray-100 relative overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6 text-green-600">
              <QrCode />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart QR Codes</h3>
            <p className="text-gray-500 text-sm">
              Generate dynamic QR codes for any link. Customize colors, logos, and frames.
            </p>
          </motion.div>

          {/* File Sharing */}
          <motion.div
            whileHover={{ y: -5 }}
            className="md:col-span-2 bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden group"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center mb-6">
                  <FileImage className="text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">File-to-Link Sharing</h3>
                <p className="text-gray-400 max-w-sm">
                  Upload PDFs, images, or documents and instantly get a secure, shareable short link.
                </p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-red-400/20 flex items-center justify-center text-red-400"><FileImage size={16} /></div>
                  <div className="text-sm">
                    <div className="font-medium text-white">presentation_v2.pdf</div>
                    <div className="text-xs text-gray-400">2.4 MB</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-2 bg-black/40 rounded text-xs text-blue-300 font-mono">
                  <Check size={12} /> tinyslash.com/f/9xK2m
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Features;
