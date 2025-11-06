'use client';

/**
 * Organization Switcher Component
 * Allows users to switch between multiple organizations they are members of
 * Displays current organization and list of other available organizations
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Organization {
  id: string;
  name: string;
  slug: string;
  role: string;
  joinedAt: string;
  tier?: string;
}

interface OrganizationSwitcherProps {
  currentOrg?: Organization;
  className?: string;
}

export function OrganizationSwitcher({
  currentOrg,
  className = '',
}: OrganizationSwitcherProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  async function fetchOrganizations() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/organizations');

      if (!response.ok) {
        throw new Error('Failed to fetch organizations');
      }

      const data = await response.json();
      setOrganizations(data.organizations || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleOrgSwitch(org: Organization) {
    setIsOpen(false);
    // Navigate to organization dashboard
    router.push(`/dashboard?org=${org.id}`);
  }

  function handleCreateOrg() {
    setIsOpen(false);
    router.push('/organizations/new');
  }

  const otherOrgs = organizations.filter(
    org => !currentOrg || org.id !== currentOrg.id
  );

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-900 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2 flex-1">
          {currentOrg ? (
            <>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
                {currentOrg.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {currentOrg.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {currentOrg.role}
                </div>
              </div>
            </>
          ) : (
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Select Organization
            </span>
          )}
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          {/* Current Organization */}
          {currentOrg && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Current
              </div>
              <div className="px-3 py-2 rounded-md bg-blue-50 dark:bg-blue-900/20 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                  {currentOrg.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {currentOrg.name}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {currentOrg.role}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other Organizations */}
          {otherOrgs.length > 0 && (
            <div className="p-2 border-b border-gray-200 dark:border-gray-700">
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                Other Organizations
              </div>
              <div className="space-y-1">
                {otherOrgs.map(org => (
                  <button
                    key={org.id}
                    onClick={() => handleOrgSwitch(org)}
                    className="w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-left"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-xs font-semibold">
                      {org.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {org.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {org.role}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Create New Organization */}
          <div className="p-2">
            <button
              onClick={handleCreateOrg}
              className="w-full px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create New Organization
            </button>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="px-4 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
              Loading organizations...
            </div>
          )}
        </div>
      )}

      {/* Overlay to close menu */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}

export default OrganizationSwitcher;
