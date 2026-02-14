import React from 'react';
import { Page } from '../../../types/page';
import { User, FileText, Upload } from 'lucide-react';
import { pageService } from '../../../services/pageService';
import toast from 'react-hot-toast';

interface ProfileTabProps {
  page: Page;
  onChange: (updates: Partial<Page>) => void;
}

import { Copy, Check } from 'lucide-react';

export const ProfileTab: React.FC<ProfileTabProps> = ({ page, onChange }) => {
  const [copied, setCopied] = React.useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const toastId = toast.loading('Uploading image...');
    try {
      const response = await pageService.uploadAsset(file);
      if (response.url) {
        onChange({ avatarUrl: response.url });
        toast.success('Avatar updated', { id: toastId });
      }
    } catch (error: any) {
      console.error('Upload failed:', error);
      const errorMessage = error.response?.data?.error || 'Upload failed';
      toast.error(errorMessage, { id: toastId });
    }
  };

  const handleCopyUrl = () => {
    const url = `https://tinyslash.com/p/${page.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Page Profile
        </h3>

        <div className="space-y-8">
          {/* Avatar Upload */}
          <section className="space-y-4 pt-2 border-t border-gray-100">
            <div className="flex justify-between items-start">
              <label className="block text-sm font-medium text-gray-900">Profile Image</label>
            </div>

            <div className="flex items-start gap-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="shrink-0">
                {page.avatarUrl ? (
                  <img src={page.avatarUrl} alt="Profile" className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center border-2 border-dashed border-gray-300 text-gray-400">
                    <User className="w-8 h-8 opacity-50" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    <Upload className="mr-2 w-4 h-4 text-gray-500" />
                    Upload Image
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg"
                      onChange={handleFileUpload}
                    />
                  </label>

                  {page.avatarUrl && (
                    <button
                      onClick={() => onChange({ avatarUrl: '' })}
                      className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>Recommended: 400×400px, JPG or PNG.</p>
                  <p>Max file size: 5 MB.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Separator */}
          <div className="h-px bg-gray-200" />

          {/* Page Name */}
          <section className="space-y-3">
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-900">
                Display Name <span className="text-red-500">*</span>
              </label>
              <span className={`text-xs ${page.title.length > 48 ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                {page.title.length}/48
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={page.title}
                onChange={(e) => {
                  if (e.target.value.length <= 48) {
                    onChange({ title: e.target.value });
                  }
                }}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-offset-1 focus:outline-none transition-all
                  ${!page.title.trim() ? 'border-red-300 focus:ring-red-200 focus:border-red-400' : 'border-gray-300 focus:ring-blue-100 focus:border-blue-500'}
                `}
                placeholder="e.g. Sarah Johnson"
              />
            </div>
            <p className="text-xs text-gray-500">The name displayed at the top of your page.</p>
            {!page.title.trim() && (
              <p className="text-xs text-red-500 font-medium mt-1">Please add a display name.</p>
            )}
          </section>

          {/* Separator */}
          <div className="h-px bg-gray-200" />

          {/* Bio */}
          <section className="space-y-3">
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-gray-900">Bio</label>
              <span className={`text-xs ${(page.bio || '').length >= 160 ? 'text-amber-500 font-bold' : 'text-gray-400'}`}>
                {(page.bio || '').length}/160
              </span>
            </div>
            <textarea
              value={page.bio || ''}
              onChange={(e) => {
                if (e.target.value.length <= 160) {
                  onChange({ bio: e.target.value });
                }
              }}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 focus:outline-none resize-none transition-all"
              placeholder="e.g. Digital creator, coffee lover, and fitness enthusiast based in LA ☀️"
            />
            <p className="text-xs text-gray-500">A short description about you or your brand.</p>
          </section>

          {/* Separator */}
          <div className="h-px bg-gray-200" />

          {/* Page URL */}
          <section className="space-y-3">
            <label className="block text-sm font-medium text-gray-900">Page URL</label>
            <div className="flex items-center">
              <div className="flex-1 flex items-center border border-gray-300 bg-gray-50 rounded-l-lg overflow-hidden h-10">
                <span className="pl-4 pr-2 text-sm text-gray-500 bg-gray-50 border-r border-gray-200 h-full flex items-center">
                  tinyslash.com/p/
                </span>
                <span className="px-4 text-sm text-gray-900 font-medium bg-white h-full flex items-center flex-1">
                  {page.slug}
                </span>
              </div>
              <button
                onClick={handleCopyUrl}
                className="h-10 px-4 border border-l-0 border-gray-300 bg-white hover:bg-gray-50 rounded-r-lg text-gray-600 transition-colors flex items-center gap-2"
                title="Copy Link"
              >
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                <span className="text-xs font-medium">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-xs text-gray-500">This is the public link to your page.</p>
          </section>

          {/* Separator */}
          <div className="h-px bg-gray-200" />

          {/* Verified Badge */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900 flex items-center gap-2">
                  Verified Badge
                  {page.verified && <Check className="w-3.5 h-3.5 text-blue-500 bg-blue-50 rounded-full p-0.5" />}
                </label>
                <p className="text-xs text-gray-500 mt-1">Shows a checkmark next to your name.</p>
              </div>

              <button
                onClick={() => onChange({ verified: !page.verified })}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none
                  ${page.verified ? 'bg-blue-600' : 'bg-gray-200'}
                `}
              >
                <span className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                  ${page.verified ? 'translate-x-5' : 'translate-x-0'}
                `} />
              </button>
            </div>

            {/* Upsell Mockup (Logic to be connected to actual user plan later) */}
            <div className="bg-blue-50 rounded-lg p-3 text-xs text-blue-700 flex items-start gap-2">
              <div className="mt-0.5 bg-blue-100 p-1 rounded-full"><Check className="w-3 h-3 text-blue-600" /></div>
              <div>
                <span className="font-semibold">Pro Feature:</span> Available on the Pro plan.
                <a href="/pricing" className="underline ml-1 hover:text-blue-800">Upgrade to enable</a>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
