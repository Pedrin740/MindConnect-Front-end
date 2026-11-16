import { api } from "./api";

export interface UsuarioAutenticado {
  id: number;
  nome: string;
  email: string;
  pontos: number;
  nivel: string;
  recompensa: string;
}

export interface SessaoAutenticacao {
  token: string;
  usuario: UsuarioAutenticado;
}

export interface CadastroDados {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginDados {
  email: string;
  senha: string;
}

export async function cadastrarUsuario(
  dados: CadastroDados
): Promise<SessaoAutenticacao> {
  return api<SessaoAutenticacao>(
    "/api/v1/auth/cadastro",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    }
  );
}

export async function realizarLogin(
  dados: LoginDados
): Promise<SessaoAutenticacao> {
  return api<SessaoAutenticacao>(
    "/api/v1/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dados),
    }
  );
}

export async function buscarUsuarioAutenticado(
  token: string
): Promise<UsuarioAutenticado> {
  return api<UsuarioAutenticado>(
    "/api/v1/usuarios/me",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

export async function realizarLogout(
  token: string
): Promise<void> {
  return api<void>(
    "/api/v1/auth/logout",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}