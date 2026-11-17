import { useEffect, useState, type ReactNode } from "react";
import type { Conteudo } from "../services/conteudoTypes";
import { FavoritesContext, type FavoritesContextData } from "./favoritesContextDefinition";

interface FavoritesProviderProps {
  children: ReactNode;
}

const FAVORITES_STORAGE_KEY = "mindconnect_favoritos";

export function FavoritesProvider({
  children,
}: FavoritesProviderProps) {
  const [favoritos, setFavoritos] = useState<Conteudo[]>(() => {
    try {
      const favoritosSalvos = localStorage.getItem(
        FAVORITES_STORAGE_KEY
      );

      return favoritosSalvos
        ? JSON.parse(favoritosSalvos) as Conteudo[]
        : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favoritos)
    );
  }, [favoritos]);

  function adicionarFavorito(conteudo: Conteudo): void {
    setFavoritos((atuais) => {
      const jaExiste = atuais.some(
        (item) => item.idConteudo === conteudo.idConteudo
      );

      if (jaExiste) {
        return atuais;
      }

      return [...atuais, conteudo];
    });
  }

  function removerFavorito(idConteudo: number): void {
    setFavoritos((atuais) =>
      atuais.filter(
        (item) => item.idConteudo !== idConteudo
      )
    );
  }

  function alternarFavorito(conteudo: Conteudo): void {
    setFavoritos((atuais) => {
      const jaExiste = atuais.some(
        (item) => item.idConteudo === conteudo.idConteudo
      );

      if (jaExiste) {
        return atuais.filter(
          (item) => item.idConteudo !== conteudo.idConteudo
        );
      }

      return [...atuais, conteudo];
    });
  }

  function verificarFavorito(idConteudo: number): boolean {
    return favoritos.some(
      (item) => item.idConteudo === idConteudo
    );
  }

  function limparFavoritos(): void {
    setFavoritos([]);
  }

  const value: FavoritesContextData = {
    favoritos,
    adicionarFavorito,
    removerFavorito,
    alternarFavorito,
    verificarFavorito,
    limparFavoritos,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
