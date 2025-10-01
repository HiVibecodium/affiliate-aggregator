import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function DashboardPage() {
  const networks = await prisma.affiliateNetwork.findMany({
    include: {
      programs: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  await prisma.$disconnect()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Affiliate Networks Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and track global affiliate programs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Networks</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {networks.length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Total Programs</h3>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {networks.reduce((acc, n) => acc + n.programs.length, 0)}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Active Networks</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              {networks.filter(n => n.active).length}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {networks.map((network) => (
            <div key={network.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {network.name}
                    </h2>
                    <p className="text-gray-600 text-sm mt-1">
                      {network.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      network.active
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {network.active ? 'Active' : 'Inactive'}
                    </span>
                    {network.country && (
                      <p className="text-sm text-gray-500 mt-2">
                        📍 {network.country}
                      </p>
                    )}
                  </div>
                </div>

                {network.website && (
                  <a
                    href={network.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    {network.website}
                  </a>
                )}

                {network.programs.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-700 mb-3">
                      Programs ({network.programs.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {network.programs.map((program) => (
                        <div
                          key={program.id}
                          className="border border-gray-200 rounded p-3"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {program.name}
                              </h4>
                              <p className="text-xs text-gray-500 mt-1">
                                {program.category}
                              </p>
                            </div>
                            <span className="text-sm font-semibold text-green-600">
                              {program.commissionRate}%
                            </span>
                          </div>
                          <div className="mt-2 flex gap-2 text-xs text-gray-600">
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              {program.commissionType}
                            </span>
                            <span className="bg-gray-100 px-2 py-1 rounded">
                              {program.cookieDuration}d cookie
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {networks.length === 0 && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">
                No affiliate networks found
              </p>
              <p className="text-sm text-gray-400">
                Use the seed API to populate with sample data
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
