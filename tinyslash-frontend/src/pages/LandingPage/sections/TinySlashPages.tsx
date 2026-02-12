
import React from 'react';
import { motion } from 'framer-motion';
import {
  Check, ArrowRight, Instagram, Twitter, Youtube,
  FileImage, Users, Star, ChevronRight, TrendingUp
} from 'lucide-react';

interface TinySlashPagesProps {
  onSignupClick: () => void;
}

const TinySlashPages: React.FC<TinySlashPagesProps> = ({ onSignupClick }) => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1"
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-purple-100 text-purple-700 font-bold text-sm mb-6">
              NEW: TinySlash Pages
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              One link to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                rule them all.
              </span>
            </h2>
            <p className="text-xl text-gray-500 mb-8 leading-relaxed">
              Create a beautiful bio page for your social media. Share all your links, videos, and content in one place.
              No coding required.
            </p>

            <div className="space-y-6 mb-10">
              {[
                { title: "Fully Customizable", desc: "Choose from stunning themes or design your own to match your brand." },
                { title: "Track Everything", desc: "See which links are performing best with built-in analytics." },
                { title: "Collect Leads", desc: "Capture emails and phone numbers directly from your bio page." }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mt-1 shrink-0">
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{feature.title}</h4>
                    <p className="text-gray-500 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onSignupClick}
              className="px-8 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all hover:scale-105 shadow-lg flex items-center gap-2"
            >
              Create Your Page <ArrowRight size={20} />
            </button>
          </motion.div>

          {/* Right Visual - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="order-1 lg:order-2 relative flex justify-center lg:justify-end"
          >
            {/* Blobs behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-gradient-to-tr from-pink-200 to-purple-200 rounded-full blur-3xl opacity-50 -z-10 animate-pulse"></div>

            {/* Phone Frame */}
            <div className="relative w-[300px] h-[600px] bg-gray-900 rounded-[3rem] border-8 border-gray-900 shadow-2xl overflow-hidden ring-1 ring-gray-900/50">
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-7 w-40 mx-auto bg-gray-900 rounded-b-2xl z-20"></div>

              {/* Screen Content */}
              <div className="w-full h-full bg-white overflow-y-auto no-scrollbar relative flex flex-col">
                {/* Header/Banner Area */}
                <div className="h-32 bg-gradient-to-br from-pink-500 to-orange-400 w-full relative shrink-0">
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-200 shadow-sm overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80" alt="Profile" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>

                {/* Profile Info */}
                <div className="mt-12 text-center px-6 pb-2 shrink-0">
                  <h3 className="font-bold text-lg text-gray-900">Sarah Creator</h3>
                  <p className="text-gray-500 text-sm">@sarahcreates • Digital Artist & Vlogger</p>
                  <div className="flex justify-center gap-3 mt-4 text-gray-400">
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 hover:text-pink-600 transition-colors"><Instagram size={16} /></div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 hover:text-blue-500 transition-colors"><Twitter size={16} /></div>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 hover:text-red-600 transition-colors"><Youtube size={16} /></div>
                  </div>
                </div>

                {/* Links List */}
                <div className="px-5 py-6 space-y-3 flex-1">
                  {[
                    { text: "My Latest YouTube Video", icon: <Youtube size={16} className="text-red-500" /> },
                    { text: "Shop My Digital Art", icon: <FileImage size={16} className="text-purple-500" /> },
                    { text: "Join my Discord Server", icon: <Users size={16} className="text-indigo-500" /> },
                    { text: "Support me on Patreon", icon: <Star size={16} className="text-orange-500" /> },
                  ].map((link, i) => (
                    <div key={i} className="flex items-center p-3 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 hover:border-gray-200 transition-all cursor-pointer group hover:scale-[1.02] shadow-sm">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-gray-600 shrink-0">
                        {link.icon}
                      </div>
                      <span className="ml-3 text-sm font-semibold text-gray-700 flex-1">{link.text}</span>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500" />
                    </div>
                  ))}
                </div>

                {/* Footer Branding */}
                <div className="pb-6 text-center">
                  <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Powered by TinySlash</span>
                </div>
              </div>
            </div>

            {/* Floating UI Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-4 top-1/4 bg-white p-4 rounded-xl shadow-xl border border-gray-100 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <TrendingUp size={20} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Click Rate</div>
                  <div className="text-lg font-bold text-gray-900">42.5%</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -right-8 bottom-1/4 bg-white p-4 rounded-xl shadow-xl border border-gray-100 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                  <FileImage size={20} />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">Theme</div>
                  <div className="text-lg font-bold text-gray-900">Custom</div>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TinySlashPages;
