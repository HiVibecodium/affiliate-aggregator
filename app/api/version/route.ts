import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    version: '2.0.0',
    build: 'dashboard-improvements',
    commit: process.env.VERCEL_GIT_COMMIT_SHA || 'local',
    timestamp: new Date().toISOString(),
    features: {
      interactiveDashboard: true,
      quickActions: true,
      webVitals: true,
      performanceOptimization: true,
      testCoverage: '18.03%',
    },
  });
}
