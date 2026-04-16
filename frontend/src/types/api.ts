export interface DocumentInfo {
  id: string;
  original_filename: string;
  file_size: number;
  page_count: number;
  width: number;
  height: number;
  mime_type: string;
  is_encrypted: boolean;
  has_forms: boolean;
  metadata_json: Record<string, string>;
  created_at: string;
  expires_at: string;
}

export interface DocumentListItem {
  id: string;
  original_filename: string;
  file_size: number;
  page_count: number;
  created_at: string;
}

export interface EditOperation {
  id?: string;
  page_number: number;
  operation_type: 'text' | 'image' | 'shape' | 'annotation' | 'signature' | 'freehand';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  properties: Record<string, unknown>;
  z_index: number;
}

export interface EditSession {
  id: string;
  document: string;
  is_active: boolean;
  operations: EditOperation[];
  created_at: string;
  updated_at: string;
}

export interface UserInfo {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
  plan: string;
  storage_used_bytes: number;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface ToolJob {
  id: string;
  tool_type: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  error_message: string;
}
