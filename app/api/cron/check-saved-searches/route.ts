import { logger } from '@/lib/logger';

/**
 * Cron Job: Check Saved Searches
 *
 * Runs daily to check for new programs matching saved searches
 * Sends email alerts to users
 */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email/resend-client';
import { generateNewMatchesEmail } from '@/lib/email/templates/new-matches-alert';

export async function GET(request: Request) {
  try {
    // Verify cron secret (security)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logger.log('Starting saved searches check...');

    // Get all active searches with alerts enabled
    const searches = await prisma.savedSearch.findMany({
      where: {
        active: true,
        alertsEnabled: true,
      },
    });

    logger.log(`Found ${searches.length} searches to check`);

    let emailsSent = 0;
    let totalMatches = 0;

    for (const search of searches) {
      try {
        // Get user email
        const user = await prisma.user.findUnique({
          where: { id: search.userId },
          select: { email: true },
        });

        if (!user) continue;

        // Check if it's time to send alert based on frequency
        const shouldSendAlert = checkAlertFrequency(search);
        if (!shouldSendAlert) continue;

        // Find new programs since last check
        const lastCheck = search.lastCheckedAt || search.createdAt;
        const filters = search.filters as any;

        // Build query based on saved filters
        const where: any = {
          active: true,
          createdAt: { gt: new Date(lastCheck) },
        };

        if (filters.network) where.network = { name: filters.network };
        if (filters.category) where.category = filters.category;
        if (filters.commissionType) where.commissionType = filters.commissionType;

        if (filters.search) {
          where.OR = [
            { name: { contains: filters.search, mode: 'insensitive' } },
            { description: { contains: filters.search, mode: 'insensitive' } },
          ];
        }

        if (filters.minCommission) {
          where.commissionRate = { gte: parseFloat(filters.minCommission) };
        }

        // Find matching programs
        const newMatches = await prisma.affiliateProgram.findMany({
          where,
          include: {
            network: {
              select: { name: true },
            },
          },
          take: 20, // Max 20 programs per email
        });

        if (newMatches.length > 0) {
          // Generate email
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
          const unsubscribeUrl = `${appUrl}/api/saved-searches/unsubscribe?id=${search.id}`;

          const email = generateNewMatchesEmail({
            searchName: search.name,
            matches: newMatches,
            appUrl,
            unsubscribeUrl,
          });

          // Send email
          const result = await sendEmail({
            to: user.email,
            subject: email.subject,
            html: email.html,
          });

          if (result.success) {
            emailsSent++;
            totalMatches += newMatches.length;

            // Update search
            await prisma.savedSearch.update({
              where: { id: search.id },
              data: {
                lastAlertSent: new Date(),
                lastCheckedAt: new Date(),
                newMatchesCount: newMatches.length,
              },
            });

            logger.log(`Sent alert for "${search.name}" - ${newMatches.length} matches`);
          }
        } else {
          // No new matches, just update lastCheckedAt
          await prisma.savedSearch.update({
            where: { id: search.id },
            data: {
              lastCheckedAt: new Date(),
              newMatchesCount: 0,
            },
          });
        }
      } catch (error) {
        logger.error(`Error processing search ${search.id}:`, error);
      }
    }

    logger.log(`Cron complete: ${emailsSent} emails sent, ${totalMatches} total matches`);

    return NextResponse.json({
      success: true,
      searchesChecked: searches.length,
      emailsSent,
      totalMatches,
    });
  } catch (error: any) {
    logger.error('Cron job error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * Check if alert should be sent based on frequency
 */
function checkAlertFrequency(search: any): boolean {
  if (!search.lastAlertSent) return true; // Never sent before

  const hoursSinceLastAlert =
    (Date.now() - new Date(search.lastAlertSent).getTime()) / (1000 * 60 * 60);

  switch (search.alertFrequency) {
    case 'instant':
      return hoursSinceLastAlert >= 1; // At least 1 hour
    case 'daily':
      return hoursSinceLastAlert >= 24;
    case 'weekly':
      return hoursSinceLastAlert >= 168; // 7 days
    default:
      return hoursSinceLastAlert >= 24;
  }
}

/**
 * Manual trigger endpoint for testing
 */
export async function POST(request: Request) {
  // Same as GET but can be triggered manually for testing
  return GET(request);
}
