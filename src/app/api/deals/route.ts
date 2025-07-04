import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const result = await query('SELECT * FROM deals ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch deals' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // Await params for Next.js 15
    const dealId = parseInt(id);
    const { name, property_type, address, status } = await request.json();
    
    const result = await query(
      'UPDATE deals SET name = $1, property_type = $2, address = $3, status = $4, updated_at = NOW() WHERE id = $5 RETURNING *',
      [name, property_type, address, status, dealId]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to update deal' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, property_type, address } = await request.json();
    
    const result = await query(
      'INSERT INTO deals (name, property_type, address) VALUES ($1, $2, $3) RETURNING *',
      [name, property_type, address]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create deal' }, { status: 500 });
  }
}
