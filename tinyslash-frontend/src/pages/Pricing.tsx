import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, ChevronDown, Lock, Clock, FileText, Globe, Shield, Zap, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import PublicHeader from '../components/PublicHeader';
import Footer from '../components/Footer';
import AuthModal from '../components/AuthModal';
import { SEO } from '../components/SEO';
import toast from 'react-hot-toast';

// ─────────────────── helpers ───────────────────

const Tick: React.FC<{ val: string | boolean }> = ({ val }) => {
  if (val === true) return <Check className="w-4 h-4 text-green-500 mx-auto" />;
  if (val === false) return <X className="w-4 h-4 text-gray-300 mx-auto" />;
  return <span className="text-sm text-gray-700 font-medium">{val}</span>;
};

interface FeatureItem { ok: boolean; text: string }

const FeatureList: React.FC<{ items: FeatureItem[]; color: string }> = ({ items, color }) => (
  <ul className="space-y-1.5">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
        {item.ok
          ? <Check className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${color}`} />
          : <X className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-300" />}
        {item.text}
      </li>
    ))}
  </ul>
);

// ─────────────── compact card highlights ───────────────

const FREE_HIGHLIGHTS: FeatureItem[] = [
  { ok: true, text: '15 short links / month' },
  { ok: true, text: '15 static QR codes' },
  { ok: true, text: '3 file uploads (10 MB max)' },
  { ok: true, text: '7-day analytics (click count)' },
  { ok: true, text: '1 TinySlash Page · 5 links' },
  { ok: false, text: 'Custom slug' },
  { ok: false, text: 'Dynamic QR' },
  { ok: false, text: 'Remove branding' },
];

const STARTER_HIGHLIGHTS: FeatureItem[] = [
  { ok: true, text: '1,000 links / month' },
  { ok: true, text: '25 dynamic QR · unlimited static' },
  { ok: true, text: '50 file uploads (100 MB max)' },
  { ok: true, text: '30-day analytics' },
  { ok: true, text: 'Custom slug · password · expiry' },
  { ok: true, text: 'Rich link preview' },
  { ok: true, text: '2 Pages · remove branding' },
  { ok: false, text: 'Custom domain' },
];

const PRO_HIGHLIGHTS: FeatureItem[] = [
  { ok: true, text: 'Unlimited links' },
  { ok: true, text: '500 dynamic QR · full customization' },
  { ok: true, text: '200 file uploads (500 MB max)' },
  { ok: true, text: '90-day analytics + UTM builder' },
  { ok: true, text: '2 custom domains' },
  { ok: true, text: 'Open in App · language + location routing' },
  { ok: true, text: 'Pixel retargeting — 5 pixels / account' },
  { ok: true, text: 'Verified badge · 5 Pages · 3 members' },
];

const BUSINESS_HIGHLIGHTS: FeatureItem[] = [
  { ok: true, text: 'Unlimited links + QR + files (2 GB)' },
  { ok: true, text: '1-year analytics + data export' },
  { ok: true, text: '10 custom domains' },
  { ok: true, text: 'A/B testing · bulk import · webhooks' },
  { ok: true, text: 'Enterprise pixels — all platforms' },
  { ok: true, text: 'White-label QR + badge + pages' },
  { ok: true, text: '10 members · RBAC · audit logs' },
  { ok: true, text: 'Dedicated manager · 99.9% SLA' },
];

// ─────────────── comparison table data ───────────────

interface FeatureRow { label: string; free: string | boolean; starter: string | boolean; pro: string | boolean; business: string | boolean }
const COMPARISON: { header: string; rows: FeatureRow[] }[] = [
  {
    header: 'Pricing',
    rows: [
      { label: 'Monthly', free: '₹0', starter: '₹299', pro: '₹999', business: '₹3,499' },
      { label: 'Annual', free: '₹0', starter: '₹2,990', pro: '₹9,990', business: '₹34,990' },
    ],
  },
  {
    header: 'Short Links',
    rows: [
      { label: 'Links / month', free: '15', starter: '1,000', pro: 'Unlimited', business: 'Unlimited' },
      { label: 'Analytics retention', free: '7 days', starter: '30 days', pro: '90 days', business: '1 year' },
      { label: 'Custom slug', free: false, starter: true, pro: true, business: true },
      { label: 'Password protection', free: false, starter: true, pro: true, business: true },
      { label: 'Expiration rules', free: false, starter: true, pro: true, business: true },
      { label: 'Rich link preview', free: false, starter: true, pro: true, business: true },
      { label: 'Open in App (deep links)', free: false, starter: false, pro: true, business: true },
      { label: 'Language routing', free: false, starter: false, pro: true, business: true },
      { label: 'Location routing', free: false, starter: false, pro: true, business: true },
      { label: 'Unlock after signup', free: false, starter: false, pro: true, business: true },
      { label: 'A/B testing', free: false, starter: false, pro: false, business: true },
      { label: 'Bulk import (CSV)', free: false, starter: false, pro: false, business: true },
      { label: 'Smart redirect rules', free: false, starter: false, pro: false, business: true },
      { label: 'Webhooks', free: false, starter: false, pro: false, business: true },
    ],
  },
  {
    header: 'Pixel Retargeting',
    rows: [
      { label: 'Pixels enabled', free: false, starter: false, pro: true, business: true },
      { label: 'Pixels per account', free: '—', starter: '—', pro: '5', business: 'Unlimited' },
      { label: 'Pixels per link', free: '—', starter: '—', pro: '2', business: '5' },
      { label: 'Meta CAPI', free: false, starter: false, pro: true, business: true },
      { label: 'Google Ads', free: false, starter: false, pro: true, business: true },
      { label: 'Google Analytics 4', free: false, starter: false, pro: false, business: true },
      { label: 'Custom Webhook pixel', free: false, starter: false, pro: false, business: true },
      { label: 'Fire analytics', free: false, starter: false, pro: 'Basic', business: 'Full' },
    ],
  },
  {
    header: 'QR Codes',
    rows: [
      { label: 'Static QR / month', free: '15', starter: 'Unlimited', pro: 'Unlimited', business: 'Unlimited' },
      { label: 'Dynamic QR / month', free: '✗', starter: '25', pro: '500', business: 'Unlimited' },
      { label: 'QR customization', free: '✗', starter: 'Color only', pro: 'Full (logo+)', business: 'Full' },
      { label: 'QR scan analytics', free: false, starter: false, pro: true, business: true },
      { label: 'Multi-Action QR', free: false, starter: false, pro: true, business: true },
      { label: 'Lead capture QR', free: false, starter: false, pro: true, business: '✓ + export' },
      { label: 'Pixel retargeting QR', free: false, starter: false, pro: '2 / QR', business: '5 / QR' },
      { label: 'Bulk QR generation', free: false, starter: false, pro: false, business: true },
      { label: 'White-label QR', free: false, starter: false, pro: false, business: true },
    ],
  },
  {
    header: 'Verified Badge',
    rows: [
      { label: 'Badge available', free: false, starter: false, pro: true, business: true },
      { label: 'Custom badge message', free: false, starter: false, pro: true, business: true },
      { label: 'White-label badge', free: false, starter: false, pro: false, business: true },
      { label: 'Agency mode', free: false, starter: false, pro: false, business: true },
    ],
  },
  {
    header: 'Custom Domains',
    rows: [
      { label: 'Domains', free: '0', starter: '0', pro: '2', business: '10' },
      { label: 'Auto SSL', free: '—', starter: '—', pro: true, business: true },
      { label: 'Domain health monitor', free: false, starter: false, pro: false, business: true },
    ],
  },
  {
    header: 'File Sharing',
    rows: [
      { label: 'Uploads', free: '3', starter: '50', pro: '200', business: 'Unlimited' },
      { label: 'Max file size', free: '10 MB', starter: '100 MB', pro: '500 MB', business: '2 GB' },
      { label: 'Branded download page', free: false, starter: true, pro: true, business: 'White-label' },
      { label: 'Lead capture before download', free: false, starter: false, pro: false, business: true },
    ],
  },
  {
    header: 'TinySlash Pages',
    rows: [
      { label: 'Pages', free: '1', starter: '2', pro: '5', business: 'Unlimited' },
      { label: 'Remove branding', free: false, starter: true, pro: true, business: true },
      { label: 'Custom domain on pages', free: false, starter: false, pro: true, business: true },
      { label: 'Lead capture forms', free: false, starter: false, pro: false, business: true },
      { label: 'White-label pages', free: false, starter: false, pro: false, business: true },
      { label: 'Custom CSS injection', free: false, starter: false, pro: false, business: true },
    ],
  },
  {
    header: 'Team',
    rows: [
      { label: 'Members', free: '1', starter: '1', pro: '3', business: '10' },
      { label: 'Role-based access', free: false, starter: false, pro: 'Basic', business: 'Advanced' },
      { label: 'Audit logs', free: false, starter: false, pro: false, business: true },
    ],
  },
  {
    header: 'Support',
    rows: [
      { label: 'Type', free: 'Community', starter: 'Email', pro: 'Priority', business: 'Dedicated' },
      { label: 'Response time', free: '—', starter: '48 hr', pro: '24 hr', business: '2 hr' },
      { label: 'Phone support', free: false, starter: false, pro: false, business: true },
      { label: 'Uptime SLA', free: false, starter: false, pro: false, business: '99.9%' },
    ],
  },
];

// ─────────────────── main ───────────────────

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const loadRazorpay = () =>
    new Promise((resolve) => {
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const pay = async (planType: string, planName: string, amount: number) => {
    if (!isAuthenticated) { setAuthMode('signup'); setIsAuthModalOpen(true); return; }
    setIsProcessingPayment(true);
    try {
      if (!(await loadRazorpay())) { toast.error('Razorpay SDK failed to load'); return; }
      const api = process.env.REACT_APP_API_URL || 'https://urlshortner-mrrl.onrender.com/api';
      const order = await (await fetch(`${api}/v1/payments/create-order`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amount * 100, currency: 'INR', planType, planName, userId: user?.id }),
      })).json();
      if (!order.success) throw new Error(order.message);
      new (window as any).Razorpay({
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount * 100, currency: 'INR', name: 'TinySlash',
        description: `Upgrade to ${planName}`, order_id: order.orderId,
        handler: async (r: any) => {
          const v = await (await fetch(`${api}/v1/payments/verify`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...r, planType, userId: user?.id }),
          })).json();
          if (v.success) { toast.success(`Welcome to ${planName}!`); navigate('/dashboard'); }
          else toast.error('Payment verification failed');
        },
        theme: { color: '#000000' },
      }).open();
    } catch { toast.error('Payment failed'); }
    finally { setIsProcessingPayment(false); }
  };

  const mo = (m: number, y: number) => billingCycle === 'monthly' ? m : y;

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <SEO title="Pricing - TinySlash" description="Simple, transparent pricing that grows with you. Start for free." />
      {isAuthenticated ? <Header /> : <PublicHeader />}

      {/* ── Hero ── */}
      <section className="pt-32 pb-14 px-4 text-center max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { duration: 0.4 } }}>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            Simple pricing,<br />
            <span className="text-blue-600">no surprises</span>
          </h1>
          <p className="text-lg text-gray-500 mb-8">Start free. Upgrade when you grow. Cancel anytime.</p>
          {/* Toggle */}
          <div className="inline-flex bg-gray-100 rounded-full p-1 gap-1">
            {(['monthly', 'yearly'] as const).map((c) => (
              <button key={c} onClick={() => setBillingCycle(c)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${billingCycle === c ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>
                {c === 'monthly' ? 'Monthly' : <>Yearly <span className="text-xs text-green-600 font-bold bg-green-100 px-2 py-0.5 rounded-full ml-1">Save ~17%</span></>}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Plan Cards — equal height grid ── */}
      <section className="px-4 pb-24 max-w-7xl mx-auto">
        {/* items-stretch makes all cards stretch to tallest */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 items-stretch">

          {/* FREE */}
          <motion.div whileHover={{ y: -4 }}
            className="border border-gray-200 rounded-2xl p-6 flex flex-col h-full">
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Free</p>
              <p className="text-4xl font-extrabold mt-1">₹0<span className="text-base font-normal text-gray-400"> / mo</span></p>
              <p className="text-sm text-gray-500 mt-1">Explore TinySlash</p>
            </div>
            <button onClick={() => isAuthenticated ? navigate('/dashboard') : (setAuthMode('signup'), setIsAuthModalOpen(true))}
              className="w-full py-2.5 rounded-xl border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition mb-5 text-sm">
              Get Started Free
            </button>
            <div className="flex-1">
              <FeatureList items={FREE_HIGHLIGHTS} color="text-gray-500" />
            </div>
            <a href="#comparison" className="mt-5 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 justify-center">
              Full comparison <ArrowDown className="w-3 h-3" />
            </a>
          </motion.div>

          {/* STARTER */}
          <motion.div whileHover={{ y: -4 }}
            className="border border-blue-200 rounded-2xl p-6 flex flex-col h-full">
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-blue-500">Starter</p>
              <p className="text-4xl font-extrabold mt-1">
                ₹{mo(299, 249)}<span className="text-base font-normal text-gray-400"> / mo</span>
              </p>
              <p className="text-xs text-blue-500 font-medium mt-0.5">
                {billingCycle === 'yearly' ? '₹2,990 / year' : 'Billed monthly'}
              </p>
              <p className="text-sm text-gray-500 mt-1">For freelancers &amp; solo creators</p>
            </div>
            <button onClick={() => pay(billingCycle === 'monthly' ? 'STARTER_MONTHLY' : 'STARTER_YEARLY', 'Starter', billingCycle === 'monthly' ? 299 : 2990)}
              disabled={isProcessingPayment}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition mb-5 text-sm shadow">
              Upgrade to Starter
            </button>
            <div className="flex-1">
              <FeatureList items={STARTER_HIGHLIGHTS} color="text-blue-500" />
            </div>
            <a href="#comparison" className="mt-5 text-xs text-blue-400 hover:text-blue-600 flex items-center gap-1 justify-center">
              Full comparison <ArrowDown className="w-3 h-3" />
            </a>
          </motion.div>

          {/* PRO — featured */}
          <div className="border-2 border-black rounded-2xl p-6 flex flex-col h-full relative shadow-2xl bg-white xl:scale-[1.03] xl:z-10">
            <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
              <span className="bg-black text-white text-xs font-bold px-4 py-1 rounded-full">⭐ Most Popular</span>
            </div>
            <div className="mb-4 mt-2">
              <p className="text-xs font-bold uppercase tracking-wider text-purple-600">Pro</p>
              <p className="text-4xl font-extrabold mt-1">
                ₹{mo(999, 832)}<span className="text-base font-normal text-gray-400"> / mo</span>
              </p>
              <p className="text-xs text-purple-600 font-medium mt-0.5">
                {billingCycle === 'yearly' ? '₹9,990 / year' : 'Billed monthly'}
              </p>
              <p className="text-sm text-gray-500 mt-1">For influencers &amp; small businesses</p>
            </div>
            <button onClick={() => pay(billingCycle === 'monthly' ? 'PRO_MONTHLY' : 'PRO_YEARLY', 'Pro', billingCycle === 'monthly' ? 999 : 9990)}
              disabled={isProcessingPayment}
              className="w-full py-2.5 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition mb-5 text-sm shadow-md">
              Go Pro
            </button>
            <div className="flex-1">
              <FeatureList items={PRO_HIGHLIGHTS} color="text-purple-600" />
            </div>
            <a href="#comparison" className="mt-5 text-xs text-purple-400 hover:text-purple-600 flex items-center gap-1 justify-center">
              Full comparison <ArrowDown className="w-3 h-3" />
            </a>
          </div>

          {/* BUSINESS */}
          <motion.div whileHover={{ y: -4 }}
            className="border border-gray-200 rounded-2xl p-6 flex flex-col h-full bg-gray-50">
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-600">Business</p>
              <p className="text-4xl font-extrabold mt-1">
                ₹{mo(3499, 2916)}<span className="text-base font-normal text-gray-400"> / mo</span>
              </p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {billingCycle === 'yearly' ? '₹34,990 / year' : 'Billed monthly'}
              </p>
              <p className="text-sm text-gray-500 mt-1">For agencies &amp; growing teams</p>
            </div>
            <button onClick={() => pay(billingCycle === 'monthly' ? 'BUSINESS_MONTHLY' : 'BUSINESS_YEARLY', 'Business', billingCycle === 'monthly' ? 3499 : 34990)}
              disabled={isProcessingPayment}
              className="w-full py-2.5 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-700 transition mb-5 text-sm">
              Upgrade to Business
            </button>
            <div className="flex-1">
              <FeatureList items={BUSINESS_HIGHLIGHTS} color="text-gray-700" />
            </div>
            <a href="#comparison" className="mt-5 text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 justify-center">
              Full comparison <ArrowDown className="w-3 h-3" />
            </a>
          </motion.div>

        </div>
      </section>

      {/* ── Comparison Table ── */}
      <section id="comparison" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Complete Feature Comparison</h2>
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-gray-200 bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-4 text-gray-500 font-semibold w-56">Feature</th>
                  <th className="px-5 py-4 text-center text-gray-600 font-semibold">Free</th>
                  <th className="px-5 py-4 text-center text-blue-600 font-semibold">Starter</th>
                  <th className="px-5 py-4 text-center text-purple-600 font-bold">Pro ⭐</th>
                  <th className="px-5 py-4 text-center text-gray-900 font-semibold">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {COMPARISON.map((section) => (
                  <React.Fragment key={section.header}>
                    <tr className="bg-gray-50">
                      <td colSpan={5} className="px-6 py-2.5 font-bold text-gray-500 uppercase text-xs tracking-wider">
                        {section.header}
                      </td>
                    </tr>
                    {section.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                        <td className="px-6 py-3 text-gray-700 font-medium">{row.label}</td>
                        <td className="px-5 py-3 text-center text-gray-500"><Tick val={row.free} /></td>
                        <td className="px-5 py-3 text-center text-blue-600"><Tick val={row.starter} /></td>
                        <td className="px-5 py-3 text-center text-purple-600"><Tick val={row.pro} /></td>
                        <td className="px-5 py-3 text-center text-gray-900"><Tick val={row.business} /></td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Trust ── */}
      <section className="py-16 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-10">Built for professionals</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { Icon: Lock, label: 'Password-protected links' },
              { Icon: Clock, label: 'Time & click-based expiry' },
              { Icon: FileText, label: 'Secure file sharing' },
              { Icon: Globe, label: 'Global fast delivery' },
              { Icon: Shield, label: 'Cancel anytime' },
              { Icon: Zap, label: 'Pixel retargeting' },
            ].map(({ Icon, label }, i) => (
              <div key={i} className="p-4 flex flex-col items-center">
                <Icon className="w-8 h-8 text-blue-600 mb-2" />
                <p className="font-semibold text-sm text-gray-700 text-center">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8">FAQs</h2>
          <div className="space-y-3">
            {[
              { q: 'Can I upgrade or downgrade anytime?', a: 'Yes — change your plan anytime from the billing section. Changes take effect immediately.' },
              { q: 'What payment methods do you accept?', a: 'UPI, credit/debit cards, and net banking via Razorpay.' },
              { q: 'Does the Free plan expire?', a: 'No. The Free plan is permanent within its limits.' },
              { q: 'What happens when I hit my link limit?', a: 'Existing links keep working. You are prompted to upgrade to create new ones.' },
              { q: 'Is there a refund policy?', a: 'Yes — contact support within 7 days of purchase for a full refund.' },
              { q: 'What is Pixel Retargeting?', a: 'Fire Meta CAPI or Google Ads conversion events when someone clicks your short link or scans your QR — enabling ad retargeting.' },
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-900 text-sm">
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ml-4 ${openFAQ === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFAQ === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                      <p className="px-5 pb-5 text-gray-600 text-sm">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 bg-gray-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold mb-4">Shorten. Secure. Share. Scale.</h2>
          <p className="text-gray-400 mb-8">Join thousands of creators and businesses on TinySlash.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/signup')}
              className="px-8 py-3.5 bg-white text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition">
              Start Free
            </button>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-8 py-3.5 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition">
              View Plans
            </button>
          </div>
        </div>
      </section>

      <Footer />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
        onSuccess={() => { setIsAuthModalOpen(false); navigate('/dashboard'); }}
      />
    </div>
  );
};

export default Pricing;