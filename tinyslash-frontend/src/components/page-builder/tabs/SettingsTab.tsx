import React from 'react';
import { Page } from '../../../types/page';
import { Globe, Shield, Trash2, Eye, Copy, ExternalLink, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface SettingsTabProps {
  page: Page;
  onChange: (updates: Partial<Page>) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ page, onChange }) => {
  return (
    <div className="space-y-8">

      {/* Share URL */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Share2 className="w-4 h-4" /> Share Page
        </h3>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 overflow-hidden">
            <p className="font-medium text-gray-900 mb-1">Public URL</p>
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
              <span className="text-sm text-gray-600 truncate font-mono flex-1">
                {window.location.origin}/p/{page.slug}
              </span>
              <button
                onClick={() => {
                  const url = `${window.location.origin}/p/${page.slug}`;
                  navigator.clipboard.writeText(url);
                  toast.success('Copied to clipboard!');
                }}
                className="p-1.5 hover:bg-white rounded-md text-gray-400 hover:text-blue-600 transition-colors shadow-sm"
                title="Copy"
              >
                <Copy className="w-4 h-4" />
              </button>
              <a
                href={`/p/${page.slug}`}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 hover:bg-white rounded-md text-gray-400 hover:text-blue-600 transition-colors shadow-sm"
                title="Open"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Status */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4" /> Visibility
        </h3>
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-900">Page Status</p>
            <p className="text-xs text-gray-500">{page.published ? 'Visible to everyone' : 'Only visible to you'}</p>
          </div>
          <button
            onClick={() => onChange({ published: !page.published })}
            className={`
                    relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ring-offset-2
                    ${page.published ? 'bg-green-500' : 'bg-gray-200'}
                `}
          >
            <span className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                    ${page.published ? 'translate-x-5' : 'translate-x-0'}
                `} />
          </button>
        </div>
      </div>

      {/* SEO */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Eye className="w-4 h-4" /> SEO Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
            <input
              type="text"
              value={page.metaTitle || ''}
              onChange={(e) => onChange({ metaTitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Title shown in Google search"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea
              value={page.metaDescription || ''}
              onChange={(e) => onChange({ metaDescription: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
              placeholder="Description shown in Google search results"
            />
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div>
        <h3 className="text-sm font-semibold text-red-600 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4" /> Danger Zone
        </h3>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-red-900">Delete Page</p>
              <p className="text-xs text-red-700">This action cannot be undone.</p>
            </div>
            <button
              onClick={() => { if (confirm('Are you sure?')) { /* Propagate delete */ } }}
              className="bg-white text-red-600 border border-red-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
