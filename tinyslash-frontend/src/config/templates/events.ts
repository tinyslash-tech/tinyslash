import { Template } from './types';

export const eventsTemplates: Template[] = [
  // 1. Conference & Speaking Event
  {
    id: 'events-conference',
    name: 'Conference & Events',
    description: 'Template for driving ticket sales and displaying schedules.',
    icon: '',
    category: 'EVENTS_NGO',
    previewColor: '#172554',
    profile: {
      bio: 'TechFront Summit 2024 | The Future of AI & Web',
      avatarUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'COUNTDOWN',
        content: {
          targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          title: 'Event Starts In:',
          style: 'flip',
          color: '#3b82f6',
        },
        visible: true,
        order: -1
      },
      {
        type: 'LINK',
        content: { title: 'Buy Early Bird Tickets', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'View Agenda & Speakers', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Location', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: 'Moscone Center\nSan Francisco, CA', align: 'center' },
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
      background: '#0f172a',
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#2563eb', // Blue
      buttonTextColor: '#ffffff',
      buttonShadow: 'GLOW',
      font: 'Inter',
      textColor: '#f8fafc',
      socialStyle: 'FILLED',
      socialIconColor: '#2563eb',
      socialIconSize: 'MD',
      pageMaxWidth: 600,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'TechFront Summit Tickets' }
  },

  // 2. NGO & Community Fundraiser
  {
    id: 'events-ngo',
    name: 'NGO & Fundraising',
    description: 'Heartwarming template centered on drives and donations.',
    icon: '',
    category: 'EVENTS_NGO',
    previewColor: '#f0fdf4',
    profile: {
      bio: 'Clean Oceans Initiative 🌊 | Protecting our marine life.',
      avatarUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073e0f?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'IMAGE',
        content: { url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop', alt: 'Ocean cleanup' },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Donate to our Cause ($10 = 1lb plastic removed)', url: '', highlight: true },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Volunteer for the Next Cleanup', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: 'Join our mission and make a tangible impact.', align: 'center' },
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
      background: '#f0fdf4', // Green 50
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#059669', // Emerald 600
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Lora',
      textColor: '#064e3b', // Emerald 900
      socialStyle: 'OUTLINE',
      socialIconColor: '#059669',
      socialIconSize: 'LG',
      pageMaxWidth: 560,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Support Clean Oceans Initiative' }
  },

  // 3. Indian Tech Summit / Hackathon (New - Indian Market)
  {
    id: 'events-hackathon',
    name: 'Tech Hackathon & Summit',
    description: 'High-energy, tech-focused layout for developer events in India.',
    icon: '',
    category: 'EVENTS_NGO',
    previewColor: '#0f172a',
    profile: {
      bio: 'India Web3 Hackathon 2025 | Build the Future of Finance 🚀',
      avatarUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'COUNTDOWN',
        content: {
          targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
          title: 'Registrations Close In:',
          style: 'flip',
          color: '#10b981', // Emerald
        },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Register Now (Free)', url: '', highlight: true },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Join Official Discord Server', url: 'https://discord.com', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'HEADER',
        content: { text: 'Prizes & Perks', align: 'left' },
        visible: true,
        order: 3
      },
      {
        type: 'TEXT',
        content: { text: '🏆 ₹5 Lakh Prize Pool\n🍕 Free Food & Swag\n💼 Hiring Opportunities', align: 'left' },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'twitter', url: 'https://x.com' }, { platform: 'linkedin', url: 'https://linkedin.com' }] },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#0f172a', // Slate 900
      buttonShape: 'SHARP',
      buttonStyle: 'FILLED',
      buttonColor: '#10b981', // Emerald 500
      buttonTextColor: '#ffffff',
      buttonShadow: 'GLOW',
      font: 'Roboto Mono', // Code font
      textColor: '#e2e8f0', // Slate 200
      socialStyle: 'FILLED',
      socialIconColor: '#10b981',
      socialIconSize: 'MD',
      pageMaxWidth: 600,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'India Web3 Hackathon Registration' }
  },

  // 4. Dandiya / Garba Night (New - Indian Market)
  {
    id: 'events-garba',
    name: 'Garba & Dandiya Night',
    description: 'Extremely festive, colorful layout for traditional Indian dance events.',
    icon: '',
    category: 'EVENTS_NGO',
    previewColor: '#fdf4ff',
    profile: {
      bio: 'Maha Navratri Utsav 2025 | Live Band & Free Dandiya Sticks 🪘',
      avatarUrl: 'https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Buy Passes (Early Bird - ₹499)', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000&auto=format&fit=crop', // Festive crowd
          alt: 'Garba Night Crowd'
        },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Event Details', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: 'Dates: 1st Oct - 9th Oct\nVenue: Sardar Patel Ground, Ahmedabad', align: 'center' },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Navigate to Venue', url: 'https://maps.google.com', highlight: false },
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
      gradientStart: '#fdf4ff', // Fuchsia 50
      gradientEnd: '#fae8ff', // Fuchsia 100
      gradientDirection: 'to bottom right',
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#d946ef', // Fuchsia 500
      buttonTextColor: '#ffffff',
      buttonShadow: 'STRONG',
      font: 'Lora',
      textColor: '#701a75', // Fuchsia 900
      socialStyle: 'FILLED',
      socialIconColor: '#d946ef',
      socialIconSize: 'LG',
      pageMaxWidth: 540,
      contentSpacing: 'COMPACT',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Maha Navratri Utsav Passes' }
  },

  // 5. Temple Fundraiser & Seva (New - Indian Market)
  {
    id: 'events-temple',
    name: 'Temple Fundraiser & Seva',
    description: 'Respectful, traditional orange-yellow theme for religious fundraising.',
    icon: '',
    category: 'EVENTS_NGO',
    previewColor: '#fffbeb',
    profile: {
      bio: 'Shri Ram Mandir Trust | Contribute to the Anna Daan Seva 🙏',
      avatarUrl: 'https://images.unsplash.com/photo-1590050720463-547e1eb8e86a?q=80&w=500&auto=format&fit=crop', // Temple
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Donate for Anna Daan (Food Seva)', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Contribute to Temple Construction', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Upcoming Utsav', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: 'Join us for the Maha Aarti every evening at 7 PM.', align: 'center' },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'youtube', url: 'https://youtube.com' }] }, // For live streams
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#fffbeb', // Amber 50
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#ea580c', // Orange 600
      buttonTextColor: '#ffffff',
      buttonShadow: 'NONE',
      font: 'Playfair Display',
      textColor: '#9a3412', // Orange 800
      socialStyle: 'OUTLINE',
      socialIconColor: '#ea580c',
      socialIconSize: 'MD',
      pageMaxWidth: 500,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Temple Seva & Donation' }
  },

  // 6. Music Concert & Festival (New - Global Market)
  {
    id: 'events-concert',
    name: 'Music Festival & Concert',
    description: 'Dark mode, neon-accented layout for music festivals and DJ nights.',
    icon: '',
    category: 'EVENTS_NGO',
    previewColor: '#000000',
    profile: {
      bio: 'NEON NIGHTS TOUR 2025 | Electronic Music Festival 🎧',
      avatarUrl: 'https://images.unsplash.com/photo-1470229722913-7c090b0626cb?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1533174000220-74f4b971aacf?q=80&w=1000&auto=format&fit=crop', // Festival crowd
          alt: 'Festival Lights'
        },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Buy VIP Tickets / Backstage Pass', url: '', highlight: true },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'View Artist Lineup', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'instagram', url: 'https://instagram.com' }, { platform: 'spotify', url: 'https://spotify.com' }] },
        visible: true,
        order: 3
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#030712', // Gray 950
      buttonShape: 'SHARP',
      buttonStyle: 'FILLED',
      buttonColor: '#ec4899', // Pink 500 (Neon)
      buttonTextColor: '#ffffff',
      buttonShadow: 'GLOW',
      font: 'Oswald',
      textColor: '#f9fafb', // Gray 50
      socialStyle: 'FILLED',
      socialIconColor: '#ec4899',
      socialIconSize: 'LG',
      pageMaxWidth: 600,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Neon Nights Tour Tickets' }
  },

  // 7. Global Webinar & Masterclass (New - Global Market)
  {
    id: 'events-webinar',
    name: 'Webinar & Masterclass',
    description: 'Clean, professional design for online webinars, masterclasses, and workshops.',
    icon: '',
    category: 'EVENTS_NGO',
    previewColor: '#eff6ff',
    profile: {
      bio: 'Mastering B2B Sales Masterclass | Live Online Training 📈',
      avatarUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'COUNTDOWN',
        content: {
          targetDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          title: 'Webinar Starts In:',
          style: 'standard',
          color: '#1d4ed8', // Blue 700
        },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Save Your Spot (Zoom Link)', url: '', highlight: true },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'What You Will Learn', align: 'left' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: '• outbound email strategies that convert at 30%\n• Handling objections on cold calls\n• Closing enterprise deals in Q4', align: 'left' },
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
      background: '#ffffff', // White
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#1d4ed8', // Blue 700
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Inter',
      textColor: '#0f172a',
      socialStyle: 'FILLED',
      socialIconColor: '#1d4ed8',
      socialIconSize: 'SM',
      pageMaxWidth: 560,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Free B2B Sales Masterclass' }
  }
];
