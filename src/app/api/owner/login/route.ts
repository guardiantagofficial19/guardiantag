import { NextResponse } from 'next/server';
import { getTagByQrId } from '@/lib/tagService';
import { verifyPin } from '@/lib/security/pinHash';
import { checkLockoutStatus, recordFailedAttempt, resetAttempts } from '@/lib/security/rateLimit';
import { getOwnerOtpStore } from '../send-otp/route';
import { createOwnerToken, OWNER_COOKIE } from '@/lib/security/ownerAuth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { qrId, pin, loginType, otp } = body;

    const cleanId = qrId?.trim()?.toUpperCase();
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';

    if (!cleanId) {
      return NextResponse.json(
        { success: false, error: 'QR Tag ID is required.' },
        { status: 400 }
      );
    }

    // 1. Check Lockout Status
    const lockout = checkLockoutStatus(cleanId, ip);
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

    // 2. Lookup Tag in Server Database Registry
    const tag = getTagByQrId(cleanId);

    // Generic auth failure helper
    const genericAuthError = (customMsg?: string) => {
      const updatedLock = recordFailedAttempt(cleanId, ip);
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

    // Check if tag exists and is active
    if (!tag || (tag.status !== 'activated' && tag.status !== 'active')) {
      return genericAuthError('QR Tag ID is not registered or not activated.');
    }

    // 3. Authenticate via OTP or PIN
    if (loginType === 'otp' || otp) {
      const cleanOtp = otp?.trim();
      if (!cleanOtp) {
        return NextResponse.json(
          { success: false, error: '6-digit OTP code is required.' },
          { status: 400 }
        );
      }

      const isDevOtpEnabled = process.env.NODE_ENV !== 'production' && process.env.ENABLE_DEV_OTP === 'true';
      const isTestCode = isDevOtpEnabled && cleanOtp === '123456';

      if (!isTestCode) {
        const store = getOwnerOtpStore();
        const record = tag.ownerPhone ? store.get(tag.ownerPhone.trim()) : null;

        if (!record || Date.now() > record.expiresAt || record.otp !== cleanOtp) {
          return genericAuthError('Incorrect or expired OTP code. Please request a new OTP.');
        }

        // Consume OTP on success
        if (tag.ownerPhone) store.delete(tag.ownerPhone.trim());
      }
    } else {
      // Authenticate via PIN
      if (!pin) {
        return NextResponse.json(
          { success: false, error: '4-digit Security PIN is required.' },
          { status: 400 }
        );
      }

      let pinValid = false;
      if (tag.pinHash && tag.pinSalt) {
        pinValid = verifyPin(pin, tag.pinHash, tag.pinSalt);
      } else {
        // Only allow fallback in explicit non-production dev mode if salt/hash not yet created
        const isDevFallback = process.env.NODE_ENV !== 'production' && process.env.ENABLE_DEV_OTP === 'true';
        pinValid = isDevFallback && pin === '1234';
      }

      if (!pinValid) {
        return genericAuthError('Invalid Security PIN.');
      }
    }

    // 4. Reset Lockout Attempts on Success
    resetAttempts(cleanId, ip);

    // 5. Create Cryptographically Signed Owner Session Cookie
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
      },
    });

    response.cookies.set(OWNER_COOKIE, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Authentication processing failed.' },
      { status: 500 }
    );
  }
}
