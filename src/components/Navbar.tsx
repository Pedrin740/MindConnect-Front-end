import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Menu, X, UserPlus, LogIn, LogOut, UserRound, Settings,} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";

const navigation = [
  { name: "Início", path: "/" },
  { name: "Serviços", path: "/servicos" },
  { name: "Conteúdos", path: "/conteudos" },
  { name: "Diário", path: "/diario" },
  { name: "Sobre", path: "/sobre" },
  { name: "FAQ", path: "/faq" },
  { name: "Contato", path: "/contato" },
  { name: "Integrantes", path: "/integrantes" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    user,
    isAuthenticated,
    logout,
    isLoading,
  } = useAuth();

  const { theme } = useTheme();

  const temaEscuro = theme === "escuro";

  const estiloHeader = temaEscuro
    ? "border-slate-700 bg-slate-900/95"
    : theme === "intermediario"
      ? "border-slate-300 bg-slate-100/95"
      : "border-violet-100/70 bg-white/85";

  const estiloTexto = temaEscuro
    ? "text-slate-200 hover:text-violet-300"
    : "text-slate-600 hover:text-violet-700";

  const estiloMenu = temaEscuro
    ? "border-slate-700 bg-slate-900"
    : theme === "intermediario"
      ? "border-slate-300 bg-slate-100"
      : "border-violet-100 bg-white";

  const visibleNavigation = user?.administrador
    ? [
        ...navigation,
        {
          name: "Administração",
          path: "/admin",
        },
      ]
    : navigation;

  const linkClasses = ({
    isActive,
  }: {
    isActive: boolean;
  }) =>
    `relative whitespace-nowrap text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-violet-700"
        : estiloTexto
    }`;

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-colors duration-300 ${estiloHeader}`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-5 lg:px-8">

        {/* Logo e nome da plataforma */}
        <NavLink
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex shrink-0 items-center gap-2.5"
          aria-label="Mind Connect - Página inicial"
        >
          <img
            src="/images/logo-mindconnect.png"
            alt="Símbolo do Mind Connect"
            className="h-9 w-9 shrink-0 rounded-lg object-cover shadow-sm"
          />

          <span className="whitespace-nowrap text-xl font-bold tracking-tight text-violet-700 sm:text-2xl">
            Mind<span className="text-teal-500">Connect</span>
          </span>
        </NavLink>

        {/* Navegação desktop */}
        <div className="hidden items-center gap-3 lg:flex xl:gap-5">
          {visibleNavigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={linkClasses}
            >
              {({ isActive }) => (
                <span className="relative py-2">
                  {item.name}

                  {isActive && (
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-violet-600" />
                  )}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Área da conta desktop */}
        <div className="hidden shrink-0 items-center justify-end gap-2 lg:flex xl:gap-3">
          {isLoading ? (
            <div
              className="h-10 w-36 animate-pulse rounded-xl bg-slate-200"
              aria-label="Carregando conta"
            />
          ) : isAuthenticated && user ? (
            <>
              <Link
                to="/configuracoes"
                className={`inline-flex max-w-44 items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold transition-colors hover:bg-violet-50 hover:text-violet-700 ${
                  temaEscuro
                    ? "text-slate-200 hover:bg-slate-800 hover:text-violet-300"
                    : "text-slate-700"
                }`}
                aria-label="Abrir configurações da conta"
              >
                <UserRound
                  size={18}
                  className="shrink-0 text-violet-700"
                />

                <span className="truncate">
                  {user.nome}
                </span>

                <Settings
                  size={15}
                  className="shrink-0 text-slate-400"
                />
              </Link>

              <button
                type="button"
                onClick={() => void handleLogout()}
                className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-violet-200 px-4 py-3 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-50"
              >
                <LogOut size={17} />
                Sair
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-50 xl:px-4"
              >
                <LogIn size={17} />
                Entrar
              </NavLink>

              <NavLink
                to="/cadastro"
                className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-violet-700 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-800 xl:px-5"
              >
                <UserPlus size={17} />
                Criar conta
              </NavLink>
            </>
          )}
        </div>

        {/* Botão do menu mobile */}
        <button
          type="button"
          onClick={() =>
            setMenuOpen((current) => !current)
          }
          className="shrink-0 rounded-xl p-2 text-violet-700 transition-colors hover:bg-violet-50 lg:hidden"
          aria-label={
            menuOpen ? "Fechar menu" : "Abrir menu"
          }
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {/* Menu mobile */}
      {menuOpen && (
        <div
          id="menu-mobile"
          className={`border-t px-4 py-4 shadow-lg sm:px-5 lg:hidden ${estiloMenu}`}
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {visibleNavigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-violet-50 text-violet-700"
                      : temaEscuro
                        ? "text-slate-200 hover:bg-slate-800 hover:text-violet-300"
                        : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {isLoading ? (
              <div
                className="mt-2 h-11 animate-pulse rounded-xl bg-slate-200"
                aria-label="Carregando conta"
              />
            ) : isAuthenticated && user ? (
              <>
                <Link
                  to="/configuracoes"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-800"
                >
                  <UserRound size={18} />
                  {user.nome}
                  <Settings size={16} />
                </Link>

                <button
                  type="button"
                  onClick={() => void handleLogout()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 px-5 py-3 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-50"
                >
                  <LogOut size={17} />
                  Sair
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl border border-violet-200 px-5 py-3 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-50"
                >
                  <LogIn size={17} />
                  Entrar
                </NavLink>

                <NavLink
                  to="/cadastro"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-800"
                >
                  <UserPlus size={17} />
                  Criar conta
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
