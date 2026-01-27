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
      generateQR();
    }
  }, [isOpen, originalUrl]);

  const generateQR = async () => {
    if (!canvasRef.current || !originalUrl) return;

    try {
      const QRCode = await import('qrcode');
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const qrWidth = qrCustomization?.size || 300;
      const badgeHeight = qrCustomization?.trustBadge ? 40 : 0;

      const qrData = QRCode.create(originalUrl, {
        errorCorrectionLevel: qrCustomization?.errorCorrectionLevel || 'M'
      });

      const modules = qrData.modules;
      const moduleCount = modules.size;
      const frameMargin = (qrCustomization?.frameStyle && qrCustomization?.frameStyle !== 'none') ? 4 : (qrCustomization?.margin || 4);
      const cellSize = (qrWidth - (frameMargin * 2)) / moduleCount;

      canvas.width = qrWidth;
      canvas.height = qrWidth + badgeHeight;

      ctx.fillStyle = qrCustomization?.backgroundColor || '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let fillStyle: string | CanvasGradient = qrCustomization?.foregroundColor || '#000000';
      if (qrCustomization?.gradientType && qrCustomization.gradientType !== 'none') {
        fillStyle = createGradient(ctx, canvas, qrCustomization);
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
            const x = frameMargin + c * cellSize;
            const y = frameMargin + r * cellSize;
            drawModule(ctx, x, y, cellSize, qrCustomization?.pattern || 'square', isFinder(r, c));
          }
        }
      }

      if (qrCustomization?.frameStyle && qrCustomization.frameStyle !== 'none') {
        applyFrameStyle(ctx, canvas, qrCustomization);
      }

      if (qrCustomization?.logo && qrCustomization.logo.trim()) {
        await addLogo(ctx, canvas, qrCustomization);
      }

      if (qrCustomization?.centerText && qrCustomization.centerText.trim()) {
        addCenterText(ctx, canvas, qrCustomization);
      }

      if (qrCustomization?.trustBadge) {
        addTrustBadge(ctx, canvas);
      }

    } catch (error) {
      console.error('QR generation failed:', error);
    }
  };

  const createGradient = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: QRCustomization) => {
    let gradient: CanvasGradient;
    if (config.gradientType === 'linear') {
      switch (config.gradientDirection) {
        case 'to-right': gradient = ctx.createLinearGradient(0, 0, canvas.width, 0); break;
        case 'to-bottom': gradient = ctx.createLinearGradient(0, 0, 0, canvas.height); break;
        case 'to-top-right': gradient = ctx.createLinearGradient(0, canvas.height, canvas.width, 0); break;
        case 'to-bottom-right': default: gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height); break;
      }
    } else {
      gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2
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

  const applyFrameStyle = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, customization: QRCustomization) => {
    const frameStyle = customization.frameStyle;
    const foregroundColor = customization.foregroundColor || '#000000';
    const backgroundColor = customization.backgroundColor || '#FFFFFF';

    // Default Frame Logic
    const width = canvas.width;
    const height = customization.size || width; // Should be just QR height, not canvas.height (which includes badge)

    ctx.lineWidth = 4;
    ctx.strokeStyle = foregroundColor;
    ctx.fillStyle = foregroundColor;

    switch (frameStyle) {
      case 'simple':
        ctx.strokeRect(5, 5, width - 10, height - 10);
        break;
      case 'scan-me':
        ctx.fillStyle = foregroundColor;
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SCAN ME', width / 2, height - 8);
        break;
      case 'scan-me-black':
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, height - 25, width, 25);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SCAN ME', width / 2, height - 8);
        break;
      case 'branded':
        ctx.strokeStyle = foregroundColor;
        ctx.lineWidth = 4;
        ctx.strokeRect(2, 2, width - 4, height - 4);
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, 30);
        ctx.fillStyle = foregroundColor;
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('QR CODE', width / 2, 20);
        break;
      case 'modern':
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, foregroundColor);
        gradient.addColorStop(1, backgroundColor);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 6;
        ctx.strokeRect(3, 3, width - 6, height - 6);
        break;
      case 'classic':
        ctx.strokeStyle = foregroundColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(8, 8, width - 16, height - 16);
        const cornerSize = 15;
        // Simple corners
        ctx.fillRect(0, 0, cornerSize, 3);
        ctx.fillRect(0, 0, 3, cornerSize);
        ctx.fillRect(width - cornerSize, 0, cornerSize, 3);
        ctx.fillRect(width - 3, 0, 3, cornerSize);
        ctx.fillRect(0, height - 3, cornerSize, 3);
        ctx.fillRect(0, height - cornerSize, 3, cornerSize);
        ctx.fillRect(width - cornerSize, height - 3, cornerSize, 3);
        ctx.fillRect(width - 3, height - cornerSize, 3, cornerSize);
        break;
      case 'rounded':
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(5, 5, width - 10, height - 10, 15);
        else ctx.rect(5, 5, width - 10, height - 10);
        ctx.stroke();
        break;
      case 'desi-mandala':
        ctx.lineWidth = 2;
        const drawMandalaCorner = (x: number, y: number, rotation: number) => {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(rotation * Math.PI / 180);
          ctx.beginPath();
          ctx.arc(0, 0, 30, 0, Math.PI / 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(15, 15, 10, 5, Math.PI / 4, 0, 2 * Math.PI);
          ctx.stroke();
          ctx.restore();
        };
        drawMandalaCorner(5, 5, 0);
        drawMandalaCorner(width - 5, 5, 90);
        drawMandalaCorner(width - 5, height - 5, 180);
        drawMandalaCorner(5, height - 5, 270);
        ctx.strokeRect(15, 15, width - 30, height - 30);
        break;
      case 'desi-floral':
        ctx.lineWidth = 3;
        ctx.strokeRect(10, 10, width - 20, height - 20);
        const spacing = 20;
        for (let i = 10; i < width - 10; i += spacing) {
          ctx.beginPath(); ctx.arc(i, 10, 2, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(i, height - 10, 2, 0, Math.PI * 2); ctx.fill();
        }
        for (let i = 10; i < height - 10; i += spacing) {
          ctx.beginPath(); ctx.arc(10, i, 2, 0, Math.PI * 2); ctx.fill();
          ctx.beginPath(); ctx.arc(width - 10, i, 2, 0, Math.PI * 2); ctx.fill();
        }
        break;
    }
  };

  const addLogo = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, customization: QRCustomization) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      return new Promise<void>((resolve) => {
        img.onload = () => {
          const logoSizePercent = (customization.logoSize || 20) / 100;
          const qrSize = customization.size || canvas.width;
          const logoSize = qrSize * logoSizePercent;
          const x = (canvas.width - logoSize) / 2;
          const y = (qrSize - logoSize) / 2;
          const cornerRadius = customization.logoCornerRadius || 0;

          ctx.save();
          ctx.globalAlpha = customization.logoOpacity ?? 1;

          ctx.beginPath();
          if (cornerRadius > 0 && ctx.roundRect) {
            ctx.roundRect(x, y, logoSize, logoSize, cornerRadius);
          } else {
            ctx.rect(x, y, logoSize, logoSize);
          }
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
    } catch (error) {
      console.error('Error adding logo:', error);
    }
  };

  const addCenterText = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, customization: QRCustomization) => {
    const fontSize = customization.centerTextFontSize || 16;
    const fontWeight = customization.centerTextBold ? 'bold' : 'normal';

    ctx.font = `${fontWeight} ${fontSize}px ${customization.centerTextFontFamily || 'Arial'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textMetrics = ctx.measureText(customization.centerText!);
    const textWidth = textMetrics.width;
    const textHeight = fontSize;

    const x = canvas.width / 2;
    const y = (customization.size || canvas.width) / 2;

    ctx.fillStyle = customization.centerTextBackgroundColor || '#FFFFFF';
    ctx.fillRect(x - textWidth / 2 - 5, y - textHeight / 2 - 2, textWidth + 10, textHeight + 4);

    ctx.fillStyle = customization.centerTextColor || '#000000';
    ctx.fillText(customization.centerText!, x, y);
  };

  const addTrustBadge = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width;
    const height = canvas.height;
    const badgeHeight = 40;
    const y = height - badgeHeight;

    ctx.fillStyle = '#059669'; // green-600
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const text = "Secure By Tinyslash";
    ctx.fillText(text, width / 2, y + badgeHeight / 2);

    const textWidth = ctx.measureText(text).width;
    const iconSize = 12;
    const iconX = (width / 2) - (textWidth / 2) - iconSize - 6;
    const iconY = y + badgeHeight / 2 - iconSize / 2;

    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 1.5;
    ctx.beginPath();

    // Shield shape
    ctx.moveTo(iconX + iconSize / 2, iconY + iconSize);
    ctx.bezierCurveTo(iconX, iconY + iconSize / 1.5, iconX, iconY + iconSize / 3, iconX, iconY);
    ctx.lineTo(iconX + iconSize, iconY);
    ctx.bezierCurveTo(iconX + iconSize, iconY + iconSize / 3, iconX + iconSize, iconY + iconSize / 1.5, iconX + iconSize / 2, iconY + iconSize);
    ctx.stroke();

    // Checkmark
    ctx.beginPath();
    ctx.moveTo(iconX + 3, iconY + 5);
    ctx.lineTo(iconX + 5, iconY + 8);
    ctx.lineTo(iconX + 9, iconY + 3);
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
        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
          <rect width="300" height="300" fill="white"/>
          <text x="150" y="150" text-anchor="middle" font-size="16" fill="black">QR Code SVG</text>
        </svg>`;
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `qr-code-${Date.now()}.svg`;
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
              <p className="text-gray-600 text-sm">Scan or download your QR code</p>
            </div>

            <div className="flex justify-center mb-6">
              <div className="bg-white p-3 sm:p-4 rounded-lg border-2 border-gray-200 shadow-sm">
                <canvas
                  ref={canvasRef}
                  className="block w-full h-auto max-w-[250px] max-h-[250px]"
                  style={{
                    width: 'min(250px, calc(100vw - 120px))',
                    height: 'min(250px, calc(100vw - 120px))'
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
                {isDownloading ? 'Downloading...' : 'Download PNG'}
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
                  onClick={() => downloadQR('svg')}
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