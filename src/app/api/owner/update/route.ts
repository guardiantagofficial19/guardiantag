import { NextResponse } from 'next/server';
import { updateOwnerDetails, getTagByQrId } from '@/lib/tagService';

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

    const updateRes = updateOwnerDetails(
      cleanId,
      {
        ownerName: ownerName.trim(),
        ownerPhone: ownerPhone.trim(),
        emergencyName: emergencyName.trim(),
        emergencyPhone: emergencyPhone.trim(),
        vehicleNo: vehicleNo?.trim() || undefined,
        bloodGroup: bloodGroup?.trim() || undefined,
        medicalNotes: medicalNotes?.trim() || undefined,
        status: status === 'deactivated' || status === 'activated' ? status : undefined,
      },
      newPin
    );

    if (!updateRes.success) {
      return NextResponse.json(
        { success: false, error: updateRes.error || 'Failed to update tag details.' },
        { status: 400 }
      );
    }

    const updatedTag = getTagByQrId(cleanId);

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
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process update request.' },
      { status: 500 }
    );
  }
}
