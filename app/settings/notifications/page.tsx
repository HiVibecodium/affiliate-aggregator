'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface NotificationSettings {
  all: boolean;
  newPrograms: boolean;
  commissionUpdates: boolean;
  weeklyDigest: boolean;
  savedSearchAlerts: boolean;
  favoriteUpdates: boolean;
  securityAlerts: boolean;
  marketingEmails: boolean;
  digestFrequency: 'daily' | 'weekly' | 'monthly' | 'never';
}

interface NotificationHistory {
  id: string;
  sentAt: string;
  subject: string;
  success: boolean;
  provider: string;
  tags: string[];
}

const DEFAULT_SETTINGS: NotificationSettings = {
  all: true,
  newPrograms: true,
  commissionUpdates: true,
  weeklyDigest: true,
  savedSearchAlerts: true,
  favoriteUpdates: true,
  securityAlerts: true,
  marketingEmails: false,
  digestFrequency: 'weekly',
};

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [email, setEmail] = useState<string>('');
  const [history, setHistory] = useState<NotificationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Загрузка настроек
  const loadSettings = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
        setEmail(data.email || '');
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }, []);

  // Загрузка истории
  const loadHistory = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications/history?limit=10');
      if (response.ok) {
        const data = await response.json();
        setHistory(data.notifications);
      }
    } catch (error) {
      console.error('Error loading history:', error);
    }
  }, []);

  useEffect(() => {
    Promise.all([loadSettings(), loadHistory()]).finally(() => setLoading(false));
  }, [loadSettings, loadHistory]);

  // Сохранение настроек
  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/notifications/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Настройки сохранены!' });
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Ошибка сохранения' });
      }
    } catch (_error) {
      setMessage({ type: 'error', text: 'Ошибка соединения' });
    } finally {
      setSaving(false);
    }
  };

  // Отправка тестового письма
  const handleSendTest = async () => {
    setSendingTest(true);
    setMessage(null);

    try {
      const response = await fetch('/api/notifications/settings', {
        method: 'POST',
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Тестовое письмо отправлено!' });
        // Обновляем историю
        setTimeout(loadHistory, 2000);
      } else {
        const data = await response.json();
        setMessage({ type: 'error', text: data.error || 'Ошибка отправки' });
      }
    } catch (_error) {
      setMessage({ type: 'error', text: 'Ошибка соединения' });
    } finally {
      setSendingTest(false);
    }
  };

  // Переключатель настройки
  const ToggleSwitch = ({
    label,
    description,
    checked,
    onChange,
    disabled,
  }: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
  }) => (
    <label
      className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors ${
        disabled
          ? 'opacity-50 cursor-not-allowed bg-gray-50 dark:bg-gray-800'
          : 'hover:bg-gray-50 dark:hover:bg-gray-700'
      }`}
    >
      <div className="flex-1">
        <div className="font-medium text-gray-900 dark:text-white">{label}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
      </div>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <div
          className={`w-11 h-6 rounded-full transition-colors ${
            checked ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
              checked ? 'translate-x-5' : 'translate-x-0.5'
            } mt-0.5`}
          />
        </div>
      </div>
    </label>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/settings"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm mb-2 inline-block"
          >
            ← Назад к настройкам
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Настройки уведомлений
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Управление email уведомлениями • {email}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Message */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Global Toggle */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Глобальные настройки
            </h2>
            <ToggleSwitch
              label="Все уведомления"
              description="Главный переключатель для всех email уведомлений"
              checked={settings.all}
              onChange={(checked) => setSettings({ ...settings, all: checked })}
            />
          </div>

          {/* Notification Types */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Типы уведомлений
            </h2>
            <div className="space-y-2">
              <ToggleSwitch
                label="Новые программы"
                description="Уведомления о новых партнерских программах в вашей нише"
                checked={settings.newPrograms}
                onChange={(checked) => setSettings({ ...settings, newPrograms: checked })}
                disabled={!settings.all}
              />

              <ToggleSwitch
                label="Изменения комиссий"
                description="Уведомления при изменении ставок комиссий"
                checked={settings.commissionUpdates}
                onChange={(checked) => setSettings({ ...settings, commissionUpdates: checked })}
                disabled={!settings.all}
              />

              <ToggleSwitch
                label="Оповещения о сохраненных поисках"
                description="Уведомления о новых программах по вашим сохраненным поискам"
                checked={settings.savedSearchAlerts}
                onChange={(checked) => setSettings({ ...settings, savedSearchAlerts: checked })}
                disabled={!settings.all}
              />

              <ToggleSwitch
                label="Обновления избранного"
                description="Уведомления об изменениях в избранных программах"
                checked={settings.favoriteUpdates}
                onChange={(checked) => setSettings({ ...settings, favoriteUpdates: checked })}
                disabled={!settings.all}
              />

              <ToggleSwitch
                label="Безопасность"
                description="Важные уведомления о безопасности аккаунта"
                checked={settings.securityAlerts}
                onChange={(checked) => setSettings({ ...settings, securityAlerts: checked })}
                disabled={!settings.all}
              />

              <ToggleSwitch
                label="Маркетинговые письма"
                description="Новости, советы и специальные предложения"
                checked={settings.marketingEmails}
                onChange={(checked) => setSettings({ ...settings, marketingEmails: checked })}
                disabled={!settings.all}
              />
            </div>
          </div>

          {/* Digest Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Дайджест</h2>
            <ToggleSwitch
              label="Еженедельный дайджест"
              description="Сводка популярных программ и аналитика"
              checked={settings.weeklyDigest}
              onChange={(checked) => setSettings({ ...settings, weeklyDigest: checked })}
              disabled={!settings.all}
            />

            {settings.weeklyDigest && settings.all && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Частота дайджеста
                </label>
                <select
                  value={settings.digestFrequency}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      digestFrequency: e.target.value as NotificationSettings['digestFrequency'],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="daily">Ежедневно</option>
                  <option value="weekly">Еженедельно</option>
                  <option value="monthly">Ежемесячно</option>
                </select>
              </div>
            )}
          </div>

          {/* Test Email */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Тестирование</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Отправьте тестовое письмо для проверки настроек
            </p>
            <button
              onClick={handleSendTest}
              disabled={sendingTest}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {sendingTest ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Отправка...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  Отправить тестовое письмо
                </>
              )}
            </button>
          </div>

          {/* Notification History */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              История уведомлений
            </h2>
            {history.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                История уведомлений пуста
              </p>
            ) : (
              <div className="space-y-3">
                {history.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          notification.success ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      />
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {notification.subject}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(notification.sentAt).toLocaleString('ru-RU')}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {notification.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/settings"
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            >
              Отмена
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? 'Сохранение...' : 'Сохранить настройки'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
