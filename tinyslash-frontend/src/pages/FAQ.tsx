import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Search, ShieldCheck, Zap, CreditCard, HelpCircle, Link as LinkIcon, QrCode, FileText, Layout } from 'lucide-react';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';
import { SEO } from '../components/SEO';
import { Link } from 'react-router-dom';

const FaqItem = ({ question, answer }: { question: string; answer: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden transition-all duration-200 hover:shadow-sm" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-900 text-lg pr-4" itemProp="name">{question}</span>
        <span className={`p-2 rounded-full transition-colors flex-shrink-0 ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
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
            itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"
          >
            <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-50 pt-4">
              <div itemProp="text">{answer}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQ: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All', icon: <HelpCircle size={18} /> },
    { id: 'shortlinks', name: 'Short Links', icon: <LinkIcon size={18} /> },
    { id: 'qr', name: 'QR Codes', icon: <QrCode size={18} /> },
    { id: 'files', name: 'File Sharing', icon: <FileText size={18} /> },
    { id: 'bio', name: 'Link-in-Bio Pages', icon: <Layout size={18} /> },
    { id: 'pricing', name: 'Pricing', icon: <CreditCard size={18} /> },
    { id: 'security', name: 'Security', icon: <ShieldCheck size={18} /> },
  ];

  const faqs = [
    // Short Links
    {
      category: 'shortlinks',
      q: "Can I change the destination of a short link?",
      a: "Absolutely. All links created on TinySlash are dynamic. You can update the destination URL at any time from your dashboard without changing the short link itself—perfect for fixing typos or updating outdated content."
    },
    {
      category: 'shortlinks',
      q: "Can I password-protect my links?",
      a: "Yes. Protection is available on Starter plans and above. You can add a password to any short link, ensuring only authorized people can access your content."
    },
    {
      category: 'shortlinks',
      q: "How does Link Expiration work?",
      a: "You can set links to expire automatically on a specific date or after a certain number of clicks. For example, you can create a link for a limited-time offer that expires after 48 hours. (Available on Starter+)."
    },
    {
      category: 'shortlinks',
      q: "How does the custom domain feature work?",
      a: <>With our Pro and Business plans, you can connect your own domain (e.g., <code>link.yourbrand.com</code>) instead of using tinyslash.com. This builds trust and increases click-through rates by up to 34%.</>
    },

    // QR Codes
    {
      category: 'qr',
      q: "What is a dynamic QR code generator?",
      a: "Dynamic QR codes allow you to change the destination URL behind the code without reprinting it. Unlike static QR codes, they also provide tracking statistics like scan count, location, and device type."
    },
    {
      category: 'qr',
      q: "Can I customize my QR codes?",
      a: "Yes! You can add your logo, change colors (gradients supported), adjust the eye shape, and add a 'Scan Me' frame. Our design studio allows you to create QR codes that match your brand perfectly."
    },
    {
      category: 'qr',
      q: "Do QR codes expire?",
      a: "As long as you have an active account, your QR codes will work. If you are on a free plan, they remain active forever unless you delete them."
    },

    // File Sharing
    {
      category: 'files',
      q: "Can I turn PDFs and images into links?",
      a: "Yes! Our 'File-to-Link' feature lets you upload documents (PDF, DOCX) and images (JPG, PNG) and converts them into a secure, shareable short link. The Free plan allows 5 uploads, Starter allows 100, and Pro allows Unlimited uploads."
    },
    {
      category: 'files',
      q: "How secure is file sharing with TinySlash?",
      a: "Extremely secure. All files are encrypted at rest. When you share a file link, you can add an extra layer of security by setting a password and an expiration date, ensuring your file doesn't stay online forever if you don't want it to."
    },

    // Link-in-Bio Pages
    {
      category: 'bio',
      q: "What is a 'Link-in-Bio' page?",
      a: "A Link-in-Bio page is a mini-website that houses all your important links (socials, products, videos). TinySlash lets you create these pages and host them on your own custom domain, giving you full control over your brand traffic."
    },
    {
      category: 'bio',
      q: "Can I customize my Link-in-Bio page?",
      a: "Yes, fully! You can choose from professional themes, add your own background images, change fonts, and reorganize buttons. Pro users can even remove the TinySlash branding for a completely white-label experience."
    },
    {
      category: 'bio',
      q: "How many links can I add to my page?",
      a: "Unlimited! Whether you're on the Free or Pro plan, you can add as many links, social icons, and video embeds as you need. There is no cap on the content of your bio page."
    },

    // Pricing
    {
      category: 'pricing',
      q: "Is there a free plan available?",
      a: "Yes! Our Free plan includes 500 active links, 5 custom QR codes, and 5 File-to-Link uploads. It includes unlimited clicks, making it perfect for individuals and small projects."
    },
    {
      category: 'pricing',
      q: "What is the difference between Free and Pro plans?",
      a: "The Free plan is great for basics (50 links, 5 files). The Pro plan removes all limits: Unlimited links, Unlimited QR codes, Unlimited File uploads, 5 Custom Domains, and Advanced Analytics. Pro is designed for growing businesses that need scale."
    },
    {
      category: 'pricing',
      q: "Is there a refund policy?",
      a: <>We offer a <strong>7-day money-back guarantee</strong> for all new Pro subscriptions. If you're not satisfied with the features, simply contact our support team, and we'll process your refund—no questions asked. <Link to="/cancellation-refund" className="text-blue-600 hover:underline">Read full policy</Link>.</>
    },

    // Security
    {
      category: 'security',
      q: "Is my data secure?",
      a: "Security is our top priority. We use enterprise-grade encryption (AES-256) for all data, offer Two-Factor Authentication (2FA) for accounts, and ensure 99.9% uptime. Our servers are hosted in secure data centers with 24/7 monitoring."
    },
    {
      category: 'security',
      q: "Are my payment details secure?",
      a: "Yes, 100%. We do not store any card details on our servers. All payments are processed via Razorpay, a PCI-DSS compliant payment gateway trusted by millions of businesses."
    },
    {
      category: 'security',
      q: "Do you sell my data?",
      a: "Never. Your data belongs to you. We strictly adhere to GDPR and CCPA guidelines and do not sell, rent, or trade user data to third-party advertisers. We make money from subscriptions, not from your privacy."
    },
    {
      category: 'security',
      q: "How does TinySlash protect against scam links?",
      a: "We use AI-powered threat detection to scan all URLs for phishing, malware, and spam in real-time. We also maintain a strict abuse policy to ensure our platform remains safe for everyone. Your audience is protected when they click your links."
    },
  ];

  const filteredFaqs = activeCategory === 'all'
    ? faqs
    : faqs.filter(f => f.category === activeCategory);

  // Generate Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": typeof faq.a === 'string' ? faq.a : "Visit our features page for more details."
      }
    }))
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SEO
        title="FAQ - TinySlash"
        fullTitle="TinySlash FAQ – URL Shortener & QR Code Questions"
        description="Frequently asked questions about TinySlash. Learn about free URL shortener, dynamic QR codes, file sharing, and custom domains."
        structuredData={structuredData}
      />
      <PublicHeader />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about shrinking links, tracking data, and growing your brand with TinySlash.
            </p>
          </div>

          {/* Search/Filter Tabs - CHIPS */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4 mb-20">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, i) => (
                <FaqItem key={i} question={faq.q} answer={faq.a} />
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                No questions found in this category.
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-center text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
              <p className="text-blue-100 mb-8 max-w-xl mx-auto text-lg">
                Can't find the answer you're looking for? Chat with our friendly team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact" className="px-8 py-3 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-colors shadow-lg">
                  Contact Support
                </Link>
                <Link to="/pricing" className="px-8 py-3 bg-blue-700 bg-opacity-30 border border-blue-400 text-white font-bold rounded-full hover:bg-opacity-40 transition-colors backdrop-blur-sm">
                  View Pricing
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
