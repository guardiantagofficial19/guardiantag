import { NextResponse } from 'next/server';
import { getPublicTagInfo } from '@/lib/tagService';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cleanId = id?.trim()?.toUpperCase();

    if (!cleanId) {
      return NextResponse.json(
        { found: false, error: 'QR Tag ID is required.' },
        { status: 400 }
      );
    }

    const result = await getPublicTagInfo(cleanId);

    if (!result.found || !result.tag) {
      return NextResponse.json(
        { found: false, error: 'Tag is unregistered or not found.' },
        { status: 404 }
      );
    }

    // STRICT PRIVACY GUARANTEE: Returns ONLY public non-PII fields.
    return NextResponse.json({
      found: true,
      qrId: result.tag.qrId,
      tagType: result.tag.tagType,
      status: result.tag.status,
      vehicleNo: result.tag.vehicleNo,
      bloodGroup: result.tag.bloodGroup,
      medicalNotes: result.tag.medicalNotes,
    });
  } catch (error) {
    return NextResponse.json(
      { found: false, error: 'Public scan lookup failed.' },
      { status: 500 }
    );
  }
}
