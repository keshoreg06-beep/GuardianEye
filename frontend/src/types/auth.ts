export interface RoleSummary {
  id: string;
  name: string;
  description?: string | null;
  permissions?: string | null;
  created_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  role?: RoleSummary | null;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}
