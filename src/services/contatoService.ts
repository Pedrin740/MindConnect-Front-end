import { api } from "./api";

export interface ContatoDados {
  nome: string;
  email: string;
  motivo: string;
  mensagem: string;
}

export interface ContatoResposta {
  idContato: number;
  nome: string;
  email: string;
  motivo: string;
  dataEnvio: string;
  status: string;
}

export async function enviarContato(
  dados: ContatoDados
): Promise<ContatoResposta> {
  return api<ContatoResposta>("/api/contatos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });
}
