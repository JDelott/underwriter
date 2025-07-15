export interface Deal {
  id: number;
  name: string;
  property_type?: string;
  address?: string;
  status: 'draft' | 'uploaded' | 'analyzing' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: number;
  deal_id: number;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  status: 'uploaded' | 'analyzing' | 'analyzed' | 'error';
  analysis_result?: unknown;
  created_at: string;
}

// New Chat Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  dealId?: number;
}

export interface ChatConversation {
  id: string;
  messages: ChatMessage[];
  dealId?: number;
  created_at: string;
  updated_at: string;
}

export interface PortfolioProperty {
  id: number;
  user_id?: number;
  name: string;
  address?: string;
  property_type?: string;
  units?: number;
  square_feet?: number;
  year_built?: number;
  acquisition_date?: string;
  acquisition_price?: number;
  current_value?: number;
  disposition_date?: string;
  disposition_price?: number;
  status: 'active' | 'disposed' | 'under_contract';
  market_area?: string;
  submarket?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  latest_noi?: number;
  latest_cap_rate?: number;
  latest_occupancy?: number;
}

export interface PortfolioPerformance {
  id: number;
  portfolio_property_id: number;
  period_start: string;
  period_end: string;
  gross_rental_income?: number;
  operating_expenses?: number;
  net_operating_income?: number;
  occupancy_rate?: number;
  average_rent?: number;
  cap_rate?: number;
  dscr?: number;
  cash_flow?: number;
  total_return?: number;
  created_at: string;
}

export interface DealPortfolioComparison {
  id: number;
  deal_id: number;
  portfolio_property_id: number;
  similarity_score: number;
  comparison_factors: {
    property_type_match: boolean;
    market_area_match: boolean;
    size_similarity: number;
    age_similarity: number;
    financial_similarity: number;
  };
  created_at: string;
}
