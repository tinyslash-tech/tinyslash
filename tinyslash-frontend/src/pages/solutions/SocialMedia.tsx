import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Share2, BarChart3, Globe, Zap, TrendingUp, Target, CheckCircle, ArrowRight } from 'lucide-react';
import PublicHeader from '../../components/PublicHeader';
import Footer from '../../components/Footer';
import { SEO } from '../../components/SEO';

const SocialMedia: React.FC = () => {
  const fadeInUp = { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

  const features = [
    {
      icon: <Share2 size={24} />,
      color: 'bg-blue-100 text-blue-600',
      title: 'Branded Bio Links',
      how: 'Replace long, ugly destination URLs with clean branded short links like tinyslash.com/yourname. Works perfectly in Instagram bio, Twitter/X bio, and LinkedIn.',
      impact: 'Branded links get up to 34% more clicks than generic URLs. Your audience trusts recognisable links — no more "too scared to click" drops.',
    },
    {
      icon: <BarChart3 size={24} />,
      color: 'bg-purple-100 text-purple-600',
      title: 'Click Analytics per Post',
      how: 'Every shortened link has its own analytics dashboard. See total clicks, unique visitors, geographic breakdown (city/state/country), device type (mobile vs desktop), and time-of-day patterns.',
      impact: 'Know exactly which post drove traffic, at what time, from which city. Stop guessing and start posting when your audience is actually online — most brands see 20–30% engagement lift.',
    },
    {
      icon: <Globe size={24} />,
      color: 'bg-green-100 text-green-600',
      title: 'Cross-Platform Dashboard',
      how: 'Manage links for Instagram, Twitter/X, LinkedIn, YouTube, and WhatsApp from one place. Tag links by platform. Filter analytics by source to compare channel performance.',
      impact: 'Instantly see which social channel brings real traffic. Reallocate content effort to the platform that actually converts — saves 5+ hours of manual reporting every month.',
    },
    {
      icon: <Target size={24} />,
      color: 'bg-orange-100 text-orange-600',
      title: 'UTM Campaign Tracking',
      how: 'Auto-append UTM parameters (source, medium, campaign, term, content) to every link. When a visitor clicks and lands on your site, Google Analytics or any analytics tool captures the full campaign context.',
      impact: 'Prove ROI on every campaign. Know exactly which post, which hashtag, and which call-to-action drove a paid conversion — essential for scaling what works.',
    },
    {
      icon: <Zap size={24} />,
      color: 'bg-yellow-100 text-yellow-600',
      title: 'QR Codes for Stories & Reels',
      how: 'Generate a branded QR code for any link in seconds. Download as PNG or SVG. Embed in Stories, Reels overlays, print materials, or packaging — QR codes are scannable without typing.',
      impact: 'Physical-to-digital traffic bridges: brands using QR codes in Stories see 2–3× more landing page visits compared to swipe-up link stickers alone.',
    },
    {
      icon: <TrendingUp size={24} />,
      color: 'bg-pink-100 text-pink-600',
      title: 'Link-in-Bio Page (TinySlash Pages)',
      how: 'Build a beautiful micro-landing page with multiple links, your profile photo, bio, and social icons — all hosted at one TinySlash URL. No website needed. Update anytime.',
      impact: 'Instead of one bio link pointing to your site, give every follower a curated mini-hub. Creators using link-in-bio pages report 4× more clicks distributed across their content vs a single link.',
    },
  ];

  const stats = [
    { value: '34%', label: 'Higher CTR with branded links' },
    { value: '4×', label: 'More clicks with link-in-bio pages' },
    { value: '5hrs', label: 'Saved per month on reporting' },
    { value: '2–3×', label: 'More visits via QR codes' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        fullTitle="Social Media URL Shortener & Link Management – TinySlash"
        description="Manage, brand, and track all your social media links in one place. Get click analytics per post, UTM tracking, and a link-in-bio page — built for Indian creators and brands."
      />
      <PublicHeader />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="initial" animate="animate" variants={fadeInUp}>
            <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">Social Media Solution</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Turn Your Social Links Into<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Measurable Growth Engines
              </span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed">
              Every post you share has a link. TinySlash makes those links branded, trackable, and optimised — so you know exactly what's working and can do more of it.
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
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything a Social Brand Needs</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Six features that work together to turn your social presence into measurable business results.</p>
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
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to grow smarter on social?</h2>
          <p className="text-blue-100 text-lg mb-8">Join thousands of Indian creators and brands already using TinySlash to track and optimise their social links.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-colors">
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SocialMedia;
