import { NextResponse } from 'next/server';
import { getTagRecord, isOwnedStatus, normalizeTagId } from '@/lib/tagService';
import { issueOtp, sendSms } from '@/lib/security/otpStore';
import { maskPhone, toE164, toIndianMobile } from '@/lib/phone';
import { isRateLimited } from '@/lib/security/rateLimit';

/**
 * Two modes:
 *  - { qrId }  -> login code, sent only to the owner phone stored for that tag.
 *  - { phone } -> registration code for a new Indian mobile number.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const ip = (request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local').slice(0, 100);
    if (await isRateLimited(`otp-ip:${ip}`, 5, 10 * 60)) {
      return NextResponse.json({ success: false, error: 'Too many code requests. Please wait 10 minutes.' }, { status: 429 });
    }

    // Older clients sent the tag ID in the `phone` field for login.
    const qrId = normalizeTagId(body?.qrId) || normalizeTagId(body?.phone);

    let key: string;
    let to: string;
    if (qrId) {
      const tag = await getTagRecord(qrId);
      const phone = tag && isOwnedStatus(tag.status) ? toE164(tag.ownerPhone) : null;
      if (!phone) {
        return NextResponse.json(
          { success: false, error: 'No registered mobile number found for this tag. Log in with your PIN instead.' },
          { status: 400 }
        );
      }
      key = `login:${qrId}`;
      to = phone;
    } else {
      const phone = toIndianMobile(body?.phone);
      if (!phone) {
        return NextResponse.json({ success: false, error: 'Enter a valid 10-digit Indian mobile number.' }, { status: 400 });
      }
      key = `reg:${phone}`;
      to = phone;
    }

    const issued = await issueOtp(key);
    if ('retryAfterSec' in issued) {
      return NextResponse.json(
        { success: false, error: `Please wait ${issued.retryAfterSec}s before requesting another code.` },
        { status: 429 }
      );
    }

    // Daily cap per destination number (blocks SMS pumping from many IPs).
    if (await isRateLimited(`otp-phone:${to}`, 5, 24 * 60 * 60)) {
      return NextResponse.json(
        { success: false, error: 'Too many codes sent to this number today. Please try again tomorrow.' },
        { status: 429 }
      );
    }

    let sent = false;
    try {
      sent = await sendSms(to, `[GuardianTag] Your verification code is ${issued.code}. Valid for 5 minutes. Do not share it.`);
    } catch {
      sent = false;
    }
    if (!sent && process.env.NODE_ENV === 'production') {
      return NextResponse.json({ success: false, error: 'Could not send the SMS right now. Please try again.' }, { status: 502 });
    }

    return NextResponse.json({ success: true, message: `6-digit code sent to ${maskPhone(to)}.` });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to send verification code.' }, { status: 500 });
  }
}
