// Centralized Plan Policy System for TinySlash SaaS Platform
// This file defines all plan limits and features in one place

export interface PlanFeatures {
  customDomain: boolean;
  analytics: boolean;
  teamCollaboration: boolean;
  whiteLabel?: boolean;
  apiAccess?: boolean;
  prioritySupport?: boolean;
  // URL Shortener Premium Features
  customAlias: boolean;
  passwordProtection: boolean;
  linkExpiration: boolean;
  clickLimits: boolean;
  richLinkPreview: boolean;
  openInApp: boolean;
  languageRouting: boolean;
  locationRouting: boolean;
  unlockAfterSignup: boolean;
  pixelRetargeting: boolean;
  abTesting: boolean;
  bulkImport: boolean;
  smartRedirectRules: boolean;
  webhooks: boolean;
  // QR Code Premium Features
  dynamicQR: boolean;
  customQRColors: boolean;
  qrLogo: boolean;
  qrBranding: boolean;
  advancedQRSettings: boolean;
  multiActionQR: boolean;
  openInAppQR: boolean;
  locationRoutingQR: boolean;
  languageRoutingQR: boolean;
  leadCaptureQR: boolean;
  pixelRetargetingQR: boolean;
  bulkQRGeneration: boolean;
  whiteLabelQR: boolean;
  // File Upload Premium Features
  advancedFileSettings: boolean;
  leadCaptureBeforeDownload: boolean;
  fileExpiration: boolean;
  removeBranding: boolean;
  // Verified Badge
  verifiedBadge: boolean;
  whiteLabelBadge: boolean;
  // Advanced Link Features
  whatsAppPreview: boolean;
  geoRedirect: boolean;
  deepLinks: boolean;
  leadLock: boolean;
  trustBadge: boolean;
}

export interface PlanLimits {
  name: string;
  domains: number;
  teamMembers: number;
  urlsPerMonth: number;
  dynamicQrPerMonth: number;
  staticQrPerMonth: number; // -1 = unlimited
  filesPerMonth: number;
  maxFileSizeMb: number;
  pagesAllowed: number; // -1 = unlimited
  linksPerPage: number; // -1 = unlimited
  pixelsPerAccount: number;
  pixelsPerLink: number;
  analyticsRetentionDays: number;
  trialDays?: number;
  features: PlanFeatures;
}

