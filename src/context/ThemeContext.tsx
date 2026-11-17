import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

export type Theme = "claro" | "intermediario" | "escuro";

interface ThemeContextData {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextData | undefined>(
  undefined
);

const THEME_STORAGE_PREFIX = "mindconnect_tema_usuario_";

function obterTemaSalvo(idUsuario: number | undefined): Theme {
  if (!idUsuario) return "claro";

  const temaSalvo = localStorage.getItem(
    `${THEME_STORAGE_PREFIX}${idUsuario}`
  );

  if (
    temaSalvo === "claro" ||
    temaSalvo === "intermediario" ||
    temaSalvo === "escuro"
  ) {
    return temaSalvo;
  }

  return "claro";
}

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();

  const [theme, setThemeState] = useState<Theme>(() =>
    obterTemaSalvo(user?.id)
  );

  useEffect(() => {
    setThemeState(obterTemaSalvo(user?.id));
  }, [user?.id]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme =
      theme === "escuro" ? "dark" : "light";
  }, [theme]);

  const setTheme = useCallback(
    (novoTema: Theme) => {
      setThemeState(novoTema);

      if (user?.id) {
        localStorage.setItem(
          `${THEME_STORAGE_PREFIX}${user.id}`,
          novoTema
        );
      }
    },
    [user?.id]
  );

  const value = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextData {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme deve ser utilizado dentro de ThemeProvider."
    );
  }

  return context;
}