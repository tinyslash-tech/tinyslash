import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, BarChart3, Shield, Clock, Share2, Eye, ArrowRight } from 'lucide-react';
import PublicHeader from '../../components/PublicHeader';
import Footer from '../../components/Footer';
import { SEO } from '../../components/SEO';

const FileSharing: React.FC = () => {
  const fadeInUp = { initial: { opacity: 0, y: 40 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.6 } };

  const features = [
    {
      icon: <FileText size={24} />,
      color: 'bg-blue-100 text-blue-600',
      title: 'File-to-Link in Seconds',
      how: 'Upload any file — PDF, image, video, presentation, Excel, ZIP — and TinySlash instantly generates a clean short link. Share that link anywhere: WhatsApp, email, SMS, Instagram DM. Recipients click and download — no app needed, no login required.',
      impact: 'Email attachments get blocked by spam filters, have size limits, and don\'t work in WhatsApp. TinySlash links bypass all that. Your recipients always get the file, every time — zero delivery failures.',
    },
    {
      icon: <BarChart3 size={24} />,
      color: 'bg-green-100 text-green-600',
      title: 'Download Analytics Per File',
      how: 'Every file link has its own analytics dashboard: total downloads, unique downloaders, geographic breakdown (city/state), device type, date-range filters, and download timeline. See exactly who downloaded your file and when.',
      impact: 'Know if your sales proposal was downloaded. Know if all 50 clients opened the updated price list. Know if your campaign brochure actually reached targets. No more "did they see it?" uncertainty.',
    },
    {
      icon: <Shield size={24} />,
      color: 'bg-purple-100 text-purple-600',
      title: 'Password-Protected File Links',
      how: 'Add an optional password to any file link. Only recipients who enter the correct password can download the file. Perfect for confidential contracts, HR documents, restricted price lists, and client-specific reports.',
      impact: 'Stop emailing sensitive documents as attachments that forwarded endlessly. A password-protected TinySlash link means only your intended recipient can access the file — critical for legal and financial documents.',
    },
    {
      icon: <Clock size={24} />,
      color: 'bg-orange-100 text-orange-600',
      title: 'Expiring File Links',
      how: 'Set any file link to expire after a specific date, or after a maximum number of downloads. After expiry, the link shows a clean "This link has expired" message — no 404 errors, no orphaned files.',
      impact: 'Temporary offers, beta documents, and version-limited files should not live forever. Expiring links ensure old file versions are automatically retired. Legal teams love this for document version control.',
    },
    {
      icon: <Share2 size={24} />,
      color: 'bg-pink-100 text-pink-600',
      title: 'One Link, Multiple Platforms',
      how: 'Generate a single file link and share it across WhatsApp business broadcast, email newsletter, LinkedIn post, and Instagram bio simultaneously. TinySlash tracks sources — so you know which channel drove the most downloads.',
      impact: 'Send a product catalog to 500 WhatsApp contacts, track who actually downloaded it, and follow up only with interested leads. Transform mass sharing into precision targeting.',
    },
    {
      icon: <Eye size={24} />,
      color: 'bg-teal-100 text-teal-600',
      title: 'In-Browser File Preview',
      how: 'PDFs, images, and supported document formats can be previewed directly in the browser before downloading. Recipients see a clean preview page with your file, download button, and optional branding — no forced downloads.',
      impact: 'Preview-before-download reduces abandoned downloads by 40%. Recipients trust what they\'re downloading, leading to higher engagement with your content — whether it\'s a brochure, case study, or report.',
    },
  ];

  const stats = [
    { value: '0%', label: 'Delivery failures vs email' },
    { value: '100%', label: 'Download visibility' },
    { value: '40%', label: 'Fewer abandoned downloads' },
    { value: '∞', label: 'File size flexibility' },
  ];

  const useCases = [
    { title: 'Sales Teams', desc: 'Track if proposals and brochures were downloaded by prospects.' },
    { title: 'HR Departments', desc: 'Share offer letters and policy docs securely with password protection.' },
    { title: 'Marketing Agencies', desc: 'Distribute campaign assets to clients with download analytics.' },
    { title: 'Educators & Trainers', desc: 'Share study material links that expire after the batch ends.' },
    { title: 'E-commerce Brands', desc: 'Send product catalogues over WhatsApp and track downloads.' },
    { title: 'Legal & Finance', desc: 'Share contracts and reports with expiry control and audit trail.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SEO
        fullTitle="File Sharing with Analytics – Track Every Download | TinySlash"
        description="Convert any file into a trackable short link. Track downloads, add password protection, set expiry dates, and share via WhatsApp or email. Built for Indian businesses and teams."
      />
      <PublicHeader />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="initial" animate="animate" variants={fadeInUp}>
            <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">File Sharing Solution</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Share Any File, Track<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                Every Single Download
              </span>
            </h1>
            <p className="text-xl text-gray-500 mb-10 max-w-3xl mx-auto leading-relaxed">
              Upload any file, get a clean shareable link, and know exactly who downloaded it, when, and from where. No more attachment headaches. No more "did they receive it?" anxiety.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-black transition-transform hover:scale-105">
                Start Sharing <ArrowRight size={18} />
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
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">More Than Just File Storage</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">Six powerful features that make file sharing intelligent — not just convenient.</p>
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

      {/* Use Cases */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who Benefits Most</h2>
            <p className="text-gray-500 text-lg">File sharing with analytics transforms workflows across every industry.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((uc, i) => (
              <motion.div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}>
                <h3 className="font-bold text-gray-900 mb-2">{uc.title}</h3>
                <p className="text-gray-600 text-sm">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Know exactly who got your file</h2>
          <p className="text-blue-100 text-lg mb-8">Join thousands of Indian businesses and teams using TinySlash to share files smarter — with full download visibility.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-colors">
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FileSharing;
