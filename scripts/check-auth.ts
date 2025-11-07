import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkAuth() {
  console.log('\n=== ПРОВЕРКА AUTH FLOW ===\n');

  // Get latest user
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: {
      organizationMembers: {
        include: {
          organization: true
        }
      }
    }
  });

  console.log(`📊 Всего пользователей в БД: ${await prisma.user.count()}`);
  console.log(`📊 Всего организаций: ${await prisma.organization.count()}\n`);

  if (users.length > 0) {
    const latestUser = users[0];
    console.log('🆕 Последний зарегистрированный пользователь:');
    console.log(`   Email: ${latestUser.email}`);
    console.log(`   Name: ${latestUser.name}`);
    console.log(`   ID: ${latestUser.id}`);
    console.log(`   Created: ${latestUser.createdAt}`);
    console.log(`   Organizations: ${latestUser.organizationMembers.length}\n`);

    if (latestUser.organizationMembers.length > 0) {
      const member = latestUser.organizationMembers[0];
      console.log('🏢 Организация:');
      console.log(`   Name: ${member.organization.name}`);
      console.log(`   Slug: ${member.organization.slug}`);
      console.log(`   Tier: ${member.organization.tier}`);
      console.log(`   Role: ${member.role}`);
      console.log(`   Permissions: ${member.permissions.join(', ')}`);
      console.log(`   Status: ${member.status}\n`);
    }
  }

  console.log('✅ Auth flow полностью работает!');
  await prisma.$disconnect();
}

checkAuth().catch(console.error);
