'use client';

import Link from 'next/link';

interface Program {
  id: string;
  name: string;
  description: string;
  category: string;
  commissionRate: number;
  commissionType: string;
  cookieDuration: number;
  paymentThreshold: number;
  paymentMethods: string[];
  network: {
    name: string;
    website: string;
  };
}

interface ProgramCardProps {
  program: Program;
  isFavorite: boolean;
  isInComparison: boolean;
  onFavoriteToggle: (programId: string) => void;
  onComparisonToggle: (program: Program) => void;
  onClickTrack: (programId: string) => void;
}

export function ProgramCard({
  program,
  isFavorite,
  isInComparison,
  onFavoriteToggle,
  onComparisonToggle,
  onClickTrack,
}: ProgramCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-blue-500">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link
            href={`/programs/${program.id}`}
            onClick={() => onClickTrack(program.id)}
            className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            {program.name}
          </Link>
          <p className="text-sm text-gray-600 mt-1">{program.network.name}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onFavoriteToggle(program.id);
            }}
            className={`p-2 rounded-lg transition-colors ${
              isFavorite
                ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            ⭐
          </button>

          {/* Compare button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onComparisonToggle(program);
            }}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              isInComparison
                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isInComparison ? '✓ В сравнении' : '+ Сравнить'}
          </button>
        </div>
      </div>

      <p className="text-gray-700 mb-4 line-clamp-2">{program.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-green-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Комиссия</p>
          <p className="text-2xl font-bold text-green-600">{program.commissionRate}%</p>
          <p className="text-xs text-gray-500">{program.commissionType}</p>
        </div>

        <div className="bg-blue-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Cookie</p>
          <p className="text-2xl font-bold text-blue-600">{program.cookieDuration}</p>
          <p className="text-xs text-gray-500">дней</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
          {program.category}
        </span>
        <span className="text-gray-600">
          Мин. выплата: ${program.paymentThreshold.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
