import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { code, totalPaise = 0 } = await request.json();
    const cleanCode = String(code || '').trim().toUpperCase();

    if (!cleanCode) {
      return NextResponse.json({ success: false, error: 'Please enter a discount code' }, { status: 400 });
    }

    const rows = await sql`
      SELECT id, code, discount_type, value, min_spend_paise, usage_count, max_uses, active, expires_at
      FROM store_discounts
      WHERE UPPER(code) = ${cleanCode}
      LIMIT 1
    `;

    if (rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid discount code' }, { status: 404 });
    }

    const discount = rows[0];

    if (!discount.active) {
      return NextResponse.json({ success: false, error: 'This discount code is no longer active' }, { status: 400 });
    }

    if (discount.expires_at && new Date(discount.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ success: false, error: 'This coupon code has expired' }, { status: 400 });
    }

    if (discount.max_uses && discount.usage_count >= discount.max_uses) {
      return NextResponse.json({ success: false, error: 'This coupon has reached its maximum usage limit' }, { status: 400 });
    }

    if (totalPaise > 0 && discount.min_spend_paise > 0 && totalPaise < discount.min_spend_paise) {
      const minSpendRs = Math.round(discount.min_spend_paise / 100);
      return NextResponse.json({
        success: false,
        error: `Minimum order amount of ₹${minSpendRs} required for this coupon`,
      }, { status: 400 });
    }

    let discountAmountPaise = 0;
    if (discount.discount_type === 'percentage') {
      discountAmountPaise = Math.round((totalPaise * discount.value) / 100);
    } else if (discount.discount_type === 'fixed_amount') {
      discountAmountPaise = Math.min(totalPaise, discount.value);
    } else if (discount.discount_type === 'free_shipping') {
      discountAmountPaise = 0; // free shipping already 0
    }

    return NextResponse.json({
      success: true,
      discount: {
        code: discount.code,
        discountType: discount.discount_type,
        value: discount.value,
        discountAmountPaise,
        discountAmountRs: Math.round(discountAmountPaise / 100),
      },
    });
  } catch (error) {
    console.error('Failed to validate discount:', error);
    return NextResponse.json({ success: false, error: 'Failed to apply coupon' }, { status: 500 });
  }
}
