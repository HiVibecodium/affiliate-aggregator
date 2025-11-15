'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

interface CategoryData {
  category: string
  count: number
}

interface CategoryChartProps {
  data: CategoryData[]
}

const COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#6366f1', // indigo
  '#84cc16', // lime
  '#f97316', // orange
]

export function CategoryChart({ data }: CategoryChartProps) {
  const chartData = data.slice(0, 10).map(item => ({
    ...item,
    value: item.count // Add value for recharts
  }))

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🏷️ Топ Категории Программ
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4">
        <div className="grid grid-cols-2 gap-2 text-sm">
          {chartData.slice(0, 6).map((item, index) => (
            <div key={item.category} className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-gray-700">
                {item.category}: {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
