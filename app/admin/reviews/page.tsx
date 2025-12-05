'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Review {
  id: string;
  rating: number;
  title: string | null;
  content: string | null;
  isVerified: boolean;
  helpfulCount: number;
  status: string;
  createdAt: string;
  user: {
    email: string;
    name: string | null;
  };
  program: {
    id: string;
    name: string;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified'>('all');
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filter !== 'all' && { verified: (filter === 'verified').toString() }),
      });
      const response = await fetch(`/api/admin/reviews?${params}`);
      const data = await response.json();
      setReviews(data.reviews || []);
      setPagination((prev) => ({
        ...prev,
        total: data.total || 0,
        totalPages: data.totalPages || 0,
      }));
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, filter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleModerate = async (id: string, action: 'approve' | 'reject' | 'delete') => {
    try {
      if (action === 'delete') {
        await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      } else {
        await fetch(`/api/admin/reviews/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isVerified: action === 'approve' }),
        });
      }
      fetchReviews();
    } catch (error) {
      console.error('Failed to moderate review:', error);
    }
  };

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">⭐ Review Moderation</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Moderate user reviews and manage content quality
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Total: {pagination.total} reviews
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'verified'] as const).map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No reviews found</div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg">{renderStars(review.rating)}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        review.isVerified
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                      }`}
                    >
                      {review.isVerified ? 'Verified' : 'Pending'}
                    </span>
                    <span className="text-sm text-gray-500">👍 {review.helpfulCount} helpful</span>
                  </div>

                  {review.title && (
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                      {review.title}
                    </h3>
                  )}

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    {review.content || 'No content provided'}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>By: {review.user?.name || review.user?.email || 'Anonymous'}</span>
                    <span>•</span>
                    <Link
                      href={`/programs/${review.program?.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {review.program?.name}
                    </Link>
                    <span>•</span>
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex gap-2 ml-4">
                  {!review.isVerified && (
                    <button
                      onClick={() => handleModerate(review.id, 'approve')}
                      className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded text-sm hover:bg-green-200 dark:hover:bg-green-800"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    onClick={() => handleModerate(review.id, 'delete')}
                    className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded text-sm hover:bg-red-200 dark:hover:bg-red-800"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
              disabled={pagination.page === 1}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
              disabled={pagination.page === pagination.totalPages}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
