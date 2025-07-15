import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET all portfolio properties
export async function GET() {
  try {
    const result = await query(`
      SELECT p.*, 
             COALESCE(perf.latest_noi, 0) as latest_noi,
             COALESCE(perf.latest_cap_rate, 0) as latest_cap_rate,
             COALESCE(perf.latest_occupancy, 0) as latest_occupancy
      FROM portfolio_properties p
      LEFT JOIN (
        SELECT portfolio_property_id,
               net_operating_income as latest_noi,
               cap_rate as latest_cap_rate,
               occupancy_rate as latest_occupancy,
               ROW_NUMBER() OVER (PARTITION BY portfolio_property_id ORDER BY period_end DESC) as rn
        FROM portfolio_performance
      ) perf ON p.id = perf.portfolio_property_id AND perf.rn = 1
      ORDER BY p.created_at DESC
    `);
    
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
  }
}

// POST - Create new portfolio property
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      name, address, property_type, units, square_feet, year_built,
      acquisition_date, acquisition_price, current_value, market_area,
      submarket, notes
    } = data;
    
    const result = await query(`
      INSERT INTO portfolio_properties (
        name, address, property_type, units, square_feet, year_built,
        acquisition_date, acquisition_price, current_value, market_area,
        submarket, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING *
    `, [
      name, address, property_type, units, square_feet, year_built,
      acquisition_date, acquisition_price, current_value, market_area,
      submarket, notes
    ]);
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to create portfolio property' }, { status: 500 });
  }
}
