import { Template } from './types';

export const agencyTemplates: Template[] = [
  // 1. Digital Marketing Agency
  {
    id: 'agency-digital',
    name: 'Digital Marketing',
    description: 'Dynamic and results-driven layout for marketing agencies.',
    icon: '',
    category: 'AGENCY',
    previewColor: '#eff6ff',
    profile: {
      bio: 'Growth Marketing Agency. We scale brands through data-driven campaigns.',
      avatarUrl: 'https://images.unsplash.com/photo-1542744094-24638ea0b3b5?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Get a Free SEO Audit', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'View Our Case Studies', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Core Services', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: 'SEO & Content | Paid Social | Google Ads', align: 'center' },
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
      background: '#eff6ff',
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#2563eb',
      buttonTextColor: '#ffffff',
      buttonShadow: 'STRONG',
      font: 'Inter',
      textColor: '#1e3a8a',
      socialStyle: 'FILLED',
      socialIconColor: '#2563eb',
      socialIconSize: 'MD',
      pageMaxWidth: 600,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Top Digital Marketing Agency' }
  },
  // 2. PR & Communications Agency
  {
    id: 'agency-pr',
    name: 'PR & Communications',
    description: 'Sophisticated and elegant design for PR firms.',
    icon: '',
    category: 'AGENCY',
    previewColor: '#f8fafc',
    profile: {
      bio: 'Strategic Communications & Public Relations globally.',
      avatarUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Media Inquiries', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Latest Press Releases', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Capabilities', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: 'Media Relations \n Crisis Management \n Event Strategy', align: 'center' },
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
      background: '#ffffff',
      buttonShape: 'SHARP',
      buttonStyle: 'OUTLINE',
      buttonColor: '#0f172a',
      buttonTextColor: '#0f172a',
      buttonShadow: 'NONE',
      font: 'Playfair Display',
      textColor: '#0f172a',
      socialStyle: 'MONOCHROME',
      socialIconColor: '#0f172a',
      socialIconSize: 'SM',
      pageMaxWidth: 540,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Premium PR Agency' }
  },
  // 3. Web Design / Dev Agency
  {
    id: 'agency-webdev',
    name: 'Web Dev Studio',
    description: 'Modern, tech-focused template for development shops.',
    icon: '',
    category: 'AGENCY',
    previewColor: '#0f172a',
    profile: {
      bio: 'Building High-Performance Web & Mobile Applications',
      avatarUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'ROUNDED',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Start a Project', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'View Tech Stack', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'IMAGE',
        content: { url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop', alt: 'Coding' },
        visible: true,
        order: 2
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'github', url: 'https://github.com' }] },
        visible: true,
        order: 3
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#0f172a',
      buttonShape: 'PILL',
      buttonStyle: 'FILLED',
      buttonColor: '#38bdf8',
      buttonTextColor: '#0f172a',
      buttonShadow: 'SUBTLE',
      font: 'Roboto Mono',
      textColor: '#e2e8f0',
      socialStyle: 'OUTLINE',
      socialIconColor: '#38bdf8',
      socialIconSize: 'MD',
      pageMaxWidth: 640,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Web Development Studio' }
  },
  // 4. Recruitment/Staffing Agency
  {
    id: 'agency-recruitment',
    name: 'Staffing & Recruitment',
    description: 'Trustworthy and professional design for recruiters.',
    icon: '',
    category: 'AGENCY',
    previewColor: '#f1f5f9',
    profile: {
      bio: 'Connecting Top Talent with Leading Companies Worldwide.',
      avatarUrl: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Find Candidates (For Employers)', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Submit Resume (For Job Seekers)', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Industries We Serve', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: 'Technology | Healthcare | Finance', align: 'center' },
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
      buttonColor: '#334155',
      buttonTextColor: '#ffffff',
      buttonShadow: 'NONE',
      font: 'Inter',
      textColor: '#1e293b',
      socialStyle: 'FILLED',
      socialIconColor: '#334155',
      socialIconSize: 'SM',
      pageMaxWidth: 560,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Global Staffing Agency' }
  },
  // 5. Travel & Event Agency
  {
    id: 'agency-travel',
    name: 'Travel & Events',
    description: 'Vibrant and visual layout for travel agencies.',
    icon: '',
    category: 'AGENCY',
    previewColor: '#fdf4ff',
    profile: {
      bio: 'Curating unforgettable travel experiences and corporate events.',
      avatarUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Plan Your Next Trip', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Corporate Event Packages', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'IMAGE',
        content: { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop', alt: 'Beach destination' },
        visible: true,
        order: 2
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'instagram', url: 'https://instagram.com' }] },
        visible: true,
        order: 3
      }
    ],
    theme: {
      backgroundType: 'GRADIENT',
      gradientStart: '#fdf4ff',
      gradientEnd: '#fae8ff',
      gradientDirection: 'to bottom',
      buttonShape: 'PILL',
      buttonStyle: 'SOFT',
      buttonColor: '#d946ef',
      buttonTextColor: '#701a75',
      buttonShadow: 'SUBTLE',
      font: 'DM Sans',
      textColor: '#4a044e',
      socialStyle: 'FILLED',
      socialIconColor: '#d946ef',
      socialIconSize: 'LG',
      pageMaxWidth: 500,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Luxury Travel Agency' }
  }
];
