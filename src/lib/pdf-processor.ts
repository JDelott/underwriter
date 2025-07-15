import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { extractDataWithClaude } from '@/lib/claude';
import { uploadDocumentToSpaces } from '@/lib/document-storage';
import PDFParser from 'pdf2json';

export interface ExtractedDealData {
  propertyName?: string;
  address?: string;
  propertyType?: string;
  units?: number;
  squareFeet?: number;
  acquisitionDate?: string;
  acquisitionPrice?: number;
  saleDate?: string;
  salePrice?: number;
  currentValue?: number;
  grossRentalIncome?: number;
  operatingExpenses?: number;
  netOperatingIncome?: number;
  occupancyRate?: number;
  averageRent?: number;
  capRate?: number;
  status: 'active' | 'disposed' | 'under_contract';
  dealType: 'current' | 'past';
  extractedText?: string;
  spacesKey?: string;
  documentSize?: number;
}

interface DocumentChunk {
  section: string;
  content: string;
  priority: number;
}

interface ClaudeResponse {
  propertyName?: string;
  address?: string;
  propertyType?: string;
  units?: number;
  squareFeet?: number;
  acquisitionPrice?: number;
  currentValue?: number;
  grossRentalIncome?: number;
  netOperatingIncome?: number;
  capRate?: number;
  occupancyRate?: number;
  targetIRR?: number;
  holdPeriod?: number;
}

export async function processCommuneCapitalPDF(
  pdfBuffer: Buffer, 
  filename: string
): Promise<ExtractedDealData[]> {
  try {
    // Upload to DigitalOcean Spaces first
    const spacesKey = await uploadDocumentToSpaces(pdfBuffer, filename);
    console.log('PDF uploaded to Spaces:', spacesKey);
    
    // Extract text from PDF
    const extractedText = await extractTextFromPDF(pdfBuffer);
    
    // Process with multiple chunks for better extraction
    const chunks = await intelligentChunking(extractedText);
    
    // Extract financial data from each chunk
    const results = await Promise.all(
      chunks.map(chunk => processChunkWithClaude(chunk))
    );
    
    // Combine results
    const dealData = combineResults(results);
    
    // FALLBACK: If no property name found, extract from filename or text
    if (!dealData.propertyName) {
      console.log('No property name found in chunks, using fallback extraction');
      dealData.propertyName = extractPropertyNameFallback(filename, extractedText);
      console.log('Fallback property name:', dealData.propertyName);
    }
    
    // Save the PDF and text for later chat functionality
    await savePDFAndText(pdfBuffer, extractedText, filename);
    
    return [{ 
      ...dealData, 
      extractedText,
      spacesKey,
      documentSize: pdfBuffer.length,
      status: 'active',
      dealType: 'current'
    }];
  } catch (error) {
    console.error('PDF processing error:', error);
    
    // Fallback to basic extraction
    const basicDeal = await extractDealsFromFilename(filename);
    return basicDeal;
  }
}

async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();
    
    pdfParser.on("pdfParser_dataError", (errData) => {
      reject(new Error(`PDF parsing error: ${errData.parserError}`));
    });
    
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      try {
        let extractedText = '';
        
        if (pdfData.Pages) {
          for (const page of pdfData.Pages) {
            if (page.Texts) {
              for (const textItem of page.Texts) {
                if (textItem.R) {
                  for (const run of textItem.R) {
                    if (run.T) {
                      extractedText += decodeURIComponent(run.T) + ' ';
                    }
                  }
                }
              }
            }
          }
        }
        
        resolve(extractedText);
      } catch (error) {
        reject(error);
      }
    });
    
    pdfParser.parseBuffer(pdfBuffer);
  });
}

async function intelligentChunking(text: string): Promise<DocumentChunk[]> {
  const sections = [
    'EXECUTIVE SUMMARY',
    'INVESTMENT OVERVIEW', 
    'FINANCIAL PROJECTIONS',
    'PROPERTY DETAILS',
    'INVESTMENT HIGHLIGHTS'
  ];
  
  const chunks: DocumentChunk[] = [];
  
  for (const section of sections) {
    const sectionText = extractSectionByHeader(text, section);
    if (sectionText && sectionText.length > 1000) {
      chunks.push({
        section,
        content: sectionText.substring(0, 50000),
        priority: getSectionPriority(section)
      });
    }
  }
  
  // If no sections found, split by keywords
  if (chunks.length === 0) {
    const keywordChunks = findFinancialSections(text);
    chunks.push(...keywordChunks);
  }
  
  return chunks;
}

function extractSectionByHeader(text: string, header: string): string {
  const regex = new RegExp(`${header}[\\s\\S]*?(?=\\n[A-Z][A-Z\\s]+\\n|$)`, 'i');
  const match = text.match(regex);
  return match ? match[0] : '';
}

function findFinancialSections(text: string): DocumentChunk[] {
  const chunkSize = 25000;
  const chunks: DocumentChunk[] = [];
  
  for (let i = 0; i < text.length; i += chunkSize) {
    const chunk = text.substring(i, i + chunkSize);
    if (hasFinancialKeywords(chunk)) {
      chunks.push({
        section: 'Financial Content',
        content: chunk,
        priority: 5
      });
    }
  }
  
  return chunks;
}

function hasFinancialKeywords(text: string): boolean {
  const keywords = [
    'noi', 'cap rate', 'irr', 'units', 'square feet', 'sf',
    'acquisition', 'purchase price', 'rent', 'income', 'revenue',
    'expenses', 'occupancy', 'financial', 'projections', 'returns',
    'million', 'thousand', '$', 'target', 'projected'
  ];
  
  const lowerText = text.toLowerCase();
  return keywords.some(keyword => lowerText.includes(keyword));
}

