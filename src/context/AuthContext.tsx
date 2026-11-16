import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  cadastrarUsuario,
  realizarLogin,
  buscarUsuarioAutenticado,
  realizarLogout,
  type UsuarioAutenticado,
} from "../services/authService";

export type AuthUser = UsuarioAutenticado;

interface AuthContextData {
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

const AUTH_STORAGE_KEY = "mindconnect_token";

const AuthContext = createContext<AuthContextData | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(AUTH_STORAGE_KEY)
  );

  const [isLoading, setIsLoading] = useState<boolean>(() =>
    Boolean(localStorage.getItem(AUTH_STORAGE_KEY))
  );

  useEffect(() => {
    let ativo = true;

    async function restaurarSessao() {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const usuario = await buscarUsuarioAutenticado(token);

        if (!ativo) return;

        setUser(usuario);
      } catch (error) {
        if (!ativo) return;

        console.error("Erro ao restaurar sessão:", error);

        localStorage.removeItem(AUTH_STORAGE_KEY);
        setToken(null);
        setUser(null);
      } finally {
        if (ativo) {
          setIsLoading(false);
        }
      }
    }

    void restaurarSessao();

    return () => {
      ativo = false;
    };
  }, [token]);

  async function login(email: string, senha: string): Promise<void> {
    const sessao = await realizarLogin({
      email: email.trim().toLowerCase(),
      senha,
    });

    localStorage.setItem(AUTH_STORAGE_KEY, sessao.token);

    setUser(sessao.usuario);
    setToken(sessao.token);
  }

  async function register(
    nome: string,
    email: string,
    senha: string
  ): Promise<void> {
    const sessao = await cadastrarUsuario({
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha,
    });

    localStorage.setItem(AUTH_STORAGE_KEY, sessao.token);

    setUser(sessao.usuario);
    setToken(sessao.token);
  }

  async function logout(): Promise<void> {
    const tokenAtual = token;

    localStorage.removeItem(AUTH_STORAGE_KEY);

    setToken(null);
    setUser(null);
    setIsLoading(false);

    if (tokenAtual) {
      try {
        await realizarLogout(tokenAtual);
      } catch (error) {
        console.error("Erro ao encerrar sessão na API:", error);
      }
    }
  }

  const value: AuthContextData = {
    user,
    token,
    isAuthenticated: user !== null,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth deve ser utilizado dentro de AuthProvider."
    );
  }

  return context;
}