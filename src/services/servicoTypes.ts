export interface ServicoAcolhimento {
  idServico: number;
  idCategoriaServico: number;
  nomeCategoria: string;
  nome: string;
  endereco: string;
  bairro: string;
  municipio: string;
  regiao: string;
  telefone: string;
  horarioFuncionamento: string;
  descricaoServicos: string;
  fonteInformacao: string;
  dataVerificacao: string;
  latitude: number | null;
  longitude: number | null;
}

export interface CategoriaServico {
  idCategoriaServico: number;
  nome: string;
  descricao: string;
}
