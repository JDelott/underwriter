import AWS from 'aws-sdk';

// Configure for DigitalOcean Spaces (uses S3-compatible API)
const spacesEndpoint = new AWS.Endpoint(`${process.env.DO_SPACES_REGION}.digitaloceanspaces.com`);
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.DO_SPACES_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET,
  region: process.env.DO_SPACES_REGION,
  signatureVersion: 'v4',
  s3ForcePathStyle: false
});

export async function uploadDocumentToSpaces(
  pdfBuffer: Buffer, 
  filename: string
): Promise<string> {
  const key = `ppms/${Date.now()}-${filename}`;
  
  console.log('Uploading to Spaces:', {
    bucket: process.env.DO_SPACES_BUCKET,
    region: process.env.DO_SPACES_REGION,
    endpoint: `${process.env.DO_SPACES_REGION}.digitaloceanspaces.com`,
    key: key
  });
  
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
    console.error('Environment check:', {
      bucket: process.env.DO_SPACES_BUCKET,
      region: process.env.DO_SPACES_REGION,
      keyLength: process.env.DO_SPACES_KEY?.length,
      secretLength: process.env.DO_SPACES_SECRET?.length
    });
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
