import * as QRCode from 'qrcode';
import { QRCustomization } from '../types';

// Pure function to generate cache key
export const getQRCacheKey = (text: string, customization: QRCustomization): string => {
  return `${text}-${customization.size}-${customization.margin}-${customization.errorCorrectionLevel}`;
};

// Fast gradient application
export const applyGradient = (ctx: CanvasRenderingContext2D, customization: QRCustomization) => {
  const size = customization.size;
  let gradient;

  if (customization.gradientType === 'linear') {
    gradient = ctx.createLinearGradient(0, 0,
      customization.gradientDirection.includes('right') ? size : 0,
      customization.gradientDirection.includes('bottom') ? size : 0
    );
  } else {
    gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  }

  gradient.addColorStop(0, customization.foregroundColor);
  gradient.addColorStop(1, customization.secondaryColor);

  ctx.globalCompositeOperation = 'source-atop';
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  ctx.globalCompositeOperation = 'source-over';
};

// Fast center text application
export const applyCenterText = (ctx: CanvasRenderingContext2D, customization: QRCustomization) => {
  if (!customization.centerText) return;

  const fontSize = Math.min(customization.centerTextFontSize, 20);
  const fontWeight = customization.centerTextBold ? 'bold' : 'normal';

  ctx.font = `${fontWeight} ${fontSize}px system-ui, Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const centerX = customization.size / 2;
  const centerY = customization.size / 2;

  const textWidth = ctx.measureText(customization.centerText).width;
  const padding = 6;

  ctx.fillStyle = customization.centerTextBackgroundColor;
  ctx.fillRect(
    centerX - textWidth / 2 - padding,
    centerY - fontSize / 2 - 3,
    textWidth + padding * 2,
    fontSize + 6
  );

  ctx.fillStyle = customization.centerTextColor;
  ctx.fillText(customization.centerText, centerX, centerY);
};

// Fast logo application
export const applyLogo = (ctx: CanvasRenderingContext2D, customization: QRCustomization): void => {
  if (!customization.logo) return;

  const img = new Image();
  img.onload = () => {
    const canvasWidth = ctx.canvas.width;
    const logoSize = canvasWidth * 0.15;
    const x = (canvasWidth - logoSize) / 2;
    const y = (canvasWidth - logoSize) / 2;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x - 4, y - 4, logoSize + 8, logoSize + 8);
    ctx.drawImage(img, x, y, logoSize, logoSize);
  };
  img.onerror = () => {
    console.error('Failed to load QR logo image');
  };
  img.src = customization.logo;
};

// Main render function
export const renderQRCodeToCanvas = async (
  canvas: HTMLCanvasElement,
  text: string,
  customization: QRCustomization
): Promise<void> => {
  await QRCode.toCanvas(canvas, text, {
    width: customization.size,
    margin: customization.margin,
    color: {
      dark: customization.foregroundColor,
      light: customization.backgroundColor
    },
    errorCorrectionLevel: customization.errorCorrectionLevel
  });
};
