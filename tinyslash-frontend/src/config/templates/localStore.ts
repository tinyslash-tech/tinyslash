import { Template } from './types';

export const localStoreTemplates: Template[] = [
  // 1. Bakery
  {
    id: 'store-bakery',
    name: 'Local Bakery',
    description: 'Sweet and inviting design for bakeries.',
    icon: '',
    category: 'LOCAL_STORE',
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
    category: 'LOCAL_STORE',
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
    category: 'LOCAL_STORE',
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
    category: 'LOCAL_STORE',
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
    category: 'LOCAL_STORE',
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
  }
];
