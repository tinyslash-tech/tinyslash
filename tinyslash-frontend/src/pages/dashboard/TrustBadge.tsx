import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, FileText, CheckCircle, Upload, CreditCard, Building, Globe, Mail, Smartphone, ArrowRight, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Types
interface TrustVerification {
  id: string;
  businessName: string;
  brandName: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  documents: string[];
  createdAt: string;
  expiresAt?: string;
}

const steps = [
  { title: 'Business Info', icon: Building },
  { title: 'Verification', icon: Upload },
  { title: 'Plan Payment', icon: CreditCard },
];

const TrustBadge = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    businessName: '',
    brandName: '',
    businessType: 'Private Limited',
    officialWebsite: '',
    officialEmail: '',
    officialWhatsapp: ''
  });

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  // Fetch existing status
  const { data: verification, isLoading } = useQuery<TrustVerification>({
    queryKey: ['trust-status', user?.id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/v1/trust/status?userId=${user?.id}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data; // might be null
    },
    enabled: !!user
  });

  // Apply Mutation
  const applyMutation = useMutation({
    mutationFn: async (data: any) => {
      // 1. Upload logic would go here (mocking file upload)
      // 2. Submit application
      const res = await fetch(`${API_BASE}/v1/trust/apply?userId=${user?.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          documents: ['mock_doc_1.pdf', 'mock_doc_2.pdf'], // Mock
          plan: 'BUSINESS' // Hardcoded for demo
        })
      });
      if (!res.ok) throw new Error("Application failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trust-status"] });
      toast.success("Application Submitted Successfully!");
    },
    onError: () => toast.error("Failed to submit application")
  });

  // Eligibility Check
  const isPro = user?.plan?.includes('PRO') || user?.plan?.includes('BUSINESS');

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading verification status...</div>;

  // VIEW: APPROVED
  if (verification?.status === 'APPROVED') {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">You are Verified!</h1>
          <p className="text-green-800 mb-8 max-w-md mx-auto">
            Your TinySlash Trust Badge is active. All your links now show the green verification screen securely.
          </p>

          <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6 max-w-lg mx-auto text-left">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
              <span className="text-gray-500">Brand Name</span>
              <span className="font-semibold text-gray-900">{verification.brandName}</span>
            </div>
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
              <span className="text-gray-500">Verification ID</span>
              <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{verification.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">Valid Until</span>
              <span className="font-semibold text-green-600">
                {verification.expiresAt ? new Date(verification.expiresAt).toLocaleDateString() : 'Forever'}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // VIEW: PENDING REVIEW
  if (verification?.status === 'PENDING_REVIEW') {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Application Under Review</h1>
          <p className="text-blue-800">
            Our compliance team is reviewing your documents. This usually takes 24-48 hours.
            You will be notified via email once approved.
          </p>
        </div>
      </div>
    )
  }

  // VIEW: NON-ELIGIBLE
  if (!isPro) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <Shield className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Trust Verified Badge</h2>
        <p className="text-gray-600 max-w-lg mx-auto mb-8">
          The verified badge is exclusive to Pro and Business plan users.
          Upgrade your account to apply for verification and secure your links.
        </p>
        <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-black transition-colors">
          View Upgrade Plans
        </button>
      </div>
    );
  }

  // VIEW: APPLICATION WIZARD
  const handleNext = () => {
    if (activeStep < steps.length - 1) setActiveStep(activeStep + 1);
    else handleSubmit(); // Payment step done
  };

  const handleSubmit = () => {
    applyMutation.mutate(formData);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Apply for Trust Verification</h1>
          <p className="text-gray-500 mt-1">Get the green tick and secure interstitial for your links</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="flex items-center mb-12 relative z-10">
        {steps.map((step, idx) => {
          const isActive = idx === activeStep;
          const isCompleted = idx < activeStep;
          const StepIcon = step.icon;
          return (
            <div key={idx} className="flex-1 relative">
              <div className={`flex flex-col items-start ${idx !== steps.length - 1 ? 'border-t-2' : ''} ${isCompleted ? 'border-green-500' : 'border-gray-200'} pt-4 transition-colors duration-300`}>
                <div className={`flex items-center gap-2 ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-50' : isCompleted ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <StepIcon className="w-5 h-5" />
                  </div>
                  <span className="font-medium text-sm">{step.title}</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 min-h-[400px]">
        <AnimatePresence mode='wait'>
          {activeStep === 0 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6 max-w-2xl"
            >
              <h3 className="text-lg font-semibold text-gray-900">Business Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Legal Business Name</label>
                  <input type="text"
                    value={formData.businessName}
                    onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Acme Corp Pvt Ltd"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name (Public)</label>
                  <input type="text"
                    value={formData.brandName}
                    onChange={e => setFormData({ ...formData, brandName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Acme"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Official Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="url"
                    value={formData.officialWebsite}
                    onChange={e => setFormData({ ...formData, officialWebsite: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://acme.com"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Official Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email"
                      value={formData.officialEmail}
                      onChange={e => setFormData({ ...formData, officialEmail: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="admin@acme.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Business</label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel"
                      value={formData.officialWhatsapp}
                      onChange={e => setFormData({ ...formData, officialWhatsapp: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="+91 9988776655"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeStep === 1 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Verification</h3>
              <div className="bg-blue-50 text-blue-800 p-4 rounded-lg mb-6 text-sm">
                Please upload GST Certificate, PAN Card, or Certificate of Incorporation.
                Documents are stored securely and only used for verification.
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:border-blue-500 transition-colors cursor-pointer bg-gray-50">
                <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="font-medium text-gray-900">Click to upload documents</h4>
                <p className="text-sm text-gray-500 mt-1">PDF, PNG, JPG up to 10MB</p>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Uploaded:</h4>
                <div className="bg-gray-50 p-3 rounded-lg flex items-center justify-between border border-gray-200">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-gray-500" />
                    <span className="text-sm text-gray-700">gst_certificate.pdf</span>
                  </div>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              </div>
            </motion.div>
          )}

          {activeStep === 2 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Select Verification Plan</h3>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all relative overflow-hidden">
                  <h4 className="font-bold text-gray-900 mb-2">Standard Trust</h4>
                  <div className="text-3xl font-bold text-gray-900 mb-4">₹4,999<span className="text-sm text-gray-500 font-normal">/year</span></div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="w-4 h-4 text-green-500" /> Green Verified Tick</li>
                    <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="w-4 h-4 text-green-500" /> Interstitial Page</li>
                    <li className="flex items-center gap-2 text-sm text-gray-600"><CheckCircle className="w-4 h-4 text-green-500" /> Basic Support</li>
                  </ul>
                  <button className="w-full py-2 bg-gray-900 text-white rounded-lg font-medium">Select Plan</button>
                </div>

                <div className="border-2 border-blue-600 rounded-xl p-6 shadow-md relative bg-blue-50/50">
                  <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs px-3 py-1 rounded-bl-lg font-medium">RECOMMENDED</div>
                  <h4 className="font-bold text-gray-900 mb-2">Business Trust+</h4>
                  <div className="text-3xl font-bold text-gray-900 mb-4">₹14,999<span className="text-sm text-gray-500 font-normal">/year</span></div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center gap-2 text-sm text-gray-800"><CheckCircle className="w-4 h-4 text-green-500" /> Everything in Standard</li>
                    <li className="flex items-center gap-2 text-sm text-gray-800"><CheckCircle className="w-4 h-4 text-green-500" /> Priority Review (24 hrs)</li>
                    <li className="flex items-center gap-2 text-sm text-gray-800"><CheckCircle className="w-4 h-4 text-green-500" /> Dedicated Account Manager</li>
                  </ul>
                  <div className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium text-center">Selected</div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          onClick={() => activeStep > 0 && setActiveStep(activeStep - 1)}
          className={`px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 ${activeStep === 0 ? 'invisible' : ''}`}
        >
          Back
        </button>
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-colors flex items-center gap-2"
        >
          {activeStep === steps.length - 1 ? (applyMutation.isPending ? 'Processing...' : 'Pay & Submit') : 'Continue'}
          {!applyMutation.isPending && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export default TrustBadge;
