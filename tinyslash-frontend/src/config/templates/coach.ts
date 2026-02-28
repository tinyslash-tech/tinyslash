import { Template } from './types';

export const coachTemplates: Template[] = [
  // 1. Life Coach
  {
    id: 'coach-life',
    name: 'Life Coach',
    description: 'Empowering and warm template for life Coaches.',
    icon: '',
    category: 'COACH_WELLNESS',
    previewColor: '#fee2e2',
    profile: {
      bio: 'Helping you unlock your true potential | Certified Life Coach',
      avatarUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Book a Discovery Call', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Download My Free Guide', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Programs', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: '1-on-1 Coaching Program', url: '', highlight: false },
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
      background: '#fef2f2',
      buttonShape: 'PILL',
      buttonStyle: 'FILLED',
      buttonColor: '#ef4444',
      buttonTextColor: '#ffffff',
      buttonShadow: 'STRONG',
      font: 'Lora',
      textColor: '#7f1d1d',
      socialStyle: 'OUTLINE',
      socialIconColor: '#ef4444',
      socialIconSize: 'MD',
      pageMaxWidth: 550,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE',
      blockBackgroundColor: 'rgba(255, 255, 255, 0.7)',
      blockBorderColor: 'transparent',
      blockShadow: 'MD',
      blockCornerRadius: 'ROUNDED'
    },
    settings: { metaTitle: 'Life Coaching & Mentorship' }
  },
  // 2. Fitness Coach
  {
    id: 'coach-fitness',
    name: 'Fitness Coach',
    description: 'High-energy and bold for personal trainers.',
    icon: '',
    category: 'COACH_WELLNESS',
    previewColor: '#111827',
    profile: {
      bio: 'Transforming Lives Through Fitness | Online PT',
      avatarUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
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
        type: 'LINK',
        content: { title: 'View Transformation Gallery', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Training Programs', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: '8-Week Shred Plan', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Custom Meal Plans', url: '', highlight: false },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'youtube', url: 'https://youtube.com' }] },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#1f2937',
      buttonShape: 'SHARP',
      buttonStyle: 'FILLED',
      buttonColor: '#f97316',
      buttonTextColor: '#ffffff',
      buttonShadow: 'NONE',
      font: 'Oswald',
      textColor: '#f3f4f6',
      socialStyle: 'FILLED',
      socialIconColor: '#f97316',
      socialIconSize: 'MD',
      pageMaxWidth: 600,
      contentSpacing: 'COMPACT',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Online Fitness Coaching' }
  },
  // 3. Executive Coach
  {
    id: 'coach-executive',
    name: 'Executive Coach',
    description: 'Polished and professional for leadership coaching.',
    icon: '',
    category: 'COACH_WELLNESS',
    previewColor: '#e0e7ff',
    profile: {
      bio: 'Leadership Consultant & Executive Coach | MBA',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500&auto=format&fit=crop',
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
        content: { title: 'Read My Latest Forbes Article', url: '', highlight: false },
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
        type: 'LINK',
        content: { title: 'C-Suite Mentoring', url: '', highlight: false },
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
      buttonColor: '#3b82f6',
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Inter',
      textColor: '#1e293b',
      socialStyle: 'OUTLINE',
      socialIconColor: '#3b82f6',
      socialIconSize: 'SM',
      pageMaxWidth: 640,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Executive Leadership Coaching' }
  },
  // 4. Relationship Coach
  {
    id: 'coach-relationship',
    name: 'Relationship Coach',
    description: 'Soft, calming design for relationship experts.',
    icon: '',
    category: 'COACH_WELLNESS',
    previewColor: '#fce7f3',
    profile: {
      bio: 'Guiding couples & individuals to happier relationships.',
      avatarUrl: 'https://images.unsplash.com/photo-1521572008054-d30f40ad3d7e?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Book a Session', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Couples Retreat Waitlist', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Free Resources', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Communication Guide PDF', url: '', highlight: false },
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
      background: '#fdf2f8',
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#ec4899',
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Playfair Display',
      textColor: '#831843',
      socialStyle: 'MONOCHROME',
      socialIconColor: '#ec4899',
      socialIconSize: 'MD',
      pageMaxWidth: 500,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Relationship Coaching Services' }
  },
  // 5. Financial Coach
  {
    id: 'coach-financial',
    name: 'Financial Coach',
    description: 'Trustworthy and serious for financial advisors.',
    icon: '',
    category: 'COACH_WELLNESS',
    previewColor: '#dcfce7',
    profile: {
      bio: 'Master Your Personal Finances & Build Wealth',
      avatarUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Free 15-Min Financial Review', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Sign up for my Newsletter', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Courses', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Budgeting 101 Course', url: '', highlight: false },
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
      background: '#f0fdf4',
      buttonShape: 'ROUNDED',
      buttonStyle: 'OUTLINE',
      buttonColor: '#16a34a',
      buttonTextColor: '#14532d',
      buttonShadow: 'NONE',
      font: 'Inter',
      textColor: '#14532d',
      socialStyle: 'FILLED',
      socialIconColor: '#16a34a',
      socialIconSize: 'SM',
      pageMaxWidth: 540,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Personal Finance Coaching' }
  },
  // 6. Tutor / Course Creator (New)
  {
    id: 'coach-tutor',
    name: 'Tutor & Courses',
    description: 'Structured layout for educators and course creators.',
    icon: '',
    category: 'COACH_WELLNESS',
    previewColor: '#eff6ff',
    profile: {
      bio: 'Helping you master digital marketing | 10k+ Students',
      avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Enroll in my Masterclass', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'HEADER',
        content: { text: 'Free Resources', align: 'center' },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Download the Starter Kit', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Book 1:1 Tutoring', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'youtube', url: 'https://youtube.com' }] },
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
      buttonShadow: 'SUBTLE',
      font: 'Inter',
      textColor: '#1e3a8a',
      socialStyle: 'OUTLINE',
      socialIconColor: '#2563eb',
      socialIconSize: 'SM',
      pageMaxWidth: 540,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Online Courses & Tutoring' }
  },
  // 7. Spiritual / Healing (New)
  {
    id: 'coach-spiritual',
    name: 'Spiritual & Healing',
    description: 'Ethereal, calming design for mystics and healers.',
    icon: '',
    category: 'COACH_WELLNESS',
    previewColor: '#f5f3ff',
    profile: {
      bio: 'Astrologer & Energy Healer 🌙✨',
      avatarUrl: 'https://images.unsplash.com/photo-1620059535314-5d5d8fb85df7?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Book a Tarot Reading', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Get Your Birth Chart', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Monthly Guidance', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Join the Full Moon Circle', url: '', highlight: false },
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
      gradientStart: '#f5f3ff',
      gradientEnd: '#e0e7ff',
      gradientDirection: 'to bottom',
      buttonShape: 'PILL',
      buttonStyle: 'SOFT',
      buttonColor: '#8b5cf6',
      buttonTextColor: '#4c1d95',
      buttonShadow: 'NONE',
      font: 'Lora',
      textColor: '#4c1d95',
      socialStyle: 'MONOCHROME',
      socialIconColor: '#8b5cf6',
      socialIconSize: 'MD',
      pageMaxWidth: 500,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Spiritual Guidance & Healing' }
  },

  // 8. Yoga & Mindfulness Guru (New - Indian Market)
  {
    id: 'coach-yoga',
    name: 'Yoga & Mindfulness',
    description: 'Serene, earthy template for yoga instructors and spiritual guides.',
    icon: '',
    category: 'COACH_WELLNESS',
    previewColor: '#f4f1ea',
    profile: {
      bio: 'Certified Ashtanga Yoga Teacher 🧘‍♀️ | Daily Online Classes',
      avatarUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Join My Daily Live Yoga (Zoom)', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Book 1:1 Meditation Session', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Free Resources', align: 'center' },
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
        content: { style: 'ICONS', platforms: [{ platform: 'youtube', url: 'https://youtube.com' }, { platform: 'instagram', url: 'https://instagram.com' }] },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#fdfbf7', // Sand
      buttonShape: 'PILL',
      buttonStyle: 'FILLED',
      buttonColor: '#3f6212', // Olive Green
      buttonTextColor: '#ffffff',
      buttonShadow: 'NONE',
      font: 'Lora',
      textColor: '#1a2e05', // Dark Olive
      socialStyle: 'OUTLINE',
      socialIconColor: '#3f6212',
      socialIconSize: 'MD',
      pageMaxWidth: 540,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Yoga & Mindfulness Classes' }
  },

  // 9. UPSC / JEE Exam Tutor (New - Indian Market)
  {
    id: 'coach-examtutor',
    name: 'Exam Prep Tutor (UPSC/JEE)',
    description: 'Structured, highly focused layout for competitive exam tutors.',
    icon: '',
    category: 'COACH_WELLNESS',
    previewColor: '#f1f5f9',
    profile: {
      bio: 'Ex-IAS Officer | Guiding UPSC Aspirants | 500+ Selections',
      avatarUrl: 'https://images.unsplash.com/photo-1555328464-dc160fc45610?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Download Prelims Strategy PDF', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Enroll in Target 2026 Batch', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Daily Current Affairs', align: 'left' },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Join Telegram for Daily Notes', url: 'https://telegram.org', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'youtube', url: 'https://youtube.com' }] },
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
      buttonShadow: 'STRONG',
      font: 'Inter',
      textColor: '#0f172a',
      socialStyle: 'FILLED',
      socialIconColor: '#0f172a',
      socialIconSize: 'SM',
      pageMaxWidth: 600,
      contentSpacing: 'COMPACT',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Competitive Exam Preparation' }
  },

  // 10. Ayurvedic & Holistic Wellness (New - Indian Market)
  {
    id: 'coach-ayurveda',
    name: 'Ayurvedic Wellness',
    description: 'Natural, green palette for holistic healing and Ayurveda experts.',
    icon: '',
    category: 'COACH_WELLNESS',
    previewColor: '#f0fdf4',
    profile: {
      bio: 'Certified Ayurvedic Practitioner 🌿 | Holistic Health & Diets',
      avatarUrl: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Book an Ayurvedic Consultation', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Buy Natural Herbal Supplements', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1000&auto=format&fit=crop',
          alt: 'Ayurvedic Herbs'
        },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: 'Rebalance your Doshas naturally.', align: 'center' },
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
      gradientStart: '#f0fdf4', // Green 50
      gradientEnd: '#dcfce7', // Green 100
      gradientDirection: 'to bottom',
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#166534', // Green 800
      buttonTextColor: '#ffffff',
      buttonShadow: 'NONE',
      font: 'Lora',
      textColor: '#14532d', // Green 900
      socialStyle: 'OUTLINE',
      socialIconColor: '#166534',
      socialIconSize: 'MD',
      pageMaxWidth: 520,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Ayurvedic Health Consultation' }
  },

  // 11. Career & CA Mentor (New - Indian Market)
  {
    id: 'coach-careermentor',
    name: 'Career & CA Mentor',
    description: 'Corporate, trustworthy blue design for professional mentoring.',
    icon: '',
    category: 'COACH_WELLNESS',
    previewColor: '#eff6ff',
    profile: {
      bio: 'Chartered Accountant | Helping professionals fast-track their careers.',
      avatarUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Resume Review & Mock Interview', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'CA Articleship Guidance', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Free Tools', align: 'left' },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Download My Cold Email Templates', url: '', highlight: false },
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
      background: '#ffffff',
      buttonShape: 'SHARP',
      buttonStyle: 'OUTLINE',
      buttonColor: '#1e3a8a', // Blue 900
      buttonTextColor: '#1e3a8a',
      buttonShadow: 'NONE',
      font: 'Inter',
      textColor: '#1e3a8a',
      socialStyle: 'FILLED',
      socialIconColor: '#1e3a8a',
      socialIconSize: 'SM',
      pageMaxWidth: 560,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Career Mentorship & Guidance' }
  },

  // 12. Global Language Tutor (New - Global Market)
  {
    id: 'coach-language',
    name: 'Language Tutor',
    description: 'Friendly, accessible and colorful layout for language teachers.',
    icon: '',
    category: 'COACH_WELLNESS',
    previewColor: '#fef2f2',
    profile: {
      bio: 'Polyglot 🌎 | Learn Spanish & English with me! | 500+ Happy Students',
      avatarUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Book Trial Spanish Lesson', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Join Group Conversation Classes', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Learning Materials', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Top 100 Spanish Phrases (PDF)', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'tiktok', url: 'https://tiktok.com' }, { platform: 'youtube', url: 'https://youtube.com' }] },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#ffedd5', // Orange 100
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#ea580c', // Orange 600
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Poppins',
      textColor: '#9a3412', // Orange 800
      socialStyle: 'FILLED',
      socialIconColor: '#ea580c',
      socialIconSize: 'MD',
      pageMaxWidth: 500,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Online Language Tutoring' }
  }
];
