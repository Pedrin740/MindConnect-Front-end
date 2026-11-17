import { useContext } from "react";
import { FavoritesContext, type FavoritesContextData } from "../context/favoritesContextDefinition";

export function useFavorites(): FavoritesContextData {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error(
      "useFavorites deve ser utilizado dentro de FavoritesProvider."
    );
  }

  return context;
}
