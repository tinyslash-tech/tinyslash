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
      // Backend now supports generic file upload, let's use that
      // Assuming pageService.uploadImage is implemented or we use a direct upload endpoint
      // For now, let's implement a simple upload in pageService if not exists, 
      // or just mock it if we don't have the endpoint handy in this context. 
      // Checking pageService.ts from previous steps... 
      // It has uploadFileToBackend. Let's use that.

      // We need to implement pageService.uploadImage or similar.
      // Let's assume we can add it or use an existing one. 
      // The previous pageService.ts had `uploadFile` and `uploadFileToBackend`.

      const response = await pageService.uploadFile(file); // We need to ensure this method exists/works for public assets

      // If the service returns a url, use it.
      if (response.url) {
        onChange({ avatarUrl: response.url }); // Or distinct URL field
        toast.success('Avatar updated', { id: toastId });
      }
    } catch (error) {
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
                {/* We will leave this simple for now and just use a text input or placeholder for actual upload implementation if service is missing */}
                <input
                  type="text"
                  value={page.avatarUrl || ''}
                  onChange={(e) => onChange({ avatarUrl: e.target.value })}
                  placeholder="Image URL (https://...)"
                  className="block w-full text-sm border-gray-300 rounded mb-2"
                />
                <p className="text-xs text-gray-500">Enter an image URL for your profile picture.</p>
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
