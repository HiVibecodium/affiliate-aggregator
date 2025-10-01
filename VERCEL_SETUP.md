# ⚡ Vercel Auto-Deploy Setup

## Текущий Статус

✅ **Локально**: Все работает (http://localhost:3000)
✅ **GitHub**: Все коммиты запушены (5 commits)
✅ **Vercel**: Проект создан
✅ **Supabase**: База данных подключена
⚠️ **Auto-Deploy**: Требует настройки GitHub integration

## Проблема

Vercel проект создан через CLI, но не подключен к GitHub репозиторию для автоматического деплоя.

**Последний production deploy**: 53+ минуты назад (только initial deploy)
**Новые коммиты**: Не деплоятся автоматически

## Решение: Подключить GitHub Integration

### Шаг 1: Открыть Vercel Project Settings

Перейдите на: https://vercel.com/vibecodium/affiliate-aggregator/settings/git

### Шаг 2: Connect Git Repository

1. Найдите секцию **"Git Repository"**
2. Нажмите **"Connect Git Repository"** или **"Configure"**
3. Выберите **GitHub** как provider
4. Выберите репозиторий: `Vibecodium/affiliate-aggregator`
5. Подтвердите подключение

### Шаг 3: Настроить Auto-Deploy

После подключения репозитория:

1. **Production Branch**: `main` ✅ (уже настроено)
2. **Deploy Hooks**: Автоматически создастся webhook
3. **Auto-Deploy**: Включится автоматически

### Шаг 4: Проверка

После настройки каждый `git push` в `main` будет:
1. Trigger Vercel deployment
2. Build проект
3. Deploy на production URL
4. Отображать статус в GitHub PR/commits

## Альтернативный Способ: Manual Deploy

Если не хотите настраивать auto-deploy, можно деплоить вручную:

### Через Vercel Dashboard:

1. Откройте: https://vercel.com/vibecodium/affiliate-aggregator
2. Нажмите **"Deployments"** в меню
3. Найдите кнопку **"Redeploy"**
4. Выберите latest commit
5. Нажмите **"Redeploy"**

### Через Vercel CLI:

```bash
cd affiliate-aggregator
vercel --prod
```

⚠️ **Note**: Для CLI deploy нужны права в team Vibecodium

## Проверка После Настройки

После подключения GitHub integration:

1. Сделайте тестовый коммит:
```bash
git commit --allow-empty -m "Test auto-deploy"
git push
```

2. Проверьте деплой:
- GitHub Actions: https://github.com/Vibecodium/affiliate-aggregator/actions
- Vercel Deployments: https://vercel.com/vibecodium/affiliate-aggregator

3. Откройте production URL:
- https://affiliate-aggregator-pyxzi5kq3-vibecodium.vercel.app

## Текущие Коммиты (Ожидают Deploy)

```
a4a69ca - Add comprehensive demo documentation
58f8ab9 - Fix CI/CD build issues
1925d72 - Add working demo with database integration
3118ec1 - Add database configuration and Vercel integration
2f7c0a4 - Initial commit (✅ deployed)
```

## Environment Variables

✅ Все переменные уже настроены в Vercel через Supabase Integration:
- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Эти переменные автоматически используются при каждом deploy.

## После Настройки

После подключения GitHub integration вы сможете:

✅ **Auto-Deploy on Push**: Каждый push в main → автоматический deploy
✅ **Preview Deployments**: PR создают preview URLs
✅ **Deploy Status**: Статусы в GitHub commits
✅ **Rollback**: Откат на предыдущие версии одним кликом

---

**Проект полностью готов к работе, нужна только настройка GitHub integration в Vercel!**
