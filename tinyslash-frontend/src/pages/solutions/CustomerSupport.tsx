import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageCircle, BarChart3, Shield, Clock, Headphones, Link2, ArrowRight } from 'lucide-react';
import PublicHeader from '../../components/PublicHeader';
import Footer from '../../components/Footer';
import { SEO } from '../../components/SEO';

const CustomerSupport: React.FC = () => {
  const fadeInUp = { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

  const features = [
    {
      icon: <MessageCircle size={24} />,
      color: 'bg-green-100 text-green-600',
      title: 'Clean Support Links for WhatsApp & Chat',
      how: 'When your support agent shares a help article, knowledge base URL, or order tracking link via WhatsApp or live chat, TinySlash turns the long URL into a clean short link. No broken links in chat bubbles. No link wrapping issues.',
      impact: 'Clean links feel more professional and are clicked 2× more than raw long URLs in chat. Fewer "why did the link not work?" tickets means faster resolution and happier customers.',
    },
    {
      icon: <BarChart3 size={24} />,
      color: 'bg-blue-100 text-blue-600',
      title: 'Track Which Help Articles Actually Help',
      how: 'Create a unique short link for each help article or FAQ you share. TinySlash tracks how many customers click that link. Filter by date range to see trends. Link to your knowledge base with tracked URLs.',
      impact: 'Identify your most clicked help articles and double down on quality there. Identify articles with zero clicks — they may be shared but never read, meaning your agents need to explain better.',
    },
    {
      icon: <Shield size={24} />,
      color: 'bg-purple-100 text-purple-600',
      title: 'Password-Protected Support Links',
      how: 'Share sensitive documents (invoices, personalised offer PDFs, returns labels) via password-protected TinySlash links. The customer gets the link, and the password is communicated separately over verified channels.',
      impact: 'Secure document sharing without email attachments or expensive document management tools. Reduces support email thread length and protects customer PII — critical for DPDP compliance in India.',
    },
    {
      icon: <Clock size={24} />,
      color: 'bg-orange-100 text-orange-600',
      title: 'Expiring Links for Time-Sensitive Offers',
      how: 'When a customer contacts support for a discount or a one-time resolution, create a link that expires in 24 or 48 hours. After expiry, the link shows a custom message — no landing on dead URLs.',
      impact: 'Prevents offer abuse. Customers cannot share "forever-valid" links in public groups. Support teams save hundreds of hours chasing misused discount codes per month.',
    },
    {
      icon: <Link2 size={24} />,
      color: 'bg-pink-100 text-pink-600',
      title: 'Direct-to-WhatsApp Support Links',
      how: 'Generate a pre-filled WhatsApp link (wa.me/91XXXXXXXXXX?text=...) shortened into a clean TinySlash URL. Share it on your website, emails, and social — one click opens WhatsApp with your number pre-filled.',
      impact: 'Reduce friction from customer curiosity to conversation. Every extra step between "I have a question" and talking to support loses 60% of customers. A single-click link removes all friction.',
    },
    {
      icon: <Headphones size={24} />,
      color: 'bg-red-100 text-red-600',
      title: 'QR Codes for In-Store Support',
      how: 'If you have a physical store, print a QR code on your receipt, packaging, or helpdesk counter. When scanned, it opens your support page, WhatsApp, or feedback form directly. TinySlash generates and tracks these QR codes.',
      impact: 'Bridge offline customers to your digital support channels instantly. Retailers using QR-to-WhatsApp report 3× more post-purchase queries resolved before they become negative reviews.',
    },
  ];

  const stats = [
    { value: '2×', label: 'More link clicks in chat' },
    { value: '3×', label: 'More queries resolved via QR' },
    { value: '60%', label: 'Customers lost per extra click' },
    { value: '0', label: 'Misused offer links with expiry' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        fullTitle="Customer Support Link Management & Tracking – TinySlash"
        description="Supercharge your customer support with clean short links, expiring offer URLs, WhatsApp deep links, and QR codes for in-store support. Built for Indian businesses."
      />
      <PublicHeader />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-green-50 via-white to-blue-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="initial" animate="animate" variants={fadeInUp}>
            <span className="inline-block bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">Customer Support Solution</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Support That Feels Fast,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                Secure, and Trustworthy
              </span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed">
              From WhatsApp support links to secure document sharing and expiring offer URLs — TinySlash helps your support team deliver a faster, safer, and more professional experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-transform hover:scale-105">
                Start Free <ArrowRight size={18} />
              </Link>
              <Link to="/pricing" className="inline-flex items-center gap-2 border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-full font-bold hover:bg-gray-900 hover:text-white transition-all">
                View Plans
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <div className="text-3xl font-bold text-white mb-1">{s.value}</div>
                <div className="text-gray-400 text-sm">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Tools Your Support Team Will Love</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Six features that reduce friction for customers and workload for your team.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div key={i} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <div className={`w-12 h-12 ${f.color} rounded-xl flex items-center justify-center mb-5`}>{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">How it works</p>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{f.how}</p>
                <p className="text-sm font-semibold text-green-600 uppercase tracking-wide mb-2">Business Impact</p>
                <p className="text-gray-700 text-sm leading-relaxed">{f.impact}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Make your support experience stand out</h2>
          <p className="text-green-100 text-lg mb-8">Join businesses across India using TinySlash to deliver faster, safer, and more professional customer support.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-colors">
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CustomerSupport;
