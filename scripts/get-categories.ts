#!/usr/bin/env tsx
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getCategories() {
  const categories = await prisma.affiliateProgram.groupBy({
    by: ['category'],
    where: {
      category: { not: null },
    },
    _count: true,
    orderBy: {
      category: 'asc',
    },
  });

  console.log('Всего категорий:', categories.length);
  console.log('\nКатегории:');
  categories.forEach((cat) => {
    console.log(`"${cat.category}": "${cat.category}", // ${cat._count} программ`);
  });

  await prisma.$disconnect();
}

getCategories();
