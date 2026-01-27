import React, { useState } from 'react';
import { Palette, Upload, Lock, Crown, ChevronDown, Type, Image as ImageIcon, Layout, Box } from 'lucide-react';
import { QRCustomization } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface QRCustomizationPanelProps {
  qrCustomization: QRCustomization;
  setQrCustomization: React.Dispatch<React.SetStateAction<QRCustomization>>;
  featureAccess: any;
  upgradeModal: any;
  logoInputRef: React.RefObject<HTMLInputElement>;
}

export const QRCustomizationPanel: React.FC<QRCustomizationPanelProps> = ({
  qrCustomization,
  setQrCustomization,
  featureAccess,
  upgradeModal,
  logoInputRef
}) => {

  const [openSection, setOpenSection] = useState<string | null>('colors');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const desiPresets = [
    { name: 'Saffron', foreground: '#FF9933', background: '#FFF5E6' },
    { name: 'Peacock', foreground: '#005F6A', background: '#E0F7FA' },
    { name: 'Magenta', foreground: '#C2185B', background: '#FCE4EC' },
    { name: 'Royal', foreground: '#4A148C', background: '#F3E5F5' },
    { name: 'Marigold', foreground: '#FF6F00', background: '#FFF8E1' },
    { name: 'Leaf', foreground: '#2E7D32', background: '#E8F5E9' },
  ];

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size too large (Max 2MB)');
        return;
      }
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Invalid file type');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setQrCustomization(prev => ({
          ...prev,
          logo: event.target?.result as string,
          logoSize: 20
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const AccordionItem = ({ id, title, icon: Icon, children }: any) => (
    <div className="border border-gray-200 rounded-xl overflow-hidden mb-3 shadow-sm bg-white">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center space-x-3 text-gray-800">
          <Icon className="w-5 h-5 text-gray-500" />
          <span className="font-semibold">{title}</span>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openSection === id ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {openSection === id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-5 border-t border-gray-100 space-y-6">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Customization Options</h3>
        <button
          onClick={() => setQrCustomization({
            foregroundColor: '#000000',
            backgroundColor: '#FFFFFF',
            size: 300,
            errorCorrectionLevel: 'M',
            margin: 4,
            pattern: 'square',
            cornerStyle: 'square',
            frameStyle: 'none',
            gradientType: 'none',
            gradientDirection: 'to-right',
            secondaryColor: '#333333',
            centerTextFontSize: 16,
            centerTextFontFamily: 'Arial',
            centerTextColor: '#000000',
            centerTextBackgroundColor: '#FFFFFF',
            centerTextBold: true,
            logo: undefined,
            centerText: undefined
          })}
          className="text-xs font-medium text-red-600 hover:text-red-800 hover:underline"
        >
          Reset All
        </button>
      </div>

      {/* 1. Colors & Themes */}
      <AccordionItem id="colors" title="Colors & Themes" icon={Palette}>
        {/* Desi Presets */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Indian Vibrant Themes</label>
          <div className="grid grid-cols-3 gap-2">
            {desiPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => setQrCustomization(prev => ({
                  ...prev,
                  foregroundColor: preset.foreground,
                  backgroundColor: preset.background
                }))}
                className="p-2 border rounded-lg hover:border-blue-400 transition-all flex flex-col items-center gap-1 bg-white"
              >
                <div
                  className="w-full h-8 rounded"
                  style={{ background: `linear-gradient(135deg, ${preset.foreground} 50%, ${preset.background} 50%)` }}
                />
                <span className="text-xs text-gray-600">{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Colors */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Foreign Color</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={qrCustomization.foregroundColor}
                onChange={e => setQrCustomization(prev => ({ ...prev, foregroundColor: e.target.value }))}
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={qrCustomization.foregroundColor}
                onChange={e => setQrCustomization(prev => ({ ...prev, foregroundColor: e.target.value }))}
                className="w-full text-xs p-1 border rounded"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Background</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={qrCustomization.backgroundColor}
                onChange={e => setQrCustomization(prev => ({ ...prev, backgroundColor: e.target.value }))}
                className="w-8 h-8 rounded border cursor-pointer"
              />
              <input
                type="text"
                value={qrCustomization.backgroundColor}
                onChange={e => setQrCustomization(prev => ({ ...prev, backgroundColor: e.target.value }))}
                className="w-full text-xs p-1 border rounded"
              />
            </div>
          </div>
        </div>
      </AccordionItem>

      {/* 2. Data Patterns */}
      <AccordionItem id="patterns" title="Data Patterns & Shapes" icon={Box}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Module Style</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'square', name: 'Square (Default)', icon: '⬛' },
                { id: 'dots', name: 'Dots', icon: '●' },
                { id: 'rounded-modules', name: 'Rounded', icon: '▢' },
                { id: 'diamond', name: 'Diamond', icon: '◆' },
                { id: 'star', name: 'Stars', icon: '★' },
                { id: 'fluid', name: 'Fluid', icon: '🌊' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setQrCustomization(prev => ({ ...prev, pattern: p.id as any }))}
                  className={`p-3 border rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${qrCustomization.pattern === p.id ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50'}`}
                >
                  <span className="text-xl">{p.icon}</span>
                  <span className="text-xs">{p.name}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">These patterns change the shape of the data points.</p>
          </div>
        </div>
      </AccordionItem>

      {/* 3. Logo Configuration */}
      <AccordionItem id="logo" title="Logo Settings" icon={ImageIcon}>
        <div className="space-y-4">
          {!qrCustomization.logo ? (
            <button
              onClick={() => featureAccess.canUseQRLogo ? logoInputRef.current?.click() : upgradeModal.open('QR Logo', 'Upgrade to add logos', false)}
              className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center text-gray-500 hover:border-blue-500 hover:text-blue-600 transition-colors"
            >
              <Upload className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">Upload Logo (Pro)</span>
            </button>
          ) : (
            <div className="flex items-start gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <img src={qrCustomization.logo} className="w-16 h-16 object-contain rounded bg-white shadow-sm" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-700">Logo Active</span>
                  <button onClick={() => setQrCustomization(prev => ({ ...prev, logo: undefined }))} className="text-xs text-red-600 hover:underline">Remove</button>
                </div>

                {/* Size */}
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Size</span>
                    <span>{qrCustomization.logoSize || 20}%</span>
                  </div>
                  <input
                    type="range" min="10" max="40"
                    value={qrCustomization.logoSize || 20}
                    onChange={e => setQrCustomization(prev => ({ ...prev, logoSize: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Opacity */}
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Opacity</span>
                    <span>{(qrCustomization.logoOpacity ?? 1) * 100}%</span>
                  </div>
                  <input
                    type="range" min="0" max="1" step="0.1"
                    value={qrCustomization.logoOpacity ?? 1}
                    onChange={e => setQrCustomization(prev => ({ ...prev, logoOpacity: parseFloat(e.target.value) }))}
                    className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Radius */}
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Rounded Corners</span>
                    <span>{qrCustomization.logoCornerRadius || 0}px</span>
                  </div>
                  <input
                    type="range" min="0" max="50"
                    value={qrCustomization.logoCornerRadius || 0}
                    onChange={e => setQrCustomization(prev => ({ ...prev, logoCornerRadius: parseInt(e.target.value) }))}
                    className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
          <input ref={logoInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
        </div>
      </AccordionItem>

      {/* 3. Frames */}
      <AccordionItem id="frames" title="Frames & Styles" icon={Layout}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Choose Frame</label>
            <div className="grid grid-cols-3 gap-2">
              {['none', 'simple', 'rounded', 'scan-me', 'scan-me-black', 'desi-mandala', 'desi-floral', 'modern'].map(style => (
                <button
                  key={style}
                  onClick={() => setQrCustomization(prev => ({ ...prev, frameStyle: style as any }))}
                  className={`p-2 border rounded-lg text-xs capitalize text-center ${qrCustomization.frameStyle === style ? 'border-blue-500 bg-blue-50 text-blue-700 font-bold' : 'hover:bg-gray-50'}`}
                >
                  {style.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {qrCustomization.frameStyle !== 'none' && (
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Frame Color</label>
                <div className="flex items-center space-x-2">
                  <input type="color" value={qrCustomization.frameColor || qrCustomization.foregroundColor} onChange={e => setQrCustomization(prev => ({ ...prev, frameColor: e.target.value }))} className="w-6 h-6 rounded border" />
                  <span className="text-xs text-gray-500">Auto-match foreground if not set</span>
                </div>
              </div>
              {(qrCustomization.frameStyle.includes('scan-me') || qrCustomization.frameStyle === 'modern') && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Frame Text</label>
                  <input
                    type="text"
                    placeholder="SCAN ME"
                    value={qrCustomization.frameText || ''}
                    onChange={e => setQrCustomization(prev => ({ ...prev, frameText: e.target.value }))}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </AccordionItem>

      {/* 4. Text Overlay */}
      <AccordionItem id="text" title="Text Overlay" icon={Type}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Center Text</label>
            <input
              type="text"
              placeholder="e.g. SCAN ME"
              value={qrCustomization.centerText || ''}
              onChange={e => setQrCustomization(prev => ({ ...prev, centerText: e.target.value }))}
              className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          {qrCustomization.centerText && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Size</label>
                <input
                  type="number" min="8" max="40"
                  value={qrCustomization.centerTextFontSize}
                  onChange={e => setQrCustomization(prev => ({ ...prev, centerTextFontSize: parseInt(e.target.value) }))}
                  className="w-full px-2 py-1 border rounded"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Color</label>
                <input
                  type="color"
                  value={qrCustomization.centerTextColor}
                  onChange={e => setQrCustomization(prev => ({ ...prev, centerTextColor: e.target.value }))}
                  className="w-full h-8 px-1 py-1 border rounded"
                />
              </div>
            </div>
          )}
        </div>
      </AccordionItem>
    </div>
  );
};
