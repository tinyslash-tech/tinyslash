export type CreateMode = 'url' | 'qr' | 'file';

export interface QRCustomization {
  foregroundColor: string;
  backgroundColor: string;
  size: number;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  margin: number;
  logo?: string;
  logoSize?: number;
  logoCornerRadius?: number;
  centerText?: string;
  centerTextFontSize: number;
  centerTextFontFamily: string;
  centerTextColor: string;
  centerTextBackgroundColor: string;
  centerTextBold: boolean;
  pattern: 'square';
  cornerStyle: 'square';
  frameStyle: 'none' | 'simple' | 'scan-me' | 'scan-me-black' | 'branded' | 'modern' | 'classic' | 'rounded';
  gradientType: 'none' | 'linear' | 'radial';
  gradientDirection: 'to-right' | 'to-bottom' | 'to-top-right' | 'to-bottom-right';
  secondaryColor: string;
}

export interface ShortenedLink {
  id: string;
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  qrCode?: string;
  clicks: number;
  createdAt: string;
  customDomain?: string;
  type: 'url' | 'qr' | 'file';
  qrCustomization?: QRCustomization;
}

export const DEFAULT_DOMAIN = 'tinyslash.com';
