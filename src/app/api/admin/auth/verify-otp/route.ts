import { NextResponse } from 'next/server';
import { verifyAdminOtp } from '@/lib/security/adminAuth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: 'Mobile number and 6-digit OTP are required.' },
        { status: 400 }
      );
    }

    const isValid = verifyAdminOtp(phone, otp);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired 6-digit OTP code.' },
        { status: 401 }
      );
    }

    // Generate secure Admin Session Token Cookie
    const sessionToken = Buffer.from(JSON.stringify({
      role: 'admin',
      phone,
      exp: Date.now() + 12 * 60 * 60 * 1000, // 12 hours
    })).toString('base64');

    const response = NextResponse.json({
      success: true,
      message: 'Admin mobile line verified successfully.',
    });

    response.cookies.set('gt_admin_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 43200, // 12 hours
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to verify OTP code.' },
      { status: 500 }
    );
  }
}
