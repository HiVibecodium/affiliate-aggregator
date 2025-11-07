import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  console.log('📊 Проверка данных в БД...\n');

  const networks = await prisma.affiliateNetwork.count();
  const programs = await prisma.affiliateProgram.count();

  console.log(`Networks: ${networks}`);
  console.log(`Programs: ${programs}\n`);

  const byNetwork = await prisma.affiliateNetwork.findMany({
    include: {
      _count: {
        select: { programs: true }
      }
    }
  });

  console.log('По сетям:');
  byNetwork.forEach(n => {
    console.log(`  ${n.name}: ${n._count.programs} programs`);
  });
}

checkData()
  .finally(() => prisma.$disconnect())
  .catch(console.error);
