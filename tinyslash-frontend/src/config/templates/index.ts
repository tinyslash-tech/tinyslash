import { influencerTemplates } from './influencer';
import { businessTemplates } from './business';
import { portfolioTemplates } from './portfolio';
import { personalTemplates } from './personal';
import { blankTemplates } from './blank';
import { Template } from './types';

export * from './types';

export const TEMPLATES: Template[] = [
  ...influencerTemplates,
  ...businessTemplates,
  ...portfolioTemplates,
  ...personalTemplates,
  ...blankTemplates
];
