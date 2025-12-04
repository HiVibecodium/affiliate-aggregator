import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';

const amazonPrograms = [
  {
    externalId: 'AMZN000001',
    name: 'Amazon Books',
    description:
      "Earn up to 10% commission on books, audiobooks, and Kindle products from Amazon's vast catalog.",
    category: 'Books & Literature',
    commissionRate: 8,
    commissionType: 'CPS',
    cookieDuration: 24,
    paymentThreshold: 10,
    paymentMethods: ['Direct Deposit', 'Amazon Gift Card'],
  },
  {
    externalId: 'AMZN000002',
    name: 'Amazon Electronics',
    description:
      'Promote electronics, computers, and tech gadgets. Commission rates vary by category.',
    category: 'Electronics',
    commissionRate: 4,
    commissionType: 'CPS',
    cookieDuration: 24,
    paymentThreshold: 10,
    paymentMethods: ['Direct Deposit', 'Amazon Gift Card'],
  },
  {
    externalId: 'AMZN000003',
    name: 'Amazon Fashion',
    description: 'Fashion, clothing, shoes, and accessories with competitive commission rates.',
    category: 'Fashion & Apparel',
    commissionRate: 10,
    commissionType: 'CPS',
    cookieDuration: 24,
    paymentThreshold: 10,
    paymentMethods: ['Direct Deposit', 'Amazon Gift Card'],
  },
  {
    externalId: 'AMZN000004',
    name: 'Amazon Home & Garden',
    description: 'Home improvement, furniture, kitchen, and garden products.',
    category: 'Home & Garden',
    commissionRate: 8,
    commissionType: 'CPS',
    cookieDuration: 24,
    paymentThreshold: 10,
    paymentMethods: ['Direct Deposit', 'Amazon Gift Card'],
  },
  {
    externalId: 'AMZN000005',
    name: 'Amazon Beauty & Personal Care',
    description: 'Beauty products, cosmetics, skincare, and personal care items.',
    category: 'Beauty & Personal Care',
    commissionRate: 10,
    commissionType: 'CPS',
    cookieDuration: 24,
    paymentThreshold: 10,
    paymentMethods: ['Direct Deposit', 'Amazon Gift Card'],
  },
  {
    externalId: 'AMZN000006',
    name: 'Amazon Sports & Outdoors',
    description: 'Sports equipment, outdoor gear, fitness products, and athletic wear.',
    category: 'Sports',
    commissionRate: 6,
    commissionType: 'CPS',
    cookieDuration: 24,
    paymentThreshold: 10,
    paymentMethods: ['Direct Deposit', 'Amazon Gift Card'],
  },
  {
    externalId: 'AMZN000007',
    name: 'Amazon Toys & Games',
    description: 'Toys, games, puzzles, and entertainment products for all ages.',
    category: 'Toys & Games',
    commissionRate: 3,
    commissionType: 'CPS',
    cookieDuration: 24,
    paymentThreshold: 10,
    paymentMethods: ['Direct Deposit', 'Amazon Gift Card'],
  },
  {
    externalId: 'AMZN000008',
    name: 'Amazon Grocery & Gourmet Food',
    description: 'Groceries, specialty foods, organic products, and gourmet items.',
    category: 'Food & Beverage',
    commissionRate: 5,
    commissionType: 'CPS',
    cookieDuration: 24,
    paymentThreshold: 10,
    paymentMethods: ['Direct Deposit', 'Amazon Gift Card'],
  },
  {
    externalId: 'AMZN000009',
    name: 'Amazon Prime Video',
    description: 'Promote Amazon Prime memberships and Video subscriptions.',
    category: 'Digital Products',
    commissionRate: 20,
    commissionType: 'CPS',
    cookieDuration: 24,
    paymentThreshold: 10,
    paymentMethods: ['Direct Deposit', 'Amazon Gift Card'],
  },
  {
    externalId: 'AMZN000010',
    name: 'Amazon Luxury Beauty',
    description: 'Premium beauty brands and luxury skincare products.',
    category: 'Beauty & Personal Care',
    commissionRate: 10,
    commissionType: 'CPS',
    cookieDuration: 24,
    paymentThreshold: 10,
    paymentMethods: ['Direct Deposit', 'Amazon Gift Card'],
  },
];

export async function POST() {
  try {
    const amazonNetwork = await prisma.affiliateNetwork.findFirst({
      where: { name: 'Amazon Associates' },
    });

    if (!amazonNetwork) {
      return NextResponse.json({ error: 'Amazon Associates network not found' }, { status: 404 });
    }

    let added = 0;
    let skipped = 0;
    const results = [];

    for (const program of amazonPrograms) {
      const existing = await prisma.affiliateProgram.findFirst({
        where: {
          networkId: amazonNetwork.id,
          externalId: program.externalId,
        },
      });

      if (existing) {
        skipped++;
        results.push({ program: program.name, status: 'skipped' });
        continue;
      }

      await prisma.affiliateProgram.create({
        data: {
          ...program,
          networkId: amazonNetwork.id,
          active: true,
        },
      });

      added++;
      results.push({ program: program.name, status: 'added' });
    }

    const count = await prisma.affiliateProgram.count({
      where: { networkId: amazonNetwork.id },
    });

    return NextResponse.json({
      success: true,
      summary: { added, skipped, total: amazonPrograms.length },
      amazonAssociatesTotal: count,
      results,
    });
  } catch (error) {
    logger.error('Error adding Amazon programs:', error);
    return NextResponse.json(
      {
        error: 'Failed to add programs',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
