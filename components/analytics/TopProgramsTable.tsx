'use client'

import Link from 'next/link'

interface TopProgram {
  id: string
  name: string
  network: string
  commissionRate: number | null
  clicks: number
  reviews: number
  applications: number
}

interface TopProgramsTableProps {
  programs: TopProgram[]
}

export function TopProgramsTable({ programs }: TopProgramsTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🏆 Топ Программы По Популярности
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr className="text-left text-sm text-gray-600">
              <th className="pb-3 font-medium">#</th>
              <th className="pb-3 font-medium">Программа</th>
              <th className="pb-3 font-medium">Сеть</th>
              <th className="pb-3 font-medium">Комиссия</th>
              <th className="pb-3 font-medium text-center">👁️ Клики</th>
              <th className="pb-3 font-medium text-center">⭐ Отзывы</th>
              <th className="pb-3 font-medium text-center">📝 Заявки</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {programs.map((program, index) => (
              <tr key={program.id} className="hover:bg-gray-50">
                <td className="py-3 text-gray-500 font-medium">{index + 1}</td>
                <td className="py-3">
                  <Link
                    href={`/programs/${program.id}`}
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {program.name}
                  </Link>
                </td>
                <td className="py-3 text-gray-700 text-sm">{program.network}</td>
                <td className="py-3">
                  <span className="text-green-600 font-semibold">
                    {program.commissionRate ? `${program.commissionRate}%` : 'N/A'}
                  </span>
                </td>
                <td className="py-3 text-center text-gray-900">{program.clicks}</td>
                <td className="py-3 text-center text-gray-900">{program.reviews}</td>
                <td className="py-3 text-center text-gray-900">{program.applications}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {programs.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Недостаточно данных для отображения топ программ</p>
          <p className="text-sm mt-2">Данные появятся по мере взаимодействия пользователей</p>
        </div>
      )}
    </div>
  )
}
