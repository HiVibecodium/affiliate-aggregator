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

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [currentOrgId, setCurrentOrgIdState] = useState<string | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  // Load organization ID on mount
  useEffect(() => {
    const initializeOrganization = async () => {
      // First check localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCurrentOrgIdState(stored);
        return;
      }

      // If no stored org, fetch user's organizations
      try {
        const response = await fetch('/api/organizations');
        if (response.ok) {
          const data = await response.json();
          if (data.organizations && data.organizations.length > 0) {
            // Use first organization
            const firstOrg = data.organizations[0];
            setCurrentOrgIdState(firstOrg.id);
            localStorage.setItem(STORAGE_KEY, firstOrg.id);
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Failed to fetch organizations:', error);
        setLoading(false);
      }
    };

    initializeOrganization();
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
          setOrganization(null);
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
