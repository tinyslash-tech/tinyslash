import React, { useState, useEffect } from 'react';
import { Plus, Tag, Settings, Trash2, Search, Loader2 } from 'lucide-react';
import { useTeam } from '../../../context/TeamContext';
import { useAuth } from '../../../context/AuthContext';
import toast from 'react-hot-toast';
import { utmTemplateService, UtmTemplate } from '../../../services/utmTemplateService';
import CreateUtmTemplateModal from './CreateUtmTemplateModal';

const UtmTemplatesManager: React.FC = () => {
  const { currentScope } = useTeam();
  const { user } = useAuth();

  const [templates, setTemplates] = useState<UtmTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const teamId = currentScope.type === 'TEAM' ? currentScope.id : user?.id;

  const fetchTemplates = async () => {
    if (!teamId) return;
    try {
      setIsLoading(true);
      const data = await utmTemplateService.getTemplates(teamId);
      setTemplates(data);
    } catch (error) {
      toast.error('Failed to load UTM templates');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [teamId]);

  const handleDelete = async (templateId: string, templateName: string) => {
    if (!teamId) return;
    if (!window.confirm(`Are you sure you want to delete the template "${templateName}"?`)) return;

    try {
      await utmTemplateService.deleteTemplate(teamId, templateId);
      toast.success('Template deleted successfully');
      setTemplates(templates.filter(t => t.id !== templateId));
    } catch (error) {
      toast.error('Failed to delete template');
    }
  };

  const filteredTemplates = templates.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.utmCampaign?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Tag className="w-6 h-6 mr-2 text-gray-900" />
            UTM Templates
          </h2>
          <p className="text-gray-600 mt-1">
            Create reusable templates for your marketing campaigns to save time and enforce tracking consistency.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>Create Template</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search templates by name or campaign..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Templates List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 text-gray-900 animate-spin" />
          </div>
        ) : filteredTemplates.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="w-12 h-12 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Tag className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No templates found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? "No templates match your search criteria." : "You haven't created any UTM templates yet."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="text-gray-900 hover:text-black font-medium text-sm underline"
              >
                Create your first template &rarr;
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredTemplates.map((template) => (
              <div key={template.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-medium text-gray-900 truncate">
                    {template.name}
                  </h4>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {template.utmSource && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        utm_source: {template.utmSource}
                      </span>
                    )}
                    {template.utmMedium && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        utm_medium: {template.utmMedium}
                      </span>
                    )}
                    {template.utmCampaign && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                        utm_campaign: {template.utmCampaign}
                      </span>
                    )}
                    {(template.utmTerm || template.utmContent || template.referral) && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        +{
                          [template.utmTerm, template.utmContent, template.referral].filter(Boolean).length
                        } more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <button
                    onClick={() => handleDelete(template.id, template.name)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors tooltip-trigger relative group"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span className="absolute -top-8 left-1/2 min-w-max -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {teamId && (
        <CreateUtmTemplateModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          teamId={teamId}
          onSuccess={(newTemplate) => {
            setTemplates(prev => [...prev, newTemplate]);
          }}
        />
      )}
    </div>
  );
};

export default UtmTemplatesManager;
