import Link from 'next/link'

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mb-8">
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

        <div className="flex flex-col gap-4 items-center">
          <div className="flex gap-4">
            <Link
              href="/login"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>
          <Link
            href="/dashboard"
            className="text-blue-600 hover:underline text-sm"
          >
            Go to Dashboard
          </Link>
          <div className="flex gap-3 text-sm">
            <a
              href="/api/health"
              target="_blank"
              className="text-blue-600 hover:underline"
            >
              Health Check
            </a>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600">
              POST /api/seed to populate data
            </span>
          </div>
        </div>
      </div>
    </main>
  )
}
