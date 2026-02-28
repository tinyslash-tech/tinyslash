import { Template } from './types';

export const portfolioTemplates: Template[] = [
  // 1. Creative Work: Modern Portfolio
  {
    id: 'portfolio-modern',
    name: 'Modern Portfolio',
    description: 'Clean, modern showcase for designers and creatives.',
    icon: '',
    category: 'PORTFOLIO',
    previewColor: '#FFFFFF',
    profile: {
      bio: 'Digital Designer & Creative Director',
      avatarUrl: 'https://images.unsplash.com/photo-1664575602276-acd073f104c1?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'TEXT',
        content: {
          text: 'Creating meaningful digital experiences. \nBased in San Francisco available for remote work.',
          align: 'center'
        },
        visible: true,
        order: 0
      },
      {
        type: 'HEADER',
        content: { text: 'Selected Projects', align: 'center' },
        visible: true,
        order: 1
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
          alt: 'Mobile App Design'
        },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Fintech App Redesign', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1000&auto=format&fit=crop',
          alt: 'Brand Identity'
        },
        visible: true,
        order: 4
      },
      {
        type: 'LINK',
        content: { title: 'Botanical Skincare Branding', url: '', highlight: false },
        visible: true,
        order: 5
      },
      {
        type: 'HEADER',
        content: { text: 'Get in Touch', align: 'center', size: 'SM' },
        visible: true,
        order: 7
      },
      {
        type: 'LINK',
        content: { title: 'Email Me', url: 'mailto:', highlight: true },
        visible: true,
        order: 8
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'dribbble', url: 'https://dribbble.com/' },
            { platform: 'behance', url: 'https://behance.net/' },
            { platform: 'linkedin', url: 'https://linkedin.com/in/' },
          ]
        },
        visible: true,
        order: 9
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#FAFAFA',
      buttonShape: 'SHARP',
      buttonStyle: 'FILLED',
      buttonColor: '#111111',
      buttonTextColor: '#FFFFFF',
      buttonShadow: 'NONE',
      font: 'Inter',
      textColor: '#111111',
      socialStyle: 'MONOCHROME',
      socialIconColor: '#111111',
      socialIconSize: 'MD',
      pageMaxWidth: 540,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Portfolio of selected works.' }
  },

  // 2. Creative Work: Photographer
  {
    id: 'portfolio-photo',
    name: 'Visual Artist',
    description: 'Immersive dark theme for photographers.',
    icon: '',
    category: 'PORTFOLIO',
    previewColor: '#1a1a1a',
    profile: {
      bio: 'Capturing moments in light and shadow.',
      avatarUrl: 'https://images.unsplash.com/photo-1554048612-387768052bf7?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'MD',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'View Portfolio', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Book a Shoot', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Recent Work', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop',
          alt: 'Mountain Landscape'
        },
        visible: true,
        order: 3
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop',
          alt: 'Portrait Session'
        },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'instagram', url: 'https://instagram.com' },
            { platform: 'twitter', url: 'https://x.com' },
          ]
        },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#1a1a1a',
      buttonShape: 'ROUNDED',
      buttonStyle: 'SOFT',
      buttonColor: '#333333',
      buttonTextColor: '#FFFFFF',
      buttonShadow: 'NONE',
      font: 'Inter',
      textColor: '#CCCCCC',
      socialStyle: 'FILLED',
      socialIconSize: 'SM',
      pageMaxWidth: 600,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Fine art photography portfolio.' }
  },

  // 3. Wedding: Wedding Services
  {
    id: 'portfolio-wedding',
    name: 'Wedding Services',
    description: 'Warm and elegant presentation for wedding vendors.',
    icon: '',
    category: 'PORTFOLIO',
    previewColor: '#fff5f5',
    profile: {
      bio: 'Creating timeless memories for your special day. | Photography & Videography',
      avatarUrl: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'HEADER',
        content: { text: 'Our Gallery', align: 'center' },
        visible: true,
        order: 0
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
          alt: 'Wedding Couple'
        },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'View Full Album', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'HEADER',
        content: { text: 'Packages & Bookings', align: 'center' },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Request Pricing Guide', url: '', highlight: true },
        visible: true,
        order: 4
      },
      {
        type: 'LINK',
        content: { title: 'Check Availability', url: '', highlight: false },
        visible: true,
        order: 5
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'instagram', url: 'https://instagram.com' },
            { platform: 'pinterest', url: 'https://pinterest.com' },
          ]
        },
        visible: true,
        order: 6
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#fff5f5', // Soft Blush
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#be185d', // Rose/Pink
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Playfair Display',
      textColor: '#831843', // Dark Rose
      socialStyle: 'OUTLINE',
      socialIconColor: '#be185d',
      socialIconSize: 'LG',
      pageMaxWidth: 540,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Wedding services and portfolio.' }
  },

  // 4. Personal: Digital Resume
  {
    id: 'portfolio-resume',
    name: 'Digital Resume',
    description: 'Professional summary for job seekers and personal profiles.',
    icon: '',
    category: 'PORTFOLIO',
    previewColor: '#f1f5f9',
    profile: {
      bio: 'Marketing Specialist with 5+ years experience.',
      avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'HEADER',
        content: { text: 'Experience', align: 'center' },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Senior Marketer @ TechCo', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Marketing Lead @ Startup', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'HEADER',
        content: { text: 'Contact', align: 'center' },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Download Full Resume', url: '', highlight: true },
        visible: true,
        order: 4
      },
      {
        type: 'LINK',
        content: { title: 'Email Me', url: 'mailto:', highlight: false },
        visible: true,
        order: 5
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'linkedin', url: 'https://linkedin.com' },
          ]
        },
        visible: true,
        order: 6
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#f1f5f9',
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#334155',
      buttonTextColor: '#FFFFFF',
      buttonShadow: 'SUBTLE',
      font: 'Inter',
      textColor: '#1e293b',
      socialStyle: 'FILLED',
      socialIconSize: 'SM',
      pageMaxWidth: 540,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Professional resume.' }
  },

  // 5. Personal: Modern vCard
  {
    id: 'portfolio-vcard',
    name: 'Modern vCard',
    description: 'Sleek, digital business card for professionals.',
    icon: '',
    category: 'PORTFOLIO',
    previewColor: '#2d3748',
    profile: {
      bio: 'Consultant & Speaker \n Helping brands tell their story.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'ROUNDED',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Save Contact Info (vCard)', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Visit Website', url: 'https://website.com', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Connect', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'linkedin', url: 'https://linkedin.com' },
            { platform: 'twitter', url: 'https://x.com' },
            { platform: 'email', url: 'mailto:user@example.com' },
          ]
        },
        visible: true,
        order: 3
      },
      {
        type: 'TEXT',
        content: { text: 'Based in Bangalore, India', align: 'center' },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#2d3748', // Dark Gray
      buttonShape: 'SHARP',
      buttonStyle: 'OUTLINE',
      buttonColor: '#cbd5e0', // Light Gray
      buttonTextColor: '#ffffff',
      buttonShadow: 'NONE',
      font: 'Inter',
      textColor: '#e2e8f0',
      socialStyle: 'OUTLINE',
      socialIconColor: '#cbd5e0',
      socialIconSize: 'MD',
      pageMaxWidth: 480,
      contentSpacing: 'COMPACT',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Digital business card.' }
  },

  // 6. Indian Wedding Photographer (New - Indian Market)
  {
    id: 'portfolio-indianwedding',
    name: 'Indian Wedding Photographer',
    description: 'Rich, luxurious theme with gold and maroon accents for grand Indian weddings.',
    icon: '',
    category: 'PORTFOLIO',
    previewColor: '#fff1f2',
    profile: {
      bio: 'Award-Winning Indian Wedding Photographer 📸 | Candid & Traditional',
      avatarUrl: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'HEADER',
        content: { text: 'Featured Shaadi Highlights', align: 'center' },
        visible: true,
        order: 0
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1583847268964-b28e50a5857e?q=80&w=1000&auto=format&fit=crop', // Indian wedding image
          alt: 'Indian Wedding Couple'
        },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'View Full Pre-Wedding Gallery', url: '', highlight: true },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Pricing & Packages (2025)', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Book Consultation Call', url: '', highlight: false },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'instagram', url: 'https://instagram.com' },
            { platform: 'facebook', url: 'https://facebook.com' },
          ]
        },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#fff1f2', // Rose 50
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#9f1239', // Rose 800 (Maroon)
      buttonTextColor: '#ffffff',
      buttonShadow: 'STRONG',
      font: 'Playfair Display',
      textColor: '#881337', // Rose 900
      socialStyle: 'OUTLINE',
      socialIconColor: '#9f1239',
      socialIconSize: 'LG',
      pageMaxWidth: 560,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Luxury Indian Wedding Photography.' }
  },

  // 7. UI/UX Designer India (New - Indian/Global Market)
  {
    id: 'portfolio-uiux',
    name: 'UI/UX Product Designer',
    description: 'Sleek, ultra-modern dark theme for digital product designers.',
    icon: '',
    category: 'PORTFOLIO',
    previewColor: '#09090b',
    profile: {
      bio: 'Senior Product Designer @ FintechHQ | Crafting interfaces in Mumbai.',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'View Figma Prototypes', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'HEADER',
        content: { text: 'Case Studies', align: 'left' },
        visible: true,
        order: 1
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop',
          alt: 'UI Design'
        },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: '📱 Banking App Redesign (Read Case Study)', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Read My Medium Articles', url: '', highlight: false },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'dribbble', url: 'https://dribbble.com' },
            { platform: 'linkedin', url: 'https://linkedin.com' },
          ]
        },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#09090b', // Zinc 950
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#ffffff',
      buttonTextColor: '#09090b',
      buttonShadow: 'NONE',
      font: 'Inter',
      textColor: '#fafafa', // Zinc 50
      socialStyle: 'FILLED',
      socialIconColor: '#ffffff',
      socialIconSize: 'SM',
      pageMaxWidth: 600,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'UI/UX Product Design Portfolio.' }
  },

  // 8. Global Freelance Writer (New - Global Market)
  {
    id: 'portfolio-writer',
    name: 'Freelance Writer',
    description: 'Clean, typography-focused layout for copywriters and authors.',
    icon: '',
    category: 'PORTFOLIO',
    previewColor: '#fdfbf7',
    profile: {
      bio: 'B2B SaaS Copywriter & Tech Journalist | Seen in Forbes.',
      avatarUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Hire Me on Upwork', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'HEADER',
        content: { text: 'Published Articles', align: 'center' },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'The Future of AI in SaaS (Forbes)', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'How to Scale Content in 2025 (Medium)', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'TEXT',
        content: { text: 'Open for new assignments. Email me below.', align: 'center' },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'twitter', url: 'https://x.com' },
            { platform: 'linkedin', url: 'https://linkedin.com' },
            { platform: 'email', url: 'mailto:writer@example.com' },
          ]
        },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#fdfbf7', // Off-white/cream
      buttonShape: 'SHARP',
      buttonStyle: 'OUTLINE',
      buttonColor: '#3f3f46', // Zinc 700
      buttonTextColor: '#27272a',
      buttonShadow: 'NONE',
      font: 'Lora', // Serif for writers
      textColor: '#27272a',
      socialStyle: 'MONOCHROME',
      socialIconColor: '#3f3f46',
      socialIconSize: 'MD',
      pageMaxWidth: 560,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Freelance B2B Writer Portfolio.' }
  },

  // 9. Desi Fashion & Model Portfolio (New - Indian Market)
  {
    id: 'portfolio-model',
    name: 'Fashion & Model Portfolio',
    description: 'Editorial-style layout with muted earth tones for models and stylists.',
    icon: '',
    category: 'PORTFOLIO',
    previewColor: '#faf8f5',
    profile: {
      bio: 'Fashion Model & Stylist | Based in New Delhi.',
      avatarUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'HEADER',
        content: { text: 'Latest Campaign', align: 'left' },
        visible: true,
        order: 0
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop', // Fashion image
          alt: 'Fashion Campaign'
        },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Download Composite Card (Comp Card)', url: '', highlight: true },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Agency Representation Contact', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'instagram', url: 'https://instagram.com' },
          ]
        },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#faf8f5', // Warm cream
      buttonShape: 'SHARP',
      buttonStyle: 'FILLED',
      buttonColor: '#57534e', // Stone 600
      buttonTextColor: '#ffffff',
      buttonShadow: 'NONE',
      font: 'Inter',
      textColor: '#44403c', // Stone 700
      socialStyle: 'OUTLINE',
      socialIconColor: '#57534e',
      socialIconSize: 'MD',
      pageMaxWidth: 500,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Fashion model composite card and portfolio.' }
  },

  // 10. Indie Game Dev / 3D Artist (New - Global Market)
  {
    id: 'portfolio-gamedev',
    name: 'Game Developer & 3D Artist',
    description: 'Cyberpunk, high-contrast aesthetic for game developers and 3D modellers.',
    icon: '',
    category: 'PORTFOLIO',
    previewColor: '#000000',
    profile: {
      bio: 'Indie Game Dev 🎮 | Unreal Engine & Blender Artist',
      avatarUrl: 'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Play My Latest Game on Steam', url: 'https://store.steampowered.com/', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'HEADER',
        content: { text: '3D Art Portfolio', align: 'center' },
        visible: true,
        order: 1
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop', // Abstract 3D
          alt: '3D Render'
        },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'View ArtStation Profile', url: 'https://artstation.com', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Buy My 3D Asset Packs', url: '', highlight: false },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'twitter', url: 'https://x.com' },
            { platform: 'youtube', url: 'https://youtube.com' },
          ]
        },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#040014', // Very dark purple/black
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#8b5cf6', // Violet 500
      buttonTextColor: '#ffffff',
      buttonShadow: 'GLOW',
      font: 'Roboto Mono',
      textColor: '#e2e8f0', // Slate 200
      socialStyle: 'FILLED',
      socialIconColor: '#8b5cf6',
      socialIconSize: 'SM',
      pageMaxWidth: 600,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Indie game development and 3D art portfolio.' }
  }
];
