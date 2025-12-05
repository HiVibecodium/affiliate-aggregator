#!/usr/bin/env tsx
import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') });

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// All categories with target count 20-25 each
const CATEGORIES = [
  'Business & Investing',
  'Computers & Internet',
  'Cooking, Food & Wine',
  'E-business & E-marketing',
  'Education',
  'Electronics',
  'Fashion & Apparel',
  'Fashion & Style',
  'Finance',
  'Food & Beverage',
  'Food & Drink',
  'Games',
  'Green Products',
  'Health & Fitness',
  'Health & Wellness',
  'Home & Garden',
  'Languages',
  'Lifestyle',
  'Mobile',
  'Parenting & Families',
  'Pets',
  'Politics & Current Events',
  'Reference',
  'Retail',
  'Self-Help',
  'Software & Services',
  'Spirituality, New Age & Alternative Beliefs',
  'Sports',
  'Technology',
  'Travel',
  'Vehicles',
  'Beauty & Personal Care',
  'Books & Literature',
  'Digital Products',
  'Toys & Games',
];

const COMMISSION_TYPES = ['CPS', 'CPA', 'CPL', 'Hybrid'];
const PAYMENT_METHODS = ['PayPal', 'Direct Deposit', 'Wire Transfer', 'Check'];

const PROGRAM_PREFIXES = [
  'Premium',
  'Pro',
  'Ultimate',
  'Elite',
  'Master',
  'Expert',
  'Advanced',
  'Smart',
  'Best',
  'Top',
  'Super',
  'Mega',
  'Ultra',
  'Power',
  'Prime',
  'Global',
  'World',
  'Digital',
  'Online',
  'Cloud',
  'Fast',
  'Easy',
  'Quick',
];

const PROGRAM_SUFFIXES = [
  'Solutions',
  'Hub',
  'Center',
  'Store',
  'Shop',
  'Market',
  'Plus',
  'Pro',
  'Direct',
  'Express',
  'Now',
  'Online',
  'World',
  'Zone',
  'Deal',
  'Outlet',
  'Depot',
  'Mart',
  'Emporium',
  'Exchange',
  'Network',
  'Partners',
];

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

function generateProgramName(category: string, index: number): string {
  const categoryHash = simpleHash(category) % 1000;
  const prefix = PROGRAM_PREFIXES[index % PROGRAM_PREFIXES.length];
  const suffix = PROGRAM_SUFFIXES[(index + 5) % PROGRAM_SUFFIXES.length];
  // Use category hash to guarantee uniqueness
  return `${prefix} ${suffix} #${categoryHash}-${index}`;
}

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateProgram(category: string, networkId: string, index: number) {
  const commissionRate = 5 + Math.floor(Math.random() * 45); // 5-50%
  const cookieDuration = [7, 14, 30, 45, 60, 90][Math.floor(Math.random() * 6)];
  const categoryHash = simpleHash(category) % 10000;

  return {
    externalId: `AUTO_${categoryHash}_${String(index).padStart(4, '0')}`,
    name: generateProgramName(category, index),
    description: `High-quality ${category.toLowerCase()} affiliate program with competitive commissions and reliable payouts.`,
    category,
    commissionRate,
    commissionType: getRandomElement(COMMISSION_TYPES),
    cookieDuration,
    paymentThreshold: [10, 25, 50, 100][Math.floor(Math.random() * 4)],
    paymentMethods: [getRandomElement(PAYMENT_METHODS), getRandomElement(PAYMENT_METHODS)].filter(
      (v, i, a) => a.indexOf(v) === i
    ),
    networkId,
    active: true,
  };
}

async function main() {
  console.log('🚀 Starting category-based program import...\n');

  // Get all networks
  const networks = await prisma.affiliateNetwork.findMany({
    where: { active: true },
  });

  if (networks.length === 0) {
    console.error('No active networks found!');
    return;
  }

  console.log(`Found ${networks.length} networks:`);
  networks.forEach((n) => console.log(`  - ${n.name}`));

  // Get ALL current categories from database (not just from static list)
  const currentCategories = await prisma.affiliateProgram.groupBy({
    by: ['category'],
    where: { category: { not: null } },
    _count: { category: true },
  });

  const categoryMap = new Map<string, number>();
  currentCategories.forEach((c) => {
    if (c.category) categoryMap.set(c.category, c._count.category);
  });

  // Get all unique categories from DB that need more programs
  const allCategories = Array.from(categoryMap.keys());

  console.log(`\nFound ${allCategories.length} categories in database`);

  // Find categories that need more programs
  const categoriesToFill = allCategories.filter((cat) => (categoryMap.get(cat) || 0) < 20);
  console.log(`Categories needing more programs: ${categoriesToFill.length}`);

  const TARGET_MIN = 20;
  const TARGET_MAX = 25;

  let totalAdded = 0;

  for (const category of categoriesToFill) {
    const current = categoryMap.get(category) || 0;
    const target = TARGET_MIN + Math.floor(Math.random() * (TARGET_MAX - TARGET_MIN + 1));
    const toAdd = Math.max(0, target - current);

    if (toAdd === 0) {
      console.log(`\n✅ ${category}: already has ${current} programs`);
      continue;
    }

    console.log(
      `\n📦 ${category}: adding ${toAdd} programs (current: ${current}, target: ${target})`
    );

    for (let i = 0; i < toAdd; i++) {
      const network = networks[i % networks.length];
      const program = generateProgram(category, network.id, current + i + 1);

      try {
        // Check if already exists
        const existing = await prisma.affiliateProgram.findFirst({
          where: { externalId: program.externalId },
        });

        if (existing) {
          console.log(`  ⏭️  Skipping ${program.name} (exists)`);
          continue;
        }

        await prisma.affiliateProgram.create({ data: program });
        console.log(`  ✅ Added: ${program.name} (${network.name})`);
        totalAdded++;
      } catch (error) {
        console.error(`  ❌ Failed: ${program.name}`, error);
      }
    }
  }

  // Final stats
  const finalCount = await prisma.affiliateProgram.count();
  const finalCategories = await prisma.affiliateProgram.groupBy({
    by: ['category'],
    where: { category: { not: null } },
    _count: { category: true },
    orderBy: { _count: { category: 'desc' } },
  });

  console.log('\n📊 Final Summary:');
  console.log(`  Total programs: ${finalCount}`);
  console.log(`  Programs added: ${totalAdded}`);
  console.log('\nCategory distribution:');
  finalCategories.forEach((c) => {
    console.log(`  ${c.category}: ${c._count.category}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
