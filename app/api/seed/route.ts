import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Create sample affiliate networks
    const amazonAssociates = await prisma.affiliateNetwork.create({
      data: {
        name: 'Amazon Associates',
        description: 'Amazon affiliate program - largest e-commerce affiliate network',
        website: 'https://affiliate-program.amazon.com',
        country: 'US',
        commission: 10.0,
        active: true,
      },
    });

    const cj = await prisma.affiliateNetwork.create({
      data: {
        name: 'CJ Affiliate',
        description: 'Commission Junction - global affiliate marketing network',
        website: 'https://www.cj.com',
        country: 'US',
        commission: 8.0,
        active: true,
      },
    });

    const awin = await prisma.affiliateNetwork.create({
      data: {
        name: 'Awin',
        description: 'Leading global affiliate network',
        website: 'https://www.awin.com',
        country: 'UK',
        commission: 7.5,
        active: true,
      },
    });

    // Create sample programs
    await prisma.affiliateProgram.createMany({
      data: [
        {
          networkId: amazonAssociates.id,
          externalId: 'SEED001',
          name: 'Amazon Electronics',
          description: 'Electronics and gadgets category',
          category: 'Electronics',
          commissionRate: 4.0,
          commissionType: 'CPS',
          cookieDuration: 24,
          paymentThreshold: 100,
          paymentMethods: ['Bank Transfer', 'Direct Deposit'],
          active: true,
        },
        {
          networkId: amazonAssociates.id,
          externalId: 'SEED002',
          name: 'Amazon Fashion',
          description: 'Clothing and fashion items',
          category: 'Fashion',
          commissionRate: 10.0,
          commissionType: 'CPS',
          cookieDuration: 24,
          paymentThreshold: 100,
          paymentMethods: ['Bank Transfer', 'Direct Deposit'],
          active: true,
        },
        {
          networkId: cj.id,
          externalId: 'SEED003',
          name: 'Travel Deals',
          description: 'Hotels and travel booking affiliates',
          category: 'Travel',
          commissionRate: 8.0,
          commissionType: 'CPA',
          cookieDuration: 30,
          paymentThreshold: 50,
          paymentMethods: ['PayPal', 'Wire Transfer'],
          active: true,
        },
        {
          networkId: awin.id,
          externalId: 'SEED004',
          name: 'Financial Services',
          description: 'Credit cards and loans',
          category: 'Finance',
          commissionRate: 15.0,
          commissionType: 'CPL',
          cookieDuration: 45,
          paymentThreshold: 25,
          paymentMethods: ['Bank Transfer', 'PayPal'],
          active: true,
        },
      ],
    });

    const networkCount = await prisma.affiliateNetwork.count();
    const programCount = await prisma.affiliateProgram.count();

    // Note: DO NOT disconnect - Prisma client is a singleton
    // await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      data: {
        networks: networkCount,
        programs: programCount,
      },
    });
  } catch (error) {
    // Note: DO NOT disconnect - Prisma client is a singleton
    // await prisma.$disconnect();

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
