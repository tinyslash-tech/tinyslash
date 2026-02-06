import React from 'react';
import { Page, PageTheme } from '../../../types/page';
import { Palette, Type, LayoutTemplate, Share2 } from 'lucide-react';

interface ThemeTabProps {
  page: Page;
  onChange: (updates: Partial<Page>) => void;
}

export const ThemeTab: React.FC<ThemeTabProps> = ({ page, onChange }) => {
  const theme = page.theme;

  const updateTheme = (updates: Partial<PageTheme>) => {
    onChange({ theme: { ...theme, ...updates } });
  };

  const fonts = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Montserrat', 'Oswald'];
  const buttonStyles = [
    { value: 'ROUNDED', label: 'Rounded' },
    { value: 'SHARP', label: 'Sharp' },
    { value: 'OUTLINE', label: 'Outline' },
    { value: 'FILL', label: 'Fill' },
  ];

  const sizes = [
    { value: 'SM', label: 'Small' },
    { value: 'MD', label: 'Medium' },
    { value: 'LG', label: 'Large' },
  ];

  const weights = [
    { value: 'NORMAL', label: 'Normal' },
    { value: 'SEMIBOLD', label: 'Semibold' },
    { value: 'BOLD', label: 'Bold' },
  ];

  return (
    <div className="space-y-8">
      {/* Background Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Palette className="w-4 h-4" /> Background
        </h3>

        <div className="space-y-4">
          {/* Type Selector */}
          <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-lg">
            {(['SOLID', 'GRADIENT', 'IMAGE'] as const).map((type) => (
              <button
                key={type}
                onClick={() => updateTheme({ backgroundType: type })}
                className={`py-1.5 text-xs font-medium rounded-md transition-all ${theme.backgroundType === type
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {theme.backgroundType === 'SOLID' && (
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.background}
                  onChange={(e) => updateTheme({ background: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={theme.background}
                  onChange={(e) => updateTheme({ background: e.target.value })}
                  className="flex-1 text-sm border-gray-300 rounded"
                />
              </div>
            </div>
          )}

          {theme.backgroundType === 'GRADIENT' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Start Color</label>
                <input
                  type="color"
                  value={theme.gradientStart || '#ffffff'}
                  onChange={(e) => updateTheme({ gradientStart: e.target.value })}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">End Color</label>
                <input
                  type="color"
                  value={theme.gradientEnd || '#000000'}
                  onChange={(e) => updateTheme({ gradientEnd: e.target.value })}
                  className="w-full h-8 rounded cursor-pointer"
                />
              </div>
              <div className="col-span-2">
                <select
                  value={theme.gradientDirection || 'to bottom'}
                  onChange={(e) => updateTheme({ gradientDirection: e.target.value })}
                  className="w-full text-sm border-gray-300 rounded"
                >
                  <option value="to bottom">Top to Bottom</option>
                  <option value="to right">Left to Right</option>
                  <option value="to bottom right">Diagonal</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Buttons Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4" /> Buttons
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Style</label>
            <div className="grid grid-cols-2 gap-2">
              {buttonStyles.map(style => (
                <button
                  key={style.value}
                  onClick={() => updateTheme({ buttonStyle: style.value as any })}
                  className={`px-3 py-2 text-sm border rounded-lg transition-all ${theme.buttonStyle === style.value
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Button Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.buttonColor}
                  onChange={(e) => updateTheme({ buttonColor: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border-0"
                />
                <span className="text-xs text-gray-600">{theme.buttonColor}</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.buttonTextColor}
                  onChange={(e) => updateTheme({ buttonTextColor: e.target.value })}
                  className="w-8 h-8 rounded cursor-pointer border-0"
                />
                <span className="text-xs text-gray-600">{theme.buttonTextColor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Social Icons Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Share2 className="w-4 h-4" /> Social Icons
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Size</label>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {sizes.map(size => (
                <button
                  key={size.value}
                  onClick={() => updateTheme({ socialIconSize: size.value as any })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${theme.socialIconSize === size.value
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full">
            <label className="text-xs font-medium text-gray-500 mb-1 block">Full Icon Background Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.socialBackgroundColor || '#e8e8e8'}
                onChange={(e) => updateTheme({ socialBackgroundColor: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer border-0"
              />
              <span className="text-xs text-gray-600">{theme.socialBackgroundColor || '#e8e8e8'}</span>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Typography Section */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Type className="w-4 h-4" /> Typography
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Font Family</label>
            <select
              value={theme.font}
              onChange={(e) => updateTheme({ font: e.target.value })}
              className="w-full text-sm border-gray-300 rounded-lg"
            >
              {fonts.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Size</label>
              <select
                value={theme.fontSize || 'MD'}
                onChange={(e) => updateTheme({ fontSize: e.target.value as any })}
                className="w-full text-sm border-gray-300 rounded-lg"
              >
                {sizes.map(size => (
                  <option key={size.value} value={size.value}>{size.label}</option>
                ))}
              </select>
            </div>
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

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">Main Text Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.textColor}
                onChange={(e) => updateTheme({ textColor: e.target.value })}
                className="w-8 h-8 rounded cursor-pointer border-0"
              />
              <span className="text-xs text-gray-600">{theme.textColor}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
