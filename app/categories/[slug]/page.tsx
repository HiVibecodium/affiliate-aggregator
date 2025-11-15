/**
 * Category Landing Page
 * SEO-optimized page for each category
 */

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { EnhancedProgramCard } from '@/components/EnhancedProgramCard'
import { Metadata } from 'next'

interface CategoryPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const categoryName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  return {
    title: `${categoryName} Партнёрские Программы - Лучшие Предложения`,
    description: `Топ партнёрские программы в категории ${categoryName}. Высокие комиссии, проверенные сети, реальные отзывы.`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params
  const categoryName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')

  // Get programs in category
  const programs = await prisma.affiliateProgram.findMany({
    where: {
      category: categoryName,
      active: true,
    },
    include: {
      network: { select: { name: true } }
    },
    take: 100,
    orderBy: { commissionRate: 'desc' }
  })

  if (programs.length === 0) {
    notFound()
  }

  const avgCommission = programs.reduce((sum, p) => sum + (p.commissionRate || 0), 0) / programs.length
  const topCommission = Math.max(...programs.map(p => p.commissionRate || 0))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {categoryName} - Партнёрские Программы
          </h1>
          <p className="text-xl text-purple-100">
            {programs.length} программ в категории {categoryName}
          </p>

          <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl">
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-3xl font-bold">{programs.length}</div>
              <div className="text-sm text-purple-100">Программ</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-3xl font-bold">{avgCommission.toFixed(1)}%</div>
              <div className="text-sm text-purple-100">Средняя</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-4">
              <div className="text-3xl font-bold">{topCommission}%</div>
              <div className="text-sm text-purple-100">Макс</div>
            </div>
          </div>
        </div>
      </div>

      {/* Programs */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Топ Программы в {categoryName}
        </h2>

        <div className="grid gap-6">
          {programs.map((program) => (
            <EnhancedProgramCard
              key={program.id}
              program={{
                ...program,
                createdAt: new Date(program.createdAt),
              }}
            />
          ))}
        </div>
      </div>

      {/* SEO Content */}
      <div className="container mx-auto px-4 py-12 border-t bg-white">
        <div className="prose max-w-none">
          <h2>Партнёрские Программы {categoryName} - Полный Гид</h2>
          <p>
            Выбираете партнёрскую программу в категории {categoryName}? Мы собрали {programs.length} лучших предложений
            от проверенных сетей. Средняя комиссия в этой нише: {avgCommission.toFixed(1)}%, максимальная - до {topCommission}%.
          </p>

          <h3>Как выбрать программу в {categoryName}?</h3>
          <ul>
            <li><strong>Комиссия:</strong> Обращайте внимание не только на процент, но и на тип (CPA, CPS, CPL)</li>
            <li><strong>Cookie:</strong> Чем дольше cookie, тем больше шансов на конверсию</li>
            <li><strong>Выплаты:</strong> Проверьте минимальный порог и методы оплаты</li>
            <li><strong>Отзывы:</strong> Читайте опыт других affiliates</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export async function generateStaticParams() {
  const categories = await prisma.affiliateProgram.findMany({
    where: { active: true, category: { not: null } },
    select: { category: true },
    distinct: ['category'],
  })

  return categories.map((cat) => ({
    slug: cat.category!.toLowerCase().replace(/\s+/g, '-')
  }))
}
