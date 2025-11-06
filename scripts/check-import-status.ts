// Check import status
import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';

config({ path: resolve(__dirname, '../.env.local') });

const prisma = new PrismaClient();

async function checkStatus() {
  try {
    console.log('📊 Checking import status...\n');

    // Count networks
    const networkCount = await prisma.affiliateNetwork.count();
    console.log(`Networks: ${networkCount}`);

    // List networks with program counts
    const networks = await prisma.affiliateNetwork.findMany({
      include: {
        _count: {
          select: { programs: true }
        }
      }
    });

    console.log('\nNetworks breakdown:');
    networks.forEach(network => {
      console.log(`  - ${network.name}: ${network._count.programs} programs`);
    });

    // Total programs
    const programCount = await prisma.affiliateProgram.count();
    console.log(`\nTotal programs: ${programCount}`);

    // Sample programs
    if (programCount > 0) {
      const samples = await prisma.affiliateProgram.findMany({
        take: 3,
        include: { network: true }
      });

      console.log('\nSample programs:');
      samples.forEach(p => {
        console.log(`  - ${p.name} (${p.network.name}) - ${p.commissionRate}% ${p.commissionType}`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkStatus();
