import { Template } from './types';

export const agencyTemplates: Template[] = [
  // 1. Digital Marketing Agency
  {
    id: 'agency-digital',
    name: 'Digital Marketing',
    description: 'Dynamic and results-driven layout for marketing agencies.',
    icon: '',
    category: 'AGENCY_B2B',
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
    category: 'AGENCY_B2B',
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
    name: 'Tech & SaaS',
    description: 'Modern, tech-focused template for SaaS products and dev shops.',
    icon: '',
    category: 'AGENCY_B2B',
    previewColor: '#0f172a',
    profile: {
      bio: 'Building High-Performance Software & SaaS Products',
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
    category: 'AGENCY_B2B',
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
    category: 'AGENCY_B2B',
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
  },

  // 6. Freelancer / Consultant (New)
  {
    id: 'agency-freelancer',
    name: 'Freelancer',
    description: 'Minimal, personal portfolio for independent contractors.',
    icon: '',
    category: 'AGENCY_B2B',
    previewColor: '#fafafa',
    profile: {
      bio: 'Independent UI/UX Designer & Framer Developer.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Available for Hire - Contact Me', url: 'mailto:test@test.com', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'View My Dribbble Portfolio', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Recent Work', align: 'left' },
        visible: true,
        order: 2
      },
      {
        type: 'IMAGE',
        content: { url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1000&auto=format&fit=crop', alt: 'Design Mockup' },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'x', url: 'https://x.com' }, { platform: 'dribbble', url: 'https://dribbble.com' }] },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#fafafa', // Neutral 50
      buttonShape: 'PILL',
      buttonStyle: 'OUTLINE',
      buttonColor: '#171717', // Neutral 900
      buttonTextColor: '#171717',
      buttonShadow: 'NONE',
      font: 'Inter',
      textColor: '#171717',
      socialStyle: 'OUTLINE',
      socialIconColor: '#171717',
      socialIconSize: 'MD',
      pageMaxWidth: 560,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Independent Freelancer Portfolio' }
  },

  // 7. Service Provider B2B (New)
  {
    id: 'agency-b2bservice',
    name: 'B2B Service Provider',
    description: 'Corporate profile for consultants and B2B services.',
    icon: '',
    category: 'AGENCY_B2B',
    previewColor: '#e0e7ff',
    profile: {
      bio: 'Enterprise IT Consulting | Transforming Businesses.',
      avatarUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Book a Strategy Call', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Download Whitepaper', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Expertise', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: 'Cloud Migration | Cybersecurity | IT Managed Services', align: 'center' },
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
      background: '#eef2ff', // Indigo 50
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#3730a3', // Indigo 800
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Roboto',
      textColor: '#312e81',
      socialStyle: 'FILLED',
      socialIconColor: '#3730a3',
      socialIconSize: 'SM',
      pageMaxWidth: 600,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Enterprise B2B Consulting' }
  },

  // 8. Bangalore IT Services (New - Indian Market)
  {
    id: 'agency-blr-it',
    name: 'IT Services Agency',
    description: 'Corporate tech template perfect for software development and IT agencies.',
    icon: '',
    category: 'AGENCY_B2B',
    previewColor: '#f8fafc',
    profile: {
      bio: 'Custom Software Development & IT Consulting | Based in Bengaluru.',
      avatarUrl: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Hire Dedicated Developers', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'View Our Tech Stack', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Key Services', align: 'left' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: '• Web & Mobile Apps\n• Cloud Architecture (AWS/Azure)\n• AI & Machine Learning Integrations', align: 'left' },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'linkedin', url: 'https://linkedin.com' }, { platform: 'github', url: 'https://github.com' }] },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#f8fafc', // Slate 50
      buttonShape: 'SHARP',
      buttonStyle: 'FILLED',
      buttonColor: '#0f172a', // Slate 900
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Inter',
      textColor: '#0f172a',
      socialStyle: 'OUTLINE',
      socialIconColor: '#0f172a',
      socialIconSize: 'MD',
      pageMaxWidth: 600,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Software Development & IT Services' }
  },

  // 9. Event Management India (New - Indian Market)
  {
    id: 'agency-eventmgmt',
    name: 'Event Management Company',
    description: 'Vibrant, festive layout for wedding and corporate event planners.',
    icon: '',
    category: 'AGENCY_B2B',
    previewColor: '#fff1f2',
    profile: {
      bio: 'Premium Event Planners | Corporate Events, Exhibitions & Grand Weddings 🎉',
      avatarUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Request an Event Proposal', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'View Corporate Event Gallery', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'View Wedding Gallery', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'HEADER',
        content: { text: 'Recent Projects', align: 'center' },
        visible: true,
        order: 3
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop', // Event venue
          alt: 'Event Decor'
        },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'instagram', url: 'https://instagram.com' }] },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'GRADIENT',
      gradientStart: '#fff1f2', // Rose 50
      gradientEnd: '#ffe4e6', // Rose 100
      gradientDirection: 'to bottom',
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#be185d', // Rose 700
      buttonTextColor: '#ffffff',
      buttonShadow: 'STRONG',
      font: 'Playfair Display',
      textColor: '#881337', // Rose 900
      socialStyle: 'FILLED',
      socialIconColor: '#be185d',
      socialIconSize: 'LG',
      pageMaxWidth: 560,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Premium Event Management Services' }
  },

  // 10. Social Media Marketing Agency (New - Global/Indian Market)
  {
    id: 'agency-smm',
    name: 'Social Media Agency',
    description: 'Bold, trendy layout for modern digital marketing and SMM agencies.',
    icon: '',
    category: 'AGENCY_B2B',
    previewColor: '#fdf4ff',
    profile: {
      bio: 'Growth Marketing & Viral Campaigns | We make brands trend 🚀',
      avatarUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Book a Free Growth Audit', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Our Services & Pricing Packages', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Case Studies', align: 'left' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: 'How we scaled Brand X from 10k to 100k followers in 3 months.', align: 'left' },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'instagram', url: 'https://instagram.com' }, { platform: 'tiktok', url: 'https://tiktok.com' }] },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#fdf4ff', // Fuchsia 50
      buttonShape: 'PILL',
      buttonStyle: 'FILLED',
      buttonColor: '#c026d3', // Fuchsia 600
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Inter',
      textColor: '#701a75', // Fuchsia 900
      socialStyle: 'FILLED',
      socialIconColor: '#c026d3',
      socialIconSize: 'MD',
      pageMaxWidth: 500,
      contentSpacing: 'COMPACT',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Social Media Growth Agency' }
  },

  // 11. Real Estate Marketing Agency (New - Indian Market)
  {
    id: 'agency-realestate',
    name: 'Real Estate Marketing',
    description: 'Professional, lead-gen focused layout for property marketing agencies.',
    icon: '',
    category: 'AGENCY_B2B',
    previewColor: '#f0fdfa',
    profile: {
      bio: 'Generating High-Quality Leads for Real Estate Developers & Brokers ✨',
      avatarUrl: 'https://images.unsplash.com/photo-1560518846-bc5b1287c71f?q=80&w=500&auto=format&fit=crop',
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
        content: { title: 'View Property Performance Case Studies', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Our Capabilities', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: 'Google Ads | Facebook Leads | 3D Walkthroughs | SEO', align: 'center' },
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
      background: '#f0fdfa', // Teal 50
      buttonShape: 'SHARP',
      buttonStyle: 'OUTLINE',
      buttonColor: '#0f766e', // Teal 700
      buttonTextColor: '#0f172a',
      buttonShadow: 'NONE',
      font: 'Roboto',
      textColor: '#134e4a', // Teal 900
      socialStyle: 'OUTLINE',
      socialIconColor: '#0f766e',
      socialIconSize: 'SM',
      pageMaxWidth: 560,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Real Estate Marketing Experts' }
  },

  // 12. Boutique Design Agency (New - Global Market)
  {
    id: 'agency-boutique',
    name: 'Boutique Design Agency',
    description: 'Minimal, high-end, monochrome design for branding studios.',
    icon: '',
    category: 'AGENCY_B2B',
    previewColor: '#ffffff',
    profile: {
      bio: 'Independent Branding Studio. We craft iconic identities.',
      avatarUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=500&auto=format&fit=crop', // Abstract studio
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'View Capabilities Deck', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'HEADER',
        content: { text: 'Selected Works', align: 'left' },
        visible: true,
        order: 1
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1621609764180-2a556a34f0c7?q=80&w=1000&auto=format&fit=crop', // Minimal branding
          alt: 'Branding Project'
        },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Luxury Skincare Rebrand', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'behance', url: 'https://behance.net' }] },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#ffffff', // White
      buttonShape: 'ROUNDED',
      buttonStyle: 'OUTLINE',
      buttonColor: '#000000', // Black
      buttonTextColor: '#000000',
      buttonShadow: 'NONE',
      font: 'Inter',
      textColor: '#000000',
      socialStyle: 'MONOCHROME',
      socialIconColor: '#000000',
      socialIconSize: 'MD',
      pageMaxWidth: 600,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Creative Branding Studio' }
  }
];
