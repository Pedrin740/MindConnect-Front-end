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
const ADMIN_STORAGE_KEY = "mindconnect_administrador";
const ACCESS_LEVEL_STORAGE_KEY = "mindconnect_nivel_acesso";

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
        limparSessao();
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

        const usuarioRestaurado: AuthUser = {
          ...usuario,
          administrador:
            localStorage.getItem(ADMIN_STORAGE_KEY) === "true",
          nivelAcesso:
            localStorage.getItem(ACCESS_LEVEL_STORAGE_KEY) ?? "",
        };

        setUser(usuarioRestaurado);
      } catch (error) {
        if (!ativo) return;

        console.error("Erro ao restaurar sessão:", error);

        limparSessao();
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

  function limparSessao() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_ID_STORAGE_KEY);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem(ACCESS_LEVEL_STORAGE_KEY);
  }

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
    localStorage.setItem(
      ADMIN_STORAGE_KEY,
      String(sessao.administrador)
    );
    localStorage.setItem(
      ACCESS_LEVEL_STORAGE_KEY,
      sessao.nivelAcesso ?? ""
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

    await login(dadosCadastro.email, dadosCadastro.senha);
  }

  async function logout(): Promise<void> {
    limparSessao();

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