import React, { useState } from 'react';
import { PageBlock } from '../../../types/page';
import { MONETIZATION_PRESETS, MonetizationFormat, BusinessCategory, MonetizationPreset } from '../../../config/monetizationPresets';
import { Trash2, Image as ImageIcon, Plus, X, Mic, Wand2, Loader2, Edit3, Star, UploadCloud, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { pageService } from '../../../services/pageService';
import { generateAIField } from '../../../services/api';

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
    case 'COUNTDOWN': return <CountdownEditor block={block} onChange={onChange} />;
    case 'VOICE': return <VoiceEditor block={block} onChange={onChange} />;
    case 'WA_CATALOG': return <WaCatalogEditor block={block} onChange={onChange} />;
    case 'UPI_PAY': return <UpiPayEditor block={block} onChange={onChange} />;
    case 'DIGITAL_PRODUCT': return <DigitalProductEditor block={block} onChange={onChange} />;
    case 'REVIEW_CAROUSEL': return <ReviewCarouselEditor block={block} onChange={onChange} />;
    case 'STORY_HIGHLIGHT': return <StoryHighlightEditor block={block} onChange={onChange} />;
    case 'NATIVE_BOOKING': return <NativeBookingEditor block={block} onChange={onChange} />;
    case 'COMMUNITY_JOIN': return <CommunityJoinEditor block={block} onChange={onChange} />;
    case 'MAPS_HUB': return <MapsHubEditor block={block} onChange={onChange} />;
    case 'MONETIZATION': return <MonetizationEditor block={block} onChange={onChange} />;
    default: return <div className="text-gray-500 italic p-4">Editor not implemented for {block.type}</div>;
  }
};

// Shared input classes for consistency
const INPUT_CLASSES = "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-400 transition-all text-sm placeholder:text-gray-400";
const LABEL_CLASSES = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5";

