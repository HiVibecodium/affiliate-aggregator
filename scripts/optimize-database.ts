#!/usr/bin/env tsx
/**
 * Database Optimization Script
 * Reduces database size by keeping only top-quality affiliate programs
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Database statistics interface
interface DatabaseStats {
  total: number;
  active: number;
  highCommission: number;
  longCookie: number;
}

// Критерии для отбора лучших программ
const QUALITY_CRITERIA = {
  minCommissionRate: 15, // Минимум 15% комиссия
  minCookieDuration: 30, // Минимум 30 дней cookie
  topCategories: [
    'Software & Services',
    'Business & Investing',
    'Digital Products',
    'Online Education',
    'Marketing & SEO',
    'Health & Fitness',
    'Beauty & Personal Care',
    'Home & Garden',
  ],
  topNetworks: [
    'ShareASale',
    'CJ Affiliate',
    'Awin',
    'ClickBank',
    'Rakuten Advertising',
    'Amazon Associates',
  ],
  maxPrograms: 700, // Оставить максимум 700 лучших программ
  minProgramsPerCategory: 10, // Минимум программ в каждой категории
};

async function analyzeCurrentDatabase(): Promise<DatabaseStats> {
  console.log('📊 Анализ текущей базы данных...\n');

  const total = await prisma.affiliateProgram.count();
  const active = await prisma.affiliateProgram.count({ where: { active: true } });

  const byNetwork = await prisma.affiliateProgram.groupBy({
    by: ['networkId'],
    _count: true,
    orderBy: { _count: { networkId: 'desc' } },
    take: 10,
  });

  const highCommission = await prisma.affiliateProgram.count({
    where: {
      commissionRate: { gte: QUALITY_CRITERIA.minCommissionRate },
      active: true,
    },
  });

  const longCookie = await prisma.affiliateProgram.count({
    where: {
      cookieDuration: { gte: QUALITY_CRITERIA.minCookieDuration },
      active: true,
    },
  });

  console.log(`Всего программ: ${total.toLocaleString()}`);
  console.log(`Активных: ${active.toLocaleString()}`);
  console.log(
    `С комиссией ≥${QUALITY_CRITERIA.minCommissionRate}%: ${highCommission.toLocaleString()}`
  );
  console.log(
    `С cookie ≥${QUALITY_CRITERIA.minCookieDuration} дней: ${longCookie.toLocaleString()}`
  );
  console.log(`\nТоп 10 сетей по количеству программ:`);

  for (const item of byNetwork) {
    const network = await prisma.affiliateNetwork.findUnique({
      where: { id: item.networkId },
      select: { name: true },
    });
    console.log(`  ${network?.name}: ${item._count}`);
  }

  return { total, active, highCommission, longCookie };
}

async function selectTopPrograms() {
  console.log('\n\n🎯 Отбор топовых программ с балансом категорий...\n');

  // Получаем все сети
  const networks = await prisma.affiliateNetwork.findMany({
    where: { name: { in: QUALITY_CRITERIA.topNetworks } },
    select: { id: true, name: true },
  });

  const networkIds = networks.map((n) => n.id);

  // Шаг 1: Получаем все уникальные категории
  const categoriesData = await prisma.affiliateProgram.groupBy({
    by: ['category'],
    where: {
      active: true,
      category: { not: null },
    },
    _count: true,
    orderBy: { _count: { category: 'desc' } },
  });

  console.log(`Найдено ${categoriesData.length} уникальных категорий`);

  // Шаг 2: Из каждой категории выбираем топ программ
  const selectedIds = new Set<string>();
  const categoryStats: Record<string, number> = {};

  for (const catData of categoriesData) {
    const category = catData.category;
    if (!category) continue;

    const topInCategory = await prisma.affiliateProgram.findMany({
      where: {
        active: true,
        category: category,
        OR: [
          { commissionRate: { gte: QUALITY_CRITERIA.minCommissionRate } },
          {
            networkId: { in: networkIds },
            commissionRate: { gte: 10 },
          },
          {
            cookieDuration: { gte: QUALITY_CRITERIA.minCookieDuration },
            commissionRate: { gte: 10 },
          },
        ],
      },
      orderBy: [{ commissionRate: 'desc' }, { cookieDuration: 'desc' }],
      take: QUALITY_CRITERIA.minProgramsPerCategory,
      select: { id: true },
    });

    topInCategory.forEach((p) => selectedIds.add(p.id));
    categoryStats[category] = topInCategory.length;
  }

  console.log(`✅ Отобрано ${selectedIds.size} программ с балансом категорий`);

  // Шаг 3: Добираем до maxPrograms лучшими программами
  if (selectedIds.size < QUALITY_CRITERIA.maxPrograms) {
    const remaining = QUALITY_CRITERIA.maxPrograms - selectedIds.size;
    console.log(`\nДобираем еще ${remaining} лучших программ...`);

    const additionalPrograms = await prisma.affiliateProgram.findMany({
      where: {
        active: true,
        id: { notIn: Array.from(selectedIds) },
        OR: [
          { commissionRate: { gte: QUALITY_CRITERIA.minCommissionRate } },
          {
            networkId: { in: networkIds },
            commissionRate: { gte: 10 },
          },
          {
            cookieDuration: { gte: QUALITY_CRITERIA.minCookieDuration },
            commissionRate: { gte: 10 },
          },
          {
            category: { in: QUALITY_CRITERIA.topCategories },
            commissionRate: { gte: 10 },
          },
        ],
      },
      orderBy: [{ commissionRate: 'desc' }, { cookieDuration: 'desc' }],
      take: remaining,
      select: { id: true, category: true },
    });

    additionalPrograms.forEach((p) => {
      selectedIds.add(p.id);
      if (p.category) {
        categoryStats[p.category] = (categoryStats[p.category] || 0) + 1;
      }
    });

    console.log(`✅ Добавлено еще ${additionalPrograms.length} программ`);
  }

  // Выводим статистику по категориям
  console.log('\n📊 Распределение по категориям:');
  const sortedCategories = Object.entries(categoryStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15);

  for (const [cat, count] of sortedCategories) {
    console.log(`  ${cat}: ${count}`);
  }

  console.log(`\n✅ Итого отобрано: ${selectedIds.size} программ`);
  return Array.from(selectedIds);
}

async function cleanupDatabase(keepIds: string[], dryRun: boolean = true) {
  console.log('\n\n🧹 Очистка базы данных...\n');

  if (dryRun) {
    console.log('⚠️  DRY RUN MODE - изменения не будут применены\n');
  }

  const toDelete = await prisma.affiliateProgram.count({
    where: {
      id: { notIn: keepIds },
    },
  });

  console.log(`Программ к удалению: ${toDelete.toLocaleString()}`);
  console.log(`Программ останется: ${keepIds.length}`);

  if (!dryRun) {
    console.log('\n🔥 Удаление программ...');

    // Удаляем связанные данные
    await prisma.programClick.deleteMany({
      where: { programId: { notIn: keepIds } },
    });

    await prisma.favorite.deleteMany({
      where: { programId: { notIn: keepIds } },
    });

    await prisma.programReview.deleteMany({
      where: { programId: { notIn: keepIds } },
    });

    await prisma.programApplication.deleteMany({
      where: { programId: { notIn: keepIds } },
    });

    await prisma.programAccess.deleteMany({
      where: { programId: { notIn: keepIds } },
    });

    // Удаляем сами программы
    const result = await prisma.affiliateProgram.deleteMany({
      where: { id: { notIn: keepIds } },
    });

    console.log(`✅ Удалено ${result.count.toLocaleString()} программ`);
  }

  return toDelete;
}

async function generateReport(beforeStats: DatabaseStats, keepIds: string[]) {
  console.log('\n\n📊 ФИНАЛЬНЫЙ ОТЧЕТ\n');
  console.log('='.repeat(50));

  const afterTotal = keepIds.length;
  const removed = beforeStats.total - afterTotal;
  const reductionPercent = ((removed / beforeStats.total) * 100).toFixed(1);

  console.log(`\nБыло программ: ${beforeStats.total.toLocaleString()}`);
  console.log(`Осталось программ: ${afterTotal.toLocaleString()}`);
  console.log(`Удалено: ${removed.toLocaleString()} (${reductionPercent}%)`);

  console.log('\n📈 Качество отобранных программ:');

  const topProgramsStats = await prisma.affiliateProgram.aggregate({
    where: { id: { in: keepIds } },
    _avg: {
      commissionRate: true,
      cookieDuration: true,
    },
    _max: {
      commissionRate: true,
    },
  });

  console.log(`  Средняя комиссия: ${topProgramsStats._avg.commissionRate?.toFixed(2)}%`);
  console.log(`  Средняя длина cookie: ${topProgramsStats._avg.cookieDuration?.toFixed(0)} дней`);
  console.log(`  Максимальная комиссия: ${topProgramsStats._max.commissionRate}%`);

  // Статистика по категориям
  const categoryDistribution = await prisma.affiliateProgram.groupBy({
    by: ['category'],
    where: {
      id: { in: keepIds },
      category: { not: null },
    },
    _count: true,
    orderBy: { _count: { category: 'desc' } },
  });

  console.log('\n📂 Распределение по категориям (топ-10):');
  const topCategories = categoryDistribution.slice(0, 10);
  for (const cat of topCategories) {
    console.log(`  ${cat.category}: ${cat._count}`);
  }

  const totalWithCategories = categoryDistribution.reduce((sum, cat) => sum + cat._count, 0);
  console.log(`\nВсего категорий: ${categoryDistribution.length}`);
  console.log(`Программ с категориями: ${totalWithCategories}`);
  console.log(`Минимум программ в категории: ${QUALITY_CRITERIA.minProgramsPerCategory}`);

  console.log('\n✨ Оптимизация завершена!');
  console.log('='.repeat(50));
}

async function main(executeMode: boolean = false) {
  try {
    console.log('🚀 Запуск оптимизации базы данных\n');
    console.log('Критерии отбора:');
    console.log(`  - Минимальная комиссия: ${QUALITY_CRITERIA.minCommissionRate}%`);
    console.log(`  - Минимальная длина cookie: ${QUALITY_CRITERIA.minCookieDuration} дней`);
    console.log(`  - Максимум программ: ${QUALITY_CRITERIA.maxPrograms}`);
    console.log(`  - Минимум программ в категории: ${QUALITY_CRITERIA.minProgramsPerCategory}`);
    console.log(`  - Топовые сети: ${QUALITY_CRITERIA.topNetworks.length}`);
    console.log(`  - Топовые категории: ${QUALITY_CRITERIA.topCategories.length}`);
    console.log('\n' + '='.repeat(50) + '\n');

    // 1. Анализ текущей базы
    const beforeStats = await analyzeCurrentDatabase();

    // 2. Отбор топовых программ
    const topProgramIds = await selectTopPrograms();

    // 3. Очистка базы данных (dry run или реальное выполнение)
    await cleanupDatabase(topProgramIds, !executeMode);

    // 4. Генерируем отчет
    await generateReport(beforeStats, topProgramIds);

    if (!executeMode) {
      console.log('\n\n⚠️  Это был DRY RUN. Для реального удаления запустите:');
      console.log('   npm run db:optimize:execute\n');
    }
  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Проверяем аргументы командной строки
const shouldExecute = process.argv.includes('--execute');

if (shouldExecute) {
  console.log('⚠️  ВНИМАНИЕ: Режим выполнения! Изменения будут применены.\n');
  main(true);
} else {
  main(false);
}
