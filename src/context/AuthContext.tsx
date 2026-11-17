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
const USER_ID_STORAGE_KEY = "mindconnect_user_id";

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

      const idUsuario = Number(
        localStorage.getItem(USER_ID_STORAGE_KEY)
      );

      if (!idUsuario || !Number.isInteger(idUsuario)) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(USER_ID_STORAGE_KEY);

        setUser(null);
        setToken(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const usuario = await buscarUsuarioAutenticado(
          token,
          idUsuario
        );

        if (!ativo) return;

        setUser(usuario);
      } catch (error) {
        if (!ativo) return;

        console.error("Erro ao restaurar sessão:", error);

        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(USER_ID_STORAGE_KEY);

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

  async function login(
    email: string,
    senha: string
  ): Promise<void> {
    const sessao = await realizarLogin({
      email: email.trim().toLowerCase(),
      senha,
    });

    const usuario: AuthUser = {
      id: sessao.idUsuario,
      nome: sessao.nome,
      email: sessao.email,
      administrador: sessao.administrador,
      nivelAcesso: sessao.nivelAcesso,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, sessao.token);
    localStorage.setItem(
      USER_ID_STORAGE_KEY,
      String(sessao.idUsuario)
    );

    setUser(usuario);
    setToken(sessao.token);
  }

  async function register(
    nome: string,
    email: string,
    senha: string
  ): Promise<void> {
    const dadosCadastro = {
      nome: nome.trim(),
      email: email.trim().toLowerCase(),
      senha,
    };

    await cadastrarUsuario(dadosCadastro);

    // O cadastro não retorna token.
    // Por isso, realizamos o login após criar a conta.
    await login(dadosCadastro.email, dadosCadastro.senha);
  }

  async function logout(): Promise<void> {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_ID_STORAGE_KEY);

    setToken(null);
    setUser(null);
    setIsLoading(false);
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