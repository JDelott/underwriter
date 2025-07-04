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
