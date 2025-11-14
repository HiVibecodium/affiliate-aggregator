import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // Use edge runtime for better performance

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log web vitals (in production, you'd send to your analytics service)
    console.log('[Web Vitals]', {
      name: body.name,
      value: body.value,
      rating: body.rating,
      timestamp: new Date().toISOString(),
    });

    // TODO: Send to your analytics service (e.g., Google Analytics, Vercel Analytics)
    // Example for Google Analytics 4:
    // await fetch('https://www.google-analytics.com/mp/collect', {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     client_id: 'your-client-id',
    //     events: [{
    //       name: 'web_vitals',
    //       params: {
    //         metric_name: body.name,
    //         metric_value: body.value,
    //         metric_rating: body.rating,
    //       },
    //     }],
    //   }),
    // });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Web Vitals error:', error);
    return NextResponse.json({ error: 'Failed to record web vitals' }, { status: 500 });
  }
}
