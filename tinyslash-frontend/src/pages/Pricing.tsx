import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, X, ChevronDown, Lock, Clock, FileText, Globe, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import PublicHeader from '../components/PublicHeader';
import { SEO } from '../components/SEO';
import { paymentService } from '../services/paymentService';
import { subscriptionService, PricingData } from '../services/subscriptionService';
import toast from 'react-hot-toast';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // New State for coupons if needed, though streamlined in new design
  const [couponCode, setCouponCode] = useState('');

  const handleRazorpayPayment = async (planType: string, planName: string, amount: number) => {
    if (!isAuthenticated) {
      toast.error('Please log in or sign up to upgrade');
      navigate('/signup'); // Assuming /signup exists, or trigger modal
      return;
    }

    setIsProcessingPayment(true);
    try {
      const res = await loadRazorpayScript();
      if (!res) {
        toast.error('Razorpay SDK failed to load');
        return;
      }

      // Initialize payment via service
      // Note: You might need to adjust your existing paymentService to accept flexible amounts/plans 
      // if it was hardcoded before. Assuming similar logic to previous implementation.

      // Simplified payment flow for demo:
      // 1. Create Order
      const apiUrl = process.env.REACT_APP_API_URL || 'https://urlshortner-mrrl.onrender.com/api';
      const orderResponse = await fetch(`${apiUrl}/v1/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amount * 100,
          currency: 'INR',
          planType,
          planName,
          userId: user?.id
        }),
      });
      const orderData = await orderResponse.json();

      if (!orderData.success) throw new Error(orderData.message);

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: 'INR',
        name: 'TinySlash',
        description: `Upgrade to ${planName}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          // Verify on backend
          const verifyResponse = await fetch(`${apiUrl}/v1/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planType,
              userId: user?.id
            }),
          });
          const verifyData = await verifyResponse.json();
          if (verifyData.success) {
            toast.success(`Welcome to ${planName}!`);
            navigate('/dashboard');
          } else {
            toast.error('Payment verification failed');
          }
        },
        theme: { color: '#000000' }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error(error);
      toast.error('Payment failed');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const stagger = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <SEO
        title="Pricing - TinySlash"
        description="Simple, transparent pricing that grows with you. Start for free."
      />
      {isAuthenticated ? <Header /> : <PublicHeader />}

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center max-w-5xl mx-auto">
        <motion.div initial="initial" animate="animate" variants={fadeInUp}>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Simple, transparent pricing <br className="hidden md:block" />
            <span className="text-blue-600">that grows with you</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Start for free. Upgrade only when your usage grows. <br />
            Short links, QR codes, secure file sharing, and powerful analytics — all in one place.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="relative w-14 h-8 bg-gray-200 rounded-full p-1 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-200 ${billingCycle === 'yearly' ? 'translate-x-6' : ''}`} />
            </button>
            <span className={`text-sm font-medium ${billingCycle === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
              Yearly <span className="text-green-600 text-xs font-bold bg-green-100 px-2 py-0.5 rounded-full ml-1">Save 20%</span>
            </span>
          </div>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="px-4 sm:px-6 lg:px-8 pb-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">

          {/* FREE Plan */}
          <motion.div
            className="border border-gray-200 rounded-2xl p-6 flex flex-col hover:border-blue-300 transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="mb-4">
              <h3 className="text-lg font-bold">Free</h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-extrabold">₹0</span>
                <span className="text-gray-500 ml-1">/ month</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">For individuals trying TinySlash</p>
            </div>
            <button
              onClick={() => navigate('/signup')}
              className="w-full py-2.5 rounded-lg border border-gray-300 font-semibold text-gray-700 hover:bg-gray-50 transition-colors mb-6"
            >
              Get Started Free
            </button>
            <div className="space-y-3 flex-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">What's included</p>
              <ul className="space-y-3">
                {['50 short links', '50 QR codes', '5 file-to-link uploads', 'Basic click analytics', 'TinySlash branded links', 'Link expiration (time-based)', '7-day analytics history'].map((item, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-600">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-gray-100 space-y-3">
                {['Custom domains', 'Password protection', 'Team access', 'API access'].map((item, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-400">
                    <X className="w-4 h-4 text-gray-300 mr-2 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </div>
            </div>
          </motion.div>

          {/* STARTER Plan */}
          <motion.div
            className="border-2 border-blue-600 rounded-2xl p-6 flex flex-col relative shadow-xl transform scale-105 z-10 bg-white"
          >
            <div className="absolute top-0 right-0 left-0 -mt-3 flex justify-center">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</span>
            </div>
            <div className="mb-4 mt-2">
              <h3 className="text-lg font-bold text-blue-600">Starter</h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-extrabold">₹{billingCycle === 'monthly' ? '99' : '83'}</span>
                <span className="text-gray-500 ml-1">/ month</span>
              </div>
              <p className="text-xs text-blue-600 mt-1 font-medium">{billingCycle === 'monthly' ? 'Billed monthly' : '₹999 billed yearly (2 months free)'}</p>
              <p className="text-sm text-gray-500 mt-2">For freelancers & creators</p>
            </div>
            <button
              onClick={() => handleRazorpayPayment(billingCycle === 'monthly' ? 'STARTER_MONTHLY' : 'STARTER_YEARLY', 'Starter', billingCycle === 'monthly' ? 99 : 999)}
              className="w-full py-2.5 rounded-lg bg-blue-600 font-semibold text-white hover:bg-blue-700 transition-colors mb-6 shadow-md"
            >
              Upgrade to Starter
            </button>
            <div className="space-y-3 flex-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Everything in Free, plus:</p>
              <ul className="space-y-3">
                {['1,000 short links', 'Unlimited QR codes', '100 file-to-link uploads', 'Password-protected links', 'Link expiration (date & click-based)', '1 custom domain', '30-day analytics history', 'Device & country analytics', 'Email support'].map((item, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-900 font-medium">
                    <Check className="w-4 h-4 text-blue-600 mr-2 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* PRO Plan */}
          <motion.div
            className="border border-gray-200 rounded-2xl p-6 flex flex-col hover:border-purple-300 transition-all duration-300"
            whileHover={{ y: -5 }}
          >
            <div className="mb-4">
              <h3 className="text-lg font-bold text-purple-600">Pro</h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-extrabold">₹{billingCycle === 'monthly' ? '299' : '249'}</span>
                <span className="text-gray-500 ml-1">/ month</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{billingCycle === 'monthly' ? 'Billed monthly' : '₹2,999 billed yearly'}</p>
              <p className="text-sm text-gray-500 mt-2">For startups & growing teams</p>
            </div>
            <button
              onClick={() => handleRazorpayPayment(billingCycle === 'monthly' ? 'PRO_MONTHLY' : 'PRO_YEARLY', 'Pro', billingCycle === 'monthly' ? 299 : 2999)}
              className="w-full py-2.5 rounded-lg bg-white border border-purple-600 font-semibold text-purple-600 hover:bg-purple-50 transition-colors mb-6"
            >
              Go Pro
            </button>
            <div className="space-y-3 flex-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Everything in Starter, plus:</p>
              <ul className="space-y-3">
                {['Unlimited short links', 'Unlimited QR codes', 'Unlimited file-to-link uploads', 'Advanced password protection', 'Advanced link expiration rules', '5 custom domains', 'Team access (up to 5 users)', 'Advanced analytics', 'API access', 'Priority support'].map((item, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-600">
                    <Check className="w-4 h-4 text-purple-600 mr-2 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* BUSINESS Plan */}
          <motion.div
            className="border border-gray-200 rounded-2xl p-6 flex flex-col bg-gray-50"
          >
            <div className="mb-4">
              <h3 className="text-lg font-bold text-gray-900">Business</h3>
              <div className="mt-2 flex items-baseline">
                <span className="text-3xl font-extrabold">₹999</span>
                <span className="text-gray-500 ml-1">/ month</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Custom pricing available</p>
              <p className="text-sm text-gray-500 mt-2">For companies & enterprises</p>
            </div>
            <button
              className="w-full py-2.5 rounded-lg border border-gray-900 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors mb-6"
            >
              Contact Sales
            </button>
            <div className="space-y-3 flex-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Everything in Pro, plus:</p>
              <ul className="space-y-3">
                {['Unlimited everything', 'Unlimited team members', 'Enterprise-grade secure file sharing', 'Access-controlled & expiring links', 'White-label branding', 'SLA & uptime guarantee', 'Audit logs', 'Dedicated support'].map((item, i) => (
                  <li key={i} className="flex items-start text-sm text-gray-600">
                    <Check className="w-4 h-4 text-gray-900 mr-2 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Detail Comparison</h2>
          <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4">Feature</th>
                  <th className="px-6 py-4">Free</th>
                  <th className="px-6 py-4 text-blue-600">Starter</th>
                  <th className="px-6 py-4 text-purple-600">Pro</th>
                  <th className="px-6 py-4">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { f: "Short links", free: "50", starter: "1,000", pro: "Unlimited", bus: "Unlimited" },
                  { f: "QR codes", free: "50", starter: "Unlimited", pro: "Unlimited", bus: "Unlimited" },
                  { f: "File-to-link uploads", free: "5", starter: "100", pro: "Unlimited", bus: "Unlimited" },
                  { f: "Password protection", free: "❌", starter: "✅", pro: "✅ (Advanced)", bus: "✅" },
                  { f: "Link expiration", free: "Basic", starter: "Advanced", pro: "Advanced", bus: "Advanced" },
                  { f: "Custom domains", free: "❌", starter: "1", pro: "5", bus: "Unlimited" },
                  { f: "Analytics history", free: "7 days", starter: "30 days", pro: "Unlimited", bus: "Unlimited" },
                  { f: "Team members", free: "❌", starter: "❌", pro: "5", bus: "Unlimited" },
                  { f: "API access", free: "❌", starter: "❌", pro: "✅", bus: "✅" },
                  { f: "Support", free: "❌", starter: "Email", pro: "Priority", bus: "Dedicated" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{row.f}</td>
                    <td className="px-6 py-4 text-gray-500">{row.free}</td>
                    <td className="px-6 py-4 font-medium text-blue-600">{row.starter}</td>
                    <td className="px-6 py-4 font-medium text-purple-600">{row.pro}</td>
                    <td className="px-6 py-4 font-bold text-gray-900">{row.bus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12">Secure sharing, built for professionals</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <Lock className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Password-protected links</h3>
            </div>
            <div className="p-6">
              <Clock className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Time & click-based expiration</h3>
            </div>
            <div className="p-6">
              <FileText className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Secure file sharing via links</h3>
            </div>
            <div className="p-6">
              <Globe className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Fast & reliable global delivery</h3>
            </div>
            <div className="p-6">
              <Shield className="w-10 h-10 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg mb-2">Cancel anytime</h3>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Can I share files securely using TinySlash?", a: "Yes. You can convert files into secure links with password protection and expiration." },
              { q: "Can I set link expiry?", a: "Yes. Starter and above support date-based and click-based expiration." },
              { q: "Can I upgrade anytime?", a: "Yes. Upgrade or downgrade anytime from your dashboard." },
              { q: "What payment methods do you support?", a: "UPI, cards, and net banking (via Razorpay)." },
            ].map((faq, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => toggleFAQ(i)} className="w-full flex items-center justify-between p-4 text-left font-semibold">
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${openFAQ === i ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFAQ === i && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="p-4 pt-0 text-gray-600">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gray-900 text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-extrabold mb-6">Shorten. Secure. Share. Scale.</h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/signup')} className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">Start Free</button>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white/10 transition-colors">Upgrade Now</button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Pricing;