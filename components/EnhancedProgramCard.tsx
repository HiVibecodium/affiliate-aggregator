/**
 * Enhanced Program Card
 *
 * Rich program card with badges, ratings, and detailed info
 */

import Link from 'next/link'
import {
  calculateDifficulty,
  isNewProgram,
  formatPaymentMethods,
  formatCookieDuration,
  formatCommissionRate,
  formatPaymentThreshold,
  getQualityBadge,
} from '@/lib/program-badges'

interface Program {
  id: string
  name: string
  description: string | null
  category: string | null
  commissionRate: number | null
  commissionType: string | null
  cookieDuration: number | null
  paymentThreshold: number | null
  paymentMethods: string[]
  createdAt: Date
  network: {
    name: string
  }
}

interface EnhancedProgramCardProps {
  program: Program
  showFavoriteButton?: boolean
  showCompareButton?: boolean
}

export function EnhancedProgramCard({
  program,
  showFavoriteButton = true,
  showCompareButton = true,
}: EnhancedProgramCardProps) {
  const difficulty = calculateDifficulty(program)
  const isNew = isNewProgram(program.createdAt)
  const quality = getQualityBadge(program)

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all p-6">
      {/* Header with Badges */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <Link href={`/programs/${program.id}`} className="group">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {program.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 mt-1">{program.network.name}</p>
        </div>

        <div className="flex flex-col gap-1 ml-4">
          {/* NEW Badge */}
          {isNew && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded whitespace-nowrap">
              🆕 NEW
            </span>
          )}

          {/* Quality Badge */}
          {quality && (
            <span className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap ${quality.color}`}>
              ⭐ {quality.label}
            </span>
          )}

          {/* Difficulty Badge */}
          <span
            className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap ${difficulty.bgColor} ${difficulty.color}`}
            title={difficulty.description}
          >
            {difficulty.level === 'easy' && '🟢'}
            {difficulty.level === 'medium' && '🟡'}
            {difficulty.level === 'hard' && '🔴'} {difficulty.label}
          </span>
        </div>
      </div>

      {/* Description */}
      {program.description && (
        <p className="text-sm text-gray-700 mb-4 line-clamp-2">{program.description}</p>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-gray-100">
        {/* Commission */}
        <div className="flex items-center text-sm">
          <span className="text-gray-600 mr-2">💰 Commission:</span>
          <span className="font-semibold text-gray-900">
            {formatCommissionRate(program.commissionRate, program.commissionType)}
          </span>
        </div>

        {/* Cookie Duration */}
        <div className="flex items-center text-sm">
          <span className="text-gray-600 mr-2">🍪 Cookie:</span>
          <span className="font-semibold text-gray-900">
            {formatCookieDuration(program.cookieDuration)}
          </span>
        </div>

        {/* Payment Threshold */}
        <div className="flex items-center text-sm">
          <span className="text-gray-600 mr-2">💵 Min Payout:</span>
          <span className="font-semibold text-gray-900">
            {formatPaymentThreshold(program.paymentThreshold)}
          </span>
        </div>

        {/* Payment Methods */}
        <div className="flex items-center text-sm">
          <span className="text-gray-600 mr-2">💳 Methods:</span>
          <span className="font-semibold text-gray-900" title={program.paymentMethods.join(', ')}>
            {formatPaymentMethods(program.paymentMethods)}
          </span>
        </div>
      </div>

      {/* Category Tag */}
      {program.category && (
        <div className="mb-4">
          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
            {program.category}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Link
          href={`/programs/${program.id}`}
          className="flex-1 text-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          View Details
        </Link>

        {showFavoriteButton && (
          <button
            onClick={(e) => {
              e.preventDefault()
              // TODO: Implement favorite toggle
              console.log('Add to favorites:', program.id)
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            title="Add to favorites"
          >
            ❤️
          </button>
        )}

        {showCompareButton && (
          <button
            onClick={(e) => {
              e.preventDefault()
              // TODO: Implement compare toggle
              console.log('Add to compare:', program.id)
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            title="Add to compare"
          >
            ⚖️
          </button>
        )}
      </div>
    </div>
  )
}
