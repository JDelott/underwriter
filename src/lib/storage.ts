import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const UPLOAD_DIR = './uploads';

export async function saveFile(file: File, dealId: number): Promise<string> {
  // Create uploads directory if it doesn't exist
  await mkdir(UPLOAD_DIR, { recursive: true });
  await mkdir(path.join(UPLOAD_DIR, dealId.toString()), { recursive: true });

  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(UPLOAD_DIR, dealId.toString(), filename);
  
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);
  
  return filepath;
}

export async function readFile(filepath: string): Promise<string> {
  const fs = await import('fs/promises');
  try {
    return await fs.readFile(filepath, 'utf-8');
  } catch (error) {
    console.error('Error reading file:', error);
    return `File content could not be read: ${filepath}`;
  }
}