const LinkEditor = ({ block, onChange }: BlockEditorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateTitle = async () => {
    setIsGenerating(true);
    try {
      // Use the URL as context if available
      const context = block.content.url ? `Link URL: ${block.content.url}` : 'A catchy link title';
      const prompt = `Generate a short catchy title for a link block. Context: ${context}`;

      const response = await generateAIField({
        category: 'CREATOR_LIFESTYLE', // Defaulting for simple wand
        prompt,
        fieldName: 'headline'
      });
      onChange({ ...block.content, title: response });
      toast.success('Link title generated!');
    } catch (error: any) {
      if (error.response?.status === 402 || error.response?.status === 403) {
        toast.error(error.response?.data || 'Check plan limits.');
      } else {
        toast.error('Failed to generate link title.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4 p-1">
      <div>
        <div className="flex justify-between items-center mb-1.5 bg-transparent">
          <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide">Title <span className="text-red-500">*</span></label>
          <button
            type="button"
            onClick={handleGenerateTitle}
            disabled={isGenerating}
            className="p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50"
            title="Generate Title with AI"
          >
            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
          </button>
        </div>
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
      <AdvancedBlockStyles content={block.content} onChange={onChange} />
    </div>
  );
};

// Advanced Styles Component for Individual Block Customization Overrides
const AdvancedBlockStyles = ({ content, onChange }: { content: any; onChange: (c: any) => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border hover:border-gray-300 border-gray-200 rounded-lg overflow-hidden transition-all bg-gray-50/50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 bg-white"
      >
        <span className="flex items-center gap-2">
          <Star className="w-4 h-4 text-gray-400" />
          Advanced Styles
        </span>
        <span className="text-xs text-gray-400 font-normal">
          {isOpen ? 'Hide' : 'Show'}
        </span>
      </button>

      {isOpen && (
        <div className="p-4 border-t border-gray-200 space-y-4">
          <p className="text-xs text-gray-500 mb-2">Override the global theme for this specific block to make it stand out.</p>

          {/* Background Color Override */}
          <div>
            <label className={LABEL_CLASSES}>Background Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={content.overrideBgColor || '#000000'}
                onChange={(e) => onChange({ ...content, overrideBgColor: e.target.value })}
                className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer"
              />
              <span className="text-xs text-gray-500 flex-1">{content.overrideBgColor ? content.overrideBgColor : 'None (Uses Theme)'}</span>
              {content.overrideBgColor && (
                <button
                  type="button"
                  onClick={() => onChange({ ...content, overrideBgColor: '' })}
                  className="text-xs text-red-500 font-medium hover:underline px-2"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Text Color Override */}
          <div>
            <label className={LABEL_CLASSES}>Text Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={content.overrideTextColor || '#ffffff'}
                onChange={(e) => onChange({ ...content, overrideTextColor: e.target.value })}
                className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer"
              />
              <span className="text-xs text-gray-500 flex-1">{content.overrideTextColor ? content.overrideTextColor : 'None (Uses Theme)'}</span>
              {content.overrideTextColor && (
                <button
                  type="button"
                  onClick={() => onChange({ ...content, overrideTextColor: '' })}
                  className="text-xs text-red-500 font-medium hover:underline px-2"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Animation Override */}
          <div>
            <label className={LABEL_CLASSES}>Animation Effect</label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {(['none', 'pulse', 'bounce', 'wiggle'] as const).map((anim) => (
                <button
                  key={anim}
                  type="button"
                  onClick={() => onChange({ ...content, animation: anim === 'none' ? '' : anim })}
                  className={`py-2 px-3 text-xs font-semibold rounded-md border capitalize transition-all ${(content.animation || 'none') === anim
                    ? 'border-black bg-gray-900 text-white'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                >
                  {anim}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

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
    <div>
      <label className={LABEL_CLASSES}>Spacing Below Heading</label>
      <div className="relative pt-2 pb-1">
        <div className="relative h-6 flex items-center">
          {/* Track Background */}
          <div className="absolute w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            {/* Filled Track */}
            <div
              className="h-full bg-black rounded-full transition-all"
              style={{ width: `${(block.content.spacing ?? 8) / 64 * 100}%` }}
            />
          </div>
          {/* Native Input */}
          <input
            type="range"
            min="0"
            max="64"
            step="2"
            value={block.content.spacing ?? 8}
            onChange={(e) => onChange({ ...block.content, spacing: parseInt(e.target.value) })}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          {/* Visual Thumb */}
          <div
            className="absolute h-4 w-4 bg-white border-2 border-black rounded-full shadow-md -translate-x-1/2 pointer-events-none transition-all"
            style={{ left: `${(block.content.spacing ?? 8) / 64 * 100}%` }}
          />
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-[10px] text-gray-400">0px</span>
          <span className="text-xs text-gray-700 font-semibold">{block.content.spacing ?? 8}px</span>
          <span className="text-[10px] text-gray-400">64px</span>
        </div>
      </div>
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

    <div className="flex gap-6">
      <div>
        <label className={LABEL_CLASSES}>Alignment</label>
        <div className="flex bg-gray-100 p-1 rounded-md w-max border border-gray-200">
          {['left', 'center', 'right', 'justify'].map((align) => (
            <button
              key={align}
              onClick={() => onChange({ ...block.content, align })}
              className={`px-3 py-1 text-xs font-semibold rounded-sm capitalize transition-all ${(block.content.align || 'center') === align
                ? 'bg-white shadow-sm text-gray-900 border border-gray-100'
                : 'text-gray-500 hover:text-gray-900'
                }`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className={LABEL_CLASSES}>Formatting</label>
        <div className="flex bg-gray-100 p-1 rounded-md w-max border border-gray-200 gap-1">
          <button
            onClick={() => onChange({ ...block.content, isBold: !block.content.isBold })}
            className={`w-8 h-7 flex items-center justify-center text-sm font-bold rounded-sm transition-all ${block.content.isBold
              ? 'bg-white shadow-sm text-gray-900 border border-gray-100'
              : 'text-gray-500 hover:text-gray-900'
              }`}
          >
            B
          </button>
          <button
            onClick={() => onChange({ ...block.content, isItalic: !block.content.isItalic })}
            className={`w-8 h-7 flex items-center justify-center text-sm italic rounded-sm transition-all ${block.content.isItalic
              ? 'bg-white shadow-sm text-gray-900 border border-gray-100'
              : 'text-gray-500 hover:text-gray-900'
              }`}
          >
            I
          </button>
          <button
            onClick={() => onChange({ ...block.content, isUnderline: !block.content.isUnderline })}
            className={`w-8 h-7 flex items-center justify-center text-sm underline underline-offset-2 rounded-sm transition-all ${block.content.isUnderline
              ? 'bg-white shadow-sm text-gray-900 border border-gray-100'
              : 'text-gray-500 hover:text-gray-900'
              }`}
          >
            U
          </button>
        </div>
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
  const links = block.content.links || [];

  const addLink = () => {
    onChange({
      ...block.content,
      links: [...links, { title: '', url: '' }]
    });
  };

  const updateLink = (index: number, key: 'title' | 'url', value: string) => {
    const newLinks = [...links];
    newLinks[index] = { ...newLinks[index], [key]: value };
    onChange({ ...block.content, links: newLinks });
  };

  const removeLink = (index: number) => {
    const newLinks = [...links];
    newLinks.splice(index, 1);
    onChange({ ...block.content, links: newLinks });
  };

  return (
    <div className="space-y-4 p-1">
      <div>
        <label className={LABEL_CLASSES}>List Title</label>
        <input
          type="text"
          value={block.content.mainTitle || ''}
          onChange={(e) => onChange({ ...block.content, mainTitle: e.target.value })}
          placeholder="e.g. My Favorite Gear"
          className={INPUT_CLASSES}
        />
        <p className="text-xs text-gray-500 mt-1">This title appears above your affiliate links container.</p>
      </div>

      <div className="mt-4">
        <label className={LABEL_CLASSES}>Affiliate Links</label>
        <div className="space-y-3 mt-2">
          {links.map((link: any, index: number) => (
            <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200 shadow-sm relative pr-10">
              <button
                onClick={() => removeLink(index)}
                className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-red-500 hover:bg-white rounded shadow-sm transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={link.title}
                    onChange={(e) => updateLink(index, 'title', e.target.value)}
                    placeholder="e.g. Sony Headphones"
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Affiliate URL</label>
                  <input
                    type="text"
                    value={link.url}
                    onChange={(e) => updateLink(index, 'url', e.target.value)}
                    placeholder="https://amazon.com/..."
                    className="w-full px-3 py-1.5 border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addLink}
            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Affiliate Link
          </button>
        </div>
      </div>

      <div className="pt-4 mt-6 border-t border-gray-100">
        <label className="text-sm font-medium text-gray-900 mb-2 block">Card Appearance</label>
        <CardDesignSection content={block.content} onChange={onChange} block={block} />
      </div>
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
              ? 'border-black bg-gray-900 text-white'
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
              ? 'border-black bg-gray-900 text-white'
              : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
              }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>

    {/* Background Color */}
    <div>
      <label className={LABEL_CLASSES}>Background Color</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={content.backgroundColor || '#ffffff'}
          onChange={(e) => onChange({ ...content, backgroundColor: e.target.value })}
          className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer"
        />
        <span className="text-xs text-gray-500 flex-1">{content.backgroundColor || '#ffffff (Default)'}</span>
        {content.backgroundColor && content.backgroundColor !== '#ffffff' && (
          <button
            onClick={() => onChange({ ...content, backgroundColor: '' })}
            className="text-xs text-red-500 font-medium hover:underline"
          >
            Reset
          </button>
        )}
      </div>
    </div>

    {/* Text Color */}
    <div>
      <label className={LABEL_CLASSES}>Text Color</label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={content.textColor || '#000000'}
          onChange={(e) => onChange({ ...content, textColor: e.target.value })}
          className="w-8 h-8 rounded-md border border-gray-300 cursor-pointer"
        />
        <span className="text-xs text-gray-500 flex-1">{content.textColor || '#000000 (Default)'}</span>
        {content.textColor && content.textColor !== '#000000' && (
          <button
            onClick={() => onChange({ ...content, textColor: '' })}
            className="text-xs text-red-500 font-medium hover:underline"
          >
            Reset
          </button>
        )}
      </div>
    </div>

    {/* Stroke / Border Color */}
    <div>
      <label className={LABEL_CLASSES}>Stroke (Border) Color</label>
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

    {/* Stroke Size */}
    {content.strokeColor && (
      <div>
        <label className={LABEL_CLASSES}>Stroke (Border) Size</label>
        <div className="relative pt-2 pb-1">
          <div className="relative h-6 flex items-center">
            {/* Track Background */}
            <div className="absolute w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              {/* Filled Track */}
              <div
                className="h-full bg-black rounded-full transition-all"
                style={{ width: `${((content.strokeSize || 2) - 1) / 7 * 100}%` }}
              />
            </div>
            {/* Native Input */}
            <input
              type="range"
              min="1"
              max="8"
              value={content.strokeSize || 2}
              onChange={(e) => onChange({ ...content, strokeSize: parseInt(e.target.value) })}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            {/* Visual Thumb */}
            <div
              className="absolute h-4 w-4 bg-white border-2 border-black rounded-full shadow-md -translate-x-1/2 pointer-events-none transition-all"
              style={{ left: `${((content.strokeSize || 2) - 1) / 7 * 100}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-[10px] text-gray-400">1px</span>
            <span className="text-xs text-gray-700 font-semibold">{content.strokeSize || 2}px</span>
            <span className="text-[10px] text-gray-400">8px</span>
          </div>
        </div>
      </div>
    )}
  </div>
);

export const CountdownEditor = ({ block, onChange }: { block: PageBlock; onChange: (content: any) => void }) => {
  const [localDateStr, setLocalDateStr] = useState('');

  // Convert the stored UTC milliseconds back to a local date string for the input
  React.useEffect(() => {
    if (block.content.endDateUTC) {
      const date = new Date(block.content.endDateUTC);
      const tzOffset = date.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(date.getTime() - tzOffset)).toISOString().slice(0, -1);
      setLocalDateStr(localISOTime.substring(0, 16));
    }
  }, [block.content.endDateUTC]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalDateStr(val);
    if (val) {
      const utcMillis = new Date(val).getTime();
      onChange({ ...block.content, endDateUTC: utcMillis });
    } else {
      onChange({ ...block.content, endDateUTC: 0 });
    }
  };

  const formattedLocalTime = block.content.endDateUTC
    ? new Date(block.content.endDateUTC).toLocaleString(undefined, {
      weekday: 'long', year: 'numeric', month: 'short',
      day: 'numeric', hour: '2-digit', minute: '2-digit', timeZoneName: 'short'
    })
    : '';

  const isPast = block.content.endDateUTC && block.content.endDateUTC < Date.now();

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title Text</label>
        <input
          type="text"
          value={block.content.title || ''}
          onChange={e => onChange({ ...block.content, title: e.target.value })}
          placeholder="Limited Time Offer!"
          className={INPUT_CLASSES}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
        <textarea
          value={block.content.description || ''}
          onChange={e => onChange({ ...block.content, description: e.target.value })}
          placeholder="Grab this deal before it expires."
          rows={2}
          className={`${INPUT_CLASSES} resize-none`}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
        {block.content.endDateUTC ? (
          <p className="text-xs text-blue-600 mb-2 font-medium bg-blue-50 p-2 rounded border border-blue-100">
            Countdown ends: {formattedLocalTime}
          </p>
        ) : null}
        {isPast ? (
          <p className="text-xs text-red-600 mb-2 font-medium bg-red-50 p-2 rounded border border-red-100">
            Warning: The selected date is in the past. The countdown will immediately show the end message.
          </p>
        ) : null}
        <input
          type="datetime-local"
          value={localDateStr}
          onChange={handleDateChange}
          className={INPUT_CLASSES}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Theme Style</label>
        <div className="grid grid-cols-2 gap-2">
          {(['standard', 'minimal'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => onChange({ ...block.content, themeStyle: opt })}
              className={`py-2 text-xs font-medium rounded-md border transition-all capitalize ${(block.content.themeStyle || 'standard') === opt
                ? 'border-black bg-gray-900 text-white'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">End Message</label>
        <input
          type="text"
          value={block.content.endMessage || ''}
          onChange={e => onChange({ ...block.content, endMessage: e.target.value })}
          placeholder="Offer Ended"
          className={INPUT_CLASSES}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Card Image</label>
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
            <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const toastId = toast.loading('Uploading image...');
              try {
                const url = await pageService.uploadAsset(file);
                onChange({ ...block.content, imageUrl: url });
                toast.success('Image uploaded', { id: toastId });
              } catch {
                toast.error('Upload failed', { id: toastId });
              }
            }} />
          </label>
        )}
      </div>
      <CardDesignSection content={block.content} onChange={onChange} block={block} />
      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
        <input
          type="checkbox"
          id={`hide-${block.id}`}
          checked={block.content.hideAfterExpiry || false}
          onChange={e => onChange({ ...block.content, hideAfterExpiry: e.target.checked })}
          className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <label htmlFor={`hide-${block.id}`} className="text-sm text-gray-700 cursor-pointer">
          Hide block completely after expiry
        </label>
      </div>
    </div>
  );
};

export const VoiceEditor = ({ block, onChange }: { block: PageBlock; onChange: (content: any) => void }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validateDuration = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.addEventListener('loadedmetadata', () => {
        URL.revokeObjectURL(audio.src); // cleanup
        resolve(audio.duration <= 30);
      });
      audio.addEventListener('error', () => {
        URL.revokeObjectURL(audio.src);
        resolve(false); // treat unreadable files as invalid
      });
      audio.src = URL.createObjectURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setIsUploading(true);

    try {
      if (!file.type.startsWith('audio/')) {
        setErrorMsg('Please upload a valid audio file.');
        setIsUploading(false);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Audio file exceeds the 5MB size limit.');
        setIsUploading(false);
        return;
      }

      const isValidDuration = await validateDuration(file);
      if (!isValidDuration) {
        setErrorMsg('Audio must be 30 seconds or less.');
        setIsUploading(false);
        return;
      }

      const url = await pageService.uploadAsset(file);
      onChange({ ...block.content, audioUrl: url });
    } catch (error) {
      console.error('Audio upload failed:', error);
      setErrorMsg('Failed to upload audio file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = () => {
    onChange({ ...block.content, audioUrl: '' });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title Text</label>
        <input
          type="text"
          value={block.content.title || ''}
          onChange={e => onChange({ ...block.content, title: e.target.value })}
          placeholder="Listen to my message"
          className={INPUT_CLASSES}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Audio Track (Max 30s)</label>

        {block.content.audioUrl ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <audio controls src={block.content.audioUrl} className="w-full mb-3" />
            <button
              onClick={handleDelete}
              className="mt-2 text-sm text-red-600 hover:text-red-700 flex items-center gap-1 font-medium bg-red-50 px-3 py-1.5 rounded"
            >
              <Trash2 className="w-4 h-4" /> Delete / Replace Audio
            </button>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors">
            {isUploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                <p className="text-sm text-gray-600">Uploading audio...</p>
              </div>
            ) : (
              <div>
                <Mic className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-4">Upload an audio file (.mp3, .wav, .m4a)</p>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id={`audio-upload-${block.id}`}
                />
                <label
                  htmlFor={`audio-upload-${block.id}`}
                  className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
                >
                  Select File
                </label>
              </div>
            )}
          </div>
        )}

        {errorMsg && (
          <p className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">{errorMsg}</p>
        )}
      </div>
    </div>
  );
};

// --- NEW STRATEGIC BLOCK PLACEHOLDERS ---

const WaCatalogEditor = ({ block, onChange }: BlockEditorProps) => {
  const [isUploadingIdx, setIsUploadingIdx] = useState<number | null>(null);

  const handleAddItem = () => {
    const currentItems = block.content.items || [];
    onChange({
      ...block.content,
      items: [
        ...currentItems,
        { id: crypto.randomUUID(), name: 'New Item', price: '0', inStock: true }
      ]
    });
  };

  const handleUpdateItem = (index: number, updates: any) => {
    const currentItems = [...(block.content.items || [])];
    currentItems[index] = { ...currentItems[index], ...updates };
    onChange({ ...block.content, items: currentItems });
  };

  const handleDeleteItem = (index: number) => {
    const currentItems = [...(block.content.items || [])];
    currentItems.splice(index, 1);
    onChange({ ...block.content, items: currentItems });
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploadingIdx(index);
    const toastId = toast.loading('Uploading product image...');
    try {
      const response = await pageService.uploadAsset(file);
      if (response && response.url) {
        handleUpdateItem(index, { imageUrl: response.url });
        toast.success('Image uploaded!', { id: toastId });
      } else {
        toast.error('Failed to parse upload URL', { id: toastId });
      }
    } catch (error) {
      toast.error('Upload failed. Current plan limit?', { id: toastId });
    } finally {
      setIsUploadingIdx(null);
    }
  };

  return (
    <div className="space-y-5 p-1">
      <div>
        <label className={LABEL_CLASSES}>Order WhatsApp Number <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={block.content.phoneNumber || ''}
          onChange={(e) => onChange({ ...block.content, phoneNumber: e.target.value })}
          placeholder="e.g. 919876543210"
          className={INPUT_CLASSES}
        />
        <p className="text-[10px] text-gray-400 mt-1">Include country code without + symbol.</p>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className={LABEL_CLASSES}>Products Catalog</label>
          <button
            onClick={handleAddItem}
            className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add Item
          </button>
        </div>

        <div className="space-y-3">
          {(block.content.items || []).map((item: any, index: number) => (
            <div key={item.id || index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg relative group">
              <button
                onClick={() => handleDeleteItem(index)}
                className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                title="Remove Item"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="flex gap-3 mb-3 pr-6">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={item.name || ''}
                    onChange={(e) => handleUpdateItem(index, { name: e.target.value })}
                    placeholder="Product Name"
                    className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-sm font-medium">₹</span>
                    <input
                      type="number"
                      value={item.price || ''}
                      onChange={(e) => handleUpdateItem(index, { price: e.target.value })}
                      placeholder="Price"
                      className="w-24 px-2 py-1 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="w-16 shrink-0 flex flex-col items-center">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id={`wa-item-img-${block.id}-${index}`}
                    onChange={(e) => handleImageUpload(index, e)}
                    disabled={isUploadingIdx === index}
                  />
                  <label
                    htmlFor={`wa-item-img-${block.id}-${index}`}
                    className={`w-14 h-14 rounded border ${item.imageUrl ? 'border-gray-200' : 'border-dashed border-gray-300'} bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden group/img relative`}
                  >
                    {isUploadingIdx === index ? (
                      <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                    ) : item.imageUrl ? (
                      <>
                        <img src={typeof item.imageUrl === 'object' ? item.imageUrl.url : item.imageUrl} alt="preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 hidden group-hover/img:flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-white" />
                        </div>
                      </>
                    ) : (
                      <ImageIcon className="w-5 h-5 text-gray-300" />
                    )}
                  </label>
                  <span className="text-[9px] text-gray-400 mt-1 text-center leading-tight">Image<br />(Opt)</span>
                </div>
              </div>

              {/* Stock Toggle */}
              <div className="flex items-center justify-between bg-white px-2 py-1.5 rounded border border-gray-100">
                <span className="text-xs font-semibold text-gray-600">In Stock</span>
                <button
                  type="button"
                  onClick={() => handleUpdateItem(index, { inStock: !item.inStock })}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${item.inStock !== false ? 'bg-green-500' : 'bg-gray-200'}`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${item.inStock !== false ? 'translate-x-4' : 'translate-x-0'}`}
                  />
                </button>
              </div>
            </div>
          ))}

          {(!block.content.items || block.content.items.length === 0) && (
            <div className="text-center py-6 border border-dashed border-gray-300 rounded-lg text-gray-400 text-sm">
              No products added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UpiPayEditor = ({ block, onChange }: BlockEditorProps) => (
  <div className="space-y-4 p-1">
    <div>
      <label className={LABEL_CLASSES}>Virtual Payment Address (UPI ID) <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={block.content.upiId || ''}
        onChange={(e) => onChange({ ...block.content, upiId: e.target.value })}
        placeholder="e.g. yourname@okhdfcbank"
        className={INPUT_CLASSES}
      />
    </div>

    <div>
      <label className={LABEL_CLASSES}>Payee Name (Business/Creator Name) <span className="text-red-500">*</span></label>
      <input
        type="text"
        value={block.content.payeeName || ''}
        onChange={(e) => onChange({ ...block.content, payeeName: e.target.value })}
        placeholder="e.g. TinySlash Store"
        className={INPUT_CLASSES}
      />
    </div>

    <div>
      <label className={LABEL_CLASSES}>Amount Mode</label>
      <div className="flex bg-gray-100 p-1 rounded-md w-max border border-gray-200 mb-3">
        <button
          onClick={() => onChange({ ...block.content, amountMode: 'OPEN' })}
          className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all ${(block.content.amountMode || 'OPEN') === 'OPEN'
            ? 'bg-white shadow-sm text-gray-900 border border-gray-100'
            : 'text-gray-500 hover:text-gray-900'
            }`}
        >
          Open Amount (Tips/Donations)
        </button>
        <button
          onClick={() => onChange({ ...block.content, amountMode: 'FIXED' })}
          className={`px-3 py-1.5 text-xs font-semibold rounded-sm transition-all ${block.content.amountMode === 'FIXED'
            ? 'bg-white shadow-sm text-gray-900 border border-gray-100'
            : 'text-gray-500 hover:text-gray-900'
            }`}
        >
          Fixed Amount (Products/Services)
        </button>
      </div>

      {block.content.amountMode === 'FIXED' && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-200">
          <label className={LABEL_CLASSES}>Fixed Amount (₹) <span className="text-red-500">*</span></label>
          <input
            type="number"
            value={block.content.fixedAmount || ''}
            onChange={(e) => onChange({ ...block.content, fixedAmount: e.target.value })}
            placeholder="e.g. 500"
            className={INPUT_CLASSES}
          />
        </div>
      )}
    </div>

    <div>
      <label className={LABEL_CLASSES}>Button Text</label>
      <input
        type="text"
        value={block.content.buttonText || ''}
        onChange={(e) => onChange({ ...block.content, buttonText: e.target.value })}
        placeholder="e.g. Pay Now via UPI"
        className={INPUT_CLASSES}
      />
    </div>
  </div>
);

const DigitalProductEditor = ({ block, onChange }: BlockEditorProps) => {
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'file') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'cover' && file.size > 5 * 1024 * 1024) {
      toast.error('Cover image must be less than 5MB');
      return;
    }
    if (type === 'file' && file.size > 50 * 1024 * 1024) {
      toast.error('Digital file must be less than 50MB');
      return;
    }

    const isCover = type === 'cover';
    const setUploading = isCover ? setIsUploadingCover : setIsUploadingFile;

    setUploading(true);
    const toastId = toast.loading(`Uploading ${isCover ? 'cover image' : 'digital file'}...`);
    try {
      const url = await pageService.uploadAsset(file);
      onChange({ ...block.content, [isCover ? 'coverImageUrl' : 'fileUrl']: url });
      toast.success('Upload complete!', { id: toastId });
    } catch (error) {
      toast.error('Upload failed. Current plan limit?', { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-1">
      <div>
        <label className={LABEL_CLASSES}>Product Title</label>
        <input
          type="text"
          value={block.content.title || ''}
          onChange={(e) => onChange({ ...block.content, title: e.target.value })}
          placeholder="e.g. 10 Lightroom Presets"
          className={INPUT_CLASSES}
        />
      </div>

      <div>
        <label className={LABEL_CLASSES}>Description</label>
        <textarea
          value={block.content.description || ''}
          onChange={(e) => onChange({ ...block.content, description: e.target.value })}
          placeholder="Brief description of your digital product..."
          className={`${INPUT_CLASSES} h-20 resize-none`}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL_CLASSES}>Price (in ₹)</label>
          <input
            type="text"
            value={block.content.price || ''}
            onChange={(e) => onChange({ ...block.content, price: e.target.value })}
            placeholder="e.g. 499"
            className={INPUT_CLASSES}
          />
        </div>
        <div>
          <label className={LABEL_CLASSES}>Button Text</label>
          <input
            type="text"
            value={block.content.buttonText || ''}
            onChange={(e) => onChange({ ...block.content, buttonText: e.target.value })}
            placeholder="e.g. Buy Now"
            className={INPUT_CLASSES}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Cover Image Upload */}
        <div className="border border-dashed border-gray-300 rounded-lg p-3 text-center flex flex-col items-center justify-center relative bg-gray-50 h-32 group cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={(e) => handleUpload(e, 'cover')}
            disabled={isUploadingCover}
          />
          {isUploadingCover ? (
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
          ) : block.content.coverImageUrl ? (
            <div className="absolute inset-0 w-full h-full p-2">
              <img src={block.content.coverImageUrl} alt="Cover" className="w-full h-full object-cover rounded-md shadow-sm" />
              <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center rounded-md m-2">
                <ImageIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center z-0 relative pointer-events-none">
              <ImageIcon className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-xs text-gray-600 font-medium">Cover Image</p>
              <p className="text-[10px] text-gray-400 mt-1">16:9 recommended</p>
            </div>
          )}
        </div>

        {/* Digital File Upload */}
        <div className="border border-dashed border-gray-300 rounded-lg p-3 text-center flex flex-col items-center justify-center relative bg-gray-50 h-32 group cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={(e) => handleUpload(e, 'file')}
            disabled={isUploadingFile}
          />
          {isUploadingFile ? (
            <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
          ) : block.content.fileUrl ? (
            <div className="flex flex-col items-center justify-center z-0 relative">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xs text-green-700 font-medium">File Uploaded!</p>
              <p className="text-[10px] text-gray-500 mt-1 truncate max-w-[100px] hover:underline underline-offset-2">Change File</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center z-0 relative pointer-events-none">
              <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
              <p className="text-xs text-gray-600 font-medium">Digital File</p>
              <p className="text-[10px] text-gray-400 mt-1">PDF, ZIP, MP4...</p>
            </div>
          )}
        </div>
      </div>

      {block.content.fileUrl && (
        <div className="bg-blue-50 border border-blue-100 rounded p-3 mt-4">
          <p className="text-xs text-blue-800 font-medium">🔒 Secure delivery enabled</p>
          <p className="text-[10px] text-blue-600 mt-1">Buyers will receive a direct link to this file after successful payment via Stripe.</p>
        </div>
      )}
    </div>
  );
};

const ReviewCarouselEditor = ({ block, onChange }: BlockEditorProps) => {
  const [isUploadingIdx, setIsUploadingIdx] = useState<number | null>(null);

  const handleAddReview = () => {
    const currentReviews = block.content.reviews || [];
    onChange({
      ...block.content,
      reviews: [
        ...currentReviews,
        {
          id: crypto.randomUUID(),
          authorName: 'Happy Customer',
          rating: 5,
          text: 'Great experience!',
          platformIcon: 'custom'
        }
      ]
    });
  };

  const handleUpdateReview = (index: number, updates: any) => {
    const currentReviews = [...(block.content.reviews || [])];
    currentReviews[index] = { ...currentReviews[index], ...updates };
    onChange({ ...block.content, reviews: currentReviews });
  };

  const handleDeleteReview = (index: number) => {
    const currentReviews = [...(block.content.reviews || [])];
    currentReviews.splice(index, 1);
    onChange({ ...block.content, reviews: currentReviews });
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploadingIdx(index);
    const toastId = toast.loading('Uploading avatar/screenshot...');
    try {
      const url = await pageService.uploadAsset(file);
      handleUpdateReview(index, { avatarUrl: url });
      toast.success('Image uploaded!', { id: toastId });
    } catch (error) {
      toast.error('Upload failed. Current plan limit?', { id: toastId });
    } finally {
      setIsUploadingIdx(null);
    }
  };

  return (
    <div className="space-y-4 p-1">
      <div className="flex justify-between items-center mb-2">
        <label className={LABEL_CLASSES}>Testimonials Collection</label>
        <button
          onClick={handleAddReview}
          className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Add Review
        </button>
      </div>

      <div className="space-y-4">
        {(block.content.reviews || []).map((review: any, index: number) => (
          <div key={review.id || index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg relative group">
            <button
              onClick={() => handleDeleteReview(index)}
              className="absolute top-2 right-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
              title="Remove Review"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Image Upload Area */}
              <div className="w-16 shrink-0 flex flex-col items-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id={`review-img-${block.id}-${index}`}
                  onChange={(e) => handleImageUpload(index, e)}
                  disabled={isUploadingIdx === index}
                />
                <label
                  htmlFor={`review-img-${block.id}-${index}`}
                  className={`w-16 h-16 rounded border ${review.avatarUrl ? 'border-gray-200' : 'border-dashed border-gray-300'} bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden group/img relative`}
                >
                  {isUploadingIdx === index ? (
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                  ) : review.avatarUrl ? (
                    <>
                      <img src={review.avatarUrl} alt="preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 hidden group-hover/img:flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-white" />
                      </div>
                    </>
                  ) : (
                    <ImageIcon className="w-5 h-5 text-gray-300" />
                  )}
                </label>
                <span className="text-[9px] text-gray-400 mt-1 text-center leading-tight">Avatar or<br />Screenshot</span>
              </div>

              {/* Review Details Area */}
              <div className="flex-1 space-y-3 pr-6">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={review.authorName || ''}
                    onChange={(e) => handleUpdateReview(index, { authorName: e.target.value })}
                    placeholder="Reviewer Name"
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                  />
                  <input
                    type="text"
                    value={review.authorRole || ''}
                    onChange={(e) => handleUpdateReview(index, { authorRole: e.target.value })}
                    placeholder="Role (e.g. Verified Buyer)"
                    className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex bg-white border border-gray-200 rounded p-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleUpdateReview(index, { rating: star })}
                        className={`p-0.5 ${star <= (review.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}`}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    ))}
                  </div>

                  <select
                    value={review.platformIcon || 'custom'}
                    onChange={(e) => handleUpdateReview(index, { platformIcon: e.target.value })}
                    className="px-2 py-1 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="custom">No Icon</option>
                    <option value="google">Google</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="instagram">Instagram</option>
                  </select>
                </div>

                <textarea
                  value={review.text || ''}
                  onChange={(e) => handleUpdateReview(index, { text: e.target.value })}
                  placeholder="Review text content... (Leave empty if using a screenshot image above)"
                  className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none h-16"
                />
              </div>
            </div>
          </div>
        ))}

        {(!block.content.reviews || block.content.reviews.length === 0) && (
          <div className="text-center py-6 border border-dashed border-gray-300 rounded-lg text-gray-400 text-sm bg-gray-50">
            No testimonials added yet. Build trust by adding your best reviews.
          </div>
        )}
      </div>
    </div>
  );
};

const StoryHighlightEditor = ({ block, onChange }: BlockEditorProps) => {
  const [isUploadingIdx, setIsUploadingIdx] = useState<number | null>(null);

  const handleAddStory = () => {
    const currentStories = block.content.stories || [];
    onChange({
      ...block.content,
      stories: [
        ...currentStories,
        { id: crypto.randomUUID(), title: 'New Story', sourceUrl: '' }
      ]
    });
  };

  const handleUpdateStory = (index: number, updates: any) => {
    const currentStories = [...(block.content.stories || [])];
    currentStories[index] = { ...currentStories[index], ...updates };
    onChange({ ...block.content, stories: currentStories });
  };

  const handleDeleteStory = (index: number) => {
    const currentStories = [...(block.content.stories || [])];
    currentStories.splice(index, 1);
    onChange({ ...block.content, stories: currentStories });
  };

  const handleImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsUploadingIdx(index);
    const toastId = toast.loading('Uploading story cover...');
    try {
      const url = await pageService.uploadAsset(file);
      handleUpdateStory(index, { coverImageUrl: url });
      toast.success('Cover uploaded!', { id: toastId });
    } catch (error) {
      toast.error('Upload failed. Current plan limit?', { id: toastId });
    } finally {
      setIsUploadingIdx(null);
    }
  };

  return (
    <div className="space-y-4 p-1">
      <div className="flex justify-between items-center mb-2">
        <label className={LABEL_CLASSES}>Stories List</label>
        <button
          onClick={handleAddStory}
          className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Add Story Highlights
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {(block.content.stories || []).map((story: any, index: number) => (
          <div key={story.id || index} className="p-3 bg-gray-50 border border-gray-200 rounded-lg relative group flex gap-3">
            <button
              onClick={() => handleDeleteStory(index)}
              className="absolute -top-2 -right-2 p-1.5 text-white bg-gray-900 rounded-full transition-colors opacity-0 group-hover:opacity-100 shadow-md z-10 hover:bg-red-500"
              title="Remove Story"
            >
              <X className="w-3 h-3" />
            </button>

            <div className="w-14 shrink-0 flex flex-col items-center">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id={`story-img-${block.id}-${index}`}
                onChange={(e) => handleImageUpload(index, e)}
                disabled={isUploadingIdx === index}
              />
              <label
                htmlFor={`story-img-${block.id}-${index}`}
                className={`w-14 h-14 rounded-full border-2 ${story.coverImageUrl ? 'border-gray-200 p-0.5' : 'border-dashed border-gray-300'} bg-white flex items-center justify-center cursor-pointer hover:bg-gray-50 overflow-hidden group/img relative`}
              >
                {isUploadingIdx === index ? (
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                ) : story.coverImageUrl ? (
                  <>
                    <img src={story.coverImageUrl} alt="preview" className="w-full h-full object-cover rounded-full" />
                    <div className="absolute inset-0 bg-black/40 hidden group-hover/img:flex items-center justify-center rounded-full">
                      <Edit3 className="w-3 h-3 text-white" />
                    </div>
                  </>
                ) : (
                  <Plus className="w-4 h-4 text-gray-300" />
                )}
              </label>
              <span className="text-[9px] text-gray-400 mt-1 text-center leading-tight">Cover</span>
            </div>

            <div className="flex-1 space-y-2 min-w-0 flex flex-col justify-center">
              <input
                type="text"
                value={story.title || ''}
                onChange={(e) => handleUpdateStory(index, { title: e.target.value })}
                placeholder="Story Title"
                className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-semibold"
                maxLength={15}
              />
              <input
                type="url"
                value={story.sourceUrl || ''}
                onChange={(e) => handleUpdateStory(index, { sourceUrl: e.target.value })}
                placeholder="https://instagram.com/reel/..."
                className="w-full px-2 py-1 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-blue-600 placeholder:text-gray-400"
              />
            </div>
          </div>
        ))}
      </div>

      {(!block.content.stories || block.content.stories.length === 0) && (
        <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg text-gray-400 text-sm bg-gray-50">
          <ImageIcon className="w-8 h-8 mx-auto text-gray-300 mb-2" />
          <p>Highlight your latest posts, reels, or moments.</p>
        </div>
      )}
    </div>
  );
};

const NativeBookingEditor = ({ block, onChange }: BlockEditorProps) => {
  return (
    <div className="space-y-4 p-1">
      <div>
        <label className={LABEL_CLASSES}>Booking Provider</label>
        <select
          value={block.content.provider || 'CALENDLY'}
          onChange={(e) => onChange({ ...block.content, provider: e.target.value })}
          className={INPUT_CLASSES}
        >
          <option value="CALENDLY">Calendly</option>
          <option value="CAL_COM">Cal.com</option>
          <option value="TIDYCAL">Tidycal</option>
          <option value="CUSTOM_IFRAME">Custom Embed (Advanced)</option>
        </select>
        <p className="text-[10px] text-gray-500 mt-1">Select the platform hosting your calendar.</p>
      </div>

      <div>
        <label className={LABEL_CLASSES}>Public Booking Link <span className="text-red-500">*</span></label>
        <input
          type="url"
          value={block.content.bookingUrl || ''}
          onChange={(e) => onChange({ ...block.content, bookingUrl: e.target.value })}
          placeholder="e.g. https://calendly.com/your-name/30min"
          className={INPUT_CLASSES}
        />
        <p className="text-[10px] text-gray-500 mt-1">Paste the full public link to your scheduling page.</p>
      </div>

      <div>
        <label className={LABEL_CLASSES}>Block Title (Optional)</label>
        <input
          type="text"
          value={block.content.title || ''}
          onChange={(e) => onChange({ ...block.content, title: e.target.value })}
          placeholder="e.g. Book a 1:1 Consultation"
          className={INPUT_CLASSES}
        />
      </div>

      {block.content.provider === 'CALENDLY' && (
        <div className="bg-blue-50 border border-blue-100 rounded p-3 mt-4">
          <p className="text-xs text-blue-800 font-medium">✨ Calendly Native Integration Active</p>
          <p className="text-[10px] text-blue-600 mt-1">Your calendar will be embedded seamlessly without breaking the page design.</p>
        </div>
      )}
    </div>
  );
};

const CommunityJoinEditor = ({ block, onChange }: BlockEditorProps) => {
  return (
    <div className="space-y-4 p-1">
      <div>
        <label className={LABEL_CLASSES}>Platform</label>
        <select
          value={block.content.platform || 'TELEGRAM'}
          onChange={(e) => onChange({ ...block.content, platform: e.target.value })}
          className={INPUT_CLASSES}
        >
          <option value="TELEGRAM">Telegram</option>
          <option value="DISCORD">Discord</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="SLACK">Slack</option>
        </select>
      </div>

      <div>
        <label className={LABEL_CLASSES}>Invite URL <span className="text-red-500">*</span></label>
        <input
          type="url"
          value={block.content.inviteUrl || ''}
          onChange={(e) => onChange({ ...block.content, inviteUrl: e.target.value })}
          placeholder="e.g. https://t.me/joinchat/..."
          className={INPUT_CLASSES}
        />
      </div>

      <div>
        <label className={LABEL_CLASSES}>Community Name <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={block.content.communityName || ''}
          onChange={(e) => onChange({ ...block.content, communityName: e.target.value })}
          placeholder="e.g. VIP Trading Alpha"
          className={INPUT_CLASSES}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL_CLASSES}>Member Count</label>
          <input
            type="text"
            value={block.content.memberCount || ''}
            onChange={(e) => onChange({ ...block.content, memberCount: e.target.value })}
            placeholder="e.g. 12.5k+"
            className={INPUT_CLASSES}
          />
        </div>
        <div>
          <label className={LABEL_CLASSES}>Button Text</label>
          <input
            type="text"
            value={block.content.buttonText || ''}
            onChange={(e) => onChange({ ...block.content, buttonText: e.target.value })}
            placeholder="e.g. Join the club"
            className={INPUT_CLASSES}
          />
        </div>
      </div>

      <div>
        <label className={LABEL_CLASSES}>Pitch / Description</label>
        <input
          type="text"
          value={block.content.pitch || ''}
          onChange={(e) => onChange({ ...block.content, pitch: e.target.value })}
          placeholder="e.g. Get daily alerts and signals directly."
          className={INPUT_CLASSES}
        />
      </div>
    </div>
  );
};

const MapsHubEditor = ({ block, onChange }: BlockEditorProps) => {
  const handleAddLink = () => {
    const currentLinks = block.content.deliveryLinks || [];
    onChange({
      ...block.content,
      deliveryLinks: [
        ...currentLinks,
        { id: crypto.randomUUID(), platform: 'SWIGGY', url: '' }
      ]
    });
  };

  const handleUpdateLink = (index: number, updates: any) => {
    const currentLinks = [...(block.content.deliveryLinks || [])];
    currentLinks[index] = { ...currentLinks[index], ...updates };
    onChange({ ...block.content, deliveryLinks: currentLinks });
  };

  const handleDeleteLink = (index: number) => {
    const currentLinks = [...(block.content.deliveryLinks || [])];
    currentLinks.splice(index, 1);
    onChange({ ...block.content, deliveryLinks: currentLinks });
  };

  return (
    <div className="space-y-4 p-1">
      <div>
        <label className={LABEL_CLASSES}>Google Maps Embed URL <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={block.content.googleMapsUrl || ''}
          onChange={(e) => {
            const val = e.target.value;
            let url = val.trim();
            // Handle full iframe tags
            if (url.toLowerCase().includes('<iframe')) {
              const srcMatch = url.match(/src=["'](.*?)["']/i);
              if (srcMatch && srcMatch[1]) {
                url = srcMatch[1];
              }
            }
            // Clean up any stray HTML entities from copy-pasting
            url = url.replace(/&amp;/g, '&');
            onChange({ ...block.content, googleMapsUrl: url });
          }}
          placeholder='e.g. https://www.google.com/maps/embed?pb=...'
          className={INPUT_CLASSES}
        />
        <p className="text-[10px] text-gray-500 mt-1">Paste the "Embed a map" HTML src URL from Google Maps.</p>
      </div>

      <div>
        <label className={LABEL_CLASSES}>Business Hours (Optional)</label>
        <input
          type="text"
          value={block.content.businessHours || ''}
          onChange={(e) => onChange({ ...block.content, businessHours: e.target.value })}
          placeholder="e.g. Open today: 9am - 10pm"
          className={INPUT_CLASSES}
        />
      </div>

      <div className="pt-2 border-t border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <label className={LABEL_CLASSES}>Delivery / Action Links</label>
          <button
            onClick={handleAddLink}
            className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 flex items-center gap-1"
          >
            <Plus className="w-3 h-3" /> Add Link
          </button>
        </div>

        <div className="space-y-3">
          {(block.content.deliveryLinks || []).map((link: any, index: number) => (
            <div key={link.id || index} className="flex gap-2 items-start bg-gray-50 p-2 rounded border border-gray-200">
              <select
                value={link.platform || 'SWIGGY'}
                onChange={(e) => handleUpdateLink(index, { platform: e.target.value })}
                className="w-1/3 px-2 py-1.5 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="SWIGGY">Swiggy</option>
                <option value="ZOMATO">Zomato</option>
                <option value="UBEREATS">UberEats</option>
                <option value="CUSTOM">Custom Link</option>
              </select>
              <div className="flex-1 flex gap-1">
                <input
                  type="url"
                  value={link.url || ''}
                  onChange={(e) => handleUpdateLink(index, { url: e.target.value })}
                  placeholder="https://"
                  className="w-full px-2 py-1.5 bg-white border border-gray-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={() => handleDeleteLink(index)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {(!block.content.deliveryLinks || block.content.deliveryLinks.length === 0) && (
            <p className="text-xs text-gray-400 text-center py-2">No delivery links added.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const MonetizationEditor = ({ block, onChange }: BlockEditorProps) => {
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  // UX Wizard State
  // If the block has a title, we assume it's already configured and skip the wizard to Step 4.
  const [step, setStep] = useState<number>(block.content.title ? 4 : 1);
  const [selectedFormat, setSelectedFormat] = useState<MonetizationFormat | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error('Digital file must be less than 50MB');
      return;
    }

    setIsUploadingFile(true);
    const toastId = toast.loading('Uploading digital file...');
    try {
      const url = await pageService.uploadAsset(file);
      onChange({ ...block.content, fileKey: url });
      toast.success('Upload complete!', { id: toastId });
    } catch (error) {
      toast.error('Upload failed. Current plan limit?', { id: toastId });
    } finally {
      setIsUploadingFile(false);
    }
  };

  const handleSelectPreset = (preset: MonetizationPreset) => {
    onChange({
      ...block.content,
      title: preset.title,
      description: preset.description,
      price: preset.suggestedPrice || '',
      monetizationType: preset.monetizationType,
    });
    setStep(4);
  };

  // --- WIZARD RENDERERS ---

  if (step === 1) {
    return (
      <div className="p-2 animate-in fade-in duration-300">
        <h3 className="font-bold text-gray-900 text-sm mb-1">What are you offering?</h3>
        <p className="text-xs text-gray-500 mb-4 tracking-tight">Select a format to see personalized templates.</p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => { setSelectedFormat('LIVE'); setStep(2); }}
            className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all text-center group"
          >
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">📞</div>
            <span className="font-bold text-sm text-gray-900">Live Session</span>
            <span className="text-[10px] text-gray-500 mt-1">1:1 video or audio</span>
          </button>

          <button
            onClick={() => { setSelectedFormat('ASYNC'); setStep(2); }}
            className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl hover:border-purple-500 hover:shadow-md transition-all text-center group"
          >
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">📨</div>
            <span className="font-bold text-sm text-gray-900">Async Service</span>
            <span className="text-[10px] text-gray-500 mt-1">Audit, roast, feedback</span>
          </button>

          <button
            onClick={() => { setSelectedFormat('DIGITAL'); setStep(3); }}
            className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all text-center group"
          >
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">📦</div>
            <span className="font-bold text-sm text-gray-900">Digital Product</span>
            <span className="text-[10px] text-gray-500 mt-1">File, template, guide</span>
          </button>

          <button
            onClick={() => { setSelectedFormat('DONATION'); setStep(3); }}
            className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-xl hover:border-orange-500 hover:shadow-md transition-all text-center group"
          >
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">💰</div>
            <span className="font-bold text-sm text-gray-900">Tip / Donation</span>
            <span className="text-[10px] text-gray-500 mt-1">Support your work</span>
          </button>
        </div>
      </div>
    );
  }

  if (step === 2 && selectedFormat && (selectedFormat === 'LIVE' || selectedFormat === 'ASYNC')) {
    const categories = Object.keys(MONETIZATION_PRESETS[selectedFormat]) as BusinessCategory[];
    return (
      <div className="p-2 animate-in slide-in-from-right-4 duration-300">
        <button onClick={() => setStep(1)} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-900 mb-3 flex items-center gap-1">
          ← Back
        </button>
        <h3 className="font-bold text-gray-900 text-sm mb-1">Who are you?</h3>
        <p className="text-xs text-gray-500 mb-4 tracking-tight">We'll filter the {selectedFormat.toLowerCase()} presets for your industry.</p>

        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setStep(3); }}
              className="px-3 py-2 bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-100 transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 3 && selectedFormat) {
    let presets: MonetizationPreset[] = [];

    if (selectedFormat === 'LIVE' || selectedFormat === 'ASYNC') {
      if (selectedCategory) {
        presets = (MONETIZATION_PRESETS[selectedFormat] as Record<BusinessCategory, MonetizationPreset[]>)[selectedCategory];
      }
    } else {
      presets = MONETIZATION_PRESETS[selectedFormat] as MonetizationPreset[];
    }

    return (
      <div className="p-2 animate-in slide-in-from-right-4 duration-300">
        <button onClick={() => selectedFormat === 'DIGITAL' || selectedFormat === 'DONATION' ? setStep(1) : setStep(2)} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hover:text-gray-900 mb-3 flex items-center gap-1">
          ← Back
        </button>
        <h3 className="font-bold text-gray-900 text-sm mb-1">Pick a starting point</h3>
        <p className="text-xs text-gray-500 mb-4 tracking-tight">Select a template to pre-fill the details. You can edit everything next.</p>

        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
          {presets?.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset)}
              className="w-full text-left p-3 bg-white border border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-colors group"
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{preset.title}</h4>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  {preset.suggestedPrice ? `₹${preset.suggestedPrice}` : 'Free/Custom'}
                </span>
              </div>
              <p className="text-xs text-gray-500 line-clamp-2">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // STEP 4: DETAILS EDITOR

  return (
    <div className="space-y-4 p-1 animate-in fade-in duration-300">

      {/* Wizard Reset Breadcrumb */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Editing Service / Product</span>
          <span className="text-xs font-semibold text-gray-900">
            {block.content.monetizationType === 'DIGITAL_FILE' ? '📄 Digital Download' : block.content.monetizationType === 'SERVICE_LIVE' ? '📞 1:1 Live Session' : '📨 Async Service'}
          </span>
        </div>
        <button
          onClick={() => {
            // Confirm with user if they want to discard edits
            if (window.confirm('Change service type? This will clear your current title and description.')) {
              onChange({ ...block.content, title: '', description: '', price: '' });
              setStep(1);
            }
          }}
          className="text-xs text-blue-600 font-medium hover:underline px-2 py-1 bg-blue-50 rounded"
        >
          Change Type
        </button>
      </div>

      <div>
        <label className={LABEL_CLASSES}>Title <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={block.content.title || ''}
          onChange={(e) => onChange({ ...block.content, title: e.target.value })}
          placeholder="e.g. 1:1 Strategy Consulting"
          className={INPUT_CLASSES}
        />
      </div>

      <div>
        <label className={LABEL_CLASSES}>Description</label>
        <textarea
          value={block.content.description || ''}
          onChange={(e) => onChange({ ...block.content, description: e.target.value })}
          placeholder="Brief description of what you are offering..."
          className={`${INPUT_CLASSES} h-20 resize-none`}
        />
      </div>

      <div>
        <label className={LABEL_CLASSES}>Price (in ₹) <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={block.content.price || ''}
          onChange={(e) => onChange({ ...block.content, price: e.target.value })}
          placeholder="e.g. 499"
          className={INPUT_CLASSES}
        />
        <p className="text-[10px] text-gray-500 mt-1">Leave empty for Free / Lead Magnet</p>
      </div>

      {block.content.monetizationType === 'DIGITAL_FILE' && (
        <>
          <label className={LABEL_CLASSES}>Downloadable File <span className="text-red-500">*</span></label>
          <div className="border border-dashed border-gray-300 rounded-lg p-3 text-center flex flex-col items-center justify-center relative bg-gray-50 h-24 group cursor-pointer hover:bg-gray-100 transition-colors">
            <input
              type="file"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={handleUpload}
              disabled={isUploadingFile}
            />
            {isUploadingFile ? (
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mb-2" />
            ) : block.content.fileKey ? (
              <div className="flex flex-col items-center justify-center z-0 relative pointer-events-none text-green-600">
                <FileText className="w-6 h-6 mb-1" />
                <p className="text-xs font-semibold">File Uploaded Successfully</p>
                <p className="text-[10px] font-medium leading-[14px] px-2 text-center text-gray-500 mt-1 truncate w-48">{block.content.fileKey.split('/').pop()}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center z-0 relative pointer-events-none">
                <UploadCloud className="w-6 h-6 text-gray-400 mb-1" />
                <p className="text-xs text-gray-600 font-medium">Upload File (Max 50MB)</p>
              </div>
            )}
          </div>
        </>
      )}


      {block.content.monetizationType === 'SERVICE_ASYNC' && (
        <div>
          <label className={LABEL_CLASSES}>Requirement Instructions <span className="text-red-500">*</span></label>
          <input
            type="text"
            value={block.content.asyncRequirementText || ''}
            onChange={(e) => onChange({ ...block.content, asyncRequirementText: e.target.value })}
            placeholder="e.g. Paste the Google Drive link to your resume:"
            className={INPUT_CLASSES}
          />
          <p className="text-[10px] text-gray-500 mt-1">Ask the user for what you need (e.g., links, files, or text) to start the work. Captured at checkout.</p>
        </div>
      )}
    </div>
  );
};
