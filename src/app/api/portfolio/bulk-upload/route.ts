import { NextRequest, NextResponse } from 'next/server';
import { processCommuneCapitalPDF } from '@/lib/pdf-processor';
import { insertPortfolioProperty } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    
    if (files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    console.log(`Processing ${files.length} files`);

    const results = [];
    let totalDeals = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const file of files) {
      try {
        console.log(`Processing file: ${file.name}`);
        const buffer = Buffer.from(await file.arrayBuffer());
        const deals = await processCommuneCapitalPDF(buffer, file.name);
        
        console.log(`PDF processor returned ${deals.length} deals:`, deals.map(d => ({
          name: d.propertyName,
          hasSpacesKey: !!d.spacesKey,
          hasText: !!d.extractedText
        })));
        
        for (const deal of deals) {
          totalDeals++;
          try {
            console.log('Attempting to insert deal:', {
              propertyName: deal.propertyName,
              spacesKey: deal.spacesKey,
              hasExtractedText: !!deal.extractedText,
              textLength: deal.extractedText?.length || 0
            });

            if (deal.propertyName) {
              const property = await insertPortfolioProperty({
                name: deal.propertyName,
                address: deal.address,
                propertyType: deal.propertyType || 'Commercial',
                units: deal.units,
                squareFeet: deal.squareFeet,
                acquisitionDate: deal.acquisitionDate,
                acquisitionPrice: deal.acquisitionPrice,
                currentValue: deal.currentValue,
                grossRentalIncome: deal.grossRentalIncome,
                operatingExpenses: deal.operatingExpenses,
                netOperatingIncome: deal.netOperatingIncome,
                occupancyRate: deal.occupancyRate,
                averageRent: deal.averageRent,
                capRate: deal.capRate,
                status: deal.status,
                pdfDocumentPath: deal.spacesKey,
                extractedText: deal.extractedText,
                spacesKey: deal.spacesKey,
                documentSize: deal.documentSize
              });
              
              console.log('✅ Property inserted successfully:', property.id);
              
              results.push({
                file: file.name,
                propertyName: deal.propertyName,
                propertyId: property.id,
                status: 'success'
              });
              successCount++;
            } else {
              console.log('❌ No property name found, skipping insertion');
              results.push({
                file: file.name,
                status: 'error',
                error: 'No property name extracted'
              });
              errorCount++;
            }
          } catch (insertError) {
            console.error('❌ Failed to insert property:', insertError);
            results.push({
              file: file.name,
              status: 'error',
              error: insertError instanceof Error ? insertError.message : 'Unknown insertion error'
            });
            errorCount++;
          }
        }
      } catch (fileError) {
        console.error(`❌ Failed to process file ${file.name}:`, fileError);
        results.push({
          file: file.name,
          status: 'error',
          error: fileError instanceof Error ? fileError.message : 'Unknown file processing error'
        });
        errorCount++;
      }
    }

    console.log('Upload summary:', { totalDeals, successCount, errorCount });

    return NextResponse.json({
      message: 'Bulk upload completed',
      summary: {
        totalFiles: files.length,
        totalDeals,
        successCount,
        errorCount
      },
      results
    });

  } catch (error) {
    console.error('❌ Bulk upload error:', error);
    return NextResponse.json({ 
      error: 'Bulk upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
