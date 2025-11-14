# Git Hooks - Документация

## 📋 Обзор

Git hooks настроены через Husky для автоматической проверки качества кода перед коммитами и push.

## 🪝 Установленные Hooks

### 1. Pre-commit Hook

**Файл:** `.husky/pre-commit`

**Что делает:**

- Запускает `lint-staged` для staged файлов
- ESLint автофикс для `.ts`, `.tsx`, `.js`, `.jsx`
- Prettier форматирование для всех файлов

**Когда срабатывает:**

```bash
git commit -m "message"
# ↓ Hook запускается автоматически
# ↓ Проверяет только staged файлы
```

**Что проверяется:**

| Тип файлов             | Проверки                |
| ---------------------- | ----------------------- |
| `*.{ts,tsx,js,jsx}`    | ESLint --fix + Prettier |
| `*.{json,md,yml,yaml}` | Prettier форматирование |

**Пример работы:**

```bash
$ git commit -m "fix: update component"
✔ Preparing lint-staged...
✔ Running tasks for staged files...
  ✔ package.json — 2 files
    ✔ *.{js,jsx,ts,tsx} — 1 file
      ✔ eslint --fix
      ✔ prettier --write
✔ Applying modifications from tasks...
✔ Cleaning up temporary files...
[main abc1234] fix: update component
```

### 2. Pre-push Hook

**Файл:** `.husky/pre-push`

**Что делает:**

- Запускает unit тесты (`npm run test:unit`)
- Проверяет TypeScript типы (`tsc --noEmit`)

**Когда срабатывает:**

```bash
git push
# ↓ Hook запускается автоматически
# ↓ Проверяет ВСЕ файлы проекта
```

**Проверки:**

| Проверка   | Команда             | Время |
| ---------- | ------------------- | ----- |
| Unit тесты | `npm run test:unit` | ~2-3s |
| TypeScript | `tsc --noEmit`      | ~5-8s |

**Пример работы:**

```bash
$ git push origin main
Running pre-push hook...
> jest --testPathPattern=tests/unit

PASS tests/unit/rbac-permissions.test.ts
PASS tests/unit/csv-parser.test.ts

Test Suites: 6 passed, 6 total
Tests:       150 passed, 150 total

TypeScript check...
✓ No errors found

Pushing to origin/main...
```

## ⚙️ Конфигурация

### lint-staged

**Файл:** `package.json` → `lint-staged` section

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,yml,yaml}": ["prettier --write"]
  }
}
```

**Настройка:**

- Только staged файлы проверяются
- Auto-fix где возможно
- Форматирование применяется автоматически

### Prettier

**Файл:** `.prettierrc`

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

**Игнорируемые файлы:** `.prettierignore`

- node_modules
- .next, build, dist
- lock файлы
- coverage

## 🔧 Управление Hooks

### Временно отключить hook

**Пропустить pre-commit:**

```bash
git commit -m "message" --no-verify
# или
git commit -m "message" -n
```

**Пропустить pre-push:**

```bash
git push --no-verify
# или
git push -n
```

⚠️ **Используйте осторожно!** Hooks защищают от плохого кода.

### Отключить hook навсегда

Удалите файл в `.husky/`:

```bash
rm .husky/pre-commit
# или
rm .husky/pre-push
```

### Изменить проверки

**Pre-commit (быстрые проверки):**

```bash
# Отредактируйте .husky/pre-commit
npx lint-staged
npm run type-check  # Добавить TypeScript check
```

**Pre-push (долгие проверки):**

```bash
# Отредактируйте .husky/pre-push
npm run test:unit
npm run test:integration  # Добавить integration тесты
npx tsc --noEmit
```

## 🧪 Тестирование Hooks

### Тест pre-commit

```bash
# 1. Измените файл
echo "// test" >> app/page.tsx

# 2. Stage файл
git add app/page.tsx

# 3. Попробуйте закоммитить
git commit -m "test: pre-commit hook"

# Hook должен:
# - Запустить ESLint
# - Запустить Prettier
# - Применить изменения
# - Создать коммит
```

### Тест pre-push

```bash
# 1. Создайте коммит
git commit -m "test" --allow-empty