async function processChunkWithClaude(chunk: DocumentChunk): Promise<ClaudeResponse | null> {
  const prompt = `
You are analyzing a Private Placement Memorandum (PPM) section: ${chunk.section}

Extract information from this PPM text. Look for:
- Fund names (e.g., "Commune Fund VI", "ABC Capital Fund II")
- Property names or project names
- Investment details and financial metrics

TEXT TO ANALYZE:
${chunk.content}

Return JSON with these fields (use null if not found):
{
  "propertyName": "The fund name, property name, or investment project name",
  "address": "Property or office address", 
  "propertyType": "Investment type (Multifamily, Office, Fund, etc.)",
  "units": "Number of units if applicable",
  "squareFeet": "Square footage if mentioned",
  "acquisitionPrice": "Purchase price or investment amount",
  "currentValue": "Current valuation or target amount",
  "grossRentalIncome": "Annual rental income",
  "netOperatingIncome": "NOI if mentioned",
  "capRate": "Capitalization rate",
  "occupancyRate": "Occupancy percentage",
  "targetIRR": "Target IRR percentage",
  "holdPeriod": "Investment hold period in years"
}

For fund names, capture the full name like "Commune Fund VI LLC" or "ABC Capital Fund II".
ONLY return valid JSON, no explanation.
`;

  try {
    console.log(`Processing chunk: ${chunk.section}`);
    const response = await extractDataWithClaude(prompt);
    console.log(`Raw Claude response for ${chunk.section}:`, response);
    
    const parsed = JSON.parse(cleanJsonResponse(response));
    console.log(`Parsed data for ${chunk.section}:`, parsed);
    
    return parsed;
  } catch (error) {
    console.error(`Failed to process ${chunk.section}:`, error);
    return null;
  }
}

function getSectionPriority(section: string): number {
  const priorities: Record<string, number> = {
    'EXECUTIVE SUMMARY': 10,
    'INVESTMENT OVERVIEW': 9,
    'FINANCIAL PROJECTIONS': 10,
    'PROPERTY DETAILS': 8,
    'INVESTMENT HIGHLIGHTS': 7
  };
  return priorities[section] || 1;
}

function combineResults(results: (ClaudeResponse | null)[]): Partial<ExtractedDealData> {
  const merged: Partial<ExtractedDealData> = {};
  
  for (const result of results) {
    if (result) {
      for (const [key, value] of Object.entries(result)) {
        if (value !== null && value !== undefined && value !== '') {
          if (!merged[key as keyof ExtractedDealData]) {
            (merged as Record<string, unknown>)[key] = value;
          }
        }
      }
    }
  }
  
  return merged;
}

function cleanJsonResponse(response: string): string {
  let jsonString = response.trim();
  
  // Remove markdown code blocks
  jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  // Find the first { and last }
  const firstBrace = jsonString.indexOf('{');
  const lastBrace = jsonString.lastIndexOf('}');
  
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    jsonString = jsonString.substring(firstBrace, lastBrace + 1);
  }
  
  return jsonString;
}

async function extractDealsFromFilename(filename: string): Promise<ExtractedDealData[]> {
  const dealName = filename.replace('.pdf', '').replace(/[-_]/g, ' ');
  
  return [{
    propertyName: dealName,
    dealType: 'current',
    status: 'active'
  }];
}

async function savePDFAndText(pdfBuffer: Buffer, text: string, filename: string): Promise<void> {
  const uploadsDir = path.join(process.cwd(), 'uploads', 'pdfs');
  const textDir = path.join(process.cwd(), 'uploads', 'pdf-text');
  
  await mkdir(uploadsDir, { recursive: true });
  await mkdir(textDir, { recursive: true });
  
  const timestamp = Date.now();
  const pdfPath = path.join(uploadsDir, `${timestamp}-${filename}`);
  const textPath = path.join(textDir, `${timestamp}-${filename.replace('.pdf', '.txt')}`);
  
  await writeFile(pdfPath, pdfBuffer);
  await writeFile(textPath, text);
}

// Add this new function for fallback property name extraction
function extractPropertyNameFallback(filename: string, extractedText: string): string {
  // Try to extract from common PPM patterns in the text
  const textSample = extractedText.substring(0, 5000); // First 5k characters
  
  // Look for common fund/property name patterns
  const patterns = [
    /([A-Za-z\s]+Fund\s+[IVX]+)/i,           // "Commune Fund VI"
    /([A-Za-z\s]+Capital\s+[A-Za-z\s]*)/i,   // "Commune Capital LLC"
    /Property:\s*([A-Za-z\s0-9]+)/i,         // "Property: XYZ"
    /([A-Za-z\s]+(?:Apartments|Properties|Real Estate|Fund))/i
  ];
  
  for (const pattern of patterns) {
    const match = textSample.match(pattern);
    if (match && match[1]) {
      const name = match[1].trim();
      if (name.length > 3 && name.length < 100) {
        console.log(`Found property name using pattern: "${name}"`);
        return name;
      }
    }
  }
  
  // If no patterns match, clean up the filename
  const cleanName = filename
    .replace('.pdf', '')
    .replace(/[_-]/g, ' ')
    .replace(/PPM/i, '')
    .replace(/\b[a-f0-9]{8}[a-f0-9-]*\b/gi, '') // Remove UUIDs
    .trim();
    
  console.log(`Using cleaned filename as property name: "${cleanName}"`);
  return cleanName || 'Unknown Property';
}
