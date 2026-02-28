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

  recordView: async (pageId: string, payload?: any) => {
    try {
      await api.post(`/public/pages/${pageId}/view`, payload || {});
    } catch (error) {
      console.error('Failed to record view', error);
    }
  },

  recordInteractionsBatch: async (pageId: string, batchData: any) => {
    try {
      // Using Navigator.sendBeacon if supported to ensure it fires even if the user closes the page
      if (navigator.sendBeacon) {
        // Build the full URL
        const url = `${api.defaults.baseURL || ''}/public/pages/${pageId}/interactions-batch`;
        // sendBeacon requires FormData or Blob/String
        const blob = new Blob([JSON.stringify(batchData)], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
      } else {
        await api.post(`/public/pages/${pageId}/interactions-batch`, batchData);
      }
    } catch (error) {
      console.error('Failed to record interactions batch', error);
    }
  },

  getAnalytics: async (pageId: string) => {
    const response = await api.get(`/pages/${pageId}/analytics`);
    return response.data;
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
  },

  generateField: async (data: { category: string; prompt: string; fieldName: string }) => {
    const response = await api.post<string>('/ai/pages/generate-field', data);
    return response.data;
  }
};
