/**
 * Category Translations Tests
 */

import {
  categoryTranslations,
  translateCategory,
  getAllCategoriesWithTranslations,
} from '@/lib/translations/categories';

describe('Category Translations', () => {
  describe('categoryTranslations', () => {
    it('has translations for common categories', () => {
      expect(categoryTranslations['Beauty & Personal Care']).toBe('Красота и уход');
      expect(categoryTranslations['Health & Fitness']).toBe('Здоровье и фитнес');
      expect(categoryTranslations['Finance']).toBe('Финансы');
      expect(categoryTranslations['Travel']).toBe('Путешествия');
      expect(categoryTranslations['Education']).toBe('Образование');
    });

    it('has translations for business categories', () => {
      expect(categoryTranslations['Business']).toBe('Бизнес');
      expect(categoryTranslations['Business & Finance']).toBe('Бизнес и финансы');
      expect(categoryTranslations['Business Services']).toBe('Бизнес-услуги');
    });

    it('has translations for technology categories', () => {
      expect(categoryTranslations['Computer & Electronics']).toBe('Компьютеры и электроника');
      expect(categoryTranslations['Computers & Internet']).toBe('Компьютеры и интернет');
      expect(categoryTranslations['Software & Services']).toBe('Программное обеспечение и услуги');
    });

    it('has translations for retail categories', () => {
      expect(categoryTranslations['Department Stores']).toBe('Универмаги');
      expect(categoryTranslations['Retail']).toBe('Розничная торговля');
      expect(categoryTranslations['Fashion & Apparel']).toBe('Мода и одежда');
    });
  });

  describe('translateCategory', () => {
    it('translates known categories', () => {
      expect(translateCategory('Health')).toBe('Здоровье');
      expect(translateCategory('Sports')).toBe('Спорт');
      expect(translateCategory('Games')).toBe('Игры');
      expect(translateCategory('Insurance')).toBe('Страхование');
    });

    it('returns original category if no translation exists', () => {
      expect(translateCategory('Unknown Category')).toBe('Unknown Category');
      expect(translateCategory('Some Random Text')).toBe('Some Random Text');
    });

    it('returns default text for null', () => {
      expect(translateCategory(null)).toBe('Без категории');
    });

    it('returns default text for undefined', () => {
      expect(translateCategory(undefined)).toBe('Без категории');
    });

    it('returns default text for empty string', () => {
      expect(translateCategory('')).toBe('Без категории');
    });
  });

  describe('getAllCategoriesWithTranslations', () => {
    it('returns array of objects with value and label', () => {
      const categories = getAllCategoriesWithTranslations();

      expect(Array.isArray(categories)).toBe(true);
      expect(categories.length).toBeGreaterThan(0);

      categories.forEach((cat) => {
        expect(cat).toHaveProperty('value');
        expect(cat).toHaveProperty('label');
        expect(typeof cat.value).toBe('string');
        expect(typeof cat.label).toBe('string');
      });
    });

    it('returns all categories from translations object', () => {
      const categories = getAllCategoriesWithTranslations();
      const translationKeys = Object.keys(categoryTranslations);

      expect(categories.length).toBe(translationKeys.length);
    });

    it('has correct value/label pairs', () => {
      const categories = getAllCategoriesWithTranslations();

      // Find specific category
      const healthCategory = categories.find((c) => c.value === 'Health');
      expect(healthCategory).toBeDefined();
      expect(healthCategory?.label).toBe('Здоровье');

      const financeCategory = categories.find((c) => c.value === 'Finance');
      expect(financeCategory).toBeDefined();
      expect(financeCategory?.label).toBe('Финансы');
    });

    it('includes multi-word categories', () => {
      const categories = getAllCategoriesWithTranslations();

      const found = categories.find((c) => c.value === 'Health & Beauty');
      expect(found).toBeDefined();
      expect(found?.label).toBe('Здоровье и красота');
    });
  });
});