export const PLAN_POLICY: Record<string, PlanLimits> = {
  FREE: {
    name: "Free",
    domains: 0,
    teamMembers: 1,
    urlsPerMonth: 15,
    dynamicQrPerMonth: 0,
    staticQrPerMonth: 15,
    filesPerMonth: 3,
    maxFileSizeMb: 10,
    pagesAllowed: 1,
    linksPerPage: 5,
    pixelsPerAccount: 0,
    pixelsPerLink: 0,
    analyticsRetentionDays: 7,
    features: {
      customDomain: false,
      analytics: true, // basic click count only
      teamCollaboration: false,
      whiteLabel: false,
      apiAccess: false,
      prioritySupport: false,
      customAlias: false,
      passwordProtection: false,
      linkExpiration: false,
      clickLimits: false,
      richLinkPreview: false,
      openInApp: false,
      languageRouting: false,
      locationRouting: false,
      unlockAfterSignup: false,
      pixelRetargeting: false,
      abTesting: false,
      bulkImport: false,
      smartRedirectRules: false,
      webhooks: false,
      dynamicQR: false,
      customQRColors: false,
      qrLogo: false,
      qrBranding: false,
      advancedQRSettings: false,
      multiActionQR: false,
      openInAppQR: false,
      locationRoutingQR: false,
      languageRoutingQR: false,
      leadCaptureQR: false,
      pixelRetargetingQR: false,
      bulkQRGeneration: false,
      whiteLabelQR: false,
      advancedFileSettings: false,
      leadCaptureBeforeDownload: false,
      fileExpiration: false,
      removeBranding: false,
      verifiedBadge: false,
      whiteLabelBadge: false,
      whatsAppPreview: false,
      geoRedirect: false,
      deepLinks: false,
      leadLock: false,
      trustBadge: false,
    },
  },

  STARTER: {
    name: "Starter",
    domains: 0,
    teamMembers: 1,
    urlsPerMonth: 1000,
    dynamicQrPerMonth: 25,
    staticQrPerMonth: -1,
    filesPerMonth: 50,
    maxFileSizeMb: 100,
    pagesAllowed: 2,
    linksPerPage: -1,
    pixelsPerAccount: 0,
    pixelsPerLink: 0,
    analyticsRetentionDays: 30,
    features: {
      customDomain: false,
      analytics: true,
      teamCollaboration: false,
      whiteLabel: false,
      apiAccess: false,
      prioritySupport: false,
      customAlias: true,
      passwordProtection: true,
      linkExpiration: true,
      clickLimits: true,
      richLinkPreview: true,
      openInApp: false,
      languageRouting: false,
      locationRouting: false,
      unlockAfterSignup: false,
      pixelRetargeting: false,
      abTesting: false,
      bulkImport: false,
      smartRedirectRules: false,
      webhooks: false,
      dynamicQR: true,
      customQRColors: true,
      qrLogo: false,
      qrBranding: false,
      advancedQRSettings: false,
      multiActionQR: false,
      openInAppQR: false,
      locationRoutingQR: false,
      languageRoutingQR: false,
      leadCaptureQR: false,
      pixelRetargetingQR: false,
      bulkQRGeneration: false,
      whiteLabelQR: false,
      advancedFileSettings: true,
      leadCaptureBeforeDownload: false,
      fileExpiration: false,
      removeBranding: true,
      verifiedBadge: false,
      whiteLabelBadge: false,
      whatsAppPreview: true,
      geoRedirect: false,
      deepLinks: false,
      leadLock: false,
      trustBadge: false,
    },
  },

  PRO: {
    name: "Pro",
    domains: 2,
    teamMembers: 3,
    urlsPerMonth: -1, // unlimited
    dynamicQrPerMonth: 500,
    staticQrPerMonth: -1,
    filesPerMonth: 200,
    maxFileSizeMb: 500,
    pagesAllowed: 5,
    linksPerPage: -1,
    pixelsPerAccount: 5,
    pixelsPerLink: 2,
    analyticsRetentionDays: 90,
    features: {
      customDomain: true,
      analytics: true,
      teamCollaboration: true,
      whiteLabel: false,
      apiAccess: true,
      prioritySupport: true,
      customAlias: true,
      passwordProtection: true,
      linkExpiration: true,
      clickLimits: true,
      richLinkPreview: true,
      openInApp: true,
      languageRouting: true,
      locationRouting: true,
      unlockAfterSignup: true,
      pixelRetargeting: true,
      abTesting: false,
      bulkImport: false,
      smartRedirectRules: false,
      webhooks: false,
      dynamicQR: true,
      customQRColors: true,
      qrLogo: true,
      qrBranding: true,
      advancedQRSettings: true,
      multiActionQR: true,
      openInAppQR: true,
      locationRoutingQR: true,
      languageRoutingQR: true,
      leadCaptureQR: true,
      pixelRetargetingQR: true,
      bulkQRGeneration: false,
      whiteLabelQR: false,
      advancedFileSettings: true,
      leadCaptureBeforeDownload: false,
      fileExpiration: false,
      removeBranding: true,
      verifiedBadge: true,
      whiteLabelBadge: false,
      whatsAppPreview: true,
      geoRedirect: true,
      deepLinks: true,
      leadLock: true,
      trustBadge: true,
    },
  },

  BUSINESS: {
    name: "Business",
    domains: 10,
    teamMembers: 10,
    urlsPerMonth: -1,
    dynamicQrPerMonth: -1,
    staticQrPerMonth: -1,
    filesPerMonth: -1,
    maxFileSizeMb: 2048, // 2GB
    pagesAllowed: -1,
    linksPerPage: -1,
    pixelsPerAccount: -1,
    pixelsPerLink: 5,
    analyticsRetentionDays: 365,
    features: {
      customDomain: true,
      analytics: true,
      teamCollaboration: true,
      whiteLabel: true,
      apiAccess: true,
      prioritySupport: true,
      customAlias: true,
      passwordProtection: true,
      linkExpiration: true,
      clickLimits: true,
      richLinkPreview: true,
      openInApp: true,
      languageRouting: true,
      locationRouting: true,
      unlockAfterSignup: true,
      pixelRetargeting: true,
      abTesting: true,
      bulkImport: true,
      smartRedirectRules: true,
      webhooks: true,
      dynamicQR: true,
      customQRColors: true,
      qrLogo: true,
      qrBranding: true,
      advancedQRSettings: true,
      multiActionQR: true,
      openInAppQR: true,
      locationRoutingQR: true,
      languageRoutingQR: true,
      leadCaptureQR: true,
      pixelRetargetingQR: true,
      bulkQRGeneration: true,
      whiteLabelQR: true,
      advancedFileSettings: true,
      leadCaptureBeforeDownload: true,
      fileExpiration: true,
      removeBranding: true,
      verifiedBadge: true,
      whiteLabelBadge: true,
      whatsAppPreview: true,
      geoRedirect: true,
      deepLinks: true,
      leadLock: true,
      trustBadge: true,
    },
  },

  BUSINESS_TRIAL: {
    name: "Business Trial",
    domains: 10,
    teamMembers: 10,
    urlsPerMonth: -1,
    dynamicQrPerMonth: -1,
    staticQrPerMonth: -1,
    filesPerMonth: -1,
    maxFileSizeMb: 2048,
    pagesAllowed: -1,
    linksPerPage: -1,
    pixelsPerAccount: -1,
    pixelsPerLink: 5,
    analyticsRetentionDays: 365,
    trialDays: 14,
    features: {
      customDomain: true,
      analytics: true,
      teamCollaboration: true,
      whiteLabel: true,
      apiAccess: true,
      prioritySupport: true,
      customAlias: true,
      passwordProtection: true,
      linkExpiration: true,
      clickLimits: true,
      richLinkPreview: true,
      openInApp: true,
      languageRouting: true,
      locationRouting: true,
      unlockAfterSignup: true,
      pixelRetargeting: true,
      abTesting: true,
      bulkImport: true,
      smartRedirectRules: true,
      webhooks: true,
      dynamicQR: true,
      customQRColors: true,
      qrLogo: true,
      qrBranding: true,
      advancedQRSettings: true,
      multiActionQR: true,
      openInAppQR: true,
      locationRoutingQR: true,
      languageRoutingQR: true,
      leadCaptureQR: true,
      pixelRetargetingQR: true,
      bulkQRGeneration: true,
      whiteLabelQR: true,
      advancedFileSettings: true,
      leadCaptureBeforeDownload: true,
      fileExpiration: true,
      removeBranding: true,
      verifiedBadge: true,
      whiteLabelBadge: true,
      whatsAppPreview: true,
      geoRedirect: true,
      deepLinks: true,
      leadLock: true,
      trustBadge: true,
    },
  },
};

