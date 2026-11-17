import { useCallback, useEffect, useState } from "react";
import { ShieldCheck, Users, UserPlus, Trash2, RefreshCw, Shield, Search } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { cadastrarAdministrador, excluirAdministrador, listarAdministradores, listarUsuarios, atualizarNivelAdministrador, type Administrador, type UsuarioAdmin, type NivelAcessoAdmin } from "../services/administradorService";

function Admin() {
  const { user, token, isLoading: authLoading } = useAuth();

  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>([]);
  const [administradores, setAdministradores] = useState<Administrador[]>([]);

  const [busca, setBusca] = useState("");
  const [nivelNovoAdmin, setNivelNovoAdmin] =
    useState<NivelAcessoAdmin>("ADMIN");

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [processandoId, setProcessandoId] = useState<number | null>(null);

  const carregarDados = useCallback(
    async (mostrarCarregamento = true) => {
      if (!token) return;

      if (mostrarCarregamento) {
        setCarregando(true);
      }

      try {
        const [listaUsuarios, listaAdministradores] =
          await Promise.all([
            listarUsuarios(token),
            listarAdministradores(token),
          ]);

        setErro("");
        setUsuarios(listaUsuarios);
        setAdministradores(listaAdministradores);
      } catch (error) {
        console.error("Erro ao carregar painel administrativo:", error);

        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os dados administrativos."
        );
      } finally {
        setCarregando(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (authLoading || !user?.administrador || !token) return;

    let ativo = true;
    const tokenAutenticacao = token;

    async function carregarDadosIniciais() {
      try {
        const [listaUsuarios, listaAdministradores] =
          await Promise.all([
            listarUsuarios(tokenAutenticacao),
            listarAdministradores(tokenAutenticacao),
          ]);

        if (!ativo) return;

        setErro("");
        setUsuarios(listaUsuarios);
        setAdministradores(listaAdministradores);
      } catch (error) {
        if (!ativo) return;

        console.error("Erro ao carregar painel administrativo:", error);

        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os dados administrativos."
        );
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void carregarDadosIniciais();

    return () => {
      ativo = false;
    };
  }, [authLoading, user?.administrador, token]);

  async function concederAcesso(idUsuario: number) {
    if (!token) return;

    setProcessandoId(idUsuario);
    setErro("");
    setMensagem("");

    try {
      await cadastrarAdministrador(
        idUsuario,
        nivelNovoAdmin,
        token
      );

      setMensagem("Acesso administrativo concedido com sucesso.");
      await carregarDados();
    } catch (error) {
      console.error("Erro ao conceder acesso:", error);

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível conceder o acesso administrativo."
      );
    } finally {
      setProcessandoId(null);
    }
  }

  async function alterarNivel(
    administrador: Administrador,
    nivel: NivelAcessoAdmin
  ) {
    if (!token) return;

    setProcessandoId(administrador.idUsuario);
    setErro("");
    setMensagem("");

    try {
      await atualizarNivelAdministrador(
        administrador.idAdministrador,
        nivel,
        token
      );

      setMensagem("Nível de acesso atualizado com sucesso.");
      await carregarDados();
    } catch (error) {
      console.error("Erro ao atualizar nível:", error);

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar o nível de acesso."
      );
    } finally {
      setProcessandoId(null);
    }
  }

  async function removerAcesso(administrador: Administrador) {
    if (!token) return;

    if (administrador.idUsuario === user?.id) {
      setErro(
        "Você não pode remover seu próprio acesso administrativo por este painel."
      );
      return;
    }

    const confirmar = window.confirm(
      `Deseja remover o acesso administrativo de ${administrador.nomeUsuario}?`
    );

    if (!confirmar) return;

    setProcessandoId(administrador.idUsuario);
    setErro("");
    setMensagem("");

    try {
      await excluirAdministrador(
        administrador.idAdministrador,
        token
      );

      setMensagem("Acesso administrativo removido com sucesso.");
      await carregarDados();
    } catch (error) {
      console.error("Erro ao remover acesso:", error);

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível remover o acesso administrativo."
      );
    } finally {
      setProcessandoId(null);
    }
  }

  const usuariosDisponiveis = usuarios.filter(
    (usuario) =>
      !administradores.some(
        (administrador) =>
          administrador.idUsuario === usuario.idUsuario
      )
  );

  const usuariosFiltrados = usuariosDisponiveis.filter((usuario) => {
    const termo = busca.toLowerCase();

    return (
      usuario.nome.toLowerCase().includes(termo) ||
      usuario.email.toLowerCase().includes(termo)
    );
  });

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm font-medium text-slate-600">
          Verificando permissões...
        </p>
      </main>
    );
  }

  if (!user?.administrador) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Shield className="mx-auto text-violet-600" size={40} />

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Acesso restrito
          </h1>

          <p className="mt-2 text-sm leading-7 text-slate-600">
            Esta área está disponível somente para usuários com
            permissão administrativa.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-violet-700 via-violet-600 to-purple-500 px-4 py-12 text-white sm:px-6 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
            <ShieldCheck size={17} />
            Gerenciamento da plataforma
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Painel administrativo
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-8 text-violet-100 sm:text-lg">
            Gerencie os usuários e as permissões administrativas
            do Mind Connect.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {erro && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            {erro}
          </div>
        )}

        {mensagem && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-teal-200 bg-teal-50 px-5 py-4 text-sm text-teal-700"
          >
            {mensagem}
          </div>
        )}

        <div className="mb-8 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Usuários cadastrados
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {usuarios.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <Users size={24} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Administradores
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {administradores.length}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <ShieldCheck size={24} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <UserPlus size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Conceder acesso
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Adicione um usuário à administração.
                </p>
              </div>
            </div>

            <label
              htmlFor="buscarUsuario"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Buscar usuário
            </label>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="buscarUsuario"
                type="search"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Nome ou e-mail"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <label
              htmlFor="nivelNovoAdmin"
              className="mb-2 mt-5 block text-sm font-semibold text-slate-700"
            >
              Nível de acesso
            </label>

            <select
              id="nivelNovoAdmin"
              value={nivelNovoAdmin}
              onChange={(event) =>
                setNivelNovoAdmin(
                  event.target.value as NivelAcessoAdmin
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >
              <option value="ADMIN">Administrador</option>
              <option value="SUPERVISOR">Supervisor</option>
            </select>

            <div className="mt-6 space-y-3">
              {carregando ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  Carregando usuários...
                </p>
              ) : usuariosFiltrados.length > 0 ? (
                usuariosFiltrados.map((usuario) => (
                  <div
                    key={usuario.idUsuario}
                    className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {usuario.nome}
                      </p>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        {usuario.email}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        void concederAcesso(usuario.idUsuario)
                      }
                      disabled={processandoId === usuario.idUsuario}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <UserPlus size={16} />
                      {processandoId === usuario.idUsuario
                        ? "Adicionando..."
                        : "Adicionar"}
                    </button>
                  </div>
                ))
              ) : (
                <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  Nenhum usuário disponível para adicionar.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <ShieldCheck size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Administradores atuais
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Gerencie os níveis de acesso.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {carregando ? (
                <p className="py-8 text-center text-sm text-slate-500">
                  Carregando administradores...
                </p>
              ) : administradores.length > 0 ? (
                administradores.map((administrador) => (
                  <div
                    key={administrador.idAdministrador}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-900">
                          {administrador.nomeUsuario}
                        </p>

                        <p className="mt-1 truncate text-xs text-slate-500">
                          {administrador.emailUsuario}
                        </p>
                      </div>

                      <span className="w-fit rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                        {administrador.nivelAcesso === "ADMIN"
                          ? "Administrador"
                          : "Supervisor"}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                      <select
                        aria-label={`Nível de acesso de ${administrador.nomeUsuario}`}
                        value={administrador.nivelAcesso}
                        onChange={(event) =>
                          void alterarNivel(
                            administrador,
                            event.target.value as NivelAcessoAdmin
                          )
                        }
                        disabled={
                          processandoId === administrador.idUsuario
                        }
                        className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-violet-500 disabled:opacity-50"
                      >
                        <option value="ADMIN">Administrador</option>
                        <option value="SUPERVISOR">Supervisor</option>
                      </select>

                      <button
                        type="button"
                        onClick={() =>
                          void removerAcesso(administrador)
                        }
                        disabled={
                          processandoId === administrador.idUsuario ||
                          administrador.idUsuario === user?.id
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Trash2 size={16} />
                        Remover
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="rounded-xl bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                  Nenhum administrador encontrado.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => void carregarDados()}
              disabled={carregando}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 px-4 py-3 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <RefreshCw
                size={17}
                className={carregando ? "animate-spin" : ""}
              />
              Atualizar dados
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Admin;