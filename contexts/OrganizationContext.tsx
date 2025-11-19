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
  error: string | null;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

const STORAGE_KEY = 'current-organization-id';

export function OrganizationProvider({ children }: { children: ReactNode }) {
  const [currentOrgId, setCurrentOrgIdState] = useState<string | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load organization ID on mount
  useEffect(() => {
    const initializeOrganization = async () => {
      // First check localStorage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && stored !== 'null' && stored !== 'undefined') {
        console.log('[OrganizationContext] Using stored org ID:', stored);
        setCurrentOrgIdState(stored);
        return;
      }

      // Clear invalid stored values
      if (stored) {
        localStorage.removeItem(STORAGE_KEY);
      }

      // If no stored org, fetch user's organizations
      console.log('[OrganizationContext] Fetching organizations...');
      try {
        const response = await fetch('/api/organizations');
        console.log('[OrganizationContext] Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('[OrganizationContext] Organizations data:', data);

          if (data.organizations && data.organizations.length > 0) {
            // Use first organization
            const firstOrg = data.organizations[0];
            console.log('[OrganizationContext] Setting first org:', firstOrg.id);
            setCurrentOrgIdState(firstOrg.id);
            localStorage.setItem(STORAGE_KEY, firstOrg.id);
          } else {
            console.warn('[OrganizationContext] No organizations found');
            setError('No organizations found. Please create one.');
            setLoading(false);
          }
        } else if (response.status === 401) {
          console.warn('[OrganizationContext] Unauthorized - user not logged in');
          setError('Please log in to access organizations');
          setLoading(false);
        } else {
          console.error('[OrganizationContext] Failed to fetch:', response.status);
          setError('Failed to load organizations');
          setLoading(false);
        }
      } catch (error) {
        console.error('[OrganizationContext] Fetch error:', error);
        setError('Network error while loading organizations');
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
      console.log('[OrganizationContext] Fetching org details for:', currentOrgId);
      try {
        const response = await fetch(`/api/organizations/${currentOrgId}`);
        console.log('[OrganizationContext] Org details response:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('[OrganizationContext] Organization loaded:', data.name);
          setOrganization(data);
          setError(null);
        } else {
          console.error('[OrganizationContext] Failed to load org details:', response.status);
          setOrganization(null);
          setError('Organization not found');
          // Clear invalid stored org ID
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (error) {
        console.error('[OrganizationContext] Org fetch error:', error);
        setError('Failed to load organization details');
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
        error,
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
