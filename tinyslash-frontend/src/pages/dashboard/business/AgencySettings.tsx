import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { getAgencySettings, updateAgencySettings, AgencySettings as IAgencySettings } from '../../../services/api';
import toast from 'react-hot-toast';
import { Settings, Image as ImageIcon, Palette, Globe, Mail, Save, Loader2 } from 'lucide-react';


export default function AgencySettings() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState<IAgencySettings>({
    agencyLogoUrl: '',
    agencyBrandColor: '#4f46e5', // Default Indigo
    agencyCustomDomain: '',
    agencySupportEmail: ''
  });

  useEffect(() => {
    if (user?.id) {
      loadSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const res = await getAgencySettings(user!.id);
      // getAgencySettings already returns response.data which has { success: boolean, data: AgencySettings }
      if (res && res.data) {
        setSettings({
          agencyLogoUrl: res.data.agencyLogoUrl || '',
          agencyBrandColor: res.data.agencyBrandColor || '#4f46e5',
          agencyCustomDomain: res.data.agencyCustomDomain || '',
          agencySupportEmail: res.data.agencySupportEmail || ''
        });
      }
    } catch (error) {
      toast.error('Failed to load agency settings');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setIsSaving(true);
      await updateAgencySettings(user.id, settings);
      toast.success('Agency settings updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update agency settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">


      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-600" />
          Agency White-Label Settings
        </h1>
        <p className="text-gray-600 mt-2">
          Configure your agency's branding. These settings will be applied to the Client Portal when accessed via your custom domain.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-8">

          {/* Brand Logo */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-gray-400" />
              Brand Logo
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo URL (Direct Image Link)
              </label>
              <input
                type="url"
                value={settings.agencyLogoUrl}
                onChange={(e) => setSettings({ ...settings, agencyLogoUrl: e.target.value })}
                placeholder="https://your-storage.com/logo.png"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">
                We recommend a transparent PNG with a height of at least 100px for best results.
              </p>

              {settings.agencyLogoUrl && (
                <div className="mt-4 p-4 bg-white rounded border border-gray-200 inline-block">
                  <img src={settings.agencyLogoUrl} alt="Logo Preview" className="h-12 object-contain" onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+Image';
                  }} />
                </div>
              )}
            </div>
          </div>

          {/* Brand Color */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Palette className="w-5 h-5 text-gray-400" />
              Brand Color
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center gap-4">
              <input
                type="color"
                value={settings.agencyBrandColor}
                onChange={(e) => setSettings({ ...settings, agencyBrandColor: e.target.value })}
                className="w-16 h-16 p-1 rounded cursor-pointer border-0 bg-transparent"
              />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Color (Hex)
                </label>
                <input
                  type="text"
                  value={settings.agencyBrandColor}
                  onChange={(e) => setSettings({ ...settings, agencyBrandColor: e.target.value })}
                  placeholder="#4f46e5"
                  pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent uppercase font-mono"
                />
              </div>
            </div>
          </div>

          {/* Custom Domain */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-400" />
              Client Portal Domain
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Custom Domain
              </label>
              <div className="flex items-center">
                <span className="px-4 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-500 font-medium">
                  https://
                </span>
                <input
                  type="text"
                  value={settings.agencyCustomDomain}
                  onChange={(e) => setSettings({ ...settings, agencyCustomDomain: e.target.value.toLowerCase() })}
                  placeholder="clients.youragency.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Point a CNAME record from this domain to <code className="bg-gray-200 px-1 rounded">cname.tinyslash.com</code>. Once active, your clients will see your branding when logging in through this link.
              </p>
            </div>
          </div>

          {/* Support Email */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-400" />
              Support Contact
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={settings.agencySupportEmail}
                onChange={(e) => setSettings({ ...settings, agencySupportEmail: e.target.value })}
                placeholder="support@youragency.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-2">
                This email will be displayed to your clients if they need assistance within the portal.
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-70 font-medium"
            >
              {isSaving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
