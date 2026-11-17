import { createContext } from "react";
import type { Conteudo } from "../services/conteudoTypes";

export interface FavoritesContextData {
  favoritos: Conteudo[];
  adicionarFavorito: (conteudo: Conteudo) => void;
  removerFavorito: (idConteudo: number) => void;
  alternarFavorito: (conteudo: Conteudo) => void;
  verificarFavorito: (idConteudo: number) => boolean;
  limparFavoritos: () => void;
}

export const FavoritesContext = createContext<
  FavoritesContextData | undefined
>(undefined);
