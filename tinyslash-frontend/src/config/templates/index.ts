import { influencerTemplates } from './influencer';
import { businessTemplates } from './business';
import { portfolioTemplates } from './portfolio';
import { personalTemplates } from './personal';
import { blankTemplates } from './blank';
import { serviceProviderTemplates } from './serviceProvider';
import { coachTemplates } from './coach';
import { localStoreTemplates } from './localStore';
import { agencyTemplates } from './agency';
import { Template } from './types';

export * from './types';

export const TEMPLATES: Template[] = [
  ...influencerTemplates,
  ...businessTemplates,
  ...portfolioTemplates,
  ...personalTemplates,
  ...serviceProviderTemplates,
  ...coachTemplates,
  ...localStoreTemplates,
  ...agencyTemplates,
  ...blankTemplates
];
