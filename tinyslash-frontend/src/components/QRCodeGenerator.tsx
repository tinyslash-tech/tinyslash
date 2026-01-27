import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCustomization {
  foregroundColor?: string;
  backgroundColor?: string;
  size?: number;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  margin?: number;
  pattern?: 'square' | 'dots' | 'rounded-modules' | 'diamond' | 'star' | 'fluid';
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

      // 1. Create QR Data
      const qrData = QRCode.create(value, {
        errorCorrectionLevel: config.errorCorrectionLevel
      });

      const modules = qrData.modules;
      const moduleCount = modules.size;
      const frameMargin = config.frameStyle !== 'none' ? 4 : config.margin;
      const cellSize = (config.size - (frameMargin * 2)) / moduleCount;

      // Set Canvas Size
      canvas.width = config.size;
      canvas.height = config.size;

      // 2. Draw Background
      ctx.fillStyle = config.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 3. Prepare Gradient
      let fillStyle: string | CanvasGradient = config.foregroundColor;
      if (config.gradientType !== 'none') {
        fillStyle = createGradient(ctx, canvas, config);
      }
      ctx.fillStyle = fillStyle;
      ctx.strokeStyle = fillStyle;

      // 4. Draw Modules
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
            drawModule(ctx, x, y, cellSize, config.pattern, isFinder(r, c));
          }
        }
      }

      // 5. Apply Frame Style
      if (config.frameStyle !== 'none') {
        applyFrameStyle(ctx, canvas);
      }

      // 6. Add Logo
      if (config.logo && config.logo.trim()) {
        await addLogo(ctx, canvas);
      }

      // 7. Add Center Text
      if (config.centerText && config.centerText.trim()) {
        addCenterText(ctx, canvas);
      }

    } catch (error) {
      console.error('QR Code generation error:', error);
    }
  };

  const drawModule = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, pattern: string, isFinder: boolean) => {
    // Finder Patterns should be cleaner? Let's check.
    // For now we apply pattern to everything.

    ctx.beginPath();
    switch (pattern) {
      case 'dots':
        const center = size / 2;
        const radius = (size / 2) * 0.9;
        ctx.arc(x + center, y + center, radius, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'rounded-modules':
        const roundSize = size * 0.9; // gap
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

  const createGradient = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, config: Required<QRCustomization>) => {
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
    gradient.addColorStop(0, config.gradientStartColor);
    gradient.addColorStop(1, config.gradientEndColor);
    return gradient;
  };

  const applyFrameStyle = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const width = canvas.width;
    const height = canvas.height;
    const color = config.frameColor || config.foregroundColor;

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

        ctx.font = `bold 16px Arial`;
        ctx.fillStyle = isBlack ? '#FFFFFF' : color;
        ctx.textAlign = 'center';
        ctx.fillText(config.frameText || 'SCAN ME', width / 2, height - 15);
        if (!isBlack) ctx.strokeRect(5, 5, width - 10, height - 10);
        break;

      case 'desi-mandala':
        ctx.strokeStyle = color;
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
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
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

    ctx.fillStyle = config.centerTextBackgroundColor || '#FFFFFF';
    ctx.fillRect(x - textWidth / 2 - 5, y - textHeight / 2 - 2, textWidth + 10, textHeight + 4);

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