import React, { useState, useEffect } from 'react';
import { Tag, Loader2 } from 'lucide-react';
import { utmTemplateService, UtmTemplate } from '../../../../services/utmTemplateService';
import { useTeam } from '../../../../context/TeamContext';
import { useAuth } from '../../../../context/AuthContext';
import toast from 'react-hot-toast';

interface TemplateSelectorProps {
  onSelect: (template: UtmTemplate) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect }) => {
  const { currentScope } = useTeam();
  const { user } = useAuth();

  const [templates, setTemplates] = useState<UtmTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const teamId = currentScope.type === 'TEAM' ? currentScope.id : user?.id;

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!teamId) return;
      try {
        setIsLoading(true);
        const data = await utmTemplateService.getTemplates(teamId);
        setTemplates(data);
      } catch (error) {
        console.error('Failed to load UTM templates', error);
        // Fail silently so it doesn't interrupt standard link creation
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemplates();
  }, [teamId]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const templateId = e.target.value;
    if (!templateId) return;

    const selectedTemplate = templates.find(t => t.id === templateId);
    if (selectedTemplate) {
      onSelect(selectedTemplate);
      toast.success(`Applied template: ${selectedTemplate.name}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Loading templates...</span>
      </div>
    );
  }

  if (templates.length === 0) {
    return null; // Don't show selector if they have no templates
  }

  return (
    <div className="mb-4 bg-white border border-gray-200 rounded-lg p-3">
      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
        <Tag className="w-4 h-4 text-blue-600" />
        <span>Apply UTM Template</span>
      </label>
      <select
        onChange={handleChange}
        defaultValue=""
        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm cursor-pointer"
      >
        <option value="" disabled>Select a saved template...</option>
        {templates.map(template => (
          <option key={template.id} value={template.id}>
            {template.name}
          </option>
        ))}
      </select>
    </div>
  );
};
