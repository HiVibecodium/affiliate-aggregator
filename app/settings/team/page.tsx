'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useOrganization } from '@/contexts/OrganizationContext';

interface Member {
  id: string;
  userId: string;
  role: string;
  status: string;
  invitedEmail?: string;
  user?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
  tier: string;
  members: Member[];
}

export default function TeamManagementPage() {
  const { currentOrgId } = useOrganization();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    if (currentOrgId) {
      fetchOrganization();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrgId]);

  const fetchOrganization = async () => {
    if (!currentOrgId) return;

    try {
      // Fetch organization details and members in parallel
      const [orgResponse, membersResponse] = await Promise.all([
        fetch(`/api/organizations/${currentOrgId}`),
        fetch(`/api/organizations/${currentOrgId}/members`),
      ]);

      if (orgResponse.ok && membersResponse.ok) {
        const orgData = await orgResponse.json();
        const membersData = await membersResponse.json();

        // Combine data
        setOrganization({
          ...orgData,
          members: membersData.members || [],
        });
      } else {
        console.error('Failed to fetch:', {
          org: orgResponse.status,
          members: membersResponse.status,
        });
      }
    } catch (error) {
      console.error('Failed to fetch organization:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrgId) return;

    setInviting(true);

    try {
      const response = await fetch(`/api/organizations/${currentOrgId}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail,
          role: inviteRole,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to invite member');
      }

      alert('Invitation sent successfully!');
      setShowInviteModal(false);
      setInviteEmail('');
      setInviteRole('member');
      fetchOrganization(); // Refresh list
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to send invitation');
    } finally {
      setInviting(false);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Удалить этого участника команды?')) return;
    if (!currentOrgId) return;

    try {
      const response = await fetch(`/api/organizations/${currentOrgId}/members/${memberId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove member');
      }

      alert('Участник успешно удален');
      fetchOrganization();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to remove member');
    }
  };

  const handleChangeRole = async (memberId: string, newRole: string) => {
    if (!currentOrgId) return;

    try {
      const response = await fetch(`/api/organizations/${currentOrgId}/members/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to change role');
      }

      alert('Роль успешно обновлена');
      fetchOrganization();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to change role');
    }
  };

  const tierLimits: Record<string, number> = {
    free: 1,
    pro: 1,
    business: 5,
    enterprise: 999,
  };

  const seatsLimit = organization ? tierLimits[organization.tier] || 1 : 1;
  const seatsUsed = organization?.members.filter((m) => m.status === 'active').length || 0;
  const canInvite = seatsUsed < seatsLimit;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading team...</p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Organization not found</p>
          <Link href="/settings" className="text-blue-600 hover:underline mt-4 inline-block">
            Back to Settings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/settings"
            className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block"
          >
            ← Назад в настройки
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
              <p className="text-gray-600 mt-1">{organization.name}</p>
            </div>
            <button
              onClick={() => setShowInviteModal(true)}
              disabled={!canInvite}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                canInvite
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              title={
                !canInvite ? 'Достигнут лимит мест. Обновите план для добавления участников.' : ''
              }
            >
              + Пригласить участника
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Seat Usage */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Team Seats</h2>
            <span
              className={`text-lg font-bold ${
                seatsUsed >= seatsLimit ? 'text-red-600' : 'text-gray-700'
              }`}
            >
              {seatsUsed} / {seatsLimit} used
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full transition-all ${
                seatsUsed >= seatsLimit ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min((seatsUsed / seatsLimit) * 100, 100)}%` }}
            ></div>
          </div>

          {seatsUsed >= seatsLimit && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-yellow-400 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Seat limit reached</h3>
                  <p className="mt-1 text-sm text-yellow-700">
                    Upgrade to Business or Enterprise plan to add more team members.
                  </p>
                  <Link
                    href="/billing/upgrade"
                    className="mt-2 inline-block text-sm font-medium text-yellow-800 hover:text-yellow-900 underline"
                  >
                    Обновить сейчас →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Plan info */}
          <div className="mt-4 text-sm text-gray-600">
            <p>
              Current plan: <span className="font-semibold capitalize">{organization.tier}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {organization.tier === 'free' && 'Free: 1 seat'}
              {organization.tier === 'pro' && 'Pro: 1 seat'}
              {organization.tier === 'business' && 'Business: 5 seats'}
              {organization.tier === 'enterprise' && 'Enterprise: Unlimited seats'}
            </p>
          </div>
        </div>

        {/* Members List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Team Members</h2>
          </div>

          <div className="divide-y">
            {organization.members.map((member) => (
              <div key={member.id} className="px-6 py-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-semibold">
                      {member.user?.name?.[0] || member.invitedEmail?.[0] || '?'}
                    </div>

                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {member.user?.name || member.invitedEmail || 'Unknown'}
                        </h3>
                        {member.status === 'pending' && (
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded">
                            Pending
                          </span>
                        )}
                        {member.role === 'owner' && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded">
                            Owner
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        {member.user?.email || member.invitedEmail}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Role: <span className="capitalize font-medium">{member.role}</span>
                        {member.status === 'active' && (
                          <> • Joined {new Date(member.createdAt).toLocaleDateString()}</>
                        )}
                        {member.status === 'pending' && <> • Приглашен, ожидает принятия</>}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  {member.role !== 'owner' && (
                    <div className="flex items-center gap-2">
                      {/* Role selector */}
                      <select
                        value={member.role}
                        onChange={(e) => handleChangeRole(member.id, e.target.value)}
                        className="border border-gray-300 rounded px-3 py-1 text-sm"
                      >
                        <option value="viewer">Наблюдатель</option>
                        <option value="member">Участник</option>
                        <option value="manager">Менеджер</option>
                        <option value="admin">Администратор</option>
                      </select>

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-medium transition"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {organization.members.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-500">
                <p>No team members yet</p>
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Пригласите первого участника →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Role Descriptions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Role Permissions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">👑 Owner</h4>
              <p className="text-gray-600">Full access, billing, delete organization</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">🔧 Admin</h4>
              <p className="text-gray-600">Manage users, programs, view analytics</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">📊 Manager</h4>
              <p className="text-gray-600">Manage programs, view analytics</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">👤 Member</h4>
              <p className="text-gray-600">View and create programs</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">👁️ Viewer</h4>
              <p className="text-gray-600">Read-only access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Invite Team Member</h2>

            <form onSubmit={handleInvite}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                  placeholder="colleague@company.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Роль</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="viewer">Наблюдатель - Только чтение</option>
                  <option value="member">Участник - Просмотр и создание</option>
                  <option value="manager">Менеджер - Управление программами</option>
                  <option value="admin">Администратор - Полный доступ (кроме биллинга)</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={inviting}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-300"
                >
                  {inviting ? 'Sending...' : 'Send Invite'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
