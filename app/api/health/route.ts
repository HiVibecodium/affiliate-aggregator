import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()

    // Get counts from database
    const networkCount = await prisma.affiliateNetwork.count()
    const programCount = await prisma.affiliateProgram.count()

    await prisma.$disconnect()

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      supabase: 'connected',
      data: {
        networks: networkCount,
        programs: programCount,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    await prisma.$disconnect()

    return NextResponse.json(
      {
        status: 'unhealthy',
        database: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    )
  }
}
