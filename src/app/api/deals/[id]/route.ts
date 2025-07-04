import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET single deal
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dealId = parseInt(id);
    
    const result = await query('SELECT * FROM deals WHERE id = $1', [dealId]);
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch deal' }, { status: 500 });
  }
}

// PUT - Update deal
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

// DELETE - Delete deal
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const dealId = parseInt(id);
    
    console.log(`Deleting deal ${dealId}`);
    
    // First check if deal exists
    const dealCheck = await query('SELECT * FROM deals WHERE id = $1', [dealId]);
    
    if (dealCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Deal not found' }, { status: 404 });
    }
    
    // Delete associated documents first (CASCADE should handle this, but let's be explicit)
    await query('DELETE FROM documents WHERE deal_id = $1', [dealId]);
    
    // Delete the deal
    const result = await query('DELETE FROM deals WHERE id = $1 RETURNING *', [dealId]);
    
    console.log(`Deal ${dealId} deleted successfully`);
    
    return NextResponse.json({ 
      message: 'Deal deleted successfully',
      deleted_deal: result.rows[0]
    });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete deal',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