// Helper function to get plan policy with fallback
export const getPlanPolicy = (planName?: string): PlanLimits => {
  if (!planName) return PLAN_POLICY.FREE;
  const normalizedPlan = normalizePlanName(planName);
  return PLAN_POLICY[normalizedPlan] || PLAN_POLICY.FREE;
};

// Helper function to normalize plan names from backend to frontend format
export const normalizePlanName = (planName: string): string => {
  const plan = planName.toUpperCase().trim();
  if (plan === 'FREE' || plan === 'FREE_PLAN') return 'FREE';
  if (plan.includes('STARTER')) return 'STARTER';
  if (plan.includes('PRO')) return 'PRO';
  if (plan.includes('BUSINESS_TRIAL') || (plan.includes('BUSINESS') && plan.includes('TRIAL'))) return 'BUSINESS_TRIAL';
  if (plan.includes('BUSINESS')) return 'BUSINESS';
  if (plan.includes('TRIAL')) return 'PRO';
  return plan;
};

// Helper function to check if plan is trial
export const isTrialPlan = (planName?: string): boolean => {
  return planName?.toUpperCase().includes('TRIAL') || false;
};

// Helper function to get upgrade path
export const getUpgradePath = (currentPlan?: string): string => {
  const plan = currentPlan?.toUpperCase();
  if (!plan || plan === 'FREE') return 'STARTER';
  if (plan === 'STARTER') return 'PRO';
  if (plan === 'PRO') return 'BUSINESS';
  return 'BUSINESS';
};