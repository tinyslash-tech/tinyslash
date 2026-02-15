import React, { useState, useRef, useEffect } from 'react';
import { X, Download, Copy, ExternalLink, Share2 } from 'lucide-react';
import { WhatsAppIcon, TelegramIcon, FacebookIcon, XIcon, LinkedInIcon, RedditIcon, EmailIcon } from '../../SocialIcons';
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
  const [showFormats, setShowFormats] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
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
      // Always use shortUrl if available (so QR code points to the tracking short link).
      // Falls back to the original url only if no shortUrl exists.
      const qrValue = qr.shortUrl || qr.url || 'https://tinyslash.com';

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

  const shareToSocial = (platform: string) => {
    if (!qr) return;
    const url = (qr.isDynamic && qr.shortUrl) ? qr.shortUrl : qr.url;
    const text = `Check out this QR Code: ${url}`;
    let shareUrl = '';

    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
        break;
      case 'reddit':
        shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent('Check out this QR Code')}&body=${encodeURIComponent(text)}`;
        break;
    }

    if (shareUrl) window.open(shareUrl, '_blank');
  };

  if (!isOpen || !qr) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden flex flex-col max-h-[90vh]"
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {/* Header — Scan to test dot */}
          <div className="px-6 pt-5 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <h2 className="text-base font-semibold text-gray-900">Scan to test</h2>
              <span className="px-1.5 py-0.5 rounded bg-black text-white text-[10px] font-medium uppercase">
                {qr.isDynamic ? 'Dynamic' : 'Static'}
              </span>
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content Scrollable */}
          <div className="px-6 pb-4 overflow-y-auto custom-scrollbar">

            {/* QR Preview + Title */}
            <div className="mb-3">
              <div className="flex justify-center">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <canvas
                    ref={canvasRef}
                    className="block rounded"
                    style={{
                      width: '200px',
                      height: '200px',
                      objectFit: 'contain'
                    }}
                  />
                </div>
              </div>
              <p className="text-center text-base font-semibold text-gray-900 mt-3" title={qr.title}>{qr.title}</p>
            </div>

            {/* SHORT URL */}
            <div className="mb-2.5">
              <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5 block">Short URL</label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="flex-1 text-sm font-mono text-gray-800 truncate">{qr.shortUrl || '-'}</span>
                {qr.shortUrl && (
                  <button
                    onClick={copyToClipboard}
                    className="flex-shrink-0 p-1.5 text-gray-400 hover:text-black hover:bg-gray-200 rounded-md transition-colors"
                    title="Copy"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* DESTINATION */}
            <div className="mb-4">
              <label className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold mb-1.5 block">Destination</label>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="flex-1 text-sm text-gray-600 truncate">{qr.url}</span>
                <button
                  onClick={() => window.open((qr.isDynamic && qr.shortUrl) ? qr.shortUrl : qr.url, '_blank')}
                  className="flex-shrink-0 p-1.5 text-gray-400 hover:text-black hover:bg-gray-200 rounded-md transition-colors"
                  title="Open"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Download Button + Format Cards */}
            <div className="mb-3">
              <button
                onClick={() => setShowFormats(!showFormats)}
                disabled={isDownloading}
                className="w-full bg-black text-white py-3 px-4 rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Downloading...' : (showFormats ? 'Hide Options' : 'Download QR Code')}
              </button>

              <AnimatePresence>
                {showFormats && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-3 gap-2 mt-2.5 overflow-hidden"
                  >
                    {[
                      { format: 'png' as const, label: 'PNG', desc: 'Best for web' },
                      { format: 'svg' as const, label: 'SVG', desc: 'Best for print' },
                      { format: 'jpg' as const, label: 'JPG', desc: 'Universal' },
                    ].map(({ format, label, desc }) => (
                      <button
                        key={format}
                        onClick={() => downloadQR(format)}
                        disabled={isDownloading}
                        className="flex flex-col items-center py-2.5 px-2 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-100 transition-all text-center disabled:opacity-50"
                      >
                        <span className="text-sm font-semibold text-gray-900">{label}</span>
                        <span className="text-[10px] text-gray-400">{desc}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Social Share Button & Grid */}
            <div className="mb-1">
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 border rounded-xl text-sm font-medium transition-colors mb-2 ${showShareOptions ? 'bg-gray-100 border-gray-300 text-black' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
              >
                <Share2 className="w-4 h-4" />
                {showShareOptions ? 'Close Share Options' : 'Share QR Code'}
              </button>

              <AnimatePresence>
                {showShareOptions && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center justify-center gap-4 overflow-hidden py-2"
                  >
                    {[
                      { name: 'whatsapp', icon: <WhatsAppIcon className="w-9 h-9" />, bg: '#25D366' },
                      { name: 'telegram', icon: <TelegramIcon className="w-9 h-9" />, bg: '#0088CC' },
                      { name: 'facebook', icon: <FacebookIcon className="w-9 h-9" />, bg: '#1877F2' },
                      { name: 'twitter', icon: <XIcon className="w-9 h-9" />, bg: '#000000' },
                      { name: 'linkedin', icon: <LinkedInIcon className="w-9 h-9" />, bg: '#0A66C2' },
                      { name: 'reddit', icon: <RedditIcon className="w-9 h-9" />, bg: '#FF4500' },
                      { name: 'email', icon: <EmailIcon className="w-9 h-9" />, bg: '#EA4335' }
                    ].map((social) => (
                      <button
                        key={social.name}
                        onClick={() => shareToSocial(social.name)}
                        className="flex items-center justify-center transition-transform hover:scale-110"
                        style={{ color: social.bg }}
                        title={`Share on ${social.name.charAt(0).toUpperCase() + social.name.slice(1)}`}
                      >
                        {social.icon}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QRPreviewModal;
