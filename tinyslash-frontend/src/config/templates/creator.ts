import { Template } from './types';

export const creatorTemplates: Template[] = [
  // 1. Vibrant Creator (Existing)
  {
    id: 'influencer-vibrant',
    name: 'Vibrant Creator',
    description: 'Energetic gradient style for content creators.',
    icon: '',
    category: 'CREATOR',
    previewColor: '#FF3366',
    profile: {
      bio: 'Travel • Lifestyle • Photography | Capturing moments around the world',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Watch my latest Vlog', url: 'https://youtube.com', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Shop my Presets', url: 'https://gumroad.com', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'My Amazon Favorites', url: 'https://amazon.com', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'instagram', url: 'https://instagram.com/' },
            { platform: 'tiktok', url: 'https://tiktok.com/' },
            { platform: 'youtube', url: 'https://youtube.com/' },
          ]
        },
        visible: true,
        order: 3
      }
    ],
    theme: {
      backgroundType: 'GRADIENT',
      gradientStart: '#FF3366',
      gradientEnd: '#BA265D',
      gradientDirection: 'to bottom right',
      buttonShape: 'PILL',
      buttonStyle: 'SOFT',
      buttonColor: '#FFFFFF',
      buttonTextColor: '#FF3366',
      buttonShadow: 'STRONG',
      font: 'Poppins',
      textColor: '#FFFFFF',
      socialStyle: 'FILLED',
      socialIconSize: 'LG',
      pageMaxWidth: 480,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Official links for Sara Creator.' }
  },

  // 2. Minimal Chic (Existing)
  {
    id: 'influencer-minimal',
    name: 'Minimal Chic',
    description: 'Clean, fashion-forward aesthetic.',
    icon: '',
    category: 'CREATOR',
    previewColor: '#FFFFFF',
    profile: {
      bio: 'Fashion & Beauty Editor',
      avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'MD',
    },
    blocks: [
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
          alt: 'Fashion'
        },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'New Collection', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Book a Consultation', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'instagram', url: 'https://instagram.com/' },
            { platform: 'pinterest', url: 'https://pinterest.com/' },
          ]
        },
        visible: true,
        order: 3
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#FFFFFF',
      buttonShape: 'SHARP',
      buttonStyle: 'OUTLINE',
      buttonColor: '#000000',
      buttonTextColor: '#000000',
      buttonShadow: 'NONE',
      font: 'Playfair Display',
      textColor: '#000000',
      socialStyle: 'OUTLINE',
      socialIconColor: '#000000',
      socialIconSize: 'MD',
      pageMaxWidth: 500,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Fashion portfolio.' }
  },

  // 3. Tech Reviewer (Existing)
  {
    id: 'influencer-dark',
    name: 'Tech Reviewer',
    description: 'Dark mode with neon accents.',
    icon: '',
    category: 'CREATOR',
    previewColor: '#111111',
    profile: {
      bio: 'Tech Reviews & Setups',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Latest Review: iPhone 16', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'My Gear List', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'youtube', url: 'https://youtube.com/' },
            { platform: 'twitter', url: 'https://x.com/' },
            { platform: 'discord', url: 'https://discord.com/' },
          ]
        },
        visible: true,
        order: 2
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#111111',
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#2563EB',
      buttonTextColor: '#FFFFFF',
      buttonShadow: 'GLOW',
      font: 'Inter',
      textColor: '#FFFFFF',
      socialStyle: 'FILLED',
      socialIconSize: 'MD',
      pageMaxWidth: 600,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Tech reviews.' }
  },

  // 4. Luxury Lifestyle (New)
  {
    id: 'influencer-luxury',
    name: 'Luxury Lifestyle',
    description: 'Premium gold & black aesthetic for high-end creators.',
    icon: '',
    category: 'CREATOR',
    previewColor: '#000000',
    profile: {
      bio: 'Curator of fine living. | Travel | Fashion | Experiences',
      avatarUrl: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'HEADER',
        content: { text: 'Exclusive Offers', align: 'center' },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'VIP Membership Application', url: '', highlight: true },
        visible: true,
        order: 1
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?q=80&w=1000&auto=format&fit=crop', // Champagne/Luxury
          alt: 'Luxury'
        },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Shop the Look', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'instagram', url: 'https://instagram.com/' },
            { platform: 'tiktok', url: 'https://tiktok.com/' },
          ]
        },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'GRADIENT',
      gradientStart: '#000000',
      gradientEnd: '#1a1a1a',
      gradientDirection: 'to bottom',
      buttonShape: 'SHARP',
      buttonStyle: 'OUTLINE',
      buttonColor: '#D4AF37', // Gold
      buttonTextColor: '#D4AF37',
      buttonShadow: 'NONE',
      font: 'Cinzel', // or Playfair Display if Cinzel unavailable
      textColor: '#D4AF37',
      socialStyle: 'OUTLINE',
      socialIconColor: '#D4AF37',
      socialIconSize: 'MD',
      pageMaxWidth: 500,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Luxury lifestyle.' }
  },

  // 5. Pro Gamer (New)
  {
    id: 'influencer-gamer',
    name: 'Pro Gamer',
    description: 'Electric neon style for streamers & esports.',
    icon: '',
    category: 'CREATOR',
    previewColor: '#2e0249',
    profile: {
      bio: 'LIVE every night at 8PM EST | FPS Pro Player',
      avatarUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Watch Live on Twitch', url: 'https://twitch.tv', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Join the Discord Server', url: 'https://discord.gg', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop', // Gaming setup
          alt: 'Setup'
        },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Merch Store', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'twitch', url: 'https://twitch.tv/' },
            { platform: 'youtube', url: 'https://youtube.com/' },
            { platform: 'twitter', url: 'https://x.com/' },
          ]
        },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'GRADIENT',
      gradientStart: '#2e0249', // Dark Purple
      gradientEnd: '#570a57', // Purple
      gradientDirection: 'to bottom right',
      buttonShape: 'ROUNDED', // Angular
      buttonStyle: 'FILLED',
      buttonColor: '#a91079', // Pink/Magenta
      buttonTextColor: '#ffffff',
      buttonShadow: 'GLOW',
      font: 'Teko', // Bold condensed
      textColor: '#ffffff',
      socialStyle: 'FILLED',
      socialIconColor: '#a91079',
      socialIconSize: 'LG',
      pageMaxWidth: 560,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Gaming profile.' }
  },

  // 6. Fitness Elite (New)
  {
    id: 'influencer-fitness',
    name: 'Fitness Elite',
    description: 'High energy, bold design for fitness pros.',
    icon: '',
    category: 'CREATOR',
    previewColor: '#171717',
    profile: {
      bio: 'Certified Personal Trainer | Transform your body in 90 days.',
      avatarUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
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
        type: 'HEADER',
        content: { text: 'Free Workouts', align: 'center' },
        visible: true,
        order: 1
      },
      {
        type: 'VIDEO',
        content: { url: 'https://youtube.com/watch?v=dQw4w9WgXcQ' }, // Placeholder
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: '1:1 Online Coaching', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Supplement Guide', url: '', highlight: false },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'instagram', url: 'https://instagram.com/' },
            { platform: 'youtube', url: 'https://youtube.com/' },
            { platform: 'tiktok', url: 'https://tiktok.com/' },
          ]
        },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#171717',
      buttonShape: 'SHARP',
      buttonStyle: 'FILLED',
      buttonColor: '#f97316', // Orange
      buttonTextColor: '#ffffff',
      buttonShadow: 'NONE',
      font: 'Oswald', // Bold condensed
      textColor: '#ffffff',
      socialStyle: 'FILLED',
      socialIconColor: '#f97316',
      socialIconSize: 'LG',
      pageMaxWidth: 500,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Fitness coaching.' }
  },

  // 7. Podcaster (New)
  {
    id: 'influencer-podcast',
    name: 'Podcast Host',
    description: 'Audio-focused layout for podcasters.',
    icon: '',
    category: 'CREATOR',
    previewColor: '#f3f4f6',
    profile: {
      bio: 'Host of "The Future Talks" | New episodes every Tuesday.',
      avatarUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'ROUNDED',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Listen on Spotify', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Listen on Apple Podcasts', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Latest Episode', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1478737270239-2f52b27e94bb?q=80&w=1000&auto=format&fit=crop', // Album art placeholder
          alt: 'Episode Art'
        },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Support on Patreon', url: '', highlight: false },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'twitter', url: 'https://x.com/' },
            { platform: 'instagram', url: 'https://instagram.com/' },
          ]
        },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#f3f4f6',
      buttonShape: 'ROUNDED',
      buttonStyle: 'SOFT',
      buttonColor: '#6366f1', // Indigo
      buttonTextColor: '#4338ca',
      buttonShadow: 'SUBTLE',
      font: 'DM Sans',
      textColor: '#1f2937',
      socialStyle: 'FILLED',
      socialIconColor: '#6366f1',
      socialIconSize: 'LG',
      pageMaxWidth: 520,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Podcast official links.' }
  },

  // 8. Musician / Artist / Band (New)
  {
    id: 'influencer-musician',
    name: 'Musician & Band',
    description: 'Dark, artistic template for musicians to share tour dates and music.',
    icon: '',
    category: 'CREATOR',
    previewColor: '#09090b',
    profile: {
      bio: 'New single "Midnight" streaming everywhere now.',
      avatarUrl: 'https://images.unsplash.com/photo-1516280440502-629dfecb273b?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Listen on Spotify', url: 'https://spotify.com', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Listen on Apple Music', url: 'https://apple.com', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Upcoming Tour Dates', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Get Tickets - LA (Oct 12)', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Get Tickets - NY (Oct 18)', url: '', highlight: false },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'youtube', url: 'https://youtube.com/' },
            { platform: 'instagram', url: 'https://instagram.com/' },
            { platform: 'twitter', url: 'https://twitter.com/' },
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
      buttonStyle: 'OUTLINE',
      buttonColor: '#e4e4e7', // Zinc 200
      buttonTextColor: '#e4e4e7',
      buttonShadow: 'NONE',
      font: 'Inter',
      textColor: '#fafafa', // Zinc 50
      socialStyle: 'OUTLINE',
      socialIconColor: '#e4e4e7',
      socialIconSize: 'MD',
      pageMaxWidth: 560,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Official Music & Tour Dates' }
  },

  // 9. Writer / Blogger (New)
  {
    id: 'influencer-writer',
    name: 'Writer & Blogger',
    description: 'Clean, typography-focused template for writers.',
    icon: '',
    category: 'CREATOR',
    previewColor: '#faf8f5',
    profile: {
      bio: 'Author of "The Calm Mind" | Weekly essays on mindful living.',
      avatarUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead2708?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Subscribe to my newsletter', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Buy my new book', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Latest Essays', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Why we need boredom', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'The art of saying no', url: '', highlight: false },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'twitter', url: 'https://twitter.com/' }
          ]
        },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#faf8f5', // Off-white/Cream
      buttonShape: 'SHARP',
      buttonStyle: 'FILLED',
      buttonColor: '#27272a', // Zinc 800
      buttonTextColor: '#ffffff',
      buttonShadow: 'NONE',
      font: 'Lora', // Elegant Serif
      textColor: '#27272a',
      socialStyle: 'MONOCHROME',
      socialIconColor: '#27272a',
      socialIconSize: 'SM',
      pageMaxWidth: 500,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Weekly Newsletter & Essays' }
  },

  // 10. Bollywood & Dance Creator (New - Indian Market)
  {
    id: 'influencer-dance',
    name: 'Dance & Choreography',
    description: 'High energy, vibrant template for dancers and choreographers.',
    icon: '',
    category: 'CREATOR',
    previewColor: '#e11d48',
    profile: {
      bio: 'Professional Choreographer 💃 | YouTube: 1M+ Subs | Mumbai',
      avatarUrl: 'https://images.unsplash.com/photo-1547153760-18fc86324498?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Watch My Latest Dance Cover', url: 'https://youtube.com', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Book Me for Events / Workshops', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Trending Reels', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'VIDEO',
        content: { url: 'https://youtube.com/watch?v=dQw4w9WgXcQ' },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'youtube', url: 'https://youtube.com/' },
            { platform: 'instagram', url: 'https://instagram.com/' },
            { platform: 'tiktok', url: 'https://tiktok.com/' },
          ]
        },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'GRADIENT',
      gradientStart: '#fda4af', // Rose 300
      gradientEnd: '#e11d48', // Rose 600
      gradientDirection: 'to bottom right',
      buttonShape: 'PILL',
      buttonStyle: 'FILLED',
      buttonColor: '#ffffff',
      buttonTextColor: '#e11d48',
      buttonShadow: 'STRONG',
      font: 'Poppins',
      textColor: '#ffffff',
      socialStyle: 'FILLED',
      socialIconColor: '#e11d48',
      socialIconSize: 'LG',
      pageMaxWidth: 480,
      contentSpacing: 'COMPACT',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Bollywood Dance & Choreography' }
  },

  // 11. Cricket / Sports Influencer (New - Indian Market)
  {
    id: 'influencer-cricket',
    name: 'Sports & Cricket',
    description: 'Athletic, bold blue design for sports analysts and players.',
    icon: '',
    category: 'CREATOR',
    previewColor: '#1d4ed8',
    profile: {
      bio: 'Cricket Analyst 🏏 | Fantasy Sports Expert | Daily Match Previews',
      avatarUrl: 'https://images.unsplash.com/photo-1540747913346-19e32fc3e6ce?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Join My Premium Telegram Channel', url: 'https://telegram.org', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Today\'s Dream11 Predictions', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Latest Match Analysis', align: 'left' },
        visible: true,
        order: 2
      },
      {
        type: 'VIDEO',
        content: { url: 'https://youtube.com/watch?v=dQw4w9WgXcQ' },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'youtube', url: 'https://youtube.com/' },
            { platform: 'twitter', url: 'https://twitter.com/' },
          ]
        },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#eff6ff', // Blue 50
      buttonShape: 'SHARP',
      buttonStyle: 'FILLED',
      buttonColor: '#1d4ed8', // Blue 700 (India Blue)
      buttonTextColor: '#ffffff',
      buttonShadow: 'NONE',
      font: 'Oswald', // Bold sports font
      textColor: '#1e3a8a',
      socialStyle: 'FILLED',
      socialIconColor: '#1d4ed8',
      socialIconSize: 'MD',
      pageMaxWidth: 560,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Cricket Predictions & Analysis' }
  },

  // 12. Tech Guru India (New - Indian Market)
  {
    id: 'influencer-techguru',
    name: 'Tech & Gadgets',
    description: 'Sleek, modern layout for gadget reviews and tech tips.',
    icon: '',
    category: 'CREATOR',
    previewColor: '#0f172a',
    profile: {
      bio: 'Tech Unboxed | Smartphones, Laptops & Gadget Hacks 📱💻',
      avatarUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Watch My Latest Smartphone Review', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'HEADER',
        content: { text: 'My Gear & Recommendations', align: 'center' },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Best Phones under ₹20,000 (Amazon)', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'My Studio Setup', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'youtube', url: 'https://youtube.com/' },
            { platform: 'instagram', url: 'https://instagram.com/' },
          ]
        },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#0f172a', // Slate 900
      buttonShape: 'ROUNDED',
      buttonStyle: 'OUTLINE',
      buttonColor: '#38bdf8', // Light Blue
      buttonTextColor: '#38bdf8',
      buttonShadow: 'GLOW',
      font: 'Roboto Mono', // Tech vibe
      textColor: '#f8fafc',
      socialStyle: 'MONOCHROME',
      socialIconColor: '#38bdf8',
      socialIconSize: 'SM',
      pageMaxWidth: 600,
      contentSpacing: 'COMPACT',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Tech Reviews & Unboxings' }
  },

  // 13. Desi Food Vlogger (New - Indian Market)
  {
    id: 'influencer-food',
    name: 'Food & Cooking Vlogger',
    description: 'Warm, appetizing colors for food bloggers and street food explorers.',
    icon: '',
    category: 'CREATOR',
    previewColor: '#fff7ed',
    profile: {
      bio: 'Exploring Street Food & Sharing Secret Recipes 🌶️🥘',
      avatarUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93cb0?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Latest Recipe: Butter Chicken', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Download My Free E-Cookbook', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1626779836374-123456789012?q=80&w=1000&auto=format&fit=crop', // Placeholder for food 
          alt: 'Delicious Food'
        },
        visible: true,
        order: 2
      },
      {
        type: 'HEADER',
        content: { text: 'Kitchen Essentials', align: 'center' },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Authentic Indian Spices (Amazon)', url: '', highlight: false },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'youtube', url: 'https://youtube.com/' },
            { platform: 'instagram', url: 'https://instagram.com/' },
          ]
        },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#fff7ed', // Orange 50
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#ea580c', // Orange 600
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Lora',
      textColor: '#7c2d12', // Orange 900
      socialStyle: 'OUTLINE',
      socialIconColor: '#ea580c',
      socialIconSize: 'LG',
      pageMaxWidth: 540,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Street Food & Recipes' }
  },

  // 14. Global Travel Vlogger (New - Global Market)
  {
    id: 'influencer-travel',
    name: 'Travel & Lifestyle',
    description: 'Breezy, wide-open layout for global travelers and digital nomads.',
    icon: '',
    category: 'CREATOR',
    previewColor: '#e0f2fe',
    profile: {
      bio: 'Full-time Traveler ✈️ | 50+ Countries | Currently in Bali 🌴',
      avatarUrl: 'https://images.unsplash.com/photo-1476900543704-4312b78632f8?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Watch My Bali Travel Guide', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'HEADER',
        content: { text: 'Travel Resources', align: 'left' },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Get Airbnb Discount', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'My Travel Insurance (SafetyWing)', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Cameras & Vlogging Gear', url: '', highlight: false },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'youtube', url: 'https://youtube.com/' },
            { platform: 'instagram', url: 'https://instagram.com/' },
            { platform: 'tiktok', url: 'https://tiktok.com/' },
          ]
        },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'GRADIENT',
      gradientStart: '#e0f2fe', // Sky 100
      gradientEnd: '#bae6fd', // Sky 200
      gradientDirection: 'to bottom',
      buttonShape: 'PILL',
      buttonStyle: 'FILLED',
      buttonColor: '#0284c7', // Sky 600
      buttonTextColor: '#ffffff',
      buttonShadow: 'NONE',
      font: 'Inter',
      textColor: '#0c4a6e', // Sky 900
      socialStyle: 'FILLED',
      socialIconColor: '#0284c7',
      socialIconSize: 'MD',
      pageMaxWidth: 560,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Global Travel & Vlogs' }
  }
];
