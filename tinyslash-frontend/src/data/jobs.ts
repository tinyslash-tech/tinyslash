export interface Job {
  id: string;
  title: string;
  department: 'Engineering' | 'Design' | 'Marketing' | 'Product' | 'Support';
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experience: string;
  salary?: string;
  postedDate: string;
  description: string;
  responsibilities: string[];
  requirements: {
    mustHave: string[];
    niceToHave: string[];
  };
  benefits: string[];
}

export const jobs: Job[] = [
  // Full-time Roles
  {
    id: '20260001',
    title: 'Founding Frontend Engineer',
    department: 'Engineering',
    location: 'Hyderabad, India (Remote)',
    type: 'Full-time',
    experience: '2–4 yrs',
    salary: '₹12,00,000 - ₹18,00,000 PA',
    postedDate: '2026-01-02',
    description: 'As a Founding Frontend Engineer at TinySlash, you will own the entire frontend architecture. We are in the early stages, so your code will directly impact the user experience of thousands of users. You will work directly with the founders to ship features fast.',
    responsibilities: [
      'Architect and build scalable frontend systems using React.js and TypeScript.',
      'Own the design system and ensure consistency across the platform.',
      'Optimize performance for high-traffic public links.',
      'Ship product features from idea to production in days, not weeks.',
      'Mentor junior developers as the team grows.'
    ],
    requirements: {
      mustHave: [
        'Strong mastery of React, TypeScript, and Tailwind CSS.',
        'Experience building high-performance, responsive web applications.',
        'Ability to work in a fast-paced, undefined environment.',
        'Eye for design and attention to UI/UX details.'
      ],
      niceToHave: [
        'Experience with Next.js App Router.',
        'Open source contributions.',
        'Previous startup experience.'
      ]
    },
    benefits: [
      'Competitive Salary + ESOPs',
      'MacBook Pro provided',
      'Unlimited Leave Policy',
      'Annual Learning Budget',
      'Health Insurance'
    ]
  },
  {
    id: '20260002',
    title: 'Backend Engineer (Node.js)',
    department: 'Engineering',
    location: 'Hyderabad, India (Remote)',
    type: 'Full-time',
    experience: '3–5 yrs',
    salary: '₹15,00,000 - ₹22,00,000 PA',
    postedDate: '2026-01-04',
    description: 'We are looking for a backend engineer who loves scalability. You will be building the core link redirection engine that needs to handle millions of requests with sub-millisecond latency.',
    responsibilities: [
      'Design high-throughput APIs using Node.js and Redis.',
      'Optimize database queries for MongoDB and PostgreSQL.',
      'Implement analytics processing pipelines.',
      'Ensure 99.99% uptime for core services.',
      'Set up CI/CD pipelines and infrastructure monitoring.'
    ],
    requirements: {
      mustHave: [
        'Deep understanding of Node.js event loop and async programming.',
        'Experience with Redis, caching strategies, and message queues.',
        'Strong knowledge of database design (SQL & NoSQL).',
        'Experience deploying to AWS or similar cloud providers.'
      ],
      niceToHave: [
        'Experience with Golang or Rust.',
        'Knowledge of system design patterns.',
        'Experience with Docker and Kubernetes.'
      ]
    },
    benefits: [
      'Competitive Salary + ESOPs',
      'Flexible Working Hours',
      'Remote-first Culture',
      'Latest Tech Stack',
      'Quarterly Retreats'
    ]
  },
  {
    id: '20260003',
    title: 'Product Design Lead',
    department: 'Design',
    location: 'Remote (India)',
    type: 'Contract',
    experience: '3+ yrs',
    salary: '₹80,000 - ₹1,20,000 / month',
    postedDate: '2026-01-05',
    description: 'We need a visionary designer to set the visual tone for TinySlash. You will design not just the UI, but the entire user journey. We want our product to feel "magical".',
    responsibilities: [
      'Create high-fidelity mockups and prototypes in Figma.',
      'Design comprehensive design systems and component libraries.',
      'Conduct user research and usability testing.',
      'Collaborate with engineers to ensure pixel-perfect implementation.',
      'Design marketing assets and branding materials.'
    ],
    requirements: {
      mustHave: [
        'A stunning portfolio displaying SaaS product design.',
        'Mastery of Figma and prototyping tools.',
        'Understanding of modern web constraints (CSS/HTML).',
        'Ability to simplify complex workflows into intuitive UIs.'
      ],
      niceToHave: [
        'Experience with Framer or Webflow.',
        'Motion design skills.',
        'Basic frontend coding skills.'
      ]
    },
    benefits: [
      'Flexible Schedule',
      'High Autonomy',
      'Performance Bonuses',
      'Opportunity for Full-time conversion'
    ]
  },

  // Internships
  {
    id: '20260010',
    title: 'SDE Intern (Summer 2026)',
    department: 'Engineering',
    location: 'Hyderabad / Remote',
    type: 'Internship',
    experience: 'Student',
    salary: '₹25,000 - ₹40,000 / month',
    postedDate: '2026-01-01',
    description: 'Join our Summer Internship program and ship real code to production. This is not a "fetch coffee" internship. You will work on real features, fix bugs, and learn from senior engineers.',
    responsibilities: [
      'Build and improve UI components using React and Tailwind.',
      'Write unit and integration tests.',
      'Participate in code reviews and engineering discussions.',
      'Work on a dedicated summer project end-to-end.'
    ],
    requirements: {
      mustHave: [
        'Strong knowledge of JavaScript/TypeScript.',
        'Experience building personal projects with React.',
        'Good problem-solving skills (DSA basics).',
        'Eagerness to learn and adapt.'
      ],
      niceToHave: [
        'Contribution to open-source projects.',
        'Knowledge of backend basics (Node.js/Express).'
      ]
    },
    benefits: [
      'Competitive Stipend',
      'Mentorship from Founders',
      'Pre-Placement Offer (PPO) potential',
      'Flexible Hours',
      'Certificate of Completion'
    ]
  },
  {
    id: '20260011',
    title: 'Product Marketing Intern (Summer 2026)',
    department: 'Marketing',
    location: 'Remote',
    type: 'Internship',
    experience: 'Student',
    salary: '₹15,000 - ₹25,000 / month',
    postedDate: '2026-01-01',
    description: 'Help us tell the TinySlash story. You will work on content strategy, social media growth, and community building during our Summer 2026 program.',
    responsibilities: [
      'Create engaging content for Twitter/X and LinkedIn.',
      'Assist with launch campaigns for new features.',
      'Engage with user communities and gather feedback.',
      'Analyze marketing metrics and suggest improvements.'
    ],
    requirements: {
      mustHave: [
        'Excellent written and verbal communication.',
        'Strong grasp of social media trends.',
        'Creative mindset and storytelling ability.',
        'Self-starter with high energy.'
      ],
      niceToHave: [
        'Design skills (Canva/Figma).',
        'Video editing skills (Reels/Shorts).'
      ]
    },
    benefits: [
      'Performance-based Bonus',
      'Network with Industry Leaders',
      'PPO Potential',
      'Remote Work'
    ]
  }
];
