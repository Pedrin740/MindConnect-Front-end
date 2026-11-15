export interface CategoriaConteudo {
  idCategoriaConteudo: number;
  nome: string;
  descricao: string | null;
}

export interface Conteudo {
  idConteudo: number;
  titulo: string;
  assunto: string;
  descricao: string;
  material: string;
  fonteInformacao: string;
  dataPublicacao: string | null;
  status: string;
  categorias: CategoriaConteudo[];
}
