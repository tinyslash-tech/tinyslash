import React, { useState, useRef, useEffect } from 'react';
import { X, Download, Copy, ExternalLink, Share2, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { QRCustomization } from '../CreateSection/types';

// Define a type compatible with QRCodeData from QRManageSection
export interface QRPreviewData {
  id: string;
  title: string;
  url: string;
  shortUrl?: string;
  isDynamic: boolean;
  customization: {
    foregroundColor: string;
    backgroundColor: string;
    logoUrl?: string;
    style?: string; // may need mapping to pattern
    size?: number;
    errorCorrection?: string;
    trustBadge?: boolean;
    // Advanced Customization
    pattern?: string;
    frameStyle?: string;
    frameColor?: string;
    frameText?: string;
    frameTextColor?: string;
    gradientType?: string;
    gradientDirection?: string;
    secondaryColor?: string;
    centerText?: string;
    centerTextColor?: string;
    logoSize?: number;
    logoOpacity?: number;
    logoCornerRadius?: number;
    centerTextFontSize?: number;
    centerTextFontFamily?: string;
    centerTextBackgroundColor?: string;
    centerTextBold?: boolean;
    centerTextOpacity?: number;
    centerTextBackgroundOpacity?: number;
    centerTextBackgroundRadius?: number;
    margin?: number;
  };
  qrCodeImage?: string;
}

interface QRPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  qr: QRPreviewData | null;
}

