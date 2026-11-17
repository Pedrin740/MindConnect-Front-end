import { useCallback, useEffect, useState, type FormEvent } from "react";
import { BookHeart, CalendarDays, Heart, LockKeyhole, Smile, Meh, Frown, Plus, Trash2, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ApiError } from "../services/api";
import { cadastrarRegistroBemEstar, excluirRegistroBemEstar, listarRegistrosBemEstar, type RegistroBemEstar } from "../services/registroBemEstarService";

type Humor = "Muito bem" | "Bem" | "Neutro" | "Mal" | "Muito mal";

const opcoesHumor: {
  valor: Humor;
  nivel: number;
  emoji: string;
  icone: typeof Smile;
}[] = [
  { valor: "Muito bem", nivel: 5, emoji: "😁", icone: Smile },
  { valor: "Bem", nivel: 4, emoji: "🙂", icone: Smile },
  { valor: "Neutro", nivel: 3, emoji: "😐", icone: Meh },
  { valor: "Mal", nivel: 2, emoji: "😟", icone: Frown },
  { valor: "Muito mal", nivel: 1, emoji: "😢", icone: Frown },
];

function obterDataAtual(): string {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

function formatarData(data: string): string {
  return new Date(`${data}T12:00:00`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function Diario() {
  const { user, token, isLoading: authLoading } = useAuth();

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [humor, setHumor] = useState<Humor | "">("");
  const [data, setData] = useState(obterDataAtual());
  const [descricao, setDescricao] = useState("");

  const [registros, setRegistros] = useState<RegistroBemEstar[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  const carregarRegistros = useCallback(
    async (mostrarCarregamento = true) => {
      if (!token) return;

      if (mostrarCarregamento) {
        setCarregando(true);
      }

      try {
        const dados = await listarRegistrosBemEstar(token);

        setErro("");

        setRegistros(
          [...dados].sort((a, b) =>
            b.dataRegistro.localeCompare(a.dataRegistro)
          )
        );
      } catch (error) {
        console.error("Erro ao carregar diário:", error);

        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar seus registros."
        );
      } finally {
        setCarregando(false);
      }
    },
    [token]
  );

  useEffect(() => {
    if (authLoading || !token) return;

    let ativo = true;
    const tokenAutenticacao = token;

    async function carregarRegistrosIniciais() {
      try {
        const dados = await listarRegistrosBemEstar(
          tokenAutenticacao
        );

        if (!ativo) return;

        setErro("");
        setRegistros(
          [...dados].sort((a, b) =>
            b.dataRegistro.localeCompare(a.dataRegistro)
          )
        );
      } catch (error) {
        if (!ativo) return;

        console.error("Erro ao carregar diário:", error);
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar seus registros."
        );
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }

    void carregarRegistrosIniciais();

    return () => {
      ativo = false;
    };
  }, [authLoading, token]);

  function limparFormulario() {
    setHumor("");
    setData(obterDataAtual());
    setDescricao("");
    setErro("");
  }

  async function registrarBemEstar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user || !token) {
      setErro("Você precisa estar autenticado para salvar um registro.");
      return;
    }

    if (!humor) {
      setErro("Selecione como você está se sentindo.");
      return;
    }

    if (!descricao.trim()) {
      setErro("Descreva um pouco como foi o seu dia.");
      return;
    }

    const opcaoSelecionada = opcoesHumor.find(
      (opcao) => opcao.valor === humor
    );

    if (!opcaoSelecionada) {
      setErro("Selecione uma opção de humor válida.");
      return;
    }

    if (registros.some((registro) => registro.dataRegistro === data)) {
      setErro(
        "Você já possui um registro nesta data. Escolha outro dia para registrar seu bem-estar."
      );
      return;
    }

    setSalvando(true);
    setErro("");

    try {
      await cadastrarRegistroBemEstar(
        {
          idUsuario: user.id,
          dataRegistro: data,
          humor,
          nivelHumor: opcaoSelecionada.nivel,
          observacoes: descricao.trim(),
        },
        token
      );

      await carregarRegistros();

      limparFormulario();
      setMostrarFormulario(false);
    } catch (error) {
      console.error("Erro ao salvar registro:", error);

      if (error instanceof ApiError && error.status === 409) {
        setErro(
          "Você já possui um registro de bem-estar nesta data. Escolha outro dia para continuar."
        );
      } else if (error instanceof ApiError && error.status === 401) {
        setErro(
          "Sua sessão expirou. Entre novamente para salvar seu registro."
        );
      } else {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível salvar seu registro."
        );
      }
    } finally {
      setSalvando(false);
    }
  }

  async function removerRegistro(id: number) {
    if (!token) {
      setErro("Sua sessão expirou. Entre novamente na plataforma.");
      return;
    }

    if (
      !window.confirm(
        "Tem certeza de que deseja excluir este registro?"
      )
    ) {
      return;
    }

    setExcluindoId(id);
    setErro("");

    try {
      await excluirRegistroBemEstar(id, token);

      setRegistros((registrosAtuais) =>
        registrosAtuais.filter(
          (registro) => registro.idRegistro !== id
        )
      );
    } catch (error) {
      console.error("Erro ao excluir registro:", error);

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o registro."
      );
    } finally {
      setExcluindoId(null);
    }
  }

  function obterOpcaoHumor(valor: string) {
    return opcoesHumor.find((opcao) => opcao.valor === valor);
  }

  if (authLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <p className="text-sm text-slate-500">
          Verificando autenticação...
        </p>
      </main>
    );
  }

  if (!user || !token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <LockKeyhole
            size={42}
            className="mx-auto text-violet-600"
          />

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Acesso restrito
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Entre na sua conta para acessar seu diário de bem-estar.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-violet-700 via-violet-600 to-purple-500 px-4 py-12 text-white sm:px-6 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
            <BookHeart size={17} />
            Autoconhecimento e cuidado
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Meu diário de bem-estar
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-violet-100 sm:text-lg">
            Um espaço pessoal para acompanhar seus sentimentos,
            registrar suas experiências e refletir sobre sua
            jornada de bem-estar emocional.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <Heart size={24} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Acompanhe seu bem-estar
            </h2>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              Registre como você está se sentindo e observe
              suas emoções ao longo do tempo.
            </p>
          </div>

          <div className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <LockKeyhole size={24} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Um espaço pessoal
            </h2>

            <p className="mt-2 text-sm leading-7 text-slate-600">
              Seus registros são pessoais e destinados ao
              acompanhamento da sua própria jornada.
            </p>
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CalendarDays size={21} className="text-violet-600" />

                <h2 className="text-xl font-bold text-slate-900">
                  Histórico de registros
                </h2>
              </div>

              <p className="mt-2 text-sm text-slate-500">
                Acompanhe os registros realizados no seu diário.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setMostrarFormulario(true);
                setErro("");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              <Plus size={18} />
              Novo registro
            </button>
          </div>

          {mostrarFormulario && (
            <form
              onSubmit={registrarBemEstar}
              className="mt-8 rounded-2xl border border-violet-100 bg-violet-50/50 p-5 sm:p-7"
            >
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Novo registro
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Reserve um momento para refletir sobre seu dia.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMostrarFormulario(false);
                    limparFormulario();
                  }}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-white hover:text-slate-800"
                  aria-label="Fechar formulário"
                >
                  <X size={20} />
                </button>
              </div>

              <div>
                <label className="mb-3 block text-sm font-semibold text-slate-800">
                  Como você está se sentindo?
                </label>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {opcoesHumor.map((opcao) => {
                    const selecionado = humor === opcao.valor;

                    return (
                      <button
                        key={opcao.valor}
                        type="button"
                        onClick={() => {
                          setHumor(opcao.valor);
                          setErro("");
                        }}
                        aria-pressed={selecionado}
                        className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition ${
                          selecionado
                            ? "border-violet-500 bg-violet-100 text-violet-800"
                            : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"
                        }`}
                      >
                        <span className="text-3xl">{opcao.emoji}</span>

                        <span className="text-xs font-semibold">
                          {opcao.valor}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="dataRegistro"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Data do registro
                </label>

                <input
                  id="dataRegistro"
                  type="date"
                  value={data}
                  max={obterDataAtual()}
                  onChange={(event) => setData(event.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100 sm:max-w-xs"
                />
              </div>

              <div className="mt-6">
                <label
                  htmlFor="descricaoRegistro"
                  className="mb-2 block text-sm font-semibold text-slate-800"
                >
                  Como foi seu dia?
                </label>

                <textarea
                  id="descricaoRegistro"
                  value={descricao}
                  onChange={(event) => {
                    setDescricao(event.target.value);
                    setErro("");
                  }}
                  placeholder="Escreva sobre seus sentimentos, experiências ou acontecimentos do dia..."
                  rows={5}
                  maxLength={1000}
                  required
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />

                <p className="mt-2 text-right text-xs text-slate-400">
                  {descricao.length}/1000 caracteres
                </p>
              </div>

              {erro && (
                <p
                  role="alert"
                  className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {erro}
                </p>
              )}

              <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={salvando}
                  onClick={() => {
                    setMostrarFormulario(false);
                    limparFormulario();
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={salvando}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <BookHeart size={17} />
                  {salvando ? "Salvando..." : "Salvar registro"}
                </button>
              </div>
            </form>
          )}

          {erro && !mostrarFormulario && (
            <div
              role="alert"
              className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {erro}

              <button
                type="button"
                onClick={() => void carregarRegistros()}
                className="ml-2 font-semibold underline"
              >
                Tentar novamente
              </button>
            </div>
          )}

          {carregando ? (
            <div className="mt-8 rounded-2xl bg-slate-50 px-5 py-16 text-center">
              <p className="text-sm text-slate-500">
                Carregando seus registros...
              </p>
            </div>
          ) : registros.length > 0 ? (
            <div className="mt-8 space-y-4">
              {registros.map((registro) => {
                const opcao = obterOpcaoHumor(registro.humor);

                return (
                  <article
                    key={registro.idRegistro}
                    className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-violet-200"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-2xl">
                          {opcao?.emoji ?? "📝"}
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900">
                            {registro.humor}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            {formatarData(registro.dataRegistro)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          void removerRegistro(registro.idRegistro)
                        }
                        disabled={excluindoId === registro.idRegistro}
                        aria-label="Excluir registro"
                        className="self-end rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 sm:self-start"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {registro.observacoes && (
                      <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                        {registro.observacoes}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                <BookHeart size={32} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-slate-900">
                Seu diário está começando!
              </h3>

              <p className="mt-2 max-w-md text-sm leading-7 text-slate-500">
                Você ainda não possui registros. Clique em
                "Novo registro" para começar a acompanhar
                seu bem-estar.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-violet-100 bg-violet-50 p-6">
          <h3 className="font-bold text-violet-900">
            Um lembrete importante
          </h3>

          <p className="mt-2 text-sm leading-7 text-violet-800">
            Não existe uma maneira certa de se sentir. Reserve
            um momento para reconhecer suas emoções sem julgamentos.
            O diário é uma ferramenta de reflexão e não substitui
            o acompanhamento de profissionais de saúde.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Diario;