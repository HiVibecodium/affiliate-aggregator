import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

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

export default async function ProgramDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getProgramDetails(id);

  if (!data) {
    notFound();
  }

  const { program, relatedPrograms } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/programs"
            className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block"
          >
            ← Назад к программам
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">{program.name}</h1>
          <p className="text-gray-600 mt-1">{program.network.name}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">О программе</h2>
              {program.description && <p className="text-gray-700 mb-4">{program.description}</p>}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Категория</div>
                  <div className="font-semibold text-gray-900">
                    {program.category || 'Не указана'}
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Комиссия</div>
                  <div className="font-semibold text-green-600 text-xl">
                    {program.commissionRate}% {program.commissionType}
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Cookie Duration</div>
                  <div className="font-semibold text-gray-900">{program.cookieDuration} дней</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Минимальная выплата</div>
                  <div className="font-semibold text-gray-900">${program.paymentThreshold}</div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            {program.paymentMethods && program.paymentMethods.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Методы оплаты</h3>
                <div className="flex flex-wrap gap-2">
                  {program.paymentMethods.map((method) => (
                    <span
                      key={method}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Related Programs */}
            {relatedPrograms.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Похожие программы</h3>
                <div className="space-y-3">
                  {relatedPrograms.map((rp) => (
                    <Link
                      key={rp.id}
                      href={`/programs/${rp.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-gray-900">{rp.name}</div>
                          <div className="text-sm text-gray-500">{rp.network.name}</div>
                        </div>
                        <div className="text-green-600 font-bold">{rp.commissionRate}%</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Network Info */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Партнерская сеть</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600">Название</div>
                  <div className="font-semibold text-gray-900">{program.network.name}</div>
                </div>
                {program.network.description && (
                  <div>
                    <div className="text-sm text-gray-600">Описание</div>
                    <div className="text-gray-700 text-sm">{program.network.description}</div>
                  </div>
                )}
                {program.network.website && (
                  <a
                    href={program.network.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Посетить сайт →
                  </a>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Действия</h3>
              <div className="space-y-3">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                  Добавить в избранное
                </button>
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors">
                  Добавить к сравнению
                </button>
                <Link
                  href={program.network.website || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center"
                >
                  Перейти к программе →
                </Link>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Статистика</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Дата добавления:</span>
                  <span className="font-medium">
                    {new Date(program.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Обновлено:</span>
                  <span className="font-medium">
                    {new Date(program.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Статус:</span>
                  <span
                    className={`font-medium ${program.active ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {program.active ? 'Активна' : 'Неактивна'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
