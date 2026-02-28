import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { utmTemplateService, CreateUtmTemplateRequest, UtmTemplate } from '../../../services/utmTemplateService';
import { PlatformDropdown } from '../../ui/PlatformDropdown';

interface CreateUtmTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  onSuccess: (template: UtmTemplate) => void;
}

const CreateUtmTemplateModal: React.FC<CreateUtmTemplateModalProps> = ({ isOpen, onClose, teamId, onSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateUtmTemplateRequest>({
    name: '',
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: '',
    referral: ''
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Template Name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      const newTemplate = await utmTemplateService.createTemplate(teamId, formData);
      toast.success('UTM template created successfully!');
      onSuccess(newTemplate);
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create UTM template');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-100">
            <div className="sm:flex sm:items-start justify-between">
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 className="text-xl leading-6 font-semibold text-gray-900" id="modal-title">
                  Create UTM Template
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Save repetitive UTM parameters into a template to quickly apply them when creating links.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Template Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. LinkedIn Winter Campaign"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="utmSource" className="block text-sm font-medium text-gray-700 mb-1">UTM Source</label>
                <PlatformDropdown
                  value={formData.utmSource || ''}
                  onChange={(val) => setFormData(prev => ({ ...prev, utmSource: val }))}
                  placeholder="e.g. facebook, linkedin"
                />
              </div>
              <div>
                <label htmlFor="utmMedium" className="block text-sm font-medium text-gray-700">UTM Medium</label>
                <input
                  type="text"
                  name="utmMedium"
                  id="utmMedium"
                  value={formData.utmMedium}
                  onChange={handleChange}
                  placeholder="e.g. social"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="utmCampaign" className="block text-sm font-medium text-gray-700">UTM Campaign</label>
                <input
                  type="text"
                  name="utmCampaign"
                  id="utmCampaign"
                  value={formData.utmCampaign}
                  onChange={handleChange}
                  placeholder="e.g. winter_sale_2024"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>
              <div>
                <label htmlFor="utmTerm" className="block text-sm font-medium text-gray-700">UTM Term</label>
                <input
                  type="text"
                  name="utmTerm"
                  id="utmTerm"
                  value={formData.utmTerm}
                  onChange={handleChange}
                  placeholder="e.g. saas_software"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="utmContent" className="block text-sm font-medium text-gray-700">UTM Content</label>
                <input
                  type="text"
                  name="utmContent"
                  id="utmContent"
                  value={formData.utmContent}
                  onChange={handleChange}
                  placeholder="e.g. logolink"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>
              <div>
                <label htmlFor="referral" className="block text-sm font-medium text-gray-700">Custom Referral (Ref)</label>
                <input
                  type="text"
                  name="referral"
                  id="referral"
                  value={formData.referral}
                  onChange={handleChange}
                  placeholder="e.g. ref_123"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 border"
                />
              </div>
            </div>

            <div className="mt-5 sm:mt-6 sm:flex sm:flex-row-reverse border-t border-gray-100 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-900 text-base font-medium text-white hover:bg-black focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Template'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUtmTemplateModal;
