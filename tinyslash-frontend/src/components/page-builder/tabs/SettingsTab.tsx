import React, { useState } from 'react';
import { Page } from '../../../types/page';
import {
  Globe, Shield, Trash2, Eye, Copy, ExternalLink,
  Share2, Image as ImageIcon, BarChart3, Puzzle, AlertTriangle, Plus, Loader2, CheckCircle2, XCircle, MessageCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { pageService } from '../../../services/pageService';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCustomDomains } from '../../../components/dashboard/CreateSection/hooks/useCustomDomains';
import { useSlugCheck } from '../../../hooks/useSlugCheck';
import { sanitizeSlug } from '../../../utils/sanitizeSlug';
import { useSubscription } from '../../../context/SubscriptionContext';
import { useAuth } from '../../../context/AuthContext';
import { Lock } from 'lucide-react';

interface SettingsTabProps {
  page: Page;
  onChange: (updates: Partial<Page>) => void;
}

// Sub-component for Slug Editing to isolate hook state
const SlugEditor = ({ currentSlug, pageId, onCancel, onSave }: { currentSlug: string, pageId: string, onCancel: () => void, onSave: (s: string) => void }) => {
  const { slug, setSlug, status, suggestions, selectSuggestion } = useSlugCheck(currentSlug, pageId);

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="flex items-center">
          <span className="bg-gray-100 border border-r-0 border-gray-300 text-gray-500 px-3 py-2 rounded-l-lg text-sm select-none">
            tinyslash.com/p/
          </span>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(sanitizeSlug(e.target.value))}
            className={`flex-1 w-full px-3 py-2 border rounded-r-lg focus:ring-2 outline-none transition-colors
              ${status === 'TAKEN' || status === 'RESERVED' ? 'border-red-300 focus:ring-red-200' :
                status === 'AVAILABLE' ? 'border-green-300 focus:ring-green-200' :
                  'border-gray-300 focus:ring-blue-500'}
            `}
            autoFocus
          />
          {/* Status Icon */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {status === 'CHECKING' && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
            {status === 'AVAILABLE' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            {status === 'TAKEN' && <XCircle className="w-4 h-4 text-red-500" />}
            {status === 'RESERVED' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
          </div>
        </div>
      </div>

      {/* Feedback */}
      <div className="text-xs">
        {status === 'AVAILABLE' && <p className="text-green-600 font-medium">Slug available!</p>}
        {status === 'TAKEN' && (
          <div className="space-y-2">
            <p className="text-red-600 font-medium">Taken. Try these:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map(s => (
                <button key={s} onClick={() => selectSuggestion(s)} className="px-2 py-1 bg-gray-100 hover:bg-gray-200 border rounded-md text-gray-700">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {status === 'RESERVED' && <p className="text-amber-600 font-medium">Reserved word.</p>}
        {status === 'RATE_LIMITED' && <p className="text-red-600">Too many requests. Slow down.</p>}
      </div>

      <div className="flex justify-end gap-2">
        <button onClick={onCancel} className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
        <button
          onClick={() => onSave(slug)}
          disabled={status !== 'AVAILABLE' && slug !== currentSlug}
          className="px-3 py-1.5 text-sm bg-black text-white rounded-lg disabled:opacity-50"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export const SettingsTab: React.FC<SettingsTabProps> = ({ page, onChange }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { planInfo, showUpgradeModal } = useSubscription();
  const { customDomains } = useCustomDomains();
  const { user } = useAuth();
  const [copySuccess, setCopySuccess] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState(false);
  const [isWaEnabled, setIsWaEnabled] = useState(!!page.waNumber);
  const [waCursorPos, setWaCursorPos] = useState({ field: 'smart', pos: 0 });

  const deleteMutation = useMutation({
    mutationFn: pageService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      toast.success('Page deleted successfully');
      navigate('/dashboard/pages');
    },
    onError: () => {
      toast.error('Failed to delete page');
    }
  });

  const handleDelete = () => {
    if (deleteConfirmation === page.title) {
      deleteMutation.mutate(page.id);
    } else {
      toast.error('Page name does not match');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    const toastId = toast.loading('Uploading OG Image...');
    try {
      const response = await pageService.uploadAsset(file);
      onChange({ socialImage: response.url });
      toast.success('Image updated', { id: toastId });
    } catch (error) {
      toast.error('Upload failed', { id: toastId });
    }
  };

  return (
    <div className="space-y-12 pb-24">

      {/* PAGE STATUS */}
      <section>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
          Page Status
        </h3>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2.5 h-2.5 rounded-full ${page.published ? 'bg-green-500' : 'bg-gray-300'}`} />
                <span className="font-semibold text-gray-900">{page.published ? 'Public' : 'Draft'}</span>
              </div>
              <p className="text-sm text-gray-500">
                {page.published ? 'Anyone with the link can view' : 'Only you can view'}
              </p>
            </div>
            <button
              onClick={() => onChange({ published: !page.published })}
              className={`
                        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ring-offset-2
                        ${page.published ? 'bg-black' : 'bg-gray-200'}
                    `}
            >
              <span className={`
                        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                        ${page.published ? 'translate-x-5' : 'translate-x-0'}
                    `} />
            </button>
          </div>
        </div>
      </section>

      {/* PAGE URL */}
      <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Page URL</h3>
              <p className="text-sm text-gray-500">Manage how people find your page</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Custom Domain Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-bold text-gray-700">Domain</label>
              {!planInfo?.canUsePageCustomDomain && (
                <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded flex items-center gap-1">
                  <Lock className="w-3 h-3" /> PRO
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <select
                value={page.customDomain || 'tinyslash.com'}
                onChange={(e) => {
                  if (!planInfo?.canUsePageCustomDomain && e.target.value !== 'tinyslash.com') {
                    showUpgradeModal('custom-domain');
                    return;
                  }
                  const val = e.target.value;
                  onChange({ customDomain: val === 'tinyslash.com' ? undefined : val });
                }}
                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none transition-all"
              >
                <option value="tinyslash.com">tinyslash.com</option>
                {/* Only show custom domains if they exist or user is pro? Actually show them but lock selection if checking plan */}
                {customDomains.map(domain => (
                  <option key={domain} value={domain}>{domain}</option>
                ))}
              </select>
              <a
                href="/dashboard/domains"
                target="_blank"
                className="px-4 py-2 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" /> Add Domain
              </a>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Select a verified custom domain or use the default tinyslash.com
            </p>
          </div>

          {/* Slug Editing */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              {page.customDomain ? 'Page Path (Optional)' : 'URL Slug'}
            </label>

            {!editingSlug ? (
              <div className="flex items-center gap-2 p-3 bg-gray-50 border border-gray-200 rounded-xl group hover:border-gray-300 transition-all">
                <span className="text-gray-400 font-medium select-none">
                  {page.customDomain ? `https://${page.customDomain}/` : 'tinyslash.com/p/'}
                </span>
                <span className="flex-1 font-bold text-gray-900">{page.slug}</span>

                <button
                  onClick={() => setEditingSlug(true)}
                  className="px-3 py-1.5 text-xs font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm"
                >
                  Change
                </button>

                <div className="h-4 w-px bg-gray-300 mx-1"></div>

                <button
                  onClick={() => {
                    const url = page.customDomain
                      ? `https://${page.customDomain}/${page.slug}`
                      : `${window.location.origin}/p/${page.slug}`;
                    navigator.clipboard.writeText(url);
                    setCopySuccess('Copied!');
                    setTimeout(() => setCopySuccess(''), 2000);
                  }}
                  className="p-2 text-gray-400 hover:text-black transition-colors relative"
                  title="Copy Link"
                >
                  {copySuccess ? <span className="text-green-500 font-bold text-xs absolute -top-8 left-1/2 -translate-x-1/2 bg-white shadow-md px-2 py-1 rounded-md">Copied!</span> : null}
                  <Copy className="w-4 h-4" />
                </button>
                <a
                  href={page.customDomain ? `https://${page.customDomain}/${page.slug}` : `/p/${page.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Open Page"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ) : (
              <SlugEditor
                currentSlug={page.slug}
                pageId={page.id}
                onCancel={() => setEditingSlug(false)}
                onSave={(newSlug) => {
                  onChange({ slug: newSlug });
                  setEditingSlug(false);
                  toast.success('URL updated');
                }}
              />
            )}
          </div>
        </div>
      </section>

      {/* SEO SETTINGS */}
      <section>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
          SEO Settings
        </h3>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
            <div className="relative">
              <input
                type="text"
                value={page.metaTitle || ''}
                onChange={(e) => onChange({ metaTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg pr-12"
                placeholder={page.title}
                maxLength={60}
              />
              <span className="absolute right-3 top-2.5 text-xs text-gray-400">
                {(page.metaTitle?.length || 0)}/60
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Appears in browser tabs and Google search results.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <div className="relative">
              <textarea
                value={page.metaDescription || ''}
                onChange={(e) => onChange({ metaDescription: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                placeholder="Briefly describe your page..."
                maxLength={160}
              />
              <span className="absolute right-3 bottom-2 text-xs text-gray-400">
                {(page.metaDescription?.length || 0)}/160
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Appears below the title in search results.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Social Share Image (OG Image)</label>
            <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden group">
              {page.socialImage ? (
                <>
                  <img src={page.socialImage} alt="OG" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">Click to change</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm font-medium text-gray-700">Drop image here or click to upload</p>
                  <p className="text-xs text-gray-500 mt-1">1200×630px recommended</p>
                </div>
              )}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
          </div>
        </div>
      </section>

      {/* ANALYTICS */}
      <section>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
          Analytics
        </h3>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="grid grid-cols-2 gap-6 mb-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Page Views</p>
              <p className="text-2xl font-bold text-gray-900">{page.views || 0}</p>
              <p className="text-xs text-gray-400">Last 30 days</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Unique Visitors</p>
              <p className="text-2xl font-bold text-gray-900">{page.uniqueVisitors || 0}</p>
              <p className="text-xs text-gray-400">Last 30 days</p>
            </div>
          </div>
          <button className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
            View Full Analytics <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </section>

      {/* SMART WHATSAPP ZONE */}
      <section>
        <div className="mb-4 border-b border-[#25D366]/20 pb-2">
          <h3 className="text-sm font-bold text-[#25D366] uppercase tracking-wider flex items-center gap-2">
            WhatsApp Integration <span className="text-[10px] bg-[#25D366] text-white px-1.5 py-0.5 rounded font-bold">PRO</span>
          </h3>
          <p className="text-xs text-gray-500 mt-1">Turn WhatsApp into a smart lead qualifier.</p>
        </div>

        {!planInfo?.canAccessDetailedAnalytics && (
          <div className="bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl p-4 mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#25D366]/20 text-[#25D366] rounded-lg">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-green-900">Upgrade to Smart WhatsApp</p>
                <p className="text-xs text-green-700">Add a floating WhatsApp button with context-aware smart templates.</p>
              </div>
            </div>
            <button
              onClick={() => showUpgradeModal('whatsapp')}
              className="text-xs font-bold bg-[#25D366] text-white px-3 py-1.5 rounded-lg hover:bg-[#1EBE5D]"
            >
              Upgrade
            </button>
          </div>
        )}

        <div className={`space-y-6 ${!planInfo?.canAccessDetailedAnalytics ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>

          {/* Toggle */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <p className="font-bold text-gray-900 text-sm">Enable Smart WhatsApp Floating Button</p>
              <p className="text-xs text-gray-500">Show a chat button to visitors.</p>
            </div>
            <button
              onClick={() => {
                const newState = !isWaEnabled;
                setIsWaEnabled(newState);
                if (!newState) {
                  onChange({ waNumber: '', waDefaultMessage: '', waSmartTemplate: '' });
                }
              }}
              className={`
                 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ring-offset-2
                 ${isWaEnabled ? 'bg-[#25D366]' : 'bg-gray-200'}
              `}
            >
              <span className={`
                 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                 ${isWaEnabled ? 'translate-x-5' : 'translate-x-0'}
              `} />
            </button>
          </div>

          {isWaEnabled && (
            <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">

              {/* WhatsApp Number */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp Number</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400">
                    <MessageCircle className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    value={page.waNumber || ''}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      onChange({ waNumber: val });
                    }}
                    className={`
                      w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 outline-none transition-all font-mono
                      ${page.waNumber && page.waNumber.length >= 10 && page.waNumber.length <= 15 ? 'border-green-300 focus:ring-green-200' : page.waNumber ? 'border-red-300 focus:ring-red-200' : 'border-gray-300 focus:ring-[#25D366]'}
                    `}
                    placeholder="e.g. 919876543210"
                    disabled={!planInfo?.canAccessDetailedAnalytics}
                  />
                  {page.waNumber && page.waNumber.length >= 10 && page.waNumber.length <= 15 && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 absolute right-3 top-2.5" />
                  )}
                  {page.waNumber && (page.waNumber.length < 10 || page.waNumber.length > 15) && (
                    <AlertTriangle className="w-5 h-5 text-red-500 absolute right-3 top-2.5" />
                  )}
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500" /> Include country code
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-green-500" /> No +, spaces, or dashes
                  </p>
                </div>
              </div>

              <hr className="border-gray-100" />

              {/* Display Type */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Display Style</label>
                <select
                  value={page.waDisplayType || 'FLOATING'}
                  onChange={(e) => onChange({ waDisplayType: e.target.value as 'FLOATING' | 'BUTTON' | 'BOTH' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#25D366] outline-none transition-all text-sm"
                  disabled={!planInfo?.canAccessDetailedAnalytics}
                >
                  <option value="FLOATING">Floating Icon (Bottom Right)</option>
                  <option value="BUTTON">Full Width Button (At Bottom)</option>
                  <option value="BOTH">Both</option>
                </select>
              </div>

              <hr className="border-gray-100" />

              {/* Default Message */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-bold text-gray-700">Default Message</label>
                  <span className="text-[10px] text-gray-400">Used when no link is clicked</span>
                </div>
                <textarea
                  value={page.waDefaultMessage || ''}
                  onChange={(e) => onChange({ waDefaultMessage: e.target.value })}
                  onFocus={() => setWaCursorPos({ field: 'default', pos: (page.waDefaultMessage || '').length })}
                  onClick={(e) => setWaCursorPos({ field: 'default', pos: e.currentTarget.selectionStart })}
                  onKeyUp={(e) => setWaCursorPos({ field: 'default', pos: e.currentTarget.selectionStart })}
                  rows={2}
                  maxLength={500}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-[#25D366] outline-none transition-all resize-none"
                  placeholder="Hi! I want to know more about your page."
                  disabled={!planInfo?.canAccessDetailedAnalytics}
                />
                <div className="flex justify-end mt-1">
                  <span className="text-xs text-gray-400">{(page.waDefaultMessage || '').length} / 500 characters</span>
                </div>
              </div>

              {/* Smart Template */}
              <div>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700">
                      Smart Pre-filled Template <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">PRO Feature</span>
                    </label>
                    <p className="text-xs text-gray-500 mt-0.5">Used when a visitor taps WhatsApp after clicking a link</p>
                  </div>
                </div>

                <textarea
                  value={page.waSmartTemplate || ''}
                  onChange={(e) => onChange({ waSmartTemplate: e.target.value })}
                  onFocus={() => setWaCursorPos({ field: 'smart', pos: (page.waSmartTemplate || '').length })}
                  onClick={(e) => setWaCursorPos({ field: 'smart', pos: e.currentTarget.selectionStart })}
                  onKeyUp={(e) => setWaCursorPos({ field: 'smart', pos: e.currentTarget.selectionStart })}
                  rows={3}
                  maxLength={500}
                  className="w-full mt-2 px-3 py-2 border border-blue-200 bg-blue-50 focus:bg-white rounded-lg placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  placeholder="Hi {owner_name}, I saw {link_name} on your page and I am interested!"
                  disabled={!planInfo?.canAccessDetailedAnalytics}
                />
                <div className="flex justify-end mt-1 mb-3">
                  <span className="text-xs text-gray-400">{(page.waSmartTemplate || '').length} / 500 characters</span>
                </div>

                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                  <p className="text-xs font-bold text-gray-700 mb-2">Available Variables (Click to insert):</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {['owner_name', 'link_name', 'page_name', 'page_url', 'city'].map(v => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => {
                          const toInsert = `{${v}}`;
                          if (waCursorPos.field === 'smart') {
                            const current = page.waSmartTemplate || '';
                            const p = waCursorPos.pos;
                            const next = current.slice(0, p) + toInsert + current.slice(p);
                            onChange({ waSmartTemplate: next });
                            setWaCursorPos({ field: 'smart', pos: p + toInsert.length });
                          } else {
                            const current = page.waDefaultMessage || '';
                            const p = waCursorPos.pos;
                            const next = current.slice(0, p) + toInsert + current.slice(p);
                            onChange({ waDefaultMessage: next });
                            setWaCursorPos({ field: 'default', pos: p + toInsert.length });
                          }
                        }}
                        className="px-2 py-1 bg-white border border-gray-200 rounded text-[11px] font-mono text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                      >
                        {`{${v}}`}
                      </button>
                    ))}
                  </div>

                  {/* UI Up-sell Persuasion */}
                  <div className="space-y-1 mt-3">
                    <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-blue-500" /> Automatically personalizes message
                    </p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-blue-500" /> Increases response rate
                    </p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-blue-500" /> Shows which services generate inquiries
                    </p>
                  </div>
                </div>

                {/* Live Preview */}
                {(page.waSmartTemplate || page.waDefaultMessage) && (
                  <div className="mt-4 p-4 bg-[#E1FDD7] rounded-lg border border-[#25D366]/30 relative">
                    <span className="absolute -top-2.5 left-4 bg-[#25D366] text-white text-[10px] font-bold px-2 py-0.5 rounded">Preview</span>
                    <p className="text-sm text-gray-800 break-words whitespace-pre-wrap">
                      {(page.waSmartTemplate || page.waDefaultMessage || '')
                        .replace(/{owner_name}/g, user?.name || 'Owner')
                        .replace(/{link_name}/g, 'Wedding Photography')
                        .replace(/{page_name}/g, page.title || 'My Page')
                        .replace(/{page_url}/g, 'tinyslash.com/p/preview')
                        .replace(/{city}/g, 'Mumbai')}
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </section>

      {/* INTEGRATIONS */}
      <section>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
          Integrations <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded">PRO</span>
        </h3>

        {!planInfo?.canAccessDetailedAnalytics && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-blue-900">Upgrade to Connect Integrations</p>
                <p className="text-xs text-blue-700">Add pixels and tracking IDs with a Pro plan.</p>
              </div>
            </div>
            <button
              onClick={() => showUpgradeModal('integrations')}
              className="text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700"
            >
              Upgrade
            </button>
          </div>
        )}

        <div className={`space-y-4 ${!planInfo?.canAccessDetailedAnalytics ? 'opacity-50 pointer-events-none' : 'opacity-80'}`}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Facebook Pixel ID</label>
            <input
              type="text"
              value={page.fbPixelId || ''}
              onChange={(e) => onChange({ fbPixelId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400"
              placeholder="e.g. 1234567890"
              disabled={!planInfo?.canAccessDetailedAnalytics}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics Measurement ID</label>
            <input
              type="text"
              value={page.googleAnalyticsId || ''}
              onChange={(e) => onChange({ googleAnalyticsId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg placeholder-gray-400"
              placeholder="e.g. G-XXXXXXXXXX"
              disabled={!planInfo?.canAccessDetailedAnalytics}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Scripts (head)</label>
            <textarea
              value={page.customScripts || ''}
              onChange={(e) => onChange({ customScripts: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-xs placeholder-gray-400"
              placeholder="<script>...</script>"
              disabled={!planInfo?.canAccessDetailedAnalytics}
            />
          </div>
        </div>
      </section>

      {/* DANGER ZONE */}
      <section>
        <h3 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-4 border-b border-red-100 pb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> Danger Zone
        </h3>
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h4 className="font-bold text-red-900 mb-1">Delete This Page</h4>
          <p className="text-sm text-red-700 mb-4 max-w-md">
            This permanently deletes your page, all its content, and its URL. This action cannot be undone.
          </p>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="bg-white border border-red-300 text-red-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors"
          >
            Delete Page
          </button>
        </div>
      </section>

      {/* DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Are you sure?</h3>
            <p className="text-gray-600 mb-4 text-sm">
              This action cannot be undone. Please type <span className="font-bold text-black">{page.title}</span> to confirm.
            </p>

            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Type page name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-red-500 outline-none"
              autoFocus
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setIsDeleteModalOpen(false); setDeleteConfirmation(''); }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteConfirmation !== page.title || deleteMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete Forever'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
