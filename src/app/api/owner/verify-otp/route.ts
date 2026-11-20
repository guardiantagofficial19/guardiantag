import { errorMessage } from '@/lib/errors';
import { NextResponse } from 'next/server';
import { getOwnerOtpStore } from '../send-otp/route';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: 'Mobile number and 6-digit OTP code are required.' },
        { status: 400 }
      );
    }

    const cleanPhone = phone.trim();
    const cleanOtp = otp.trim();

    // Universal test fallback OTP for local development only if explicitly enabled
    const isDevOtpEnabled = process.env.NODE_ENV !== 'production' && process.env.ENABLE_DEV_OTP === 'true';
    if (isDevOtpEnabled && cleanOtp === '123456') {
      return NextResponse.json({ success: true, message: 'OTP verified successfully (Dev mode).' });
    }

    const store = getOwnerOtpStore();
    const record = store.get(cleanPhone);

    if (!record) {
      return NextResponse.json(
        { success: false, error: 'No active OTP requested for this mobile number. Please click Resend OTP.' },
        { status: 400 }
      );
    }

    if (Date.now() > record.expiresAt) {
      store.delete(cleanPhone);
      return NextResponse.json(
        { success: false, error: 'OTP code has expired. Please request a new OTP.' },
        { status: 400 }
      );
    }

    if (record.otp !== cleanOtp) {
      return NextResponse.json(
        { success: false, error: 'Incorrect OTP code. Please check your SMS and try again.' },
        { status: 400 }
      );
    }

    // OTP Verified — consume OTP
    store.delete(cleanPhone);

    return NextResponse.json({
      success: true,
      message: 'Owner mobile number verified successfully via Twilio OTP.',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: errorMessage(error) || 'Failed to verify Twilio OTP.' },
      { status: 500 }
    );
  }
}
