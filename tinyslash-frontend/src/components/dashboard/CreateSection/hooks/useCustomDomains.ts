import { useState, useEffect } from 'react';
import { DEFAULT_DOMAIN } from '../types';

export const useCustomDomains = () => {
  const [customDomains, setCustomDomains] = useState<string[]>([DEFAULT_DOMAIN]);
  const [selectedDomain, setSelectedDomain] = useState(DEFAULT_DOMAIN);

  const loadCustomDomainsFromBackend = async () => {
    try {
      let token = null;
      try {
        token = localStorage.getItem('token');
      } catch (e) {
        console.warn('Storage access failed:', e);
        setCustomDomains([DEFAULT_DOMAIN]);
        return;
      }

      if (!token) {
        setCustomDomains([DEFAULT_DOMAIN]);
        return;
      }

      const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

      const response = await fetch(`${API_BASE_URL}/v1/domains/verified`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.domains) {
          // Extract verified domain names and add to the list
          const verifiedDomains = data.domains
            .filter((domain: any) => domain.status === 'VERIFIED')
            .map((domain: any) => domain.domainName);

          // Always include default domain first, then verified custom domains
          const allDomains = [DEFAULT_DOMAIN, ...verifiedDomains];
          setCustomDomains(allDomains);

          console.log('✅ Loaded custom domains for Create section:', allDomains);
        } else {
          setCustomDomains([DEFAULT_DOMAIN]);
        }
      } else {
        console.warn('Failed to load custom domains:', response.status);
        setCustomDomains([DEFAULT_DOMAIN]);
      }
    } catch (error) {
      console.error('Failed to load custom domains:', error);
      setCustomDomains([DEFAULT_DOMAIN]);
    }
  };

  useEffect(() => {
    loadCustomDomainsFromBackend();

    const handleDomainUpdate = () => {
      console.log('🔄 Domain update detected, refreshing domains');
      loadCustomDomainsFromBackend();
    };

    window.addEventListener('custom-domain-updated', handleDomainUpdate);
    window.addEventListener('custom-domain-added', handleDomainUpdate);

    return () => {
      window.removeEventListener('custom-domain-updated', handleDomainUpdate);
      window.removeEventListener('custom-domain-added', handleDomainUpdate);
    };
  }, []);

  return {
    customDomains,
    selectedDomain,
    setSelectedDomain,
    refreshDomains: loadCustomDomainsFromBackend
  };
};
