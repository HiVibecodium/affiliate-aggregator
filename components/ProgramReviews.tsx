'use client';
import { logger } from '@/lib/logger';

import { useState, useEffect } from 'react';

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  isVerified: boolean;
  experience?: string;
  monthsUsed?: number;
  helpfulCount: number;
  notHelpfulCount: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
  };
}

interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: Array<{ stars: number; count: number }>;
}

interface ProgramReviewsProps {
  programId: string;
}

export function ProgramReviews({ programId }: ProgramReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/${programId}`);
      const data = await response.json();

      setReviews(data.reviews || []);
      setStats(data.stats || null);
    } catch (error) {
      logger.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}>
            ⭐
          </span>
        ))}
        <span className="ml-2 text-sm font-medium text-gray-700">{rating.toFixed(1)}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Загрузка отзывов...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating summary */}
      {stats && stats.totalReviews > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="mt-1">{renderStars(Math.round(stats.averageRating))}</div>
              <div className="text-sm text-gray-600 mt-2">
                {stats.totalReviews} {stats.totalReviews === 1 ? 'отзыв' : 'отзывов'}
              </div>
            </div>

            {/* Rating distribution */}
            <div className="flex-1">
              {[5, 4, 3, 2, 1].map((stars) => {
                const dist = stats.distribution.find((d) => d.stars === stars);
                const count = dist?.count || 0;
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;

                return (
                  <div key={stars} className="flex items-center gap-2 mb-1">
                    <span className="text-sm w-8">{stars}⭐</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600">Пока нет отзывов об этой программе</p>
          <p className="text-sm text-gray-500 mt-2">Будьте первым кто оставит отзыв!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow p-6">
              {/* Review header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {renderStars(review.rating)}
                    {review.isVerified && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{review.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <span>{review.user.name || 'Anonymous'}</span>
                    {review.experience && (
                      <>
                        <span>•</span>
                        <span className="capitalize">{review.experience}</span>
                      </>
                    )}
                    {review.monthsUsed && (
                      <>
                        <span>•</span>
                        <span>{review.monthsUsed} months experience</span>
                      </>
                    )}
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>

              {/* Review content */}
              <p className="text-gray-700 mb-4">{review.content}</p>

              {/* Pros & Cons */}
              {(review.pros.length > 0 || review.cons.length > 0) && (
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {review.pros.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">👍 Плюсы:</h4>
                      <ul className="space-y-1">
                        {review.pros.map((pro, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            • {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {review.cons.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">👎 Минусы:</h4>
                      <ul className="space-y-1">
                        {review.cons.map((con, idx) => (
                          <li key={idx} className="text-sm text-gray-700">
                            • {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Helpfulness */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600 transition">
                    <span>👍</span>
                    <span>Полезно ({review.helpfulCount})</span>
                  </button>
                  <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition">
                    <span>👎</span>
                    <span>Не полезно ({review.notHelpfulCount})</span>
                  </button>
                </div>
                <button className="text-xs text-gray-500 hover:text-gray-700">Пожаловаться</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
