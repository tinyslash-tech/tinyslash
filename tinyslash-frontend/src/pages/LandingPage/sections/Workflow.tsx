
import React from 'react';
import { motion } from 'framer-motion';
import { Link as LinkIcon, TrendingUp, Layers } from 'lucide-react';

const Workflow: React.FC = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Designed for your workflow</h2>
            <p className="text-lg text-gray-500 mb-8">
              We've streamlined every step of the process so you can focus on sharing and growing.
            </p>

            <div className="space-y-8">
              {[
                { icon: <LinkIcon />, title: "Paste & Shorten", desc: "Just paste your long URL. We handle the rest instantly." },
                { icon: <TrendingUp />, title: "Share & Track", desc: "Share your link and watch the data roll in real-time." },
                { icon: <Layers />, title: "Manage & Scale", desc: "Organize links with tags, workspaces, and team roles." }
              ].map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-500">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute top-10 right-10 w-72 h-72 bg-purple-300 rounded-full blur-[80px] opacity-20"></div>
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-300 rounded-full blur-[80px] opacity-20"></div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-100"
            >
              {/* Mock UI for Dashboard Card */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-sm text-gray-500">Total Clicks</div>
                  <div className="text-3xl font-bold text-gray-900">24,592</div>
                </div>
                <div className="bg-green-50 text-green-600 px-2 py-1 rounded text-sm font-medium">+12.5%</div>
              </div>
              <div className="space-y-3">
                {[75, 40, 60, 85, 55, 70, 45].map((h, i) => (
                  <div key={i} className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${h}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className="h-full bg-blue-500 rounded-full"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between text-sm text-gray-400">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Workflow;
