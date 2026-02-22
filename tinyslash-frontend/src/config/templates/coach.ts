import { Template } from './types';

export const coachTemplates: Template[] = [
  // 1. Life Coach
  {
    id: 'coach-life',
    name: 'Life Coach',
    description: 'Empowering and warm template for life Coaches.',
    icon: '',
    category: 'COACH',
    previewColor: '#fee2e2',
    profile: {
      bio: 'Helping you unlock your true potential | Certified Life Coach',
      avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Book a Discovery Call', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Download My Free Guide', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Programs', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: '1-on-1 Coaching Program', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'instagram', url: 'https://instagram.com' }] },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#fef2f2',
      buttonShape: 'PILL',
      buttonStyle: 'FILLED',
      buttonColor: '#ef4444',
      buttonTextColor: '#ffffff',
      buttonShadow: 'STRONG',
      font: 'Lora',
      textColor: '#7f1d1d',
      socialStyle: 'OUTLINE',
      socialIconColor: '#ef4444',
      socialIconSize: 'MD',
      pageMaxWidth: 550,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Life Coaching & Mentorship' }
  },
  // 2. Fitness Coach
  {
    id: 'coach-fitness',
    name: 'Fitness Coach',
    description: 'High-energy and bold for personal trainers.',
    icon: '',
    category: 'COACH',
    previewColor: '#111827',
    profile: {
      bio: 'Transforming Lives Through Fitness | Online PT',
      avatarUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Start Your Transformation', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'View Transformation Gallery', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Training Programs', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: '8-Week Shred Plan', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Custom Meal Plans', url: '', highlight: false },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'youtube', url: 'https://youtube.com' }] },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#1f2937',
      buttonShape: 'SHARP',
      buttonStyle: 'FILLED',
      buttonColor: '#f97316',
      buttonTextColor: '#ffffff',
      buttonShadow: 'NONE',
      font: 'Oswald',
      textColor: '#f3f4f6',
      socialStyle: 'FILLED',
      socialIconColor: '#f97316',
      socialIconSize: 'MD',
      pageMaxWidth: 600,
      contentSpacing: 'COMPACT',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Online Fitness Coaching' }
  },
  // 3. Executive Coach
  {
    id: 'coach-executive',
    name: 'Executive Coach',
    description: 'Polished and professional for leadership coaching.',
    icon: '',
    category: 'COACH',
    previewColor: '#e0e7ff',
    profile: {
      bio: 'Leadership Consultant & Executive Coach | MBA',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Schedule a Consultation', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Read My Latest Forbes Article', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Services', align: 'left' },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'C-Suite Mentoring', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'linkedin', url: 'https://linkedin.com' }] },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#f8fafc',
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#3b82f6',
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Inter',
      textColor: '#1e293b',
      socialStyle: 'OUTLINE',
      socialIconColor: '#3b82f6',
      socialIconSize: 'SM',
      pageMaxWidth: 640,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Executive Leadership Coaching' }
  },
  // 4. Relationship Coach
  {
    id: 'coach-relationship',
    name: 'Relationship Coach',
    description: 'Soft, calming design for relationship experts.',
    icon: '',
    category: 'COACH',
    previewColor: '#fce7f3',
    profile: {
      bio: 'Guiding couples & individuals to happier relationships.',
      avatarUrl: 'https://images.unsplash.com/photo-1521572008054-d30f40ad3d7e?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Book a Session', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Couples Retreat Waitlist', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Free Resources', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Communication Guide PDF', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'instagram', url: 'https://instagram.com' }] },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#fdf2f8',
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#ec4899',
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Playfair Display',
      textColor: '#831843',
      socialStyle: 'MONOCHROME',
      socialIconColor: '#ec4899',
      socialIconSize: 'MD',
      pageMaxWidth: 500,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Relationship Coaching Services' }
  },
  // 5. Financial Coach
  {
    id: 'coach-financial',
    name: 'Financial Coach',
    description: 'Trustworthy and serious for financial advisors.',
    icon: '',
    category: 'COACH',
    previewColor: '#dcfce7',
    profile: {
      bio: 'Master Your Personal Finances & Build Wealth',
      avatarUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Free 15-Min Financial Review', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Sign up for my Newsletter', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Courses', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Budgeting 101 Course', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'twitter', url: 'https://twitter.com' }] },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#f0fdf4',
      buttonShape: 'ROUNDED',
      buttonStyle: 'OUTLINE',
      buttonColor: '#16a34a',
      buttonTextColor: '#14532d',
      buttonShadow: 'NONE',
      font: 'Inter',
      textColor: '#14532d',
      socialStyle: 'FILLED',
      socialIconColor: '#16a34a',
      socialIconSize: 'SM',
      pageMaxWidth: 540,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Personal Finance Coaching' }
  }
];
