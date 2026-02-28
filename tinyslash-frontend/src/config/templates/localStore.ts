import { Template } from './types';

export const localStoreTemplates: Template[] = [
  // 1. Bakery
  {
    id: 'store-bakery',
    name: 'Local Bakery',
    description: 'Sweet and inviting design for bakeries.',
    icon: '',
    category: 'LOCAL_BUSINESS',
    previewColor: '#fef3c7',
    profile: {
      bio: 'Freshly Baked Goods Daily | Cakes, Pastries, Breads',
      avatarUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Order Custom Cake', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: "Today's Menu", url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'IMAGE',
        content: { url: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=1000&auto=format&fit=crop', alt: 'Bakery treats' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: '📍 123 Main Street\nMon-Sat: 7am - 4pm', align: 'center' },
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
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#f59e0b',
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Lora',
      textColor: '#78350f',
      socialStyle: 'OUTLINE',
      socialIconColor: '#f59e0b',
      socialIconSize: 'MD',
      pageMaxWidth: 500,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Local Artisan Bakery' }
  },
  // 2. Florist
  {
    id: 'store-florist',
    name: 'Florist',
    description: 'Beautiful, floral-inspired layout for flower shops.',
    icon: '',
    category: 'LOCAL_BUSINESS',
    previewColor: '#fce7f3',
    profile: {
      bio: 'Custom Floral Arrangements & Delivery',
      avatarUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Shop Bouquets', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Wedding Inquiries', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Seasonal Blooms', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'IMAGE',
        content: { url: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=1000&auto=format&fit=crop', alt: 'Flowers' },
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
      backgroundType: 'GRADIENT',
      gradientStart: '#fdf2f8',
      gradientEnd: '#fecdd3',
      gradientDirection: 'to bottom',
      buttonShape: 'PILL',
      buttonStyle: 'SOFT',
      buttonColor: '#f43f5e',
      buttonTextColor: '#881337',
      buttonShadow: 'NONE',
      font: 'Playfair Display',
      textColor: '#881337',
      socialStyle: 'FILLED',
      socialIconColor: '#f43f5e',
      socialIconSize: 'MD',
      pageMaxWidth: 540,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Local Florist & Delivery' }
  },
  // 3. Bookstore
  {
    id: 'store-bookstore',
    name: 'Bookstore',
    description: 'Cozy and classic template for bookshops.',
    icon: '',
    category: 'LOCAL_BUSINESS',
    previewColor: '#e5e7eb',
    profile: {
      bio: 'Your Neighborhood Independent Bookstore',
      avatarUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Shop Online', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Upcoming Author Events', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Staff Picks', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: "View This Month's Recommendations", url: '', highlight: false },
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
      background: '#f3f4f6',
      buttonShape: 'SHARP',
      buttonStyle: 'OUTLINE',
      buttonColor: '#374151',
      buttonTextColor: '#111827',
      buttonShadow: 'NONE',
      font: 'Lora',
      textColor: '#1f2937',
      socialStyle: 'MONOCHROME',
      socialIconColor: '#374151',
      socialIconSize: 'SM',
      pageMaxWidth: 600,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Independent Local Bookstore' }
  },
  // 4. Hardware Store
  {
    id: 'store-hardware',
    name: 'Hardware Store',
    description: 'Strong, utilitarian design for hardware shops.',
    icon: '',
    category: 'LOCAL_BUSINESS',
    previewColor: '#ffedd5',
    profile: {
      bio: 'Family Owned Hardware | Tools, Paint, & Supplies',
      avatarUrl: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'ROUNDED',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Browse Catalog', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Store Directions', url: '', highlight: false },
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
        type: 'TEXT',
        content: { text: '✓ Key Cutting\n✓ Paint Mixing\n✓ Tool Rental', align: 'left' },
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
      background: '#fff7ed',
      buttonShape: 'SHARP',
      buttonStyle: 'FILLED',
      buttonColor: '#ea580c',
      buttonTextColor: '#ffffff',
      buttonShadow: 'STRONG',
      font: 'Inter',
      textColor: '#7c2d12',
      socialStyle: 'FILLED',
      socialIconColor: '#ea580c',
      socialIconSize: 'MD',
      pageMaxWidth: 640,
      contentSpacing: 'COMPACT',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Local Hardware Store' }
  },
  // 5. Grocery/Market
  {
    id: 'store-grocery',
    name: 'Local Market',
    description: 'Fresh and organic styling for local grocers.',
    icon: '',
    category: 'LOCAL_BUSINESS',
    previewColor: '#dcfce7',
    profile: {
      bio: 'Fresh Produce | Organic Goods | Local Products',
      avatarUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Shop Online for Pickup', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Weekly Specials', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'IMAGE',
        content: { url: 'https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=1000&auto=format&fit=crop', alt: 'Fresh produce' },
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
      backgroundType: 'SOLID',
      background: '#f0fdf4',
      buttonShape: 'ROUNDED',
      buttonStyle: 'OUTLINE',
      buttonColor: '#16a34a',
      buttonTextColor: '#14532d',
      buttonShadow: 'NONE',
      font: 'Roboto',
      textColor: '#14532d',
      socialStyle: 'OUTLINE',
      socialIconColor: '#16a34a',
      socialIconSize: 'MD',
      pageMaxWidth: 560,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Neighborhood Grocery Market' }
  },
  // 6. Home Services (New)
  {
    id: 'store-homeservices',
    name: 'Home Services',
    description: 'Trust-based layout for plumbers, electricians, and cleaners.',
    icon: '',
    category: 'LOCAL_BUSINESS',
    previewColor: '#e0f2fe',
    profile: {
      bio: 'Reliable, 24/7 Emergency Plumbing & Heating Services.',
      avatarUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Call Now: 24/7 Service', url: 'tel:+1234567890', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Request a Free Quote', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Our Services', align: 'left' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: '✓ Emergency Repairs\n✓ Pipe Installations\n✓ Water Heater Servicing', align: 'left' },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Read Our 5-Star Reviews', url: '', highlight: false },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#f0f9ff', // Sky 50
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#0369a1', // Sky 700
      buttonTextColor: '#ffffff',
      buttonShadow: 'STRONG',
      font: 'Inter',
      textColor: '#0f172a',
      socialStyle: 'FILLED',
      socialIconColor: '#0369a1',
      socialIconSize: 'MD',
      pageMaxWidth: 560,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Trusted Home Services' }
  },

  // 7. Kirana / Supermarket India (New - Indian Market)
  {
    id: 'store-kirana',
    name: 'Kirana & Supermarket',
    description: 'Familiar, vibrant layout for local Indian grocery stores and supermarkets.',
    icon: '',
    category: 'LOCAL_BUSINESS',
    previewColor: '#fefce8',
    profile: {
      bio: 'Gupta Provision Store | Fresh Groceries & Daily Needs | Free Home Delivery',
      avatarUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Order via WhatsApp (Free Delivery)', url: 'https://wa.me/', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'HEADER',
        content: { text: 'Today\'s Offers', align: 'center' },
        visible: true,
        order: 1
      },
      {
        type: 'TEXT',
        content: { text: 'Special Discount on 5KG Aashirvaad Atta & Fortune Oil!', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Call Shop', url: 'tel:+91', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Navigate to Store (Google Maps)', url: 'https://maps.google.com', highlight: false },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#fefce8', // Yellow 50
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#ca8a04', // Yellow 600
      buttonTextColor: '#ffffff',
      buttonShadow: 'STRONG',
      font: 'Inter',
      textColor: '#422006', // Yellow 900
      socialStyle: 'OUTLINE',
      socialIconColor: '#ca8a04',
      socialIconSize: 'MD',
      pageMaxWidth: 560,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Kirana & Provision Store' }
  },

  // 8. Indian Sweets / Mithai Shop (New - Indian Market)
  {
    id: 'store-mithai',
    name: 'Sweets & Mithai Shop',
    description: 'Rich, festive template perfect for traditional Indian sweet shops.',
    icon: '',
    category: 'LOCAL_BUSINESS',
    previewColor: '#fff1f2',
    profile: {
      bio: 'Premium Indian Sweets | Pure Desi Ghee Preparations since 1980.',
      avatarUrl: 'https://images.unsplash.com/photo-1626804475297-41609ea8eb49?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Order Festive Gift Boxes', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Bulk Orders for Weddings', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1624835697693-79d86895cecf?q=80&w=1000&auto=format&fit=crop', // Traditional sweets
          alt: 'Indian Mithai'
        },
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
      gradientStart: '#fff1f2', // Rose 50
      gradientEnd: '#ffe4e6', // Rose 100
      gradientDirection: 'to bottom right',
      buttonShape: 'PILL',
      buttonStyle: 'FILLED',
      buttonColor: '#e11d48', // Rose 600
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Lora',
      textColor: '#881337', // Rose 900
      socialStyle: 'FILLED',
      socialIconColor: '#e11d48',
      socialIconSize: 'LG',
      pageMaxWidth: 540,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Premium Mithai & Sweets' }
  },

  // 9. Desi Salon & Parlour (New - Indian Market)
  {
    id: 'store-salon',
    name: 'Beauty Salon & Parlour',
    description: 'Chic, welcoming layout for local beauty parlours and salons.',
    icon: '',
    category: 'LOCAL_BUSINESS',
    previewColor: '#fdf4ff',
    profile: {
      bio: 'Bridal Makeup | Hair Styling | Skin Care ✨',
      avatarUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
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
        content: { title: 'View Bridal Packages', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Services Menu', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: 'Hair SPA • Keratin Treatment • Party Makeup', align: 'center' },
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
      background: '#fdf4ff', // Fuchsia 50
      buttonShape: 'ROUNDED',
      buttonStyle: 'OUTLINE',
      buttonColor: '#a21caf', // Fuchsia 700
      buttonTextColor: '#a21caf',
      buttonShadow: 'NONE',
      font: 'Playfair Display',
      textColor: '#4a044e', // Fuchsia 900
      socialStyle: 'OUTLINE',
      socialIconColor: '#a21caf',
      socialIconSize: 'MD',
      pageMaxWidth: 500,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Beauty Salon & Bridal Makeup' }
  },

  // 10. Local Electronics & Mobile Repair (New - Indian Market)
  {
    id: 'store-mobilerepair',
    name: 'Mobile & Electronics Store',
    description: 'Trust-based, tech-focused design for electronics and repair shops.',
    icon: '',
    category: 'LOCAL_BUSINESS',
    previewColor: '#f8fafc',
    profile: {
      bio: 'Expert Mobile Repairs | Screen Replacement | New Gadgets.',
      avatarUrl: 'https://images.unsplash.com/photo-1597740985671-2a8a3b8050ce?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Get Repair Quote on WhatsApp', url: 'https://wa.me/', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Browse Latest Smartphones', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Services Provided', align: 'left' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: '• iPhone & Android Screen Repair\n• Battery Replacement\n• Accessories & Covers', align: 'left' },
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
      background: '#f8fafc', // Slate 50
      buttonShape: 'SHARP',
      buttonStyle: 'FILLED',
      buttonColor: '#334155', // Slate 700
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Roboto',
      textColor: '#0f172a',
      socialStyle: 'MONOCHROME',
      socialIconColor: '#334155',
      socialIconSize: 'MD',
      pageMaxWidth: 560,
      contentSpacing: 'COMPACT',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Mobile Repair & Electronics' }
  },

  // 11. Neighborhood Cafe / Chai Tapri (New - Indian Market)
  {
    id: 'store-cafe',
    name: 'Neighborhood Cafe & Chai',
    description: 'Warm, inviting browns and creams for local cafes and tea stalls.',
    icon: '',
    category: 'LOCAL_BUSINESS',
    previewColor: '#fffbeb',
    profile: {
      bio: 'Sharma Ji Ka Cafe | Famous Kulhad Chai & Special Maggi ☕',
      avatarUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'View Full Menu & Order', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?q=80&w=1000&auto=format&fit=crop', // Chai / Tea Image
          alt: 'Hot Chai'
        },
        visible: true,
        order: 1
      },
      {
        type: 'TEXT',
        content: { text: 'Open 6 AM to 11 PM\nFree Wi-Fi Available', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Store Directions', url: 'https://maps.google.com', highlight: false },
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
      background: '#fffbeb', // Amber 50
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#b45309', // Amber 700
      buttonTextColor: '#ffffff',
      buttonShadow: 'NONE',
      font: 'Lora',
      textColor: '#78350f', // Amber 900
      socialStyle: 'FILLED',
      socialIconColor: '#b45309',
      socialIconSize: 'SM',
      pageMaxWidth: 500,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Local Cafe & Tea Stall' }
  }
];
