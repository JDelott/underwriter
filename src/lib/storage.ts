import { writeFile, mkdir, readFile as fsReadFile } from 'fs/promises';
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
  try {
    // Handle both absolute and relative paths
    const fullPath = filepath.startsWith('./') ? filepath : path.join('./', filepath);
    
    const content = await fsReadFile(fullPath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`Failed to read file ${filepath}:`, error);
    throw new Error(`Could not read file: ${filepath}`);
  }
}

export async function saveTextDocument(text: string, dealId: number, documentType: string): Promise<string> {
  const textDir = path.join(UPLOAD_DIR, 'text-documents', dealId.toString());
  await mkdir(textDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${documentType}-${timestamp}.txt`;
  const filepath = path.join(textDir, filename);
  
  await writeFile(filepath, text);
  
  return filepath;
}
