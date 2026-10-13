import { NextResponse } from 'next/server';
import { validateQrIdServer, getTagByQrId } from '@/lib/tagService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { qrId } = body;

    if (!qrId) {
      return NextResponse.json({ valid: false, error: 'QR Tag ID is required.' }, { status: 400 });
    }

    const cleanId = qrId.trim().toUpperCase();
    const existingTag = getTagByQrId(cleanId);

    if (existingTag && (existingTag.status === 'activated' || existingTag.status === 'active')) {
      return NextResponse.json(
        {
          valid: false,
          isAlreadyRegistered: true,
          qrId: cleanId,
          tagType: existingTag.tagType,
          error: `Tag ID ${cleanId} is ALREADY REGISTERED to an active owner.`,
        },
        { status: 400 }
      );
    }

    const result = await validateQrIdServer(cleanId);

    if (!result.success) {
      const isAlready = result.error?.toLowerCase().includes('already registered') || false;
      return NextResponse.json(
        {
          valid: false,
          isAlreadyRegistered: isAlready,
          qrId: cleanId,
          error: result.error,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      qrId: result.tag?.qrId,
      tagType: result.tag?.tagType,
    });
  } catch (error: any) {
    return NextResponse.json(
      { valid: false, error: 'Internal server validation error.' },
      { status: 500 }
    );
  }
}
