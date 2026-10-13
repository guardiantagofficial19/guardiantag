import { NextResponse } from 'next/server';
import { triggerEmergencySmsServer } from '@/lib/twilioService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { qrId, location } = body;
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

    if (!qrId) {
      return NextResponse.json(
        { success: false, error: 'QR Tag ID is required.' },
        { status: 400 }
      );
    }

    const result = await triggerEmergencySmsServer(qrId, location, ip);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to dispatch emergency SMS alert.' },
      { status: 500 }
    );
  }
}
