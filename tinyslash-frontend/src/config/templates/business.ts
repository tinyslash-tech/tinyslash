import { Template } from './types';

export const businessTemplates: Template[] = [
  // 1. Local Cafe (Existing)
  {
    id: 'business-cafe',
    name: 'Local Business',
    description: 'Perfect for cafes, shops, and services.',
    icon: '',
    category: 'BUSINESS',
    previewColor: '#F8F7F4',
    profile: {
      bio: 'Artisan Coffee Roasters • Serving Seattle since 2015',
      avatarUrl: 'https://images.unsplash.com/photo-1559969143-b2defc575dc6?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      profileImageStyle: 'ROUNDED',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Order Online', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Visit Our Website', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
          alt: 'Cafe Interior'
        },
        visible: true,
        order: 3
      },
      {
        type: 'HEADER',
        content: { text: 'Location & Hours', align: 'center' },
        visible: true,
        order: 4
      },
      {
        type: 'TEXT',
        content: {
          text: '123 Pike Street, Seattle, WA\n(206) 555-0123\nhello@artisancoffee.com',
          align: 'center'
        },
        visible: true,
        order: 5
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS_LABELS',
          platforms: [
            { platform: 'instagram', url: 'https://instagram.com/' },
            { platform: 'facebook', url: 'https://facebook.com/' },
          ]
        },
        visible: true,
        order: 9
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#F8F7F4',
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#2D3436',
      buttonTextColor: '#FFFFFF',
      buttonShadow: 'SUBTLE',
      font: 'DM Sans',
      textColor: '#2D3436',
      socialStyle: 'MONOCHROME',
      socialIconColor: '#2D3436',
      socialIconSize: 'SM',
      pageMaxWidth: 640,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Artisan Coffee Roasters in Seattle.' }
  },

  // 2. Real Estate Agent
  {
    id: 'business-realtor',
    name: 'Real Estate Professional',
    description: 'Trusted, premium layout for agents and brokers.',
    icon: '',
    category: 'BUSINESS',
    previewColor: '#1e3a8a',
    profile: {
      bio: 'Luxury Real Estate Agent | Top 1% Producer',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'HEADER',
        content: { text: 'Current Listings', align: 'center' },
        visible: true,
        order: 0
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1600596542815-e3287065402d?q=80&w=1000&auto=format&fit=crop',
          alt: 'Luxury Home'
        },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'View 123 Beverly Blvd ($4.2M)', url: '', highlight: true },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Schedule a Consultation', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'HEADER',
        content: { text: 'Resources', align: 'center' },
        visible: true,
        order: 4
      },
      {
        type: 'LINK',
        content: { title: 'Free Home Valuation', url: '', highlight: false },
        visible: true,
        order: 5
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'linkedin', url: 'https://linkedin.com' },
            { platform: 'instagram', url: 'https://instagram.com' },
          ]
        },
        visible: true,
        order: 6
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#1e3a8a',
      buttonShape: 'SHARP',
      buttonStyle: 'FILLED',
      buttonColor: '#FFFFFF',
      buttonTextColor: '#1e3a8a',
      buttonShadow: 'STRONG',
      font: 'Playfair Display',
      textColor: '#FFFFFF',
      socialStyle: 'FILLED',
      socialIconColor: '#FFFFFF', // White icons on blue bg
      socialIconSize: 'MD',
      pageMaxWidth: 600,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Luxury real estate services.' }
  },

  // 3. Online Coach / Consultant
  {
    id: 'business-coach',
    name: 'Coach & Consultant',
    description: 'Clean, trust-building design for experts.',
    icon: '',
    category: 'BUSINESS',
    previewColor: '#e0f2f1',
    profile: {
      bio: 'Business Strategy Coach helping you scale to 7-figures.',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
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
        content: { title: 'Join the Mastermind', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'DIVIDER',
        content: { style: 'LINE', spacing: 'MD' },
        visible: true,
        order: 2
      },
      {
        type: 'HEADER',
        content: { text: 'Free Resources', align: 'center' },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Download the Growth Playbook', url: '', highlight: false },
        visible: true,
        order: 4
      },
      {
        type: 'LINK',
        content: { title: 'Listen to the Podcast', url: '', highlight: false },
        visible: true,
        order: 5
      },
      {
        type: 'EMAIL',
        content: { title: 'Get weekly tips', buttonText: 'Subscribe', successMessage: 'Success!' },
        visible: true,
        order: 6
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#e0f2f1',
      buttonShape: 'PILL',
      buttonStyle: 'FILLED',
      buttonColor: '#00695c',
      buttonTextColor: '#FFFFFF',
      buttonShadow: 'SUBTLE',
      font: 'Karla',
      textColor: '#004d40',
      socialStyle: 'FILLED',
      socialIconSize: 'MD',
      pageMaxWidth: 540,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Business coaching and resources.' }
  },

  // 4. Creative Agency
  {
    id: 'business-agency',
    name: 'Creative Agency',
    description: 'Bold, high-contrast style for studios.',
    icon: '',
    category: 'BUSINESS',
    previewColor: '#000000',
    profile: {
      bio: 'We build digital products for future-thinking brands.',
      avatarUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'ROUNDED',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'View Our Work', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Our Services', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000&auto=format&fit=crop',
          alt: 'Team'
        },
        visible: true,
        order: 2
      },
      {
        type: 'HEADER',
        content: { text: 'Let\'s Work Together', align: 'center' },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Start a Project', url: '', highlight: false },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'linkedin', url: 'https://linkedin.com' },
            { platform: 'twitter', url: 'https://x.com' },
          ]
        },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#000000',
      buttonShape: 'SHARP',
      buttonStyle: 'OUTLINE',
      buttonColor: '#FFFFFF',
      buttonTextColor: '#FFFFFF',
      buttonShadow: 'NONE',
      font: 'Inter',
      textColor: '#FFFFFF',
      socialStyle: 'OUTLINE',
      socialIconColor: '#FFFFFF',
      socialIconSize: 'MD',
      pageMaxWidth: 600,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Digital product studio.' }
  },

  // 5. Indian Fine Dining (New)
  {
    id: 'business-indian-restaurant',
    name: 'Fine Dining Restaurant',
    description: 'Elegant design for premium Indian restaurants.',
    icon: '',
    category: 'BUSINESS',
    previewColor: '#fff7ed',
    profile: {
      bio: 'Authentic Indian Cuisine | Fine Dining Experience \n Open 11 AM - 11 PM',
      avatarUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Order on Zomato', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Order on Swiggy', url: '', highlight: true },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Our Specialties', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=1000&auto=format&fit=crop', // Biryani/Curry
          alt: 'Signature Dish'
        },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'View Full Menu', url: '', highlight: false },
        visible: true,
        order: 4
      },
      {
        type: 'LINK',
        content: { title: 'Book a Table', url: '', highlight: false },
        visible: true,
        order: 5
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
        order: 6
      }
    ],
    theme: {
      backgroundType: 'GRADIENT',
      gradientStart: '#fff7ed', // Orange-ish white
      gradientEnd: '#fed7aa', // Light orange
      gradientDirection: 'to bottom',
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#c2410c', // Deep Orange/Rust
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Playfair Display',
      textColor: '#431407', // Dark brown
      socialStyle: 'FILLED',
      socialIconColor: '#c2410c',
      socialIconSize: 'MD',
      pageMaxWidth: 580,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Authentic Indian fine dining.' }
  },

  // 6. Ethnic Boutique (New)
  {
    id: 'business-boutique',
    name: 'Ethnic Boutique',
    description: 'Luxurious design for fashion & jewelry brands.',
    icon: '',
    category: 'BUSINESS',
    previewColor: '#4a0404',
    profile: {
      bio: 'Exquisite Silk Sarees & Handcrafted Jewelry \n Shipping Worldwide 🌍',
      avatarUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=500&auto=format&fit=crop', // Saree/Indian ethnic
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'HEADER',
        content: { text: 'New Arrivals', align: 'center' },
        visible: true,
        order: 0
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?q=80&w=1000&auto=format&fit=crop', // Jewelry/Saree
          alt: 'New Collection'
        },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Shop Festive Collection', url: '', highlight: true },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Chat on WhatsApp', url: 'https://wa.me/', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Visit Store Location', url: '', highlight: false },
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
            { platform: 'pinterest', url: 'https://pinterest.com' },
          ]
        },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#4a0404', // Deep Maroon
      buttonShape: 'SHARP',
      buttonStyle: 'OUTLINE',
      buttonColor: '#fbbf24', // Gold
      buttonTextColor: '#fbbf24',
      buttonShadow: 'NONE',
      font: 'Cinzel',
      textColor: '#fbbf24',
      socialStyle: 'OUTLINE',
      socialIconColor: '#fbbf24',
      socialIconSize: 'LG',
      pageMaxWidth: 500,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Exclusive ethnic wear boutique.' }
  },

  // 7. Chartered Accountant (New)
  {
    id: 'business-ca',
    name: 'CA & Tax Consultant',
    description: 'Professional layout for CAs and financial advisors.',
    icon: '',
    category: 'BUSINESS',
    previewColor: '#f8fafc',
    profile: {
      bio: 'Chartered Accountants & Business Advisors \n 15+ Years of Excellence',
      avatarUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Book Consultation', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'File Info for ITR', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'GST Registration Services', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'HEADER',
        content: { text: 'Client Updates', align: 'center' },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Latest Tax News (PDF)', url: '', highlight: false },
        visible: true,
        order: 4
      },
      {
        type: 'TEXT',
        content: {
          text: 'Office: 402, Business Park, Mumbai\nMon-Sat: 10AM - 7PM',
          align: 'center'
        },
        visible: true,
        order: 5
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'linkedin', url: 'https://linkedin.com' },
            { platform: 'twitter', url: 'https://x.com' },
          ]
        },
        visible: true,
        order: 6
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#f8fafc', // Slate 50
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#0f172a', // Slate 900
      buttonTextColor: '#ffffff',
      buttonShadow: 'NONE',
      font: 'Inter',
      textColor: '#334155', // Slate 700
      socialStyle: 'FILLED',
      socialIconColor: '#0f172a',
      socialIconSize: 'SM',
      pageMaxWidth: 600,
      contentSpacing: 'COMPACT',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Expert tax and accounting services.' }
  },

  // 8. Wedding Planner (New)
  {
    id: 'business-wedding',
    name: 'Wedding Planner',
    description: 'Festive and grand design for event planners.',
    icon: '',
    category: 'BUSINESS',
    previewColor: '#fdf2f8',
    profile: {
      bio: 'Making Dream Weddings Come True \n Pan-India Destination Weddings',
      avatarUrl: 'https://images.unsplash.com/photo-1541250848049-b4f7141dca3f?q=80&w=500&auto=format&fit=crop', // Indian wedding/mandap
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'HEADER',
        content: { text: 'Our Services', align: 'center' },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Download Wedding Package Brochure', url: '', highlight: true },
        visible: true,
        order: 1
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1519225469958-19e5db410912?q=80&w=1000&auto=format&fit=crop', // Wedding decor
          alt: 'Wedding Decor'
        },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'View Real Weddings Gallery', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Book a Consultation Call', url: '', highlight: false },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'instagram', url: 'https://instagram.com' },
            { platform: 'youtube', url: 'https://youtube.com' },
            { platform: 'pinterest', url: 'https://pinterest.com' },
          ]
        },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'GRADIENT',
      gradientStart: '#fdf2f8', // Pink 50
      gradientEnd: '#fce7f3', // Pink 100
      gradientDirection: 'to bottom',
      buttonShape: 'PILL',
      buttonStyle: 'SOFT',
      buttonColor: '#db2777', // Pink 600
      buttonTextColor: '#9d174d', // Pink 800
      buttonShadow: 'SUBTLE',
      font: 'Playfair Display',
      textColor: '#831843', // Pink 900
      socialStyle: 'FILLED',
      socialIconColor: '#db2777',
      socialIconSize: 'LG',
      pageMaxWidth: 560,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Luxury wedding planning.' }
  }
];
