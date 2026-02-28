export type MonetizationFormat = 'LIVE' | 'ASYNC' | 'DIGITAL' | 'DONATION';

export type BusinessCategory =
  | 'Tech/Career Mentor'
  | 'Designer/Creative'
  | 'Business/Startup'
  | 'Finance Educator'
  | 'Fitness Coach'
  | 'Creator/Influencer'
  | 'Developer/Maker'
  | 'Marketing Consultant'
  | 'Educator/Tutor'
  | 'Other';

export interface MonetizationPreset {
  id: string;
  title: string;
  description: string;
  suggestedPrice: string;
  priceType?: 'FIXED' | 'PAY_WHAT_YOU_WANT' | 'FREE';
  monetizationType: 'DIGITAL_FILE' | 'SERVICE_LIVE' | 'SERVICE_ASYNC';
  icon?: string;
}

export const MONETIZATION_PRESETS: Record<MonetizationFormat, Record<BusinessCategory, MonetizationPreset[]> | MonetizationPreset[]> = {
  LIVE: {
    'Tech/Career Mentor': [
      { id: 'l_tech_1', title: 'Mock Interview (45 Min)', description: 'Simulated technical interview with actionable feedback to help you land your dream tech job.', suggestedPrice: '1999', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_tech_2', title: 'Resume Strategy Session', description: 'Deep dive into your resume to optimize it for ATS and hiring managers.', suggestedPrice: '999', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_tech_3', title: 'System Design Mock', description: 'Comprehensive system design interview practice for senior engineering roles.', suggestedPrice: '2499', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_tech_4', title: 'Salary Negotiation Coaching', description: 'Learn exact scripts and strategies to maximize your next tech offer.', suggestedPrice: '1499', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_tech_5', title: 'Career Roadmap Strategy', description: '1:1 call to map out your next career move and upskilling path.', suggestedPrice: '1499', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_tech_custom', title: 'Custom 1:1 Consultation', description: 'Book a 1:1 session to discuss anything related to tech and career growth.', suggestedPrice: '1999', monetizationType: 'SERVICE_LIVE' },
    ],
    'Designer/Creative': [
      { id: 'l_des_1', title: 'Portfolio Review Call', description: 'Live breakdown of your design portfolio to increase your client conversion rate.', suggestedPrice: '1499', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_des_2', title: 'UX Case Study Feedback', description: 'Detailed review of your UX case study structure, storytelling, and visuals.', suggestedPrice: '999', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_des_3', title: 'UI Design Audit', description: 'I will live-audit your app or website UI and provide immediate actionable feedback.', suggestedPrice: '1999', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_des_4', title: 'Brand Strategy Consultation', description: '1:1 session to define your brand voice, identity, and visual direction.', suggestedPrice: '2999', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_des_5', title: 'Freelance Strategy Session', description: 'Learn how to price your design work, find clients, and write better proposals.', suggestedPrice: '1499', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_des_custom', title: 'Custom Creative Consultation', description: 'Book a 1:1 call to discuss your design challenges or career.', suggestedPrice: '1499', monetizationType: 'SERVICE_LIVE' },
    ],
    'Business/Startup': [
      { id: 'l_biz_1', title: '60-Min Strategy Call', description: 'High-level business strategy session to unblock your growth bottlenecks.', suggestedPrice: '4999', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_biz_2', title: 'Pitch Deck Feedback Call', description: 'Live review of your startup pitch deck before you talk to investors.', suggestedPrice: '3999', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_biz_3', title: 'Growth Audit Session', description: 'Tear down your current acquisition channels and build a new growth engine.', suggestedPrice: '2999', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_biz_4', title: 'Product Review Session', description: 'Live teardown of your product onboarding and core user loop.', suggestedPrice: '2499', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_biz_custom', title: 'Custom Business Consultation', description: '1:1 advisory call for founders and business owners.', suggestedPrice: '4999', monetizationType: 'SERVICE_LIVE' },
    ],
    'Finance Educator': [
      { id: 'l_fin_1', title: 'Personal Finance Planning', description: '1:1 call to structure your emergency fund, savings, and basic investments.', suggestedPrice: '1999', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_fin_2', title: 'Stock Portfolio Review', description: 'Live analysis of your current equity portfolio and asset allocation.', suggestedPrice: '2499', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_fin_3', title: 'Options Strategy Session', description: 'Advanced coaching on derivatives, hedging, and options trading strategies.', suggestedPrice: '3499', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_fin_4', title: 'Investment Basics Coaching', description: 'A beginner-friendly session explaining mutual funds, stocks, and compounding.', suggestedPrice: '999', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_fin_custom', title: 'Custom Finance Advisory', description: 'Book a 1:1 call to discuss your specific financial questions.', suggestedPrice: '1999', monetizationType: 'SERVICE_LIVE' },
    ],
    'Fitness Coach': [
      { id: 'l_fit_1', title: 'Fitness Consultation', description: 'Initial assessment of your goals, current routine, and dietary habits.', suggestedPrice: '999', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_fit_2', title: 'Diet Plan Discussion', description: 'Live session to craft a sustainable nutrition plan tailored to your lifestyle.', suggestedPrice: '1499', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_fit_3', title: 'Form Correction Session', description: 'Live video call to assess and correct your form for compound lifts.', suggestedPrice: '1299', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_fit_4', title: 'Fat Loss Strategy Call', description: 'Develop a realistic, science-based approach to losing fat and keeping it off.', suggestedPrice: '999', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_fit_custom', title: 'Custom Coaching Session', description: '1:1 fitness coaching call to review your progress.', suggestedPrice: '999', monetizationType: 'SERVICE_LIVE' },
    ],
    'Creator/Influencer': [
      { id: 'l_cre_1', title: '1:1 Creator Growth Call', description: 'Strategy session to grow your audience and build your personal brand.', suggestedPrice: '1999', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_cre_2', title: 'YouTube Channel Audit', description: 'Live teardown of your thumbnails, titles, retention graphs, and content strategy.', suggestedPrice: '2499', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_cre_3', title: 'Instagram Strategy Session', description: 'Learn how to master Reels, stories, and the algorithm to scale your page.', suggestedPrice: '1499', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_cre_4', title: 'Brand Collab Consultation', description: 'Learn how to pitch to brands, set your rates, and negotiate sponsorships.', suggestedPrice: '1999', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_cre_custom', title: 'Custom Creator Consultation', description: '1:1 call to discuss your content creation journey.', suggestedPrice: '1999', monetizationType: 'SERVICE_LIVE' },
    ],
    'Developer/Maker': [
      { id: 'l_dev_1', title: 'Code Architecture Review', description: 'Live review of your tech stack, database schema, and system design.', suggestedPrice: '2999', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_dev_2', title: 'Pair Programming Session', description: '1:1 live debugging or building a feature together.', suggestedPrice: '1999', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_dev_3', title: 'SaaS Launch Strategy', description: 'Go-to-market strategy call for your new indie app or SaaS.', suggestedPrice: '2499', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_dev_custom', title: 'Custom Tech Consultation', description: 'Book a 1:1 call to discuss development, frameworks, or indie hacking.', suggestedPrice: '1999', monetizationType: 'SERVICE_LIVE' },
    ],
    'Marketing Consultant': [
      { id: 'l_mar_1', title: 'Marketing Strategy Call', description: 'High-level roadmap for your inbound and outbound marketing efforts.', suggestedPrice: '2999', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_mar_2', title: 'Ad Account Audit', description: 'Live review of your Meta/Google ads account to identify wasted spend.', suggestedPrice: '3499', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_mar_3', title: 'SEO Consultation', description: 'Actionable steps to improve your organic rankings and domain authority.', suggestedPrice: '1999', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_mar_custom', title: 'Custom Marketing Session', description: '1:1 advice on campaigns, copywriting, or funnels.', suggestedPrice: '2499', monetizationType: 'SERVICE_LIVE' },
    ],
    'Educator/Tutor': [
      { id: 'l_edu_1', title: '1:1 Tutoring Session', description: 'Personalized private tutoring session on a specific subject.', suggestedPrice: '999', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_edu_2', title: 'Exam Strategy & Prep', description: 'Guidance on how to structure your study plan for upcoming exams.', suggestedPrice: '799', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_edu_custom', title: 'Custom Live Class', description: 'Book me for a dedicated 1:1 learning session.', suggestedPrice: '999', monetizationType: 'SERVICE_LIVE' },
    ],
    'Other': [
      { id: 'l_oth_1', title: '1:1 Consultation Call', description: 'Book a time to chat with me directly about your goals and challenges.', suggestedPrice: '999', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_oth_2', title: 'Pick My Brain / Coffee Chat', description: 'A casual 30-minute chat to ask me anything.', suggestedPrice: '499', monetizationType: 'SERVICE_LIVE' },
      { id: 'l_oth_3', title: 'Strategy Session', description: 'A deep-dive session to map out your next steps.', suggestedPrice: '1499', monetizationType: 'SERVICE_LIVE' },
    ]
  },
  ASYNC: {
    'Tech/Career Mentor': [
      { id: 'a_tech_1', title: 'Resume Review (Async)', description: 'Send me your resume and I will send back an annotated PDF with improvements.', suggestedPrice: '499', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_tech_2', title: 'LinkedIn Profile Audit', description: 'I will review your LinkedIn profile and send a loom video with optimization tips.', suggestedPrice: '599', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_tech_3', title: 'GitHub Repo Review', description: 'Async code review of your personal project to make it interview-ready.', suggestedPrice: '999', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_tech_4', title: 'Priority DM Access', description: 'Ask me anything via email/DM. Guaranteed detailed reply within 24 hours.', suggestedPrice: '299', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_tech_custom', title: 'Custom Async Review', description: 'Submit your materials and I will provide detailed async feedback.', suggestedPrice: '499', monetizationType: 'SERVICE_ASYNC' },
    ],
    'Designer/Creative': [
      { id: 'a_des_1', title: 'Portfolio Audit (Video)', description: 'I will record a 10-minute video tearing down your portfolio website.', suggestedPrice: '999', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_des_2', title: 'UI Critique', description: 'Send me your Figma file or live site. I will leave detailed comments on the design.', suggestedPrice: '799', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_des_3', title: 'Branding Feedback', description: 'Async review of your logo, typography, and visual brand identity.', suggestedPrice: '1499', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_des_custom', title: 'Custom Design Review', description: 'Submit your design files for comprehensive async feedback.', suggestedPrice: '999', monetizationType: 'SERVICE_ASYNC' },
    ],
    'Business/Startup': [
      { id: 'a_biz_1', title: 'Pitch Deck Review (Video)', description: 'I will record a video reviewing your pitch deck slide-by-slide.', suggestedPrice: '1999', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_biz_2', title: 'Website Conversion Audit', description: 'Loom teardown of your landing page focusing on copy and conversion rate.', suggestedPrice: '1499', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_biz_3', title: 'Business Model Audit', description: 'Submit your plan and I will reply with strategic gaps and opportunities.', suggestedPrice: '2499', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_biz_custom', title: 'Custom Business Review', description: 'Submit your documents or links for async strategic feedback.', suggestedPrice: '1999', monetizationType: 'SERVICE_ASYNC' },
    ],
    'Finance Educator': [
      { id: 'a_fin_1', title: 'Portfolio Structure Check', description: 'Submit your current asset allocation for async feedback and rebalancing ideas.', suggestedPrice: '999', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_fin_custom', title: 'Custom Finance Review', description: 'Submit your query and I will provide a detailed async response.', suggestedPrice: '999', monetizationType: 'SERVICE_ASYNC' },
    ],
    'Fitness Coach': [
      { id: 'a_fit_1', title: 'Workout Plan Review', description: 'Send me your current split and I will optimize it for your goals.', suggestedPrice: '499', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_fit_2', title: 'Diet Plan Feedback', description: 'I will review your daily macros/meals and suggest improvements.', suggestedPrice: '499', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_fit_3', title: 'Form Check (Video Review)', description: 'Send me a video of your lift. I will reply with form corrections.', suggestedPrice: '299', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_fit_custom', title: 'Custom Coaching Feedback', description: 'Submit your fitness data for detailed async feedback.', suggestedPrice: '499', monetizationType: 'SERVICE_ASYNC' },
    ],
    'Creator/Influencer': [
      { id: 'a_cre_1', title: 'Social Media Profile Audit', description: 'I will review your bio, feed, and overall aesthetic. (Delivered via PDF/Video).', suggestedPrice: '499', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_cre_2', title: 'Thumbnail Review', description: 'Submit up to 3 thumbnails and I will give you feedback to increase CTR.', suggestedPrice: '299', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_cre_3', title: 'Content Script Review', description: 'Send me your video script and I will edit it for better retention hooks.', suggestedPrice: '799', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_cre_custom', title: 'Custom Content Review', description: 'Submit your content for detailed async feedback.', suggestedPrice: '499', monetizationType: 'SERVICE_ASYNC' },
    ],
    'Developer/Maker': [
      { id: 'a_dev_1', title: 'Code PR Review', description: 'I will review a pull request and leave actionable architectural comments.', suggestedPrice: '999', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_dev_2', title: 'Landing Page Tech Audit', description: 'Async review of your site performance, SEO, and tech stack choices.', suggestedPrice: '799', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_dev_custom', title: 'Custom Tech Review', description: 'Submit your code or architecture doc for async feedback.', suggestedPrice: '999', monetizationType: 'SERVICE_ASYNC' },
    ],
    'Marketing Consultant': [
      { id: 'a_mar_1', title: 'Ad Creative Review', description: 'Submit your ad creatives for feedback on copy and visuals.', suggestedPrice: '799', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_mar_2', title: 'SEO Audit Report', description: 'I will run an analysis on your site and send a prioritized SEO action list.', suggestedPrice: '1499', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_mar_custom', title: 'Custom Marketing Review', description: 'Submit your campaigns or copy for async feedback.', suggestedPrice: '999', monetizationType: 'SERVICE_ASYNC' },
    ],
    'Educator/Tutor': [
      { id: 'a_edu_1', title: 'Essay/Assignment Review', description: 'Submit your writing for detailed feedback and corrections.', suggestedPrice: '499', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_edu_custom', title: 'Custom Async Review', description: 'Submit your work for detailed grading or feedback.', suggestedPrice: '499', monetizationType: 'SERVICE_ASYNC' },
    ],
    'Other': [
      { id: 'a_oth_1', title: 'Deep-Dive Report', description: 'Submit your information and receive a comprehensive custom report.', suggestedPrice: '999', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_oth_2', title: 'Priority Email Response', description: 'Ask a detailed question and get a guaranteed thorough response within 24 hours.', suggestedPrice: '299', monetizationType: 'SERVICE_ASYNC' },
      { id: 'a_oth_3', title: 'Document Audit', description: 'Submit a document for detailed review and feedback.', suggestedPrice: '499', monetizationType: 'SERVICE_ASYNC' },
    ]
  },
  DIGITAL: [
    { id: 'd_all_1', title: 'eBook / Guide', description: 'A comprehensive written guide to help you master a specific topic.', suggestedPrice: '499', monetizationType: 'DIGITAL_FILE' },
    { id: 'd_all_2', title: 'Notion Template', description: 'A ready-to-use Notion workspace to organize your life or work.', suggestedPrice: '299', monetizationType: 'DIGITAL_FILE' },
    { id: 'd_all_3', title: 'Design Assets / UI Kit', description: 'Premium design components to speed up your workflow.', suggestedPrice: '999', monetizationType: 'DIGITAL_FILE' },
    { id: 'd_all_4', title: 'Cheat Sheet / Checklist', description: 'A quick-reference guide with actionable steps.', suggestedPrice: '99', monetizationType: 'DIGITAL_FILE' },
    { id: 'd_all_5', title: 'Interview Q&A Database', description: 'A curated list of the most common interview questions and answers.', suggestedPrice: '399', monetizationType: 'DIGITAL_FILE' },
    { id: 'd_all_6', title: 'Canva / Social Templates', description: 'Plug-and-play templates for your social media channels.', suggestedPrice: '199', monetizationType: 'DIGITAL_FILE' },
    { id: 'd_all_7', title: 'Financial Spreadsheet', description: 'Automated templates to track your budget, portfolio, or business finances.', suggestedPrice: '299', monetizationType: 'DIGITAL_FILE' },
    { id: 'd_all_8', title: 'Exclusive Video Recording', description: 'Access to a recorded masterclass, workshop, or unlisted content.', suggestedPrice: '499', monetizationType: 'DIGITAL_FILE' },
    { id: 'd_all_custom', title: 'Custom Digital Download', description: 'Sell any file directly to your audience.', suggestedPrice: '299', monetizationType: 'DIGITAL_FILE' }
  ],
  DONATION: [
    { id: 'don_1', title: 'Buy Me a Coffee ☕', description: 'If you enjoy my free content, consider supporting my work with a small tip!', suggestedPrice: '', priceType: 'PAY_WHAT_YOU_WANT', monetizationType: 'SERVICE_ASYNC' },
    { id: 'don_2', title: 'Tip Jar 💰', description: 'Drop a tip to support the channel and future projects.', suggestedPrice: '', priceType: 'PAY_WHAT_YOU_WANT', monetizationType: 'SERVICE_ASYNC' },
    { id: 'don_3', title: 'Support Open Source ❤️', description: 'Contribute to the ongoing development of my open source projects.', suggestedPrice: '', priceType: 'PAY_WHAT_YOU_WANT', monetizationType: 'SERVICE_ASYNC' },
    { id: 'don_custom', title: 'Pay What You Want', description: 'Support my work with an amount of your choosing.', suggestedPrice: '', priceType: 'PAY_WHAT_YOU_WANT', monetizationType: 'SERVICE_ASYNC' }
  ]
};
