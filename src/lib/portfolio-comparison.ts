import { query } from './db';
import { PortfolioProperty } from '@/types';

export interface PropertyComparison {
  portfolioProperty: PortfolioProperty;
  similarityScore: number;
  comparisonFactors: {
    property_type_match: boolean;
    market_area_match: boolean;
    size_similarity: number;
    age_similarity: number;
    financial_similarity: number;
  };
  performance: {
    avg_noi: number;
    avg_cap_rate: number;
    avg_occupancy: number;
    avg_cash_flow: number;
  };
}

export async function findSimilarPortfolioProperties(
  dealData: {
    property_type?: string;
    address?: string;
    units?: number;
    square_feet?: number;
    year_built?: number;
    estimated_noi?: number;
    estimated_value?: number;
  }
): Promise<PropertyComparison[]> {
  try {
    const portfolioResult = await query(`
      SELECT p.*,
             AVG(perf.net_operating_income) as avg_noi,
             AVG(perf.cap_rate) as avg_cap_rate,
             AVG(perf.occupancy_rate) as avg_occupancy,
             AVG(perf.cash_flow) as avg_cash_flow,
             COUNT(perf.id) as performance_periods
      FROM portfolio_properties p
      LEFT JOIN portfolio_performance perf ON p.id = perf.portfolio_property_id
      WHERE p.status = 'active'
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    const portfolioProperties = portfolioResult.rows;
    const comparisons: PropertyComparison[] = [];

    for (const property of portfolioProperties) {
      const comparisonFactors = {
        property_type_match: dealData.property_type === property.property_type,
        market_area_match: extractMarketArea(dealData.address) === property.market_area,
        size_similarity: calculateSizeSimilarity(dealData.units, property.units),
        age_similarity: calculateAgeSimilarity(dealData.year_built, property.year_built),
        financial_similarity: calculateFinancialSimilarity(
          dealData.estimated_noi,
          property.avg_noi,
          dealData.estimated_value,
          property.current_value
        )
      };

      const similarityScore = calculateSimilarityScore(comparisonFactors);

      if (similarityScore > 0.2) {
        comparisons.push({
          portfolioProperty: property,
          similarityScore,
          comparisonFactors,
          performance: {
            avg_noi: property.avg_noi || 0,
            avg_cap_rate: property.avg_cap_rate || 0,
            avg_occupancy: property.avg_occupancy || 0,
            avg_cash_flow: property.avg_cash_flow || 0
          }
        });
      }
    }

    return comparisons.sort((a, b) => b.similarityScore - a.similarityScore);
  } catch (error) {
    console.error('Error finding similar properties:', error);
    return [];
  }
}

function calculateSimilarityScore(factors: {
  property_type_match: boolean;
  market_area_match: boolean;
  size_similarity: number;
  age_similarity: number;
  financial_similarity: number;
}): number {
  let score = 0;
  
  if (factors.property_type_match) score += 0.4;
  if (factors.market_area_match) score += 0.25;
  score += factors.size_similarity * 0.2;
  score += factors.age_similarity * 0.1;
  score += factors.financial_similarity * 0.05;
  
  return score;
}

function calculateSizeSimilarity(units1?: number, units2?: number): number {
  if (!units1 || !units2) return 0;
  
  const difference = Math.abs(units1 - units2);
  const average = (units1 + units2) / 2;
  
  return Math.max(0, 1 - (difference / average));
}

function calculateAgeSimilarity(year1?: number, year2?: number): number {
  if (!year1 || !year2) return 0;
  
  const currentYear = new Date().getFullYear();
  const age1 = currentYear - year1;
  const age2 = currentYear - year2;
  
  const difference = Math.abs(age1 - age2);
  
  return Math.max(0, 1 - (difference / 10));
}

function calculateFinancialSimilarity(noi1?: number, noi2?: number, value1?: number, value2?: number): number {
  if (!noi1 || !noi2 || !value1 || !value2) return 0;
  
  const capRate1 = noi1 / value1;
  const capRate2 = noi2 / value2;
  
  const difference = Math.abs(capRate1 - capRate2);
  
  return Math.max(0, 1 - (difference / 0.02));
}

function extractMarketArea(address?: string): string {
  if (!address) return '';
  
  const parts = address.split(',');
  return parts[parts.length - 2]?.trim() || '';
}
