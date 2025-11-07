import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearPrograms() {
  console.log('🗑️  Очистка программ...');

  const deleted = await prisma.affiliateProgram.deleteMany({});
  console.log(`✅ Удалено программ: ${deleted.count}`);

  const networks = await prisma.affiliateNetwork.findMany();
  console.log(`📊 Осталось сетей: ${networks.length}`);
}

clearPrograms()
  .finally(() => prisma.$disconnect())
  .catch(console.error);
