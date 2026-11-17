import { createContext } from "react";
import type { UsuarioAutenticado } from "../services/authService";

export type AuthUser = UsuarioAutenticado;

export interface AuthContextData {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  register: (
    nome: string,
    email: string,
    senha: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

export const AUTH_STORAGE_KEY = "mindconnect_token";
export const USER_ID_STORAGE_KEY = "mindconnect_user_id";
export const ADMIN_STORAGE_KEY = "mindconnect_administrador";
export const ACCESS_LEVEL_STORAGE_KEY = "mindconnect_nivel_acesso";

export const AuthContext = createContext<
  AuthContextData | undefined
>(undefined);
