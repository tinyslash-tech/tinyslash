import React, { useState } from 'react';
import { PageBlock } from '../../../types/page';
import { Trash2, Image as ImageIcon, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { pageService } from '../../../services/pageService';

interface BlockEditorProps {
  block: PageBlock;
  onChange: (content: any) => void;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({ block, onChange }) => {
  switch (block.type) {
    case 'LINK': return <LinkEditor block={block} onChange={onChange} />;
    case 'HEADER': return <HeaderEditor block={block} onChange={onChange} />;
    case 'TEXT': return <TextEditor block={block} onChange={onChange} />;
    case 'IMAGE': return <ImageEditor block={block} onChange={onChange} />;
    case 'VIDEO': return <VideoEditor block={block} onChange={onChange} />;
    case 'SOCIAL': return <SocialEditor block={block} onChange={onChange} />;
    case 'FORM': return <FormEditor block={block} onChange={onChange} />;
    case 'EMAIL': return <EmailEditor block={block} onChange={onChange} />;
    case 'DIVIDER': return <DividerEditor block={block} onChange={onChange} />;
    case 'PAYMENT': return <PaymentEditor block={block} onChange={onChange} />;
    default: return <div className="text-gray-500 italic p-4">Editor not implemented for {block.type}</div>;
  }
};

const LinkEditor = ({ block, onChange }: BlockEditorProps) => (
  <div className="space-y-4 p-1">
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">Title <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={block.content.title || ''}
        onChange={(e) => onChange({ ...block.content, title: e.target.value })}
        placeholder="e.g. Watch my latest video"
        className="w-full text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">URL <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={block.content.url || ''}
        onChange={(e) => onChange({ ...block.content, url: e.target.value })}
        placeholder="https://"
        className="w-full text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={block.content.highlight || false}
        onChange={(e) => onChange({ ...block.content, highlight: e.target.checked })}
        id={`highlight-${block.id}`}
        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <label htmlFor={`highlight-${block.id}`} className="text-xs text-gray-700 font-medium">Highlight this link</label>
    </div>
  </div>
);

const HeaderEditor = ({ block, onChange }: BlockEditorProps) => (
  <div className="space-y-4 p-1">
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">Heading Text <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={block.content.text || ''}
        onChange={(e) => onChange({ ...block.content, text: e.target.value })}
        placeholder="e.g. Shop My Favorites"
        maxLength={60}
        className="w-full text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 font-bold"
      />
      <p className="text-[10px] text-gray-400 mt-1 text-right">{block.content.text?.length || 0}/60</p>
    </div>
  </div>
);

const TextEditor = ({ block, onChange }: BlockEditorProps) => (
  <div className="space-y-4 p-1">
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">Body Text <span className="text-red-500">*</span></label>
      <textarea
        value={block.content.text || ''}
        onChange={(e) => onChange({ ...block.content, text: e.target.value })}
        placeholder="Write anything..."
        rows={4}
        maxLength={500}
        className="w-full text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 resize-none"
      />
      <p className="text-[10px] text-gray-400 mt-1 text-right">{block.content.text?.length || 0}/500</p>
    </div>
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">Alignment</label>
      <div className="flex bg-gray-100 p-1 rounded-lg w-max">
        {['left', 'center', 'right'].map((align) => (
          <button
            key={align}
            onClick={() => onChange({ ...block.content, align })}
            className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-all ${(block.content.align || 'left') === align ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
          >
            {align}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const ImageEditor = ({ block, onChange }: BlockEditorProps) => {
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const toastId = toast.loading('Uploading image...');
    try {
      const response = await pageService.uploadAsset(file);
      if (response.url) {
        onChange({ ...block.content, url: response.url });
        toast.success('Image uploaded', { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error('Upload failed', { id: toastId });
    }
  };

  return (
    <div className="space-y-4 p-1">
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Image <span className="text-red-500">*</span></label>
        {block.content.url ? (
          <div className="relative group">
            <img src={block.content.url} alt="Preview" className="w-full h-48 object-cover rounded-lg border border-gray-200" />
            <button
              onClick={() => onChange({ ...block.content, url: '' })}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
              <p className="text-xs text-gray-500 font-medium">Click to upload image</p>
              <p className="text-[10px] text-gray-400">JPG, PNG, GIF. Max 10MB.</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        )}
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Link URL (optional)</label>
        <input
          type="text"
          value={block.content.linkUrl || ''}
          onChange={(e) => onChange({ ...block.content, linkUrl: e.target.value })}
          placeholder="https://"
          className="w-full text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Alt Text (optional)</label>
        <input
          type="text"
          value={block.content.alt || ''}
          onChange={(e) => onChange({ ...block.content, alt: e.target.value })}
          placeholder="Describe the image"
          className="w-full text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </div>
  );
};

const VideoEditor = ({ block, onChange }: BlockEditorProps) => (
  <div className="space-y-4 p-1">
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">Video URL <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={block.content.url || ''}
        onChange={(e) => onChange({ ...block.content, url: e.target.value })}
        placeholder="e.g. https://youtube.com/watch?v=..."
        className="w-full text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />
      <p className="text-[10px] text-gray-400 mt-1">Supports YouTube, Vimeo, and TikTok.</p>
    </div>
  </div>
);

const SocialEditor = ({ block, onChange }: BlockEditorProps) => {
  // block.content.links is array of { platform, url }
  const links = block.content.links || [];

  const addLink = () => {
    onChange({ ...block.content, links: [...links, { platform: 'instagram', url: '' }] });
  };

  const updateLink = (index: number, field: string, value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    onChange({ ...block.content, links: newLinks });
  };

  const removeLink = (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    onChange({ ...block.content, links: newLinks });
  };

  return (
    <div className="space-y-4 p-1">
      <div className="space-y-3">
        {links.map((link: any, index: number) => (
          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
            <select
              value={link.platform}
              onChange={(e) => updateLink(index, 'platform', e.target.value)}
              className="text-sm border-gray-300 rounded bg-white w-32 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube</option>
              <option value="twitter">X (Twitter)</option>
              <option value="linkedin">LinkedIn</option>
              <option value="facebook">Facebook</option>
              <option value="github">GitHub</option>
              <option value="website">Website</option>
            </select>
            <input
              type="text"
              value={link.url}
              onChange={(e) => updateLink(index, 'url', e.target.value)}
              placeholder="URL"
              className="flex-1 text-sm border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            />
            <button onClick={() => removeLink(index)} className="p-1 text-gray-400 hover:text-red-500">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button onClick={addLink} className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700">
        <Plus className="w-4 h-4" /> Add Social Profile
      </button>
    </div>
  );
};

const FormEditor = ({ block, onChange }: BlockEditorProps) => (
  <div className="space-y-4 p-1">
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">Form Title</label>
      <input
        type="text"
        value={block.content.title || ''}
        onChange={(e) => onChange({ ...block.content, title: e.target.value })}
        placeholder="e.g. Subscribe"
        className="w-full text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-700">Fields</label>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked readOnly className="rounded text-blue-600 border-gray-300" />
        <span className="text-sm text-gray-600">Email (Required)</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={block.content.collectName || false}
          onChange={(e) => onChange({ ...block.content, collectName: e.target.checked })}
          className="rounded text-blue-600 border-gray-300"
        />
        <span className="text-sm text-gray-600">Name</span>
      </div>
    </div>
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">Button Text</label>
      <input
        type="text"
        value={block.content.buttonText || 'Subscribe'}
        onChange={(e) => onChange({ ...block.content, buttonText: e.target.value })}
        className="w-full text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  </div>
);

const EmailEditor = ({ block, onChange }: BlockEditorProps) => (
  <div className="space-y-4 p-1">
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">Headline</label>
      <input
        type="text"
        value={block.content.title || ''}
        onChange={(e) => onChange({ ...block.content, title: e.target.value })}
        placeholder="Join my mailing list"
        className="w-full text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">Button Text</label>
      <input
        type="text"
        value={block.content.buttonText || 'Sign Up'}
        onChange={(e) => onChange({ ...block.content, buttonText: e.target.value })}
        className="w-full text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  </div>
);

const DividerEditor = ({ block, onChange }: BlockEditorProps) => (
  <div className="space-y-4 p-1">
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">Style</label>
      <div className="flex gap-2">
        {['solid', 'dotted', 'empty'].map(s => (
          <button
            key={s}
            onClick={() => onChange({ ...block.content, style: s })}
            className={`px-3 py-1.5 text-xs rounded border capitalize ${(block.content.style || 'solid') === s ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 text-gray-600'
              }`}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const PaymentEditor = ({ block, onChange }: BlockEditorProps) => (
  <div className="space-y-4 p-1">
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">Label <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={block.content.label || ''}
        onChange={(e) => onChange({ ...block.content, label: e.target.value })}
        placeholder="e.g. Buy me a coffee"
        className="w-full text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">Payment URL <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={block.content.url || ''}
        onChange={(e) => onChange({ ...block.content, url: e.target.value })}
        placeholder="https://buymeacoffee.com/..."
        className="w-full text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  </div>
);
