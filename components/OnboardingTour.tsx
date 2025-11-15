'use client'

import { useEffect } from 'react'
import Shepherd from 'shepherd.js'
import 'shepherd.js/dist/css/shepherd.css'

export function OnboardingTour({ autoStart = false }: { autoStart?: boolean }) {
  useEffect(() => {
    if (!autoStart) return

    const tour = new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        cancelIcon: { enabled: true },
        classes: 'shepherd-theme-custom',
        scrollTo: { behavior: 'smooth', block: 'center' }
      }
    })

    tour.addStep({
      id: 'welcome',
      text: '<h3>👋 Добро пожаловать!</h3><p>Давайте покажем основные возможности платформы</p>',
      buttons: [
        { text: 'Пропустить', action: tour.cancel },
        { text: 'Начать тур', action: tour.next }
      ]
    })

    tour.addStep({
      id: 'search',
      text: '<h3>🔍 Поиск Программ</h3><p>Ищите среди 80,000+ партнёрских программ</p>',
      attachTo: { element: 'input[type="search"]', on: 'bottom' },
      buttons: [
        { text: 'Назад', action: tour.back },
        { text: 'Далее', action: tour.next }
      ]
    })

    tour.addStep({
      id: 'filters',
      text: '<h3>🎯 Фильтры</h3><p>Настройте поиск по категории, сети, комиссии</p>',
      buttons: [
        { text: 'Назад', action: tour.back },
        { text: 'Далее', action: tour.next }
      ]
    })

    tour.addStep({
      id: 'favorites',
      text: '<h3>❤️ Избранное</h3><p>Сохраняйте понравившиеся программы</p>',
      buttons: [
        { text: 'Назад', action: tour.back },
        { text: 'Далее', action: tour.next }
      ]
    })

    tour.addStep({
      id: 'upgrade',
      text: '<h3>⭐ Upgrade to Pro</h3><p>Получи unlimited доступ, email alerts и analytics!</p>',
      buttons: [
        { text: 'Назад', action: tour.back },
        { text: 'Готово!', action: tour.complete }
      ]
    })

    tour.start()
  }, [autoStart])

  return null
}
