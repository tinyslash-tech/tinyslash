import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useSubscription } from '../context/SubscriptionContext';
import { useFeatureAccess } from '../hooks/useFeatureAccess';
import { AdvancedSettings } from './dashboard/CreateSection/ui/AdvancedSettings';
import { UrlCreate } from './dashboard/CreateSection/modes/UrlCreate';
import {
  DEFAULT_DOMAIN,
  SmartLinkPreview,
  GeoConfig,
  DeepLinkConfig,
  LeadLockConfig,
  TrustBadgeConfig,
  SmartActionConfig
} from './dashboard/CreateSection/types';

interface EditLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: any; // Using any for flexibility with ShortenedLink interface
  onUpdate: () => void;
}

const EditLinkModal: React.FC<EditLinkModalProps> = ({
  isOpen,
  onClose,
  link,
  onUpdate
}) => {
  const { user } = useAuth();
  const { showUpgradeModal } = useSubscription();
  const upgradeModal = { open: (title: string, msg: string) => showUpgradeModal(title) }; // Mock for now or use real context if available
  const featureAccess = useFeatureAccess(user);

  // Form State
  const [originalUrl, setOriginalUrl] = useState('');
  const [title, setTitle] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');

  // Advanced Settings State
  const [selectedDomain, setSelectedDomain] = useState(DEFAULT_DOMAIN);
  const [customAlias, setCustomAlias] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [expirationDays, setExpirationDays] = useState<number | ''>('');
  const [maxClicks, setMaxClicks] = useState<number | ''>('');
  const [isOneTime, setIsOneTime] = useState(false);

  // Feature Configs
  const [smartLinkPreview, setSmartLinkPreview] = useState<SmartLinkPreview>({ enabled: false, title: '', description: '' });
  const [geoConfig, setGeoConfig] = useState<GeoConfig>({ enabled: true, rules: [], defaultUrl: '' });
  const [deepLinkConfig, setDeepLinkConfig] = useState<DeepLinkConfig>({ enabled: false });
  const [leadLockConfig, setLeadLockConfig] = useState<LeadLockConfig>({
    enabled: false,
    leadType: 'WHATSAPP',
    otpEnabled: true,
    askOnce: true,
    autoRedirect: true
  });
  const [trustBadgeConfig, setTrustBadgeConfig] = useState<TrustBadgeConfig>({ enabled: false, requested: false });
  const [smartActionConfig, setSmartActionConfig] = useState<SmartActionConfig>({
    enabled: false,
    whatsapp: { enabled: false, number: '', message: '' },
    instagram: { enabled: false, url: '' },
    website: { enabled: false, url: '', label: '' }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize data
  useEffect(() => {
    if (link && isOpen) {
      setOriginalUrl(link.originalUrl || '');
      setTitle(link.title || '');
      setUtmSource(link.utmSource || '');
      setUtmMedium(link.utmMedium || '');
      setUtmCampaign(link.utmCampaign || '');

      setSelectedDomain(link.domain || DEFAULT_DOMAIN);
      setCustomAlias(link.customAlias || '');
      // Password not usually sent back fully for security, but if we have it or isProtected
      setPassword(link.password || '');
      // Calculate expiration days difference if exists
      if (link.expiresAt) {
        const diff = Math.ceil((new Date(link.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        setExpirationDays(diff > 0 ? diff : '');
      } else {
        setExpirationDays('');
      }
      setMaxClicks(link.maxClicks || '');

      // Load other configs if they exist on the link object
      if (link.smartLinkPreview) setSmartLinkPreview(link.smartLinkPreview);
      if (link.geoConfig) setGeoConfig(link.geoConfig);
      if (link.deepLinkConfig) setDeepLinkConfig(link.deepLinkConfig);
      if (link.leadLockConfig) setLeadLockConfig(link.leadLockConfig);
      if (link.trustBadgeConfig) setTrustBadgeConfig(link.trustBadgeConfig);
      if (link.smartActionConfig) setSmartActionConfig(link.smartActionConfig);
    }
  }, [link, isOpen]);

  const handleSave = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
      const token = localStorage.getItem('token');

      const payload: any = {
        userId: user?.id,
        originalUrl,
        title,
        utmSource,
        utmMedium,
        utmCampaign,
        maxClicks: maxClicks === '' ? null : Number(maxClicks),
        expirationDays: expirationDays === '' ? null : Number(expirationDays),
        password: password,
        // Include other configs if backend supports them in update
      };

      const response = await fetch(`${apiUrl}/v1/urls/${link.shortCode}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Link updated successfully');
        onUpdate();
        onClose();
      } else {
        toast.error(result.message || 'Failed to update link');
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error('Failed to update link:', error);
      toast.error('Failed to update link');
      setErrorMessage('Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Edit Link</h2>
              <p className="text-sm text-gray-500">{link?.shortUrl}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Main URL & UTM Section */}
          <div className="space-y-6">
            <UrlCreate
              urlInput={originalUrl}
              setUrlInput={setOriginalUrl}
              campaignName={title} // Reusing title as campaign name for UI consistency
              setCampaignName={setTitle}
              utmSource={utmSource}
              setUtmSource={setUtmSource}
              utmMedium={utmMedium}
              setUtmMedium={setUtmMedium}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          </div>

          <div className="border-t border-gray-100 my-4"></div>

          {/* Advanced Settings */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Advanced Configuration</h3>
            <AdvancedSettings
              mode="url"
              selectedDomain={selectedDomain}
              setSelectedDomain={setSelectedDomain}
              customDomains={[]} // Pass actual domains if available, or fetch
              customAlias={customAlias}
              setCustomAlias={setCustomAlias}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              expirationDays={expirationDays}
              setExpirationDays={setExpirationDays}
              maxClicks={maxClicks}
              setMaxClicks={setMaxClicks}
              isOneTime={isOneTime}
              setIsOneTime={setIsOneTime}

              smartLinkPreview={smartLinkPreview}
              setSmartLinkPreview={setSmartLinkPreview}
              geoConfig={geoConfig}
              setGeoConfig={setGeoConfig}
              deepLinkConfig={deepLinkConfig}
              setDeepLinkConfig={setDeepLinkConfig}
              leadLockConfig={leadLockConfig}
              setLeadLockConfig={setLeadLockConfig}
              trustBadgeConfig={trustBadgeConfig}
              setTrustBadgeConfig={setTrustBadgeConfig}
              smartActionConfig={smartActionConfig}
              setSmartActionConfig={setSmartActionConfig}

              featureAccess={featureAccess}
              upgradeModal={upgradeModal}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium hover:bg-gray-200/50 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-600/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLinkModal;
