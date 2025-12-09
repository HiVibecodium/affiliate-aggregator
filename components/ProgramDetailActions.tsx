'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useFavorites } from '@/hooks/useFavorites';
import { useCompare } from '@/hooks/useCompare';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface ProgramDetailActionsProps {
  programId: string;
  programName: string;
  networkWebsite?: string | null;
  isMobile?: boolean;
}

export function ProgramDetailActions({
  programId,
  programName,
  networkWebsite,
  isMobile = false,
}: ProgramDetailActionsProps) {
  const t = useTranslations('programDetail');
  const { isFavorite, toggleFavorite, loading: favLoading } = useFavorites();
  const { isInCompare, toggleCompare, compareCount } = useCompare();
  const { light, error: hapticError } = useHapticFeedback();
  const [sharing, setSharing] = useState(false);

  const favorite = isFavorite(programId);
  const inCompare = isInCompare(programId);
  const canAddToCompare = compareCount < 5 || inCompare;

  const handleFavoriteClick = async () => {
    light();
    await toggleFavorite(programId);
  };

  const handleCompareClick = () => {
    if (!canAddToCompare) {
      hapticError();
      return;
    }
    light();
    toggleCompare({
      id: programId,
      name: programName,
    });
  };

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);
    light();

    try {
      if (navigator.share) {
        await navigator.share({
          title: programName,
          text: t('shareText', { name: programName }),
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert(t('linkCopied'));
      }
    } catch {
      // User cancelled share or error occurred
    } finally {
      setSharing(false);
    }
  };

  if (isMobile) {
    return (
      <>
        {/* Favorite button */}
        <button
          onClick={handleFavoriteClick}
          disabled={favLoading}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all touch-target ${
            favorite
              ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          } disabled:opacity-50`}
        >
          <svg
            className="w-5 h-5"
            fill={favorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="text-sm">{favorite ? t('saved') : t('save')}</span>
        </button>

        {/* Compare button */}
        <button
          onClick={handleCompareClick}
          disabled={!canAddToCompare}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all touch-target ${
            inCompare
              ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          } disabled:opacity-50`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <span className="text-sm">{inCompare ? t('comparing') : t('compare')}</span>
        </button>

        {/* Share button */}
        <button
          onClick={handleShare}
          disabled={sharing}
          className="flex items-center justify-center p-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all touch-target disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>
      </>
    );
  }

  // Desktop layout
  return (
    <>
      {/* Join Program Button */}
      {networkWebsite && (
        <a
          href={networkWebsite}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-center font-semibold rounded-xl transition-colors"
        >
          {t('joinProgram')}
        </a>
      )}

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        disabled={favLoading}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
          favorite
            ? 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/70'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        } disabled:opacity-50`}
      >
        <svg
          className="w-5 h-5"
          fill={favorite ? 'currentColor' : 'none'}
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        {favorite ? t('removeFromFavorites') : t('addToFavorites')}
      </button>

      {/* Compare Button */}
      <button
        onClick={handleCompareClick}
        disabled={!canAddToCompare}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
          inCompare
            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/70'
            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
        } disabled:opacity-50`}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
        {inCompare ? t('removeFromCompare') : t('addToCompare')}
      </button>

      {/* Share Button */}
      <button
        onClick={handleShare}
        disabled={sharing}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        {t('share')}
      </button>
    </>
  );
}
