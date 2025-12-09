import { prisma } from '@/lib/prisma';
import { logger } from '@/lib/logger';
import { HomeContent } from '@/components/HomeContent';

// Revalidate every 10 minutes
export const revalidate = 600;

interface NetworkStats {
  name: string;
  programs: number;
}

interface HomeStats {
  totalPrograms: number;
  totalNetworks: number;
  networks: NetworkStats[];
}

async function getStats(): Promise<HomeStats | null> {
  try {
    const [totalPrograms, totalNetworks, programsByNetwork] = await Promise.all([
      prisma.affiliateProgram.count(),
      prisma.affiliateNetwork.count(),
      prisma.affiliateNetwork.findMany({
        include: {
          _count: {
            select: { programs: true },
          },
        },
      }),
    ]);

    return {
      totalPrograms,
      totalNetworks,
      networks: programsByNetwork.map((n) => ({
        name: n.name,
        programs: n._count.programs,
      })),
    };
  } catch (error) {
    logger.error('Failed to fetch stats:', error);
    return null;
  }
}

export default async function Home() {
  const stats = await getStats();

  return <HomeContent stats={stats} />;
}
