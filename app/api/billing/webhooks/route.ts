/**
 * POST /api/billing/webhooks
 *
 * Stripe webhook endpoint
 * Receives and processes Stripe events
 */

import { NextResponse } from 'next/server'
import { stripe, webhookSecret } from '@/lib/billing/stripe'
import { handleWebhookEvent } from '@/lib/billing/webhooks'

/**
 * Handle Stripe webhook events
 *
 * IMPORTANT: This route must use raw body, not parsed JSON
 * Next.js 13+ App Router handles this automatically
 */
export async function POST(request: Request) {
  try {
    // Get raw body
    const body = await request.text()

    // Get Stripe signature from headers
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      console.error('Missing stripe-signature header')
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET not configured')
      return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
    }

    // Verify webhook signature
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
    }

    // Log webhook event
    console.log(`Webhook received: ${event.type} (${event.id})`)

    // Handle the event
    try {
      await handleWebhookEvent(event)
    } catch (err: any) {
      console.error(`Error processing webhook ${event.type}:`, err)
      // Return 200 to acknowledge receipt, but log the error
      // This prevents Stripe from retrying if it's a processing error
      return NextResponse.json({ error: err.message, received: true }, { status: 200 })
    }

    // Return success
    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: error.message || 'Webhook handler failed' }, { status: 500 })
  }
}

/**
 * GET endpoint for webhook verification
 * Stripe may send GET requests to verify the endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Stripe webhook endpoint is ready',
  })
}
