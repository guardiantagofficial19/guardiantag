import { NextResponse } from 'next/server';
import { verifyOtp } from '@/lib/security/otpStore';
import { toIndianMobile } from '@/lib/phone';

/** Verifies a registration code sent to a new owner mobile number. */
export async function POST(request: Request) {
  try {
    const { phone, otp } = await request.json();
    const cleanPhone = toIndianMobile(phone);
    if (!cleanPhone || !otp) {
      return NextResponse.json(
        { success: false, error: 'Mobile number and 6-digit OTP code are required.' },
        { status: 400 }
      );
    }

    const isDevOtpEnabled = process.env.NODE_ENV !== 'production' && process.env.ENABLE_DEV_OTP === 'true';
    if (isDevOtpEnabled && String(otp).trim() === '123456') {
      return NextResponse.json({ success: true, message: 'OTP verified successfully (Dev mode).' });
    }

    const result = await verifyOtp(`reg:${cleanPhone}`, otp);
    if (result === 'ok') {
      return NextResponse.json({ success: true, message: 'Mobile number verified.' });
    }
    const error =
      result === 'expired' ? 'OTP code has expired. Please request a new OTP.'
      : result === 'missing' ? 'No active code for this number. Please request a new OTP.'
      : 'Incorrect OTP code. Please check your SMS and try again.';
    return NextResponse.json({ success: false, error }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to verify OTP.' }, { status: 500 });
  }
}
