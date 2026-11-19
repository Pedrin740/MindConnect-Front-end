import { useCallback, useEffect, useState, type FormEvent } from "react";
import { BookHeart, CalendarDays, Heart, LockKeyhole, Smile, Meh, Frown, Plus, Trash2, X } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import { ApiError } from "../services/api";
import { cadastrarRegistroBemEstar, excluirRegistroBemEstar, listarRegistrosBemEstar, type RegistroBemEstar } from "../services/registroBemEstarService";

type Humor =
  | "Muito bem"
  | "Bem"
  | "Neutro"
  | "Mal"
  | "Muito mal";

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
  const { theme } = useTheme();

  const temaEscuro = theme === "escuro";
  const temaIntermediario = theme === "intermediario";

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [humor, setHumor] = useState<Humor | "">("");
  const [data, setData] = useState(obterDataAtual());
  const [descricao, setDescricao] = useState("");

  const [registros, setRegistros] = useState<RegistroBemEstar[]>([]);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [excluindoId, setExcluindoId] = useState<number | null>(null);

  const cores = {
    pagina: temaEscuro
      ? "bg-slate-950"
      : temaIntermediario
        ? "bg-slate-300"
        : "bg-slate-50",

    superficie: temaEscuro
      ? "border-slate-700 bg-slate-900"
      : temaIntermediario
        ? "border-slate-400 bg-slate-200"
        : "border-slate-200 bg-white",

    superficieSecundaria: temaEscuro
      ? "border-slate-700 bg-slate-800"
      : temaIntermediario
        ? "border-slate-400 bg-slate-300"
        : "border-slate-100 bg-slate-50",

    formulario: temaEscuro
      ? "border-violet-800 bg-slate-800"
      : temaIntermediario
        ? "border-violet-300 bg-slate-200"
        : "border-violet-100 bg-violet-50/50",

    titulo: temaEscuro ? "text-white" : "text-slate-900",

    texto: temaEscuro
      ? "text-slate-300"
      : temaIntermediario
        ? "text-slate-700"
        : "text-slate-600",

    textoSecundario: temaEscuro
      ? "text-slate-400"
      : temaIntermediario
        ? "text-slate-600"
        : "text-slate-500",

    label: temaEscuro
      ? "text-slate-200"
      : temaIntermediario
        ? "text-slate-800"
        : "text-slate-800",

    campo: temaEscuro
      ? "border-slate-600 bg-slate-900 text-slate-100 placeholder:text-slate-400"
      : temaIntermediario
        ? "border-slate-400 bg-slate-100 text-slate-900 placeholder:text-slate-500"
        : "border-slate-200 bg-white text-slate-700 placeholder:text-slate-400",

    botaoSecundario: temaEscuro
      ? "border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700"
      : temaIntermediario
        ? "border-slate-400 bg-slate-200 text-slate-800 hover:bg-slate-300"
        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",

    iconeSecundario: temaEscuro
      ? "bg-violet-950 text-violet-300"
      : temaIntermediario
        ? "bg-violet-200 text-violet-800"
        : "bg-violet-50 text-violet-700",

    lembrete: temaEscuro
      ? "border-violet-800 bg-violet-950"
      : temaIntermediario
        ? "border-violet-300 bg-violet-100"
        : "border-violet-100 bg-violet-50",

    textoLembrete: temaEscuro
      ? "text-violet-200"
      : temaIntermediario
        ? "text-violet-950"
        : "text-violet-800",
  };

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
      <main className={`flex min-h-screen items-center justify-center px-4 ${cores.pagina}`}>
        <p className={`text-sm ${cores.textoSecundario}`}>
          Verificando autenticação...
        </p>
      </main>
    );
  }

  if (!user || !token) {
    return (
      <main className={`flex min-h-screen items-center justify-center px-4 ${cores.pagina}`}>
        <div className={`max-w-md rounded-2xl border p-8 text-center shadow-sm ${cores.superficie}`}>
          <LockKeyhole
            size={42}
            className="mx-auto text-violet-600"
          />

          <h1 className={`mt-5 text-2xl font-bold ${cores.titulo}`}>
            Acesso restrito
          </h1>

          <p className={`mt-2 text-sm ${cores.texto}`}>
            Entre na sua conta para acessar seu diário de bem-estar.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen transition-colors duration-300 ${cores.pagina}`}>
      {/* Cabeçalho */}
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
        {/* Cartões informativos */}
        <div className="mb-10 grid gap-6 md:grid-cols-2">
          <div className={`rounded-2xl border p-6 shadow-sm ${cores.superficie}`}>
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cores.iconeSecundario}`}>
              <Heart size={24} />
            </div>

            <h2 className={`mt-5 text-lg font-bold ${cores.titulo}`}>
              Acompanhe seu bem-estar
            </h2>

            <p className={`mt-2 text-sm leading-7 ${cores.texto}`}>
              Registre como você está se sentindo e observe
              suas emoções ao longo do tempo.
            </p>
          </div>

          <div className={`rounded-2xl border p-6 shadow-sm ${cores.superficie}`}>
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
              temaEscuro
                ? "bg-teal-950 text-teal-300"
                : temaIntermediario
                  ? "bg-teal-100 text-teal-900"
                  : "bg-teal-50 text-teal-700"
            }`}>
              <LockKeyhole size={24} />
            </div>

            <h2 className={`mt-5 text-lg font-bold ${cores.titulo}`}>
              Um espaço pessoal
            </h2>

            <p className={`mt-2 text-sm leading-7 ${cores.texto}`}>
              Seus registros são pessoais e destinados ao
              acompanhamento da sua própria jornada.
            </p>
          </div>
        </div>

        {/* Histórico */}
        <div className={`min-w-0 rounded-2xl border p-4 shadow-sm sm:p-8 ${cores.superficie}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CalendarDays size={21} className="text-violet-500" />

                <h2 className={`text-xl font-bold ${cores.titulo}`}>
                  Histórico de registros
                </h2>
              </div>

              <p className={`mt-2 text-sm ${cores.textoSecundario}`}>
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

          {/* Formulário */}
          {mostrarFormulario && (
            <form
              onSubmit={registrarBemEstar}
              className={`mt-8 rounded-2xl border p-5 transition-colors duration-300 sm:p-7 ${cores.formulario}`}
            >
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <h3 className={`text-lg font-bold ${cores.titulo}`}>
                    Novo registro
                  </h3>

                  <p className={`mt-1 text-sm ${cores.textoSecundario}`}>
                    Reserve um momento para refletir sobre seu dia.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMostrarFormulario(false);
                    limparFormulario();
                  }}
                  className={`rounded-lg p-2 transition ${cores.textoSecundario} ${
                    temaEscuro
                      ? "hover:bg-slate-700 hover:text-white"
                      : "hover:bg-white hover:text-slate-800"
                  }`}
                  aria-label="Fechar formulário"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Humor */}
              <div>
                <label className={`mb-3 block text-sm font-semibold ${cores.label}`}>
                  Como você está se sentindo?
                </label>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                  {opcoesHumor.map((opcao) => {
                    const selecionado = humor === opcao.valor;

                    const classeHumor = selecionado
                      ? temaEscuro
                        ? "border-violet-500 bg-violet-950 text-violet-200 ring-2 ring-violet-500/30"
                        : temaIntermediario
                          ? "border-violet-600 bg-violet-200 text-violet-950 ring-2 ring-violet-500/20"
                          : "border-violet-500 bg-violet-100 text-violet-800 ring-2 ring-violet-100"
                      : temaEscuro
                        ? "border-slate-600 bg-slate-900 text-slate-200 hover:border-violet-500 hover:bg-slate-800"
                        : temaIntermediario
                          ? "border-slate-400 bg-slate-100 text-slate-800 hover:border-violet-400 hover:bg-violet-50"
                          : "border-slate-200 bg-white text-slate-600 hover:border-violet-300";

                    return (
                      <button
                        key={opcao.valor}
                        type="button"
                        onClick={() => {
                          setHumor(opcao.valor);
                          setErro("");
                        }}
                        aria-pressed={selecionado}
                        className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition ${classeHumor}`}
                      >
                        <span className="text-3xl">
                          {opcao.emoji}
                        </span>

                        <span className="text-xs font-semibold">
                          {opcao.valor}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Data */}
              <div className="mt-6">
                <label
                  htmlFor="dataRegistro"
                  className={`mb-2 block text-sm font-semibold ${cores.label}`}
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
                  className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 sm:max-w-xs ${cores.campo}`}
                />
              </div>

              {/* Descrição */}
              <div className="mt-6">
                <label
                  htmlFor="descricaoRegistro"
                  className={`mb-2 block text-sm font-semibold ${cores.label}`}
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
                  className={`w-full resize-y rounded-xl border px-4 py-3 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 ${cores.campo}`}
                />

                <p className={`mt-2 text-right text-xs ${cores.textoSecundario}`}>
                  {descricao.length}/1000 caracteres
                </p>
              </div>

              {/* Erro */}
              {erro && (
                <p
                  role="alert"
                  className={`mt-4 rounded-lg border px-4 py-3 text-sm ${
                    temaEscuro
                      ? "border-red-900 bg-red-950 text-red-200"
                      : temaIntermediario
                        ? "border-red-300 bg-red-100 text-red-900"
                        : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {erro}
                </p>
              )}

              {/* Ações */}
              <div className="mt-6 flex flex-col justify-end gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={salvando}
                  onClick={() => {
                    setMostrarFormulario(false);
                    limparFormulario();
                  }}
                  className={`rounded-xl border px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${cores.botaoSecundario}`}
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

          {/* Erro fora do formulário */}
          {erro && !mostrarFormulario && (
            <div
              role="alert"
              className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
                temaEscuro
                  ? "border-red-900 bg-red-950 text-red-200"
                  : temaIntermediario
                    ? "border-red-300 bg-red-100 text-red-900"
                    : "border-red-200 bg-red-50 text-red-700"
              }`}
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

          {/* Carregamento */}
          {carregando ? (
            <div className={`mt-8 rounded-2xl px-5 py-16 text-center ${cores.superficieSecundaria}`}>
              <p className={`text-sm ${cores.textoSecundario}`}>
                Carregando seus registros...
              </p>
            </div>
          ) : registros.length > 0 ? (
            /* Histórico de registros */
            <div className="mt-8 space-y-4">
              {registros.map((registro) => {
                const opcao = obterOpcaoHumor(registro.humor);

                return (
                  <article
                    key={registro.idRegistro}
                    className={`rounded-2xl border p-5 transition hover:border-violet-400 ${cores.superficie}`}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${cores.iconeSecundario}`}>
                          {opcao?.emoji ?? "📝"}
                        </div>

                        <div>
                          <h3 className={`font-bold ${cores.titulo}`}>
                            {registro.humor}
                          </h3>

                          <p className={`mt-1 text-xs ${cores.textoSecundario}`}>
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
                      <p className={`mt-4 whitespace-pre-wrap text-sm leading-7 ${cores.texto}`}>
                        {registro.observacoes}
                      </p>
                    )}
                  </article>
                );
              })}
            </div>
          ) : (
            /* Estado vazio */
            <div className={`mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed px-5 py-16 text-center ${cores.superficieSecundaria}`}>
              <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${cores.iconeSecundario}`}>
                <BookHeart size={32} />
              </div>

              <h3 className={`mt-5 text-lg font-bold ${cores.titulo}`}>
                Seu diário está começando!
              </h3>

              <p className={`mt-2 max-w-md text-sm leading-7 ${cores.textoSecundario}`}>
                Você ainda não possui registros. Clique em
                "Novo registro" para começar a acompanhar
                seu bem-estar.
              </p>
            </div>
          )}
        </div>

        {/* Lembrete */}
        <div className={`mt-8 rounded-2xl border p-6 ${cores.lembrete}`}>
          <h3 className={`font-bold ${temaEscuro ? "text-violet-200" : "text-violet-900"}`}>
            Um lembrete importante
          </h3>

          <p className={`mt-2 text-sm leading-7 ${cores.textoLembrete}`}>
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
