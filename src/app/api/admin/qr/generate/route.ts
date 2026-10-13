import { NextResponse } from 'next/server';
import { provisionNewTags, getAllTags } from '@/lib/tagService';
import { TagType } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tagType, quantity } = body;

    const validTypes: TagType[] = ['GTB', 'GTK', 'GTT', 'GTU'];
    if (!tagType || !validTypes.includes(tagType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid tag type. Must be GTB, GTK, GTT, or GTU.' },
        { status: 400 }
      );
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1 || qty > 1000) {
      return NextResponse.json(
        { success: false, error: 'Quantity must be between 1 and 1000 tags per batch.' },
        { status: 400 }
      );
    }

    // Atomic Sequential Provisioning
    const generatedTags = provisionNewTags(tagType, qty);
    const allTags = getAllTags();

    const startQrId = generatedTags[0]?.qrId;
    const endQrId = generatedTags[generatedTags.length - 1]?.qrId;

    return NextResponse.json({
      success: true,
      batch: {
        tagType,
        quantity: generatedTags.length,
        startQrId,
        endQrId,
        createdAt: new Date().toISOString(),
      },
      tags: generatedTags,
      totalTagsCount: allTags.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to provision new QR tag batch.' },
      { status: 500 }
    );
  }
}
