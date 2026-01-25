import React from 'react';
import { Zap, Lock, Sparkles, Eye, EyeOff } from 'lucide-react';
import { DEFAULT_DOMAIN } from '../types';

interface AdvancedSettingsProps {
  // Domain Props
  selectedDomain: string;
  setSelectedDomain: (domain: string) => void;
  customDomains: string[];

  // Custom Alias Props
  customAlias: string;
  setCustomAlias: (alias: string) => void;

  // Password Props
  password: string;
  setPassword: (pass: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;

  // Expiration Props
  expirationDays: number | '';
  setExpirationDays: (days: number | '') => void;

  // Max Clicks Props
  maxClicks: number | '';
  setMaxClicks: (clicks: number | '') => void;

  // One Time Props
  isOneTime: boolean;
  setIsOneTime: (isOneTime: boolean) => void;

  // Context Props
  featureAccess: any;
  upgradeModal: any;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  selectedDomain,
  setSelectedDomain,
  customDomains,
  customAlias,
  setCustomAlias,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  expirationDays,
  setExpirationDays,
  maxClicks,
  setMaxClicks,
  isOneTime,
  setIsOneTime,
  featureAccess,
  upgradeModal
}) => {
  return (
    <div className="space-y-6 pt-4 border-t border-gray-100">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Advanced Settings</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Domain Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Domain
          </label>
          <div className="relative">
            <select
              value={selectedDomain}
              onChange={(e) => {
                if (e.target.value === 'ADD_CUSTOM_DOMAIN') {
                  e.preventDefault();
                  // Reset selection first
                  setSelectedDomain(DEFAULT_DOMAIN);
                  // Check if user can use custom domains
                  if (!featureAccess.canUseCustomDomain) {
                    upgradeModal.open(
                      'Custom Domains',
                      'Unlock custom domains and professional branding for your links',
                      false
                    );
                  } else {
                    // User has access, navigate to domain management
                    window.location.href = '/dashboard?section=domains&action=onboard';
                  }
                  return;
                } else {
                  setSelectedDomain(e.target.value);
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {/* Default and custom domains */}
              {customDomains.map(domain => (
                <option key={domain} value={domain}>
                  {domain} {domain === DEFAULT_DOMAIN ? '(Default)' : ''}
                </option>
              ))}

              {/* Add Custom Domain option */}
              <option value="ADD_CUSTOM_DOMAIN" className="text-blue-600 font-medium">
                + Add Custom Domain
              </option>
            </select>
            <p className="text-xs text-gray-500 mt-1">Choose a domain for your shortened links</p>
          </div>
        </div>

        {/* Custom Alias */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Custom Alias (Optional)
            </label>
            {!featureAccess.canUseCustomAlias && (
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border border-purple-200 cursor-pointer hover:from-purple-200 hover:to-blue-200 transition-all duration-200 hover:shadow-sm"
                onClick={() => upgradeModal.open('Custom Alias', 'Create memorable branded short links with custom aliases.', false)}
              >
                <Zap className="w-3 h-3 mr-1" /> Pro
              </span>
            )}
          </div>
          <input
            type="text"
            placeholder={featureAccess.canUseCustomAlias ? "my-custom-link" : "Upgrade to Pro for custom aliases"}
            value={customAlias}
            onChange={(e) => {
              if (!featureAccess.canUseCustomAlias && e.target.value.trim()) {
                upgradeModal.open('Custom Alias', 'Create memorable branded short links with custom aliases.', false);
                return;
              }
              setCustomAlias(e.target.value);
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!featureAccess.canUseCustomAlias
              ? 'border-purple-200 bg-purple-50 placeholder-purple-400'
              : 'border-gray-300'
              }`}
            disabled={!featureAccess.canUseCustomAlias}
          />
        </div>

        {/* Password Protection */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Password Protection (Optional)
            </label>
            {!featureAccess.canUsePasswordProtection && (
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border border-purple-200 cursor-pointer"
                onClick={() => upgradeModal.open('Password Protection', 'Secure your links with password protection.', false)}
              >
                <Lock className="w-3 h-3 mr-1" /> Pro
              </span>
            )}
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder={featureAccess.canUsePasswordProtection ? "Optional password" : "Upgrade to Pro for password protection"}
              value={password}
              onChange={(e) => {
                if (!featureAccess.canUsePasswordProtection && e.target.value.trim()) {
                  upgradeModal.open('Password Protection', 'Secure your links with password protection.', false);
                  return;
                }
                setPassword(e.target.value);
              }}
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!featureAccess.canUsePasswordProtection
                ? 'border-purple-200 bg-purple-50 placeholder-purple-400'
                : 'border-gray-300'
                }`}
              disabled={!featureAccess.canUsePasswordProtection}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              disabled={!featureAccess.canUsePasswordProtection}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Expiration */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Expiration (Days)
            </label>
            {!featureAccess.canUseLinkExpiration && (
              <span
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border border-purple-200 cursor-pointer"
                onClick={() => upgradeModal.open('Link Expiration', 'Set expiration dates...', false)}
              >
                <Sparkles className="w-3 h-3 mr-1" /> Pro
              </span>
            )}
          </div>
          <input
            type="number"
            placeholder={featureAccess.canUseLinkExpiration ? "Never expires" : "Upgrade to Pro for link expiration"}
            value={expirationDays}
            onChange={(e) => {
              if (!featureAccess.canUseLinkExpiration && e.target.value.trim()) {
                upgradeModal.open('Link Expiration', 'Set expiration dates...', false);
                return;
              }
              setExpirationDays(e.target.value ? parseInt(e.target.value) : '');
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!featureAccess.canUseLinkExpiration
              ? 'border-purple-200 bg-purple-50 placeholder-purple-400'
              : 'border-gray-300'
              }`}
            disabled={!featureAccess.canUseLinkExpiration}
          />
        </div>

        {/* Max Clicks */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Max Clicks (Optional)
            </label>
            {!featureAccess.canUseClickLimits && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 border border-purple-200 cursor-pointer"
                onClick={() => upgradeModal.open('Click Limits', 'Control the maximum number of clicks...', false)}
              >
                <Sparkles className="w-3 h-3 mr-1" /> Pro
              </span>
            )}
          </div>
          <input
            type="number"
            placeholder={featureAccess.canUseClickLimits ? "No limit" : "Upgrade to Pro for click limits"}
            value={maxClicks}
            onChange={(e) => {
              if (!featureAccess.canUseClickLimits && e.target.value.trim()) {
                upgradeModal.open('Click Limits', 'Control the maximum number of clicks...', false);
                return;
              }
              setMaxClicks(e.target.value ? parseInt(e.target.value) : '');
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${!featureAccess.canUseClickLimits
              ? 'border-purple-200 bg-purple-50 placeholder-purple-400'
              : 'border-gray-300'
              }`}
            disabled={!featureAccess.canUseClickLimits}
          />
        </div>

        {/* One-Time Link */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">Self-Destruct</label>
          </div>
          <label className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <input
              type="checkbox"
              checked={isOneTime}
              onChange={(e) => setIsOneTime(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">One-time link (expires after 1 click)</span>
          </label>
        </div>
      </div>
    </div>
  );
};
