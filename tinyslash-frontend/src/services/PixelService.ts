import axios from 'axios';

// Pixel Types matching Backend Enum
export enum PixelType {
  FACEBOOK_CAPI = 'FACEBOOK_CAPI',
  GOOGLE_ADS = 'GOOGLE_ADS',
  GA4 = 'GA4',
  WEBHOOK = 'WEBHOOK'
}

export interface Pixel {
  id: string;
  userId: string;
  name: string;
  type: PixelType;
  pixelId: string;
  accessToken?: string;
  conversionApiEndpoint?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  totalFired: number;
  totalFailed: number;
  lastFiredAt?: string;
  /** P5: Sampling rate 1-100. 100 = fire every time. */
  samplingPercent: number;
}

export interface CreatePixelRequest {
  userId: string;
  name: string;
  type: PixelType;
  pixelId: string;
  accessToken?: string;
  conversionApiEndpoint?: string;
}

// SaaS-grade: Per-pixel stat for a specific link
export interface PixelLinkStat {
  pixelId: string;
  name: string;
  type: string;
  fired: number;
  failed: number;
  fireRate: number;
  total: number;
}

// SaaS-grade: Full link-level pixel stats response
export interface LinkPixelStats {
  linkId: string;
  pixels: PixelLinkStat[];
  totalFired: number;
  totalFailed: number;
  overallFireRate: number;
}

// SaaS-grade: Daily fires data point for chart
export interface PixelDayStat {
  date: string;
  fired: number;
  failed: number;
}

// SaaS-grade: Global performance for analytics page
export interface PixelPerformance {
  totalFired: number;
  totalFailed: number;
  fireRate: number;
  /** P4: True when fire rate drops below 80% — triggers warning banner in dashboard */
  fireRateAlert: boolean;
  byPixel: PixelLinkStat[];
  byDay: PixelDayStat[];
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api/v1';

export const PixelService = {
  getAll: async (userId: string): Promise<Pixel[]> => {
    const response = await axios.get(`${API_URL}/pixels?userId=${userId}`);
    return response.data.data;
  },

  create: async (pixel: CreatePixelRequest): Promise<Pixel> => {
    const response = await axios.post(`${API_URL}/pixels`, pixel);
    return response.data.data;
  },

  delete: async (id: string, userId: string): Promise<void> => {
    await axios.delete(`${API_URL}/pixels/${id}?userId=${userId}`);
  },

  toggleActive: async (id: string, userId: string, active: boolean): Promise<void> => {
    await axios.put(`${API_URL}/pixels/${id}/toggle?userId=${userId}&active=${active}`);
  },

  // SaaS-grade: Get per-pixel fire breakdown for a specific link (by shortCode)
  getLinkPixelStats: async (shortCode: string, userId: string): Promise<LinkPixelStats> => {
    const response = await axios.get(`${API_URL}/pixels/link-stats?shortCode=${shortCode}&userId=${userId}`);
    return response.data;
  },

  // SaaS-grade: Get aggregate pixel performance for the analytics page
  getPixelPerformance: async (userId: string, days: number = 30): Promise<PixelPerformance> => {
    const response = await axios.get(`${API_URL}/pixels/performance?userId=${userId}&days=${days}`);
    return response.data;
  }
};
