import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await sql`
      SELECT 
        sku, 
        name, 
        tag_type, 
        price_paise, 
        stock, 
        low_stock_at, 
        active, 
        subtitle, 
        category, 
        image_url, 
        features, 
        description, 
        rating_text, 
        created_at
      FROM store_products
      ORDER BY 
        CASE 
          WHEN tag_type = 'GTB' THEN 1
          WHEN tag_type = 'GTK' THEN 2
          WHEN tag_type = 'GTT' THEN 3
          WHEN tag_type = 'GTU' THEN 4
          ELSE 5
        END,
        created_at ASC
    `;

    const products = rows.map((r: any, idx: number) => {
      // Split features by newline if text string
      let featuresList: string[] = [];
      if (Array.isArray(r.features)) {
        featuresList = r.features;
      } else if (typeof r.features === 'string' && r.features.trim()) {
        featuresList = r.features
          .split('\n')
          .map((f: string) => f.trim())
          .filter(Boolean);
      }

      return {
        id: r.tag_type as 'GTB' | 'GTK' | 'GTT' | 'GTU',
        sku: r.sku,
        sectionNo: `S.0${idx + 1}`,
        name: r.name,
        subtitle: r.subtitle || `${r.tag_type} Safety Tag`,
        price: `₹${Math.round(r.price_paise / 100)}`,
        priceNum: Math.round(r.price_paise / 100),
        category: r.category || 'Personal Safety Hardware',
        material: 'Impact PVC + Weather Shield',
        rating: r.rating_text || '100% Waterproof & UV Weather Resistant',
        imageUrl: r.image_url || '',
        isComingSoon: !r.active,
        description: r.description || '',
        features: featuresList.length > 0 ? featuresList : ['All-weather weatherproof construction', 'Instant masked emergency call relay'],
        stock: Number(r.stock) || 0,
      };
    });

    return NextResponse.json({ success: true, products });
  } catch (error: any) {
    console.error('Failed to query store products:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Database query error' },
      { status: 500 }
    );
  }
}
