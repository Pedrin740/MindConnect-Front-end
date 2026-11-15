import { api } from "./api";
import type { Conteudo, CategoriaConteudo } from "./conteudoTypes";

export interface FiltrosConteudo {
  busca?: string;
  status?: string;
  categoria?: string;
}

export function buscarConteudos(
  filtros: FiltrosConteudo = {}
): Promise<Conteudo[]> {
  const params = new URLSearchParams();

  if (filtros.busca) {
    params.append("busca", filtros.busca);
  }

  if (filtros.status) {
    params.append("status", filtros.status);
  }

  if (filtros.categoria) {
    params.append("categoria", filtros.categoria);
  }

  const query = params.toString();

  return api<Conteudo[]>(
    `/api/conteudos${query ? `?${query}` : ""}`
  );
}

export function buscarConteudoPorId(
  id: number
): Promise<Conteudo> {
  return api<Conteudo>(`/api/conteudos/${id}`);
}

export function buscarCategoriasConteudo(): Promise<CategoriaConteudo[]> {
  return api<CategoriaConteudo[]>("/api/categorias-conteudo");
}
