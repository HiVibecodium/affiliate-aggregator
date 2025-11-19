#!/usr/bin/env tsx
/**
 * Database Backup Script
 * Creates a JSON backup of all affiliate programs and networks
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const backupDir = path.join(__dirname, '..', 'backups');

  // Создаем директорию для бэкапов если её нет
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const backupFile = path.join(backupDir, `db-backup-before-optimization-${timestamp}.json`);

  console.log('🔄 Создание бэкапа базы данных...\n');
  console.log(`Файл: ${backupFile}\n`);

  try {
    // Получаем статистику
    const totalPrograms = await prisma.affiliateProgram.count();
    const totalNetworks = await prisma.affiliateNetwork.count();
    const totalUsers = await prisma.user.count();
    const totalFavorites = await prisma.favorite.count();
    const totalClicks = await prisma.programClick.count();

    console.log('📊 Статистика базы данных:');
    console.log(`  Программ: ${totalPrograms.toLocaleString()}`);
    console.log(`  Сетей: ${totalNetworks.toLocaleString()}`);
    console.log(`  Пользователей: ${totalUsers.toLocaleString()}`);
    console.log(`  Избранных: ${totalFavorites.toLocaleString()}`);
    console.log(`  Кликов: ${totalClicks.toLocaleString()}\n`);

    // Получаем все данные
    console.log('📦 Экспорт данных...');

    const networks = await prisma.affiliateNetwork.findMany();
    console.log(`  ✅ Сети: ${networks.length}`);

    const programs = await prisma.affiliateProgram.findMany({
      include: {
        network: true,
      },
    });
    console.log(`  ✅ Программы: ${programs.length}`);

    const favorites = await prisma.favorite.findMany({
      include: {
        user: { select: { email: true } },
        program: { select: { name: true, externalId: true } },
      },
    });
    console.log(`  ✅ Избранное: ${favorites.length}`);

    const clicks = await prisma.programClick.findMany({
      include: {
        program: { select: { name: true, externalId: true } },
      },
    });
    console.log(`  ✅ Клики: ${clicks.length}`);

    // Формируем структуру бэкапа
    const backup = {
      metadata: {
        version: '1.0',
        createdAt: new Date().toISOString(),
        description: 'Бэкап перед оптимизацией базы данных',
        stats: {
          programs: totalPrograms,
          networks: totalNetworks,
          users: totalUsers,
          favorites: totalFavorites,
          clicks: totalClicks,
        },
      },
      data: {
        networks,
        programs,
        favorites,
        clicks,
      },
    };

    // Сохраняем в файл
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2), 'utf-8');

    const fileSize = (fs.statSync(backupFile).size / 1024 / 1024).toFixed(2);

    console.log('\n✅ Бэкап успешно создан!');
    console.log(`📁 Файл: ${backupFile}`);
    console.log(`📏 Размер: ${fileSize} MB\n`);

    console.log('💡 Для восстановления используйте:');
    console.log(`   npm run db:restore ${path.basename(backupFile)}\n`);

    return backupFile;
  } catch (error) {
    console.error('❌ Ошибка при создании бэкапа:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createBackup();
