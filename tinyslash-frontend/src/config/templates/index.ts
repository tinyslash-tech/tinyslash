import { creatorTemplates } from './creator';
import { portfolioTemplates } from './portfolio';
import { coachTemplates } from './coach';
import { professionalTemplates } from './professional';
import { localStoreTemplates } from './localStore';
import { ecommerceTemplates } from './ecommerce';
import { agencyTemplates } from './agency';
import { eventsTemplates } from './events';
import { blankTemplates } from './blank';
import { Template } from './types';

export * from './types';

export const TEMPLATES: Template[] = [
  ...creatorTemplates,
  ...portfolioTemplates,
  ...coachTemplates,
  ...professionalTemplates,
  ...localStoreTemplates,
  ...ecommerceTemplates,
  ...agencyTemplates,
  ...eventsTemplates,
  ...blankTemplates
];