const QRPreviewModal: React.FC<QRPreviewModalProps> = ({
  isOpen,
  onClose,
  qr
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Generate QR functionality reuse
  useEffect(() => {
    if (isOpen && qr && canvasRef.current) {
      // Short timeout to ensure canvas is ready
      setTimeout(generateQR, 50);
    }
  }, [isOpen, qr]);

  const generateQR = async () => {
    if (!canvasRef.current || !qr) return;

    try {
      const QRCode = await import('qrcode');
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const downloadSize = 1200; // High res for download
      const padding = 60;
      const qrSize = downloadSize - (padding * 2);

      // Map simple customization to complex structure if needed
      // Default fallback values
      // Ensure customization object exists
      const customization = qr.customization || {};

      const config: any = {
        foregroundColor: customization.foregroundColor || '#000000',
        backgroundColor: customization.backgroundColor || '#ffffff',
        errorCorrectionLevel: (customization.errorCorrection as any) || 'M',
        pattern: (customization.style as any) || 'square',
        logo: customization.logoUrl, // Map logoUrl to logo
        size: qrSize,
        margin: 1,
        trustBadge: customization.trustBadge, // Pass trustBadge
        // Advanced
        frameStyle: customization.frameStyle,
        frameColor: customization.frameColor,
        frameText: customization.frameText,
        gradientType: customization.gradientType,
        gradientDirection: customization.gradientDirection,
        secondaryColor: customization.secondaryColor,
        centerText: customization.centerText,
        centerTextColor: customization.centerTextColor,
        centerTextFontSize: customization.centerTextFontSize,
        centerTextFontFamily: customization.centerTextFontFamily,
        centerTextBackgroundColor: customization.centerTextBackgroundColor,
        centerTextBold: customization.centerTextBold,
        centerTextOpacity: customization.centerTextOpacity,
        centerTextBackgroundOpacity: customization.centerTextBackgroundOpacity,
        centerTextBackgroundRadius: customization.centerTextBackgroundRadius,
        logoSize: customization.logoSize,
        logoOpacity: customization.logoOpacity,
        logoCornerRadius: customization.logoCornerRadius,
      };

      // Calculate Badge Height
      const badgeHeight = config.trustBadge ? 140 : 0;

      // Setup Canvas
      canvas.width = downloadSize;
      canvas.height = downloadSize + badgeHeight;

      // Fill Background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height); // White canvas base

      ctx.fillStyle = config.backgroundColor || '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height - badgeHeight); // QR Background

      // Generate Base QR Data
      // For dynamic QRs, we use the shortUrl if available. If not, fallback to url. 
      const qrValue = (qr.isDynamic && qr.shortUrl) ? qr.shortUrl : (qr.url || 'https://tinyslash.com');

      if (!qrValue) {
        console.error("No QR content available");
        return;
      }

      const qrData = QRCode.create(qrValue, {
        errorCorrectionLevel: config.errorCorrectionLevel
      });

      const modules = qrData.modules;
      const moduleCount = modules.size;

      const frameMargin = (config.frameStyle && config.frameStyle !== 'none') ? 50 : 20;
      const cellSize = (qrSize - (frameMargin * 2)) / moduleCount;

      // Prepare fill style (solid or gradient)
      let fillStyle: string | CanvasGradient = config.foregroundColor || '#000000';
      if (config.gradientType && config.gradientType !== 'none') {
        fillStyle = createGradient(ctx, qrSize, padding, config);
      }
      ctx.fillStyle = fillStyle;
      ctx.strokeStyle = fillStyle;

      const isFinder = (r: number, c: number) => {
        if (r < 7 && c < 7) return true;
        if (r < 7 && c >= moduleCount - 7) return true;
        if (r >= moduleCount - 7 && c < 7) return true;
        return false;
      };

      // Draw Modules
      for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
          if ((modules as any).data[r * moduleCount + c]) {
            const x = padding + frameMargin + c * cellSize;
            const y = padding + frameMargin + r * cellSize;

            drawModule(ctx, x, y, cellSize, config.pattern || 'square', isFinder(r, c));
          }
        }
      }

      // Draw Frame
      if (config.frameStyle && config.frameStyle !== 'none') {
        applyFrameStyle(ctx, canvas, config, padding, qrSize);
      }

      // Draw Logo if present
      if (config.logo) {
        try {
          await addLogo(ctx, config.logo, config, padding, qrSize);
        } catch (e) {
          console.warn("Failed to load logo", e);
        }
      }

      // Draw Center Text if present
      if (config.centerText) {
        addCenterText(ctx, canvas, config, padding, qrSize);
      }

      // Draw Trust Badge if enabled
      if (config.trustBadge) {
        addTrustBadge(ctx, canvas, padding, qrSize, downloadSize, 140);
      }

    } catch (error) {
      console.error('QR generation failed:', error);
      toast.error('Failed to generate preview');
    }
  };

  const createGradient = (ctx: CanvasRenderingContext2D, size: number, padding: number, config: any) => {
    let gradient: CanvasGradient;
    const x = padding;
    const y = padding;
    const w = size;
    const h = size;

    if (config.gradientType === 'linear') {
      switch (config.gradientDirection) {
        case 'to-right': gradient = ctx.createLinearGradient(x, y, x + w, y); break;
        case 'to-bottom': gradient = ctx.createLinearGradient(x, y, x, y + h); break;
        case 'to-top-right': gradient = ctx.createLinearGradient(x, y + h, x + w, y); break;
        case 'to-bottom-right': default: gradient = ctx.createLinearGradient(x, y, x + w, y + h); break;
      }
    } else {
      gradient = ctx.createRadialGradient(
        x + w / 2, y + h / 2, 0,
        x + w / 2, y + h / 2, w / 2
      );
    }
    gradient.addColorStop(0, config.foregroundColor || '#000000');
    gradient.addColorStop(1, config.secondaryColor || config.foregroundColor || '#000000');
    return gradient;
  };

  const drawModule = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, pattern: string, isFinder: boolean) => {
    ctx.beginPath();
    switch (pattern) {
      case 'dots':
        const center = size / 2;
        const radius = (size / 2) * 0.9;
        ctx.arc(x + center, y + center, radius, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'rounded-modules':
        const roundSize = size * 0.9;
        const offset = (size - roundSize) / 2;
        if (ctx.roundRect) ctx.roundRect(x + offset, y + offset, roundSize, roundSize, size * 0.3);
        else ctx.rect(x + offset, y + offset, roundSize, roundSize);
        ctx.fill();
        break;
      case 'diamond':
        ctx.moveTo(x + size / 2, y);
        ctx.lineTo(x + size, y + size / 2);
        ctx.lineTo(x + size / 2, y + size);
        ctx.lineTo(x, y + size / 2);
        ctx.closePath();
        ctx.fill();
        break;
      case 'star':
        const cx = x + size / 2;
        const cy = y + size / 2;
        const spikes = 5;
        const outerRadius = size / 2;
        const innerRadius = size / 4;
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;

        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
          let startX = cx + Math.cos(rot) * outerRadius;
          let startY = cy + Math.sin(rot) * outerRadius;
          ctx.lineTo(startX, startY);
          rot += step;

          startX = cx + Math.cos(rot) * innerRadius;
          startY = cy + Math.sin(rot) * innerRadius;
          ctx.lineTo(startX, startY);
          rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.fill();
        break;
      case 'fluid':
        ctx.arc(x + size / 2, y + size / 2, size / 1.8, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'square':
      default:
        ctx.fillRect(x, y, Math.ceil(size), Math.ceil(size));
        break;
    }
  };

  const applyFrameStyle = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: any, padding: number, qrSize: number) => {
    const width = qrSize;
    const height = qrSize;
    ctx.save();
    ctx.translate(padding, padding);

    const color = config.frameColor || config.foregroundColor || '#000000';
    ctx.lineWidth = 16;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineJoin = 'round';

    switch (config.frameStyle) {
      case 'simple':
        ctx.strokeRect(8, 8, width - 16, height - 16);
        break;
      case 'rounded':
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(8, 8, width - 16, height - 16, 60);
        else ctx.rect(8, 8, width - 16, height - 16);
        ctx.stroke();
        break;
      case 'scan-me':
        ctx.beginPath();
        ctx.strokeRect(8, 8, width - 16, height - 16);

        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const text = config.frameText || 'SCAN ME';
        const textWidth = ctx.measureText(text).width + 60;

        const textHeight = 80;
        const bottomY = height - 8;
        ctx.clearRect((width / 2) - (textWidth / 2), bottomY - 20, textWidth, 40);

        ctx.fillText(text, width / 2, bottomY);
        break;

      case 'scan-me-black':
        ctx.strokeRect(8, 8, width - 16, height - 16);

        const barHeight = 120;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, height - barHeight, width, barHeight);

        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 70px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(config.frameText || 'SCAN ME', width / 2, height - (barHeight / 2) + 10);
        break;

      case 'modern':
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, config.secondaryColor || color);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 24;
        ctx.strokeRect(12, 12, width - 24, height - 24);
        break;

      case 'desi-mandala':
        ctx.lineWidth = 8;
        ctx.strokeStyle = color;
        const cornerSize = 100;
        ctx.beginPath(); ctx.arc(20, 20, cornerSize, 0, Math.PI / 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(width - 20, 20, cornerSize, Math.PI / 2, Math.PI); ctx.stroke();
        ctx.beginPath(); ctx.arc(width - 20, height - 20, cornerSize, Math.PI, 3 * Math.PI / 2); ctx.stroke();
        ctx.beginPath(); ctx.arc(20, height - 20, cornerSize, 3 * Math.PI / 2, 2 * Math.PI); ctx.stroke();
        ctx.strokeRect(40, 40, width - 80, height - 80);
        break;
    }
    ctx.restore();
  };

  const addTrustBadge = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, padding: number, qrSize: number, downloadSize: number, badgeHeight: number) => {
    const y = downloadSize; // Bottom of the QR area

    // We need to ensure the canvas was resized to include badge height if not already done. 
    // Wait, we set canvas height earlier?
    // Let's check config logic. If we missed setting height, we do it now.
    // In generateQR: canvas.height = downloadSize; 
    // We need to fix that too.

    // BUT since we are inside `generateQR`, we should set height correctly THERE.
    // Let's modify generateQR in next chunk to set height.
    // Here we just draw.

    ctx.fillStyle = '#059669'; // Emerald-600
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const text = "Secure By Tinyslash";
    const centerY = y + (badgeHeight / 2) - 10;
    ctx.fillText(text, downloadSize / 2, centerY);

    const textMetrics = ctx.measureText(text);
    const textWidth = textMetrics.width;
    const iconSize = 48;
    // Position icon to the left of text
    const iconX = (downloadSize / 2) - (textWidth / 2) - iconSize - 24;
    const iconY = centerY - iconSize / 2;

    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    // Shield Icon path
    ctx.moveTo(iconX + iconSize / 2, iconY + iconSize);
    ctx.bezierCurveTo(iconX, iconY + iconSize / 1.5, iconX, iconY + iconSize / 3, iconX, iconY);
    ctx.lineTo(iconX + iconSize, iconY);
    ctx.bezierCurveTo(iconX + iconSize, iconY + iconSize / 3, iconX + iconSize, iconY + iconSize / 1.5, iconX + iconSize / 2, iconY + iconSize);
    ctx.stroke();

    // Checkmark inside shield
    ctx.beginPath();
    ctx.moveTo(iconX + 12, iconY + 20);
    ctx.lineTo(iconX + 20, iconY + 32);
    ctx.lineTo(iconX + 36, iconY + 12);
    ctx.stroke();
  };

  const addLogo = async (ctx: CanvasRenderingContext2D, logoUrl: string, config: any, padding: number, qrSize: number) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const logoSizePercent = (config.logoSize || 20) / 100;
        const logoSize = qrSize * logoSizePercent;
        const x = padding + (qrSize - logoSize) / 2;
        const y = padding + (qrSize - logoSize) / 2;
        const cornerRadius = (config.logoCornerRadius || 0) * 4;

        ctx.save();
        ctx.globalAlpha = config.logoOpacity ?? 1;
        ctx.beginPath();
        if (cornerRadius > 0 && ctx.roundRect) {
          ctx.roundRect(x, y, logoSize, logoSize, cornerRadius);
        } else { ctx.rect(x, y, logoSize, logoSize); }
        ctx.clip();

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x, y, logoSize, logoSize);
        ctx.drawImage(img, x, y, logoSize, logoSize);
        ctx.restore();
        resolve();
      };
      img.onerror = () => resolve();
      img.src = logoUrl;
    });
  };

  const addCenterText = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: any, padding: number, qrSize: number) => {
    const fontSize = (config.centerTextFontSize || 16) * 4;
    const fontWeight = config.centerTextBold ? 'bold' : 'normal';

    ctx.font = `${fontWeight} ${fontSize}px ${config.centerTextFontFamily || 'Arial'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textMetrics = ctx.measureText(config.centerText!);
    const textWidth = textMetrics.width;
    const textHeight = fontSize;

    const x = canvas.width / 2;
    const y = padding + qrSize / 2;

    ctx.save();

    // Background
    const bgOpacity = config.centerTextBackgroundOpacity ?? 1;
    ctx.globalAlpha = bgOpacity;
    ctx.fillStyle = config.centerTextBackgroundColor || '#FFFFFF';

    const padX = 20 * 2;
    const padY = 10 * 2;
    const bgX = x - textWidth / 2 - padX;
    const bgY = y - textHeight / 2 - padY;
    const bgW = textWidth + (padX * 2);
    const bgH = textHeight + (padY * 2);
    const radius = (config.centerTextBackgroundRadius || 0) * 4;

    if (radius > 0 && ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(bgX, bgY, bgW, bgH, radius);
      ctx.fill();
    } else {
      ctx.fillRect(bgX, bgY, bgW, bgH);
    }

    // Text
    ctx.globalAlpha = config.centerTextOpacity ?? 1;
    ctx.fillStyle = config.centerTextColor || '#000000';
    ctx.fillText(config.centerText!, x, y);

    ctx.restore();
  };

  const downloadQR = async (format: 'png' | 'jpg' | 'svg') => {
    if (!canvasRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `qr-${qr?.title?.replace(/\s+/g, '-').toLowerCase() || 'code'}-${timestamp}`;

      if (format === 'jpg') {
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.download = `${filename}.jpg`;
      } else if (format === 'svg') {
        toast.error('SVG download requires vector generation. Downloading PNG instead.');
        link.href = canvas.toDataURL('image/png');
        link.download = `${filename}.png`;
      } else {
        link.href = canvas.toDataURL('image/png');
        link.download = `${filename}.png`;
      }
      link.click();
      toast.success(`Downloaded ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!qr) return;
    const url = (qr.isDynamic && qr.shortUrl) ? qr.shortUrl : qr.url;
    try {
      await navigator.clipboard.writeText(url);
      toast.success('URL copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  if (!isOpen || !qr) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100">
            <div className="flex items-center space-x-3 overflow-hidden">
              <div className={`p-2 rounded-lg ${qr.isDynamic ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs" title={qr.title}>
                  {qr.title}
                </h2>
                <div className="flex items-center text-xs text-gray-500 space-x-2">
                  <span className={`px-1.5 py-0.5 rounded font-medium ${qr.isDynamic ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {qr.isDynamic ? 'Dynamic' : 'Static'}
                  </span>
                  <span>•</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Scrollable */}
          <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar">

            {/* QR Display */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="bg-white p-4 rounded-xl border-2 border-gray-100 shadow-sm">
                  {/* If we have a pre-generated image from backend, valid, but we use canvas for clean high-res download generation */}
                  <canvas
                    ref={canvasRef}
                    className="w-64 h-64 object-contain rounded-lg"
                    style={{ maxWidth: '100%', maxHeight: '300px' }}
                  />
                </div>
                {/* Hover Overlay Hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <span className="bg-black/75 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-md">
                    High Resolution Preview
                  </span>
                </div>
              </div>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => downloadQR('png')}
                disabled={isDownloading}
                className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-2.5 px-4 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm shadow-blue-200"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
              </button>
              <button
                onClick={() => downloadQR('jpg')}
                disabled={isDownloading}
                className="flex items-center justify-center space-x-2 bg-white border border-gray-200 text-gray-700 py-2.5 px-4 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download JPG</span>
              </button>
            </div>

            {/* Destination URL Card */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-start justify-between space-x-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Destination</p>
                  <div className="flex items-center space-x-2 text-sm text-gray-900 font-medium truncate">
                    {qr.shortUrl ? (
                      <span className="text-blue-600">{qr.shortUrl}</span>
                    ) : (
                      <span className="truncate">{qr.url}</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate max-w-full">
                    Target: {qr.url}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Copy URL"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => window.open((qr.isDynamic && qr.shortUrl) ? qr.shortUrl : qr.url, '_blank')}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Open URL"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center text-xs text-gray-500">
            <span>{qr.customization.size || 1080}px • {qr.isDynamic ? 'Redirects via Tinyslash' : 'Direct Link'}</span>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-900 font-medium">Close</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QRPreviewModal;
