import { api } from "./api";
import type { ServicoAcolhimento,  CategoriaServico } from "./servicoTypes";

export function buscarServicos(
  nome?: string,
  municipio?: string,
  regiao?: string,
  categoria?: string
): Promise<ServicoAcolhimento[]> {
  const params = new URLSearchParams();

  if (nome) {
    params.append("nome", nome);
  }

  if (municipio) {
    params.append("municipio", municipio);
  }

  if (regiao) {
    params.append("regiao", regiao);
  }

  if (categoria) {
    params.append("categoria", categoria);
  }

  const query = params.toString();

  return api<ServicoAcolhimento[]>(
    `/api/servicos${query ? `?${query}` : ""}`
  );
}

export function buscarServicoPorId(
  id: number
): Promise<ServicoAcolhimento> {
  return api<ServicoAcolhimento>(`/api/servicos/${id}`);
}

export function buscarCategoriasServico(): Promise<CategoriaServico[]> {
  return api<CategoriaServico[]>("/api/categorias-servico");
}

export function buscarMunicipios(): Promise<string[]> {
  return api<string[]>("/api/servicos/municipios");
}
