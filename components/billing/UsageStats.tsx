'use client'

interface UsageStatsProps {
  tier: string
  usage: {
    [key: string]: {
      current: number
      limit: number | boolean | typeof Infinity
      percentage?: number
    }
  }
}

export function UsageStats({ tier, usage }: UsageStatsProps) {
  const getProgressColor = (percentage?: number) => {
    if (!percentage) return 'bg-gray-300'
    if (percentage >= 90) return 'bg-red-500'
    if (percentage >= 70) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const formatFeatureName = (key: string) => {
    return key
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const formatLimit = (limit: number | boolean | typeof Infinity) => {
    if (limit === Infinity) return 'Unlimited'
    if (typeof limit === 'boolean') return limit ? 'Yes' : 'No'
    return limit.toString()
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Usage Statistics</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            tier === 'enterprise'
              ? 'bg-purple-100 text-purple-700'
              : tier === 'business'
              ? 'bg-blue-100 text-blue-700'
              : tier === 'pro'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          {tier.toUpperCase()}
        </span>
      </div>

      <div className="space-y-4">
        {Object.entries(usage).map(([feature, data]) => {
          const isBooleanFeature = typeof data.limit === 'boolean'
          const isUnlimited = data.limit === Infinity
          const percentage = data.percentage || 0

          return (
            <div key={feature} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{formatFeatureName(feature)}</span>
                <span className="text-gray-600">
                  {isBooleanFeature ? (
                    data.limit ? (
                      <span className="text-green-600">✓ Enabled</span>
                    ) : (
                      <span className="text-gray-400">✗ Disabled</span>
                    )
                  ) : (
                    <>
                      {data.current} / {formatLimit(data.limit)}
                    </>
                  )}
                </span>
              </div>

              {!isBooleanFeature && !isUnlimited && typeof data.limit === 'number' && (
                <div className="relative">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-2 rounded-full transition-all ${getProgressColor(percentage)}`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                  {percentage >= 80 && percentage < 100 && (
                    <p className="text-xs text-yellow-600 mt-1">Approaching limit</p>
                  )}
                  {percentage >= 100 && (
                    <p className="text-xs text-red-600 mt-1">Limit reached</p>
                  )}
                </div>
              )}

              {isUnlimited && (
                <div className="text-xs text-green-600">Unlimited usage available</div>
              )}
            </div>
          )
        })}
      </div>

      {tier === 'free' && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <a
            href="/billing/upgrade"
            className="block w-full text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-600 transition-colors"
          >
            Upgrade for Unlimited Access
          </a>
        </div>
      )}
    </div>
  )
}
