/**
 * Dynamic Sitemap Generator
 * Автоматически генерирует sitemap.xml для всех страниц
 */

import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://affiliate-aggregator-five.vercel.app'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/programs`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/programs/new`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/programs/top-rated`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/favorites`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/analytics`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/billing/upgrade`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // Dynamic: All active programs
  const programs = await prisma.affiliateProgram.findMany({
    where: { active: true },
    select: {
      id: true,
      updatedAt: true,
    },
    take: 10000, // Limit for sitemap size
  })

  const programPages: MetadataRoute.Sitemap = programs.map((program) => ({
    url: `${baseUrl}/programs/${program.id}`,
    lastModified: program.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Networks pages
  const networks = await prisma.affiliateNetwork.findMany({
    where: { active: true },
    select: { name: true, updatedAt: true }
  })

  const networkPages: MetadataRoute.Sitemap = networks.map((network) => ({
    url: `${baseUrl}/networks/${network.name.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: network.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Category pages
  const categories = await prisma.affiliateProgram.findMany({
    where: { active: true, category: { not: null } },
    select: { category: true },
    distinct: ['category'],
  })

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/categories/${cat.category!.toLowerCase().replace(/\s+/g, '-')}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.7,
  }))

  return [...staticPages, ...networkPages, ...categoryPages, ...programPages]
}
