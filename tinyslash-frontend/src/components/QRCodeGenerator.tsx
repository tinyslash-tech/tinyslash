import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCustomization {
  foregroundColor?: string;
  backgroundColor?: string;
  size?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
  pattern?: 'square';
  cornerStyle?: 'square';
  frameStyle?: 'none' | 'simple' | 'scan-me' | 'scan-me-black' | 'branded' | 'modern' | 'classic' | 'rounded' | 'desi-mandala' | 'desi-floral' | 'desi-diya';
  frameColor?: string;
  frameText?: string;
  frameTextSize?: number;
  frameTextColor?: string;
  gradientType?: 'none' | 'linear' | 'radial';
  gradientDirection?: 'to-right' | 'to-bottom' | 'to-top-right' | 'to-bottom-right';
  gradientStartColor?: string;
  gradientEndColor?: string;
  logo?: string;
  logoSize?: number;
  logoCornerRadius?: number;
  logoOpacity?: number;
  logoStroke?: number;
  logoStrokeColor?: string;
  centerText?: string;
  centerTextSize?: number;
  centerTextFontFamily?: string;
  centerTextColor?: string;
  centerTextBackgroundColor?: string;
  centerTextBold?: boolean;
}

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  className?: string;
  customization?: QRCustomization;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  size = 200,
  className = '',
  customization = {}
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Default customization values
  const defaultCustomization: Required<QRCustomization> = {
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    size: size,
    errorCorrectionLevel: 'M',
    margin: 2,
    pattern: 'square',
    cornerStyle: 'square',
    frameStyle: 'none',
    frameColor: '#000000',
    frameText: 'SCAN ME',
    frameTextSize: 14,
    frameTextColor: '#FFFFFF',
    gradientType: 'none',
    gradientDirection: 'to-right',
    gradientStartColor: '#000000',
    gradientEndColor: '#333333',
    logo: '',
    logoSize: 20,
    logoCornerRadius: 0,
    logoOpacity: 1,
    logoStroke: 0,
    logoStrokeColor: '#FFFFFF',
    centerText: '',
    centerTextSize: 16,
    centerTextFontFamily: 'Arial',
    centerTextColor: '#000000',
    centerTextBackgroundColor: '#FFFFFF',
    centerTextBold: true
  };

  const config = { ...defaultCustomization, ...customization };

  useEffect(() => {
    if (canvasRef.current && value) {
      generateCustomQRCode();
    }
  }, [value, size, customization]);

  const generateCustomQRCode = async () => {
    if (!canvasRef.current || !value) return;

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Ensure margin for frames
      const frameMargin = config.frameStyle !== 'none' ? 4 : config.margin;

      // Generate basic QR code first
      await QRCode.toCanvas(canvas, value, {
        width: config.size,
        margin: frameMargin,
        color: {
          dark: config.foregroundColor,
          light: config.backgroundColor
        },
        errorCorrectionLevel: config.errorCorrectionLevel
      });

      // Apply advanced customizations
      await applyCustomizations(ctx, canvas);

    } catch (error) {
      console.error('QR Code generation error:', error);
    }
  };

  const applyCustomizations = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Apply gradient if specified
    if (config.gradientType !== 'none') {
      applyGradient(ctx, canvas);
    }

    // Apply frame style
    if (config.frameStyle !== 'none') {
      applyFrameStyle(ctx, canvas);
    }

    // Add logo if specified
    if (config.logo && config.logo.trim()) {
      await addLogo(ctx, canvas);
    }

    // Add center text if specified
    if (config.centerText && config.centerText.trim()) {
      addCenterText(ctx, canvas);
    }
  };

  const applyGradient = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let gradient: CanvasGradient;

    if (config.gradientType === 'linear') {
      switch (config.gradientDirection) {
        case 'to-right':
          gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
          break;
        case 'to-bottom':
          gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
          break;
        case 'to-top-right':
          gradient = ctx.createLinearGradient(0, canvas.height, canvas.width, 0);
          break;
        case 'to-bottom-right':
        default:
          gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          break;
      }
    } else {
      gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 2
      );
    }

    gradient.addColorStop(0, config.gradientStartColor);
    gradient.addColorStop(1, config.gradientEndColor);

    // Apply gradient to dark pixels only
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'source-over';
  };

  const applyFrameStyle = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width;
    const height = canvas.height;
    const color = config.frameColor || config.foregroundColor;
    const padding = 10;

    ctx.lineWidth = 4;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    switch (config.frameStyle) {
      case 'simple':
        ctx.strokeRect(5, 5, width - 10, height - 10);
        break;

      case 'rounded':
        ctx.beginPath();
        if (ctx.roundRect) ctx.roundRect(5, 5, width - 10, height - 10, 20);
        else ctx.rect(5, 5, width - 10, height - 10);
        ctx.stroke();
        break;

      case 'scan-me':
      case 'scan-me-black':
        const isBlack = config.frameStyle === 'scan-me-black';
        if (isBlack) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, height - 40, width, 40);
        } else {
          ctx.fillStyle = color;
        }

        // Text
        ctx.font = `bold 16px Arial`;
        ctx.fillStyle = isBlack ? '#FFFFFF' : color;
        ctx.textAlign = 'center';
        ctx.fillText(config.frameText || 'SCAN ME', width / 2, height - 15);
        if (!isBlack) ctx.strokeRect(5, 5, width - 10, height - 10);
        break;

      case 'desi-mandala':
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        // Draw corners
        const drawMandalaCorner = (x: number, y: number, rotation: number) => {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(rotation * Math.PI / 180);
          ctx.beginPath();
          ctx.arc(0, 0, 30, 0, Math.PI / 2);
          ctx.stroke();
          // Floral petals
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
        ctx.fillStyle = color; // For dots
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;

        // Simple border
        ctx.strokeRect(10, 10, width - 20, height - 20);

        // Dots pattern on border
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

  const addLogo = async (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      return new Promise<void>((resolve) => {
        img.onload = () => {
          const logoSizePercent = (config.logoSize || 20) / 100;
          const logoSize = Math.min(canvas.width, canvas.height) * logoSizePercent;
          const x = (canvas.width - logoSize) / 2;
          const y = (canvas.height - logoSize) / 2;
          const cornerRadius = config.logoCornerRadius || 0;

          ctx.save();
          ctx.globalAlpha = config.logoOpacity ?? 1;

          // Create clipping path for logo with corner radius
          ctx.beginPath();
          if (cornerRadius > 0 && ctx.roundRect) {
            ctx.roundRect(x, y, logoSize, logoSize, cornerRadius);
          } else {
            ctx.rect(x, y, logoSize, logoSize);
          }

          ctx.clip();

          // Background behind logo
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(x, y, logoSize, logoSize);

          // Draw the logo image
          ctx.drawImage(img, x, y, logoSize, logoSize);

          // Stroke
          // if (config.logoStroke && config.logoStroke > 0) {
          //   ctx.lineWidth = config.logoStroke;
          //   ctx.strokeStyle = config.logoStrokeColor || '#FFFFFF';
          //   ctx.stroke();
          // }

          ctx.restore();
          resolve();
        };

        img.onerror = () => resolve();
        img.src = config.logo!;
      });
    } catch (error) {
      console.error('Error adding logo:', error);
    }
  };

  const addCenterText = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const fontSize = config.centerTextSize;
    const fontWeight = config.centerTextBold ? 'bold' : 'normal';

    ctx.font = `${fontWeight} ${fontSize}px ${config.centerTextFontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textMetrics = ctx.measureText(config.centerText || '');
    const textWidth = textMetrics.width;
    const textHeight = fontSize || 16;

    const x = canvas.width / 2;
    const y = canvas.height / 2;

    // Add background for text
    ctx.fillStyle = config.centerTextBackgroundColor || '#FFFFFF';
    ctx.fillRect(x - textWidth / 2 - 5, y - textHeight / 2 - 2, textWidth + 10, textHeight + 4);

    // Add text
    ctx.fillStyle = config.centerTextColor || '#000000';
    ctx.fillText(config.centerText || '', x, y);
  };

  if (!value) return null;

  return (
    <div className={`inline-block ${className}`}>
      <canvas ref={canvasRef} className="border border-gray-200 rounded-lg" />
    </div>
  );
};

export default QRCodeGenerator;