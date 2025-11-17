'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Organization {
  id: string;
  name: string;
  slug: string;
  tier: string;
  subscriptionStatus: string;
}

interface OrganizationContextType {
  currentOrgId: string | null;
  organization: Organization | null;
  setCurrentOrgId: (orgId: string) => void;
  loading: boolean;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

const STORAGE_KEY = 'current-organization-id';
const DEFAULT_ORG_ID = 'default';

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [currentOrgId, setCurrentOrgIdState] = useState<string | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const orgId = stored || DEFAULT_ORG_ID;
    setCurrentOrgIdState(orgId);
  }, []);

  // Fetch organization details when orgId changes
  useEffect(() => {
    if (!currentOrgId) {
      setLoading(false);
      return;
    }

    const fetchOrganization = async () => {
      try {
        const response = await fetch(`/api/organizations/${currentOrgId}`);
        if (response.ok) {
          const data = await response.json();
          setOrganization(data);
        } else {
          // If default org doesn't exist, clear it
          if (currentOrgId === DEFAULT_ORG_ID) {
            setOrganization(null);
          }
        }
      } catch (error) {
        console.error('Failed to fetch organization:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, [currentOrgId]);

  const setCurrentOrgId = (orgId: string) => {
    setCurrentOrgIdState(orgId);
    localStorage.setItem(STORAGE_KEY, orgId);
  };

  return (
    <OrganizationContext.Provider
      value={{
        currentOrgId,
        organization,
        setCurrentOrgId,
        loading,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider');
  }
  return context;
}
