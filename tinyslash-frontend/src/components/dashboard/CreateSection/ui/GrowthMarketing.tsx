import React, { useState } from 'react';
import { Share2, Globe, Smartphone, Lock, Plus, Trash2, HelpCircle, LayoutGrid, MessageCircle, Instagram, Globe2, Target } from 'lucide-react';
import { SmartLinkPreview, GeoConfig, DeepLinkConfig, LeadLockConfig, SmartActionConfig, CreateMode } from '../types';
import { PixelSelector } from './PixelSelector'; // Imported PixelSelector

interface GrowthMarketingProps {
  smartLinkPreview: SmartLinkPreview;
  setSmartLinkPreview: (config: SmartLinkPreview) => void;
  geoConfig: GeoConfig;
  setGeoConfig: (config: GeoConfig) => void;
  deepLinkConfig: DeepLinkConfig;
  setDeepLinkConfig: (config: DeepLinkConfig) => void;
  leadLockConfig: LeadLockConfig;
  setLeadLockConfig: (config: LeadLockConfig) => void;
  smartActionConfig: SmartActionConfig;
  setSmartActionConfig: (config: SmartActionConfig) => void;
  featureAccess: any;
  upgradeModal: any;
  mode?: CreateMode;
  selectedPixelIds?: string[];
  setSelectedPixelIds?: (ids: string[]) => void;
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
  smartActionConfig,
  setSmartActionConfig,
  featureAccess,
  upgradeModal,
  mode,
  selectedPixelIds,
  setSelectedPixelIds
}) => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleProFeatureClick = (featureName: string, description: string) => {
    upgradeModal.open(featureName, description, false);
  };

  // --- Render Helpers ---

  /* --- 5. Smart Action QR (QR Mode Only) --- */
  const renderSmartAction = () => (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white transition-all hover:shadow-md mb-3">
      <button
        onClick={() => toggleSection('smartAction')}
        className="w-full text-left bg-white p-5 focus:outline-none transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${smartActionConfig.enabled ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-500'}`}>
              <LayoutGrid className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Multi-Action QR</h3>
              <p className="text-sm text-gray-500 mt-0.5">Let users choose what to do after scanning — WhatsApp, Instagram, Website and more.</p>
            </div>
          </div>
          <span className="text-gray-400">
            {expandedSection === 'smartAction' ? (
              <div className="bg-gray-100 p-2 rounded-full"><div className="w-4 h-0.5 bg-gray-500"></div></div>
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </span>
        </div>
      </button>

      {expandedSection === 'smartAction' && (
        <div className="p-5 pt-0 animate-fadeIn">
          {/* 3 Bullet Benefits */}
          <div className="ml-16 mb-6">
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>
                Direct users to multiple destinations from one QR.
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>
                Boost engagement with dedicated WhatsApp & Instagram buttons.
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></span>
                Showcase your website alongside social actions.
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-5 mt-2">
            {/* Toggle */}
            <div className="flex items-center justify-between mb-6">
              <label className="text-sm font-semibold text-gray-900">Enable Smart Action Page</label>
              <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle-smart-action" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                  checked={smartActionConfig.enabled}
                  onChange={(e) => setSmartActionConfig({ ...smartActionConfig, enabled: e.target.checked })}
                />
                <label htmlFor="toggle-smart-action" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${smartActionConfig.enabled ? 'bg-pink-500' : 'bg-gray-300'}`}></label>
              </div>
            </div>

            {smartActionConfig.enabled && (
              <div className="space-y-4 animate-fadeIn">
                {/* WhatsApp */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                  <h5 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                    <MessageCircle className="w-4 h-4 mr-2 text-green-600" /> WhatsApp Action
                  </h5>
                  <div className="space-y-3 pl-1">
                    <label className="flex items-center space-x-2 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={smartActionConfig.whatsapp.enabled}
                        onChange={(e) => setSmartActionConfig({
                          ...smartActionConfig,
                          whatsapp: { ...smartActionConfig.whatsapp, enabled: e.target.checked }
                        })}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 font-medium">Show "Chat on WhatsApp"</span>
                    </label>
                    {smartActionConfig.whatsapp.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
                        <input
                          type="text"
                          placeholder="Phone (e.g. 919876543210)"
                          value={smartActionConfig.whatsapp.number}
                          onChange={(e) => setSmartActionConfig({
                            ...smartActionConfig,
                            whatsapp: { ...smartActionConfig.whatsapp, number: e.target.value }
                          })}
                          className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Pre-filled Message (Optional)"
                          value={smartActionConfig.whatsapp.message}
                          onChange={(e) => setSmartActionConfig({
                            ...smartActionConfig,
                            whatsapp: { ...smartActionConfig.whatsapp, message: e.target.value }
                          })}
                          className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Instagram */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                  <h5 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                    <Instagram className="w-4 h-4 mr-2 text-pink-600" /> Instagram Action
                  </h5>
                  <div className="space-y-3 pl-1">
                    <label className="flex items-center space-x-2 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={smartActionConfig.instagram.enabled}
                        onChange={(e) => setSmartActionConfig({
                          ...smartActionConfig,
                          instagram: { ...smartActionConfig.instagram, enabled: e.target.checked }
                        })}
                        className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 font-medium">Show "Visit Instagram"</span>
                    </label>
                    {smartActionConfig.instagram.enabled && (
                      <div className="pl-6">
                        <input
                          type="url"
                          placeholder="Instagram Profile URL"
                          value={smartActionConfig.instagram.url}
                          onChange={(e) => setSmartActionConfig({
                            ...smartActionConfig,
                            instagram: { ...smartActionConfig.instagram, url: e.target.value }
                          })}
                          className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Website */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                  <h5 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
                    <Globe2 className="w-4 h-4 mr-2 text-blue-600" /> Website Action
                  </h5>
                  <div className="space-y-3 pl-1">
                    <label className="flex items-center space-x-2 mb-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={smartActionConfig.website.enabled}
                        onChange={(e) => setSmartActionConfig({
                          ...smartActionConfig,
                          website: { ...smartActionConfig.website, enabled: e.target.checked }
                        })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 font-medium">Show "Visit Website"</span>
                    </label>
                    {smartActionConfig.website.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
                        <input
                          type="text"
                          placeholder="Button Label (e.g. Visit Shop)"
                          value={smartActionConfig.website.label}
                          onChange={(e) => setSmartActionConfig({
                            ...smartActionConfig,
                            website: { ...smartActionConfig.website, label: e.target.value }
                          })}
                          className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <input
                          type="url"
                          placeholder="Website URL"
                          value={smartActionConfig.website.url}
                          onChange={(e) => setSmartActionConfig({
                            ...smartActionConfig,
                            website: { ...smartActionConfig.website, url: e.target.value }
                          })}
                          className="px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  /* --- 1. Rich Link Preview --- */
  const renderRichLinkPreview = () => (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white transition-all hover:shadow-md mb-3">
      <button
        onClick={() => toggleSection('smartPreview')}
        className="w-full text-left bg-white p-5 focus:outline-none transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${smartLinkPreview.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
              <Share2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Rich Link Preview</h3>
              <p className="text-sm text-gray-500 mt-0.5">Control how your link appears on WhatsApp, LinkedIn, Facebook and more.</p>
            </div>
          </div>
          <span className="text-gray-400">
            {expandedSection === 'smartPreview' ? (
              <div className="bg-gray-100 p-2 rounded-full"><div className="w-4 h-0.5 bg-gray-500"></div></div>
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </span>
        </div>
      </button>

      {expandedSection === 'smartPreview' && (
        <div className="p-5 pt-0 animate-fadeIn">
          {/* 3 Bullet Benefits */}
          <div className="ml-16 mb-6">
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                Customize title, image and description to increase click-through rate.
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                Build trust with professional branding on social media.
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span>
                Stand out in crowded feeds with custom visuals.
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-5 mt-2">
            {!featureAccess.canUseWhatsAppPreview && (
              <div className="mb-4 bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded mr-3">PRO</span>
                  <span className="text-sm text-purple-900 font-medium">Unlock Custom Previews</span>
                </div>
                <button
                  onClick={() => handleProFeatureClick('Rich Link Preview', 'Customize how your links look on all social platforms.')}
                  className="text-sm bg-white text-purple-600 font-semibold px-4 py-2 rounded-lg border border-purple-200 shadow-sm hover:shadow"
                >
                  Upgrade
                </button>
              </div>
            )}

            <div className={`${!featureAccess.canUseWhatsAppPreview ? 'opacity-60 pointer-events-none filter grayscale-[0.3]' : ''}`}>
              {/* Toggle */}
              <div className="flex items-center justify-between mb-6">
                <label className="text-sm font-semibold text-gray-900">Enable Custom Preview</label>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="toggle" id="toggle-preview" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    checked={smartLinkPreview.enabled}
                    onChange={(e) => setSmartLinkPreview({ ...smartLinkPreview, enabled: e.target.checked })}
                  />
                  <label htmlFor="toggle-preview" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${smartLinkPreview.enabled ? 'bg-green-500' : 'bg-gray-300'}`}></label>
                </div>
              </div>

              {smartLinkPreview.enabled && (
                <div className="space-y-4 animate-fadeIn">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Custom Title</label>
                    <input
                      type="text"
                      placeholder="e.g. 🔥 50% OFF Diwali Sale"
                      value={smartLinkPreview.title || ''}
                      onChange={(e) => setSmartLinkPreview({ ...smartLinkPreview, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Custom Description</label>
                    <textarea
                      placeholder="Click to claim your exclusive discount..."
                      value={smartLinkPreview.description || ''}
                      onChange={(e) => setSmartLinkPreview({ ...smartLinkPreview, description: e.target.value })}
                      rows={2}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"
                    />
                  </div>

                  {/* Image Input reused logic */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Preview Image</label>
                    <div
                      className="border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl p-6 text-center hover:bg-white hover:border-blue-400 transition-all cursor-pointer group"
                      onClick={() => document.getElementById('preview-image-upload')?.click()}
                    >
                      <input
                        id="preview-image-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          // Reusing existing upload logic
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 5 * 1024 * 1024) { alert("Image size must be less than 5MB"); return; }
                            try {
                              const { uploadFileToBackend } = await import('../../../../services/api');
                              const response = await uploadFileToBackend(file, { title: 'Smart Preview Image', isPublic: true });
                              const uploadedUrl = response.data?.fileUrl || response.fileUrl || response.data?.url || response.url || response.secure_url;
                              if (uploadedUrl) setSmartLinkPreview({ ...smartLinkPreview, image: uploadedUrl });
                            } catch (err: any) { console.error(err); alert("Failed to upload"); }
                          }
                        }}
                      />
                      {smartLinkPreview.image ? (
                        <div className="relative group-hover:opacity-90 transition-opacity">
                          <img src={smartLinkPreview.image} alt="Preview" className="w-full h-40 object-cover rounded-lg shadow-sm" />
                          <div className="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow-md cursor-pointer hover:bg-red-50 text-red-500"
                            onClick={(e) => { e.stopPropagation(); setSmartLinkPreview({ ...smartLinkPreview, image: '' }); }}>
                            <Trash2 className="w-4 h-4" />
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400 group-hover:text-blue-500 transition-colors">
                          <div className="bg-white p-3 rounded-full mb-2 shadow-sm">
                            <Share2 className="w-6 h-6" />
                          </div>
                          <p className="text-sm font-medium">Click to upload image</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
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

  /* --- 3. Location & Language Redirect --- */
  const renderLocationLanguageRedirect = () => (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white transition-all hover:shadow-md mb-3">
      <button
        onClick={() => toggleSection('geo')}
        className="w-full text-left bg-white p-5 focus:outline-none transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${geoConfig.enabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{mode === 'qr' ? 'Location & Language QR' : 'Location & Language Redirect'}</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {mode === 'qr'
                  ? 'Redirect users to the right page based on their location or preferred language.'
                  : 'Automatically send users to the right page based on their location or preferred language.'}
              </p>
            </div>
          </div>
          <span className="text-gray-400">
            {expandedSection === 'geo' ? (
              <div className="bg-gray-100 p-2 rounded-full"><div className="w-4 h-0.5 bg-gray-500"></div></div>
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </span>
        </div>
      </button>

      {expandedSection === 'geo' && (
        <div className="p-5 pt-0 animate-fadeIn">
          {/* 3 Bullet Benefits */}
          <div className="ml-16 mb-6">
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Deliver personalized content based on region.
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Auto-detect user language for better engagement.
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
                Increase conversion by serving local offers.
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-5 mt-2">
            {!featureAccess.canUseGeoRedirect && (
              <div className="mb-4 bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-100 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded mr-3">PRO</span>
                  <span className="text-sm text-purple-900 font-medium">Unlock Geo Routing</span>
                </div>
                <button
                  onClick={() => handleProFeatureClick('Geo Routing', 'Route users to specific URLs based on their state or region.')}
                  className="text-sm bg-white text-purple-600 font-semibold px-4 py-2 rounded-lg border border-purple-200 shadow-sm hover:shadow"
                >
                  Upgrade
                </button>
              </div>
            )}

            <div className={`${!featureAccess.canUseGeoRedirect ? 'opacity-60 pointer-events-none filter grayscale-[0.3]' : ''}`}>

              {/* Toggle */}
              <div className="flex items-center justify-between mb-6">
                <label className="text-sm font-semibold text-gray-900">Enable Geo Redirects</label>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="toggle" id="toggle-geo" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    checked={geoConfig.enabled}
                    onChange={(e) => setGeoConfig({ ...geoConfig, enabled: e.target.checked })}
                  />
                  <label htmlFor="toggle-geo" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${geoConfig.enabled ? 'bg-blue-500' : 'bg-gray-300'}`}></label>
                </div>
              </div>

              {geoConfig.enabled && (
                <div className="animate-fadeIn space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Routing Rules</label>
                    <button
                      onClick={() => setGeoConfig({
                        ...geoConfig,
                        rules: [...geoConfig.rules, { country: 'IN', state: '', language: '', url: '' }]
                      })}
                      className="text-xs bg-blue-50 text-blue-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors flex items-center"
                    >
                      <Plus className="w-3 h-3 mr-1" /> Add Rule
                    </button>
                  </div>

                  <div className="space-y-3">
                    {geoConfig.rules.map((rule, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-200 shadow-sm">
                        {/* Row 1: Selectors */}
                        <div className="flex gap-2 mb-2">
                          {/* Country (Fixed) */}
                          <select
                            value={rule.country}
                            disabled={true}
                            className="w-20 px-2 py-2 border border-gray-200 bg-white text-gray-500 rounded-lg text-xs font-medium"
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
                              // Smart Auto-Fill
                              if (selectedState && !newRules[idx].language) {
                                newRules[idx].language = selectedState.lang;
                              }
                              setGeoConfig({ ...geoConfig, rules: newRules });
                            }}
                            className="flex-1 px-2 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                            className="w-32 px-2 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
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
                            className="flex-1 px-3 py-2 border border-gray-300 bg-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <button
                            onClick={() => {
                              const newRules = geoConfig.rules.filter((_, i) => i !== idx);
                              setGeoConfig({ ...geoConfig, rules: newRules });
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                            title="Remove Rule"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {geoConfig.rules.length === 0 && (
                    <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
                      <p className="text-sm text-gray-500">No geo-rules active.</p>
                      <p className="text-xs text-gray-400">Add a rule (+ Add Rule) to redirect users.</p>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Fallback Destination (Default)</label>
                    <div className="flex items-center shadow-sm rounded-lg overflow-hidden">
                      <div className="bg-gray-100 border border-gray-300 border-r-0 px-3 py-2.5 text-gray-500 text-sm font-medium">
                        Global
                      </div>
                      <input
                        type="url"
                        placeholder="https://site.com/en (Default if no match)"
                        value={geoConfig.defaultUrl || ''}
                        onChange={(e) => setGeoConfig({ ...geoConfig, defaultUrl: e.target.value })}
                        className="flex-1 px-3 py-2.5 border border-gray-300 text-sm focus:ring-inset focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* --- 2. Open in App --- */
  const renderOpenInApp = () => (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white transition-all hover:shadow-md mb-3">
      <button
        onClick={() => toggleSection('deeplink')}
        className="w-full text-left bg-white p-5 focus:outline-none transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${deepLinkConfig.enabled ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{mode === 'qr' ? 'Open in App QR' : 'Open in App'}</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {mode === 'qr'
                  ? 'Automatically open the QR link inside supported mobile apps instead of the browser.'
                  : 'Automatically open your link inside supported mobile apps like Amazon, Flipkart or YouTube instead of the browser.'}
              </p>
            </div>
          </div>
          <span className="text-gray-400">
            {expandedSection === 'deeplink' ? (
              <div className="bg-gray-100 p-2 rounded-full"><div className="w-4 h-0.5 bg-gray-500"></div></div>
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </span>
        </div>
      </button>

      {expandedSection === 'deeplink' && (
        <div className="p-5 pt-0 animate-fadeIn">
          {/* 3 Bullet Benefits */}
          <div className="ml-16 mb-6">
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                Seamless user experience for mobile users.
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                Reduce drop-offs by skipping the browser login.
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                Support for Amazon, YouTube, Instagram, and more.
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-5 mt-2">
            {!featureAccess.canUseDeepLinks && (
              <div className="mb-4 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded mr-3">PRO</span>
                  <span className="text-sm text-purple-900 font-medium">Unlock App Deep-Linking</span>
                </div>
                <button
                  onClick={() => handleProFeatureClick('App Deep-Linking', 'Increase conversions by opening links directly in mobile apps.')}
                  className="text-sm bg-white text-purple-600 font-semibold px-4 py-2 rounded-lg border border-purple-200 shadow-sm hover:shadow"
                >
                  Upgrade
                </button>
              </div>
            )}

            <div className={`${!featureAccess.canUseDeepLinks ? 'opacity-60 pointer-events-none filter grayscale-[0.3]' : ''}`}>
              {/* Toggle */}
              <div className="flex items-center justify-between mb-6">
                <label className="text-sm font-semibold text-gray-900">Enable Smart App Open</label>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="toggle" id="toggle-deeplink" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    checked={deepLinkConfig.enabled}
                    onChange={(e) => setDeepLinkConfig({ ...deepLinkConfig, enabled: e.target.checked })}
                  />
                  <label htmlFor="toggle-deeplink" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${deepLinkConfig.enabled ? 'bg-orange-500' : 'bg-gray-300'}`}></label>
                </div>
              </div>

              {/* Content */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200/60">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Supported Platforms</p>
                <div className="flex flex-wrap gap-2">
                  {['Amazon', 'Flipkart', 'Myntra', 'Meesho', 'YouTube', 'Instagram'].map(platform => (
                    <span key={platform} className="px-3 py-1.5 bg-white text-gray-700 text-xs font-medium rounded-lg border border-gray-200 shadow-sm">
                      {platform}
                    </span>
                  ))}
                  <span className="px-2 py-1 text-gray-400 text-xs">+ more</span>
                </div>
                <div className="mt-4 flex gap-2 text-xs text-blue-600 bg-blue-50/50 p-2.5 rounded-lg">
                  <span>ℹ️</span>
                  <span><strong>How it works:</strong> We auto-detect the destination URL. If it matches a supported app, we allow deep-linking. Otherwise, standard browser behavior applies.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* --- 4. Unlock After Signup --- */
  const renderUnlockAfterSignup = () => (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white transition-all hover:shadow-md mb-3">
      <button
        onClick={() => toggleSection('leadlock')}
        className="w-full text-left bg-white p-5 focus:outline-none transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-xl ${leadLockConfig.enabled ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-500'}`}>
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">{mode === 'qr' ? 'Lead Capture QR' : 'Unlock After Signup'}</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                {mode === 'qr'
                  ? 'Collect email or WhatsApp details before showing your content.'
                  : 'Capture email or WhatsApp details before users access your content. Perfect for lead generation campaigns.'}
              </p>
            </div>
          </div>
          <span className="text-gray-400">
            {expandedSection === 'leadlock' ? (
              <div className="bg-gray-100 p-2 rounded-full"><div className="w-4 h-0.5 bg-gray-500"></div></div>
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </span>
        </div>
      </button>

      {expandedSection === 'leadlock' && (
        <div className="p-5 pt-0 animate-fadeIn">
          {/* 3 Bullet Benefits */}
          <div className="ml-16 mb-6">
            <ul className="space-y-2">
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                Grow your email and WhatsApp lists effortlessly.
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                Verify leads with OTP for high-quality data.
              </li>
              <li className="flex items-center text-sm text-gray-600">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></span>
                Gate exclusive content to drive signups.
              </li>
            </ul>
          </div>

          <div className="border-t border-gray-100 pt-5 mt-2">
            {!featureAccess.canUseLeadLock && (
              <div className="mb-4 bg-gradient-to-r from-purple-50 to-indigo-50 p-4 rounded-xl border border-purple-100 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded mr-3">PRO</span>
                  <span className="text-sm text-purple-900 font-medium">Unlock Lead Gate</span>
                </div>
                <button
                  onClick={() => handleProFeatureClick('Lead Lock', 'Capture high-quality leads by locking content behind a gateway.')}
                  className="text-sm bg-white text-purple-600 font-semibold px-4 py-2 rounded-lg border border-purple-200 shadow-sm hover:shadow"
                >
                  Upgrade
                </button>
              </div>
            )}

            <div className={`${!featureAccess.canUseLeadLock ? 'opacity-60 pointer-events-none filter grayscale-[0.3]' : ''}`}>

              {/* Toggle */}
              <div className="flex items-center justify-between mb-6">
                <label className="text-sm font-semibold text-gray-900">Enable Lead Lock</label>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="toggle" id="toggle-leadlock" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    checked={leadLockConfig.enabled}
                    onChange={(e) => setLeadLockConfig({ ...leadLockConfig, enabled: e.target.checked })}
                  />
                  <label htmlFor="toggle-leadlock" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${leadLockConfig.enabled ? 'bg-indigo-500' : 'bg-gray-300'}`}></label>
                </div>
              </div>

              {leadLockConfig.enabled && (
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-200/80 space-y-5 animate-fadeIn">

                  {/* 1. Lead Type */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Lead Collection Type</label>
                    <div className="flex gap-3">
                      {['WHATSAPP', 'EMAIL', 'BOTH'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setLeadLockConfig({ ...leadLockConfig, leadType: type as any })}
                          className={`flex-1 py-2.5 text-sm font-medium rounded-lg border transition-all shadow-sm ${leadLockConfig.leadType === type
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                          {type === 'BOTH' ? 'WhatsApp & Email' : type.charAt(0) + type.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Custom Message */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lock Message (Optional)</label>
                    <input
                      type="text"
                      placeholder="To continue, please enter your details..."
                      value={leadLockConfig.message || ''}
                      onChange={(e) => setLeadLockConfig({ ...leadLockConfig, message: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 bg-white rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  {/* 3. Verification & Rules */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3.5 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer" onClick={() => setLeadLockConfig({ ...leadLockConfig, otpEnabled: !leadLockConfig.otpEnabled })}>
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="otp-verify"
                          checked={leadLockConfig.otpEnabled}
                          onChange={(e) => setLeadLockConfig({ ...leadLockConfig, otpEnabled: e.target.checked })}
                          className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="ml-3">
                          <label className="text-sm font-semibold text-gray-900 block cursor-pointer">OTP Verification</label>
                          <p className="text-xs text-gray-500 mt-0.5">Verify leads via OTP (Highly Recommended)</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-3.5 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer" onClick={() => setLeadLockConfig({ ...leadLockConfig, askOnce: !leadLockConfig.askOnce })}>
                      <div className="flex items-start">
                        <input
                          type="checkbox"
                          id="ask-once"
                          checked={leadLockConfig.askOnce}
                          onChange={(e) => setLeadLockConfig({ ...leadLockConfig, askOnce: e.target.checked })}
                          className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="ml-3">
                          <label className="text-sm font-semibold text-gray-900 block cursor-pointer">Ask Once Per Device</label>
                          <p className="text-xs text-gray-500 mt-0.5">Don't ask again if verified (Recommended)</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* --- 6. Retargeting Pixels --- */
  const renderRetargetingPixels = () => {
    if (!selectedPixelIds || !setSelectedPixelIds) return null;

    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white transition-all hover:shadow-md mb-3">
        <button
          onClick={() => toggleSection('pixels')}
          className="w-full text-left bg-white p-5 focus:outline-none transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-xl ${selectedPixelIds.length > 0 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Retargeting Pixels</h3>
                <p className="text-sm text-gray-500 mt-0.5">Every link click captures your audience — even when ad blockers are on.</p>
              </div>
            </div>
            <span className="text-gray-400">
              {expandedSection === 'pixels' ? (
                <div className="bg-gray-100 p-2 rounded-full"><div className="w-4 h-0.5 bg-gray-500"></div></div>
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </span>
          </div>
        </button>

        {expandedSection === 'pixels' && (
          <div className="p-5 pt-0 animate-fadeIn">
            {/* 3 Bullet Benefits */}
            <div className="ml-16 mb-6">
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  <strong className="text-gray-700 mr-1">Never miss a conversion.</strong> Works even when users have ad blockers.
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  <strong className="text-gray-700 mr-1">Build better audiences.</strong> Every click adds a high-intent user to your ad campaign.
                </li>
                <li className="flex items-center text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                  <strong className="text-gray-700 mr-1">Works with Meta, Google Ads & custom webhooks.</strong>
                </li>
              </ul>
            </div>

            <div className="border-t border-gray-100 pt-5 mt-2">
              <PixelSelector
                selectedPixelIds={selectedPixelIds}
                onChange={setSelectedPixelIds}
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Smart Action is ONLY for QR Mode - Priority #1 */}
      {mode === 'qr' && renderSmartAction()}

      {mode !== 'qr' && mode !== 'file' && renderRichLinkPreview()}
      {mode !== 'file' && renderOpenInApp()}
      {mode !== 'file' && renderLocationLanguageRedirect()}
      {renderUnlockAfterSignup()}
      {mode !== 'file' && renderRetargetingPixels()}
    </div>
  );
};
