import { Template } from './types';

export const blankTemplates: Template[] = [
  {
    id: 'blank',
    name: 'Blank Canvas',
    description: 'Start from scratch with a clean slate.',
    icon: '',
    category: 'BLANK',
    previewColor: '#FFFFFF',
    profile: {
      bio: '',
      avatarUrl: '',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'MD',
    },
    blocks: [],
    theme: {
      backgroundType: 'SOLID',
      background: '#FFFFFF',
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#000000',
      buttonTextColor: '#FFFFFF',
      buttonShadow: 'NONE',
      font: 'DM Sans',
      textColor: '#000000',
      socialStyle: 'FILLED',
      socialIconSize: 'MD',
      pageMaxWidth: 600,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: '' }
  }
];
