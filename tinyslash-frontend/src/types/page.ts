export type BlockType = 'LINK' | 'HEADER' | 'IMAGE' | 'SOCIAL' | 'TEXT' | 'VIDEO' | 'FORM';

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

  // Buttons
  buttonStyle: 'ROUNDED' | 'SHARP' | 'OUTLINE' | 'FILL';
  buttonColor: string;
  buttonTextColor: string;

  // Typography
  font: string;
  fontSize?: 'SM' | 'MD' | 'LG';
  fontWeight?: 'NORMAL' | 'SEMIBOLD' | 'BOLD';
  textColor: string;

  // Social Icons
  socialIconSize?: 'SM' | 'MD' | 'LG';
  socialIconColor?: string;
  socialBackgroundColor?: string;

  // Branding
  showBranding: boolean;
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
  published: boolean;
  views: number;
  customDomain?: string;
  removeBranding?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt?: string;
  updatedAt?: string;
}
