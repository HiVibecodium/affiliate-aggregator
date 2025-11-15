'use client'

interface Stats {
  totalPrograms: number
  totalNetworks: number
  totalClicks: number
  totalReviews: number
  avgCommission: string
}

interface StatsCardsProps {
  stats: Stats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Всего Программ',
      value: stats.totalPrograms.toLocaleString(),
      icon: '📊',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Партнёрских Сетей',
      value: stats.totalNetworks.toLocaleString(),
      icon: '🌐',
      color: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Всего Кликов',
      value: stats.totalClicks.toLocaleString(),
      icon: '👆',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Отзывов',
      value: stats.totalReviews.toLocaleString(),
      icon: '⭐',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'Средняя Комиссия',
      value: `${stats.avgCommission}%`,
      icon: '💰',
      color: 'from-emerald-500 to-emerald-600',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`bg-gradient-to-br ${card.color} rounded-lg p-6 text-white shadow-lg`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-3xl">{card.icon}</span>
          </div>
          <div className="text-3xl font-bold mb-1">{card.value}</div>
          <div className="text-sm opacity-90">{card.title}</div>
        </div>
      ))}
    </div>
  )
}
