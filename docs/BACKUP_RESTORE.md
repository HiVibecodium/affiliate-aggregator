# Backup & Restore - Документация

## 📦 Резервные копии проекта

### Git Tags (Recommended)

Проект использует Git tags для версионирования и точек восстановления.

#### Текущие версии:

- **v1.0.0** - Production Ready Release (2025-11-14)
  - 28 коммитов
  - Все основные features
  - 197+ тестов
  - Enterprise security
  - Click tracking & analytics

---

## 🔄 Восстановление из версии

### Способ 1: Checkout tag

```bash
# Посмотреть доступные версии
git tag -l

# Восстановить версию v1.0.0
git checkout v1.0.0

# Установить зависимости
npm install

# Запустить
npm run dev
```

**Когда использовать:**

- Откат на стабильную версию
- Тестирование старой версии
- Debugging

---

### Способ 2: Create branch from tag

```bash
# Создать ветку из тега
git checkout -b restore-v1.0.0 v1.0.0

# Работать с веткой
git checkout main
git merge restore-v1.0.0
```

**Когда использовать:**

- Нужно работать на базе старой версии
- Создание hotfix

---

### Способ 3: Reset to tag (ОСТОРОЖНО!)

```bash
# ВНИМАНИЕ: Это удалит все изменения после тега!
git reset --hard v1.0.0

# Force push (если нужно обновить remote)
git push --force origin main
```

**Когда использовать:**

- Критическая проблема в production
- Нужен полный откат

⚠️ **ВАЖНО:** Сделайте backup перед reset!

---

## 📁 Создание архивной копии

### Local Backup

```bash
# Создать zip архив проекта
cd ..
tar -czf affiliate-aggregator-backup-2025-11-14.tar.gz affiliate-aggregator/

# Или zip (Windows)
powershell Compress-Archive -Path affiliate-aggregator -DestinationPath affiliate-aggregator-backup.zip
```

### Export from Git

```bash
# Экспорт конкретного коммита
git archive --format=zip --output=project-v1.0.0.zip v1.0.0

# Экспорт текущего состояния
git archive --format=zip --output=project-latest.zip HEAD
```

---

## 💾 Database Backup

### Supabase Backup

1. **Через Dashboard:**
   - https://app.supabase.com
   - Project → Database → Backups
   - Create backup
   - Download

2. **Через CLI:**

```bash
# Экспорт schema
npx prisma db pull

# Экспорт данных (SQL)
pg_dump $DATABASE_URL > backup.sql
```

### Restore Database

```bash
# Восстановить из SQL
psql $DATABASE_URL < backup.sql

# Или через Supabase
# Dashboard → Database → Restore from backup
```

---

## 🔐 Backup Environment Variables

### Export .env

```bash
# Копировать .env.local
cp .env.local .env.backup

# Или создать encrypted backup
gpg -c .env.local  # Creates .env.local.gpg
```

### Restore

```bash
# Восстановить
cp .env.backup .env.local

# Или расшифровать
gpg .env.local.gpg  # Prompts for password
```

---

## 📋 Backup Checklist

Перед важными изменениями:

- [ ] Git commit всех изменений
- [ ] Create git tag (если milestone)
- [ ] Backup database (если schema changes)
- [ ] Backup .env файлы
- [ ] Test restore process
- [ ] Документировать изменения

---

## 🚨 Emergency Restore Process

### Если что-то сломалось:

**1. Откат кода:**

```bash
git reset --hard v1.0.0
npm install
```

**2. Откат базы данных:**

```bash
# Через Supabase Dashboard
# Project → Database → Backups → Restore
```

**3. Проверка:**

```bash
npm test
npm run build
npm run dev
```

**4. Deploy:**

```bash
git push --force origin main  # Только если критично!
```

---

## 📍 Список версий

### v1.0.0 (2025-11-14) - Production Ready

```
Commit: 2d7e39d
Features: Все основные features
Status: Stable ✅
Recommended: Да
```

### Добавление новых версий

```bash
# Minor version (новые features)
git tag -a v1.1.0 -m "Description"

# Patch version (bugfixes)
git tag -a v1.0.1 -m "Description"

# Major version (breaking changes)
git tag -a v2.0.0 -m "Description"

# Push tag
git push origin v1.1.0
```

---

## 🔗 GitHub Release

Release URL: https://github.com/Vibecodium/affiliate-aggregator/releases/tag/v1.0.0

**Содержит:**

- Source code (zip)
- Source code (tar.gz)
- Release notes
- Changelog

**Восстановление из Release:**

```bash
# Download release archive
wget https://github.com/Vibecodium/affiliate-aggregator/archive/refs/tags/v1.0.0.zip

# Unzip
unzip v1.0.0.zip

# Install & run
cd affiliate-aggregator-1.0.0
npm install
npm run dev
```

---

## 💡 Best Practices

1. **Создавайте tag перед deployment в production**
2. **Тестируйте restore process регулярно**
3. **Храните backups в нескольких местах** (GitHub + local + cloud)
4. **Документируйте изменения** в release notes
5. **Backup базы данных** перед миграциями
6. **Храните .env в безопасном месте** (НЕ в git!)

---

## 🆘 Support

Если нужна помощь с восстановлением:

1. Проверьте этот документ
2. Посмотрите GitHub Issues
3. Контакт: support@vibecodium.com

---

**Создано:** 2025-11-14
**Версия:** 1.0
**Последнее обновление:** 2025-11-14
