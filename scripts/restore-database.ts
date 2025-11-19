#!/usr/bin/env tsx
/**
 * Database Restore Script
 * Restores database from JSON backup
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function restoreBackup(backupFileName: string) {
  const backupDir = path.join(__dirname, '..', 'backups');
  const backupFile = path.join(backupDir, backupFileName);

  if (!fs.existsSync(backupFile)) {
    console.error(`❌ Файл бэкапа не найден: ${backupFile}`);
    console.log('\n📁 Доступные бэкапы:');
    const files = fs.readdirSync(backupDir).filter((f) => f.endsWith('.json'));
    files.forEach((f) => console.log(`   - ${f}`));
    process.exit(1);
  }

  console.log('⚠️  ВНИМАНИЕ: Восстановление базы данных!\n');
  console.log(`Файл: ${backupFile}\n`);
  console.log('Это удалит все текущие данные и заменит их данными из бэкапа.\n');

  try {
    // Читаем бэкап
    console.log('📖 Чтение файла бэкапа...');
    const backupData = JSON.parse(fs.readFileSync(backupFile, 'utf-8'));

    console.log('\n📊 Информация о бэкапе:');
    console.log(`  Создан: ${new Date(backupData.metadata.createdAt).toLocaleString()}`);
    console.log(`  Версия: ${backupData.metadata.version}`);
    console.log(`  Описание: ${backupData.metadata.description}`);
    console.log('\n📦 Содержимое:');
    console.log(`  Программ: ${backupData.metadata.stats.programs.toLocaleString()}`);
    console.log(`  Сетей: ${backupData.metadata.stats.networks.toLocaleString()}`);
    console.log(`  Избранных: ${backupData.metadata.stats.favorites.toLocaleString()}`);
    console.log(`  Кликов: ${backupData.metadata.stats.clicks.toLocaleString()}\n`);

    console.log('🗑️  Очистка текущих данных...');

    // Удаляем все связанные данные в правильном порядке
    await prisma.programClick.deleteMany({});
    console.log('  ✅ Клики удалены');

    await prisma.favorite.deleteMany({});
    console.log('  ✅ Избранное удалено');

    await prisma.programReview.deleteMany({});
    console.log('  ✅ Отзывы удалены');

    await prisma.programApplication.deleteMany({});
    console.log('  ✅ Заявки удалены');

    await prisma.programAccess.deleteMany({});
    console.log('  ✅ Доступы удалены');

    await prisma.affiliateProgram.deleteMany({});
    console.log('  ✅ Программы удалены');

    await prisma.affiliateNetwork.deleteMany({});
    console.log('  ✅ Сети удалены');

    console.log('\n📥 Восстановление данных...');

    // Восстанавливаем сети
    for (const network of backupData.data.networks) {
      await prisma.affiliateNetwork.create({
        data: {
          id: network.id,
          name: network.name,
          description: network.description,
          website: network.website,
          country: network.country,
          commission: network.commission,
          active: network.active,
          createdAt: new Date(network.createdAt),
          updatedAt: new Date(network.updatedAt),
        },
      });
    }
    console.log(`  ✅ Сети восстановлены: ${backupData.data.networks.length}`);

    // Восстанавливаем программы (батчами по 100)
    const programs = backupData.data.programs;
    const batchSize = 100;
    for (let i = 0; i < programs.length; i += batchSize) {
      const batch = programs.slice(i, i + batchSize);
      await Promise.all(
        batch.map((program: any) =>
          prisma.affiliateProgram.create({
            data: {
              id: program.id,
              networkId: program.networkId,
              externalId: program.externalId,
              name: program.name,
              description: program.description,
              category: program.category,
              commissionRate: program.commissionRate,
              commissionType: program.commissionType,
              cookieDuration: program.cookieDuration,
              paymentThreshold: program.paymentThreshold,
              paymentMethods: program.paymentMethods,
              active: program.active,
              createdAt: new Date(program.createdAt),
              updatedAt: new Date(program.updatedAt),
            },
          })
        )
      );
      console.log(
        `  ✅ Программы: ${Math.min(i + batchSize, programs.length)} / ${programs.length}`
      );
    }

    // Восстанавливаем клики
    for (const click of backupData.data.clicks) {
      await prisma.programClick.create({
        data: {
          id: click.id,
          programId: click.programId,
          userId: click.userId,
          ipAddress: click.ipAddress,
          userAgent: click.userAgent,
          referrer: click.referrer,
          clickedAt: new Date(click.clickedAt),
        },
      });
    }
    console.log(`  ✅ Клики восстановлены: ${backupData.data.clicks.length}`);

    // Восстанавливаем избранное
    for (const favorite of backupData.data.favorites) {
      await prisma.favorite.create({
        data: {
          id: favorite.id,
          userId: favorite.userId,
          programId: favorite.programId,
          createdAt: new Date(favorite.createdAt),
        },
      });
    }
    console.log(`  ✅ Избранное восстановлено: ${backupData.data.favorites.length}`);

    console.log('\n✅ База данных успешно восстановлена!');
    console.log('\n📊 Проверка:');

    const restoredPrograms = await prisma.affiliateProgram.count();
    const restoredNetworks = await prisma.affiliateNetwork.count();
    const restoredFavorites = await prisma.favorite.count();
    const restoredClicks = await prisma.programClick.count();

    console.log(`  Программ: ${restoredPrograms.toLocaleString()}`);
    console.log(`  Сетей: ${restoredNetworks.toLocaleString()}`);
    console.log(`  Избранных: ${restoredFavorites.toLocaleString()}`);
    console.log(`  Кликов: ${restoredClicks.toLocaleString()}\n`);
  } catch (error) {
    console.error('❌ Ошибка при восстановлении:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('📦 Database Restore - Восстановление базы из бэкапа\n');
  console.log('Использование:');
  console.log('  npm run db:restore <имя-файла-бэкапа>\n');
  console.log('Пример:');
  console.log('  npm run db:restore db-backup-before-optimization-2025-01-19T12-00-00.json\n');
  process.exit(1);
}

restoreBackup(args[0]);
