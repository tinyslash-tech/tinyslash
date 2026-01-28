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
        trustBadge: customization.trustBadge // Pass trustBadge
      };

      // Calculate Badge Height
      const badgeHeight = config.trustBadge ? 140 : 0;

      // Setup Canvas
      canvas.width = downloadSize;
      canvas.height = downloadSize + badgeHeight;

      // Fill Background
      ctx.fillStyle = config.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Generate Base QR Data
      // For dynamic QRs, we use the shortUrl if available. If not, fallback to url. 
      // Ensure we have SOME content.
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
      // Calculate cell size based on drawing area (inside padding)
      const drawingSize = qrSize;
      const cellSize = drawingSize / moduleCount;

      ctx.fillStyle = config.foregroundColor;

      // Draw Modules
      for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
          if ((modules as any).data[r * moduleCount + c]) {
            const x = padding + c * cellSize;
            const y = padding + r * cellSize;

            // Simple draw for now - can expand to support all patterns if logic is imported
            // Using standard rect for robustness unless we port the full drawer
            ctx.fillRect(x, y, Math.ceil(cellSize), Math.ceil(cellSize));
          }
        }
      }

      // Draw Logo if present
      if (config.logo) {
        try {
          await addLogo(ctx, config.logo, padding, drawingSize);
        } catch (e) {
          console.warn("Failed to load logo", e);
        }
      }

      // Draw Trust Badge if enabled
      if (config.trustBadge) {
        addTrustBadge(ctx, canvas, padding, drawingSize, downloadSize, 140);
      }

    } catch (error) {
      console.error('QR generation failed:', error);
      toast.error('Failed to generate preview');
    }
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

  const addLogo = async (ctx: CanvasRenderingContext2D, logoUrl: string, padding: number, qrSize: number) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const logoSize = qrSize * 0.2; // 20% size
        const x = padding + (qrSize - logoSize) / 2;
        const y = padding + (qrSize - logoSize) / 2;

        ctx.save();
        // Draw white background for logo
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
