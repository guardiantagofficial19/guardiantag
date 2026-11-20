import { NextResponse } from 'next/server';
import { validateQrIdServer } from '@/lib/tagService';

export async function POST(request: Request) {
  try {
    const { qrId } = await request.json();
    if (!qrId) {
      return NextResponse.json({ valid: false, error: 'QR Tag ID is required.' }, { status: 400 });
    }

    const result = await validateQrIdServer(qrId);
    if (!result.success) {
      return NextResponse.json(
        {
          valid: false,
          isAlreadyRegistered: Boolean(result.isAlreadyRegistered),
          qrId: typeof qrId === 'string' ? qrId.trim().toUpperCase() : undefined,
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
  } catch {
    return NextResponse.json({ valid: false, error: 'Internal server validation error.' }, { status: 500 });
  }
}
