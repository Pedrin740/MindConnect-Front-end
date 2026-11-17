import { useEffect, useState, type ReactNode } from "react";
import { cadastrarUsuario, realizarLogin, buscarUsuarioAutenticado } from "../services/authService";
import { AuthContext, type AuthUser, type AuthContextData, AUTH_STORAGE_KEY, USER_ID_STORAGE_KEY, ADMIN_STORAGE_KEY, ACCESS_LEVEL_STORAGE_KEY } from "./authContextDefinition";

interface AuthProviderProps {
  children: ReactNode;
}

const USER_CACHE_KEY = "mindconnect_usuario";

function obterUsuarioSalvo(): AuthUser | null {
  try {
    const token = localStorage.getItem(AUTH_STORAGE_KEY);
    const usuarioSalvo = localStorage.getItem(USER_CACHE_KEY);

    if (!token || !usuarioSalvo) {
      return null;
    }

    const usuario = JSON.parse(usuarioSalvo) as AuthUser;

    if (
      !usuario ||
      !Number.isInteger(usuario.id) ||
      !usuario.nome ||
      !usuario.email
    ) {
      return null;
    }

    return usuario;
  } catch {
    return null;
  }
}

function salvarUsuario(usuario: AuthUser): void {
  localStorage.setItem(
    USER_CACHE_KEY,
    JSON.stringify(usuario)
  );
}

function limparSessao(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  localStorage.removeItem(USER_ID_STORAGE_KEY);
  localStorage.removeItem(ADMIN_STORAGE_KEY);
  localStorage.removeItem(ACCESS_LEVEL_STORAGE_KEY);
  localStorage.removeItem(USER_CACHE_KEY);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(
    obterUsuarioSalvo
  );

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
        if (ativo) {
          setUser(null);
          setIsLoading(false);
        }

        return;
      }

      const idUsuario = Number(
        localStorage.getItem(USER_ID_STORAGE_KEY)
      );

      if (!idUsuario || !Number.isInteger(idUsuario)) {
        limparSessao();

        if (ativo) {
          setUser(null);
          setToken(null);
          setIsLoading(false);
        }

        return;
      }

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

        salvarUsuario(usuarioRestaurado);
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

    salvarUsuario(usuario);

    setUser(usuario);
    setToken(sessao.token);
    setIsLoading(false);
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

    await login(
      dadosCadastro.email,
      dadosCadastro.senha
    );
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
