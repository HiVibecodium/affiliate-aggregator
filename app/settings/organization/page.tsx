'use client';
import { logger } from '@/lib/logger';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useOrganization } from '@/contexts/OrganizationContext';

interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  website: string | null;
  tier: string;
  createdAt: string;
}

export default function OrganizationSettingsPage() {
  const router = useRouter();
  const { currentOrgId } = useOrganization();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [website, setWebsite] = useState('');

  useEffect(() => {
    if (currentOrgId) {
      fetchOrganization();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrgId]);

  const fetchOrganization = async () => {
    if (!currentOrgId) return;

    try {
      const response = await fetch(`/api/organizations/${currentOrgId}`);
      if (response.ok) {
        const data = await response.json();
        setOrganization(data);
        setName(data.name || '');
        setSlug(data.slug || '');
        setDescription(data.description || '');
        setWebsite(data.website || '');
      }
    } catch (error) {
      logger.error('Failed to fetch organization:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentOrgId) return;

    setSaving(true);

    try {
      const response = await fetch(`/api/organizations/${currentOrgId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          description: description || null,
          website: website || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update organization');
      }

      alert('Organization settings saved successfully!');
      fetchOrganization();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmText = 'DELETE';
    const userInput = prompt(
      `⚠️ WARNING: This will permanently delete your organization and ALL data!\n\nType "${confirmText}" to confirm:`
    );

    if (userInput !== confirmText) {
      alert('Deletion cancelled');
      return;
    }

    if (!currentOrgId) return;

    setDeleting(true);

    try {
      const response = await fetch(`/api/organizations/${currentOrgId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete organization');
      }

      alert('Organization deleted successfully');
      router.push('/');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete organization');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка организации...</p>
        </div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Организация не найдена</p>
          <Link href="/settings" className="text-blue-600 hover:underline mt-4 inline-block">
            Назад в настройки
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/settings"
            className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block"
          >
            ← Назад в настройки
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Настройки организации</h1>
          <p className="text-gray-600 mt-1">Управление профилем и настройками организации</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSave} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Основная информация</h2>

            <div className="space-y-4">
              {/* Название организации */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Название организации *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="My Company Inc."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Это название будет видно участникам команды
                </p>
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  URL организации *
                </label>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">affiliate-aggregator.com/org/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) =>
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))
                    }
                    required
                    pattern="[a-z0-9-]+"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="my-company"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Только строчные буквы, цифры и дефисы</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Краткое описание вашей организации..."
                />
                <p className="text-xs text-gray-500 mt-1">Необязательно</p>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">URL сайта</label>
                <input
                  type="url"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://example.com"
                />
                <p className="text-xs text-gray-500 mt-1">Необязательно</p>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-end gap-4">
              <Link
                href="/settings"
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
            </div>
          </div>

          {/* Subscription Info */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Текущий план</h3>
                <p className="text-3xl font-bold text-purple-600 capitalize mb-2">
                  {organization.tier}
                </p>
                <p className="text-sm text-gray-600">
                  {organization.tier === 'free' && '1 место • Базовые функции'}
                  {organization.tier === 'pro' &&
                    '1 место • Email уведомления • Расширенные функции'}
                  {organization.tier === 'business' && '5 мест • API доступ • Командная работа'}
                  {organization.tier === 'enterprise' &&
                    'Неограниченно • Индивидуальные функции • Выделенная поддержка'}
                </p>
              </div>
              {organization.tier !== 'enterprise' && (
                <Link
                  href="/billing/upgrade"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
                >
                  Улучшить план →
                </Link>
              )}
            </div>
          </div>

          {/* Organization Info */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Информация об организации</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">ID организации:</span>
                <p className="font-mono text-gray-900 mt-1">{organization.id}</p>
              </div>
              <div>
                <span className="text-gray-600">Создана:</span>
                <p className="text-gray-900 mt-1">
                  {new Date(organization.createdAt).toLocaleDateString('ru-RU')}
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Опасная зона */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-red-200 p-6 mt-6">
          <h2 className="text-xl font-bold text-red-600 mb-4">⚠️ Опасная зона</h2>

          <div className="space-y-4">
            {/* Передать владение */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Передать владение</h3>
              <p className="text-sm text-gray-600 mb-3">
                Передать права владения организацией другому участнику команды
              </p>
              <button
                type="button"
                onClick={() => alert('Transfer ownership feature coming soon!')}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
              >
                Передать владение
              </button>
            </div>

            {/* Delete Organization */}
            <div>
              <h3 className="font-semibold text-red-600 mb-2">Удалить организацию</h3>
              <p className="text-sm text-gray-600 mb-3">
                Безвозвратно удалить организацию и все связанные данные. Это действие нельзя
                отменить.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-800 font-medium mb-2">Будет удалено:</p>
                <ul className="text-sm text-red-700 space-y-1 ml-4">
                  <li>• Все участники команды и приглашения</li>
                  <li>• Все сохраненные поиски и избранное</li>
                  <li>• Все данные отслеживания заявок</li>
                  <li>• Все данные биллинга и подписок</li>
                  <li>• Все логи аудита и история</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Удаление...' : '🗑️ Удалить организацию'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
