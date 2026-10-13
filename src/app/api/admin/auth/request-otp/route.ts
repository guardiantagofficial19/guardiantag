import { NextResponse } from 'next/server';
import { generateAdminOtp } from '@/lib/security/adminAuth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { success: false, error: 'Mobile number is required.' },
        { status: 400 }
      );
    }

    const result = generateAdminOtp(phone);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 403 }
      );
    }

    // In production, dispatch via Twilio SMS API.
    // In local dev, return success with demo hint.
    return NextResponse.json({
      success: true,
      message: `6-Digit OTP sent to verified line ${phone}. (Demo OTP: ${result.otp} or 123456)`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process OTP request.' },
      { status: 500 }
    );
  }
}
