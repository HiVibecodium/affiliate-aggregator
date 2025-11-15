'use client';

interface CountryFilter {
  value: string;
  code: string;
  name: string;
  flag: string;
  region: string;
  count: number;
}

interface Filters {
  categories: { value: string; count: number }[];
  commissionTypes: { value: string; count: number }[];
  countries: CountryFilter[];
  commissionRange: { min: number; max: number };
}

interface Stats {
  totalPrograms: number;
  totalNetworks: number;
  networks: { name: string; programs: number }[];
}

interface ProgramFiltersProps {
  stats: Stats | null;
  filters: Filters | null;
  search: string;
  selectedNetwork: string;
  selectedCategory: string;
  selectedCommissionType: string;
  selectedCountry: string;
  minCommission: string;
  maxCommission: string;
  onSearchChange: (value: string) => void;
  onNetworkChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onCommissionTypeChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onMinCommissionChange: (value: string) => void;
  onMaxCommissionChange: (value: string) => void;
  onReset: () => void;
}

export function ProgramFilters({
  stats,
  filters,
  search,
  selectedNetwork,
  selectedCategory,
  selectedCommissionType,
  selectedCountry,
  minCommission,
  maxCommission,
  onSearchChange,
  onNetworkChange,
  onCategoryChange,
  onCommissionTypeChange,
  onCountryChange,
  onMinCommissionChange,
  onMaxCommissionChange,
  onReset,
}: ProgramFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Фильтры</h3>
        <button onClick={onReset} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Сбросить
        </button>
      </div>

      <div className="space-y-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Поиск</label>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Название программы..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Network filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Сеть</label>
          <select
            value={selectedNetwork}
            onChange={(e) => onNetworkChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Все сети</option>
            {stats?.networks.map((network) => (
              <option key={network.name} value={network.name}>
                {network.name} ({network.programs.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        {/* Category filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Категория</label>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Все категории</option>
            {filters?.categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.value} ({cat.count.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        {/* Commission type filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Тип комиссии</label>
          <select
            value={selectedCommissionType}
            onChange={(e) => onCommissionTypeChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Все типы</option>
            {filters?.commissionTypes.map((ct) => (
              <option key={ct.value} value={ct.value}>
                {ct.value} ({ct.count.toLocaleString()})
              </option>
            ))}
          </select>
        </div>

        {/* Country filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🌍 Страна сети
            <span className="text-xs text-gray-500 font-normal ml-2">
              (по местонахождению партнерской сети)
            </span>
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => onCountryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Все страны</option>
            {filters?.countries.map((country) => (
              <option key={country.value} value={country.value}>
                {country.flag} {country.name} ({country.count}{' '}
                {country.count === 1 ? 'сеть' : 'сетей'})
              </option>
            ))}
          </select>
          {selectedCountry && filters?.countries && (
            <p className="text-xs text-gray-500 mt-1">
              {filters.countries.find((c) => c.value === selectedCountry)?.region}
            </p>
          )}
        </div>

        {/* Commission range */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Диапазон комиссии (%)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={minCommission}
              onChange={(e) => onMinCommissionChange(e.target.value)}
              placeholder="От"
              min={0}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={maxCommission}
              onChange={(e) => onMaxCommissionChange(e.target.value)}
              placeholder="До"
              max={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {filters && (
            <p className="text-xs text-gray-500 mt-1">
              Доступно: {filters.commissionRange.min}% - {filters.commissionRange.max}%
            </p>
          )}
        </div>

        {/* Quick stats */}
        <div className="border-t pt-4">
          <h4 className="font-semibold text-sm text-gray-700 mb-3">Статистика</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Всего программ:</span>
              <span className="font-semibold">{stats?.totalPrograms.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Сетей:</span>
              <span className="font-semibold">{stats?.totalNetworks}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
