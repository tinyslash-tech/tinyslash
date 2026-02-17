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
    case 'AFFILIATE': return <AffiliateEditor block={block} onChange={onChange} />;
    case 'CARD': return <CardEditor block={block} onChange={onChange} />;
    default: return <div className="text-gray-500 italic p-4">Editor not implemented for {block.type}</div>;
  }
};

// Shared input classes for consistency
const INPUT_CLASSES = "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all text-sm placeholder:text-gray-400";
const LABEL_CLASSES = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5";

const LinkEditor = ({ block, onChange }: BlockEditorProps) => (
  <div className="space-y-4 p-1">
    <div>
      <label className={LABEL_CLASSES}>Title <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={block.content.title || ''}
        onChange={(e) => onChange({ ...block.content, title: e.target.value })}
        placeholder="e.g. Watch my latest video"
        className={INPUT_CLASSES}
      />
    </div>
    <div>
      <label className={LABEL_CLASSES}>URL <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={block.content.url || ''}
        onChange={(e) => onChange({ ...block.content, url: e.target.value })}
        placeholder="https://"
        className={INPUT_CLASSES}
      />
    </div>
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={block.content.highlight || false}
        onChange={(e) => onChange({ ...block.content, highlight: e.target.checked })}
        id={`highlight-${block.id}`}
        className="rounded border-gray-300 text-black focus:ring-black/10"
      />
      <label htmlFor={`highlight-${block.id}`} className="text-xs text-gray-700 font-medium">Highlight this link</label>
    </div>
  </div>
);

const HeaderEditor = ({ block, onChange }: BlockEditorProps) => (
  <div className="space-y-4 p-1">
    <div>
      <label className={LABEL_CLASSES}>Heading Text <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={block.content.text || ''}
        onChange={(e) => onChange({ ...block.content, text: e.target.value })}
        placeholder="e.g. Shop My Favorites"
        maxLength={60}
        className={`${INPUT_CLASSES} font-bold`}
      />
      <p className="text-[10px] text-gray-400 mt-1 text-right">{block.content.text?.length || 0}/60</p>
    </div>
    <div>
      <label className={LABEL_CLASSES}>Sub-heading (Optional)</label>
      <input
        type="text"
        value={block.content.subTitle || ''}
        onChange={(e) => onChange({ ...block.content, subTitle: e.target.value })}
        placeholder="e.g. A short description"
        maxLength={100}
        className={INPUT_CLASSES}
      />
    </div>
  </div>
);

