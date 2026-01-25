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

// --- New Feature Interfaces ---

export interface SmartLinkPreview {
  enabled: boolean;
  title: string;
  description: string;
  image?: string; // base64 or URL
}

export interface GeoRule {
  state: string;
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
  type: 'whatsapp' | 'email';
  redirectUrl?: string;
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
