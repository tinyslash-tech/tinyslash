import React, { useState } from 'react';
import { Share2, Globe, Smartphone, Lock, Plus, Trash2, HelpCircle } from 'lucide-react';
import { SmartLinkPreview, GeoConfig, DeepLinkConfig, LeadLockConfig } from '../types';

interface GrowthMarketingProps {
  smartLinkPreview: SmartLinkPreview;
  setSmartLinkPreview: (config: SmartLinkPreview) => void;
  geoConfig: GeoConfig;
  setGeoConfig: (config: GeoConfig) => void;
  deepLinkConfig: DeepLinkConfig;
  setDeepLinkConfig: (config: DeepLinkConfig) => void;
  leadLockConfig: LeadLockConfig;
  setLeadLockConfig: (config: LeadLockConfig) => void;
  featureAccess: any;
  upgradeModal: any;
}

export const GrowthMarketing: React.FC<GrowthMarketingProps> = ({
  smartLinkPreview,
  setSmartLinkPreview,
  geoConfig,
  setGeoConfig,
  deepLinkConfig,
  setDeepLinkConfig,
  leadLockConfig,
  setLeadLockConfig,
  featureAccess,
  upgradeModal
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleProFeatureClick = (featureName: string, description: string) => {
    upgradeModal.open(featureName, description, false);
  };

  // --- Render Helpers ---

  const renderSmartLinkPreview = () => (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => toggleSection('smartPreview')}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 text-left transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg text-green-600">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 flex items-center">
              Smart Link Preview
              {!featureAccess.canUseWhatsAppPreview && (
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">PRO</span>
              )}
            </h4>
            <p className="text-sm text-gray-500">Universal rich previews for WhatsApp, Telegram, FB, LinkedIn & more</p>
          </div>
        </div>
        <span className="text-gray-400 text-sm">{expandedSection === 'smartPreview' ? 'Collapse' : 'Expand'}</span>
      </button>

      {expandedSection === 'smartPreview' && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
          {!featureAccess.canUseWhatsAppPreview && (
            <div className="inset-0 bg-white/50 backdrop-blur-[1px] absolute z-10 flex items-center justify-center rounded-b-lg">
              <button
                onClick={() => handleProFeatureClick('Smart Link Preview', 'Customize how your links look on all social platforms.')}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg text-sm font-medium hover:shadow-xl transition-all"
              >
                Unlock Smart Previews
              </button>
            </div>
          )}

          <div className={`${!featureAccess.canUseWhatsAppPreview ? 'filter blur-sm pointer-events-none select-none opacity-50' : 'space-y-4'}`}>

            {/* Realistic Platform Icons */}
            <div className="flex flex-wrap gap-2 mb-4">
              {[
                { name: 'WhatsApp', color: 'bg-[#25D366]', text: 'white' },
                { name: 'Telegram', color: 'bg-[#0088cc]', text: 'white' },
                { name: 'Facebook', color: 'bg-[#1877F2]', text: 'white' },
                { name: 'LinkedIn', color: 'bg-[#0A66C2]', text: 'white' },
                { name: 'Twitter/X', color: 'bg-black', text: 'white' },
                { name: 'Slack', color: 'bg-[#4A154B]', text: 'white' }
              ].map(p => (
                <div key={p.name} className={`px-2 py-1 rounded-md shadow-sm flex items-center space-x-1 ${p.color}`}>
                  <span className={`text-[10px] font-bold text-${p.text}`}>{p.name}</span>
                </div>
              ))}
              <span className="text-xs text-gray-400 self-center ml-1">+ many more</span>
            </div>

            {/* Enable Toggle */}
            <div className="flex items-start space-x-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
              <div className="flex items-center h-5">
                <input
                  id="enable-smart-preview"
                  type="checkbox"
                  checked={smartLinkPreview.enabled}
                  onChange={(e) => setSmartLinkPreview({ ...smartLinkPreview, enabled: e.target.checked })}
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-0 text-sm">
                <label htmlFor="enable-smart-preview" className="font-medium text-gray-900">Enable Custom Preview</label>
                <p className="text-gray-500 text-xs mt-0.5">Override the default website preview with your own title, description, and image.</p>
              </div>
            </div>

            {/* Conditional Inputs */}
            {smartLinkPreview.enabled && (
              <div className="space-y-4 animate-fadeIn">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Title</label>
                  <input
                    type="text"
                    placeholder="e.g. 🔥 50% OFF Diwali Sale - Limited Time!"
                    value={smartLinkPreview.title || ''}
                    onChange={(e) => setSmartLinkPreview({ ...smartLinkPreview, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Custom Description</label>
                  <textarea
                    placeholder="Don't miss out! Click here to claim your exclusive discount coupon. Free shipping on all orders."
                    value={smartLinkPreview.description || ''}
                    onChange={(e) => setSmartLinkPreview({ ...smartLinkPreview, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
                {/* Simple visual placeholder for image upload for now */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-5 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 mb-2 text-gray-400">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Upload Preview Image</p>
                  <p className="text-xs text-gray-500 mt-1">Recommended: 1200x630px (Max 2MB)</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  /* --- India-First Data Maps --- */
  const INDIA_STATES = [
    { code: 'TN', name: 'Tamil Nadu', lang: 'ta' },
    { code: 'KL', name: 'Kerala', lang: 'ml' },
    { code: 'KA', name: 'Karnataka', lang: 'kn' },
    { code: 'AP', name: 'Andhra Pradesh', lang: 'te' },
    { code: 'TG', name: 'Telangana', lang: 'te' },
    { code: 'MH', name: 'Maharashtra', lang: 'mr' },
    { code: 'GJ', name: 'Gujarat', lang: 'gu' },
    { code: 'WB', name: 'West Bengal', lang: 'bn' },
    { code: 'PB', name: 'Punjab', lang: 'pa' },
    { code: 'RJ', name: 'Rajasthan', lang: 'hi' },
    { code: 'UP', name: 'Uttar Pradesh', lang: 'hi' },
    { code: 'MP', name: 'Madhya Pradesh', lang: 'hi' },
    { code: 'DL', name: 'Delhi', lang: 'hi' },
    { code: 'OTHER', name: 'Other State', lang: 'en' }
  ];

  const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
    { code: 'kn', name: 'Kannada' },
    { code: 'ml', name: 'Malayalam' },
    { code: 'mr', name: 'Marathi' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'bn', name: 'Bengali' },
    { code: 'pa', name: 'Punjabi' }
  ];

  const renderGeoRedirects = () => (
    <div className="border border-gray-200 rounded-lg overflow-hidden mt-3">
      <button
        onClick={() => toggleSection('geo')}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 text-left transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 flex items-center">
              Geo-Linguistic Routing
              {!featureAccess.canUseGeoRedirect && (
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">PRO</span>
              )}
            </h4>
            <p className="text-sm text-gray-500">Route users based on Location + Language (e.g., Tamil Nadu users → Tamil Page)</p>
          </div>
        </div>
        <span className="text-gray-400 text-sm">{expandedSection === 'geo' ? 'Collapse' : 'Expand'}</span>
      </button>

      {expandedSection === 'geo' && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          {!featureAccess.canUseGeoRedirect && (
            <div className="mb-4 p-3 bg-purple-50 border border-purple-100 rounded-lg flex justify-between items-center">
              <span className="text-sm text-purple-800">Available on Pro Plan</span>
              <button
                onClick={() => handleProFeatureClick('Geo Routing', 'Route users to specific URLs based on their state or region.')}
                className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
              >
                Upgrade
              </button>
            </div>
          )}

          <div className={`${!featureAccess.canUseGeoRedirect ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-700">Routing Rules</label>
              <button
                onClick={() => setGeoConfig({
                  ...geoConfig,
                  rules: [...geoConfig.rules, { country: 'IN', state: '', language: '', url: '' }]
                })}
                className="text-xs text-blue-600 font-medium hover:text-blue-800 flex items-center"
              >
                <Plus className="w-3 h-3 mr-1" /> Add Rule
              </button>
            </div>

            <div className="space-y-3">
              {geoConfig.rules.map((rule, idx) => (
                <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm animate-fadeIn">
                  {/* Row 1: Selectors */}
                  <div className="flex gap-2 mb-2">
                    {/* Country (Fixed to IN for now as per req, but built for scale) */}
                    <select
                      value={rule.country}
                      disabled={true}
                      className="w-20 px-2 py-1.5 border border-gray-200 bg-gray-50 text-gray-500 rounded text-xs font-medium"
                    >
                      <option value="IN">🇮🇳 IN</option>
                    </select>

                    {/* State Selector */}
                    <select
                      value={rule.state}
                      onChange={(e) => {
                        const selectedState = INDIA_STATES.find(s => s.code === e.target.value);
                        const newRules = [...geoConfig.rules];
                        newRules[idx].state = e.target.value;

                        // Smart Auto-Fill Language
                        if (selectedState && !newRules[idx].language) {
                          newRules[idx].language = selectedState.lang;
                        }
                        setGeoConfig({ ...geoConfig, rules: newRules });
                      }}
                      className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select State</option>
                      {INDIA_STATES.map(state => (
                        <option key={state.code} value={state.code}>{state.name}</option>
                      ))}
                    </select>

                    {/* Language Selector */}
                    <select
                      value={rule.language}
                      onChange={(e) => {
                        const newRules = [...geoConfig.rules];
                        newRules[idx].language = e.target.value;
                        setGeoConfig({ ...geoConfig, rules: newRules });
                      }}
                      className="w-32 px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Language</option>
                      {LANGUAGES.map(lang => (
                        <option key={lang.code} value={lang.code}>{lang.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Row 2: URL & Action */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://site.com/regional-page"
                      value={rule.url}
                      onChange={(e) => {
                        const newRules = [...geoConfig.rules];
                        newRules[idx].url = e.target.value;
                        setGeoConfig({ ...geoConfig, rules: newRules });
                      }}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      onClick={() => {
                        const newRules = geoConfig.rules.filter((_, i) => i !== idx);
                        setGeoConfig({ ...geoConfig, rules: newRules });
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                      title="Remove Rule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {geoConfig.rules.length === 0 && (
              <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg mb-4 bg-gray-50/50">
                <Globe className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">No geo-rules active.</p>
                <p className="text-xs text-gray-400">Add a rule to redirect users based on location.</p>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-gray-200">
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Fallback Destination (Default)</label>
              <div className="flex items-center">
                <div className="bg-gray-100 border border-gray-300 border-r-0 rounded-l-lg px-3 py-2 text-gray-500 text-sm">
                  Global
                </div>
                <input
                  type="url"
                  placeholder="https://site.com/en (Default if no match)"
                  value={geoConfig.defaultUrl || ''}
                  onChange={(e) => setGeoConfig({ ...geoConfig, defaultUrl: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDeepLink = () => (
    <div className="border border-gray-200 rounded-lg overflow-hidden mt-3">
      <button
        onClick={() => toggleSection('deeplink')}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 text-left transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 flex items-center">
              App Deep-Linking
              {!featureAccess.canUseDeepLinks && (
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">PRO</span>
              )}
            </h4>
            <p className="text-sm text-gray-500">Open directly in mobile apps (Amazon, Flipkart, etc.)</p>
          </div>
        </div>
        <span className="text-gray-400 text-sm">{expandedSection === 'deeplink' ? 'Collapse' : 'Expand'}</span>
      </button>

      {expandedSection === 'deeplink' && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          {!featureAccess.canUseDeepLinks && (
            <div className="mb-4 p-3 bg-purple-50 border border-purple-100 rounded-lg flex justify-between items-center">
              <span className="text-sm text-purple-800">Available on Pro Plan</span>
              <button
                onClick={() => handleProFeatureClick('App Deep-Linking', 'Increase conversions by opening links directly in mobile apps.')}
                className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
              >
                Upgrade
              </button>
            </div>
          )}

          <div className={`${!featureAccess.canUseDeepLinks ? 'opacity-50 pointer-events-none' : 'space-y-4'}`}>
            <div className="flex items-start space-x-3">
              <div className="flex items-center h-5">
                <input
                  id="smart-app-open"
                  type="checkbox"
                  checked={deepLinkConfig.enabled}
                  onChange={(e) => setDeepLinkConfig({ ...deepLinkConfig, enabled: e.target.checked })}
                  className="focus:ring-orange-500 h-4 w-4 text-orange-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-0 text-sm">
                <label htmlFor="smart-app-open" className="font-medium text-gray-700">Smart App Open (Auto)</label>
                <p className="text-gray-500">Automatically open links inside shopping apps if installed.</p>
              </div>
            </div>

            <div className="bg-white p-3 rounded border border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Supported Platforms</p>
              <div className="flex flex-wrap gap-2">
                {['Amazon', 'Flipkart', 'Myntra', 'Meesho', 'AJIO', 'Nykaa'].map(platform => (
                  <span key={platform} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md border border-gray-200">
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center text-xs text-blue-600 bg-blue-50 p-2 rounded">
              <div className="flex-1">
                ℹ️ <strong>How it works:</strong> We auto-detect the destination URL. If it matches a supported app, we allow deep-linking. Otherwise, standard browser behavior applies.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderLeadLock = () => (
    <div className="border border-gray-200 rounded-lg overflow-hidden mt-3">
      <button
        onClick={() => toggleSection('leadlock')}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 text-left transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 flex items-center">
              Lead-Lock Access
              {!featureAccess.canUseLeadLock && (
                <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-full">PRO</span>
              )}
            </h4>
            <p className="text-sm text-gray-500">Capture WhatsApp/Email before showing content</p>
          </div>
        </div>
        <span className="text-gray-400 text-sm">{expandedSection === 'leadlock' ? 'Collapse' : 'Expand'}</span>
      </button>

      {expandedSection === 'leadlock' && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          {!featureAccess.canUseLeadLock && (
            <div className="mb-4 p-3 bg-purple-50 border border-purple-100 rounded-lg flex justify-between items-center">
              <span className="text-sm text-purple-800">Available on Pro Plan</span>
              <button
                onClick={() => handleProFeatureClick('Lead Lock', 'Capture high-quality leads by locking content behind a gateway.')}
                className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700"
              >
                Upgrade
              </button>
            </div>
          )}

          <div className={`${!featureAccess.canUseLeadLock ? 'opacity-50 pointer-events-none' : 'space-y-4'}`}>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enable-leadlock"
                checked={leadLockConfig.enabled}
                onChange={(e) => setLeadLockConfig({ ...leadLockConfig, enabled: e.target.checked })}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="enable-leadlock" className="text-sm font-medium text-gray-700">Enable Lead Lock</label>
            </div>

            {leadLockConfig.enabled && (
              <div className="pl-6 space-y-3">
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="leadType"
                      value="whatsapp"
                      checked={leadLockConfig.type === 'whatsapp'}
                      onChange={() => setLeadLockConfig({ ...leadLockConfig, type: 'whatsapp' })}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-600">Request WhatsApp</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="leadType"
                      value="email"
                      checked={leadLockConfig.type === 'email'}
                      onChange={() => setLeadLockConfig({ ...leadLockConfig, type: 'email' })}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-600">Request Email</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Destination URL (After Unlock)</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/d/..."
                    value={leadLockConfig.redirectUrl || ''}
                    onChange={(e) => setLeadLockConfig({ ...leadLockConfig, redirectUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Users will be redirected here after submitting details.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {renderSmartLinkPreview()}
      {renderGeoRedirects()}
      {renderDeepLink()}
      {renderLeadLock()}
    </div>
  );
};
