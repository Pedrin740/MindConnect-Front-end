import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, UserPlus, LogIn, LogOut, UserRound } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const navigation = [
  { name: "Início", path: "/" },
  { name: "Serviços", path: "/servicos" },
  { name: "Conteúdos", path: "/conteudos" },
  { name: "Diário", path: "/diario" },
  { name: "Sobre", path: "/sobre" },
  { name: "Integrantes", path: "/integrantes" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-violet-700"
        : "text-slate-600 hover:text-violet-700"
    }`;

  async function handleLogout() {
    await logout();
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-violet-100/70 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-5 lg:px-8">
        <NavLink
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex min-w-0 items-center gap-2"
          aria-label="Mind Connect - Página inicial"
        >
          <span className="whitespace-nowrap text-xl font-bold tracking-tight text-violet-700 sm:text-2xl">
            Mind<span className="text-teal-500">Connect</span>
          </span>
        </NavLink>

        <div className="hidden items-center gap-5 lg:flex xl:gap-8">
          {navigation.map((item) => (
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

        <div className="hidden min-w-[220px] items-center justify-end gap-2 lg:flex xl:gap-3">
          {isAuthenticated && user ? (
            <>
              <div className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700">
                <UserRound
                  size={18}
                  className="text-violet-700"
                />

                <span className="max-w-36 truncate">
                  {user.nome}
                </span>
              </div>

              <button
                type="button"
                onClick={() => void handleLogout()}
                className="inline-flex items-center gap-2 rounded-xl border border-violet-200 px-4 py-3 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-50"
              >
                <LogOut size={17} />
                Sair
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-50 xl:px-4"
              >
                <LogIn size={17} />
                Entrar
              </NavLink>

              <NavLink
                to="/cadastro"
                className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-800 xl:px-5"
              >
                <UserPlus size={17} />
                Criar conta
              </NavLink>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="rounded-xl p-2 text-violet-700 transition-colors hover:bg-violet-50 lg:hidden"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          aria-controls="menu-mobile"
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </nav>

      {menuOpen && (
        <div
          id="menu-mobile"
          className="border-t border-violet-100 bg-white px-4 py-4 shadow-lg sm:px-5 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-violet-50 text-violet-700"
                      : "text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {isAuthenticated && user ? (
              <>
                <div className="mt-2 flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-800">
                  <UserRound size={18} />

                  <span className="truncate">
                    {user.nome}
                  </span>
                </div>

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
