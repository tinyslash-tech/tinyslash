import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, FileText, CheckCircle, Upload, Building, Globe,
  Mail, Smartphone, ArrowRight, Clock, Lock, AlertCircle, X,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUpgradeModal } from '../../context/ModalContext';
import { normalizePlanName } from '../../constants/planPolicy';
import { ThreeDotsLoader } from '../../components/ui/ThreeDotsLoader';
import toast from 'react-hot-toast';

// ─── Types ────────────────────────────────────────────────────────────────────
interface TrustVerification {
  id: string;
  businessName: string;
  brandName: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  documents: string[];
  createdAt: string;
  expiresAt?: string;
}

interface DocSlot {
  key: 'gst' | 'pan' | 'domain_receipt' | 'incorporation_cert';
  label: string;
  description: string;
  required: boolean;
}

const DOC_SLOTS: DocSlot[] = [
  { key: 'gst', label: 'GST Certificate', description: 'GST registration certificate issued by the government', required: true },
  { key: 'pan', label: 'PAN Card', description: 'Business or individual PAN card — clear scan or photo', required: true },
  { key: 'domain_receipt', label: 'Domain Registration Receipt', description: 'Receipt from your domain registrar showing ownership', required: false },
  { key: 'incorporation_cert', label: 'Certificate of Incorporation', description: 'MCA / Registrar of Companies incorporation document', required: false },
];

const BADGE_PRICE_INR = 7999;

const steps = [
  { title: 'Business Info', icon: Building },
  { title: 'Document Upload', icon: Upload },
  { title: 'Pay & Verify', icon: CreditCard },
];

const BADGE_FEATURES = [
  'Green verified tick shown to all link visitors',
  'Secure 3-second trust interstitial before redirect',
  'Verified badge displayed on QR code scans',
  'Your brand name shown prominently',
  'Priority scam protection & compliance review',
  'Valid for 1 full year from approval date',
];

