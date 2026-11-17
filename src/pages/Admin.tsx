import { useCallback, useEffect, useState } from "react";
import { ShieldCheck, Users, UserPlus, Trash2, RefreshCw, Shield, Search } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { cadastrarAdministrador, excluirAdministrador, listarAdministradores, listarUsuarios, atualizarNivelAdministrador, type Administrador,type UsuarioAdmin, type NivelAcessoAdmin } from "../services/administradorService";

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

  const carregarDados = useCallback(async () => {
    if (!token) {
      setCarregando(false);
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      const [listaUsuarios, listaAdministradores] =
        await Promise.all([
          listarUsuarios(token),
          listarAdministradores(token),
        ]);

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
  }, [token]);

  useEffect(() => {
    if (!authLoading && user?.administrador) {
      void carregarDados();
    } else if (!authLoading) {
      setCarregando(false);
    }
  }, [authLoading, user?.administrador, carregarDados]);

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
      setErro("Você não pode remover seu próprio acesso administrativo por este painel.");
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

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-600">
          Verificando permissões...
        </p>
      </main>
    );
  }

  if (!user || !token || !user.administrador) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <Shield className="mx-auto text-red-500" size={40} />

          <h1 className="mt-4 text-xl font-bold text-slate-900">
            Acesso não autorizado
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            Esta área é exclusiva para administradores do Mind Connect.
          </p>
        </div>
      </main>
    );
  }

  const idsAdministradores = new Set(
    administradores.map((admin) => admin.idUsuario)
  );

  const usuariosDisponiveis = usuarios.filter((usuario) => {
    const termo = busca.toLowerCase();

    const correspondeBusca =
      usuario.nome.toLowerCase().includes(termo) ||
      usuario.email.toLowerCase().includes(termo) ||
      String(usuario.idUsuario).includes(termo);

    return (
      correspondeBusca &&
      !idsAdministradores.has(usuario.idUsuario)
    );
  });

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-violet-950 px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm">
            <ShieldCheck size={17} />
            Área administrativa
          </div>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Painel administrativo
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Gerencie os usuários cadastrados e controle os níveis
            de acesso administrativo da plataforma.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-8 px-6 py-10 lg:px-8">
        {/* Indicadores */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Usuários cadastrados
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {usuarios.length}
                </p>
              </div>

              <div className="rounded-xl bg-violet-50 p-3 text-violet-700">
                <Users size={25} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Administradores
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {administradores.length}
                </p>
              </div>

              <div className="rounded-xl bg-teal-50 p-3 text-teal-700">
                <ShieldCheck size={25} />
              </div>
            </div>
          </div>
        </div>

        {/* Feedback */}
        {erro && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {erro}
          </div>
        )}

        {mensagem && (
          <div
            role="status"
            className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
          >
            {mensagem}
          </div>
        )}

        {/* Lista de administradores */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Administradores da plataforma
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Consulte e gerencie os níveis de acesso.
              </p>
            </div>

            <button
              type="button"
              onClick={() => void carregarDados()}
              disabled={carregando}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Atualizar
            </button>
          </div>

          {carregando ? (
            <p className="py-10 text-center text-sm text-slate-500">
              Carregando dados...
            </p>
          ) : administradores.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">
              Nenhum administrador encontrado.
            </p>
          ) : (
            <div className="mt-6 space-y-4">
              {administradores.map((admin) => (
                <article
                  key={admin.idAdministrador}
                  className="grid gap-4 rounded-xl border border-slate-200 p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {admin.nomeUsuario}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {admin.emailUsuario}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      ID do usuário: {admin.idUsuario}
                    </p>
                  </div>

                  <select
                    value={admin.nivelAcesso}
                    disabled={processandoId === admin.idUsuario}
                    onChange={(event) =>
                      void alterarNivel(
                        admin,
                        event.target.value as NivelAcessoAdmin
                      )
                    }
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-violet-500 disabled:opacity-50"
                    aria-label={`Nível de acesso de ${admin.nomeUsuario}`}
                  >
                    <option value="ADMIN">ADMIN</option>
                    <option value="SUPERVISOR">SUPERVISOR</option>
                  </select>

                  <button
                    type="button"
                    disabled={
                      processandoId === admin.idUsuario ||
                      admin.idUsuario === user.id
                    }
                    onClick={() => void removerAcesso(admin)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                    title={
                      admin.idUsuario === user.id
                        ? "Não é possível remover seu próprio acesso"
                        : "Remover acesso administrativo"
                    }
                  >
                    <Trash2 size={16} />
                    Remover acesso
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Conceder acesso */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-violet-50 p-3 text-violet-700">
              <UserPlus size={23} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Conceder acesso administrativo
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Selecione um usuário cadastrado para conceder acesso.
              </p>
            </div>
          </div>

          <div className="mt-6">
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
                type="text"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Pesquise por nome, e-mail ou ID..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>
          </div>

          <div className="mt-5 max-w-xs">
            <label
              htmlFor="nivelNovoAdmin"
              className="mb-2 block text-sm font-semibold text-slate-700"
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
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-violet-500"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="SUPERVISOR">SUPERVISOR</option>
            </select>
          </div>

          {carregando ? (
            <p className="mt-6 text-sm text-slate-500">
              Carregando usuários...
            </p>
          ) : usuariosDisponiveis.length === 0 ? (
            <p className="mt-6 rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-500">
              Nenhum usuário disponível para conceder acesso.
            </p>
          ) : (
            <div className="mt-6 space-y-3">
              {usuariosDisponiveis.map((usuario) => (
                <div
                  key={usuario.idUsuario}
                  className="flex flex-col gap-3 rounded-xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {usuario.nome}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {usuario.email}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      ID: {usuario.idUsuario}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={processandoId === usuario.idUsuario}
                    onClick={() =>
                      void concederAcesso(usuario.idUsuario)
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <UserPlus size={16} />
                    {processandoId === usuario.idUsuario
                      ? "Processando..."
                      : "Conceder acesso"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

export default Admin;