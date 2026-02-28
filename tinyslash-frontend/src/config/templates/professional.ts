import { Template } from './types';

export const professionalTemplates: Template[] = [
  // 1. Medical Professional / Clinic
  {
    id: 'prof-medical',
    name: 'Medical Professional',
    description: 'Clean, trustworthy design for doctors and clinics.',
    icon: '',
    category: 'PROFESSIONAL',
    previewColor: '#f0fdfa',
    profile: {
      bio: 'Board Certified Dermatologist | Accepting New Patients',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
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
        content: { title: 'Patient Portal Login', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Clinic Information', align: 'left' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: '📍 450 Health Way, Suite 100\n📞 (555) 123-4567\nMon-Fri: 8am - 5pm', align: 'left' },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Accepted Insurance Plans', url: '', highlight: false },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'linkedin', url: 'https://linkedin.com' }] },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#f0fdfa', // Teal 50
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#0f766e', // Teal 700
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Inter',
      textColor: '#134e4a', // Teal 900
      socialStyle: 'OUTLINE',
      socialIconColor: '#0f766e',
      socialIconSize: 'MD',
      pageMaxWidth: 560,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Medical Practice & Appointments' }
  },

  // 2. Law Firm / Attorney
  {
    id: 'prof-legal',
    name: 'Corporate Attorney',
    description: 'Authoritative and highly professional layout for lawyers.',
    icon: '',
    category: 'PROFESSIONAL',
    previewColor: '#f8fafc',
    profile: {
      bio: 'Partner at Smith & Associates | Corporate Law Specialist',
      avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Schedule a Free Consultation', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Our Practice Areas', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Recent Publications', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Navigating Corporate Compliance in 2024', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'TEXT',
        content: { text: 'Confidentiality Assured.', align: 'center' },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'linkedin', url: 'https://linkedin.com' }] },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#f8fafc', // Slate 50
      buttonShape: 'SHARP',
      buttonStyle: 'FILLED',
      buttonColor: '#1e293b', // Slate 800
      buttonTextColor: '#ffffff',
      buttonShadow: 'NONE',
      font: 'Playfair Display', // Serif for authority
      textColor: '#0f172a', // Slate 900
      socialStyle: 'FILLED',
      socialIconColor: '#1e293b',
      socialIconSize: 'SM',
      pageMaxWidth: 600,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Legal Services & Consultation' }
  },

  // 3. Real Estate / Property (New)
  {
    id: 'prof-realestate',
    name: 'Real Estate & Property',
    description: 'Showcase property listings and book showings.',
    icon: '',
    category: 'PROFESSIONAL',
    previewColor: '#f1f5f9',
    profile: {
      bio: 'Luxury Real Estate Broker | Over $50M Sold',
      avatarUrl: 'https://images.unsplash.com/photo-1560518846-bc5b1287c71f?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'View My Active Listings', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Book a Property Showing', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Featured Property', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'IMAGE',
        content: {
          url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1000&auto=format&fit=crop', // House
          alt: 'Luxury Home'
        },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Get a Free Home Valuation', url: '', highlight: false },
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
      backgroundType: 'SOLID',
      background: '#f1f5f9', // Slate 100
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#334155', // Slate 700
      buttonTextColor: '#ffffff',
      buttonShadow: 'STRONG',
      font: 'Inter',
      textColor: '#0f172a',
      socialStyle: 'FILLED',
      socialIconColor: '#334155',
      socialIconSize: 'MD',
      pageMaxWidth: 540,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Real Estate Listings & Contact' }
  },

  // 4. Finance / CA / Investment (New)
  {
    id: 'prof-finance',
    name: 'Finance & Accounting',
    description: 'High-trust layout for CPAs, planners, and investment advisors.',
    icon: '',
    category: 'PROFESSIONAL',
    previewColor: '#fefce8',
    profile: {
      bio: 'Certified Public Accountant (CPA) & Wealth Manager',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Client Portal Login', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Schedule Tax Review', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Resources', align: 'left' },
        visible: true,
        order: 2
      },
      {
        type: 'LINK',
        content: { title: 'Tax Preparation Checklist (PDF)', url: '', highlight: false },
        visible: true,
        order: 3
      },
      {
        type: 'TEXT',
        content: { text: 'Information shared is for educational purposes only.', align: 'center' },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'linkedin', url: 'https://linkedin.com' }] },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#fefce8', // Yellow 50
      buttonShape: 'SHARP',
      buttonStyle: 'OUTLINE',
      buttonColor: '#854d0e', // Yellow 800
      buttonTextColor: '#422006',
      buttonShadow: 'NONE',
      font: 'Georgia', // Traditional serif
      textColor: '#422006',
      socialStyle: 'OUTLINE',
      socialIconColor: '#854d0e',
      socialIconSize: 'SM',
      pageMaxWidth: 560,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Financial Services & Advising' }
  },

  // 5. Supreme Court Advocate India (New - Indian Market)
  {
    id: 'prof-advocate',
    name: 'Supreme Court Advocate',
    description: 'Authoritative, traditional law layout commonly used by Indian advocates.',
    icon: '',
    category: 'PROFESSIONAL',
    previewColor: '#f1f5f9',
    profile: {
      bio: 'Advocate, Supreme Court of India & Delhi High Court | Civil & Criminal Law.',
      avatarUrl: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Book Legal Consultation', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'HEADER',
        content: { text: 'Practice Areas', align: 'left' },
        visible: true,
        order: 1
      },
      {
        type: 'TEXT',
        content: { text: '• Constitutional Law\n• Corporate Litigation\n• Family Disputes\n• Property Law', align: 'left' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: 'Chamber: Supreme Court Lawyers Chambers, New Delhi', align: 'center' },
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
      background: '#f8fafc', // Slate 50
      buttonShape: 'SHARP',
      buttonStyle: 'FILLED',
      buttonColor: '#1e293b', // Slate 800
      buttonTextColor: '#ffffff',
      buttonShadow: 'NONE',
      font: 'Georgia', // Authoritative Serif
      textColor: '#0f172a',
      socialStyle: 'OUTLINE',
      socialIconColor: '#1e293b',
      socialIconSize: 'MD',
      pageMaxWidth: 600,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Legal Services & Advocate Profile' }
  },

  // 6. Private Clinic / Hospital India (New - Indian Market)
  {
    id: 'prof-clinicindia',
    name: 'Private Healthcare Clinic',
    description: 'Clean, multi-doctor clinic layout for local Indian healthcare centers.',
    icon: '',
    category: 'PROFESSIONAL',
    previewColor: '#e0f2fe',
    profile: {
      bio: 'Advanced Multi-Speciality Clinic | Caring for the Community.',
      avatarUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'ROUNDED',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Book Doctor Appointment', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Order Medicines Online', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Clinic Timings', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: 'Morning: 9 AM - 1 PM\nEvening: 5 PM - 9 PM\n(Sunday Closed)', align: 'center' },
        visible: true,
        order: 3
      },
      {
        type: 'LINK',
        content: { title: 'Get Google Map Directions', url: 'https://maps.google.com', highlight: false },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'whatsapp', url: 'https://whatsapp.com' }] },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#f0f9ff', // Sky 50
      buttonShape: 'ROUNDED',
      buttonStyle: 'FILLED',
      buttonColor: '#0284c7', // Sky 600
      buttonTextColor: '#ffffff',
      buttonShadow: 'SUBTLE',
      font: 'Inter',
      textColor: '#0c4a6e',
      socialStyle: 'FILLED',
      socialIconColor: '#0284c7',
      socialIconSize: 'LG',
      pageMaxWidth: 540,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Multi-Speciality Clinic Booking' }
  },

  // 7. CA Firm India (New - Indian Market)
  {
    id: 'prof-cafirm',
    name: 'Chartered Accountant (CA) Firm',
    description: 'Highly professional tax and audit services layout.',
    icon: '',
    category: 'PROFESSIONAL',
    previewColor: '#f1f5f9',
    profile: {
      bio: 'Leading CA Firm | Audit, Taxation, GST & Company Registration.',
      avatarUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'SQUARE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Income Tax Return (ITR) Filing', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'GST Registration & Filing', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'LINK',
        content: { title: 'Company Incorporation Services', url: '', highlight: false },
        visible: true,
        order: 2
      },
      {
        type: 'HEADER',
        content: { text: 'Contact Us', align: 'left' },
        visible: true,
        order: 3
      },
      {
        type: 'TEXT',
        content: { text: 'Email: office@cafirm.in\nPhone: +91 98765 43210', align: 'left' },
        visible: true,
        order: 4
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'linkedin', url: 'https://linkedin.com' }, { platform: 'twitter', url: 'https://x.com' }] },
        visible: true,
        order: 5
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#f8fafc',
      buttonShape: 'SHARP',
      buttonStyle: 'OUTLINE',
      buttonColor: '#334155',
      buttonTextColor: '#0f172a',
      buttonShadow: 'NONE',
      font: 'Roboto',
      textColor: '#0f172a',
      socialStyle: 'MONOCHROME',
      socialIconColor: '#334155',
      socialIconSize: 'SM',
      pageMaxWidth: 560,
      contentSpacing: 'COMPACT',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'CA Firm - Tax & Audit Services' }
  },

  // 8. Global Remote Consultant (New - Global Market)
  {
    id: 'prof-remoteconsult',
    name: 'Remote Tech Consultant',
    description: 'Modern, high-converting layout for independent experts and digital nomads.',
    icon: '',
    category: 'PROFESSIONAL',
    previewColor: '#faf5ff',
    profile: {
      bio: 'Fractional CTO & Cloud Architect | Scaling Startups globally.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'LG',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Book a 30-Min Discovery Call', url: 'https://calendly.com', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Read My Engineering Blog', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'My Expertise', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: 'AWS/GCP Cloud Migration | DevOps | Team Scaling', align: 'center' },
        visible: true,
        order: 3
      },
      {
        type: 'SOCIAL',
        content: { style: 'ICONS', platforms: [{ platform: 'github', url: 'https://github.com' }, { platform: 'linkedin', url: 'https://linkedin.com' }] },
        visible: true,
        order: 4
      }
    ],
    theme: {
      backgroundType: 'SOLID',
      background: '#faf5ff', // Purple 50
      buttonShape: 'PILL',
      buttonStyle: 'FILLED',
      buttonColor: '#7e22ce', // Purple 700
      buttonTextColor: '#ffffff',
      buttonShadow: 'STRONG',
      font: 'Inter',
      textColor: '#4c1d95',
      socialStyle: 'FILLED',
      socialIconColor: '#7e22ce',
      socialIconSize: 'MD',
      pageMaxWidth: 500,
      contentSpacing: 'NORMAL',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Tech Consulting & Fractional CTO' }
  },

  // 9. Vastu / Feng Shui Consultant (New - Indian/Global Market)
  {
    id: 'prof-vastu',
    name: 'Vastu & Feng Shui Expert',
    description: 'Serene, balanced design for energy, astrology, and space consultants.',
    icon: '',
    category: 'PROFESSIONAL',
    previewColor: '#fffbeb',
    profile: {
      bio: 'Certified Vastu Shastra & Feng Shui Consultant. Harmonizing your spaces. ✨',
      avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=500&auto=format&fit=crop',
      profileImageStyle: 'CIRCLE',
      profileImageSize: 'MD',
      nameSize: 'LG',
    },
    blocks: [
      {
        type: 'LINK',
        content: { title: 'Book Home Vastu Analysis', url: '', highlight: true },
        visible: true,
        order: 0
      },
      {
        type: 'LINK',
        content: { title: 'Office Space Energy Audit', url: '', highlight: false },
        visible: true,
        order: 1
      },
      {
        type: 'HEADER',
        content: { text: 'Testimonials', align: 'center' },
        visible: true,
        order: 2
      },
      {
        type: 'TEXT',
        content: { text: '"Our business grew 3x after the Vastu corrections." - Sharma Traders', align: 'center' },
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
      gradientStart: '#fffbeb', // Amber 50
      gradientEnd: '#fef3c7', // Amber 100
      gradientDirection: 'to bottom',
      buttonShape: 'ROUNDED',
      buttonStyle: 'OUTLINE',
      buttonColor: '#b45309', // Amber 700
      buttonTextColor: '#78350f',
      buttonShadow: 'NONE',
      font: 'Playfair Display',
      textColor: '#78350f',
      socialStyle: 'OUTLINE',
      socialIconColor: '#b45309',
      socialIconSize: 'LG',
      pageMaxWidth: 540,
      contentSpacing: 'RELAXED',
      bannerType: 'NONE'
    },
    settings: { metaTitle: 'Vastu Shastra & Feng Shui' }
  }
];
