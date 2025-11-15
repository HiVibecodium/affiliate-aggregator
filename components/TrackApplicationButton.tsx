'use client';

import { useState } from 'react';

interface TrackApplicationButtonProps {
  programId: string;
  programName: string;
  onSuccess?: () => void;
}

export function TrackApplicationButton({
  programId,
  programName,
  onSuccess,
}: TrackApplicationButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId,
          notes: notes.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to track application');
      }

      setIsOpen(false);
      setNotes('');
      if (onSuccess) onSuccess();

      // Show success message
      alert('Заявка добавлена в отслеживание! Проверьте раздел "Мои заявки"');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to track');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        📋 Отследить заявку
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg border-2 border-orange-500 p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-gray-900">Отследить заявку</h4>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700">
          ✕
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Добавьте заявку на <strong>{programName}</strong> в отслеживание
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Заметки (опционально)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Дата подачи, детали, контакт и т.д."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 disabled:bg-gray-300 transition"
          >
            {loading ? 'Добавление...' : 'Добавить'}
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Отмена
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Вы сможете обновить статус и добавить детали в разделе &quot;Мои заявки&quot;
        </p>
      </form>
    </div>
  );
}
