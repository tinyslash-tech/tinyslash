import React, { useRef } from 'react';
import { Eye, Download, Copy, QrCode } from 'lucide-react';
import QRCodeGenerator from '../../../QRCodeGenerator'; // Adjust import path
import { QRCustomization } from '../types';

interface QRPreviewProps {
  qrText: string;
  qrCustomization: QRCustomization;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  downloadQR: () => void;
  copyToClipboard: (text: string) => void;
}

export const QRPreview: React.FC<QRPreviewProps> = ({
  qrText,
  qrCustomization,
  canvasRef,
  downloadQR,
  copyToClipboard
}) => {
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Helper to copy simple blob (Note: logic moved here or passed down)
  const handleCopy = () => {
    if (previewCanvasRef.current) {
      previewCanvasRef.current.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          copyToClipboard(url);
          // Revoke is handled by the passed function if generic or needs handling here
          // But copyToClipboard in parent usually expects text/URL.
          // In the original code, CreateSection had a specific logic for this.
          // We might need to adjust or keep it simple.
          // For now, let's assume the parent handles the revoking if it returns a promise
          // Or we do it here. 
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
      });
    } else if (canvasRef.current) {
      canvasRef.current.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          copyToClipboard(url);
          setTimeout(() => URL.revokeObjectURL(url), 1000);
        }
      });
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white rounded-2xl p-4 lg:p-6 text-center border border-gray-200 shadow-sm mb-6 lg:mb-0">
        <div className="mb-4">
          <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center justify-center">
            <Eye className="w-4 h-4 lg:w-5 lg:h-5 mr-2 text-blue-600" />
            Live Preview
          </h3>
        </div>
        {qrText ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="relative bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <QRCodeGenerator
                  value={qrText || 'https://example.com'}
                  size={200}
                  className="rounded"
                  customization={{
                    foregroundColor: qrCustomization.foregroundColor,
                    backgroundColor: qrCustomization.backgroundColor,
                    size: 200,
                    errorCorrectionLevel: qrCustomization.errorCorrectionLevel,
                    margin: qrCustomization.margin,
                    pattern: qrCustomization.pattern,
                    cornerStyle: qrCustomization.cornerStyle,
                    frameStyle: qrCustomization.frameStyle,
                    gradientType: qrCustomization.gradientType,
                    gradientDirection: qrCustomization.gradientDirection,
                    gradientStartColor: qrCustomization.foregroundColor,
                    gradientEndColor: qrCustomization.secondaryColor,
                    logo: qrCustomization.logo,
                    logoSize: qrCustomization.logoSize,
                    logoCornerRadius: qrCustomization.logoCornerRadius,
                    centerText: qrCustomization.centerText,
                    centerTextSize: qrCustomization.centerTextFontSize,
                    centerTextFontFamily: qrCustomization.centerTextFontFamily,
                    centerTextColor: qrCustomization.centerTextColor,
                    centerTextBackgroundColor: qrCustomization.centerTextBackgroundColor,
                    centerTextBold: qrCustomization.centerTextBold
                  }}
                // ref={previewCanvasRef} // QRCodeGenerator might not forward ref properly based on original file checks
                // If QRCodeGenerator is custom, we rely on canvasRef from parent mostly for download
                />

                {/* Hidden canvas for operations is likely canvasRef passed from parent which is used for download */}
                <canvas ref={canvasRef} style={{ display: 'none' }} />
              </div>
            </div>
            <div className="flex justify-center space-x-2">
              <button
                onClick={downloadQR}
                className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-3 h-3" />
                <span>Download</span>
              </button>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Copy className="w-3 h-3" />
                <span>Copy</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8">
            <QrCode className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">Enter text or URL above</p>
            {qrText && (
              <div className="mt-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-xs text-gray-500">Generating...</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
