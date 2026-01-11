import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';
import { SEO } from '../components/SEO';

const FaqItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all duration-200 hover:shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
      >
        <span className="font-semibold text-gray-900 text-lg">{question}</span>
        <span className={`p-2 rounded-full transition-colors ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
          {isOpen ? <Minus size={20} /> : <Plus size={20} />}
        </span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-6 text-gray-600 leading-relaxed">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ: React.FC = () => {
  const faqs = [
    {
      q: "Is there a free plan available?",
      a: "Yes! Our Free forever plan includes 500 active links, basic analytics, and unlimited clicks. It's perfect for individuals and hobbyists getting started."
    },
    {
      q: "How does the custom domain feature work?",
      a: "With our Pro and Business plans, you can connect your own domain (e.g., link.yourbrand.com) instead of using tinyslash.com. This builds trust and increases click-through rates by up to 34%."
    },
    {
      q: "Can I change the destination of a short link?",
      a: "Absolutely. All links created on TinySlash are dynamic. You can update the destination URL at any time from your dashboard without changing the short link itself."
    },
    {
      q: "Are the QR codes static or dynamic?",
      a: "All QR codes generated on TinySlash are dynamic. This means you can track scans, change the destination URL, and customize the design even after printing them."
    },
    {
      q: "What kind of analytics do I get?",
      a: "Our advanced analytics dashboard provides real-time data on clicks/scans, geographic location (country/city), referring sites, device types, and browsers. You can export this data for deeper analysis."
    },
    {
      q: "Is my data secure?",
      a: "Security is our top priority. We use enterprise-grade encryption for all data, offer 2FA for accounts, and ensure 99.9% uptime for your links. We are fully GDPR and CCPA compliant."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        fullTitle="Frequently Asked Questions – TinySlash"
        description="Find answers to common questions about TinySlash URL shortener, QR codes, pricing, and features."
      />
      <PublicHeader />

      <main className="pt-32 pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-500">
              Have questions? We're here to help.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FaqItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
