import { apiClient } from './api';

export interface CustomDomain {
  id: string;
  domainName: string;
  ownerType: string;
  ownerId: string;
  status: 'RESERVED' | 'PENDING' | 'VERIFIED' | 'ERROR' | 'SUSPENDED' | 'DELETING' | 'SOFT_BLOCKED' | 'MOVED' | 'MISCONFIGURED' | 'BLOCKED' | 'DISABLED' | 'DELETION_PENDING';
  sslStatus: 'PENDING' | 'ACTIVE' | 'ERROR' | 'EXPIRED';
  cnameTarget: string;
  verificationToken: string;
  reservedUntil?: string;
  verificationAttempts: number;
  lastVerificationAttempt?: string;
  verificationError?: string;
  sslProvider?: string;
  sslIssuedAt?: string;
  sslExpiresAt?: string;
  sslError?: string;
  isBlacklisted: boolean;
  blacklistReason?: string;
  totalRedirects: number;
  lastUsed?: string;
  createdAt: string;
  updatedAt: string;
}

export const getMyDomains = async (ownerType?: string, ownerId?: string): Promise<{ success: boolean; domains: CustomDomain[]; count: number; message?: string; repositoryStatus?: string }> => {
  const params = new URLSearchParams();
  if (ownerType) params.append('ownerType', ownerType);
  if (ownerId) params.append('ownerId', ownerId);

  const response = await apiClient.get(`/v1/domains/my?${params.toString()}`);
  return response.data;
};

export interface DnsInstruction {
  type: string;
  name: string;
  value: string;
  target?: string;
  ttl?: string;
  example?: string;
}

export const addDomain = async (domainName: string, ownerType: string, ownerId?: string): Promise<{
  success: boolean;
  domain: CustomDomain;
  message: string;
  dnsInstructions?: {
    routing: DnsInstruction;
    ssl?: DnsInstruction;
    sslAccelerator?: DnsInstruction;
  };
  verificationUrl?: string;
}> => {
  const response = await apiClient.post('/v1/domains', {
    domainName,
    ownerType,
    ownerId
  });
  return response.data;
};


export const verifyDomain = async (domainId: string, payload?: any): Promise<{ success: boolean; domain: CustomDomain; verified: boolean; message: string; verificationError?: string; troubleshooting?: any }> => {
  const response = await apiClient.post(`/v1/domains/verify?domainId=${domainId}`, payload || {});
  return response.data;
};

export const deleteDomain = async (domainId: string, userId?: string): Promise<{ success: boolean; message: string }> => {
  const response = await apiClient.delete(`/v1/domains/${domainId}`);
  return response.data;
};

export const getDomainStatus = async (domainName: string): Promise<{ success: boolean; domain: string; status: string }> => {
  const response = await apiClient.get(`/v1/domains/status/${domainName}`);
  return response.data;
};

export const detectProvider = async (domain: string): Promise<{ success: boolean; provider: string; instructions: Record<string, string> }> => {
  const response = await apiClient.get(`/v1/domains/detect-provider?domain=${domain}`);
  return response.data;
};

