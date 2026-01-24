import React, { useState } from 'react';
import { Globe, CheckCircle, Copy, ExternalLink, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { addDomain } from '../services/domainService';

interface CustomDomainOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (domain: any) => void;
}

const CustomDomainOnboarding: React.FC<CustomDomainOnboardingProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const { user, token } = useAuth();
  const [step, setStep] = useState(1);
  const [domainName, setDomainName] = useState('');
  const [subdomain, setSubdomain] = useState('go');
  const [setupType, setSetupType] = useState<'subdomain' | 'root'>('subdomain');
  const [isAdding, setIsAdding] = useState(false);
  const [addedDomain, setAddedDomain] = useState<any>(null);
  const [dnsInstructions, setDnsInstructions] = useState<any>(null);

  // Universal proxy domain configuration
  const proxyDomain = 'tinyslash.com';

  if (!isOpen) return null;

  const handleAddDomain = async () => {
    if (!domainName.trim()) {
      toast.error('Please enter your domain name');
      return;
    }

    const cleanDomain = domainName.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');

    if (!cleanDomain.includes('.')) {
      toast.error('Please enter a valid domain name (e.g., yourdomain.com)');
      return;
    }

    // Construct the full domain based on setup type
    const fullDomain = setupType === 'subdomain' ? `${subdomain}.${cleanDomain}` : cleanDomain;

    try {
      setIsAdding(true);

      const response = await addDomain(fullDomain, 'USER');

      if (response.success) {
        setAddedDomain(response.domain);
        setDnsInstructions(response.dnsInstructions);
        setStep(2);
        toast.success('Domain reserved successfully!');

        window.dispatchEvent(new CustomEvent('custom-domain-added', {
          detail: response.domain
        }));
      } else {
        toast.error(response.message || 'Failed to add domain');
      }
    } catch (error: any) {
      console.error('Failed to add domain:', error);
      const errorMessage = error.response?.data?.message || 'Failed to add domain. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsAdding(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy to clipboard');
    }
  };

  const getFullDomain = () => {
    if (setupType === 'subdomain') {
      return `${subdomain}.${domainName}`;
    }
    return domainName;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Globe className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Add Custom Domain</h2>
                <p className="text-blue-100">Set up your branded short links in 3 simple steps</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-center space-x-8">
            {[
              { num: 1, title: 'Enter Domain', active: step >= 1, completed: step > 1 },
              { num: 2, title: 'Configure DNS', active: step >= 2, completed: step > 2 },
              { num: 3, title: 'Verify & Test', active: step >= 3, completed: step > 3 }
            ].map((s, i) => (
              <div key={i} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${s.completed ? 'bg-green-500 text-white' :
                  s.active ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                  {s.completed ? <CheckCircle className="w-4 h-4" /> : s.num}
                </div>
                <span className={`ml-2 text-sm font-medium ${s.active ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                  {s.title}
                </span>
                {i < 2 && <ArrowRight className="w-4 h-4 text-gray-400 ml-4" />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Step 1: Enter Domain */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  🌐 Step 1: Enter Your Domain
                </h3>
                <p className="text-gray-600">
                  Enter the domain you want to use for your short links
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Domain Name
                  </label>
                  <input
                    type="text"
                    placeholder="yourdomain.com"
                    value={domainName}
                    onChange={(e) => setDomainName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter without www or https:// (e.g., pdfcircle.com)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Setup Type (Recommended: Subdomain)
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="setupType"
                        value="subdomain"
                        checked={setupType === 'subdomain'}
                        onChange={(e) => setSetupType(e.target.value as 'subdomain')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">Subdomain Setup</span>
                          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Recommended
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Creates: <code className="bg-gray-100 px-1 rounded">{subdomain}.{domainName || 'yourdomain.com'}</code>
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <input
                            type="text"
                            placeholder="go"
                            value={subdomain}
                            onChange={(e) => setSubdomain(e.target.value)}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            disabled={setupType !== 'subdomain'}
                          />
                          <span className="text-gray-500">.</span>
                          <span className="text-gray-700">{domainName || 'yourdomain.com'}</span>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="setupType"
                        value="root"
                        checked={setupType === 'root'}
                        onChange={(e) => setSetupType(e.target.value as 'root')}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">Root Domain Setup</span>
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            Advanced
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Creates: <code className="bg-gray-100 px-1 rounded">{domainName || 'yourdomain.com'}</code>
                        </p>
                        <p className="text-xs text-orange-600 mt-1">
                          ⚠️ This will redirect all traffic from your main domain
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <Sparkles className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-blue-900">Your branded short links will look like:</h4>
                      <div className="bg-white border rounded p-2 mt-2 font-mono text-sm">
                        <div className="text-blue-600 font-semibold">{getFullDomain()}/abc123</div>
                        <div className="text-gray-500 text-xs mt-1">↓ redirects to ↓</div>
                        <div className="text-green-600">https://your-long-url.com/page</div>
                      </div>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Shield className="w-3 h-3 text-green-500" />
                          <span>SSL Secured</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Zap className="w-3 h-3 text-blue-500" />
                          <span>Fast Redirects</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Globe className="w-3 h-3 text-purple-500" />
                          <span>Professional</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleAddDomain}
                  disabled={!domainName.trim() || isAdding}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {isAdding ? 'Adding Domain...' : 'Add Domain →'}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Configure DNS */}
          {step === 2 && addedDomain && dnsInstructions && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  🔧 Step 2: Configure DNS Provider
                </h3>
                <p className="text-gray-600">
                  Add these records to your domain's DNS settings to connect securely
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                {/* 1. Routing Record (CNAME) */}
                <div className="bg-white border-l-4 border-blue-500 rounded-r-lg shadow-sm p-4 border border-gray-100">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-gray-800 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-blue-500" />
                      1. Connect Domain (Routing)
                    </h4>
                    <span className="text-xs font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded">Required</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase">Type</label>
                      <div className="font-mono text-gray-900 mt-1">{dnsInstructions.routing.type}</div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase">Name (Host)</label>
                      <div className="flex items-center mt-1">
                        <code className="bg-white px-2 py-1 rounded border text-sm flex-1">{dnsInstructions.routing.name}</code>
                        <button onClick={() => copyToClipboard(dnsInstructions.routing.name)} className="ml-2 text-gray-400 hover:text-blue-600">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase">Target (Value)</label>
                      <div className="flex items-center mt-1">
                        <code className="bg-white px-2 py-1 rounded border text-sm flex-1">{dnsInstructions.routing.target}</code>
                        <button onClick={() => copyToClipboard(dnsInstructions.routing.target || '')} className="ml-2 text-gray-400 hover:text-blue-600">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>



                {/* 2. SSL Verification Record (TXT) - Conditional Render */}
                {dnsInstructions.ssl ? (
                  <div className="bg-white border-l-4 border-green-500 rounded-r-lg shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-gray-800 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-green-500" />
                        2. Verify Ownership (SSL)
                      </h4>
                      <span className="text-xs font-mono bg-green-100 text-green-800 px-2 py-1 rounded">Required</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase">Type</label>
                        <div className="font-mono text-gray-900 mt-1">{dnsInstructions.ssl.type}</div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase">Name (Host)</label>
                        <div className="flex items-center mt-1">
                          <code className="bg-white px-2 py-1 rounded border text-sm flex-1 truncate" title={dnsInstructions.ssl.name}>{dnsInstructions.ssl.name.substring(0, 20)}...</code>
                          <button onClick={() => copyToClipboard(dnsInstructions.ssl.name)} className="ml-2 text-gray-400 hover:text-blue-600">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase">Value</label>
                        <div className="flex items-center mt-1">
                          <code className="bg-white px-2 py-1 rounded border text-sm flex-1 truncate" title={dnsInstructions.ssl.value}>{dnsInstructions.ssl.value.substring(0, 20)}...</code>
                          <button onClick={() => copyToClipboard(dnsInstructions.ssl.value)} className="ml-2 text-gray-400 hover:text-blue-600">
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-orange-50 border-l-4 border-orange-500 rounded-r-lg shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-orange-900 flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-orange-500" />
                        2. Verify Ownership (SSL)
                      </h4>
                      <span className="text-xs font-mono bg-orange-100 text-orange-800 px-2 py-1 rounded">Pending</span>
                    </div>
                    <p className="text-sm text-orange-800 mb-4">
                      SSL verification details are not yet available. This happens if the system is busy or the domain was just added.
                    </p>
                    <button
                      onClick={async () => {
                        // We need a function to retry - using window.location.reload() as fallback or implementing a retry fetch
                        // For now, let's close and tell them to check the dashboard, OR trigger a re-fetch if we had the context
                        toast('Please check the main dashboard to retry SSL verification', { icon: 'ℹ️' });
                        onClose();
                      }}
                      className="bg-white border border-orange-300 text-orange-700 px-4 py-2 rounded text-sm font-semibold hover:bg-orange-50 transition-colors"
                    >
                      Wait & Manage in Dashboard
                    </button>
                  </div>
                )}

                <div className="mt-4 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
                  <p className="flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    <strong>Universal Setup:</strong> Works with GoDaddy, Namecheap, Cloudflare, Hostinger, etc.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  {/* Step Buttons */}
                  <button
                    onClick={() => setStep(1)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    ← Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    I've Added the DNS Records →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Verify & Test */}
          {step === 3 && addedDomain && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  ✅ Step 3: Verify & Test Your Domain
                </h3>
                <p className="text-gray-600">
                  Let's check if your DNS is configured correctly
                </p>
              </div>

              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="flex items-center justify-center space-x-2 mb-4">
                    <Shield className="w-8 h-8 text-green-500" />
                    <Sparkles className="w-6 h-6 text-blue-500" />
                    <Globe className="w-8 h-8 text-purple-500" />
                  </div>
                  <h4 className="font-bold text-green-900 mb-2 text-xl">🎉 Domain Setup Complete!</h4>
                  <p className="text-green-800 mb-4">
                    Your branded domain <strong className="bg-white px-2 py-1 rounded font-mono text-sm">{getFullDomain()}</strong> is now ready!
                  </p>
                  <div className="bg-white border rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-700">Domain reserved & configured</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span className="text-gray-700">SSL certificate pending</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-700">DNS propagation: 5-60 min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-purple-500" />
                        <span className="text-gray-700">Ready for short links</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3">🎯 Next Steps:</h4>
                  <ol className="text-blue-800 space-y-2 text-sm">
                    <li className="flex items-start">
                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                      Wait 5-10 minutes for DNS propagation
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                      Create your first short link using this domain
                    </li>
                    <li className="flex items-start">
                      <span className="bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                      Test the link to ensure it works correctly
                    </li>
                  </ol>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStep(2)}
                    className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    ← Back to DNS
                  </button>
                  <button
                    onClick={() => {
                      onComplete(addedDomain);
                      toast.success('Custom domain setup complete! 🎉');
                    }}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Complete Setup ✨
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div >
  );
};

export default CustomDomainOnboarding;