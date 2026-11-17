import { api } from "./api";

export interface UsuarioAdmin {
  idUsuario: number;
  nome: string;
  email: string;
  dataCadastro: string;
}

export interface Administrador {
  idAdministrador: number;
  idUsuario: number;
  nivelAcesso: "ADMIN" | "SUPERVISOR";
  nomeUsuario: string;
  emailUsuario: string;
}

export type NivelAcessoAdmin = "ADMIN" | "SUPERVISOR";

export async function listarUsuarios(
  token: string
): Promise<UsuarioAdmin[]> {
  return api<UsuarioAdmin[]>("/api/usuarios", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function listarAdministradores(
  token: string
): Promise<Administrador[]> {
  return api<Administrador[]>("/api/administradores", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function cadastrarAdministrador(
  idUsuario: number,
  nivelAcesso: NivelAcessoAdmin,
  token: string
): Promise<Administrador> {
  return api<Administrador>("/api/administradores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      idUsuario,
      nivelAcesso,
    }),
  });
}

export async function atualizarNivelAdministrador(
  idAdministrador: number,
  nivelAcesso: NivelAcessoAdmin,
  token: string
): Promise<Administrador> {
  return api<Administrador>(
    `/api/administradores/${idAdministrador}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nivelAcesso,
      }),
    }
  );
}

export async function excluirAdministrador(
  idAdministrador: number,
  token: string
): Promise<void> {
  return api<void>(
    `/api/administradores/${idAdministrador}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}