const TextEditor = ({ block, onChange }: BlockEditorProps) => (
  <div className="space-y-4 p-1">
    <div>
      <label className={LABEL_CLASSES}>Body Text <span className="text-red-500">*</span></label>
      <textarea
        value={block.content.text || ''}
        onChange={(e) => onChange({ ...block.content, text: e.target.value })}
        placeholder="Write anything..."
        rows={4}
        maxLength={500}
        className={`${INPUT_CLASSES} resize-none`}
      />
      <p className="text-[10px] text-gray-400 mt-1 text-right">{block.content.text?.length || 0}/500</p>
    </div>
    <div>
      <label className={LABEL_CLASSES}>Alignment</label>
      <div className="flex bg-gray-100 p-1 rounded-md w-max border border-gray-200">
        {['left', 'center', 'right'].map((align) => (
          <button
            key={align}
            onClick={() => onChange({ ...block.content, align })}
            className={`px-3 py-1 text-xs font-semibold rounded-sm capitalize transition-all ${(block.content.align || 'left') === align
              ? 'bg-white shadow-sm text-gray-900 border border-gray-100'
              : 'text-gray-500 hover:text-gray-900'
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
      } else {
        toast.error('Upload failed: No URL returned', { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error('Upload failed', { id: toastId });
    }
  };

  return (
    <div className="space-y-4 p-1">
      <div>
        <label className={LABEL_CLASSES}>Image <span className="text-red-500">*</span></label>
        {block.content.url ? (
          <div className="relative group">
            <img src={block.content.url} alt="Preview" className="w-full h-48 object-cover rounded-md border border-gray-200" />
            <button
              onClick={() => onChange({ ...block.content, url: '' })}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
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
        <label className={LABEL_CLASSES}>Link URL (optional)</label>
        <input
          type="text"
          value={block.content.linkUrl || ''}
          onChange={(e) => onChange({ ...block.content, linkUrl: e.target.value })}
          placeholder="https://"
          className={INPUT_CLASSES}
        />
      </div>
      <div>
        <label className={LABEL_CLASSES}>Alt Text (optional)</label>
        <input
          type="text"
          value={block.content.alt || ''}
          onChange={(e) => onChange({ ...block.content, alt: e.target.value })}
          placeholder="Describe the image"
          className={INPUT_CLASSES}
        />
      </div>
    </div>
  );
};

const VideoEditor = ({ block, onChange }: BlockEditorProps) => (
  <div className="space-y-4 p-1">
    <div>
      <label className={LABEL_CLASSES}>Video URL <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={block.content.url || ''}
        onChange={(e) => onChange({ ...block.content, url: e.target.value })}
        placeholder="e.g. https://youtube.com/watch?v=..."
        className={INPUT_CLASSES}
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
          <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-md border border-gray-200">
            <select
              value={link.platform}
              onChange={(e) => updateLink(index, 'platform', e.target.value)}
              className="text-sm border-gray-200 rounded-md bg-white w-32 focus:ring-black/5 focus:border-gray-400"
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
              className="flex-1 text-sm bg-white border-gray-200 rounded-md focus:ring-black/5 focus:border-gray-400 focus:outline-none px-3 py-2"
            />
            <button onClick={() => removeLink(index)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button onClick={addLink} className="flex items-center gap-1 text-sm font-semibold text-black hover:text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition-colors">
        <Plus className="w-4 h-4" /> Add Social Profile
      </button>
    </div>
  );
};

const FormEditor = ({ block, onChange }: BlockEditorProps) => (
  <div className="space-y-4 p-1">
    <div>
      <label className={LABEL_CLASSES}>Form Title</label>
      <input
        type="text"
        value={block.content.title || ''}
        onChange={(e) => onChange({ ...block.content, title: e.target.value })}
        placeholder="e.g. Subscribe"
        className={INPUT_CLASSES}
      />
    </div>
    <div className="space-y-3 p-3 bg-gray-50 rounded-md border border-gray-200">
      <label className={LABEL_CLASSES}>Fields</label>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked readOnly className="rounded border-gray-300 text-black" />
        <span className="text-sm text-gray-700 font-medium">Email (Required)</span>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={block.content.collectName || false}
          onChange={(e) => onChange({ ...block.content, collectName: e.target.checked })}
          className="rounded border-gray-300 text-black focus:ring-black/10"
        />
        <span className="text-sm text-gray-900">Name</span>
      </div>
    </div>
    <div>
      <label className={LABEL_CLASSES}>Button Text</label>
      <input
        type="text"
        value={block.content.buttonText || 'Subscribe'}
        onChange={(e) => onChange({ ...block.content, buttonText: e.target.value })}
        className={INPUT_CLASSES}
      />
    </div>
  </div>
);

const EmailEditor = ({ block, onChange }: BlockEditorProps) => (
  <div className="space-y-4 p-1">
    <div>
      <label className={LABEL_CLASSES}>Headline</label>
      <input
        type="text"
        value={block.content.title || ''}
        onChange={(e) => onChange({ ...block.content, title: e.target.value })}
        placeholder="Join my mailing list"
        className={INPUT_CLASSES}
      />
    </div>
    <div>
      <label className={LABEL_CLASSES}>Button Text</label>
      <input
        type="text"
        value={block.content.buttonText || 'Sign Up'}
        onChange={(e) => onChange({ ...block.content, buttonText: e.target.value })}
        className={INPUT_CLASSES}
      />
    </div>
  </div>
);

const DividerEditor = ({ block, onChange }: BlockEditorProps) => (
  <div className="space-y-4 p-1">
    <div>
      <label className={LABEL_CLASSES}>Style</label>
      <div className="flex gap-2">
        {['solid', 'dotted', 'empty'].map(s => (
          <button
            key={s}
            onClick={() => onChange({ ...block.content, style: s })}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md border capitalize transition-all ${(block.content.style || 'solid') === s
              ? 'bg-black text-white border-black'
              : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
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
      <label className={LABEL_CLASSES}>Label <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={block.content.label || ''}
        onChange={(e) => onChange({ ...block.content, label: e.target.value })}
        placeholder="e.g. Buy me a coffee"
        className={INPUT_CLASSES}
      />
    </div>
    <div>
      <label className={LABEL_CLASSES}>Payment URL <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={block.content.url || ''}
        onChange={(e) => onChange({ ...block.content, url: e.target.value })}
        placeholder="https://buymeacoffee.com/..."
        className={INPUT_CLASSES}
      />
    </div>
  </div>
);

const AffiliateEditor = ({ block, onChange }: BlockEditorProps) => {
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
        onChange({ ...block.content, imageUrl: response.url });
        toast.success('Image uploaded', { id: toastId });
      } else {
        toast.error('Upload failed', { id: toastId });
      }
    } catch {
      toast.error('Upload failed', { id: toastId });
    }
  };

  return (
    <div className="space-y-4 p-1">
      <div>
        <label className={LABEL_CLASSES}>Product Title <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={block.content.title || ''}
          onChange={(e) => onChange({ ...block.content, title: e.target.value })}
          placeholder="e.g. My Favorite Headphones"
          className={INPUT_CLASSES}
        />
      </div>
      <div>
        <label className={LABEL_CLASSES}>Product Image</label>
        {block.content.imageUrl ? (
          <div className="relative group">
            <img src={block.content.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-md border border-gray-200" />
            <button
              onClick={() => onChange({ ...block.content, imageUrl: '' })}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md text-gray-600 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
            <p className="text-xs text-gray-500">Upload product image</p>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        )}
      </div>
      <div>
        <label className={LABEL_CLASSES}>Product Link <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={block.content.url || ''}
          onChange={(e) => onChange({ ...block.content, url: e.target.value })}
          placeholder="https://amazon.com/..."
          className={INPUT_CLASSES}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL_CLASSES}>Price</label>
          <input
            type="text"
            value={block.content.price || ''}
            onChange={(e) => onChange({ ...block.content, price: e.target.value })}
            placeholder="₹1,999"
            className={INPUT_CLASSES}
          />
        </div>
        <div>
          <label className={LABEL_CLASSES}>Button Text</label>
          <input
            type="text"
            value={block.content.buttonText || 'Buy Now'}
            onChange={(e) => onChange({ ...block.content, buttonText: e.target.value })}
            className={INPUT_CLASSES}
          />
        </div>
      </div>
      <CardDesignSection content={block.content} onChange={onChange} block={block} />
    </div>
  );
};

const CardEditor = ({ block, onChange }: BlockEditorProps) => {
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
        onChange({ ...block.content, imageUrl: response.url });
        toast.success('Image uploaded', { id: toastId });
      } else {
        toast.error('Upload failed', { id: toastId });
      }
    } catch {
      toast.error('Upload failed', { id: toastId });
    }
  };

  return (
    <div className="space-y-4 p-1">
      <div>
        <label className={LABEL_CLASSES}>Card Title <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={block.content.title || ''}
          onChange={(e) => onChange({ ...block.content, title: e.target.value })}
          placeholder="e.g. My Latest Course"
          className={INPUT_CLASSES}
        />
      </div>
      <div>
        <label className={LABEL_CLASSES}>Description</label>
        <textarea
          value={block.content.description || ''}
          onChange={(e) => onChange({ ...block.content, description: e.target.value })}
          placeholder="Brief description..."
          rows={3}
          maxLength={200}
          className={`${INPUT_CLASSES} resize-none`}
        />
      </div>
      <div>
        <label className={LABEL_CLASSES}>Card Image</label>
        {block.content.imageUrl ? (
          <div className="relative group">
            <img src={block.content.imageUrl} alt="Preview" className="w-full h-32 object-cover rounded-md border border-gray-200" />
            <button
              onClick={() => onChange({ ...block.content, imageUrl: '' })}
              className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md text-gray-600 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
            <p className="text-xs text-gray-500">Upload card image</p>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        )}
      </div>
      <div>
        <label className={LABEL_CLASSES}>Button Text</label>
        <input
          type="text"
          value={block.content.buttonText || 'Learn More'}
          onChange={(e) => onChange({ ...block.content, buttonText: e.target.value })}
          className={INPUT_CLASSES}
        />
      </div>
      <div>
        <label className={LABEL_CLASSES}>Button Link <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={block.content.url || ''}
          onChange={(e) => onChange({ ...block.content, url: e.target.value })}
          placeholder="https://..."
          className={INPUT_CLASSES}
        />
      </div>
      <CardDesignSection content={block.content} onChange={onChange} block={block} />
    </div>
  );
};

// Shared design controls for Card & Affiliate blocks
const CardDesignSection = ({ content, onChange, block }: { content: any; onChange: (c: any) => void; block: any }) => (
  <div className="space-y-4 pt-4 border-t border-gray-200 mt-4">
    <h5 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Card Design</h5>

    {/* Corner Radius */}
    <div>
      <label className={LABEL_CLASSES}>Corner Radius</label>
      <div className="grid grid-cols-3 gap-2">
        {(['sharp', 'rounded', 'pill'] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => onChange({ ...content, cornerRadius: opt })}
            className={`py-2 text-xs font-medium rounded-md border transition-all capitalize ${(content.cornerRadius || 'pill') === opt
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>

    {/* Shadow */}
    <div>
      <label className={LABEL_CLASSES}>Shadow</label>
      <div className="grid grid-cols-3 gap-2">
        {(['none', 'subtle', 'strong'] as const).map((opt) => (
          <button
            key={opt}
            onClick={() => onChange({ ...content, shadow: opt })}
            className={`py-2 text-xs font-medium rounded-md border transition-all capitalize ${(content.shadow || 'subtle') === opt
              ? 'border-blue-500 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>

    {/* Stroke / Border Color */}
    <div>
      <label className={LABEL_CLASSES}>Stroke (Border)</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={content.strokeColor || '#000000'}
          onChange={(e) => onChange({ ...content, strokeColor: e.target.value })}
          className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer"
        />
        <span className="text-xs text-gray-500 flex-1">{content.strokeColor || 'None'}</span>
        {content.strokeColor && (
          <button
            onClick={() => onChange({ ...content, strokeColor: '' })}
            className="text-xs text-red-500 font-medium hover:underline"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  </div>
);
