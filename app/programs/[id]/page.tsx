import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProgramReviews } from '@/components/ProgramReviews';
import { ReviewForm } from '@/components/ReviewForm';
import { TrackApplicationButton } from '@/components/TrackApplicationButton';
import { generateProgramMetadata, generateProgramStructuredData } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ProgramDetailActions } from '@/components/ProgramDetailActions';
import { getTranslations } from 'next-intl/server';

async function getProgramDetails(id: string) {
  const program = await prisma.affiliateProgram.findUnique({
    where: { id },
    include: {
      network: {
        select: {
          name: true,
          website: true,
          description: true,
        },
      },
    },
  });

  if (!program) {
    return null;
  }

  // Get related programs (same category)
  const relatedPrograms = await prisma.affiliateProgram.findMany({
    where: {
      category: program.category,
      id: { not: id },
      active: true,
    },
    include: {
      network: {
        select: { name: true },
      },
    },
    take: 3,
    orderBy: { commissionRate: 'desc' },
  });

  return { program, relatedPrograms };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getProgramDetails(id);

  if (!data) {
    return {};
  }

  return generateProgramMetadata(data.program);
}

export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getProgramDetails(id);
  const t = await getTranslations('programDetail');

  if (!data) {
    notFound();
  }

  const { program, relatedPrograms } = data;
  const structuredData = generateProgramStructuredData(program);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 md:pb-0">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="container mx-auto px-4 py-4 md:py-6">
          {/* Back button for mobile */}
          <Link
            href="/programs"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm mb-2 md:hidden touch-target"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t('backToPrograms')}
          </Link>
          {/* Breadcrumbs for desktop */}
          <div className="hidden md:block">
            <Breadcrumbs
              items={[
                { label: 'Home', href: '/' },
                { label: 'Programs', href: '/programs' },
                ...(program.category
                  ? [
                      {
                        label: program.category,
                        href: `/programs?category=${encodeURIComponent(program.category)}`,
                      },
                    ]
                  : []),
                { label: program.name },
              ]}
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-2">
            {program.name}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-gray-600 dark:text-gray-400">{program.network.name}</span>
            {program.active && (
              <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 text-xs rounded-full">
                {t('active')}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Mobile Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6 md:hidden">
          <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {program.commissionRate ?? 'N/A'}%
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{t('commission')}</div>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {program.cookieDuration ?? 'N/A'}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400">{t('cookieDays')}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Overview Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('aboutProgram')}
              </h2>
              {program.description && (
                <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm md:text-base">
                  {program.description}
                </p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
                <div className="p-3 md:p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t('category')}
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                    {program.category || t('notSpecified')}
                  </div>
                </div>
                <div className="p-3 md:p-4 bg-green-50 dark:bg-green-900/30 rounded-xl hidden md:block">
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t('commission')}
                  </div>
                  <div className="font-semibold text-green-600 dark:text-green-400 text-lg md:text-xl">
                    {program.commissionRate ?? 'N/A'}% {program.commissionType ?? ''}
                  </div>
                </div>
                <div className="p-3 md:p-4 bg-purple-50 dark:bg-purple-900/30 rounded-xl hidden md:block">
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t('cookieDuration')}
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                    {program.cookieDuration ?? 'N/A'} {program.cookieDuration ? t('days') : ''}
                  </div>
                </div>
                <div className="p-3 md:p-4 bg-orange-50 dark:bg-orange-900/30 rounded-xl">
                  <div className="text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {t('minPayout')}
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                    ${program.paymentThreshold ?? 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            {program.paymentMethods && program.paymentMethods.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('paymentMethods')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {program.paymentMethods.map((method) => (
                    <span
                      key={method}
                      className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Programs */}
            {relatedPrograms.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {t('relatedPrograms')}
                </h3>
                <div className="space-y-3">
                  {relatedPrograms.map((rp) => (
                    <Link
                      key={rp.id}
                      href={`/programs/${rp.id}`}
                      className="block p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors touch-target"
                    >
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 dark:text-white truncate">
                            {rp.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {rp.network.name}
                          </div>
                        </div>
                        <div className="text-green-600 dark:text-green-400 font-bold ml-2">
                          {rp.commissionRate ?? 'N/A'}%
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Hidden on mobile, shown on desktop */}
          <div className="hidden md:block space-y-6">
            {/* Network Info */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('affiliateNetwork')}
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{t('networkName')}</div>
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {program.network.name}
                  </div>
                </div>
                {program.network.description && (
                  <div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {t('description')}
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 text-sm">
                      {program.network.description}
                    </div>
                  </div>
                )}
                {program.network.website && (
                  <a
                    href={program.network.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                  >
                    {t('visitSite')} →
                  </a>
                )}
              </div>
            </div>

            {/* Actions - Desktop */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('actions')}
              </h3>
              <div className="space-y-3">
                <TrackApplicationButton programId={id} programName={program.name} />
                <ProgramDetailActions
                  programId={id}
                  programName={program.name}
                  networkWebsite={program.network.website}
                />
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {t('statistics')}
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('addedDate')}:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(program.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('updatedDate')}:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {new Date(program.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{t('status')}:</span>
                  <span
                    className={`font-medium ${program.active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                  >
                    {program.active ? t('active') : t('inactive')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Fixed Bottom Actions */}
        <div className="fixed bottom-16 left-0 right-0 p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 shadow-lg md:hidden safe-area-bottom z-40">
          <div className="flex gap-3">
            <ProgramDetailActions
              programId={id}
              programName={program.name}
              networkWebsite={program.network.website}
              isMobile
            />
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 md:mt-12">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
            {t('reviewsAndRatings')}
          </h2>

          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Reviews display (2 columns) */}
            <div className="lg:col-span-2">
              <ProgramReviews programId={id} />
            </div>

            {/* Review form (1 column) */}
            <div>
              <ReviewForm programId={id} programName={program.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
