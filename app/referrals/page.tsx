'use client';

import { useState, useEffect } from 'react';

interface ReferralData {
  referralCode: string;
  stats: {
    total: number;
    completed: number;
    rewarded: number;
    pending: number;
  };
}

export default function ReferralsPage() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Mock user - replace with actual auth
  const userId = 'current-user-id';

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const response = await fetch(`/api/referrals?userId=${userId}`);
      const data = await response.json();
      setReferralData(data);
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    if (!referralData) return;
    const link = `${window.location.origin}/signup?ref=${referralData.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    if (!referralData) return;
    const link = `${window.location.origin}/signup?ref=${referralData.referralCode}`;
    const subject = 'Join Affiliate Aggregator - Get 50% Off!';
    const body = `Hey! I've been using Affiliate Aggregator to find the best affiliate programs. Join using my link and get 50% off your first month:\n\n${link}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const referralLink = referralData
    ? `${window.location.origin}/signup?ref=${referralData.referralCode}`
    : '';

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🎁 Referral Program</h1>
          <p className="text-xl text-gray-600">
            Пригласи друзей и получи 1 месяц Pro бесплатно за каждого!
          </p>
        </div>

        {/* Stats Cards */}
        {referralData && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-3xl font-bold text-blue-600">{referralData.stats.total}</div>
              <div className="text-sm text-gray-600">Всего приглашений</div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-3xl font-bold text-green-600">
                {referralData.stats.completed}
              </div>
              <div className="text-sm text-gray-600">Зарегистрировались</div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-3xl font-bold text-purple-600">
                {referralData.stats.rewarded}
              </div>
              <div className="text-sm text-gray-600">Оплатили</div>
            </div>
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="text-3xl font-bold text-yellow-600">
                {referralData.stats.rewarded}
              </div>
              <div className="text-sm text-gray-600">Месяцев бесплатно</div>
            </div>
          </div>
        )}

        {/* Referral Link */}
        <div className="bg-white rounded-lg p-8 border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Твоя Реферальная Ссылка</h2>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <code className="text-blue-600 break-all">{referralLink}</code>
          </div>

          <div className="flex gap-3">
            <button
              onClick={copyReferralLink}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {copied ? '✅ Скопировано!' : '📋 Копировать Ссылку'}
            </button>
            <button
              onClick={shareViaEmail}
              className="flex-1 px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              📧 Отправить Email
            </button>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Как Это Работает</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Пригласи</h3>
              <p className="text-sm text-gray-600">Отправь свою ссылку друзьям или коллегам</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Они Регистрируются</h3>
              <p className="text-sm text-gray-600">Друг получает 50% скидку на первый месяц Pro</p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Получай Награды</h3>
              <p className="text-sm text-gray-600">
                Ты получаешь 1 месяц Pro бесплатно за каждого платящего!
              </p>
            </div>
          </div>
        </div>

        {/* Rewards */}
        <div className="bg-white rounded-lg p-8 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">💰 Награды</h2>

          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-green-100 rounded-lg p-3 mr-4">
                <span className="text-2xl">🎁</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Для Тебя</h3>
                <p className="text-gray-600">
                  <strong>1 месяц Pro бесплатно</strong> за каждого друга, который оформит платную
                  подписку
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="bg-blue-100 rounded-lg p-3 mr-4">
                <span className="text-2xl">🎉</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Для Твоего Друга</h3>
                <p className="text-gray-600">
                  <strong>50% скидка на первый месяц</strong> любого платного тарифа
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-500 text-center">
              Нет лимита на количество приглашений. Приглашай сколько хочешь!
            </p>
          </div>
        </div>

        {/* Share Options */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">Поделись в социальных сетях:</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                const text = `Нашёл отличный сервис для поиска партнёрских программ! ${referralLink}`;
                window.open(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
                  '_blank'
                );
              }}
              className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500"
            >
              Twitter
            </button>
            <button
              onClick={() => {
                window.open(
                  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
                  '_blank'
                );
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Facebook
            </button>
            <button
              onClick={() => {
                window.open(
                  `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
                  '_blank'
                );
              }}
              className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
            >
              LinkedIn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
