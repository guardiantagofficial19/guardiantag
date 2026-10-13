import { NextResponse } from 'next/server';
import { registerTagServer } from '@/lib/tagService';

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

    const result = await registerTagServer({
      qrId,
      pin,
      ownerName,
      ownerPhone,
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

    return NextResponse.json({
      success: true,
      qrId,
      activatedAt: result.activatedAt,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal registration error.' },
      { status: 500 }
    );
  }
}
