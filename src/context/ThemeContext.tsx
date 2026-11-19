import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

export type Theme = "claro" | "intermediario" | "escuro";

interface ThemeContextData {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextData | undefined>(undefined);

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

const GLOBAL_THEME_STYLES = `
  html {
    min-height: 100%;
    transition: background-color 250ms ease, color 250ms ease;
  }

  body {
    min-height: 100vh;
    transition: background-color 250ms ease, color 250ms ease;
  }

  /* =========================================
     TEMA INTERMEDIÁRIO
  ========================================= */

  html[data-theme="intermediario"] body {
    background-color: #cbd5e1;
    color: #172033;
  }

  html[data-theme="intermediario"] [class~="bg-white"],
  html[data-theme="intermediario"] [class~="bg-white/85"],
  html[data-theme="intermediario"] [class~="bg-white/80"] {
    background-color: #e2e8f0 !important;
  }

  html[data-theme="intermediario"] [class~="bg-gray-50"],
  html[data-theme="intermediario"] [class~="bg-slate-50"] {
    background-color: #cbd5e1 !important;
  }

  html[data-theme="intermediario"] [class~="bg-slate-100"] {
    background-color: #b8c5d6 !important;
  }

  html[data-theme="intermediario"] [class~="bg-slate-200"] {
    background-color: #aab9cd !important;
  }

  html[data-theme="intermediario"] [class~="bg-violet-50"],
  html[data-theme="intermediario"] [class~="bg-violet-50/50"] {
    background-color: #d8dced !important;
  }

  html[data-theme="intermediario"] [class~="bg-teal-50"] {
    background-color: #d0e5e3 !important;
  }

  html[data-theme="intermediario"] [class~="from-violet-50"],
  html[data-theme="intermediario"] [class~="from-violet-50/80"],
  html[data-theme="intermediario"] [class~="from-violet-100"] {
    --tw-gradient-from: #cbd5e1 var(--tw-gradient-from-position) !important;
  }

  html[data-theme="intermediario"] [class~="via-white"] {
    --tw-gradient-via: #e2e8f0 var(--tw-gradient-via-position) !important;
  }

  html[data-theme="intermediario"] [class~="to-white"],
  html[data-theme="intermediario"] [class~="to-teal-50"] {
    --tw-gradient-to: #cbd5e1 var(--tw-gradient-to-position) !important;
  }

  /* Textos */

  html[data-theme="intermediario"] [class~="text-slate-900"],
  html[data-theme="intermediario"] [class~="text-gray-900"] {
    color: #172033 !important;
  }

  html[data-theme="intermediario"] [class~="text-slate-800"],
  html[data-theme="intermediario"] [class~="text-slate-700"] {
    color: #263449 !important;
  }

  html[data-theme="intermediario"] [class~="text-slate-600"],
  html[data-theme="intermediario"] [class~="text-gray-600"] {
    color: #3f5068 !important;
  }

  html[data-theme="intermediario"] [class~="text-slate-500"],
  html[data-theme="intermediario"] [class~="text-gray-500"] {
    color: #53647b !important;
  }

  /* Bordas */

  html[data-theme="intermediario"] [class~="border"],
  html[data-theme="intermediario"] [class~="border-t"],
  html[data-theme="intermediario"] [class~="border-b"],
  html[data-theme="intermediario"] [class~="border-slate-100"],
  html[data-theme="intermediario"] [class~="border-slate-200"],
  html[data-theme="intermediario"] [class~="border-gray-100"],
  html[data-theme="intermediario"] [class~="border-gray-200"] {
    border-color: #aab9cd !important;
  }

  html[data-theme="intermediario"] input,
  html[data-theme="intermediario"] textarea,
  html[data-theme="intermediario"] select {
    color: #172033;
    background-color: #e2e8f0;
    border-color: #aab9cd;
  }

  html[data-theme="intermediario"] input::placeholder,
  html[data-theme="intermediario"] textarea::placeholder {
    color: #64748b;
  }

  html[data-theme="intermediario"] select option {
    color: #172033;
    background-color: #e2e8f0;
  }

  /* =========================================
     TEMA ESCURO
  ========================================= */

  html[data-theme="escuro"] body {
    background-color: #020617;
    color: #f1f5f9;
  }

  /* Fundos */

  html[data-theme="escuro"] [class~="bg-white"],
  html[data-theme="escuro"] [class~="bg-white/85"],
  html[data-theme="escuro"] [class~="bg-white/80"] {
    background-color: #1e293b !important;
  }

  html[data-theme="escuro"] [class~="bg-gray-50"],
  html[data-theme="escuro"] [class~="bg-slate-50"] {
    background-color: #0f172a !important;
  }

  html[data-theme="escuro"] [class~="bg-slate-100"] {
    background-color: #1e293b !important;
  }

  html[data-theme="escuro"] [class~="bg-slate-200"] {
    background-color: #334155 !important;
  }

  html[data-theme="escuro"] [class~="bg-violet-50"],
  html[data-theme="escuro"] [class~="bg-violet-50/50"],
  html[data-theme="escuro"] [class~="bg-purple-50"] {
    background-color: #2e1065 !important;
  }

  html[data-theme="escuro"] [class~="bg-violet-100"],
  html[data-theme="escuro"] [class~="bg-purple-100"] {
    background-color: #4c1d95 !important;
  }

  html[data-theme="escuro"] [class~="bg-teal-50"] {
    background-color: #042f2e !important;
  }

  html[data-theme="escuro"] [class~="bg-teal-100"] {
    background-color: #134e4a !important;
  }

  /* Gradientes */

  html[data-theme="escuro"] [class~="from-violet-50"],
  html[data-theme="escuro"] [class~="from-violet-50/80"],
  html[data-theme="escuro"] [class~="from-violet-100"] {
    --tw-gradient-from: #1e1b4b var(--tw-gradient-from-position) !important;
  }

  html[data-theme="escuro"] [class~="via-white"] {
    --tw-gradient-via: #1e293b var(--tw-gradient-via-position) !important;
  }

  html[data-theme="escuro"] [class~="to-white"],
  html[data-theme="escuro"] [class~="to-teal-50"] {
    --tw-gradient-to: #0f172a var(--tw-gradient-to-position) !important;
  }

  html[data-theme="escuro"] [class~="from-teal-50"] {
    --tw-gradient-from: #042f2e var(--tw-gradient-from-position) !important;
  }

  /* Textos */

  html[data-theme="escuro"] [class~="text-slate-900"],
  html[data-theme="escuro"] [class~="text-gray-900"] {
    color: #f8fafc !important;
  }

  html[data-theme="escuro"] [class~="text-slate-800"],
  html[data-theme="escuro"] [class~="text-slate-700"],
  html[data-theme="escuro"] [class~="text-gray-700"] {
    color: #e2e8f0 !important;
  }

  html[data-theme="escuro"] [class~="text-slate-600"],
  html[data-theme="escuro"] [class~="text-gray-600"] {
    color: #cbd5e1 !important;
  }

  html[data-theme="escuro"] [class~="text-slate-500"],
  html[data-theme="escuro"] [class~="text-gray-500"],
  html[data-theme="escuro"] [class~="text-slate-400"],
  html[data-theme="escuro"] [class~="text-gray-400"] {
    color: #94a3b8 !important;
  }

  html[data-theme="escuro"] [class~="text-violet-900"],
  html[data-theme="escuro"] [class~="text-violet-800"],
  html[data-theme="escuro"] [class~="text-violet-700"],
  html[data-theme="escuro"] [class~="text-purple-700"] {
    color: #c4b5fd !important;
  }

  html[data-theme="escuro"] [class~="text-teal-700"],
  html[data-theme="escuro"] [class~="text-teal-600"] {
    color: #5eead4 !important;
  }

  /* Bordas */

  html[data-theme="escuro"] [class~="border"],
  html[data-theme="escuro"] [class~="border-t"],
  html[data-theme="escuro"] [class~="border-b"],
  html[data-theme="escuro"] [class~="border-l"],
  html[data-theme="escuro"] [class~="border-r"],
  html[data-theme="escuro"] [class~="border-slate-100"],
  html[data-theme="escuro"] [class~="border-slate-200"],
  html[data-theme="escuro"] [class~="border-slate-300"],
  html[data-theme="escuro"] [class~="border-gray-100"],
  html[data-theme="escuro"] [class~="border-gray-200"] {
    border-color: #334155 !important;
  }

  html[data-theme="escuro"] [class~="border-violet-100"],
  html[data-theme="escuro"] [class~="border-violet-200"],
  html[data-theme="escuro"] [class~="border-purple-100"],
  html[data-theme="escuro"] [class~="border-purple-200"] {
    border-color: #5b21b6 !important;
  }

  html[data-theme="escuro"] [class~="border-teal-100"],
  html[data-theme="escuro"] [class~="border-teal-200"] {
    border-color: #115e59 !important;
  }

  /* Sombras */

  html[data-theme="escuro"] [class*="shadow-slate-200"],
  html[data-theme="escuro"] [class*="shadow-violet-100"],
  html[data-theme="escuro"] [class*="shadow-violet-200"] {
    --tw-shadow-color: rgb(0 0 0 / 0.35) !important;
  }

  /* Campos */

  html[data-theme="escuro"] input,
  html[data-theme="escuro"] textarea,
  html[data-theme="escuro"] select {
    color: #f1f5f9;
    background-color: #1e293b;
    border-color: #475569;
  }

  html[data-theme="escuro"] input::placeholder,
  html[data-theme="escuro"] textarea::placeholder {
    color: #94a3b8;
  }

  html[data-theme="escuro"] select option {
    color: #f1f5f9;
    background-color: #1e293b;
  }

  /* Feedback */

  html[data-theme="escuro"] [class~="bg-red-50"] {
    background-color: #450a0a !important;
  }

  html[data-theme="escuro"] [class~="bg-emerald-50"],
  html[data-theme="escuro"] [class~="bg-green-50"] {
    background-color: #022c22 !important;
  }

  html[data-theme="escuro"] [class~="border-red-200"] {
    border-color: #991b1b !important;
  }

  html[data-theme="escuro"] [class~="border-emerald-200"] {
    border-color: #065f46 !important;
  }

  html[data-theme="escuro"] [class~="text-red-800"] {
    color: #fecaca !important;
  }

  html[data-theme="escuro"] [class~="text-red-700"] {
    color: #fca5a5 !important;
  }

  html[data-theme="escuro"] [class~="text-emerald-800"] {
    color: #a7f3d0 !important;
  }

  /* Transições */

  html[data-theme="intermediario"] main,
  html[data-theme="escuro"] main,
  html[data-theme="intermediario"] article,
  html[data-theme="escuro"] article,
  html[data-theme="intermediario"] form,
  html[data-theme="escuro"] form {
    transition:
      background-color 250ms ease,
      border-color 250ms ease,
      color 250ms ease,
      box-shadow 250ms ease;
  }
`;

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
      <style>{GLOBAL_THEME_STYLES}</style>
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
