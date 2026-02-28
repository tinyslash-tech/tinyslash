import { Template } from './types';

export const ecommerceTemplates: Template[] = [
  // 1. Digital Products Drops
  {
    id: 'ecommerce-digital',
    name: 'Digital Products',
    description: 'High-conversion template for selling digital downloads and courses.',
    icon: '',
    category: 'ECOMMERCE',
    previewColor: '#faf5ff',
    profile: {
      bio: 'Mastering Productivity | eBooks & Notion Templates',
      avatarUrl: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'HEADER',
        content: { text: 'Featured Products', align: 'center' },
        visible: true,
        order: 0
      },
      {
        type: 'AFFILIATE',
        content: {
          url: 'https://gumroad.com',
          title: 'The Ultimate Productivity System (Notion Template)',
          imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop',
          price: '$29.00',
          buttonText: 'Buy Now',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          cornerRadius: 'rounded',
          shadow: 'subtle'
        },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Browse All Templates', url: '', highlight: true },
        visible: true,
        order: 2
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'twitter', url: 'https://x.com' }] },
        visible: true,
        order: 3
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#faf5ff', // Purple 50
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#7e22ce', // Purple 700
      buttonTextColor: '#ffffff',
      buttonShadow: 'STRONG',
      font: 'Inter',
      textColor: '#3b0764', // Purple 900
      socialStyle: 'FILLED',
      socialIconColor: '#7e22ce',
      socialIconSize: 'LG',
      pageMaxWidth: 540,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Digital Products Store' }
  },

  // 2. Physical Goods Merch
  {
    id: 'ecommerce-merch',
    name: 'Merchandise Store',
    description: 'Showcase physical merchandise and apparel.',
    icon: '',
    category: 'ECOMMERCE',
    previewColor: '#000000',
    profile: {
      bio: 'Official Merch Store | Worldwide Shipping',
      avatarUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=500&auto=format&fit=crop', // Clothing
      profileImageStyle: 'SQUARE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'IMAGE',
        content: { url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop', alt: 'New Collection Banner' },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Shop the Summer Collection', url: '', highlight: true },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Best Sellers', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'AFFILIATE',
        content: {
          url: 'https://shopify.com',
          title: 'Signature Classic Hoodie',
          imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop',
          price: '$55.00',
          buttonText: 'Add to Cart',
          backgroundColor: '#111111',
          textColor: '#ffffff',
          cornerRadius: 'sharp',
          shadow: 'none'
        },
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
      background: '#0a0a0a',
      buttonShape: 'SHARP',
      buttonStyle: 'FILLED',
      buttonColor: '#ffffff',
      buttonTextColor: '#000000',
      buttonShadow: 'NONE',
      font: 'Oswald',
      textColor: '#ffffff',
      socialStyle: 'OUTLINE',
      socialIconColor: '#ffffff',
      socialIconSize: 'LG',
      pageMaxWidth: 600,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Official Merch Store' }
  },

  // 3. D2C Saree Brand India (New - Indian Market)
  {
    id: 'ecommerce-saree',
    name: 'Ethnic Wear & Saree Brand',
    description: 'Elegant, cultural theme for Indian ethnic wear and D2C fashion.',
    icon: '',
    category: 'ECOMMERCE',
    previewColor: '#fff1f2',
    profile: {
      bio: 'Authentic Handloom Sarees | Direct from Weavers.',
      avatarUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d615e1?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'HEADER',
        content: { text: 'Festive Collection', align: 'center' },
        visible: true,
        order: 0
      },
      {
        type: 'AFFILIATE',
        content: {
          url: 'https://shopify.com',
          title: 'Banarasi Silk Saree - Ruby Red',
          imageUrl: 'https://images.unsplash.com/photo-1583391733958-65e2777ae6b2?q=80&w=1000&auto=format&fit=crop', // Saree
          price: '₹4,999',
          buttonText: 'Buy Now',
          backgroundColor: '#9f1239', // Rose 800
          textColor: '#ffffff',
          cornerRadius: 'rounded',
          shadow: 'subtle'
        },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Shop Banarasi Collection', url: '', highlight: true },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Shop Kanjeevaram Collection', url: '', highlight: false },
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
      background: '#fff1f2', // Rose 50
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#9f1239', // Rose 800
      buttonTextColor: '#ffffff',
      buttonShadow: 'NONE',
      font: 'Playfair Display',
      textColor: '#881337',
      socialStyle: 'OUTLINE',
      socialIconColor: '#9f1239',
      socialIconSize: 'LG',
      pageMaxWidth: 560,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Premium Ethnic Wear & Sarees' }
  },

  // 4. Handmade Jewelry India (New - Indian Market)
  {
    id: 'ecommerce-jewelry',
    name: 'Handmade Jewelry',
    description: 'Delicate, pastel layout for artisans and jewelers.',
    icon: '',
    category: 'ECOMMERCE',
    previewColor: '#fdf4ff',
    profile: {
      bio: 'Handcrafted Silver & Imitation Jewelry ✨ | Worldwide Shipping',
      avatarUrl: 'https://images.unsplash.com/photo-1599643478524-fb66f7cace27?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Shop the New Arrivals', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'AFFILIATE',
        content: {
          url: 'https://shopify.com',
          title: 'Oxidized Silver Jhumkas',
          imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop', // Jewelry
          price: '₹899',
          buttonText: 'Add to Cart',
          backgroundColor: '#fdf4ff',
          textColor: '#86198f',
          cornerRadius: 'pill',
          shadow: 'none'
        },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Shop Necklaces', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'instagram', url: 'https://instagram.com' }, { platform: 'pinterest', url: 'https://pinterest.com' }] },
        visible: true,
        order: 3
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#fdf4ff', // Fuchsia 50
      buttonShape: 'PILL',
      buttonStyle: 'OUTLINE',
      buttonColor: '#86198f', // Fuchsia 800
      buttonTextColor: '#701a75',
      buttonShadow: 'NONE',
      font: 'Lora',
      textColor: '#701a75',
      socialStyle: 'OUTLINE',
      socialIconColor: '#86198f',
      socialIconSize: 'MD',
      pageMaxWidth: 500,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Handcrafted Statement Jewelry' }
  },

  // 5. Digital E-books & Courses INR (New - Global/Indian Market)
  {
    id: 'ecommerce-ebook',
    name: 'E-Books & Courses',
    description: 'Clean, focused layout for selling intellectual property and guides.',
    icon: '',
    category: 'ECOMMERCE',
    previewColor: '#f8fafc',
    profile: {
      bio: 'Author & Digital Creator | Learn to code in 30 days.',
      avatarUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'HEADER',
        content: { text: 'Bestselling E-Book', align: 'center' },
        visible: true,
        order: 0
      },
      {
        type: 'AFFILIATE',
        content: {
          url: 'https://gumroad.com',
          title: 'Zero to Fullstack Developer Guide (PDF)',
          imageUrl: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1000&auto=format&fit=crop',
          price: '₹499',
          buttonText: 'Buy Now',
          backgroundColor: '#2563eb', // Blue 600
          textColor: '#ffffff',
          cornerRadius: 'rounded',
          shadow: 'strong'
        },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Subscribe to Newsletter & Get Chapter 1 Free', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'twitter', url: 'https://x.com' }] },
        visible: true,
        order: 3
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#f8fafc', // Slate 50
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#0f172a', // Slate 900
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Inter',
      textColor: '#1e293b',
      socialStyle: 'FILLED',
      socialIconColor: '#0f172a',
      socialIconSize: 'SM',
      pageMaxWidth: 540,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'E-Books and Digital Resources' }
  },

  // 6. Premium Coffee / Tea Brand (New - Global Market)
  {
    id: 'ecommerce-coffee',
    name: 'Coffee & Tea Roasters',
    description: 'Earthy, rich layout for premium beverage brands.',
    icon: '',
    category: 'ECOMMERCE',
    previewColor: '#fef3c7',
    profile: {
      bio: 'Artisanal Single-Origin Coffee Roasted in India ☕',
      avatarUrl: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Shop Our Bestsellers', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'AFFILIATE',
        content: {
          url: 'https://shopify.com',
          title: 'Monsoon Malabar Dark Roast (250g)',
          imageUrl: 'https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=1000&auto=format&fit=crop', // Beans
          price: '₹650',
          buttonText: 'Add to Cart',
          backgroundColor: '#451a03', // Amber 950 (Dark Brown)
          textColor: '#ffffff',
          cornerRadius: 'rounded',
          shadow: 'none'
        },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Monthly Coffee Subscription', url: '', highlight: false },
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
      background: '#fffbeb', // Amber 50
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#78350f', // Amber 900
      buttonTextColor: '#ffffff',
      buttonShadow: 'NONE',
      font: 'Playfair Display',
      textColor: '#451a03', // Amber 950
      socialStyle: 'OUTLINE',
      socialIconColor: '#78350f',
      socialIconSize: 'MD',
      pageMaxWidth: 600,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Premium Artisanal Coffee Roasters' }
  },

  // 7. Streetwear Drops (New - Global Market)
  {
    id: 'ecommerce-streetwear',
    name: 'Streetwear & Sneakers',
    description: 'Bold, high-contrast urban design for streetwear and drops.',
    icon: '',
    category: 'ECOMMERCE',
    previewColor: '#000000',
    profile: {
      bio: 'Limited Edition Streetwear Drops | New Collection Out Now.',
      avatarUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1000&auto=format&fit=crop', // Streetwear style banner
          alt: 'Season Drop Banner'
        },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Shop Season 3 Collection', url: '', highlight: true },
        visible: true,
        order: 1
      },
      {
        type: 'AFFILIATE',
        content: {
          url: 'https://shopify.com',
          title: 'Oversized Graphic Tee - Black',
          imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1000&auto=format&fit=crop', // T-shirt
          price: '₹1,499',
          buttonText: 'Buy',
          backgroundColor: '#ffffff',
          textColor: '#000000',
          cornerRadius: 'sharp',
          shadow: 'none'
        },
        visible: true,
        order: 2
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'instagram', url: 'https://instagram.com' }, { platform: 'tiktok', url: 'https://tiktok.com' }] },
        visible: true,
        order: 3
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#09090b', // Zinc 950
      buttonShape: 'SHARP',
      buttonStyle: 'FILLED',
      buttonColor: '#ffffff',
      buttonTextColor: '#000000',
      buttonShadow: 'NONE',
      font: 'Roboto Mono',
      textColor: '#fafafa', // Zinc 50
      socialStyle: 'FILLED',
      socialIconColor: '#ffffff',
      socialIconSize: 'LG',
      pageMaxWidth: 600,
      contentSpacing: 'COMPACT',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Streetwear & Urban Fashion' }
  }
];
