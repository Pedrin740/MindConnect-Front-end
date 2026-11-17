import { useState, type FormEvent } from "react";

import {
  BookHeart,
  CalendarDays,
  Heart,
  LockKeyhole,
  Sparkles,
  Smile,
  Meh,
  Frown,
  Plus,
  Trash2,
  X,
} from "lucide-react";

type Humor = "Muito bem" | "Bem" | "Neutro" | "Mal" | "Muito mal";

interface RegistroDiario {
  id: number;
  humor: Humor;
  data: string;
  descricao: string;
}

const opcoesHumor: {
  valor: Humor;
  emoji: string;
  icone: typeof Smile;
}[] = [
  { valor: "Muito bem", emoji: "😁", icone: Smile },
  { valor: "Bem", emoji: "🙂", icone: Smile },
  { valor: "Neutro", emoji: "😐", icone: Meh },
  { valor: "Mal", emoji: "😟", icone: Frown },
  { valor: "Muito mal", emoji: "😢", icone: Frown },
];

function obterDataAtual(): string {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

function formatarData(data: string): string {
  return new Date(`${data}T12:00:00`).toLocaleDateString(
    "pt-BR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}

function Diario() {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [humor, setHumor] = useState<Humor | "">("");
  const [data, setData] = useState(obterDataAtual());
  const [descricao, setDescricao] = useState("");
  const [registros, setRegistros] = useState<RegistroDiario[]>([]);
  const [erro, setErro] = useState("");

  function limparFormulario() {
    setHumor("");
    setData(obterDataAtual());
    setDescricao("");
    setErro("");
  }

  function registrarBemEstar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!humor) {
      setErro("Selecione como você está se sentindo.");
      return;
    }

    if (!descricao.trim()) {
      setErro("Descreva um pouco como foi o seu dia.");
      return;
    }

    const novoRegistro: RegistroDiario = {
      id: Date.now(),
      humor,
      data,
      descricao: descricao.trim(),
    };

    setRegistros((atuais) =>
      [novoRegistro, ...atuais].sort((a, b) =>
        b.data.localeCompare(a.data)
      )
    );

    limparFormulario();
    setMostrarFormulario(false);
  }

  function removerRegistro(id: number) {
    setRegistros((atuais) =>
      atuais.filter((registro) => registro.id !== id)
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Cabeçalho */}
      <section className="bg-gradient-to-br from-violet-700 via-violet-600 to-purple-500 px-6 py-16 text-white sm:py-20">
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

      {/* Conteúdo principal */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Apresentação */}
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

        {/* Histórico */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <CalendarDays
                  size={21}
                  className="text-violet-600"
                />

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

          {/* Formulário */}
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

              {/* Humor */}
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
                        className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition ${
                          selecionado
                            ? "border-violet-500 bg-violet-100 text-violet-800"
                            : "border-slate-200 bg-white text-slate-600 hover:border-violet-300"
                        }`}
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

              {/* Descrição */}
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
                  onClick={() => {
                    setMostrarFormulario(false);
                    limparFormulario();
                  }}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  <BookHeart size={17} />
                  Salvar registro
                </button>
              </div>
            </form>
          )}

          {/* Lista de registros */}
          {registros.length > 0 ? (
            <div className="mt-8 space-y-4">
              {registros.map((registro) => {
                const opcao = opcoesHumor.find(
                  (item) => item.valor === registro.humor
                );

                return (
                  <article
                    key={registro.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-violet-200"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-2xl">
                          {opcao?.emoji}
                        </div>

                        <div>
                          <h3 className="font-bold text-slate-900">
                            {registro.humor}
                          </h3>

                          <p className="mt-1 text-xs text-slate-500">
                            {formatarData(registro.data)}
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => removerRegistro(registro.id)}
                        aria-label="Excluir registro"
                        className="self-end rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 sm:self-start"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-600">
                      {registro.descricao}
                    </p>
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

        {/* Orientação */}
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