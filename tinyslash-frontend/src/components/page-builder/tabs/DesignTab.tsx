import React from 'react';
import { Page, PageTheme } from '../../../types/page';
import { Palette, Type, LayoutTemplate, Share2, User, Settings, Image as ImageIcon, Layout, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { pageService } from '../../../services/pageService';
import { useSubscription } from '../../../context/SubscriptionContext';
import { Lock } from 'lucide-react';

interface DesignTabProps {
  page: Page;
  onChange: (updates: Partial<Page>) => void;
}

const THEME_PRESETS: Partial<PageTheme>[] = [
  // --- SOLIDS (4) ---
  {
    // 1. Classic White
    backgroundType: 'SOLID', background: '#ffffff',
    buttonShape: 'ROUNDED', buttonStyle: 'FILLED', buttonShadow: 'NONE',
    buttonColor: '#000000', buttonTextColor: '#ffffff',
    font: 'Inter', textColor: '#000000',
    socialStyle: 'FILLED',
  },
  {
    // 2. Midnight
    backgroundType: 'SOLID', background: '#0f172a',
    buttonShape: 'PILL', buttonStyle: 'SOFT', buttonShadow: 'SUBTLE',
    buttonColor: '#3b82f6', buttonTextColor: '#ffffff',
    font: 'Inter', textColor: '#ffffff',
    socialStyle: 'OUTLINE',
  },
  {
    // 3. Pure Black
    backgroundType: 'SOLID', background: '#000000',
    buttonShape: 'SHARP', buttonStyle: 'OUTLINE', buttonShadow: 'NONE',
    buttonColor: '#ffffff', buttonTextColor: '#ffffff',
    font: 'Space Mono', textColor: '#ffffff',
    socialStyle: 'MONOCHROME',
  },
  {
    // 4. Soft Beige
    backgroundType: 'SOLID', background: '#fdf4dc',
    buttonShape: 'ROUNDED', buttonStyle: 'FILLED', buttonShadow: 'STRONG',
    buttonColor: '#78350f', buttonTextColor: '#fffbeb',
    font: 'Dm Sans', textColor: '#78350f',
    socialStyle: 'FILLED',
  },

  // --- GRADIENTS (8) ---
  {
    // 5. Sunset Vibes
    backgroundType: 'GRADIENT', gradientStart: '#FF512F', gradientEnd: '#DD2476', gradientDirection: 'to bottom right',
    buttonShape: 'ROUNDED', buttonStyle: 'FILLED', buttonShadow: 'STRONG',
    buttonColor: '#ffffff', buttonTextColor: '#DD2476',
    font: 'Poppins', textColor: '#ffffff',
    socialStyle: 'FILLED',
  },
  {
    // 6. Ocean Breeze
    backgroundType: 'GRADIENT', gradientStart: '#2193b0', gradientEnd: '#6dd5ed', gradientDirection: 'to bottom',
    buttonShape: 'PILL', buttonStyle: 'SOFT', buttonShadow: 'SUBTLE',
    buttonColor: '#ffffff', buttonTextColor: '#2193b0',
    font: 'Outfit', textColor: '#ffffff',
    socialStyle: 'OUTLINE',
  },
  {
    // 7. Berry Fusion
    backgroundType: 'GRADIENT', gradientStart: '#C33764', gradientEnd: '#1D2671', gradientDirection: 'to right',
    buttonShape: 'ROUNDED', buttonStyle: 'FILLED', buttonShadow: 'GLOW',
    buttonColor: '#FF6B6B', buttonTextColor: '#ffffff',
    font: 'Montserrat', textColor: '#ffffff',
    socialStyle: 'FILLED',
  },
  {
    // 8. Aurora
    backgroundType: 'GRADIENT', gradientStart: '#00c6ff', gradientEnd: '#0072ff', gradientDirection: 'to bottom right',
    buttonShape: 'PILL', buttonStyle: 'FILLED', buttonShadow: 'STRONG',
    buttonColor: '#ffffff', buttonTextColor: '#0072ff',
    font: 'Inter', textColor: '#ffffff',
    socialStyle: 'FILLED',
  },
  {
    // 9. Lush Forest
    backgroundType: 'GRADIENT', gradientStart: '#134E5E', gradientEnd: '#71B280', gradientDirection: 'to bottom',
    buttonShape: 'ROUNDED', buttonStyle: 'OUTLINE', buttonShadow: 'NONE',
    buttonColor: '#ffffff', buttonTextColor: '#ffffff',
    font: 'Lora', textColor: '#ffffff',
    socialStyle: 'OUTLINE',
  },
  {
    // 10. Golden Hour
    backgroundType: 'GRADIENT', gradientStart: '#f8b500', gradientEnd: '#fceabb', gradientDirection: 'to bottom',
    buttonShape: 'SHARP', buttonStyle: 'FILLED', buttonShadow: 'SUBTLE',
    buttonColor: '#000000', buttonTextColor: '#ffffff',
    font: 'Oswald', textColor: '#000000',
    socialStyle: 'FILLED',
  },
  {
    // 11. Deep Space
    backgroundType: 'GRADIENT', gradientStart: '#000000', gradientEnd: '#434343', gradientDirection: 'to bottom',
    buttonShape: 'PILL', buttonStyle: 'SOFT', buttonShadow: 'GLOW',
    buttonColor: '#00f260', buttonTextColor: '#000000',
    font: 'Space Mono', textColor: '#00f260',
    socialStyle: 'MONOCHROME',
  },
  {
    // 12. Cotton Candy
    backgroundType: 'GRADIENT', gradientStart: '#D9AFD9', gradientEnd: '#97D9E1', gradientDirection: 'to top right',
    buttonShape: 'ROUNDED', buttonStyle: 'FILLED', buttonShadow: 'STRONG',
    buttonColor: '#ffffff', buttonTextColor: '#6B7280',
    font: 'Outfit', textColor: '#ffffff',
    socialStyle: 'FILLED',
  },
];

export const DesignTab: React.FC<DesignTabProps> = ({ page, onChange }) => {
  const theme = page.theme;
  const { planInfo, showUpgradeModal } = useSubscription();

  const updateTheme = (updates: Partial<PageTheme>) => {
    onChange({ theme: { ...theme, ...updates } });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'background' | 'banner' = 'background') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    try {
      const loadingToast = toast.loading('Uploading image...');
      // pageService.uploadAsset returns { url: string }
      const response = await pageService.uploadAsset(file);
      const url = response.url;

      if (type === 'background') {
        updateTheme({ background: url, backgroundType: 'IMAGE' });
      } else {
        updateTheme({ bannerImage: url, bannerType: 'IMAGE' });
      }

      toast.dismiss(loadingToast);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Upload failed');
    }
  };


  const fonts = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat', 'Oswald', 'Playfair Display', 'Lora', 'Space Mono', 'Outfit', 'DM Sans'];
  const weights = [
    { label: 'Normal', value: 'NORMAL' },
    { label: 'Semibold', value: 'SEMIBOLD' },
    { label: 'Bold', value: 'BOLD' }
  ];

  return (
    <div className="space-y-6 pb-24 px-1">

      {/* THEME PRESETS */}
      <Section title="Themes" icon={Sparkles}>
        <div className="grid grid-cols-4 gap-3">
          {THEME_PRESETS.map((preset, idx) => {
            const isLocked = idx >= 4 && !planInfo?.canUsePremiumTemplates; // Lock index 4+ (Gradients/Advanced) for Free users

            return (
              <button
                key={idx}
                onClick={() => {
                  if (isLocked) {
                    showUpgradeModal('premium-templates', 'Upgrade to Starter to unlock premium themes.');
                    return;
                  }
                  updateTheme(preset);
                }}
                className="group relative aspect-square rounded-xl cursor-pointer hover:ring-2 ring-offset-2 ring-blue-500 transition-all border border-gray-200 overflow-hidden shadow-sm hover:shadow-md"
                title={isLocked ? "Premium Theme" : "Apply Preset"}
              >
                {preset.backgroundType === 'GRADIENT' ? (
                  <div className="absolute inset-0" style={{ background: `linear-gradient(${preset.gradientDirection}, ${preset.gradientStart}, ${preset.gradientEnd})` }} />
                ) : (
                  <div className="absolute inset-0" style={{ background: preset.background }} />
                )}

                {/* Mini Preview of Content */}
                <div className="absolute inset-x-2 bottom-2 space-y-1.5 opacity-80">
                  <div className={`h-2 rounded-full w-3/4 ${preset.textColor === '#ffffff' ? 'bg-white/50' : 'bg-black/20'}`} />
                  <div className={`h-6 rounded-lg w-full ${preset.buttonColor === '#ffffff' ? 'bg-white text-black' : 'bg-black/20'}`}
                    style={{ backgroundColor: preset.buttonColor }}>
                  </div>
                </div>

                {/* Active Indicator (optional logic could be added) */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </button>
            );
          })}
        </div>
      </Section>

      <hr className="border-gray-100" />

      {/* BACKGROUND */}
      <Section title="Background" icon={Palette}>
        {/* Type Selector */}
        <SegmentedControl
          options={['SOLID', 'GRADIENT', 'IMAGE']}
          value={theme.backgroundType}
          onChange={(val: string) => updateTheme({ backgroundType: val as any })}
        />

        {theme.backgroundType === 'SOLID' && (
          <ColorPicker label="Background Color" value={theme.background} onChange={(val: string) => updateTheme({ background: val })} />
        )}

        {theme.backgroundType === 'GRADIENT' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <ColorPicker label="Start Color" value={theme.gradientStart || '#ffffff'} onChange={(val: string) => updateTheme({ gradientStart: val })} />
              <ColorPicker label="End Color" value={theme.gradientEnd || '#000000'} onChange={(val: string) => updateTheme({ gradientEnd: val })} />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Direction</label>
              <select
                value={theme.gradientDirection || 'to bottom'}
                onChange={(e) => updateTheme({ gradientDirection: e.target.value })}
                className="w-full text-sm border-gray-300 rounded-lg"
              >
                <option value="to bottom">Top to Bottom</option>
                <option value="to right">Left to Right</option>
                <option value="to bottom right">Diagonal</option>
                <option value="to top right">Diagonal Up</option>
                <option value="circle at center">Radial</option>
              </select>
            </div>
          </div>
        )}

        {theme.backgroundType === 'IMAGE' && (
          <div>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative">
              {theme.background && !theme.background.startsWith('#') ? (
                <div className="relative w-full h-full">
                  <img src={theme.background} alt="bg" className="w-full h-full object-cover rounded-lg opacity-50" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-white/80 px-2 py-1 rounded text-xs">Click to change</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">Upload Image</p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  if (!planInfo?.canUsePremiumTemplates) {
                    showUpgradeModal('premium-templates', 'Upgrade to Starter to upload custom backgrounds.');
                    return;
                  }
                  handleImageUpload(e);
                }}
              />
              {!planInfo?.canUsePremiumTemplates && (
                <div className="absolute top-2 right-2 bg-gray-900/80 p-1 rounded-full text-white">
                  <Lock className="w-3 h-3" />
                </div>
              )}
            </label>
          </div>
        )}
      </Section>

      <hr className="border-gray-100" />

      {/* BANNER */}
      <Section title="Banner" icon={Layout}>
        <SegmentedControl
          options={['NONE', 'GRADIENT', 'IMAGE']}
          value={theme.bannerType || 'NONE'}
          onChange={(val: string) => updateTheme({ bannerType: val as any })}
        />

        {theme.bannerType === 'GRADIENT' && (
          <div className="space-y-3 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <ColorPicker label="Start Color" value={theme.bannerGradientStart || '#ff00cc'} onChange={(val: string) => updateTheme({ bannerGradientStart: val })} />
              <ColorPicker label="End Color" value={theme.bannerGradientEnd || '#333399'} onChange={(val: string) => updateTheme({ bannerGradientEnd: val })} />
            </div>
            <SliderControl
              label="Height"
              value={theme.bannerHeight || 150}
              min={100} max={400} step={10}
              onChange={(val: number) => updateTheme({ bannerHeight: val })}
              unit="px"
            />
          </div>
        )}

        {theme.bannerType === 'IMAGE' && (
          <div className="mt-4 space-y-3">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors relative overflow-hidden">
              {theme.bannerImage ? (
                <>
                  <img src={theme.bannerImage} alt="banner" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <span className="text-white text-xs font-medium">Click to change</span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500">Upload Banner</p>
                </div>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(e, 'banner');
                }}
              />
            </label>
            <SliderControl
              label="Height"
              value={theme.bannerHeight || 150}
              min={100} max={400} step={10}
              onChange={(val: number) => updateTheme({ bannerHeight: val })}
              unit="px"
            />
          </div>
        )}
      </Section>

      <hr className="border-gray-100" />

      {/* BUTTONS */}
      <Section title="Buttons" icon={LayoutTemplate}>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Shape</label>
            <div className="grid grid-cols-3 gap-2">
              <OptionButton
                active={theme.buttonShape === 'ROUNDED'}
                onClick={() => updateTheme({ buttonShape: 'ROUNDED' })}
                label="Rounded"
                preview={<div className="w-8 h-3 bg-current rounded-md" />}
              />
              <OptionButton
                active={theme.buttonShape === 'PILL'}
                onClick={() => updateTheme({ buttonShape: 'PILL' })}
                label="Pill"
                preview={<div className="w-8 h-3 bg-current rounded-full" />}
              />
              <OptionButton
                active={theme.buttonShape === 'SHARP'}
                onClick={() => updateTheme({ buttonShape: 'SHARP' })}
                label="Sharp"
                preview={<div className="w-8 h-3 bg-current rounded-none" />}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Style</label>
            <div className="grid grid-cols-3 gap-2">
              <OptionButton label="Filled" active={theme.buttonStyle === 'FILLED'} onClick={() => updateTheme({ buttonStyle: 'FILLED' })} />
              <OptionButton label="Outline" active={theme.buttonStyle === 'OUTLINE'} onClick={() => updateTheme({ buttonStyle: 'OUTLINE' })} />
              <OptionButton label="Soft" active={theme.buttonStyle === 'SOFT'} onClick={() => updateTheme({ buttonStyle: 'SOFT' })} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Shadow</label>
            <SegmentedControl
              options={['NONE', 'SUBTLE', 'STRONG']}
              value={theme.buttonShadow}
              onChange={(val: string) => updateTheme({ buttonShadow: val as any })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <ColorPicker label="Button Color" value={theme.buttonColor || '#000000'} onChange={(val: string) => updateTheme({ buttonColor: val })} />
            <ColorPicker label="Text Color" value={theme.buttonTextColor || '#ffffff'} onChange={(val: string) => updateTheme({ buttonTextColor: val })} />
          </div>

          {/* Enhanced Button Size Controls */}
          <div className="pt-2 space-y-3 border-t border-gray-100 mt-2">
            <SliderControl
              label="Button Size (Padding)"
              value={typeof theme.buttonSize === 'number' ? theme.buttonSize : 50}
              min={0} max={100} step={5}
              onChange={(val: number) => updateTheme({ buttonSize: val })}
              unit="%"
            />

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Button Font</label>
              <select
                value={theme.buttonFont || theme.font}
                onChange={(e) => updateTheme({ buttonFont: e.target.value })}
                className="w-full text-sm border-gray-300 rounded-lg"
                style={{ fontFamily: theme.buttonFont || theme.font }}
              >
                <option value="">Same as Page Font</option>
                {fonts.map(font => (
                  <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                ))}
              </select>
            </div>

            <SliderControl
              label="Button Text Size"
              value={theme.buttonTextSize || 16}
              min={12} max={32} step={1}
              onChange={(val: number) => updateTheme({ buttonTextSize: val })}
              unit="px"
            />
          </div>
        </div>
      </Section>

      <hr className="border-gray-100" />

      {/* TYPOGRAPHY */}
      <Section title="Typography" icon={Type}>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Font Family</label>
            <select
              value={theme.font}
              onChange={(e) => updateTheme({ font: e.target.value })}
              className="w-full text-sm border-gray-300 rounded-lg"
              style={{ fontFamily: theme.font }}
            >
              {fonts.map(font => (
                <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <SliderControl
              label="Base Font Size"
              value={typeof theme.fontSize === 'number' ? theme.fontSize : 16}
              min={12} max={32} step={1}
              onChange={(val: number) => updateTheme({ fontSize: val })}
              unit="px"
            />

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Weight</label>
              <select
                value={theme.fontWeight || 'NORMAL'}
                onChange={(e) => updateTheme({ fontWeight: e.target.value as any })}
                className="w-full text-sm border-gray-300 rounded-lg"
              >
                {weights.map(w => (
                  <option key={w.value} value={w.value}>{w.label}</option>
                ))}
              </select>
            </div>
          </div>

          <ColorPicker label="Main Text Color" value={theme.textColor} onChange={(val: string) => updateTheme({ textColor: val })} />
        </div>
      </Section>



      {/* SOCIAL ICONS */}
      <Section title="Social Icons" icon={Share2}>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Style</label>
            <SegmentedControl
              options={['FILLED', 'OUTLINE', 'MONOCHROME']}
              value={theme.socialStyle}
              onChange={(val: string) => updateTheme({ socialStyle: val as any })}
            />
          </div>

          <SliderControl
            label="Icon Size"
            value={typeof theme.socialIconSize === 'number' ? theme.socialIconSize : 48}
            min={24} max={80} step={4}
            onChange={(val: number) => updateTheme({ socialIconSize: val })}
            unit="px"
          />

          <SliderControl
            label="Icon Spacing"
            value={theme.socialIconSpacing || 16}
            min={4} max={48} step={4}
            onChange={(val: number) => updateTheme({ socialIconSpacing: val })}
            unit="px"
          />

          {theme.socialStyle === 'MONOCHROME' && (
            <ColorPicker label="Icon Color" value={theme.socialIconColor || '#000000'} onChange={(val: string) => updateTheme({ socialIconColor: val })} />
          )}
        </div>
      </Section>

      <hr className="border-gray-100" />

      {/* PROFILE */}
      <Section title="Profile" icon={User}>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Image Style</label>
            <SegmentedControl
              options={['CIRCLE', 'ROUNDED', 'SQUARE']}
              value={theme.profileImageStyle}
              onChange={(val: string) => updateTheme({ profileImageStyle: val as any })}
            />
          </div>
          <SliderControl
            label="Image Size"
            value={typeof theme.profileImageSize === 'number' ? theme.profileImageSize : 96}
            min={40} max={200} step={4}
            onChange={(val: number) => updateTheme({ profileImageSize: val })}
            unit="px"
          />
        </div>
      </Section>



      {/* ADVANCED */}
      <Section title="Advanced" icon={Settings}>
        <div className="space-y-4">
          <SliderControl
            label="Page Max Width"
            value={theme.pageMaxWidth}
            min={480} max={960} step={20}
            onChange={(val: number) => updateTheme({ pageMaxWidth: val })}
            unit="px"
          />

          <div>
            <label className="text-xs font-medium text-gray-500 mb-2 block">Content Spacing</label>
            <SegmentedControl
              options={['COMPACT', 'NORMAL', 'RELAXED']}
              value={theme.contentSpacing}
              onChange={(val: string) => updateTheme({ contentSpacing: val as any })}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <div>
              <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                Hide Branding
                {!planInfo?.canRemovePageBranding && <Lock className="w-3 h-3 text-gray-400" />}
              </span>
              <p className="text-xs text-gray-500">Remove "Powered by TinySlash"</p>
            </div>
            <input
              type="checkbox"
              checked={theme.showBranding === false}
              onChange={(e) => {
                if (!planInfo?.canRemovePageBranding) {
                  showUpgradeModal('remove-branding', 'Upgrade to the Business plan to remove branding.');
                  return;
                }
                updateTheme({ showBranding: !e.target.checked });
              }}
              className={`rounded h-5 w-5 border-gray-300 ${!planInfo?.canRemovePageBranding ? 'cursor-not-allowed opacity-50' : 'text-blue-600 focus:ring-blue-500'}`}
            />
          </div>
        </div>
      </Section>

    </div >
  );
};


// HELPER COMPONENTS

const Section = ({ title, icon: Icon, children }: any) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow duration-300">
    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2.5 border-b border-gray-50 pb-3">
      <div className="p-1.5 bg-gray-50 rounded-lg text-gray-700">
        <Icon className="w-4 h-4" />
      </div>
      {title}
    </h3>
    <div className="space-y-5">
      {children}
    </div>
  </div>
);

const SegmentedControl = ({ options, value, onChange }: any) => (
  <div className="flex bg-gray-100/80 p-1.5 rounded-xl border border-gray-100/50">
    {options.map((opt: string) => (
      <button
        key={opt}
        onClick={() => onChange(opt)}
        className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 capitalize ${value === opt
          ? 'bg-white text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.08)] ring-1 ring-black/5'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
          }`}
      >
        {opt.toLowerCase().replace('_', ' ')}
      </button>
    ))}
  </div>
);

const ColorPicker = ({ label, value, onChange }: any) => (
  <div className="group">
    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2 block group-hover:text-gray-900 transition-colors">{label}</label>
    <div className="flex items-center gap-3 p-2 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors shadow-sm">
      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-100 shadow-inner shrink-0 ring-1 ring-black/5">
        <div className="absolute inset-0 z-0 bg-gray-100 bg-[url('https://t3.ftcdn.net/jpg/02/64/08/98/360_F_264089856_1o1j1a1n1b1n1c1.jpg')] bg-contain opacity-20"></div>
        <div
          className="absolute inset-0 z-10"
          style={{ backgroundColor: value }}
        />
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 p-0 m-0 border-0 cursor-pointer opacity-0 z-50"
        />
      </div>
      <div className="flex-1 flex flex-col">
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Hex Code</span>
        <div className="flex items-center">
          <span className="text-gray-400 text-sm mr-0.5">#</span>
          <input
            type="text"
            value={value.replace('#', '')}
            onChange={(e) => onChange(`#${e.target.value}`)}
            className="w-full text-sm font-mono font-medium text-gray-900 outline-none uppercase bg-transparent placeholder-gray-300"
            placeholder="000000"
          />
        </div>
      </div>
    </div>
  </div>
);

const OptionButton = ({ active, onClick, label, preview }: any) => (
  <button
    onClick={onClick}
    className={`group flex flex-col items-center justify-center gap-3 p-4 border rounded-xl transition-all duration-200 ${active
      ? 'border-black bg-gray-900 text-white shadow-lg scale-[1.02]'
      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50'
      }`}
  >
    <div className={`transition-transform duration-200 ${active ? 'scale-110' : 'group-hover:scale-105'}`}>
      {preview}
    </div>
    <span className={`text-xs font-semibold tracking-wide ${active ? 'text-white' : 'text-gray-500 group-hover:text-gray-900'}`}>{label}</span>
  </button>
);

const SliderControl = ({ label, value, min, max, step, onChange, unit }: any) => {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="group pt-6 pb-2">
      <div className="flex justify-between items-center mb-1">
        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      </div>
      <div className="relative h-6 flex items-center select-none touch-none">
        {/* Track Background */}
        <div className="absolute w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          {/* Filled Track */}
          <div
            className="h-full bg-black rounded-full transition-all duration-75 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Floating Tooltip */}
        <div
          className="absolute -top-8 -translate-x-1/2 flex flex-col items-center transition-all duration-75 ease-out pointer-events-none"
          style={{ left: `${percentage}%` }}
        >
          <div className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm mb-1 whitespace-nowrap">
            {value}{unit}
          </div>
          <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-black -mt-1.5"></div>
        </div>

        {/* Thumb (Native Input) */}
        <input
          type="range"
          min={min} max={max} step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 scale-110"
        />

        {/* Visual Thumb (Visible) */}
        <div
          className="absolute h-5 w-5 bg-white border-2 border-black rounded-full shadow-md -translate-x-1/2 pointer-events-none transition-all duration-75 ease-out group-hover:scale-110"
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