# 2. Попробуйте push
git push

# Hook должен:
# - Запустить unit тесты
# - Проверить TypeScript
# - Разрешить push если все ОК
```

### Тест с ошибкой

```bash
# 1. Создайте файл с ошибкой
echo "const x: number = 'string';" > test.ts
git add test.ts
git commit -m "test"

# Hook должен:
# ✗ Найти TypeScript ошибку через ESLint
# ✗ Заблокировать коммит
# ✗ Показать ошибки
```

## 📊 Что проверяется

### Pre-commit (только staged файлы):

- ✅ ESLint правила (автофикс)
- ✅ Prettier форматирование (автофикс)
- ✅ Syntax errors
- ✅ Code style

### Pre-push (весь проект):

- ✅ Unit тесты (150 тестов)
- ✅ TypeScript типы
- ✅ Compilation errors
- ✅ Type safety

## 🚀 Performance

**Pre-commit:**

- Проверяет только staged файлы
- Обычно < 5 секунд
- Автофиксы применяются автоматически

**Pre-push:**

- Проверяет весь проект
- ~8-15 секунд
- Блокирует push при ошибках

## 💡 Best Practices

### 1. Не пропускайте hooks без причины

```bash
# ❌ Плохо
git commit -m "quick fix" --no-verify

# ✅ Хорошо
git commit -m "fix: исправлена опечатка"
# Позволить hook проверить код
```

### 2. Коммитьте часто

```bash
# ✅ Хорошо - маленькие коммиты
git add component.tsx
git commit -m "feat: add button component"

# ❌ Плохо - огромные коммиты
git add .
git commit -m "много изменений"
```

### 3. Фиксите ошибки сразу

```bash
# Если hook нашел ошибку:
# 1. Исправьте код
# 2. git add исправленные файлы
# 3. git commit снова
```

### 4. Используйте auto-fix

```bash
# Prettier и ESLint сами исправляют большинство проблем
# Просто перекоммитьте после их работы:
git add .
git commit -m "same message"
```

## 🔍 Troubleshooting

### Hook не запускается

**Проблема:** Git hooks не выполняются

**Решение:**

```bash
# Переинициализировать Husky
npm run prepare

# Проверить права
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
```

### Hook слишком медленный

**Pre-commit долго работает:**

```bash
# Уберите тяжелые проверки из lint-staged
# Оставьте только ESLint и Prettier
```

**Pre-push долго работает:**

```bash
# Уберите integration/e2e тесты
# Оставьте только unit тесты и TypeScript
```

### Ошибка "command not found"

**Проблема:** `npx: command not found`

**Решение:**

```bash
# Убедитесь что node_modules установлены
npm install

# Проверьте PATH
echo $PATH
```

### Hook блокирует валидный код

**Temporary bypass:**

```bash
git commit -m "message" --no-verify
```

**Permanent fix:**

- Исправьте правила ESLint в `.eslintrc.json`
- Или добавьте `// eslint-disable-next-line` в код

## 📝 Дополнительные Hooks (опционально)

### commit-msg - валидация commit message

```bash
# .husky/commit-msg
npx --no -- commitlint --edit $1
```

Требует установки:

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

### post-merge - после git pull

```bash
# .husky/post-merge
npm install
npm run db:migrate
```

## 🎯 Преимущества

**Качество кода:**

- ✅ Автоматический code style
- ✅ Предотвращение syntax errors
- ✅ Консистентное форматирование
- ✅ Проверка типов перед push

**Командная работа:**

- ✅ Единый стиль кода
- ✅ Меньше code review замечаний
- ✅ Автоматизация best practices

**CI/CD:**

- ✅ Меньше failing builds
- ✅ Быстрее CI pipeline (ошибки найдены локально)
- ✅ Экономия CI минут

## 🔗 Ссылки

- [Husky Documentation](https://typicode.github.io/husky/)
- [lint-staged](https://github.com/lint-staged/lint-staged)
- [Prettier](https://prettier.io/)

---

**Создано:** 2025-11-14
**Версия:** 1.0
**Husky:** 9.1.7
