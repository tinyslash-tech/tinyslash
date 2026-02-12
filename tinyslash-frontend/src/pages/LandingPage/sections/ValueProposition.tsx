
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, FileImage, Smartphone, Users, Link as LinkIcon, QrCode,
  Globe, BarChart3, Shield, TrendingUp
} from 'lucide-react';

const ValueProposition: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'individual' | 'business'>('individual');

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
            Built for everyone, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              scaled for business.
            </span>
          </h2>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            Whether you're sharing a single file or managing a global brand, we've got you covered.
          </p>

          {/* Toggle */}
          <div className="inline-flex bg-gray-100 p-1.5 rounded-full relative">
            <div className="relative z-10 flex">
              <button
                onClick={() => setActiveTab('individual')}
                className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${activeTab === 'individual' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                For Individuals
              </button>
              <button
                onClick={() => setActiveTab('business')}
                className={`px-8 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${activeTab === 'business' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                For Business
              </button>
            </div>
            <motion.div
              className="absolute top-1.5 bottom-1.5 bg-white rounded-full shadow-sm"
              initial={false}
              animate={{
                left: activeTab === 'individual' ? '6px' : '50%',
                width: activeTab === 'individual' ? 'calc(50% - 6px)' : 'calc(50% - 6px)',
                x: activeTab === 'individual' ? 0 : 0
              }}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          </div>
        </div>

        <div className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'individual' ? (
              <motion.div
                key="individual"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
                <div className="order-2 lg:order-1 space-y-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 shrink-0">
                      <Zap size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Sharing</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Create short links and QR codes in seconds. No complex setup, just paste and share.
                        Perfect for social media bios and messages.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                      <FileImage size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">File Sharing Made Easy</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Upload images or documents and get a link instantly. Share portfolios, receipts, or memes without clutter.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                      <Smartphone size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Mobile Friendly</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Manage everything from your phone. Our responsive dashboard helps you track clicks on the go.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-orange-200 to-pink-200 rounded-[2rem] blur-3xl opacity-30"></div>
                  <div className="relative bg-white rounded-[2rem] shadow-2xl border border-gray-100 p-8 overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                    {/* Mockup for Individual */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Users size={20} className="text-gray-500" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">Personal Dashboard</div>
                          <div className="text-xs text-gray-500">Free Plan</div>
                        </div>
                      </div>
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Active</div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                            <LinkIcon size={18} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">Portfolio Link</div>
                            <div className="text-xs text-blue-600">tinyslash.com/alex-design</div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-gray-900">1,240 clicks</div>
                      </div>
                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600">
                            <QrCode size={18} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">WiFi QR Code</div>
                            <div className="text-xs text-blue-600">tinyslash.com/qr/wifi-home</div>
                          </div>
                        </div>
                        <div className="text-sm font-bold text-gray-900">85 scans</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="business"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid lg:grid-cols-2 gap-12 items-center"
              >
                <div className="order-2 lg:order-1 space-y-8">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                      <Globe size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Custom Branded Domains</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Build trust with links that carry your brand name. Replace 'tinyslash.com' with 'link.yourbrand.com'.
                        Increases click-through rates by up to 34%.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                      <BarChart3 size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Advanced Analytics</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Understand your audience with detailed insights. Track location, device type, browser,
                        and referrers to optimize your campaigns.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                      <Shield size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Enterprise Security</h3>
                      <p className="text-gray-600 leading-relaxed">
                        Keep your data safe with password protection, link expiration, and SSO integration.
                        Designed for teams that prioritize security.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="order-1 lg:order-2 relative">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[2rem] blur-3xl opacity-20"></div>
                  <div className="relative bg-black rounded-[2rem] shadow-2xl border border-gray-800 p-8 overflow-hidden transform hover:scale-[1.02] transition-transform duration-500">
                    {/* Mockup for Business */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
                          <TrendingUp size={20} className="text-blue-400" />
                        </div>
                        <div>
                          <div className="font-bold text-white">Marketing Campaign Q4</div>
                          <div className="text-xs text-gray-400">Business Enterprise</div>
                        </div>
                      </div>
                      <div className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold">Live</div>
                    </div>
                    <div className="space-y-6">
                      {/* Chart Illustration */}
                      <div className="flex items-end justify-between h-32 gap-2 mb-2">
                        {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
                          <div key={i} className="w-full bg-gradient-to-t from-blue-600/20 to-purple-600/50 rounded-t-lg relative group">
                            <motion.div
                              initial={{ height: 0 }}
                              whileInView={{ height: `${h}%` }}
                              transition={{ duration: 1, delay: 0.1 * i }}
                              className="absolute bottom-0 w-full bg-gradient-to-t from-blue-600 to-purple-500 rounded-t-sm"
                            ></motion.div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 font-mono">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                      </div>

                      <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Globe size={16} className="text-blue-400" />
                          <span className="text-gray-300 text-sm font-mono">deals.acme-corp.com/black-friday</span>
                        </div>
                        <span className="text-green-400 text-xs font-bold flex items-center gap-1">
                          <TrendingUp size={12} /> +124%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;
