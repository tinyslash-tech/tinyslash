import { Template } from './types';

export const portfolioTemplates: Template[] = [
  // 1. Modern Portfolio (Existing)
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

  // 2. Photographer
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

  // 3. Developer / Coder
  {
    id: 'portfolio-dev',
    name: 'Software Engineer',
    description: 'Minimal terminal-style for developers.',
    icon: '',
    category: 'PORTFOLIO',
    previewColor: '#0f172a',
    profile: {
      bio: 'Full Stack Dev | React • Node • TypeScript',
      avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'ROUNDED',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'HEADER',
        content: { text: '> Projects', align: 'left' },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'github.com/my-repo', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'View Live Demo', url: '', highlight: true },
        visible: true,
        order: 2
      },
      {
        type: 'HEADER',
        content: { text: '> Contact', align: 'left' },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Download CV.pdf', url: '', highlight: false },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'github', url: 'https://github.com' },
            { platform: 'linkedin', url: 'https://linkedin.com' },
          ]
        },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#0f172a',
      buttonShape: 'SHARP',
      buttonStyle: 'OUTLINE',
      buttonColor: '#38bdf8', // Neon blue
      buttonTextColor: '#38bdf8',
      buttonShadow: 'NONE',
      font: 'Courier Prime', // Monospace if available, relying on default fallbacks usually unless configured
      textColor: '#94a3b8',
      socialStyle: 'MONOCHROME',
      socialIconColor: '#38bdf8',
      socialIconSize: 'MD',
      pageMaxWidth: 560,
      contentSpacing: 'COMPACT',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Software engineer portfolio.' }
  },

  // 4. Placement Ready (Tech Student)
  {
    id: 'portfolio-student-tech',
    name: 'Placement Ready',
    description: 'Perfect for CS/IT students preparing for placements.',
    icon: '',
    category: 'PORTFOLIO',
    previewColor: '#ffffff',
    profile: {
      bio: 'Final Year CSE Undergrad | Ex-Intern @ TechCorp \n 500+ DSA Problems Solved',
      avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'View My Resume (PDF)', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'HEADER',
        content: { text: 'Coding Profiles', align: 'center' },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'LeetCode Profile (Rating: 1800+)', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'GitHub Projects', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'HEADER',
        content: { text: 'Featured Project', align: 'center' },
        visible: true,
        order: 4
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1000&auto=format&fit=crop',
          alt: 'Project Screenshot'
        },
        visible: true,
        order: 5
      },
      {
        type: 'LINK',
        content: { title: 'AI Chatbot Project Demo', url: '', highlight: false },
        visible: true,
        order: 6
      },
      {
        type: 'SOCIAL',
        content: {
          style: 'ICONS',
          platforms: [
            { platform: 'linkedin', url: 'https://linkedin.com' },
            { platform: 'github', url: 'https://github.com' },
            { platform: 'twitter', url: 'https://x.com' },
          ]
        },
        visible: true,
        order: 7
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#ffffff',
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#27272a', // Zinc 800
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Inter',
      textColor: '#18181b', // Zinc 900
      socialStyle: 'FILLED',
      socialIconColor: '#27272a',
      socialIconSize: 'SM',
      pageMaxWidth: 560,
      contentSpacing: 'COMPACT',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Student portfolio and resume.' }
  },

  // 5. MBA / B-School Student
  {
    id: 'portfolio-student-mba',
    name: 'Future Leader',
    description: 'Professional profile for MBA & Management students.',
    icon: '',
    category: 'PORTFOLIO',
    previewColor: '#f0f9ff',
    profile: {
      bio: 'MBA Candidate @ Top B-School \n Marketing & Strategy Enthusiast',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'HEADER',
        content: { text: 'Professional Summary', align: 'center' },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Connect on LinkedIn', url: 'https://linkedin.com', highlight: true },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Download CV', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'HEADER',
        content: { text: 'Case Studies & Publications', align: 'center' },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Market Analysis Report 2024', url: '', highlight: false },
        visible: true,
        order: 4
      },
      {
        type: 'LINK',
        content: { title: 'Winning Pitch Deck - Hackathon', url: '', highlight: false },
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
      background: '#f0f9ff', // Sky 50
      buttonShape: 'SHARP',
      buttonStyle: 'OUTLINE',
      buttonColor: '#0369a1', // Sky 700
      buttonTextColor: '#0369a1',
      buttonShadow: 'NONE',
      font: 'Georgia', // Traditional/Serif
      textColor: '#0c4a6e', // Sky 900
      socialStyle: 'OUTLINE',
      socialIconColor: '#0369a1',
      socialIconSize: 'MD',
      pageMaxWidth: 600,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'MBA professional profile.' }
  },

  // 6. Medical Student (Medico)
  {
    id: 'portfolio-student-med',
    name: 'Medical Student',
    description: 'Clean, academic layout for medical professionals.',
    icon: '',
    category: 'PORTFOLIO',
    previewColor: '#f5f7fa',
    profile: {
      bio: 'MBBS Student & Researcher \n Aspiring Cardiologist',
      avatarUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'HEADER',
        content: { text: 'Academic & Research', align: 'center' },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Read Research Papers', url: '', highlight: true },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Medical Notes & Blog', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop', // Stethoscope/Medical
          alt: 'Medical'
        },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Volunteer Experience', url: '', highlight: false },
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
            { platform: 'instagram', url: 'https://instagram.com' },
          ]
        },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#f5f7fa', // Cool grey
      buttonShape: 'PILL',
      buttonStyle: 'FILLED',
      buttonColor: '#0d9488', // Teal 600
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'DM Sans',
      textColor: '#111827', // Grey 900
      socialStyle: 'FILLED',
      socialIconColor: '#0d9488',
      socialIconSize: 'SM',
      pageMaxWidth: 540,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaDescription: 'Medical student profile.' }
  }
];
