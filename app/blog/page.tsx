/**
 * Blog Landing Page
 * SEO-optimized blog for affiliate marketing content
 */

import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog - Affiliate Marketing Tips & Guides',
  description: 'Лучшие статьи про affiliate marketing, партнёрские программы, стратегии заработка и кейсы.',
}

const blogPosts = [
  {
    slug: 'getting-started-affiliate-marketing',
    title: 'Как Начать в Affiliate Marketing в 2025',
    excerpt: 'Полный гид для новичков: от выбора ниши до первых продаж.',
    date: '2025-11-15',
    category: 'Beginners',
    readTime: '10 min',
  },
  {
    slug: 'top-affiliate-programs-2025',
    title: 'Топ 10 Партнёрских Программ 2025',
    excerpt: 'Лучшие программы с высокими комиссиями и надёжными выплатами.',
    date: '2025-11-15',
    category: 'Reviews',
    readTime: '8 min',
  },
  {
    slug: 'email-marketing-for-affiliates',
    title: 'Email Marketing для Affiliates: Complete Guide',
    excerpt: 'Как строить email список и конвертировать подписчиков в продажи.',
    date: '2025-11-15',
    category: 'Strategy',
    readTime: '15 min',
  },
]

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">📝 Affiliate Marketing Blog</h1>
          <p className="text-xl text-purple-100">
            Гайды, стратегии и кейсы для успешного affiliate маркетинга
          </p>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="space-y-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3 text-sm">
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full font-medium">
                  {post.category}
                </span>
                <span className="text-gray-500 dark:text-gray-400">{post.date}</span>
                <span className="text-gray-500 dark:text-gray-400">• {post.readTime}</span>
              </div>

              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
              </Link>

              <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>

              <Link
                href={`/blog/${post.slug}`}
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
              >
                Читать далее →
              </Link>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Готов начать зарабатывать?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            80,000+ партнёрских программ ждут тебя
          </p>
          <Link
            href="/programs"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Найти Программу →
          </Link>
        </div>
      </div>
    </div>
  )
}
