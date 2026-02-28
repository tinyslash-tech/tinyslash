export type BlockType = 'LINK' | 'HEADER' | 'IMAGE' | 'SOCIAL' | 'TEXT' | 'VIDEO' | 'FORM' | 'EMAIL' | 'DIVIDER' | 'PAYMENT' | 'AFFILIATE' | 'CARD' | 'COUNTDOWN' | 'VOICE' | 'WA_CATALOG' | 'UPI_PAY' | 'DIGITAL_PRODUCT' | 'REVIEW_CAROUSEL' | 'STORY_HIGHLIGHT' | 'NATIVE_BOOKING' | 'COMMUNITY_JOIN' | 'MAPS_HUB' | 'MONETIZATION';

export interface PageBlock {
  id: string;
  type: BlockType;
  content: Record<string, any>;
  visible: boolean;
  order: number;
}

export interface PageTheme {
  // Background
  backgroundType: 'SOLID' | 'GRADIENT' | 'IMAGE';
  background: string; // Hex or Image URL
  gradientStart?: string;
  gradientEnd?: string;
  gradientDirection?: string; // "to right", "to bottom", etc.

  // Banner
  bannerType?: 'NONE' | 'GRADIENT' | 'IMAGE';
  bannerImage?: string;
  bannerGradientStart?: string;
  bannerGradientEnd?: string;
  bannerHeight?: number; // Height in px (e.g., 150-300)

  // Buttons
  buttonShape: 'ROUNDED' | 'PILL' | 'SHARP';
  buttonStyle: 'FILLED' | 'OUTLINE' | 'SOFT';
  buttonShadow: 'NONE' | 'SUBTLE' | 'STRONG' | 'GLOW';
  buttonColor: string;
  buttonTextColor: string;
  buttonFont?: string; // Specific font for buttons
  buttonSize?: 'SM' | 'MD' | 'LG' | number; // Scale factor or padding
  buttonTextSize?: number; // Custom text size in px

  // Typography
  font: string;
  fontSize?: 'SM' | 'MD' | 'LG' | number; // Can be enum or px value
  fontWeight?: 'NORMAL' | 'SEMIBOLD' | 'BOLD';
  textColor: string;

  // Social Icons
  socialStyle: 'FILLED' | 'OUTLINE' | 'MONOCHROME';
  socialIconSize?: 'SM' | 'MD' | 'LG' | number; // Can be enum or px value
  socialIconSpacing?: number; // Gap in px
  socialIconColor?: string; // Used for custom color or monochrome override
  socialBackgroundColor?: string;

  // Profile
  profileImageStyle: 'CIRCLE' | 'ROUNDED' | 'SQUARE';
  profileImageSize: 'SM' | 'MD' | 'LG' | number;
  nameSize: 'SM' | 'MD' | 'LG';

  // Advanced
  pageMaxWidth: number; // 480 - 960
  contentSpacing: 'COMPACT' | 'NORMAL' | 'RELAXED';
  marginTop?: number;
  marginX?: number;

  // Branding
  showBranding: boolean;

  // Block Containers
  blockBackgroundColor?: string; // e.g. '#ffffff', 'rgba(255,255,255,0.7)', or 'transparent'
  blockBorderColor?: string;
  blockShadow?: 'NONE' | 'SM' | 'MD' | 'LG' | 'GLOW';
  blockCornerRadius?: 'SHARP' | 'ROUNDED' | 'PILL' | 'XL';
}

export interface Page {
  id: string;
  userId: string;
  slug: string;
  title: string;
  bio: string;
  avatarUrl?: string;
  theme: PageTheme;
  blocks: PageBlock[];
  verified?: boolean;
  published: boolean;
  views: number;
  uniqueVisitors?: number; // Added for analytics

  customDomain?: string;
  removeBranding?: boolean;

  // WhatsApp Integration
  waNumber?: string;
  waDefaultMessage?: string;
  waSmartTemplate?: string;
  waDisplayType?: 'FLOATING' | 'BUTTON' | 'BOTH';

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  socialImage?: string; // OG Image

  // Integrations
  fbPixelId?: string;
  googleAnalyticsId?: string;
  customScripts?: string; // Head scripts

  createdAt?: string;
  updatedAt?: string;
}
