import { logger } from '@/lib/logger';
/**
 * Dynamic OG Image Generation
 * Generates Open Graph images for programs using @vercel/og
 */

import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters
    const title = searchParams.get('title') || 'Affiliate Program';
    const network = searchParams.get('network') || '';
    const commission = searchParams.get('commission') || '';
    const category = searchParams.get('category') || '';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            backgroundImage:
              'linear-gradient(to bottom right, #dbeafe 0%, #ffffff 50%, #fae8ff 100%)',
          }}
        >
          {/* Logo/Brand */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              left: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ fontSize: 40 }}>🌐</div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: '#1f2937',
              }}
            >
              Affiliate Aggregator
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '80px 60px',
              textAlign: 'center',
            }}
          >
            {/* Title */}
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: '#111827',
                maxWidth: '900px',
                lineHeight: 1.2,
                marginBottom: 30,
                display: 'flex',
                flexWrap: 'wrap',
                textAlign: 'center',
                justifyContent: 'center',
              }}
            >
              {title}
            </div>

            {/* Network */}
            {network && (
              <div
                style={{
                  fontSize: 32,
                  color: '#6b7280',
                  marginBottom: 40,
                  display: 'flex',
                }}
              >
                {network}
              </div>
            )}

            {/* Stats Row */}
            <div
              style={{
                display: 'flex',
                gap: 40,
                marginTop: 20,
              }}
            >
              {commission && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#10b981',
                    padding: '20px 40px',
                    borderRadius: 16,
                  }}
                >
                  <div style={{ fontSize: 48, fontWeight: 900, color: '#ffffff' }}>
                    {commission}
                  </div>
                  <div style={{ fontSize: 20, color: '#ffffff', marginTop: 8 }}>Commission</div>
                </div>
              )}

              {category && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#3b82f6',
                    padding: '20px 40px',
                    borderRadius: 16,
                  }}
                >
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#ffffff' }}>{category}</div>
                  <div style={{ fontSize: 16, color: '#ffffff', marginTop: 8 }}>Category</div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              display: 'flex',
              fontSize: 20,
              color: '#9ca3af',
            }}
          >
            80,000+ Affiliate Programs | Search, Compare, Analytics
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    logger.error('OG Image generation error:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
