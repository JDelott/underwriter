import { NextResponse } from 'next/server';
import AWS from 'aws-sdk';

export async function POST() {
  try {
    console.log('Testing Spaces connection...');
    console.log('Environment variables:', {
      bucket: process.env.DO_SPACES_BUCKET,
      region: process.env.DO_SPACES_REGION,
      key: process.env.DO_SPACES_KEY ? 'Set' : 'Not set',
      secret: process.env.DO_SPACES_SECRET ? 'Set' : 'Not set'
    });

    const spacesEndpoint = new AWS.Endpoint(`${process.env.DO_SPACES_REGION}.digitaloceanspaces.com`);
    const s3 = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: process.env.DO_SPACES_KEY,
      secretAccessKey: process.env.DO_SPACES_SECRET,
      region: process.env.DO_SPACES_REGION,
      s3ForcePathStyle: false,
      signatureVersion: 'v4'
    });

    const testContent = `Test file created at ${new Date().toISOString()}`;
    const key = `test/${Date.now()}-test.txt`;

    const uploadParams = {
      Bucket: process.env.DO_SPACES_BUCKET!,
      Key: key,
      Body: testContent,
      ContentType: 'text/plain'
    };

    const result = await s3.upload(uploadParams).promise();
    console.log('Upload successful:', result.Location);

    return NextResponse.json({
      success: true,
      location: result.Location,
      message: 'Test file uploaded successfully!'
    });

  } catch (error) {
    console.error('Spaces test error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to Spaces', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
