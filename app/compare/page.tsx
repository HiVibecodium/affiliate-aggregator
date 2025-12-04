'use client';

import { useComparison } from '@/contexts/ComparisonContext';
import Link from 'next/link';

export default function ComparePage() {
  const { comparisonList, removeFromComparison, clearComparison } = useComparison();

  if (comparisonList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <svg
            className="w-24 h-24 mx-auto text-gray-400 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Нет программ для сравнения</h1>
          <p className="text-gray-600 mb-6">
            Добавьте программы для сравнения на странице каталога
          </p>
          <Link
            href="/programs"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Перейти к программам
          </Link>
        </div>
      </div>
    );
  }

  const comparisonFields = [
    { key: 'name', label: 'Название' },
    { key: 'network', label: 'Сеть' },
    { key: 'category', label: 'Категория' },
    { key: 'commissionRate', label: 'Комиссия' },
    { key: 'commissionType', label: 'Тип комиссии' },
    { key: 'cookieDuration', label: 'Cookie (дней)' },
    { key: 'paymentThreshold', label: 'Мин. выплата' },
    { key: 'paymentMethods', label: 'Способы оплаты' },
    { key: 'description', label: 'Описание' },
  ];

  const exportToCSV = () => {
    const headers = comparisonFields.map((f) => f.label);
    const rows = comparisonList.map((program) =>
      comparisonFields.map((field) => {
        if (field.key === 'network') return program.network.name;
        if (field.key === 'paymentMethods') return program.paymentMethods?.join(', ') || 'N/A';
        if (field.key === 'commissionRate') return `${program.commissionRate}%`;
        if (field.key === 'paymentThreshold') return `$${program.paymentThreshold}`;
        const key = field.key as keyof typeof program;
        return String(program[key] || 'N/A');
      })
    );

    const csv = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comparison-${Date.now()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <Link
                href="/programs"
                className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block"
              >
                ← Назад к программам
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Сравнение программ</h1>
              <p className="text-gray-600 mt-1">Выбрано программ: {comparisonList.length}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
              >
                Экспорт CSV
              </button>
              <button
                onClick={clearComparison}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Очистить все
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-4 py-3 text-left font-semibold text-gray-700 sticky left-0 bg-gray-50 z-10">
                  Параметр
                </th>
                {comparisonList.map((program) => (
                  <th key={program.id} className="px-4 py-3 text-left min-w-[250px]">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-semibold text-gray-900">{program.name}</span>
                      <button
                        onClick={() => removeFromComparison(program.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                        title="Удалить"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFields.map((field, index) => (
                <tr key={field.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-semibold text-gray-700 border-r sticky left-0 z-10 bg-inherit">
                    {field.label}
                  </td>
                  {comparisonList.map((program) => {
                    let value: React.ReactNode;

                    if (field.key === 'network') {
                      value = (
                        <div>
                          <div className="font-medium">{program.network.name}</div>
                          <a
                            href={program.network.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:underline"
                          >
                            {program.network.website}
                          </a>
                        </div>
                      );
                    } else if (field.key === 'paymentMethods') {
                      value = (
                        <div className="flex flex-wrap gap-1">
                          {program.paymentMethods?.map((method, i) => (
                            <span key={i} className="text-xs bg-gray-200 px-2 py-1 rounded">
                              {method}
                            </span>
                          )) || 'N/A'}
                        </div>
                      );
                    } else if (field.key === 'commissionRate') {
                      value = (
                        <span className="font-semibold text-green-600">
                          {program.commissionRate}%
                        </span>
                      );
                    } else if (field.key === 'paymentThreshold') {
                      value = <span className="font-semibold">${program.paymentThreshold}</span>;
                    } else if (field.key === 'cookieDuration') {
                      value = <span>{program.cookieDuration} дней</span>;
                    } else if (field.key === 'category') {
                      value = (
                        <span className="inline-block bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">
                          {program.category}
                        </span>
                      );
                    } else if (field.key === 'description') {
                      value = <p className="text-sm text-gray-600">{program.description}</p>;
                    } else {
                      const key = field.key as keyof typeof program;
                      const rawValue = program[key];
                      value =
                        rawValue !== null && rawValue !== undefined ? String(rawValue) : 'N/A';
                    }

                    return (
                      <td key={program.id} className="px-4 py-3 text-gray-900">
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-2">Подсказки:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Вы можете добавить до 5 программ для сравнения</li>
            <li>• Используйте &quot;Экспорт CSV&quot; чтобы сохранить таблицу</li>
            <li>• Нажмите на × чтобы удалить программу из сравнения</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
