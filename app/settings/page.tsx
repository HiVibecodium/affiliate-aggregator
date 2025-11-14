'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    newProgramAlerts: false,
    commissionUpdates: true,
    weeklyDigest: false,
    preferredCategories: [] as string[],
  });

  const handleSave = () => {
    // Save to localStorage for now
    localStorage.setItem('user_preferences', JSON.stringify(preferences));
    alert('Настройки сохранены!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block">
            ← Назад на главную
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Настройки</h1>
          <p className="text-gray-600 mt-1">Управление предпочтениями и уведомлениями</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Уведомления</h2>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900">Email уведомления</div>
                  <div className="text-sm text-gray-500">Получать важные обновления на email</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.emailNotifications}
                  onChange={(e) =>
                    setPreferences({ ...preferences, emailNotifications: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900">Новые программы</div>
                  <div className="text-sm text-gray-500">
                    Уведомления о новых партнерских программах
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.newProgramAlerts}
                  onChange={(e) =>
                    setPreferences({ ...preferences, newProgramAlerts: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900">Изменения комиссий</div>
                  <div className="text-sm text-gray-500">
                    Уведомления при изменении процента комиссии
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.commissionUpdates}
                  onChange={(e) =>
                    setPreferences({ ...preferences, commissionUpdates: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <div className="font-medium text-gray-900">Еженедельный дайджест</div>
                  <div className="text-sm text-gray-500">
                    Сводка популярных программ раз в неделю
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.weeklyDigest}
                  onChange={(e) =>
                    setPreferences({ ...preferences, weeklyDigest: e.target.checked })
                  }
                  className="w-5 h-5 text-blue-600 rounded"
                />
              </label>
            </div>
          </div>

          {/* Display Preferences */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Отображение</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Количество программ на странице
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="20">20 программ</option>
                  <option value="50">50 программ</option>
                  <option value="100">100 программ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Язык интерфейса
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </Link>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Сохранить настройки
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
