'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { translateCategory } from '@/lib/translations/categories';

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
  averageRating?: number | null;
  reviewCount?: number;
}

interface QuickViewModalProps {
  programId: string | null;
  onClose: () => void;
  onAddToFavorites?: (programId: string) => void;
  onAddToCompare?: (program: Program) => void;
}

export function QuickViewModal({
  programId,
  onClose,
  onAddToFavorites,
  onAddToCompare,
}: QuickViewModalProps) {
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!programId) {
      setProgram(null);
      return;
    }

    const fetchProgram = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/programs/${programId}`);
        if (response.ok) {
          const data = await response.json();
          setProgram(data);
        }
      } catch (error) {
        console.error('Failed to fetch program:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgram();
  }, [programId]);

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Lock body scroll
  useEffect(() => {
    if (programId) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [programId]);

  if (!programId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 animate-fade-in" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors z-10 touch-target haptic-feedback"
        >
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : program ? (
          <div className="overflow-y-auto max-h-[90vh]">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-3xl font-bold">
                  {program.name[0]}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-1">{program.name}</h2>
                  <p className="text-blue-100">{program.network.name}</p>
                  {program.averageRating && (
                    <div className="flex items-center gap-1 mt-2">
                      <span className="text-yellow-300">⭐</span>
                      <span>{program.averageRating.toFixed(1)}</span>
                      {program.reviewCount && (
                        <span className="text-blue-200">({program.reviewCount} отзывов)</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {program.commissionRate}%
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Комиссия</p>
                  <p className="text-xs text-gray-500">{program.commissionType}</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {program.cookieDuration}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Дней cookie</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    ${program.paymentThreshold}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Мин. выплата</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Описание</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {program.description}
                </p>
              </div>

              {/* Category */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Категория</h3>
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-medium">
                  {translateCategory(program.category)}
                </span>
              </div>

              {/* Payment methods */}
              {program.paymentMethods && program.paymentMethods.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Способы оплаты
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {program.paymentMethods.map((method) => (
                      <span
                        key={method}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t dark:border-gray-700">
                <Link
                  href={`/programs/${program.id}`}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-center transition-colors touch-target haptic-feedback"
                >
                  Подробнее
                </Link>
                {onAddToFavorites && (
                  <button
                    onClick={() => onAddToFavorites(program.id)}
                    className="px-4 py-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 rounded-xl hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors touch-target haptic-feedback"
                  >
                    ⭐
                  </button>
                )}
                {onAddToCompare && (
                  <button
                    onClick={() => onAddToCompare(program)}
                    className="px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors touch-target haptic-feedback"
                  >
                    ⚖️
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Программа не найдена</p>
          </div>
        )}
      </div>
    </div>
  );
}
