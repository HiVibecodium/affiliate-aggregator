/**
 * Admin Program [id] API
 * Update individual program
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const program = await prisma.affiliateProgram.update({
      where: { id },
      data: {
        ...(body.active !== undefined && { active: body.active }),
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.category && { category: body.category }),
        ...(body.commissionRate !== undefined && { commissionRate: body.commissionRate }),
      },
    });

    return NextResponse.json({ program });
  } catch (error) {
    console.error('Admin program update error:', error);
    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.affiliateProgram.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Admin program delete error:', error);
    return NextResponse.json({ error: 'Failed to delete program' }, { status: 500 });
  }
}
