import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const [totalPrograms, totalNetworks, programsByNetwork] = await Promise.all([
      prisma.affiliateProgram.count(),
      prisma.affiliateNetwork.count(),
      prisma.affiliateNetwork.findMany({
        include: {
          _count: {
            select: { programs: true }
          }
        }
      })
    ]);

    return NextResponse.json({
      totalPrograms,
      totalNetworks,
      networks: programsByNetwork.map(n => ({
        name: n.name,
        programs: n._count.programs
      }))
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
