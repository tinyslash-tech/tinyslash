import { apiClient as api } from './api';
import { Page } from '../types/page';

export const pageService = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post<{ url: string }>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadAsset: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/v1/files/upload', formData);
    // Backend returns { success: true, data: { fileUrl: '...' } }
    return { url: response.data?.data?.fileUrl };
  },

  submitLead: async (pageId: string, ownerId: string, data: any) => {
    const response = await api.post(`/v1/leads/page/${pageId}?ownerId=${ownerId}`, data);
    return response.data;
  },

  recordView: async (pageId: string) => {
    try {
      await api.post(`/v1/pages/${pageId}/view`);
    } catch (error) {
      console.error('Failed to record view', error);
    }
  },

  getLeads: async (userId: string, pageId: string) => {
    const response = await api.get(`/v1/leads?userId=${userId}&pageId=${pageId}`);
    return response.data;
  },

  getAll: async (): Promise<Page[]> => {
    const response = await api.get<Page[]>('/pages');
    return response.data;
  },

  create: async (data: Partial<Page>) => {
    const response = await api.post<Page>('/pages', data);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<Page>(`/pages/${id}`); // Note: ID not slug for editing
    return response.data;
  },

  update: async (id: string, data: Partial<Page>) => {
    const response = await api.put<Page>(`/pages/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await api.delete(`/pages/${id}`);
  },

  // For checking slug availability availability
  checkSlug: async (slug: string) => {
    // Implement if backend supports it, or handle via create error
    return true;
  },

  getBySlug: async (slug: string) => {
    const response = await api.get<Page>(`/public/pages/${slug}`);
    return response.data;
  }
};
