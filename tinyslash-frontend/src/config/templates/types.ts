import { PageBlock, PageTheme } from '../../types/page';

export type TemplateCategory = 'ALL' | 'INFLUENCER' | 'BUSINESS' | 'PORTFOLIO' | 'PERSONAL' | 'BLANK';

export interface Template {
  id: string;
  name: string;
  description: string;
  icon: string; // Emoji
  previewColor: string; // Hex for card background
  category: TemplateCategory;

  // Data to apply
  profile: {
    bio: string;
    avatarUrl?: string;
    profileImageStyle: PageTheme['profileImageStyle'];
    profileImageSize: PageTheme['profileImageSize'];
    nameSize: PageTheme['nameSize'];
  };

  blocks: Omit<PageBlock, 'id'>[]; // IDs will be generated on apply

  theme: Partial<PageTheme>;

  settings: {
    metaTitle?: string;
    metaDescription?: string;
  };
}
