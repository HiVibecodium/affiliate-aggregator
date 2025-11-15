import { prisma } from '../lib/prisma';

async function checkCountries() {
  console.log('🔍 Checking country data in database...\n');

  // Check networks with countries
  const networks = await prisma.affiliateNetwork.findMany({
    select: {
      name: true,
      country: true,
      _count: {
        select: { programs: true },
      },
    },
    orderBy: { name: 'asc' },
  });

  console.log('📊 Networks and their countries:\n');
  networks.forEach((net) => {
    const nameCol = net.name.padEnd(25, ' ');
    const countryCol = (net.country || 'NULL').padEnd(10, ' ');
    const programsCol = net._count.programs;
    console.log(`${nameCol} | Country: ${countryCol} | Programs: ${programsCol}`);
  });

  console.log('\n📈 Country statistics:');
  const countryStats = await prisma.affiliateNetwork.groupBy({
    by: ['country'],
    _count: { country: true },
    where: { country: { not: null } },
  });

  countryStats.forEach((stat) => {
    console.log(`  ${stat.country}: ${stat._count.country} networks`);
  });

  console.log('\n🔍 Total programs by network with country:');
  const programsByCountry = await prisma.$queryRaw`
    SELECT
      an.country,
      COUNT(DISTINCT an.id) as networks,
      COUNT(ap.id) as programs
    FROM "AffiliateNetwork" an
    LEFT JOIN "AffiliateProgram" ap ON ap."networkId" = an.id AND ap.active = true
    WHERE an.country IS NOT NULL AND an.active = true
    GROUP BY an.country
    ORDER BY programs DESC
  `;

  console.log(programsByCountry);

  await prisma.$disconnect();
}

checkCountries();
