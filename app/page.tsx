export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">
          🌐 Affiliate Aggregator
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Global Affiliate Networks Tracking & Management System
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl">
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">🌍</h2>
            <h3 className="font-semibold mb-2">Global Coverage</h3>
            <p className="text-sm text-gray-600">
              Track affiliate programs worldwide
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">📊</h2>
            <h3 className="font-semibold mb-2">Analytics</h3>
            <p className="text-sm text-gray-600">
              Real-time performance monitoring
            </p>
          </div>
          <div className="p-6 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">🤖</h2>
            <h3 className="font-semibold mb-2">AI-Powered</h3>
            <p className="text-sm text-gray-600">
              Claude Code integration
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
