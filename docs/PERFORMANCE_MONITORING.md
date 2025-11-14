# Performance Monitoring - Документация

## 📊 Обзор

Автоматический мониторинг производительности с помощью Lighthouse CI.

## 🚀 Конфигурация

### Lighthouse CI Config (`lighthouserc.json`)

#### Проверяемые страницы:

- ✅ `/` - Главная страница
- ✅ `/programs` - Каталог программ
- ✅ `/dashboard` - Аналитика

#### Параметры сбора:

- **numberOfRuns:** 3 прогона для точности
- **Preset:** Desktop
- **Throttling:** Минимальный (быстрое соединение)

## 📏 Performance Budgets (Thresholds)

### Core Web Vitals

| Метрика               | Порог | Уровень | Цель                     |
| --------------------- | ----- | ------- | ------------------------ |
| **Performance Score** | 80+   | error   | Общая производительность |
| **Accessibility**     | 90+   | error   | Доступность              |
| **Best Practices**    | 90+   | error   | Лучшие практики          |
| **SEO**               | 90+   | error   | Поисковая оптимизация    |

### Timing Metrics

| Метрика                            | Порог   | Уровень | Описание                 |
| ---------------------------------- | ------- | ------- | ------------------------ |
| **First Contentful Paint (FCP)**   | < 2.0s  | warn    | Первый контент на экране |
| **Largest Contentful Paint (LCP)** | < 2.5s  | warn    | Главный контент загружен |
| **Cumulative Layout Shift (CLS)**  | < 0.1   | warn    | Стабильность макета      |
| **Total Blocking Time (TBT)**      | < 300ms | warn    | Время блокировки         |
| **Speed Index**                    | < 3.0s  | warn    | Скорость загрузки        |
| **Time to Interactive (TTI)**      | < 3.5s  | warn    | Интерактивность          |
| **Max Potential FID**              | < 130ms | warn    | Задержка ввода           |

### Resource Budgets

| Ресурс         | Лимит    | Описание                 |
| -------------- | -------- | ------------------------ |
| **JavaScript** | < 250 KB | Общий размер JS          |
| **CSS**        | < 50 KB  | Общий размер CSS         |
| **Images**     | < 500 KB | Общий размер изображений |
| **Total**      | < 1 MB   | Все ресурсы              |

### Performance Checks

| Проверка               | Уровень | Что проверяет            |
| ---------------------- | ------- | ------------------------ |
| uses-optimized-images  | warn    | Оптимизация изображений  |
| modern-image-formats   | warn    | WebP/AVIF форматы        |
| uses-responsive-images | warn    | Responsive images        |
| unminified-css         | warn    | Минификация CSS          |
| unminified-javascript  | warn    | Минификация JS           |
| dom-size               | warn    | < 1500 DOM элементов     |
| bootup-time            | warn    | < 3.5s время загрузки JS |

## 🔄 Workflow Schedule

**Автоматический запуск:**

- ⏰ Каждые 6 часов (cron: `0 */6 * * *`)
- 📅 4 раза в день

**Ручной запуск:**

```bash
# Через GitHub CLI
gh workflow run performance-monitoring.yml

# Или через GitHub UI
Actions → Performance Monitoring → Run workflow
```

## 📈 Как работает

### 1. Lighthouse Audit Job

```yaml
steps: 1. Checkout code
  2. Setup Node.js
  3. Install Lighthouse CI
  4. Run lighthouse audit (3x для точности)
  - Проверяет 3 страницы
  - Применяет assertions из lighthouserc.json
  - Загружает результаты
  5. Upload artifacts
```

**Если assertions не проходят → Job fails → Alert**

### 2. Результаты

**Success (все thresholds пройдены):**

```
✅ Performance: 85/100
✅ Accessibility: 95/100
✅ Best Practices: 92/100
✅ SEO: 98/100
✅ FCP: 1.8s
✅ LCP: 2.2s
```

**Failure (threshold не пройден):**

```
❌ Performance: 75/100 (минимум 80)
❌ LCP: 3.2s (максимум 2.5s)
→ Workflow failed
→ Нужно оптимизировать
```

## 🎯 Целевые Показатели

### Отличная производительность:

- Performance: **90+**
- FCP: **< 1.5s**
- LCP: **< 2.0s**
- CLS: **< 0.05**
- TBT: **< 200ms**

### Приемлемая производительность:

