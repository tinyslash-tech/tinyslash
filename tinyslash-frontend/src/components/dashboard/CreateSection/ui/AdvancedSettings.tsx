import React, { useState } from 'react';
import { Zap, Lock, Sparkles, Eye, EyeOff, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { DEFAULT_DOMAIN, SmartLinkPreview, GeoConfig, DeepLinkConfig, LeadLockConfig, TrustBadgeConfig, CreateMode } from '../types';
import { GrowthMarketing } from './GrowthMarketing';
import { SecurityTrust } from './SecurityTrust';

interface AdvancedSettingsProps {
  mode?: CreateMode;
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
  smartLinkPreview: SmartLinkPreview;
  setSmartLinkPreview: (config: SmartLinkPreview) => void;
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
  mode,
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
  smartLinkPreview,
  setSmartLinkPreview,
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
  const [isBasicOpen, setIsBasicOpen] = useState(false);
  const [isGrowthOpen, setIsGrowthOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);

  // Reusable Accordion Section
  const AccordionSection = ({
    title,
    icon: Icon,
    isOpen,
    setIsOpen,
    headerColorClass,
    children
  }: {
    title: string,
    icon: any,
    isOpen: boolean,
    setIsOpen: (v: boolean) => void,
    headerColorClass: string,
    children: React.ReactNode
  }) => (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all duration-300 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 font-medium transition-colors ${isOpen ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}
      >
        <span className={`flex items-center ${isOpen ? 'text-gray-900' : 'text-gray-600'}`}>
          <Icon className={`w-5 h-5 mr-3 ${headerColorClass}`} />
          {title}
        </span>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>

      {isOpen && (
        <div className="p-4 sm:p-6 border-t border-gray-100 bg-white animate-fadeIn">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-2">
      {/* 1. Basic Controls */}
      <AccordionSection
        title="Basic Controls"
        icon={Settings}
        isOpen={isBasicOpen}
        setIsOpen={setIsBasicOpen}
        headerColorClass="text-blue-600"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
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

          {/* Expiration Days */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Expiration (Days)</label>
            </div>
            <input
              type="number"
              min="1"
              placeholder="Never"
              value={expirationDays}
              onChange={(e) => setExpirationDays(e.target.value ? parseInt(e.target.value) : '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Max Clicks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Max Clicks</label>
            </div>
            <input
              type="number"
              min="1"
              placeholder="Unlimited"
              value={maxClicks}
              onChange={(e) => setMaxClicks(e.target.value ? parseInt(e.target.value) : '')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      </AccordionSection>

      {/* 2. Growth & Marketing */}
      {mode !== 'qr' && (
        <AccordionSection
          title="Growth & Marketing"
          icon={Sparkles}
          isOpen={isGrowthOpen}
          setIsOpen={setIsGrowthOpen}
          headerColorClass="text-purple-600"
        >
          <GrowthMarketing
            smartLinkPreview={smartLinkPreview}
            setSmartLinkPreview={setSmartLinkPreview}
            geoConfig={geoConfig}
            setGeoConfig={setGeoConfig}
            deepLinkConfig={deepLinkConfig}
            setDeepLinkConfig={setDeepLinkConfig}
            leadLockConfig={leadLockConfig}
            setLeadLockConfig={setLeadLockConfig}
            featureAccess={featureAccess}
            upgradeModal={upgradeModal}
          />
        </AccordionSection>
      )}

      {/* 3. Security & Trust */}
      <AccordionSection
        title="Security & Trust"
        icon={Lock}
        isOpen={isSecurityOpen}
        setIsOpen={setIsSecurityOpen}
        headerColorClass="text-teal-600"
      >
        <SecurityTrust
          trustBadgeConfig={trustBadgeConfig}
          setTrustBadgeConfig={setTrustBadgeConfig}
          featureAccess={featureAccess}
          upgradeModal={upgradeModal}
        />
      </AccordionSection>
    </div>
  );
};
