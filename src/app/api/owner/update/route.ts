import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { updateOwnerDetails } from '@/lib/tagService';
import { OWNER_COOKIE, verifyOwnerToken } from '@/lib/security/ownerAuth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      qrId,
      ownerName,
      ownerPhone,
      emergencyName,
      emergencyPhone,
      vehicleNo,
      bloodGroup,
      medicalNotes,
      newPin,
      status,
    } = body;

    const cleanId = qrId?.trim()?.toUpperCase();
    if (!cleanId) {
      return NextResponse.json(
        { success: false, error: 'QR ID is required.' },
        { status: 400 }
      );
    }

    // STRICT AUTHENTICATION: Require valid HMAC-signed owner session matching this QR ID
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(OWNER_COOKIE)?.value;
    const session = verifyOwnerToken(sessionCookie, cleanId);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: You must be logged in as the verified owner of this tag to make changes.' },
        { status: 401 }
      );
    }

    if (!ownerName?.trim() || !ownerPhone?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Owner Name and Phone Number are required.' },
        { status: 400 }
      );
    }

    if (!emergencyName?.trim() || !emergencyPhone?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Emergency Contact Name and Phone Number are required.' },
        { status: 400 }
      );
    }

    if (newPin && (!/^\d{4}$/.test(newPin))) {
      return NextResponse.json(
        { success: false, error: 'New PIN must be exactly 4 numeric digits.' },
        { status: 400 }
      );
    }

    const updateRes = await updateOwnerDetails(
      cleanId,
      {
        ownerName,
        ownerPhone,
        emergencyName,
        emergencyPhone,
        vehicleNo,
        bloodGroup,
        medicalNotes,
        status: status === 'deactivated' || status === 'activated' ? status : undefined,
      },
      newPin || undefined
    );

    if (!updateRes.success) {
      return NextResponse.json(
        { success: false, error: updateRes.error || 'Failed to update tag details.' },
        { status: 400 }
      );
    }

    const updatedTag = updateRes.tag;

    return NextResponse.json({
      success: true,
      owner: {
        qrId: cleanId,
        ownerName: updatedTag?.ownerName,
        ownerPhone: updatedTag?.ownerPhone,
        emergencyName: updatedTag?.emergencyName,
        emergencyPhone: updatedTag?.emergencyPhone,
        vehicleNo: updatedTag?.vehicleNo,
        bloodGroup: updatedTag?.bloodGroup,
        medicalNotes: updatedTag?.medicalNotes,
        activatedAt: updatedTag?.activatedAt,
        status: updatedTag?.status,
      },
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to process update request.' },
      { status: 500 }
    );
  }
}
