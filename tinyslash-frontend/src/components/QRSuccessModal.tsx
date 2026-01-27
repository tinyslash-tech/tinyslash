import React, { useState, useRef, useEffect } from 'react';
import { X, Download, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import { QRCustomization } from './dashboard/CreateSection/types';

interface QRSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCanvas: HTMLCanvasElement | null;
  shortUrl: string;
  originalUrl: string;
  qrCustomization?: QRCustomization;
  onCustomize?: () => void;
  onCreateAnother?: () => void;
}

const QRSuccessModal: React.FC<QRSuccessModalProps> = ({
  isOpen,
  onClose,
  qrCanvas,
  shortUrl,
  originalUrl,
  qrCustomization,
  onCustomize,
  onCreateAnother
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate QR code when modal opens
  useEffect(() => {
    if (isOpen && originalUrl && canvasRef.current) {
      setTimeout(generateQR, 0); // Short delay to ensure ref is ready
    }
  }, [isOpen, originalUrl]);

  const generateQR = async () => {
    if (!canvasRef.current || !originalUrl) return;

    try {
      const QRCode = await import('qrcode');
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // === CONFIGURATION FOR HIGH QUALITY OUTPUT ===
      const downloadSize = 1200; // 4x standard size for clarity
      const padding = 60; // White "Card" border
      const qrSize = downloadSize - (padding * 2);

      const badgeHeight = qrCustomization?.trustBadge ? 140 : 0; // Scaled up for 1200px

      const config: any = {
        ...qrCustomization,
        size: qrSize
      };

      // Set Canvas Dimensions
      canvas.width = downloadSize;
      canvas.height = downloadSize + badgeHeight;

      // 1. Draw "Card" Background (White)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw QR Background Area (Respecting user config)
      // This is the background INSIDE the padding
      ctx.fillStyle = config.backgroundColor || '#FFFFFF';
      ctx.fillRect(padding, padding, qrSize, qrSize);

      // 3. Generate Modules
      const qrData = QRCode.create(originalUrl, {
        errorCorrectionLevel: config.errorCorrectionLevel || 'M'
      });

      const modules = qrData.modules;
      const moduleCount = modules.size;

      // Fix: Scale margin significantly for 1200px. 
      // 4px in preview (200px) ~= 24px in 1200px.
      // But we need more for frames to not touch modules. Use 40-50px.
      const frameMargin = (config.frameStyle && config.frameStyle !== 'none') ? 50 : (config.margin ? config.margin * 4 : 20);

      const cellSize = (qrSize - (frameMargin * 2)) / moduleCount;

      // 4. Prepare Foreground Style (Gradient or Solid)
      let fillStyle: string | CanvasGradient = config.foregroundColor || '#000000';
      if (config.gradientType && config.gradientType !== 'none') {
        fillStyle = createGradient(ctx, qrSize, padding, config as any);
      }
      ctx.fillStyle = fillStyle;
      ctx.strokeStyle = fillStyle;

      const isFinder = (r: number, c: number) => {
        if (r < 7 && c < 7) return true;
        if (r < 7 && c >= moduleCount - 7) return true;
        if (r >= moduleCount - 7 && c < 7) return true;
        return false;
      };

      for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
          if ((modules as any).data[r * moduleCount + c]) {
            const x = padding + frameMargin + c * cellSize;
            const y = padding + frameMargin + r * cellSize;
            drawModule(ctx, x, y, cellSize, config.pattern || 'square', isFinder(r, c));
          }
        }
      }

      if (config.frameStyle && config.frameStyle !== 'none') {
        applyFrameStyle(ctx, canvas, config, padding, qrSize);
      }

      if (config.logo && config.logo.trim()) {
        await addLogo(ctx, canvas, config, padding, qrSize);
      }

      if (config.centerText && config.centerText.trim()) {
        addCenterText(ctx, canvas, config, padding, qrSize);
      }

      if (config.trustBadge) {
        addTrustBadge(ctx, canvas, padding, qrSize, downloadSize, badgeHeight);
      }

    } catch (error) {
      console.error('QR generation failed:', error);
    }
  };

  const createGradient = (ctx: CanvasRenderingContext2D, size: number, padding: number, config: QRCustomization) => {
    // Create gradient relative to the QR area, not the whole canvas
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

  const applyFrameStyle = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: QRCustomization, padding: number, qrSize: number) => {
    // Frames are drawn relative to padding
    const width = qrSize; // It wraps the QR content
    const height = qrSize;
    ctx.save();
    ctx.translate(padding, padding);

    const color = config.frameColor || config.foregroundColor || '#000000';
    ctx.lineWidth = 16; // Robust border
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineJoin = 'round'; // Softer corners

    switch (config.frameStyle) {
      case 'simple':
        // border just inside the allocate area
        ctx.strokeRect(8, 8, width - 16, height - 16);
        break;
      case 'rounded':
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(8, 8, width - 16, height - 16, 60);
        else ctx.rect(8, 8, width - 16, height - 16);
        ctx.stroke();
        break;
      case 'scan-me':
        // Top and Sides
        ctx.beginPath();
        // Path: Start bottom-left, up, right, down to bottom-right (leave bottom open for text?) 
        // Or Top/Bottom bars? 
        // Standard Scan Me: Box with text at bottom inside or truncating line.
        // Let's do: Full box, but bottom part is text.

        ctx.strokeRect(8, 8, width - 16, height - 16);

        // Text Box at bottom center
        ctx.font = 'bold 80px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const text = config.frameText || 'SCAN ME';
        const textWidth = ctx.measureText(text).width + 60;

        // Clear line for text
        const textHeight = 80;
        const bottomY = height - 8;
        ctx.clearRect((width / 2) - (textWidth / 2), bottomY - 20, textWidth, 40);

        ctx.fillText(text, width / 2, bottomY);
        break;

      case 'scan-me-black':
        // Black block at bottom
        ctx.strokeRect(8, 8, width - 16, height - 16); // Main border

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
        // Simplistic corners for high-res
        ctx.lineWidth = 8;
        ctx.strokeStyle = color;
        const cornerSize = 100;
        // TL
        ctx.beginPath(); ctx.arc(20, 20, cornerSize, 0, Math.PI / 2); ctx.stroke();
        // TR
        ctx.beginPath(); ctx.arc(width - 20, 20, cornerSize, Math.PI / 2, Math.PI); ctx.stroke();
        // BR
        ctx.beginPath(); ctx.arc(width - 20, height - 20, cornerSize, Math.PI, 3 * Math.PI / 2); ctx.stroke();
        // BL
        ctx.beginPath(); ctx.arc(20, height - 20, cornerSize, 3 * Math.PI / 2, 2 * Math.PI); ctx.stroke();

        ctx.strokeRect(40, 40, width - 80, height - 80);
        break;
    }
    ctx.restore();
  };

  const addLogo = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, customization: QRCustomization, padding: number, qrSize: number) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      return new Promise<void>((resolve) => {
        img.onload = () => {
          const logoSizePercent = (customization.logoSize || 20) / 100;
          const logoSize = qrSize * logoSizePercent;
          const x = padding + (qrSize - logoSize) / 2;
          const y = padding + (qrSize - logoSize) / 2;
          const cornerRadius = (customization.logoCornerRadius || 0) * 4; // Scale radius

          ctx.save();
          ctx.globalAlpha = customization.logoOpacity ?? 1;
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
        img.src = customization.logo!;
      });
    } catch (e) {
      console.error(e);
    }
  };

  const addCenterText = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: QRCustomization, padding: number, qrSize: number) => {
    // Scale font size
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

    ctx.fillStyle = config.centerTextBackgroundColor || '#FFFFFF';
    ctx.fillRect(x - textWidth / 2 - 20, y - textHeight / 2 - 10, textWidth + 40, textHeight + 20);

    ctx.fillStyle = config.centerTextColor || '#000000';
    ctx.fillText(config.centerText!, x, y);
  };

  const addTrustBadge = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, padding: number, qrSize: number, downloadSize: number, badgeHeight: number) => {
    const y = downloadSize; // Start after the square part (1200px)
    // Use the extra height area

    ctx.fillStyle = '#059669'; // green-600
    ctx.font = 'bold 48px Arial'; // Scaled font
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const text = "Secure By Tinyslash";
    // Draw text in middle of badge area
    const centerY = y + (badgeHeight / 2) - 10; // offset slightly up
    ctx.fillText(text, downloadSize / 2, centerY);

    const textWidth = ctx.measureText(text).width;
    const iconSize = 48; // Scaled icon
    const iconX = (downloadSize / 2) - (textWidth / 2) - iconSize - 24;
    const iconY = centerY - iconSize / 2;

    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 6;
    ctx.beginPath();

    // Shield shape scaled
    ctx.moveTo(iconX + iconSize / 2, iconY + iconSize);
    ctx.bezierCurveTo(iconX, iconY + iconSize / 1.5, iconX, iconY + iconSize / 3, iconX, iconY);
    ctx.lineTo(iconX + iconSize, iconY);
    ctx.bezierCurveTo(iconX + iconSize, iconY + iconSize / 3, iconX + iconSize, iconY + iconSize / 1.5, iconX + iconSize / 2, iconY + iconSize);
    ctx.stroke();

    // Checkmark
    ctx.beginPath();
    ctx.moveTo(iconX + 12, iconY + 20);
    ctx.lineTo(iconX + 20, iconY + 32);
    ctx.lineTo(iconX + 36, iconY + 12);
    ctx.stroke();
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      toast.success('URL copied!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const downloadQR = async (format: 'png' | 'jpg' | 'svg') => {
    if (!canvasRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      if (format === 'jpg') {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        if (tempCtx) {
          tempCtx.fillStyle = '#FFFFFF';
          tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          tempCtx.drawImage(canvas, 0, 0);
          link.href = tempCanvas.toDataURL('image/jpeg', 0.9);
          link.download = `qr-code-${Date.now()}.jpg`;
        }
      } else if (format === 'svg') {
        // SVG export is complex with canvas custom drawing. 
        // For now, prompt usage of PNG/JPG for high quality.
        toast.error('High-quality SVG not supported with custom render yet. Using PNG.');
        link.href = canvas.toDataURL('image/png');
        link.download = `qr-code-${Date.now()}.png`;
      } else {
        link.href = canvas.toDataURL('image/png');
        link.download = `qr-code-${Date.now()}.png`;
      }
      link.click();
      toast.success(`Downloaded as ${format.toUpperCase()}!`);
    } catch (error) {
      toast.error('Download failed');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-4 sm:p-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">QR Code Ready! 🎉</h2>
              <p className="text-gray-600 text-sm">Scan or download your high-quality QR code</p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="bg-white p-3 sm:p-4 rounded-lg border-2 border-gray-200 shadow-sm overflow-hidden">
                {/* Display scaled down version of the high-res canvas */}
                <canvas
                  ref={canvasRef}
                  className="block w-full h-auto"
                  style={{
                    maxHeight: '300px',
                    maxWidth: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => downloadQR('png')}
                disabled={isDownloading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                <Download className="w-4 h-4 mr-2" />
                {isDownloading ? 'Downloading...' : 'Download High-Res PNG'}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => downloadQR('jpg')}
                  disabled={isDownloading}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Download JPG
                </button>
                <button
                  onClick={() => downloadQR('png')} // Fallback to PNG for now as SVG is hard
                  disabled={isDownloading}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Download SVG
                </button>
              </div>
            </div>

            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Copy className="w-4 h-4" />
              <span>Copy Short URL</span>
            </button>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Short URL:</div>
              <div className="text-sm font-mono text-gray-800 break-all">{shortUrl}</div>
            </div>

            {onCreateAnother && (
              <div className="text-center mt-4">
                <button
                  onClick={onCreateAnother}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  Create another QR Code →
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default QRSuccessModal;