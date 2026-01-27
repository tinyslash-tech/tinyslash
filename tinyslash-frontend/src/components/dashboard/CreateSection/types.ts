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
  logoOpacity?: number;
  logoStroke?: number;
  logoStrokeColor?: string;

  centerText?: string;
  centerTextFontSize: number;
  centerTextFontFamily: string;
  centerTextColor: string;
  centerTextBackgroundColor: string;
  centerTextBold: boolean;

  pattern: 'square' | 'dots' | 'rounded-modules' | 'diamond' | 'star' | 'fluid';
  cornerStyle: 'square';
  frameStyle: 'none' | 'simple' | 'scan-me' | 'scan-me-black' | 'branded' | 'modern' | 'classic' | 'rounded' | 'desi-mandala' | 'desi-floral' | 'desi-diya';
  frameColor?: string;
  frameText?: string;
  frameTextSize?: number;
  frameTextColor?: string;

  gradientType: 'none' | 'linear' | 'radial';
  gradientDirection: 'to-right' | 'to-bottom' | 'to-top-right' | 'to-bottom-right';
  secondaryColor: string;
  trustBadge?: boolean;
}

// --- New Feature Interfaces ---

export interface SmartLinkPreview {
  enabled: boolean;
  title: string;
  description: string;
  image?: string; // base64 or URL
}

export interface GeoRule {
  country: string;
  state: string;
  language: string;
  url: string;
}

export interface GeoConfig {
  enabled: boolean;
  rules: GeoRule[];
  defaultUrl: string;
}

export interface DeepLinkConfig {
  enabled: boolean;
  // No manual schemes needed - handled by backend "Auto-Magic"
}

export interface LeadLockConfig {
  enabled: boolean;
  leadType: 'WHATSAPP' | 'EMAIL' | 'BOTH';
  message?: string;
  otpEnabled: boolean;
  askOnce: boolean;
  autoRedirect: boolean;
  redirectUrl?: string; // Optional override
}

export interface TrustBadgeConfig {
  enabled: boolean;
  requested: boolean;
  status?: 'pending' | 'approved' | 'rejected';
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

  // New Feature Fields
  smartLinkPreview?: SmartLinkPreview;
  geoConfig?: GeoConfig;
  deepLinkConfig?: DeepLinkConfig;
  leadLockConfig?: LeadLockConfig;
  trustBadgeConfig?: TrustBadgeConfig;
}

export const DEFAULT_DOMAIN = 'tinyslash.com';
