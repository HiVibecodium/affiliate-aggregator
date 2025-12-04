#!/usr/bin/env tsx
/**
 * Batch Import Programs Script
 * Позволяет добавлять новые программы партиями из JSON файла
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface ImportProgram {
  networkName: string;
  externalId: string;
  name: string;
  description?: string;
  category?: string;
  commissionRate?: number;
  commissionType?: string;
  cookieDuration?: number;
  paymentThreshold?: number;
  paymentMethods?: string[];
  active?: boolean;
}

interface ImportBatch {
  name: string;
  description?: string;
  programs: ImportProgram[];
}

async function importBatch(batchFile: string) {
  console.log(`📦 Импорт программ из: ${batchFile}\n`);

  // Читаем файл
  const batchData: ImportBatch = JSON.parse(fs.readFileSync(batchFile, 'utf-8'));

  console.log(`Название партии: ${batchData.name}`);
  if (batchData.description) {
    console.log(`Описание: ${batchData.description}`);
  }
  console.log(`Программ в партии: ${batchData.programs.length}\n`);

  let imported = 0;
  let skipped = 0;
  let errors = 0;

  for (const program of batchData.programs) {
    try {
      // Находим сеть
      let network = await prisma.affiliateNetwork.findUnique({
        where: { name: program.networkName },
      });

      // Если сеть не найдена, создаем её
      if (!network) {
        console.log(`  ➕ Создание новой сети: ${program.networkName}`);
        network = await prisma.affiliateNetwork.create({
          data: {
            name: program.networkName,
            active: true,
          },
        });
      }

      // Проверяем существует ли программа
      const existing = await prisma.affiliateProgram.findUnique({
        where: {
          networkId_externalId: {
            networkId: network.id,
            externalId: program.externalId,
          },
        },
      });

      if (existing) {
        console.log(`  ⏭️  Пропуск: ${program.name} (уже существует)`);
        skipped++;
        continue;
      }

      // Создаем программу
      await prisma.affiliateProgram.create({
        data: {
          networkId: network.id,
          externalId: program.externalId,
          name: program.name,
          description: program.description,
          category: program.category,
          commissionRate: program.commissionRate,
          commissionType: program.commissionType || 'CPS',
          cookieDuration: program.cookieDuration || 30,
          paymentThreshold: program.paymentThreshold,
          paymentMethods: program.paymentMethods || [],
          active: program.active !== false,
        },
      });

      console.log(`  ✅ Импорт: ${program.name} (${program.commissionRate}%)`);
      imported++;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`  ❌ Ошибка при импорте ${program.name}:`, message);
      errors++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Результаты импорта:`);
  console.log(`  ✅ Импортировано: ${imported}`);
  console.log(`  ⏭️  Пропущено: ${skipped}`);
  console.log(`  ❌ Ошибок: ${errors}`);
  console.log(`  📦 Всего обработано: ${batchData.programs.length}`);
}

async function createExampleBatch() {
  const exampleBatch: ImportBatch = {
    name: 'Топовые программы 2025',
    description: 'Подборка лучших партнерских программ с высокими комиссиями',
    programs: [
      {
        networkName: 'ShareASale',
        externalId: 'example-1',
        name: 'Premium Web Hosting',
        description: 'Лучший хостинг для WordPress с комиссией 50%',
        category: 'Software & Services',
        commissionRate: 50,
        commissionType: 'CPS',
        cookieDuration: 90,
        paymentThreshold: 50,
        paymentMethods: ['PayPal', 'Bank Transfer'],
        active: true,
      },
      {
        networkName: 'ClickBank',
        externalId: 'example-2',
        name: 'Online Marketing Course',
        description: 'Курс по интернет-маркетингу с пожизненной комиссией',
        category: 'Online Education',
        commissionRate: 75,
        commissionType: 'CPS',
        cookieDuration: 60,
        paymentThreshold: 100,
        paymentMethods: ['PayPal', 'Direct Deposit'],
        active: true,
      },
      {
        networkName: 'CJ Affiliate',
        externalId: 'example-3',
        name: 'Fashion E-commerce',
        description: 'Международный магазин модной одежды',
        category: 'Fashion & Apparel',
        commissionRate: 20,
        commissionType: 'CPS',
        cookieDuration: 30,
        paymentThreshold: 50,
        paymentMethods: ['Bank Transfer', 'Payoneer'],
        active: true,
      },
    ],
  };

  const examplePath = path.join(__dirname, 'example-batch.json');
  fs.writeFileSync(examplePath, JSON.stringify(exampleBatch, null, 2), 'utf-8');

  console.log(`✨ Создан пример файла для импорта: ${examplePath}\n`);
  console.log('Отредактируйте его и запустите:');
  console.log(`   npx tsx scripts/batch-import-programs.ts ${examplePath}\n`);
}

async function main() {
  try {
    const args = process.argv.slice(2);

    if (args.length === 0 || args[0] === '--help') {
      console.log('📦 Batch Import Programs - Пакетный импорт партнерских программ\n');
      console.log('Использование:');
      console.log('  npx tsx scripts/batch-import-programs.ts <файл.json>');
      console.log('  npx tsx scripts/batch-import-programs.ts --example\n');
      console.log('Опции:');
      console.log('  --example    Создать пример файла для импорта');
      console.log('  --help       Показать эту справку\n');
      return;
    }

    if (args[0] === '--example') {
      await createExampleBatch();
      return;
    }

    const batchFile = args[0];

    if (!fs.existsSync(batchFile)) {
      console.error(`❌ Файл не найден: ${batchFile}`);
      process.exit(1);
    }

    await importBatch(batchFile);
  } catch (error) {
    console.error('❌ Ошибка:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
