'use client';
import { logger } from '@/lib/logger';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface InviteData {
  organizationName: string;
  role: string;
  inviterName: string;
  expiresIn: number; // days
  valid: boolean;
  error?: string;
}

export default function InviteAcceptPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = params.token as string;
  const memberId = searchParams.get('member');

  const [invite, setInvite] = useState<InviteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token && memberId) {
      verifyInvite();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, memberId]);

  const verifyInvite = async () => {
    try {
      const response = await fetch(`/api/invite/verify?token=${token}&member=${memberId}`);
      const data = await response.json();

      if (response.ok) {
        setInvite(data);
      } else {
        setError(data.error || 'Invalid invitation');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify invitation';
      setError(errorMessage);
      logger.error('Invite verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    setAccepting(true);
    try {
      const response = await fetch('/api/invite/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, memberId }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - redirect to team page
        alert('Приглашение принято! Добро пожаловать в команду.');
        router.push('/settings/team');
      } else {
        setError(data.error || 'Failed to accept invitation');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to accept invitation';
      setError(errorMessage);
      logger.error('Invite acceptance error:', err);
    } finally {
      setAccepting(false);
    }
  };

  const handleDecline = async () => {
    if (!confirm('Вы уверены, что хотите отклонить приглашение?')) return;

    try {
      await fetch('/api/invite/decline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, memberId }),
      });

      alert('Приглашение отклонено');
      router.push('/');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to decline invitation';
      setError(errorMessage);
      logger.error('Invite decline error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Проверка приглашения...</p>
        </div>
      </div>
    );
  }

  if (error || !invite?.valid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Недействительное приглашение</h1>
          <p className="text-gray-600 mb-6">
            {error || invite?.error || 'Ссылка истекла или уже использована'}
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            На главную
          </Link>
        </div>
      </div>
    );
  }

  const roleLabels: Record<string, string> = {
    owner: 'Владелец',
    admin: 'Администратор',
    manager: 'Менеджер',
    member: 'Участник',
    viewer: 'Наблюдатель',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 text-center">
          <div className="text-6xl mb-4">👥</div>
          <h1 className="text-3xl font-bold mb-2">Приглашение в команду</h1>
          <p className="text-purple-100">Affiliate Aggregator</p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 text-lg mb-2">
              <strong className="text-gray-900">{invite.inviterName}</strong> приглашает вас
              присоединиться к:
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{invite.organizationName}</h2>
            <div className="inline-block bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold">
              👤 Роль: {roleLabels[invite.role] || invite.role}
            </div>
          </div>

          {/* Features based on role */}
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4">🎯 Ваши возможности:</h3>
            <ul className="space-y-2 text-gray-700">
              {(invite.role === 'owner' || invite.role === 'admin') && (
                <>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Полный доступ ко всем функциям
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Управление командой
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Billing & subscription
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Аналитика и отчёты
                  </li>
                </>
              )}
              {invite.role === 'manager' && (
                <>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Управление программами
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Team analytics
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Совместная работа
                  </li>
                </>
              )}
              {invite.role === 'member' && (
                <>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Shared favorites
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Program comparison
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Basic analytics
                  </li>
                </>
              )}
              {invite.role === 'viewer' && (
                <>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Просмотр программ
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    Базовая аналитика
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Expiry warning */}
          {invite.expiresIn <= 2 && (
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
              <p className="text-orange-800 font-medium">
                ⚠️ Приглашение истекает через {invite.expiresIn}{' '}
                {invite.expiresIn === 1 ? 'день' : 'дня'}!
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleAccept}
              disabled={accepting}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-lg font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {accepting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Принимаем...
                </span>
              ) : (
                '✅ Принять приглашение'
              )}
            </button>
            <button
              onClick={handleDecline}
              disabled={accepting}
              className="px-6 py-4 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Отклонить
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Приняв приглашение, вы согласитесь с{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">
              Условиями использования
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
