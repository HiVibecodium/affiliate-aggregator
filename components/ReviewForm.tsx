'use client';

import { useState } from 'react';

interface ReviewFormProps {
  programId: string;
  programName: string;
  onSuccess?: () => void;
}

export function ReviewForm({ programId, programName, onSuccess }: ReviewFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pros, setPros] = useState(['']);
  const [cons, setCons] = useState(['']);
  const [experience, setExperience] = useState('');
  const [monthsUsed, setMonthsUsed] = useState('');
  const [earningsRange, setEarningsRange] = useState('');
  const [trafficSource, setTrafficSource] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/reviews/${programId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          title,
          content,
          pros: pros.filter((p) => p.trim()),
          cons: cons.filter((c) => c.trim()),
          experience: experience || undefined,
          monthsUsed: monthsUsed ? parseInt(monthsUsed) : undefined,
          earningsRange: earningsRange || undefined,
          trafficSource: trafficSource || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit review');
      }

      // Success!
      setIsOpen(false);
      onSuccess?.();
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setRating(0);
    setTitle('');
    setContent('');
    setPros(['']);
    setCons(['']);
    setExperience('');
    setMonthsUsed('');
    setEarningsRange('');
    setTrafficSource('');
  };

  const addPro = () => setPros([...pros, '']);
  const removePro = (index: number) => setPros(pros.filter((_, i) => i !== index));
  const updatePro = (index: number, value: string) => {
    const updated = [...pros];
    updated[index] = value;
    setPros(updated);
  };

  const addCon = () => setCons([...cons, '']);
  const removeCon = (index: number) => setCons(cons.filter((_, i) => i !== index));
  const updateCon = (index: number, value: string) => {
    const updated = [...cons];
    updated[index] = value;
    setCons(updated);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        ✍️ Написать отзыв
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Отзыв о {programName}</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Оценка <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="text-3xl transition-transform hover:scale-110"
              >
                <span
                  className={
                    star <= (hoveredRating || rating) ? 'text-yellow-400' : 'text-gray-300'
                  }
                >
                  ⭐
                </span>
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-gray-600 self-center">
                {rating === 5 && 'Отлично!'}
                {rating === 4 && 'Хорошо'}
                {rating === 3 && 'Нормально'}
                {rating === 2 && 'Плохо'}
                {rating === 1 && 'Ужасно'}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Заголовок <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Краткое резюме вашего опыта..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={5}
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Подробный отзыв <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Расскажите о вашем опыте работы с этой программой..."
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            minLength={20}
          />
          <p className="text-xs text-gray-500 mt-1">{content.length} / 20 минимум</p>
        </div>

        {/* Pros */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            👍 Плюсы (опционально)
          </label>
          {pros.map((pro, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={pro}
                onChange={(e) => updatePro(index, e.target.value)}
                placeholder="Что вам понравилось?"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {pros.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePro(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addPro}
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            + Добавить плюс
          </button>
        </div>

        {/* Cons */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            👎 Минусы (опционально)
          </label>
          {cons.map((con, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={con}
                onChange={(e) => updateCon(index, e.target.value)}
                placeholder="Что можно улучшить?"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              {cons.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCon(index)}
                  className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addCon}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            + Добавить минус
          </button>
        </div>

        {/* Optional metadata */}
        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ваш опыт</label>
            <select
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Не указывать</option>
              <option value="beginner">Начинающий</option>
              <option value="intermediate">Средний уровень</option>
              <option value="advanced">Продвинутый</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Сколько месяцев используете?
            </label>
            <input
              type="number"
              value={monthsUsed}
              onChange={(e) => setMonthsUsed(e.target.value)}
              placeholder="Например: 6"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Доход (опционально)
            </label>
            <select
              value={earningsRange}
              onChange={(e) => setEarningsRange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Не указывать</option>
              <option value="$0-100/mo">$0-100/месяц</option>
              <option value="$100-500/mo">$100-500/месяц</option>
              <option value="$500-1000/mo">$500-1,000/месяц</option>
              <option value="$1000-5000/mo">$1,000-5,000/месяц</option>
              <option value="$5000+/mo">$5,000+/месяц</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Источник трафика</label>
            <select
              value={trafficSource}
              onChange={(e) => setTrafficSource(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Не указывать</option>
              <option value="blog">Блог/Сайт</option>
              <option value="youtube">YouTube</option>
              <option value="social">Соцсети</option>
              <option value="email">Email рассылка</option>
              <option value="paid">Платная реклама</option>
              <option value="other">Другое</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading || !rating || !title || !content}
            className="flex-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {loading ? 'Отправка...' : 'Опубликовать отзыв'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            Отмена
          </button>
        </div>

        <p className="text-xs text-gray-500">
          * Отзыв будет опубликован после отправки. Пожалуйста, будьте честны и конструктивны.
        </p>
      </form>
    </div>
  );
}
