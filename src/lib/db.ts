import { Pool } from 'pg';
import AWS from 'aws-sdk';

const pool = new Pool({
  user: process.env.DB_USER || 'jacobdelott',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'underwriter_dev',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
});

export const query = (text: string, params?: unknown[]) => {
  return pool.query(text, params);
};

export default pool;

export async function insertPortfolioProperty(property: {
  name: string;
  address?: string;
  propertyType?: string;
  units?: number;
  squareFeet?: number;
  acquisitionDate?: string;
  acquisitionPrice?: number;
  currentValue?: number;
  grossRentalIncome?: number;
  operatingExpenses?: number;
  netOperatingIncome?: number;
  occupancyRate?: number;
  averageRent?: number;
  capRate?: number;
  status?: string;
  pdfDocumentPath?: string;
  extractedText?: string;
  spacesKey?: string;
  documentSize?: number;
}) {
  console.log('🔄 Starting database insertion for:', property.name);
  
  const client = await pool.connect();
  try {
    console.log('🔄 Database connection established');
    console.log('🔄 Property data:', {
      name: property.name,
      propertyType: property.propertyType,
      currentValue: property.currentValue,
      spacesKey: property.spacesKey,
      hasExtractedText: !!property.extractedText,
      textLength: property.extractedText?.length || 0
    });

    const result = await client.query(`
      INSERT INTO portfolio_properties (
        name, address, property_type, units, square_feet,
        acquisition_date, acquisition_price, current_value, 
        gross_rental_income, operating_expenses, net_operating_income,
        occupancy_rate, average_rent, cap_rate, status, 
        pdf_document_path, extracted_text, spaces_document_key, document_size
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
      RETURNING *
    `, [
      property.name,
      property.address,
      property.propertyType,
      property.units,
      property.squareFeet,
      property.acquisitionDate,
      property.acquisitionPrice,
      property.currentValue,
      property.grossRentalIncome,
      property.operatingExpenses,
      property.netOperatingIncome,
      property.occupancyRate,
      property.averageRent,
      property.capRate,
      property.status || 'active',
      property.pdfDocumentPath,
      property.extractedText,
      property.spacesKey,
      property.documentSize
    ]);
    
    console.log('✅ Database insertion successful! ID:', result.rows[0].id);
    return result.rows[0];
  } catch (error) {
    console.error('❌ Database insertion failed:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      detail: (error as any)?.detail
    });
    throw error;
  } finally {
    client.release();
    console.log('🔄 Database connection released');
  }
}

// Configure for DigitalOcean Spaces (uses S3-compatible API)
const spacesEndpoint = new AWS.Endpoint(`${process.env.DO_SPACES_REGION}.digitaloceanspaces.com`);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACES_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET,
  region: process.env.DO_SPACES_REGION
});

export async function uploadDocumentToSpaces(
  pdfBuffer: Buffer, 
  filename: string
): Promise<string> {
  const key = `ppms/${Date.now()}-${filename}`;
  
  const uploadParams = {
    Bucket: process.env.DO_SPACES_BUCKET!,
    Key: key,
    Body: pdfBuffer,
    ContentType: 'application/pdf',
    ACL: 'private'
  };
  
  try {
    const result = await s3.upload(uploadParams).promise();
    console.log('Document uploaded to Spaces:', result.Location);
    return key;
  } catch (error) {
    console.error('Upload to Spaces failed:', error);
    throw error;
  }
}

export async function getDocumentFromSpaces(key: string): Promise<Buffer> {
  const params = {
    Bucket: process.env.DO_SPACES_BUCKET!,
    Key: key
  };
  
  try {
    const result = await s3.getObject(params).promise();
    return result.Body as Buffer;
  } catch (error) {
    console.error('Download from Spaces failed:', error);
    throw error;
  }
}

export async function generateSignedUrl(key: string): Promise<string> {
  const params = {
    Bucket: process.env.DO_SPACES_BUCKET!,
    Key: key,
    Expires: 3600 // 1 hour
  };
  
  return s3.getSignedUrl('getObject', params);
}
