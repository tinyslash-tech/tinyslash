import React from 'react';
import { Page } from '../../../types/page';
import { User, FileText, Upload } from 'lucide-react';
import { pageService } from '../../../services/pageService';
import toast from 'react-hot-toast';

interface IdentityTabProps {
  page: Page;
  onChange: (updates: Partial<Page>) => void;
}

export const IdentityTab: React.FC<IdentityTabProps> = ({ page, onChange }) => {

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading('Uploading image...');
    try {
      const response = await pageService.uploadAsset(file);
      if (response.url) {
        onChange({ avatarUrl: response.url });
        toast.success('Avatar updated', { id: toastId });
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed', { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          Page Identity
        </h3>

        <div className="space-y-4">
          {/* Avatar Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
            <div className="flex items-center gap-4">
              {page.avatarUrl ? (
                <img src={page.avatarUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover border border-gray-200" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200 text-gray-400">
                  <User className="w-8 h-8" />
                </div>
              )}
              <div>
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <Upload className="-ml-1 mr-2 w-4 h-4" />
                  Upload Image
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileUpload}
                  />
                </label>
                <div className="mt-2 text-xs text-gray-500">
                  <p>Recommended: Square image, at least 200x200px.</p>
                  <p>Max file size: 2MB. Supports JPG, PNG.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Page Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              value={page.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Jane Doe"
            />
          </div>

          {/* Unique Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page URL</label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                tinyslash.in/p/
              </span>
              <input
                type="text"
                value={page.slug}
                onChange={(e) => onChange({ slug: e.target.value })}
                className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="username"
              />
            </div>
            {/* We could add an availability checker here later */}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
              <span>Bio</span>
              <span className="text-xs text-gray-400">{(page.bio || '').length}/150</span>
            </label>
            <textarea
              value={page.bio || ''}
              onChange={(e) => onChange({ bio: e.target.value })}
              rows={3}
              maxLength={150}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Tell your visitors a little about yourself..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};