// ─── Razorpay loader ──────────────────────────────────────────────────────────
function loadRazorpay(): Promise<boolean> {
  return new Promise(resolve => {
    if ((window as any).Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.head.appendChild(s);
  });
}

// ─── Main Component ────────────────────────────────────────────────────────────
const TrustBadge = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { open: openUpgradeModal } = useUpgradeModal();
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  const [activeStep, setActiveStep] = useState(0);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    brandName: '',
    businessType: 'Private Limited',
    officialWebsite: '',
    officialEmail: '',
    officialWhatsapp: '',
  });

  const [uploadedDocs, setUploadedDocs] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  // ── Plan check ──────────────────────────────────────────────────────────────
  const currentPlan = normalizePlanName((user as any)?.subscriptionPlan || (user as any)?.plan || 'FREE');
  const isEligible = currentPlan === 'PRO' || currentPlan === 'BUSINESS' || currentPlan === 'BUSINESS_TRIAL';

  // ── Fetch existing verification status ────────────────────────────────────────
  const { data: verification, isLoading } = useQuery<TrustVerification | null>({
    queryKey: ['trust-status', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const res = await fetch(`${API_BASE}/v1/trust/status?userId=${user.id}`);
      if (!res.ok) return null;
      return res.json().then(d => d || null);
    },
    enabled: !!user,
  });

  // ── Submit application mutation ─────────────────────────────────────────────
  const applyMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      const body = {
        ...formData,
        gstDocUrl: uploadedDocs['gst'] || null,
        panDocUrl: uploadedDocs['pan'] || null,
        domainReceiptUrl: uploadedDocs['domain_receipt'] || null,
        incorporationCertUrl: uploadedDocs['incorporation_cert'] || null,
        paymentId,
        plan: currentPlan,
      };
      const res = await fetch(`${API_BASE}/v1/trust/apply?userId=${user?.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trust-status'] });
      toast.success('Application submitted! Our team will review within 24–48 hours.');
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to submit application.');
    },
  });

  // ── Per-document R2 upload ─────────────────────────────────────────────────
  const handleDocUpload = useCallback(async (docKey: DocSlot['key'], file: File) => {
    setUploading(prev => ({ ...prev, [docKey]: true }));
    try {
      const formPayload = new FormData();
      formPayload.append('file', file);
      const res = await fetch(
        `${API_BASE}/v1/trust/upload-doc?userId=${user?.id}&docType=${docKey}`,
        { method: 'POST', body: formPayload }
      );
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Upload failed');
      setUploadedDocs(prev => ({ ...prev, [docKey]: data.url }));
      toast.success(`${DOC_SLOTS.find(d => d.key === docKey)?.label} uploaded`);
    } catch (err: any) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(prev => ({ ...prev, [docKey]: false }));
    }
  }, [API_BASE, user?.id]);

  const handleRemoveDoc = (docKey: string) => {
    setUploadedDocs(prev => { const n = { ...prev }; delete n[docKey]; return n; });
  };

  // ── Validation ────────────────────────────────────────────────────────────
  const step1Valid = formData.businessName.trim() && formData.brandName.trim() &&
    formData.officialEmail.trim() && formData.officialWebsite.trim();

  const requiredDocsUploaded = DOC_SLOTS.filter(d => d.required).every(d => !!uploadedDocs[d.key]);

  // ── Razorpay payment flow ─────────────────────────────────────────────────
  const handlePay = async () => {
    if (!user?.id) return;
    setPaymentProcessing(true);
    try {
      const ready = await loadRazorpay();
      if (!ready) { toast.error('Razorpay failed to load. Please try again.'); return; }

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: BADGE_PRICE_INR * 100, // paise
        currency: 'INR',
        name: 'TinySlash',
        description: 'Trust Verified Badge — 1 Year',
        image: `${process.env.PUBLIC_URL}/round-logo-ts.png`,
        handler: async (response: any) => {
          await applyMutation.mutateAsync(response.razorpay_payment_id);
        },
        prefill: {
          name: (user as any)?.name || '',
          email: formData.officialEmail || (user as any)?.email || '',
        },
        theme: { color: '#000000' },
        modal: {
          ondismiss: () => setPaymentProcessing(false),
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch {
      toast.error('Payment initialisation failed. Please try again.');
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!step1Valid) { toast.error('Please fill all required fields'); return; }
      setActiveStep(1);
    } else if (activeStep === 1) {
      if (!requiredDocsUploaded) {
        toast.error('Please upload GST Certificate and PAN Card (required)');
        return;
      }
      setActiveStep(2);
    }
    // Step 2 handled by handlePay button directly
  };

  // ── LOADING STATE ──────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <ThreeDotsLoader size="lg" color="bg-black" />
      </div>
    );
  }

  // ── APPROVED ──────────────────────────────────────────────────────────────
  if (verification?.status === 'APPROVED') {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="border border-green-200 bg-green-50 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Shield className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Trust Badge Active</h1>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm">
            Your TinySlash Trust Badge is live. All your links now show the verified interstitial screen.
          </p>
          <div className="bg-white rounded-xl border border-green-100 p-5 max-w-md mx-auto text-left space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Brand Name</span><span className="font-semibold text-gray-900">{verification.brandName}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Verification ID</span><span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{verification.id}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Valid Until</span><span className="font-semibold text-green-600">{verification.expiresAt ? new Date(verification.expiresAt).toLocaleDateString('en-IN') : 'Lifetime'}</span></div>
          </div>
        </div>
      </div>
    );
  }

  // ── PENDING REVIEW ────────────────────────────────────────────────────────
  if (verification?.status === 'PENDING_REVIEW') {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="border border-blue-200 bg-blue-50 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Clock className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Under Review</h1>
          <p className="text-blue-800 text-sm max-w-md mx-auto">
            Our compliance team is reviewing your documents. This usually takes 24–48 hours.
            You will be notified via email once your badge is approved.
          </p>
        </div>
      </div>
    );
  }

  // ── REJECTED ──────────────────────────────────────────────────────────────
  if (verification?.status === 'REJECTED') {
    return (
      <div className="p-8 max-w-3xl mx-auto">
        <div className="border border-red-200 bg-red-50 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Rejected</h1>
          <p className="text-red-700 text-sm max-w-md mx-auto mb-5">
            Unfortunately your application was not approved. Please contact support for details or reapply with updated documents.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            Reapply
          </button>
        </div>
      </div>
    );
  }

  // ── NOT ELIGIBLE ──────────────────────────────────────────────────────────
  if (!isEligible) {
    return (
      <div className="p-8 max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-5">
          <Lock className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Trust Verified Badge</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-2 text-sm">
          The verified trust badge is available exclusively on <strong>Pro</strong> and <strong>Business</strong> plans.
          Upgrade your account to apply for verification and show the green shield on all your links and QR codes.
        </p>
        <div className="mt-3 inline-flex items-center gap-1.5 bg-gray-100 text-gray-500 text-xs px-3 py-1.5 rounded-full mb-8">
          <Shield className="w-3.5 h-3.5" />
          You are on the <strong className="capitalize ml-0.5">{currentPlan.toLowerCase()}</strong> plan
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => openUpgradeModal('trust-badge', 'Upgrade to Pro or Business to apply for the Trust Verified Badge.')}
            className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
          >
            Upgrade Plan
          </button>
        </div>
        <div className="mt-10 border border-gray-200 rounded-xl p-6 bg-gray-50 text-left max-w-md mx-auto">
          <h4 className="font-semibold text-gray-800 text-sm mb-4">What you get with the Trust Badge · ₹7,999/year</h4>
          <ul className="space-y-2.5 text-sm text-gray-600">
            {BADGE_FEATURES.map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                <Shield className="w-3.5 h-3.5 text-gray-400 mt-0.5 flex-shrink-0" />{f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  // ── APPLICATION WIZARD ───────────────────────────────────────────────────
  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Get Verified Trust Badge</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Get the green shield and secure interstitial for all your links and QR codes
        </p>
      </div>

      {/* Stepper */}
      <div className="flex items-start mb-10">
        {steps.map((step, idx) => {
          const isActive = idx === activeStep;
          const isCompleted = idx < activeStep;
          const StepIcon = step.icon;
          return (
            <div key={idx} className="flex-1 relative">
              <div className={`flex flex-col items-start ${idx !== steps.length - 1 ? 'border-t-2' : ''} ${isCompleted ? 'border-black' : isActive ? 'border-blue-600' : 'border-gray-200'} pt-4 transition-colors duration-200`}>
                <div className={`flex items-center gap-2 ${isActive ? 'text-blue-600' : isCompleted ? 'text-black' : 'text-gray-400'}`}>
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-50' : isCompleted ? 'bg-gray-100' : 'bg-gray-50'}`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5 text-black" /> : <StepIcon className="w-5 h-5" />}
                  </div>
                  <span className="font-medium text-sm">{step.title}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-8 min-h-[400px]">
        <AnimatePresence mode="wait">

          {/* ── Step 0: Business Info ─────────────────────────────────── */}
          {activeStep === 0 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} className="space-y-5 max-w-2xl">
              <h3 className="text-base font-semibold text-gray-900">Business Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Legal Business Name <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.businessName} onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Acme Corp Pvt Ltd" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Brand Name (Public) <span className="text-red-500">*</span></label>
                  <input type="text" value={formData.brandName} onChange={e => setFormData({ ...formData, brandName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="Acme" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Official Website <span className="text-red-500">*</span></label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="url" value={formData.officialWebsite} onChange={e => setFormData({ ...formData, officialWebsite: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="https://acme.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">Official Email <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" value={formData.officialEmail} onChange={e => setFormData({ ...formData, officialEmail: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="admin@acme.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">WhatsApp Business</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" value={formData.officialWhatsapp} onChange={e => setFormData({ ...formData, officialWhatsapp: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="+91 9988776655" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Step 1: Document Upload ───────────────────────────────── */}
          {activeStep === 1 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
              <h3 className="text-base font-semibold text-gray-900 mb-1">Document Verification</h3>
              <p className="text-xs text-gray-500 mb-5">
                Upload the documents below. Files are stored securely and only used for verification.
                Accepted: PDF, JPG, PNG — max 10 MB each.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DOC_SLOTS.map(slot => {
                  const uploaded = uploadedDocs[slot.key];
                  const isUploading = uploading[slot.key];
                  return (
                    <div key={slot.key} className={`border-2 rounded-xl p-4 transition-colors ${uploaded ? 'border-black bg-gray-50' : 'border-dashed border-gray-300 hover:border-blue-400 bg-white'}`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{slot.label}{slot.required && <span className="text-red-500 ml-0.5">*</span>}</p>
                          <p className="text-xs text-gray-400 mt-0.5 leading-snug">{slot.description}</p>
                        </div>
                        {uploaded && (
                          <button onClick={() => handleRemoveDoc(slot.key)} className="p-0.5 text-gray-400 hover:text-red-500 flex-shrink-0 ml-2" title="Remove">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {uploaded ? (
                        <div className="flex items-center gap-2 mt-3 bg-white border border-gray-200 rounded-lg px-3 py-2">
                          <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-xs text-gray-700 truncate flex-1">{slot.label.toLowerCase().replace(/ /g, '_')}.file</span>
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        </div>
                      ) : isUploading ? (
                        <div className="flex items-center justify-center gap-2 mt-3 py-3">
                          <ThreeDotsLoader size="xs" color="bg-black" />
                          <span className="text-xs text-gray-500">Uploading…</span>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center mt-3 py-4 cursor-pointer">
                          <Upload className="w-6 h-6 text-gray-400 mb-1.5" />
                          <span className="text-xs text-blue-600 font-medium">Click to upload</span>
                          <span className="text-xs text-gray-400 mt-0.5">PDF, JPG, PNG · max 10 MB</span>
                          <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png,.webp"
                            onChange={e => { const f = e.target.files?.[0]; if (f) handleDocUpload(slot.key, f); e.target.value = ''; }} />
                        </label>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Progress */}
              <div className="mt-5 flex items-center gap-2 text-xs text-gray-500">
                <div className="flex gap-1">
                  {DOC_SLOTS.map(s => (
                    <div key={s.key} className={`w-2 h-2 rounded-full ${uploadedDocs[s.key] ? 'bg-black' : s.required ? 'bg-gray-300' : 'bg-gray-200'}`} />
                  ))}
                </div>
                <span>{Object.keys(uploadedDocs).length} of {DOC_SLOTS.length} uploaded{!requiredDocsUploaded && ' · GST and PAN required'}</span>
              </div>
            </motion.div>
          )}

          {/* ── Step 2: Pay ₹7,999 ──────────────────────────────────── */}
          {activeStep === 2 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
              <h3 className="text-base font-semibold text-gray-900 mb-6">Complete Payment to Submit</h3>

              <div className="max-w-md mx-auto">
                <div className="border-2 border-black rounded-2xl overflow-hidden">
                  {/* Card header */}
                  <div className="bg-black text-white px-6 py-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-white bg-opacity-10 rounded-lg">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-base">Trust Verified Badge</p>
                        <p className="text-xs text-gray-400">Annual Verification Plan</p>
                      </div>
                    </div>
                    <div className="flex items-baseline gap-1 mt-4">
                      <span className="text-4xl font-extrabold">₹7,999</span>
                      <span className="text-gray-400 text-sm">/ year</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Renews annually · GST invoice available</p>
                  </div>

                  {/* Features */}
                  <div className="px-6 py-5 bg-white">
                    <ul className="space-y-2.5 mb-6">
                      {BADGE_FEATURES.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <CheckCircle className="w-4 h-4 text-black flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={handlePay}
                      disabled={paymentProcessing || applyMutation.isPending}
                      className="w-full py-3.5 bg-black text-white rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {paymentProcessing || applyMutation.isPending ? (
                        <>
                          <ThreeDotsLoader size="xs" color="bg-white" />
                          Processing…
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          Pay ₹7,999 &amp; Submit for Verification
                        </>
                      )}
                    </button>

                    <p className="text-xs text-center text-gray-400 mt-3">
                      Secure payment via Razorpay · Cancel within 7 days for a full refund
                    </p>
                  </div>
                </div>

                {/* Summary of submitted info */}
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-600 space-y-1">
                  <p className="font-medium text-gray-800 mb-1.5">Your submission summary</p>
                  <div className="flex justify-between"><span>Legal Name</span><span className="font-medium text-gray-900">{formData.businessName}</span></div>
                  <div className="flex justify-between"><span>Brand Name</span><span className="font-medium text-gray-900">{formData.brandName}</span></div>
                  <div className="flex justify-between"><span>Documents uploaded</span><span className="font-medium text-gray-900">{Object.keys(uploadedDocs).length} of {DOC_SLOTS.length}</span></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation — hidden on payment step (button is inside the card) */}
      {activeStep < 2 && (
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => activeStep > 0 && setActiveStep(activeStep - 1)}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors ${activeStep === 0 ? 'invisible' : ''}`}
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={Object.values(uploading).some(Boolean)}
            className="px-7 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Back button on payment step */}
      {activeStep === 2 && (
        <div className="mt-6">
          <button
            onClick={() => setActiveStep(1)}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default TrustBadge;
