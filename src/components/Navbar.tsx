import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, UserPlus, LogIn } from "lucide-react";

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

  const linkClasses = ({ isActive }: { isActive: boolean }) =>
    `relative text-sm font-medium transition-colors duration-200 ${
      isActive
        ? "text-violet-700"
        : "text-slate-600 hover:text-violet-700"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-violet-100/70 bg-white/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

        <NavLink
          to="/"
          onClick={() => setMenuOpen(false)}
          className="flex items-center gap-2"
          aria-label="Mind Connect - Página inicial"
        >
          <span className="text-2xl font-bold tracking-tight text-violet-700">
            Mind<span className="text-teal-500">Connect</span>
          </span>
        </NavLink>

        <div className="hidden items-center gap-8 md:flex">
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

        <div className="hidden items-center gap-3 md:flex">

          <NavLink
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-50"
          >
            <LogIn size={17} />
            Entrar
          </NavLink>

          <NavLink
            to="/cadastro"
            className="inline-flex items-center gap-2 rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-violet-800"
          >
            <UserPlus size={17} />
            Criar conta
          </NavLink>

        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="rounded-xl p-2 text-violet-700 transition-colors hover:bg-violet-50 md:hidden"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>

      </nav>

      {menuOpen && (
        <div className="border-t border-violet-100 bg-white px-5 py-4 shadow-lg md:hidden">
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

          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;