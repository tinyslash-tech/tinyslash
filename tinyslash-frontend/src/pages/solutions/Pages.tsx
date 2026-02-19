import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Layout, Smartphone, Edit3, Globe, BarChart3, Palette, ArrowRight } from 'lucide-react';
import PublicHeader from '../../components/PublicHeader';
import Footer from '../../components/Footer';
import { SEO } from '../../components/SEO';

const PagesSolution: React.FC = () => {
  const fadeInUp = { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

  const features = [
    {
      icon: <Layout size={24} />,
      color: 'bg-violet-100 text-violet-600',
      title: 'One Link, All Your Content',
      how: 'TinySlash Pages lets you build a beautiful micro-landing page hosted at one clean URL (e.g., tinyslash.com/yourname). Add multiple links — your website, YouTube, Spotify, product catalog, booking form — all on one screen. Update it anytime.',
      impact: 'Instagram, Twitter, and TikTok allow only one bio link. TinySlash Pages turns that one link into a hub for all your content. Creators see 4× more clicks distributed across their content vs a single link.',
    },
    {
      icon: <Palette size={24} />,
      color: 'bg-pink-100 text-pink-600',
      title: 'Premium Visual Templates',
      how: 'Choose from professionally designed templates — Minimal, Gradient, Dark, Brand, Influencer, and more. Customise colors, fonts, button styles, and background images. Add your profile photo and bio. No design skills needed.',
      impact: 'A professional-looking page builds trust instantly. Visitors who land on a polished page convert at 60% higher rates compared to a simple list of links. First impressions decide everything in under 3 seconds.',
    },
    {
      icon: <Smartphone size={24} />,
      color: 'bg-blue-100 text-blue-600',
      title: 'Mobile-First, Lightning Fast',
      how: 'Every TinySlash Page is optimised for mobile — where 80%+ of your audience will land. Pages load in under 1 second, work on all browsers, and look perfect on every screen size. Preview on any device before publishing.',
      impact: "Slow pages lose 50% of visitors before they even see your links. A sub-1-second load time ensures every visitor you've earned actually reaches your content — nothing is lost to bounce.",
    },
    {
      icon: <BarChart3 size={24} />,
      color: 'bg-green-100 text-green-600',
      title: 'Per-Link Click Analytics',
      how: 'Every button on your TinySlash Page has its own click counter. See total page views, unique visitors, and individual link clicks. Understand which content your audience engages with most — updated in real time.',
      impact: 'If your Spotify link gets 10× more clicks than your website, that tells you where your audience lives. Data-driven creators optimise their pages monthly and report 2× higher engagement over time.',
    },
    {
      icon: <Edit3 size={24} />,
      color: 'bg-orange-100 text-orange-600',
      title: 'Drag-and-Drop Block Builder',
      how: 'Build your page with blocks: Text, Links, Social Icons, Images, YouTube Videos, Spotify embeds, Contact Forms, and custom HTML. Drag to reorder. Toggle blocks on/off without deleting them. Save drafts.',
      impact: "Update your page in seconds when you launch something new. No waiting for a developer. No republishing. Real-time page management means you're always current — critical during launches and campaigns.",
    },
    {
      icon: <Globe size={24} />,
      color: 'bg-teal-100 text-teal-600',
      title: 'Custom Domain Support',
      how: 'Connect your own domain or subdomain to your TinySlash Page (e.g., links.yourbrand.com). Your brand URL, your trust. TinySlash handles all the hosting and HTTPS — you just point your DNS.',
      impact: 'A custom domain increases click-through rates by 50% compared to a generic short link domain. Your audience sees your brand name, not a third-party platform — building authority with every click.',
    },
  ];

  const stats = [
    { value: '4×', label: 'More clicks with a Pages hub' },
    { value: '60%', label: 'Higher conversion with polished pages' },
    { value: '<1s', label: 'Page load time' },
    { value: '50%', label: 'CTR boost with custom domain' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        fullTitle="TinySlash Pages – Link in Bio & Micro-Landing Page Builder"
        description="Build a beautiful link-in-bio page with TinySlash Pages. Add all your links, track clicks, and launch in minutes. The #1 link page builder for Indian creators and businesses."
      />
      <PublicHeader />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-violet-50 via-white to-pink-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="initial" animate="animate" variants={fadeInUp}>
            <span className="inline-block bg-violet-100 text-violet-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">TinySlash Pages</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              One URL That Links to<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-pink-600">
                Everything You Create
              </span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed">
              You've already earned the audience. Don't let platform rules limit you to one link. TinySlash Pages turns your single bio link into a complete destination — beautifully designed, fast, and fully tracked.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-transform hover:scale-105">
                Build Your Page <ArrowRight size={18} />
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
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Everything You Need in One Page</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Six powerful features that turn your link-in-bio into a high-converting destination for your audience.</p>
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

      {/* Who is this for */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Who Uses TinySlash Pages?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Content Creators', 'Small Businesses', 'Coaches & Consultants', 'Musicians & Artists', 'Restaurants & Cafés', 'E-commerce Stores', 'Freelancers', 'NGOs & Nonprofits'].map((who, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-gray-700 font-medium text-sm">{who}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-violet-600 to-pink-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Launch your page in under 5 minutes</h2>
          <p className="text-violet-100 text-lg mb-8">Join thousands of Indian creators and businesses who've replaced their single bio link with a full TinySlash Page.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-violet-600 px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-colors">
            Build Your Free Page <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PagesSolution;
