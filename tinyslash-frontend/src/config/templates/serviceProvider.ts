import { Template } from './types';

export const serviceProviderTemplates: Template[] = [
  // 1. Plumber
  {
    id: 'service-plumber',
    name: 'Plumbing Services',
    description: 'Professional layout for local plumbers.',
    icon: '',
    category: 'SERVICE_PROVIDER',
    previewColor: '#e0f2fe',
    profile: {
      bio: '24/7 Emergency Plumbing Services | Licensed & Insured',
      avatarUrl: 'https://images.unsplash.com/photo-1542013936693-884638332954?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Call Now (Emergency)', url: 'tel:+1234567890', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Request a Quote', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Our Services', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: '- Leak Detection\n- Water Heater Repair\n- Drain Cleaning\n- Pipe Repair', align: 'center' },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'facebook', url: 'https://facebook.com' }] },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#e0f2fe',
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#0369a1',
      buttonTextColor: '#ffffff',
      buttonShadow: 'STRONG',
      font: 'Inter',
      textColor: '#0c4a6e',
      socialStyle: 'FILLED',
      socialIconColor: '#0369a1',
      socialIconSize: 'MD',
      pageMaxWidth: 500,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Professional Plumbing Services' }
  },
  // 2. Electrician
  {
    id: 'service-electrician',
    name: 'Electrician',
    description: 'Clean and bright template for electrical services.',
    icon: '',
    category: 'SERVICE_PROVIDER',
    previewColor: '#fef08a',
    profile: {
      bio: 'Expert Residential & Commercial Electricians',
      avatarUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'ROUNDED',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Book an Appointment', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'View Service Areas', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Services Offered', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: '- Panel Upgrades\n- Lighting Installation\n- Wiring & Rewiring\n- Safety Inspections', align: 'center' },
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
      background: '#fef3c7',
      buttonShape: 'SHARP',
      buttonStyle: 'FILLED',
      buttonColor: '#d97706',
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Roboto',
      textColor: '#78350f',
      socialStyle: 'OUTLINE',
      socialIconColor: '#d97706',
      socialIconSize: 'SM',
      pageMaxWidth: 550,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Expert Electrical Services' }
  },
  // 3. House Cleaning
  {
    id: 'service-cleaning',
    name: 'House Cleaning',
    description: 'Fresh and welcoming design for cleaning businesses.',
    icon: '',
    category: 'SERVICE_PROVIDER',
    previewColor: '#d1fae5',
    profile: {
      bio: 'Sparkling Clean Homes | Eco-Friendly Products',
      avatarUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Get a Free Estimate', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Our Pricing', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Why Choose Us?', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: '✓ 100% Satisfaction Guarantee\n✓ Fully Vetted Staff\n✓ Flexible Scheduling', align: 'center' },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'facebook', url: 'https://facebook.com' }] },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#ecfdf5',
      buttonShape: 'PILL',
      buttonStyle: 'SOFT',
      buttonColor: '#10b981',
      buttonTextColor: '#065f46',
      buttonShadow: 'NONE',
      font: 'DM Sans',
      textColor: '#064e3b',
      socialStyle: 'FILLED',
      socialIconColor: '#10b981',
      socialIconSize: 'MD',
      pageMaxWidth: 500,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Professional House Cleaning' }
  },
  // 4. Handyman
  {
    id: 'service-handyman',
    name: 'Handyman Services',
    description: 'Rugged and reliable layout for handymen.',
    icon: '',
    category: 'SERVICE_PROVIDER',
    previewColor: '#f3f4f6',
    profile: {
      bio: 'No Job Too Small | Quality Repairs & Maintenance',
      avatarUrl: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Call/Text for a Quote', url: 'tel:+1234567890', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'View Past Projects', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Common Services', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: '- Furniture Assembly\n- Minor Plumbing\n- Drywall Repair\n- Painting', align: 'center' },
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
      background: '#f9fafb',
      buttonShape: 'ROUNDED',
      buttonStyle: 'OUTLINE',
      buttonColor: '#4b5563',
      buttonTextColor: '#1f2937',
      buttonShadow: 'SUBTLE',
      font: 'Inter',
      textColor: '#111827',
      socialStyle: 'MONOCHROME',
      socialIconColor: '#4b5563',
      socialIconSize: 'SM',
      pageMaxWidth: 500,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Local Handyman Services' }
  },
  // 5. Landscaping
  {
    id: 'service-landscaping',
    name: 'Landscaping',
    description: 'Earthy and professional template for landscapers.',
    icon: '',
    category: 'SERVICE_PROVIDER',
    previewColor: '#dcfce7',
    profile: {
      bio: 'Beautiful Lawns & Gardens | Commercial & Residential',
      avatarUrl: 'https://images.unsplash.com/photo-1558904541-efa843a96f09?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'ROUNDED',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Request Free Consultation', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Our Portfolio', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'IMAGE',
        content: { url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1000&auto=format&fit=crop', alt: 'Landscaping project' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: 'Services: Lawn Care, Hardscaping, Design', align: 'center' },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS_LABELS', platforms: [{ platform: 'facebook', url: 'https://facebook.com' }] },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#f0fdf4',
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#22c55e',
      buttonTextColor: '#ffffff',
      buttonShadow: 'STRONG',
      font: 'Playfair Display',
      textColor: '#14532d',
      socialStyle: 'FILLED',
      socialIconColor: '#22c55e',
      socialIconSize: 'MD',
      pageMaxWidth: 600,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Premium Landscaping Services' }
  }
];
