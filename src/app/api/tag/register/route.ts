import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { registerTagServer } from '@/lib/tagService';
import { toIndianMobile } from '@/lib/phone';
import { PHONE_PROOF_COOKIE, verifyPhoneProof } from '@/lib/security/ownerAuth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      qrId,
      pin,
      ownerName,
      ownerPhone,
      emergencyName,
      emergencyPhone,
      vehicleNo,
      bloodGroup,
      medicalNotes,
    } = body;

    // The owner's mobile must have passed OTP verification on the server (cookie set by /api/owner/verify-otp).
    const phone = toIndianMobile(ownerPhone);
    if (!phone) {
      return NextResponse.json({ success: false, error: 'Enter a valid 10-digit Indian mobile number.' }, { status: 400 });
    }
    const cookieStore = await cookies();
    if (!verifyPhoneProof(cookieStore.get(PHONE_PROOF_COOKIE)?.value, phone)) {
      return NextResponse.json(
        { success: false, error: 'Please verify your mobile number with the OTP code first.' },
        { status: 403 }
      );
    }

    const result = await registerTagServer({
      qrId,
      pin,
      ownerName,
      ownerPhone: phone,
      emergencyName,
      emergencyPhone,
      vehicleNo,
      bloodGroup,
      medicalNotes,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }

    const response = NextResponse.json({
      success: true,
      qrId: typeof qrId === 'string' ? qrId.trim().toUpperCase() : qrId,
      activatedAt: result.activatedAt,
    });
    // One proof, one registration.
    response.cookies.set(PHONE_PROOF_COOKIE, '', { path: '/api/tag/register', maxAge: 0 });
    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}