- Performance: **80+** ✅ (наш порог)
- FCP: **< 2.0s** ✅
- LCP: **< 2.5s** ✅
- CLS: **< 0.1** ✅
- TBT: **< 300ms** ✅

### Требует улучшений:

- Performance: **< 80** ❌
- FCP: **> 2.0s** ❌
- LCP: **> 2.5s** ❌

## 🔧 Настройка Thresholds

### Изменить минимальный score

В `lighthouserc.json`:

```json
{
  "assert": {
    "assertions": {
      "categories:performance": ["error", { "minScore": 0.85 }] // Было 0.8
    }
  }
}
```

### Изменить timing budget

```json
{
  "first-contentful-paint": ["warn", { "maxNumericValue": 1500 }] // Было 2000
}
```

### Добавить новую проверку

```json
{
  "uses-http2": "warn",
  "uses-long-cache-ttl": "warn",
  "font-display": "warn"
}
```

### Изменить severity level

```
"error" - блокирует workflow
"warn"  - показывает warning
"off"   - отключено
```

## 📊 Мониторинг Результатов

### GitHub Actions

1. Откройте Actions → Performance Monitoring
2. Выберите последний run
3. Скачайте artifact `lighthouse-results`
4. Откройте HTML репорты

### Lighthouse Reports

**Формат артефактов:**

```
.lighthouseci/
├── lhr-{timestamp}-{url}.json
├── lhr-{timestamp}-{url}.html
└── manifest.json
```

**Просмотр:**

```bash
# Скачать artifact
gh run download {run-id} -n lighthouse-results

# Открыть HTML репорт
open .lighthouseci/*.html
```

### Trends Tracking

**Отслеживайте:**

- Performance score динамика
- Regression после деплоев
- Resource size changes
- Core Web Vitals trends

## 🚨 Alerts и Уведомления

### При failure workflow

Текущая настройка:

```yaml
alert-on-issues:
  needs: [lighthouse-audit, ...]
  if: failure()
  steps:
    - Create alert
```

### Добавить Slack/Discord webhook

```yaml
- name: Notify on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
    payload: |
      {
        "text": "⚠️ Performance degradation detected!"
      }
```

## 🎨 Оптимизация Performance

### Если Performance < 80:

**Проверьте:**

1. **JavaScript size** - уменьшить bundle
2. **Images** - оптимизировать размер
3. **Unused code** - удалить лишнее
4. **Third-party scripts** - отложить загрузку
5. **CSS** - минифицировать

**Быстрые фиксы:**

```javascript
// Dynamic imports
const Component = dynamic(() => import('./Heavy'), { ssr: false });

// Image optimization
<Image src="/pic.jpg" width={800} height={600} />

// Font optimization
<link rel="preload" href="/fonts/main.woff2" as="font" />
```

### Если LCP > 2.5s:

1. Оптимизировать largest image
2. Использовать Server Components
3. Preload critical resources
4. Reduce render-blocking resources

### Если CLS > 0.1:

1. Задайте размеры для images
2. Резервируйте место для ads
3. Избегайте динамической вставки контента
4. Используйте CSS aspect-ratio

## 📖 Расшифровка Метрик

### First Contentful Paint (FCP)

- Первый текст/изображение на экране
- Цель: < 1.8s
- Хорошо: < 2.0s

### Largest Contentful Paint (LCP)

- Главный контент полностью видим
- Цель: < 2.5s
- Важнейшая метрика для UX

### Cumulative Layout Shift (CLS)

- Стабильность макета
- Цель: < 0.1
- Нет "прыгающего" контента

### Total Blocking Time (TBT)

- Время когда страница неинтерактивна
- Цель: < 300ms
- Влияет на responsiveness

### Speed Index

- Как быстро контент становится видимым
- Цель: < 3.0s
- Визуальная скорость загрузки

## 🔗 Полезные Ссылки

- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

## 💡 Tips

1. **Запускайте локально** перед деплоем:

   ```bash
   npm install -g @lhci/cli
   lhci autorun
   ```

2. **Проверяйте на реальных устройствах**
   - Mobile performance обычно хуже
   - Учитывайте медленные соединения

3. **Отслеживайте regression**
   - Сравнивайте с предыдущими результатами
   - Фиксите деградацию сразу

4. **Оптимизируйте постепенно**
   - Начните с самых критичных метрик
   - Incremental improvements

---

**Создано:** 2025-11-14
**Версия:** 1.0
**Lighthouse CI:** 0.12.x
