import { NextResponse } from 'next/server';
import { getTagRecord, isOwnedStatus, normalizeTagId } from '@/lib/tagService';
import { verifyPin } from '@/lib/security/pinHash';
import { checkLockoutStatus, recordFailedAttempt, resetAttempts } from '@/lib/security/rateLimit';
import { verifyOtp } from '@/lib/security/otpStore';
import { createOwnerToken, OWNER_COOKIE } from '@/lib/security/ownerAuth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin, loginType, otp } = body;

    const cleanId = normalizeTagId(body?.qrId);
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';

    if (!cleanId) {
      return NextResponse.json({ success: false, error: 'A valid QR Tag ID is required.' }, { status: 400 });
    }

    // 1. Lockout check
    const lockout = await checkLockoutStatus(cleanId, ip);
    if (lockout.isLocked) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed attempts. Account temporarily locked for ${lockout.remainingMinutes} minute(s).`,
          isLocked: true,
          remainingMinutes: lockout.remainingMinutes,
        },
        { status: 429 }
      );
    }

    const genericAuthError = async (customMsg?: string) => {
      const updatedLock = await recordFailedAttempt(cleanId, ip);
      if (updatedLock.isLocked) {
        return NextResponse.json(
          {
            success: false,
            error: 'Too many failed attempts. Account temporarily locked for 5 minutes.',
            isLocked: true,
            remainingMinutes: 5,
          },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { success: false, error: customMsg || 'Invalid QR ID, PIN, or OTP code.' },
        { status: 401 }
      );
    };

    // 2. Look the tag up in the database (never an in-memory copy)
    const tag = await getTagRecord(cleanId);
    if (!tag || !isOwnedStatus(tag.status)) {
      return await genericAuthError('QR Tag ID is not registered or not activated.');
    }

    // 3. Authenticate via OTP or PIN
    if (loginType === 'otp' || otp) {
      const cleanOtp = typeof otp === 'string' ? otp.trim() : '';
      if (!cleanOtp) {
        return NextResponse.json({ success: false, error: '6-digit OTP code is required.' }, { status: 400 });
      }
      const isDevOtpEnabled = process.env.NODE_ENV !== 'production' && process.env.ENABLE_DEV_OTP === 'true';
      const ok = (isDevOtpEnabled && cleanOtp === '123456') || (await verifyOtp(`login:${cleanId}`, cleanOtp)) === 'ok';
      if (!ok) {
        return await genericAuthError('Incorrect or expired OTP code. Please request a new OTP.');
      }
    } else {
      if (typeof pin !== 'string' || !pin) {
        return NextResponse.json({ success: false, error: '4-digit Security PIN is required.' }, { status: 400 });
      }
      let pinValid = false;
      if (tag.pinHash && tag.pinSalt) {
        pinValid = verifyPin(pin, tag.pinHash, tag.pinSalt);
      } else {
        // Tags registered before PINs were saved have no hash: they must log in with an OTP.
        const isDevFallback = process.env.NODE_ENV !== 'production' && process.env.ENABLE_DEV_OTP === 'true';
        pinValid = isDevFallback && pin === '1234';
        if (!pinValid) {
          return NextResponse.json(
            { success: false, error: 'No PIN is set for this tag yet. Log in with an OTP to your registered mobile, then set a PIN.' },
            { status: 401 }
          );
        }
      }
      if (!pinValid) {
        return await genericAuthError('Invalid Security PIN.');
      }
    }

    // 4. Success
    await resetAttempts(cleanId, ip);
    const sessionToken = createOwnerToken(tag.qrId, tag.id);

    const response = NextResponse.json({
      success: true,
      owner: {
        qrId: tag.qrId,
        tagType: tag.tagType,
        ownerName: tag.ownerName,
        ownerPhone: tag.ownerPhone,
        emergencyName: tag.emergencyName,
        emergencyPhone: tag.emergencyPhone,
        vehicleNo: tag.vehicleNo,
        bloodGroup: tag.bloodGroup,
        medicalNotes: tag.medicalNotes,
        activatedAt: tag.activatedAt,
        status: tag.status,
      },
    });

    response.cookies.set(OWNER_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400,
      path: '/',
    });

    return response;
  } catch {
    return NextResponse.json({ success: false, error: 'Authentication processing failed.' }, { status: 500 });
  }
}
