import { readFileSync } from 'fs';
import { join } from 'path';
import { prisma } from '../lib/prisma';

async function applyMigration() {
  console.log('🔧 Applying reviews system migration...\n');

  try {
    const migrationPath = join(__dirname, '../prisma/migrations/add_reviews_system.sql');
    const sql = readFileSync(migrationPath, 'utf-8');

    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith('--'));

    console.log(`📝 Executing ${statements.length} SQL statements...\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (!statement || statement.startsWith('--')) continue;

      console.log(`⏳ Statement ${i + 1}/${statements.length}...`);

      try {
        await prisma.$executeRawUnsafe(statement);
        console.log(`✅ Success\n`);
      } catch (error) {
        if (error instanceof Error && error.message.includes('already exists')) {
          console.log(`ℹ️  Already exists, skipping\n`);
        } else {
          console.error(`❌ Error:`, error instanceof Error ? error.message : error);
        }
      }
    }

    console.log('✅ Reviews system migration complete!\n');
    console.log('📊 Verifying tables created...');

    const result = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name LIKE '%Review%'
      ORDER BY table_name;
    `;

    console.log('\n📋 Review tables:');
    console.log(result);

    console.log('\n🎉 Reviews & Ratings system ready!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

applyMigration();
