import { Template } from './types';

export const personalTemplates: Template[] = [
  // 1. Simple Profile (Existing)
  {
    id: 'personal-simple',
    name: 'Simple Profile',
    description: 'Simple, friendly page for your social profiles.',
    icon: '',
    category: 'PERSONAL',
    previewColor: '#FDFCFB',
    profile: {
      bio: 'Tech enthusiast & Coffee lover',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&q=80',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'instagram', url: 'https://instagram.com/' },
            { platform: 'twitter', url: 'https://x.com/' },
            { platform: 'linkedin', url: 'https://linkedin.com/' },
          ]
        },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'My Personal Blog', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Current Project', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Contact Me', url: 'mailto:', highlight: false },
        visible: true,
        order: 3
      }
    ],
    theme: {
      backgroundType: 'GRADIENT',
      gradientStart: '#FDFCFB',
      gradientEnd: '#E2D1C3',
      gradientDirection: 'to bottom right',
      buttonShape: 'PILL',
      buttonStyle: 'SOFT',
      buttonColor: '#6C5B7B',
      buttonTextColor: '#6C5B7B',
      buttonShadow: 'NONE',
      font: 'Karla',
      textColor: '#355C7D',
      socialStyle: 'FILLED',
      socialIconSize: 'MD',
      pageMaxWidth: 520,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Connect with me.' }
  },

  // 2. Digital Resume (Existing)
  {
    id: 'personal-resume',
    name: 'Digital Resume',
    description: 'Professional summary for job seekers.',
    icon: '',
    category: 'PERSONAL',
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

  // 3. Link Hub (Existing)
  {
    id: 'personal-links',
    name: 'Link Hub',
    description: 'Colorful central hub for all your links.',
    icon: '',
    category: 'PERSONAL',
    previewColor: '#818cf8',
    profile: {
      bio: 'Design Student | Gamer | Foodie',
      avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'My Portfolio', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Twitch Channel', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Spotify Playlist', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'HEADER',
        content: { text: 'Socials', align: 'center', size: 'SM' },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'instagram', url: 'https://instagram.com' },
            { platform: 'tiktok', url: 'https://tiktok.com' },
            { platform: 'youtube', url: 'https://youtube.com' },
            { platform: 'discord', url: 'https://discord.com' },
          ]
        },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'GRADIENT',
      gradientStart: '#818cf8',
      gradientEnd: '#c084fc',
      gradientDirection: 'to bottom right',
      buttonShape: 'PILL',
      buttonStyle: 'FILLED',
      buttonColor: '#FFFFFF',
      buttonTextColor: '#4f46e5',
      buttonShadow: 'STRONG',
      font: 'Outfit',
      textColor: '#FFFFFF',
      socialStyle: 'FILLED',
      socialIconSize: 'LG',
      pageMaxWidth: 500,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Everything in one place.' }
  },

  // 4. Modern vCard (New)
  {
    id: 'personal-vcard',
    name: 'Modern vCard',
    description: 'Sleek, digital business card for professionals.',
    icon: '',
    category: 'PERSONAL',
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

  // 5. Aesthetic Journal (New)
  {
    id: 'personal-aesthetic',
    name: 'Aesthetic Journal',
    description: 'Soft, pastel vibe for writers and thinkers.',
    icon: '',
    category: 'PERSONAL',
    previewColor: '#fff1f2',
    profile: {
      bio: 'Writing about slow living & mindfulness.',
      avatarUrl: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'MD',
    },
    blocks: [
      {
        type: 'HEADER',
        content: { text: 'Recently Published', align: 'center' },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'The Art of Pause', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Autumn Reflections', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1516410529446-2c777cb7366d?q=80&w=1000&auto=format&fit=crop',
          alt: 'Cozy Reading'
        },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Subscribe to Newsletter', url: '', highlight: true },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'pinterest', url: 'https://pinterest.com' },
            { platform: 'instagram', url: 'https://instagram.com' },
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
      buttonStyle: 'SOFT',
      buttonColor: '#fda4af', // Rose 300
      buttonTextColor: '#be123c', // Rose 700
      buttonShadow: 'SUBTLE',
      font: 'Playfair Display', // Serif
      textColor: '#881337', // Rose 900
      socialStyle: 'FILLED',
      socialIconColor: '#fda4af',
      socialIconSize: 'SM',
      pageMaxWidth: 500,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Personal journal and links.' }
  },

  // 6. Bold Brand (New)
  {
    id: 'personal-bold',
    name: 'Bold Personal Brand',
    description: 'High contrast, impactful design for creators.',
    icon: '',
    category: 'PERSONAL',
    previewColor: '#fbbf24',
    profile: {
      bio: 'Content Creator | Film Maker | Storyteller',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a3694c60e9e?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'WORK WITH ME', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'YOUTUBE CHANNEL', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'FEATURED VIDEO', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1000&auto=format&fit=crop',
          alt: 'Filmmaking'
        },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'youtube', url: 'https://youtube.com' },
            { platform: 'instagram', url: 'https://instagram.com' },
            { platform: 'twitter', url: 'https://x.com' },
          ]
        },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#fbbf24', // Amber 400
      buttonShape: 'SHARP',
      buttonStyle: 'FILLED',
      buttonColor: '#000000',
      buttonTextColor: '#fbbf24',
      buttonShadow: 'STRONG',
      font: 'Oswald', // Bold condensed
      textColor: '#000000',
      socialStyle: 'FILLED',
      socialIconColor: '#000000',
      socialIconSize: 'LG',
      pageMaxWidth: 540,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Bold personal branding.' }
  },

  // 7. Dark Focus (New)
  {
    id: 'personal-dark',
    name: 'Dark Focus',
    description: 'Minimalist dark theme for distraction-free links.',
    icon: '',
    category: 'PERSONAL',
    previewColor: '#121212',
    profile: {
      bio: 'Minimalist. Developer. Night Owl.',
      avatarUrl: 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?q=80&w=500&auto=format&fit=crop', // Minimalist
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'MD',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Blog', url: '', highlight: false },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Projects', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Newsletter', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'DIVIDER',
        content: { style: 'LINE', spacing: 'MD' },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'twitter', url: 'https://x.com' },
            { platform: 'github', url: 'https://github.com' },
          ]
        },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#121212', // Almost Black
      buttonShape: 'ROUNDED',
      buttonStyle: 'OUTLINE',
      buttonColor: '#ffffff',
      buttonTextColor: '#ffffff',
      buttonShadow: 'NONE',
      font: 'Inter',
      textColor: '#a3a3a3', // Neutral 400
      socialStyle: 'OUTLINE',
      socialIconColor: '#ffffff',
      socialIconSize: 'SM',
      pageMaxWidth: 480,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Minimal personal page.' }
  },

  // 8. Creative Gradient (New)
  {
    id: 'personal-gradient',
    name: 'Creative Aura',
    description: 'Vibrant, colorful background for personalities.',
    icon: '',
    category: 'PERSONAL',
    previewColor: '#22d3ee',
    profile: {
      bio: 'Artist & Dreamer \n Spreading positivity ✨',
      avatarUrl: 'https://images.unsplash.com/photo-1534030347209-567898bb690f?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'See My Art', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Join the Community', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Inspiration', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop', // Abstract Art
          alt: 'Art'
        },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'instagram', url: 'https://instagram.com' },
            { platform: 'tiktok', url: 'https://tiktok.com' },
          ]
        },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'GRADIENT',
      gradientStart: '#22d3ee', // Cyan
      gradientEnd: '#a855f7', // Purple
      gradientDirection: 'to bottom right',
      buttonShape: 'PILL',
      buttonStyle: 'FILLED',
      buttonColor: '#ffffff',
      buttonTextColor: '#a855f7',
      buttonShadow: 'GLOW',
      font: 'Poppins',
      textColor: '#ffffff',
      socialStyle: 'FILLED',
      socialIconColor: '#ffffff',
      socialIconSize: 'LG',
      pageMaxWidth: 520,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Creative portfolio.' }
  }
];
