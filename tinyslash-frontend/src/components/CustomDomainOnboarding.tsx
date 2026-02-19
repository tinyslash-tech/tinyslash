import React, { useState, useEffect, useRef } from 'react';
import { Globe, CheckCircle, Copy, ExternalLink, ArrowRight, Sparkles, Shield, Zap, Server, ChevronRight, AlertTriangle, RefreshCw, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { addDomain, verifyDomain } from '../services/domainService';

interface CustomDomainOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (domain: any) => void;
  initialDomain?: any;
}

type WizardStep = 'INPUT' | 'PROVIDER_SELECT' | 'DNS_INSTRUCTIONS' | 'VERIFICATION' | 'SUCCESS';
type DomainType = 'SUBDOMAIN' | 'ROOT' | 'WWW';
type ProviderPath = 'CLOUDFLARE' | 'ALIAS' | 'GODADDY_MIGRATION' | 'UNKNOWN';

const CustomDomainOnboarding: React.FC<CustomDomainOnboardingProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialDomain
}) => {
  // --- State Management ---
  const { user } = useAuth();
  const [step, setStep] = useState<WizardStep>('INPUT');
  const [domainInput, setDomainInput] = useState('');
  const [domainType, setDomainType] = useState<DomainType>('SUBDOMAIN');
  const [detectedProvider, setDetectedProvider] = useState<ProviderPath>('UNKNOWN');
  const [addedDomain, setAddedDomain] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Enterprise State Machine
  const [verificationStatus, setVerificationStatus] = useState<'WAITING' | 'DNS_FOUND' | 'LIVE' | 'CONFLICT' | 'BLOCKED' | 'TIMEOUT' | 'MOVED' | 'MISCONFIGURED'>('WAITING');

  // Polling Refs for Smart Backoff
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pollAttemptsRef = useRef(0);

  // Universal proxy domain configuration
  const PROXY_DOMAIN = 'tinyslash.com';

  // --- Reset/Init Effect ---
  useEffect(() => {
    if (isOpen) {
      if (initialDomain) {
        // Resume existing domain
        setAddedDomain(initialDomain);
        setDomainInput(initialDomain.domainName);
        detectDomainType(initialDomain.domainName);
        setStep('VERIFICATION');
        startSmartPolling(); // Start polling if reopening known domain
      } else {
        // Start fresh
        setStep('INPUT');
        setDomainInput('');
        setVerificationStatus('WAITING');
        pollAttemptsRef.current = 0;
      }
    }
    return () => stopPolling();
  }, [isOpen, initialDomain]);

  // --- Helpers ---
  const detectDomainType = (input: string) => {
    const clean = input.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    const parts = clean.split('.');

    if (parts.length > 2) {
      if (parts[0] === 'www') {
        setDomainType('WWW');
      } else {
        setDomainType('SUBDOMAIN');
      }
    } else {
      setDomainType('ROOT');
    }
    return clean;
  };

  const stopPolling = () => {
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // --- Actions ---

  const handleDomainSubmit = async () => {
    const cleanDomain = domainInput.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!cleanDomain.includes('.')) {
      toast.error('Please enter a valid domain (e.g., go.yoursite.com)');
      return;
    }

    const type = detectDomainType(cleanDomain); // Update state
    setIsAdding(true);

    try {
      // Create domain in backend
      const response = await addDomain(cleanDomain, 'USER');

      if (response.success) {
        setAddedDomain(response.domain);

        if (type === 'ROOT' || type === 'WWW') {
          setStep('PROVIDER_SELECT');
        } else {
          setStep('DNS_INSTRUCTIONS');
        }
      } else {
        toast.error(response.message || 'Failed to add domain');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error adding domain');
    } finally {
      setIsAdding(false);
    }
  };

  // --- Smart Polling Logic (Enterprise 10/10) ---
  const startSmartPolling = () => {
    if (pollTimeoutRef.current) return;
    setVerificationStatus('WAITING');
    pollAttemptsRef.current = 0;
    runPollLoop();
  };

  const runPollLoop = async () => {
    if (!addedDomain) return;

    try {
      const res = await verifyDomain(addedDomain.id, { verificationMethod: 'poll' });

      if (res.success && res.domain) {
        const { status, sslStatus, verificationError } = res.domain;

        // Map Backend Status to UI State
        if (status === 'VERIFIED') {
          setVerificationStatus('LIVE');
          stopPolling();
          return; // Stop loop
        } else if (status === 'MOVED') {
          setVerificationStatus('MOVED');
          stopPolling();
          return;
        } else if (status === 'BLOCKED') {
          setVerificationStatus('BLOCKED');
          stopPolling();
          return;
        } else if (status === 'MISCONFIGURED') {
          setVerificationStatus('MISCONFIGURED');
          stopPolling(); // Stop, user needs to fix
          return;
        }

        // Granular Verification States
        if (sslStatus === 'PENDING' && !verificationError?.includes('DNS')) {
          setVerificationStatus('DNS_FOUND'); // DNS passed, waiting for SSL
        } else {
          setVerificationStatus('WAITING'); // Waiting for DNS
        }
      }
    } catch (err) {
      console.error('Polling error', err);
    }

    // Determine Next Delay (Backoff Strategy)
    pollAttemptsRef.current += 1;
    let delay = 5000; // Default 5s (Active Phase)

    if (verificationStatus === 'DNS_FOUND') {
      delay = 30000; // SSL takes longer, poll slower (30s)
    } else if (pollAttemptsRef.current > 24) { // > 2 mins
      delay = 60000; // 1 min backoff
    } else if (pollAttemptsRef.current > 120) { // > 10 mins
      setVerificationStatus('TIMEOUT');
      stopPolling();
      return;
    }

    // Recursively schedule next poll
    pollTimeoutRef.current = setTimeout(runPollLoop, delay);
  };

  const handleRestartVerification = () => {
    stopPolling();
    startSmartPolling();
  };

  // --- Renders ---

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-sans">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col">

        {/* Header - Minimal & Clean */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <Globe className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Add Custom Domain</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8 flex-1">

          {/* STEP 1: Enter Domain */}
          {step === 'INPUT' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">What domain do you want to use?</h3>
                <p className="text-gray-500">Enter the domain for your branded short links</p>
              </div>

              <div className="max-w-md mx-auto">
                <input
                  autoFocus
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  placeholder="go.yoursite.com"
                  className="w-full text-center text-2xl font-medium border-b-2 border-gray-200 focus:border-blue-600 focus:outline-none py-4 placeholder:text-gray-300 transition-colors"
                />
                <div className="flex justify-center mt-4 space-x-2 text-sm text-gray-400">
                  <span>Examples:</span>
                  <span className="text-gray-600">go.yoursite.com</span>
                  <span>·</span>
                  <span className="text-gray-600">yoursite.com</span>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <button
                  onClick={handleDomainSubmit}
                  disabled={!domainInput.trim() || isAdding}
                  className="flex items-center space-x-2 bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                >
                  {isAdding ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Continue</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Provider Selection (Root/WWW Only) */}
          {step === 'PROVIDER_SELECT' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Where is {addedDomain?.domainName}'s DNS managed?</h3>
              </div>

              <div className="space-y-3 max-w-lg mx-auto">
                {/* Option 1: Cloudflare */}
                <button
                  onClick={() => { setDetectedProvider('CLOUDFLARE'); setStep('DNS_INSTRUCTIONS'); }}
                  className="w-full flex items-center p-4 border rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
                >
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-lg mr-4 group-hover:bg-white transition-colors">
                    <CloudIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Cloudflare DNS</div>
                    <div className="text-sm text-gray-500">I use Cloudflare nameservers</div>
                  </div>
                  <ChevronRight className="w-5 h-5 ml-auto text-gray-300 group-hover:text-blue-500" />
                </button>

                {/* Option 2: ALIAS Providers */}
                <button
                  onClick={() => { setDetectedProvider('ALIAS'); setStep('DNS_INSTRUCTIONS'); }}
                  className="w-full flex items-center p-4 border rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group text-left"
                >
                  <div className="p-2 bg-green-100 text-green-600 rounded-lg mr-4 group-hover:bg-white transition-colors">
                    <Server className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Namecheap / Route53 / DNSimple</div>
                    <div className="text-sm text-gray-500">My provider supports ALIAS records</div>
                  </div>
                  <ChevronRight className="w-5 h-5 ml-auto text-gray-300 group-hover:text-blue-500" />
                </button>

                {/* Option 3: GoDaddy/Other (Default Recommended) */}
                <button
                  onClick={() => { setDetectedProvider('GODADDY_MIGRATION'); setStep('DNS_INSTRUCTIONS'); }}
                  className="w-full flex items-center p-4 border-2 border-blue-100 bg-blue-50/50 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group text-left relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-bl-lg font-medium">Recommended</div>
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg mr-4 group-hover:bg-white transition-colors">
                    <Globe className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">GoDaddy / Hostinger / Other</div>
                    <div className="text-sm text-gray-500">I'm not sure, or provider not listed</div>
                  </div>
                  <ChevronRight className="w-5 h-5 ml-auto text-gray-300 group-hover:text-blue-500" />
                </button>
              </div>

              <div className="flex justify-center pt-4">
                <button onClick={() => setStep('INPUT')} className="text-sm text-gray-500 hover:text-gray-900">
                  ← Back
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: DNS Instructions */}
          {step === 'DNS_INSTRUCTIONS' && addedDomain && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">

              {/* Header based on path */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900">Add these records to your DNS</h3>
                <p className="text-gray-500 text-sm mt-1">
                  {detectedProvider === 'CLOUDFLARE' ? 'Log in to your Cloudflare dashboard' :
                    detectedProvider === 'GODADDY_MIGRATION' ? 'We recommend moving DNS to Cloudflare (Free)' :
                      'Log in to your domain provider'}
                </p>
              </div>

              {/* Instructions Card */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 bg-gray-100 p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-200">
                  <div className="col-span-2">Type</div>
                  <div className="col-span-3">Name</div>
                  <div className="col-span-5">Value</div>
                  <div className="col-span-2 text-right">Action</div>
                </div>

                {/* Record 1: Routing (CNAME/ALIAS) */}
                <div className="grid grid-cols-12 gap-2 p-3 items-center border-b border-gray-100 hover:bg-white transition-colors">
                  <div className="col-span-2 font-mono text-sm font-semibold text-gray-700">
                    {detectedProvider === 'ALIAS' ? 'ALIAS' : 'CNAME'}
                  </div>
                  <div className="col-span-3 font-mono text-sm text-gray-600 truncate" title={domainType === 'SUBDOMAIN' ? addedDomain.domainName.split('.')[0] : '@'}>
                    {domainType === 'SUBDOMAIN' ? addedDomain.domainName.split('.')[0] : '@'}
                  </div>
                  <div className="col-span-5 font-mono text-sm text-blue-600 truncate" title={PROXY_DOMAIN}>
                    {PROXY_DOMAIN}
                  </div>
                  <div className="col-span-2 text-right">
                    <button onClick={() => copyToClipboard(PROXY_DOMAIN)} className="text-gray-400 hover:text-blue-600 p-1">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Record 2: SSL (TXT) */}
                <div className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-white transition-colors">
                  <div className="col-span-2 font-mono text-sm font-semibold text-gray-700">TXT</div>
                  <div className="col-span-3 font-mono text-sm text-gray-600">@</div>
                  <div className="col-span-5 font-mono text-sm text-blue-600 truncate" title={`tinyslash-verify=${addedDomain.verificationToken}`}>
                    tinyslash-verify={addedDomain.verificationToken?.substring(0, 8)}...
                  </div>
                  <div className="col-span-2 text-right">
                    <button onClick={() => copyToClipboard(`tinyslash-verify=${addedDomain.verificationToken}`)} className="text-gray-400 hover:text-blue-600 p-1">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Path Specific Warnings/Info */}
              {detectedProvider === 'CLOUDFLARE' && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                  <div className="text-sm text-orange-800">
                    <strong>Important:</strong> Set the CNAME record to <strong>DNS Only (Grey Cloud)</strong> initially. You can enable the Orange Cloud after verification.
                  </div>
                </div>
              )}

              {detectedProvider === 'GODADDY_MIGRATION' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Why Cloudflare?</strong> Better speed, free SSL, and reliability.
                  </p>
                  <p className="text-xs text-blue-600 mb-2">
                    ⚠️ <strong>Root Domain Warning:</strong> If you stay with GoDaddy, you MUST use 'www' subdomain or migrate to a provider supporting ALIAS records. Root domains (non-www) with A records are <strong>not recommended</strong>.
                  </p>
                  <a href="https://dash.cloudflare.com/sign-up" target="_blank" rel="noreferrer" className="text-xs font-semibold text-blue-600 hover:underline flex items-center">
                    Open Cloudflare Sign Up <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}

              <div className="flex justify-between items-center pt-4">
                <button onClick={() => setStep(domainType === 'SUBDOMAIN' ? 'INPUT' : 'PROVIDER_SELECT')} className="text-sm text-gray-500 hover:text-gray-900">
                  ← Back
                </button>
                <button
                  onClick={() => { setStep('VERIFICATION'); startSmartPolling(); }}
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
                >
                  I've added these records
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Verification & Polling */}
          {step === 'VERIFICATION' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300 text-center py-6">

              <div className="relative inline-block">
                {/* Status Icon */}
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-colors duration-500 ${verificationStatus === 'LIVE' ? 'bg-green-100' :
                  verificationStatus === 'DNS_FOUND' ? 'bg-blue-100' :
                    verificationStatus === 'MISCONFIGURED' || verificationStatus === 'BLOCKED' ? 'bg-red-100' :
                      'bg-gray-100'
                  }`}>
                  {verificationStatus === 'LIVE' ? <CheckCircle className="w-10 h-10 text-green-600" /> :
                    verificationStatus === 'DNS_FOUND' ? <Shield className="w-10 h-10 text-blue-600 animate-pulse" /> :
                      verificationStatus === 'MISCONFIGURED' || verificationStatus === 'BLOCKED' ? <AlertTriangle className="w-10 h-10 text-red-600" /> :
                        <RefreshCw className="w-10 h-10 text-gray-400 animate-spin" />}
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  {verificationStatus === 'LIVE' ? '🎉 Domain is Live!' :
                    verificationStatus === 'DNS_FOUND' ? 'Issuing SSL Certificate...' :
                      verificationStatus === 'MISCONFIGURED' ? 'Configuration Issue' :
                        verificationStatus === 'BLOCKED' ? 'Verification Blocked' :
                          verificationStatus === 'MOVED' ? 'Domain Moved' :
                            verificationStatus === 'TIMEOUT' ? 'Verification Timed Out' :
                              'Checking DNS Records...'}
                </h3>
                <p className="text-gray-500 max-w-sm mx-auto">
                  {verificationStatus === 'LIVE' ? `You can now create branded links with ${addedDomain?.domainName}` :
                    verificationStatus === 'DNS_FOUND' ? 'DNS is verified. We are now provisioning your free SSL certificate.' :
                      verificationStatus === 'MISCONFIGURED' ? 'We can\'t detect the DNS records. Please check your provider settings.' :
                        verificationStatus === 'BLOCKED' ? 'Cloudflare has blocked this domain. Please contact support.' :
                          verificationStatus === 'MOVED' ? 'This domain is active on another Cloudflare account. Please remove it first.' :
                            verificationStatus === 'TIMEOUT' ? 'We stopped checking after 10 minutes. Click retry to continue.' :
                              'We check automatically every few seconds. DNS changes can take 5-30 minutes.'}
                </p>
              </div>

              {/* Progress Bar (Fake Visual) */}
              {(verificationStatus === 'WAITING' || verificationStatus === 'DNS_FOUND') && (
                <div className="max-w-xs mx-auto w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-blue-600 rounded-full transition-all duration-1000 ${verificationStatus === 'DNS_FOUND' ? 'w-2/3' : 'w-1/3 animate-pulse'
                    }`} />
                </div>
              )}

              {/* Action Buttons based on Status */}
              {verificationStatus === 'LIVE' && (
                <div className="pt-4 animate-in zoom-in duration-300">
                  <button
                    onClick={() => { onComplete(addedDomain); onClose(); }}
                    className="bg-black text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform shadow-lg hover:shadow-xl"
                  >
                    Create Your First Link →
                  </button>
                </div>
              )}

              {/* Retry / Back Actions */}
              {(verificationStatus === 'MISCONFIGURED' || verificationStatus === 'TIMEOUT' || verificationStatus === 'WAITING') && (
                <div className="pt-8 space-y-4">
                  {(verificationStatus === 'MISCONFIGURED' || verificationStatus === 'TIMEOUT') && (
                    <button
                      onClick={handleRestartVerification}
                      className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center mx-auto space-x-2"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Retry Verification</span>
                    </button>
                  )}

                  <button onClick={() => setStep('DNS_INSTRUCTIONS')} className="text-sm text-gray-400 hover:text-gray-600 block mx-auto">
                    View DNS instructions
                  </button>
                </div>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

// Simple Icon Components to replace missing imports if any
const CloudIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17.5 19c0-1.7-1.3-3-3-3h-11c-1.7 0-3 1.3-3 3s1.3 3 3 3h11c1.7 0 3-1.3 3-3z" /><path d="M17.5 19c0-3.3-2.7-6-6-6-.5 0-1 .1-1.4 .3A6 6 0 0 1 5.3 16" /><path d="M22 13a4.5 4.5 0 0 0-7.3-3.6" /></svg>
);

export default CustomDomainOnboarding;