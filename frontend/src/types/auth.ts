import type { Session, User } from "@supabase/supabase-js";

export type AuthUser = User;
export type AuthSession = Session;

export interface AuthState {
  user: AuthUser | null;
  session: AuthSession | null;
  loading: boolean;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}
