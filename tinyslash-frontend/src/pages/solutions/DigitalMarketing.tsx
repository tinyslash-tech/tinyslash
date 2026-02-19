import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart3, Target, Mail, TrendingUp, Link2, Shield, ArrowRight } from 'lucide-react';
import PublicHeader from '../../components/PublicHeader';
import Footer from '../../components/Footer';
import { SEO } from '../../components/SEO';

const DigitalMarketing: React.FC = () => {
  const fadeInUp = { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

  const features = [
    {
      icon: <Target size={24} />,
      color: 'bg-orange-100 text-orange-600',
      title: 'UTM Campaign Tracking',
      how: 'Embed UTM parameters (source, medium, campaign, term, content) into every link you create. TinySlash auto-tags your links in one click. Downstream, Google Analytics/GA4, Mixpanel, or any tool captures the full attribution chain.',
      impact: 'Stop attributing conversions to "Direct / None". Know exactly which ad, email, or keyword drove a sale. Marketers using full UTM tracking report 40% faster budget decisions because data is clean from day one.',
    },
    {
      icon: <BarChart3 size={24} />,
      color: 'bg-blue-100 text-blue-600',
      title: 'Campaign Click Analytics',
      how: 'Each link has a real-time analytics dashboard: total clicks, unique clicks, click-through rate, city-level geo breakdown, device split (mobile/desktop/tablet), browser, and top referrers — updated live.',
      impact: 'Optimise mid-campaign. If your WhatsApp clicks are 5× higher than email on Tuesday, you know to push WhatsApp on that day. Live data = faster pivots = better ROAS.',
    },
    {
      icon: <Link2 size={24} />,
      color: 'bg-purple-100 text-purple-600',
      title: 'Branded Short Links',
      how: 'Create short links on your own custom domain (e.g., go.yourbrand.com/summer-sale) or use tinyslash.com/campaign. Branded links pass through your domain, reinforcing brand trust at every touchpoint.',
      impact: "Branded links see 39% higher CTR in email campaigns vs generic bit.ly/xyz links. Every click is also a brand impression — the link itself is marketing.",
    },
    {
      icon: <Mail size={24} />,
      color: 'bg-green-100 text-green-600',
      title: 'Email & WhatsApp Campaign Links',
      how: 'Generate one master campaign link, then share it across email newsletters, WhatsApp broadcasts, and SMS — each with UTM source tagging. The TinySlash dashboard aggregates all clicks under one campaign view.',
      impact: 'Compare email vs WhatsApp performance in one screen. Resell your best-performing channel to clients with a real dashboard screenshot — no more manual spreadsheet exports.',
    },
    {
      icon: <TrendingUp size={24} />,
      color: 'bg-pink-100 text-pink-600',
      title: 'Retargeting Pixel Integration',
      how: "Append Facebook Pixel, Google Tag IDs, or any script-based retargeting pixel to your short links. Anyone who clicks your TinySlash link enters your retargeting audience — even before they hit a landing page.",
      impact: 'Build warm retargeting audiences from every link click — not just from website visits. Your ad spend reaches people who\'ve already expressed intent by clicking, reducing cost- per - conversion significantly.',
    },
  {
    icon: <Shield size={24} />,
      color: 'bg-red-100 text-red-600',
        title: 'Password & Expiry Controls',
          how: 'Set links to expire after a date or a number of clicks. Add optional password protection for exclusive offers. Perfect for flash sales, early-access campaigns, and beta invitations.',
            impact: 'Create FOMO-driven campaigns with countdown links. Exclusive access links convert at 3–5× higher rates compared to open offers — scarcity is the most powerful marketing lever.',
    },
  ];

const stats = [
  { value: '40%', label: 'Faster budget decisions' },
  { value: '39%', label: 'Higher CTR with branded links' },
  { value: '3–5×', label: 'Higher conversion with exclusive links' },
  { value: '100%', label: 'Attribution clarity' },
];

return (
  <div className="min-h-screen bg-white">
    <SEO
      fullTitle="Digital Marketing URL Shortener & Campaign Tracking – TinySlash"
      description="Track every campaign click with UTM-tagged short links. Get real-time analytics on email, WhatsApp, and social ads. The complete link management tool for Indian digital marketers."
    />
    <PublicHeader />

    {/* Hero */}
    <section className="pt-32 pb-16 bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial="initial" animate="animate" variants={fadeInUp}>
          <span className="inline-block bg-orange-100 text-orange-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">Digital Marketing Solution</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Every Campaign Link That<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-blue-600">
              Proves Its Own ROI
            </span>
          </h1>
          <p className="text-xl text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed">
            Stop guessing which channel works. TinySlash tracks every click, tags every campaign, and gives you clean data to make confident marketing decisions — fast.
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
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Built For Data-Driven Marketers</h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">Six features that give you complete visibility and control over every campaign link you share.</p>
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
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-500 to-blue-600">
      <div className="max-w-3xl mx-auto text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to prove every rupee spent?</h2>
        <p className="text-orange-100 text-lg mb-8">Join thousands of Indian marketers who use TinySlash to track campaigns with confidence.</p>
        <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-orange-600 px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-colors">
          Get Started Free <ArrowRight size={18} />
        </Link>
      </div>
    </section>

    <Footer />
  </div>
);
};

export default DigitalMarketing;
