/**
 * Category Translations (EN -> RU)
 * Переводы категорий партнерских программ
 */

export const categoryTranslations: Record<string, string> = {
  // A
  Accessories: 'Аксессуары',
  'Animals & Pets': 'Животные и питомцы',
  'Antiques & Collectibles': 'Антиквариат и коллекционирование',
  'Apparel & Accessories': 'Одежда и аксессуары',
  'Arts & Entertainment': 'Искусство и развлечения',
  'Arts, Crafts & Sewing': 'Рукоделие и шитье',
  'Auto & Vehicles': 'Авто и транспорт',
  Automotive: 'Автомобили',

  // B
  'Beauty & Personal Care': 'Красота и уход',
  'Books & Entertainment': 'Книги и развлечения',
  'Books & Literature': 'Книги и литература',
  'Books & Media': 'Книги и медиа',
  Business: 'Бизнес',
  'Business & Finance': 'Бизнес и финансы',
  'Business & Industrial': 'Бизнес и промышленность',
  'Business & Investing': 'Бизнес и инвестиции',
  'Business Services': 'Бизнес-услуги',

  // C
  'Careers & Education': 'Карьера и образование',
  'Children & Family': 'Дети и семья',
  'Clothing & Accessories': 'Одежда и аксессуары',
  'Clothing & Shoes': 'Одежда и обувь',
  'Computer & Electronics': 'Компьютеры и электроника',
  'Computers & Electronics': 'Компьютеры и электроника',
  'Computers & Internet': 'Компьютеры и интернет',
  'Computers & Technology': 'Компьютеры и технологии',
  'Cooking, Food & Wine': 'Кулинария и вино',

  // D
  'Department Stores': 'Универмаги',
  'Department Stores & Malls': 'Универмаги и торговые центры',
  'Digital Products': 'Цифровые продукты',

  // E
  'E-business & E-marketing': 'Электронный бизнес и маркетинг',
  Education: 'Образование',
  Entertainment: 'Развлечения',

  // F
  Family: 'Семья',
  'Fashion & Apparel': 'Мода и одежда',
  'Fashion & Style': 'Мода и стиль',
  Fiction: 'Художественная литература',
  Finance: 'Финансы',
  'Financial Services': 'Финансовые услуги',
  'Flowers & Gifts': 'Цветы и подарки',
  'Food & Beverage': 'Еда и напитки',
  'Food & Drink': 'Еда и напитки',
  'Food & Drinks': 'Еда и напитки',

  // G
  Games: 'Игры',
  'Green Products': 'Экологичные продукты',

  // H
  Health: 'Здоровье',
  'Health & Beauty': 'Здоровье и красота',
  'Health & Fitness': 'Здоровье и фитнес',
  'Health & Wellness': 'Здоровье и благополучие',
  'Hobbies & Leisure': 'Хобби и досуг',
  'Home & Garden': 'Дом и сад',

  // I
  Insurance: 'Страхование',

  // J
  'Jewelry & Watches': 'Ювелирные изделия и часы',

  // L
  Languages: 'Языки',
  Legal: 'Юридические услуги',

  // M
  Mobile: 'Мобильные услуги',

  // O
  'Office Products': 'Офисные товары',

  // P
  'Parenting & Families': 'Родительство и семья',
  'Personal Care': 'Личный уход',
  'Pet Supplies': 'Товары для животных',
  'Politics & Current Events': 'Политика и текущие события',

  // R
  Reference: 'Справочники',
  Retail: 'Розничная торговля',

  // S
  'Self-Help': 'Саморазвитие',
  'Software & Services': 'Программное обеспечение и услуги',
  'Spirituality, New Age & Alternative Beliefs': 'Духовность и альтернативные учения',
  Sports: 'Спорт',
  'Sports & Fitness': 'Спорт и фитнес',
  'Sports & Outdoors': 'Спорт и активный отдых',

  // T
  Telecommunications: 'Телекоммуникации',
  'Toys & Games': 'Игрушки и игры',
  'Toys & Hobbies': 'Игрушки и хобби',
  Travel: 'Путешествия',
  'Travel & Tourism': 'Путешествия и туризм',

  // V
  Vehicles: 'Транспорт',

  // W
  'Web Services': 'Веб-сервисы',
  'Web Services & Internet': 'Веб-сервисы и интернет',
};

/**
 * Translate category from English to Russian
 */
export function translateCategory(category: string | null | undefined): string {
  if (!category) return 'Без категории';
  return categoryTranslations[category] || category;
}

/**
 * Get all categories with translations
 */
export function getAllCategoriesWithTranslations(): Array<{
  value: string;
  label: string;
}> {
  return Object.entries(categoryTranslations).map(([value, label]) => ({
    value,
    label,
  }));
}
