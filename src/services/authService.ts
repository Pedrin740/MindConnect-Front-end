import { api } from "./api";

export interface UsuarioAutenticado {
  id: number;
  nome: string;
  email: string;
  administrador: boolean;
  nivelAcesso: string;
}

export interface RespostaLogin {
  idUsuario: number;
  nome: string;
  email: string;
  administrador: boolean;
  nivelAcesso: string;
  token: string;
}

export interface UsuarioCadastro {
  idUsuario: number;
  nome: string;
  email: string;
  dataCadastro: string;
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
): Promise<UsuarioCadastro> {
  return api<UsuarioCadastro>("/api/usuarios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
}

export async function realizarLogin(
  dados: LoginDados
): Promise<RespostaLogin> {
  return api<RespostaLogin>("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
}

export async function buscarUsuarioAutenticado(
  token: string,
  idUsuario: number
): Promise<UsuarioAutenticado> {
  const usuario = await api<UsuarioCadastro>(
    `/api/usuarios/${idUsuario}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return {
    id: usuario.idUsuario,
    nome: usuario.nome,
    email: usuario.email,
    administrador: false,
    nivelAcesso: "",
  };
}