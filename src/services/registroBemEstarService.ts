import { api } from "./api";

export interface RegistroBemEstar {
  idRegistro: number;
  idUsuario: number;
  dataRegistro: string;
  humor: string;
  nivelHumor: number;
  sentimentos: string | null;
  observacoes: string | null;
}

export interface NovoRegistroBemEstar {
  idUsuario: number;
  dataRegistro: string;
  humor: string;
  nivelHumor: number;
  observacoes: string;
}

export async function listarRegistrosBemEstar(
  token: string
): Promise<RegistroBemEstar[]> {
  return api<RegistroBemEstar[]>("/api/bem-estar", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function cadastrarRegistroBemEstar(
  dados: NovoRegistroBemEstar,
  token: string
): Promise<RegistroBemEstar> {
  return api<RegistroBemEstar>("/api/bem-estar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(dados),
  });
}

export async function excluirRegistroBemEstar(
  idRegistro: number,
  token: string
): Promise<void> {
  return api<void>(`/api/bem-estar/${idRegistro}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}