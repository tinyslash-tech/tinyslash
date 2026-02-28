import { apiClient } from './api';

export interface UtmTemplate {
  id: string;
  name: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referral?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUtmTemplateRequest {
  name: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referral?: string;
}

export interface UpdateUtmTemplateRequest extends CreateUtmTemplateRequest { }

export const utmTemplateService = {
  getTemplates: async (teamId: string): Promise<UtmTemplate[]> => {
    const response = await apiClient.get<{ success: boolean; templates: UtmTemplate[] }>(`/teams/${teamId}/utm-templates`);
    return response.data.templates || [];
  },

  createTemplate: async (teamId: string, data: CreateUtmTemplateRequest): Promise<UtmTemplate> => {
    const response = await apiClient.post<{ success: boolean; template: UtmTemplate }>(`/teams/${teamId}/utm-templates`, data);
    return response.data.template;
  },

  updateTemplate: async (teamId: string, templateId: string, data: UpdateUtmTemplateRequest): Promise<UtmTemplate> => {
    const response = await apiClient.put<{ success: boolean; template: UtmTemplate }>(`/teams/${teamId}/utm-templates/${templateId}`, data);
    return response.data.template;
  },

  deleteTemplate: async (teamId: string, templateId: string): Promise<void> => {
    await apiClient.delete(`/teams/${teamId}/utm-templates/${templateId}`);
  }
};
