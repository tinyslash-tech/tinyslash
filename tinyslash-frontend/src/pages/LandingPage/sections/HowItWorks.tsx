
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Link as LinkIcon, Zap, BarChart3 } from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-gray-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How it works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in seconds. No complicated setup required.
          </p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 border-t-2 border-dashed border-gray-300 z-0"></div>

          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative z-10 flex flex-col items-center text-center group"
          >
            <Link to="/short-links" className="block group-hover:no-underline">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative mx-auto">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">1</div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <LinkIcon size={24} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Paste & Shorten</h3>
              <p className="text-gray-500 leading-relaxed">
                Enter your long URL into our shortener. We'll instantly generate a short, memorable link for you.
              </p>
            </Link>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative z-10 flex flex-col items-center text-center group"
          >
            <Link to="/qr-codes" className="block group-hover:no-underline">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative mx-auto">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">2</div>
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                  <Zap size={24} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Customize</h3>
              <p className="text-gray-500 leading-relaxed">
                Add a custom alias, set an expiration date, or password-protect your link for extra security.
              </p>
            </Link>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative z-10 flex flex-col items-center text-center group"
          >
            <Link to="/file-to-link" className="block group-hover:no-underline">
              <div className="w-24 h-24 bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative mx-auto">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">3</div>
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                  <BarChart3 size={24} />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Share & Track</h3>
              <p className="text-gray-500 leading-relaxed">
                Share your link anywhere and track clicks, locations, and devices in real-time.
              </p>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
