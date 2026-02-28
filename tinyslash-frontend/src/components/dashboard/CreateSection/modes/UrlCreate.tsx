import React, { useState } from 'react';
import { AlertCircle, ChevronDown, Megaphone } from 'lucide-react';
import { SecurityError } from '../ui/SecurityError';
import { TemplateSelector } from '../ui/TemplateSelector';
import { PlatformDropdown } from '../../../ui/PlatformDropdown';
import { UtmTemplate } from '../../../../services/utmTemplateService';

const PLATFORM_OPTIONS = [
  { label: 'Select Platform', value: '' },
  { label: 'LinkedIn', value: 'linkedin' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Twitter / X', value: 'twitter' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Email', value: 'email' },
  { label: 'Blog', value: 'blog' },
  { label: 'Other', value: 'other' },
];

const TYPE_OPTIONS = [
  { label: 'Select Type', value: '' },
  { label: 'Social Post', value: 'social' },
  { label: 'Paid Ad', value: 'cpc' },
  { label: 'Email Campaign', value: 'email' },
  { label: 'Referral', value: 'referral' },
  { label: 'Blog Post', value: 'blog' },
  { label: 'WhatsApp Message', value: 'whatsapp' },
  { label: 'Other', value: 'other' },
];

interface UrlCreateProps {
  urlInput: string;
  setUrlInput: (value: string) => void;
  campaignName: string;
  setCampaignName: (value: string) => void;
  utmSource: string;
  setUtmSource: (value: string) => void;
  utmMedium: string;
  setUtmMedium: (value: string) => void;
  errorMessage: string | null;
  setErrorMessage: (msg: string | null) => void;
}

export const UrlCreate: React.FC<UrlCreateProps> = ({
  urlInput,
  setUrlInput,
  campaignName,
  setCampaignName,
  utmSource,
  setUtmSource,
  utmMedium,
  setUtmMedium,
  errorMessage,
  setErrorMessage
}) => {
  const [showCampaign, setShowCampaign] = useState(
    !!(campaignName || utmSource || utmMedium)
  );

  return (
    <div>
      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">
        Enter URL to shorten
      </label>
      <div className="relative">
        <input
          type="url"
          placeholder="https://example.com/very-long-url..."
          value={urlInput}
          onChange={(e) => {
            setUrlInput(e.target.value);
            setErrorMessage(null);
          }}
          className={`w-full px-3 sm:px-4 py-3 sm:py-4 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base ${errorMessage ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
        />
      </div>
      <SecurityError message={errorMessage} />

      {/* Campaign Tracking Toggle */}
      <button
        type="button"
        onClick={() => setShowCampaign(!showCampaign)}
        className="mt-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors group"
      >
        <Megaphone className="w-4 h-4 text-blue-500 group-hover:text-blue-600" />
        <span className="font-medium">Campaign Tracking</span>
        <span className="text-xs text-gray-400">(Optional)</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCampaign ? 'rotate-180' : ''}`} />
      </button>

      {showCampaign && (
        <div className="mt-3 p-4 bg-gradient-to-br from-blue-50/60 to-indigo-50/40 border border-blue-100 rounded-xl space-y-3 animate-in slide-in-from-top-2">

          <TemplateSelector
            onSelect={(template: UtmTemplate) => {
              if (template.utmCampaign) setCampaignName(template.utmCampaign);
              if (template.utmSource) setUtmSource(template.utmSource);
              if (template.utmMedium) setUtmMedium(template.utmMedium);
              // Handle custom values if necessary in the UI or backend map
            }}
          />

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Campaign Name
            </label>
            <input
              type="text"
              placeholder="e.g., Summer Sale 2026"
              value={campaignName}
              onChange={(e) => setCampaignName(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Platform (UTM Source)
              </label>
              <PlatformDropdown
                value={utmSource}
                onChange={setUtmSource}
                placeholder="e.g. linkedin, facebook"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1.5">
                Type (UTM Medium)
              </label>
              <input
                type="text"
                list="type-options"
                value={utmMedium}
                onChange={(e) => setUtmMedium(e.target.value)}
                placeholder="e.g. social, cpc"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
              />
              <datalist id="type-options">
                {TYPE_OPTIONS.filter(opt => opt.value !== '').map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </datalist>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
