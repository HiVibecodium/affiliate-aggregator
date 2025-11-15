/**
 * Network Landing Page
 * SEO-optimized page for each affiliate network
 */

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { EnhancedProgramCard } from '@/components/EnhancedProgramCard'
import { Metadata } from 'next'

interface NetworkPageProps {
  params: Promise<{ slug: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: NetworkPageProps): Promise<Metadata> {
  const { slug } = await params
  const networkName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  return {
    title: `${networkName} Партнёрские Программы - Affiliate Aggregator`,
    description: `Все партнёрские программы ${networkName}. Сравнивай комиссии, условия, отзывы. Лучшие программы от ${networkName}.`,
    openGraph: {
      title: `${networkName} Affiliate Programs`,
      description: `Browse all ${networkName} affiliate programs with detailed comparisons`,
    },
  }
}

export default async function NetworkPage({ params }: NetworkPageProps) {
  const { slug } = await params
  const networkName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  // Get network
  const network = await prisma.affiliateNetwork.findFirst({
    where: { name: networkName },
    include: {
      _count: {
        select: { programs: { where: { active: true } } }
      }
    }
  })

  if (!network) {
    notFound()
  }

  // Get programs
  const programs = await prisma.affiliateProgram.findMany({
    where: {
      networkId: network.id,
      active: true,
    },
    include: {
      network: { select: { name: true } }
    },
    take: 50,
    orderBy: { createdAt: 'desc' }
  })

  // Stats
  const avgCommission = programs.reduce((sum, p) => sum + (p.commissionRate || 0), 0) / programs.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {network.name} Партнёрские Программы
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            {network.description || `Полный каталог партнёрских программ от ${network.name}. Сравнивай условия, читай отзывы, выбирай лучшее.`}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-3xl font-bold">{network._count.programs}</div>
              <div className="text-sm text-blue-100">Программ</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-3xl font-bold">{avgCommission.toFixed(1)}%</div>
              <div className="text-sm text-blue-100">Средняя комиссия</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-3xl font-bold">{network.country || 'Global'}</div>
              <div className="text-sm text-blue-100">География</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-3xl font-bold">A+</div>
              <div className="text-sm text-blue-100">Рейтинг</div>
            </div>
          </div>
        </div>
      </div>

      {/* Programs List */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Все Программы {network.name}
        </h2>

        <div className="grid gap-6">
          {programs.map((program) => (
            <EnhancedProgramCard
              key={program.id}
              program={{
                ...program,
                createdAt: new Date(program.createdAt),
              }}
              showFavoriteButton={true}
              showCompareButton={true}
            />
          ))}
        </div>

        {programs.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-600">Программы скоро появятся</p>
          </div>
        )}
      </div>

      {/* SEO Content */}
      <div className="container mx-auto px-4 py-12 border-t">
        <div className="prose max-w-none">
          <h2>О {network.name}</h2>
          <p>
            {network.name} - одна из ведущих партнёрских сетей с {network._count.programs} активными программами.
            {network.website && ` Официальный сайт: ${network.website}`}
          </p>

          <h3>Почему выбирают {network.name}?</h3>
          <ul>
            <li>Проверенная репутация</li>
            <li>Широкий выбор программ</li>
            <li>Прозрачные условия</li>
            <li>Своевременные выплаты</li>
          </ul>

          <h3>Как начать работать с {network.name}?</h3>
          <ol>
            <li>Выберите подходящую программу из списка выше</li>
            <li>Изучите условия и комиссию</li>
            <li>Подайте заявку на участие</li>
            <li>Получите одобрение и начинайте зарабатывать</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

// Generate static params for build
export async function generateStaticParams() {
  const networks = await prisma.affiliateNetwork.findMany({
    where: { active: true },
    select: { name: true }
  })

  return networks.map((network) => ({
    slug: network.name.toLowerCase().replace(/\s+/g, '-')
  }))
}
