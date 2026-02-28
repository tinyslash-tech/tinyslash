import React, { useState } from 'react';
import { TEMPLATES, Template, TemplateCategory } from '../../../config/templates/index';
import { LivePreviewCard } from '../LivePreviewCard';
import { Check, ArrowRight, Grid, User, Briefcase, Palette, Layout, Sparkles, Store, Wrench, Lightbulb, Building, ShoppingCart, Calendar } from 'lucide-react';

interface TemplatesTabProps {
  onSelect: (template: Template) => void;
  selectedTemplateId?: string | null;
}

const CATEGORIES: { id: TemplateCategory | 'ALL'; label: string; icon: React.ElementType }[] = [
  { id: 'ALL', label: 'All Templates', icon: Grid },
  { id: 'CREATOR', label: 'Creator & Influencer', icon: Sparkles },
  { id: 'PORTFOLIO', label: 'Creative Portfolio & Profiles', icon: Palette },
  { id: 'COACH_WELLNESS', label: 'Coach, Mentor & Wellness', icon: Lightbulb },
  { id: 'PROFESSIONAL', label: 'Professional Services', icon: Briefcase },
  { id: 'LOCAL_BUSINESS', label: 'Local Business & Retail', icon: Store },
  { id: 'ECOMMERCE', label: 'Online Store & E-Commerce', icon: ShoppingCart },
  { id: 'AGENCY_B2B', label: 'Agency & B2B Services', icon: Building },
  { id: 'EVENTS_NGO', label: 'Events & NGOs', icon: Calendar },
  { id: 'BLANK', label: 'Blank', icon: Layout },
];

export const TemplatesTab: React.FC<TemplatesTabProps> = ({ onSelect, selectedTemplateId }) => {
  const [activeCategory, setActiveCategory] = useState<TemplateCategory | 'ALL'>('ALL');

  const filteredTemplates = activeCategory === 'ALL'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 px-1">
        <h2 className="text-2xl font-bold text-gray-900">Choose a Template</h2>
        <p className="text-sm text-gray-500 mt-1">Start with a pre-designed layout or build from scratch.</p>
      </div>

      {/* Top Bar Categories */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-6 overflow-x-auto pb-px scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 pb-3 text-sm font-medium whitespace-nowrap transition-all relative
                ${activeCategory === cat.id
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-800'
                }
              `}
            >
              <cat.icon className={`w-4 h-4 ${activeCategory === cat.id ? 'text-blue-600' : 'text-gray-400'}`} />
              {cat.label}

              {/* Active Indicator Line */}
              {activeCategory === cat.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Template Grid */}
      <div className="flex-1 overflow-y-auto pb-20 pr-2 scrollbar-thin">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4">
          {filteredTemplates.map((template) => (
            <LivePreviewCard
              key={template.id}
              data={template}
              selected={selectedTemplateId === template.id}
              onClick={() => onSelect(template)}
            />
          ))}

          {filteredTemplates.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-400 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
              <p>No templates found for this category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
