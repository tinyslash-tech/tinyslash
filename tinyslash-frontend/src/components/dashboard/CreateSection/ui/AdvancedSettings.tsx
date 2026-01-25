import React, { useState } from 'react';
import { Zap, Lock, Sparkles, Eye, EyeOff, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { DEFAULT_DOMAIN, WhatsAppPreview, GeoConfig, DeepLinkConfig, LeadLockConfig, TrustBadgeConfig } from '../types';
import { GrowthMarketing } from './GrowthMarketing';
import { SecurityTrust } from './SecurityTrust';

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

  // New Feature Props
  whatsappPreview: WhatsAppPreview;
  setWhatsappPreview: (config: WhatsAppPreview) => void;
  geoConfig: GeoConfig;
  setGeoConfig: (config: GeoConfig) => void;
  deepLinkConfig: DeepLinkConfig;
  setDeepLinkConfig: (config: DeepLinkConfig) => void;
  leadLockConfig: LeadLockConfig;
  setLeadLockConfig: (config: LeadLockConfig) => void;
  trustBadgeConfig: TrustBadgeConfig;
  setTrustBadgeConfig: (config: TrustBadgeConfig) => void;

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
  whatsappPreview,
  setWhatsappPreview,
  geoConfig,
  setGeoConfig,
  deepLinkConfig,
  setDeepLinkConfig,
  leadLockConfig,
  setLeadLockConfig,
  trustBadgeConfig,
  setTrustBadgeConfig,
  featureAccess,
  upgradeModal
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'growth' | 'security'>('basic');
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors text-gray-700 font-medium"
      >
        <span className="flex items-center">
          <Settings className="w-5 h-5 mr-2 text-gray-500" />
          Advanced Settings
        </span>
        <ChevronDown className="w-5 h-5 text-gray-400" />
      </button>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300">
      {/* Header */}
      <button
        onClick={() => setIsOpen(false)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200 text-gray-700 font-medium"
      >
        <span className="flex items-center">
          <Settings className="w-5 h-5 mr-2 text-blue-600" />
          Advanced Settings
        </span>
        <ChevronUp className="w-5 h-5 text-gray-400" />
      </button>

      {/* Tabs / Navigation */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('basic')}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === 'basic' ? 'border-blue-600 text-blue-600 bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          Basic Controls
        </button>
        <button
          onClick={() => setActiveTab('growth')}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === 'growth' ? 'border-purple-600 text-purple-600 bg-purple-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          🟣 Growth & Marketing
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${activeTab === 'security' ? 'border-teal-600 text-teal-600 bg-teal-50/50' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          🛡️ Security & Trust
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-6 bg-white min-h-[300px]">
        {activeTab === 'basic' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
            {/* Copied existing basic controls layout */}
            {/* Domain Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Domain</label>
              <div className="relative">
                <select
                  value={selectedDomain}
                  onChange={(e) => {
                    if (e.target.value === 'ADD_CUSTOM_DOMAIN') {
                      e.preventDefault();
                      setSelectedDomain(DEFAULT_DOMAIN);
                      if (!featureAccess.canUseCustomDomain) {
                        upgradeModal.open('Custom Domains', 'Unlock custom domains...', false);
                      } else {
                        window.location.href = '/dashboard?section=domains&action=onboard';
                      }
                    } else {
                      setSelectedDomain(e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  {customDomains.map(domain => (
                    <option key={domain} value={domain}>{domain}</option>
                  ))}
                  <option value="ADD_CUSTOM_DOMAIN" className="text-blue-600 font-medium">+ Add Custom Domain</option>
                </select>
              </div>
            </div>

            {/* Custom Alias */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Custom Alias</label>
                {!featureAccess.canUseCustomAlias && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 cursor-pointer" onClick={() => upgradeModal.open('Custom Alias', '...', false)}>
                    <Zap className="w-3 h-3 mr-1" /> Pro
                  </span>
                )}
              </div>
              <input
                type="text"
                placeholder={featureAccess.canUseCustomAlias ? "my-custom-link" : "Pro only"}
                value={customAlias}
                onChange={(e) => !featureAccess.canUseCustomAlias ? upgradeModal.open('Custom Alias', '...', false) : setCustomAlias(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                disabled={!featureAccess.canUseCustomAlias}
              />
            </div>

            {/* Password Protection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Password</label>
                {!featureAccess.canUsePasswordProtection && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 cursor-pointer" onClick={() => upgradeModal.open('Password', '...', false)}>
                    <Lock className="w-3 h-3 mr-1" /> Pro
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={featureAccess.canUsePasswordProtection ? "Optional" : "Pro only"}
                  value={password}
                  onChange={(e) => !featureAccess.canUsePasswordProtection ? upgradeModal.open('Password', '...', false) : setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg"
                  disabled={!featureAccess.canUsePasswordProtection}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" disabled={!featureAccess.canUsePasswordProtection}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* One-Time */}
            <div className="flex items-end">
              <label className="w-full flex items-center space-x-3 p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer h-[42px]">
                <input
                  type="checkbox"
                  checked={isOneTime}
                  onChange={(e) => setIsOneTime(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Self-Destruct (One-time)</span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'growth' && (
          <div className="animate-fadeIn">
            <GrowthMarketing
              whatsappPreview={whatsappPreview}
              setWhatsappPreview={setWhatsappPreview}
              geoConfig={geoConfig}
              setGeoConfig={setGeoConfig}
              deepLinkConfig={deepLinkConfig}
              setDeepLinkConfig={setDeepLinkConfig}
              leadLockConfig={leadLockConfig}
              setLeadLockConfig={setLeadLockConfig}
              featureAccess={featureAccess}
              upgradeModal={upgradeModal}
            />
          </div>
        )}

        {activeTab === 'security' && (
          <div className="animate-fadeIn">
            <SecurityTrust
              trustBadgeConfig={trustBadgeConfig}
              setTrustBadgeConfig={setTrustBadgeConfig}
              featureAccess={featureAccess}
              upgradeModal={upgradeModal}
            />
          </div>
        )}
      </div>
    </div>
  );
};
