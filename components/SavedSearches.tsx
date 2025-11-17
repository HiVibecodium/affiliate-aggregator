'use client';

import { useState, useEffect } from 'react';

interface SavedSearch {
  id: string;
  name: string;
  description: string | null;
  filters: any;
  alertsEnabled: boolean;
  alertFrequency: string;
  newMatchesCount: number;
  createdAt: string;
}

interface SavedSearchesProps {
  userId: string;
  onApplySearch: (filters: any) => void;
}

export function SavedSearches({ userId, onApplySearch }: SavedSearchesProps) {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [currentFilters, setCurrentFilters] = useState<any>(null);

  useEffect(() => {
    fetchSearches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSearches = async () => {
    try {
      const response = await fetch(`/api/saved-searches?userId=${userId}`);
      const data = await response.json();
      setSearches(data.searches || []);
    } catch (error) {
      console.error('Failed to fetch saved searches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSearch = async (filters: any) => {
    setCurrentFilters(filters);
    setShowSaveDialog(true);
  };

  const confirmSaveSearch = async () => {
    if (!saveName.trim()) {
      alert('Please enter a name for this search');
      return;
    }

    try {
      const response = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: saveName,
          filters: currentFilters,
          alertsEnabled: true,
          alertFrequency: 'daily',
        }),
      });

      const data = await response.json();

      if (response.status === 403) {
        alert(data.error + '\n\nUpgrade to Pro to save more searches!');
        window.location.href = data.upgradeUrl;
        return;
      }

      if (data.success) {
        setSearches([data.savedSearch, ...searches]);
        setShowSaveDialog(false);
        setSaveName('');
        alert('Search saved! You&apos;ll receive email alerts when new programs match.');
      }
    } catch (error) {
      console.error('Failed to save search:', error);
      alert('Failed to save search');
    }
  };

  const handleDeleteSearch = async (id: string) => {
    if (!confirm('Delete this saved search?')) return;

    try {
      await fetch(`/api/saved-searches?id=${id}&userId=${userId}`, {
        method: 'DELETE',
      });

      setSearches(searches.filter((s) => s.id !== id));
    } catch (error) {
      console.error('Failed to delete search:', error);
    }
  };

  const handleToggleAlerts = async (id: string, currentlyEnabled: boolean) => {
    try {
      await fetch('/api/saved-searches', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          userId,
          alertsEnabled: !currentlyEnabled,
        }),
      });

      setSearches(
        searches.map((s) => (s.id === id ? { ...s, alertsEnabled: !currentlyEnabled } : s))
      );
    } catch (error) {
      console.error('Failed to toggle alerts:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-4 text-gray-600">Loading saved searches...</div>;
  }

  return (
    <div className="mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Saved Searches</h3>
        <button
          onClick={() => handleSaveSearch({})}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          + Save Current Search
        </button>
      </div>

      {/* Saved Searches List */}
      {searches.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-600 mb-2">No saved searches yet</p>
          <p className="text-sm text-gray-500">
            Save your searches to get email alerts when new programs match!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {searches.map((search) => (
            <div
              key={search.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{search.name}</h4>
                    {search.newMatchesCount > 0 && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                        {search.newMatchesCount} new
                      </span>
                    )}
                  </div>

                  {search.description && (
                    <p className="text-sm text-gray-600 mb-2">{search.description}</p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>
                      {search.alertsEnabled ? (
                        <span className="text-green-600">🔔 Alerts: ON</span>
                      ) : (
                        <span className="text-gray-400">🔕 Alerts: OFF</span>
                      )}
                    </span>
                    <span>•</span>
                    <span>{search.alertFrequency}</span>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => onApplySearch(search.filters)}
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Apply this search"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => handleToggleAlerts(search.id, search.alertsEnabled)}
                    className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors"
                    title={search.alertsEnabled ? 'Disable alerts' : 'Enable alerts'}
                  >
                    {search.alertsEnabled ? '🔔' : '🔕'}
                  </button>
                  <button
                    onClick={() => handleDeleteSearch(search.id)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete search"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Save Search</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Name</label>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="e.g., High Commission Shopping Programs"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-blue-900">
                <strong>Email Alerts:</strong> You&apos;ll receive daily emails when new programs
                match this search.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowSaveDialog(false);
                  setSaveName('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmSaveSearch}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save & Enable Alerts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
