/**
 * Google Search Console Verification File
 * Route handler to serve verification content
 */

import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('google-site-verification: google9ee8e3822b3beb94.html', {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
