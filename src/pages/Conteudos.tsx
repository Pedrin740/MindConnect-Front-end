import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { BookOpen, CalendarDays, ExternalLink, FileText, Heart, LoaderCircle, AlertCircle, RefreshCw, Search, Filter } from "lucide-react";
import { buscarConteudos, buscarCategoriasConteudo } from "../services/conteudoService";
import type { Conteudo, CategoriaConteudo } from "../services/conteudoTypes";

function formatarData(data: string | null): string {
  if (!data) return "Data não informada";

  const dataNormalizada = new Date(`${data}T00:00:00`);

  if (Number.isNaN(dataNormalizada.getTime())) {
    return "Data não informada";
  }

  return dataNormalizada.toLocaleDateString("pt-BR");
}

function validarUrlMaterial(material: string): boolean {
  try {
    const url = new URL(material);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function Conteudos() {
  const [conteudos, setConteudos] = useState<Conteudo[]>([]);
  const [categorias, setCategorias] = useState<CategoriaConteudo[]>([]);

  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarDadosIniciais(
    mostrarCarregamento = true
  ) {
    if (mostrarCarregamento) {
      setCarregando(true);
    }

    try {
      const [listaConteudos, listaCategorias] = await Promise.all([
        buscarConteudos({ status: "ATIVO" }),
        buscarCategoriasConteudo(),
      ]);

      setErro("");
      setConteudos(listaConteudos);
      setCategorias(listaCategorias);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os conteúdos."
      );
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    let ativo = true;

    async function carregarDadosIniciais() {
      try {
        const [listaConteudos, listaCategorias] = await Promise.all([
          buscarConteudos({ status: "ATIVO" }),
          buscarCategoriasConteudo(),
        ]);

        if (!ativo) return;

        setErro("");
        setConteudos(listaConteudos);
        setCategorias(listaCategorias);
      } catch (error) {
        if (!ativo) return;

        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os conteúdos."
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
  }, []);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setCarregando(true);
      setErro("");

      const resultados = await buscarConteudos({
        busca: busca.trim() || undefined,
        categoria: categoriaSelecionada || undefined,
        status: "ATIVO",
      });

      setConteudos(resultados);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível realizar a pesquisa."
      );
    } finally {
      setCarregando(false);
    }
  }

  async function limparFiltros() {
    setBusca("");
    setCategoriaSelecionada("");

    try {
      setCarregando(true);
      setErro("");

      const resultados = await buscarConteudos({
        status: "ATIVO",
      });

      setConteudos(resultados);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os conteúdos."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Cabeçalho */}
      <section className="bg-gradient-to-br from-violet-700 via-violet-600 to-purple-500 px-6 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
            <BookOpen size={17} />
            Informação e conhecimento
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Conteúdos informativos
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-violet-100 sm:text-lg">
            Explore materiais informativos, orientações e conteúdos
            relacionados à saúde mental e ao bem-estar.
          </p>
        </div>
      </section>

      {/* Conteúdo principal */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Pesquisa e filtros */}
        <form
          onSubmit={handleSearch}
          className="relative -mt-20 mb-12 rounded-2xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-7"
        >
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Encontre conteúdos
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Pesquise por assunto ou selecione uma categoria.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <div>
              <label
                htmlFor="buscaConteudo"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Buscar conteúdo
              </label>

              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="buscaConteudo"
                  type="search"
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  placeholder="Ex.: ansiedade, autocuidado..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="categoriaConteudo"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Categoria
              </label>

              <div className="relative">
                <Filter
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <select
                  id="categoriaConteudo"
                  value={categoriaSelecionada}
                  onChange={(event) =>
                    setCategoriaSelecionada(event.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                >
                  <option value="">Todas as categorias</option>

                  {categorias.map((categoria) => (
                    <option
                      key={categoria.idCategoriaConteudo}
                      value={String(categoria.idCategoriaConteudo)}
                    >
                      {categoria.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                disabled={carregando}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Search size={17} />
                Buscar
              </button>

              <button
                type="button"
                onClick={() => void limparFiltros()}
                disabled={carregando}
                aria-label="Limpar filtros"
                title="Limpar filtros"
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw size={17} />
              </button>
            </div>
          </div>
        </form>

        {/* Mensagem de erro */}
        {erro && (
          <div
            role="alert"
            className="mb-8 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3 text-sm text-red-700">
              <AlertCircle size={19} className="mt-0.5 shrink-0" />
              {erro}
            </div>

            <button
              type="button"
              onClick={() => void carregarDadosIniciais()}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
            >
              <RefreshCw size={16} />
              Tentar novamente
            </button>
          </div>
        )}

        {/* Lista de conteúdos */}
        {carregando ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white">
            <LoaderCircle
              size={32}
              className="animate-spin text-violet-600"
            />

            <p className="text-sm text-slate-500">
              Carregando conteúdos...
            </p>
          </div>
        ) : conteudos.length > 0 ? (
          <>
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold text-slate-900">
                Conteúdos disponíveis
              </h2>

              <p className="text-sm text-slate-500">
                {conteudos.length}{" "}
                {conteudos.length === 1
                  ? "conteúdo encontrado"
                  : "conteúdos encontrados"}
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {conteudos.map((conteudo) => (
                <article
                  key={conteudo.idConteudo}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="flex h-40 items-center justify-center bg-gradient-to-br from-violet-100 to-teal-50">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
                      <FileText size={32} />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="mb-4 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                        {conteudo.categorias
                          .map((categoria) => categoria.nome)
                          .join(", ") || "Sem categoria"}
                      </span>

                      <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                        <CalendarDays size={13} />
                        {formatarData(conteudo.dataPublicacao)}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold leading-snug text-slate-900">
                      {conteudo.titulo}
                    </h3>

                    <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                      {conteudo.descricao}
                    </p>

                    {conteudo.fonteInformacao && (
                      <p className="mt-4 text-xs text-slate-400">
                        Fonte: {conteudo.fonteInformacao}
                      </p>
                    )}

                    {validarUrlMaterial(conteudo.material) && (
                      <a
                        href={conteudo.material}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
                      >
                        Acessar material
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <BookOpen size={32} />
            </div>

            <h2 className="mt-5 text-lg font-bold text-slate-900">
              Nenhum conteúdo encontrado
            </h2>

            <p className="mt-2 max-w-md text-sm leading-7 text-slate-500">
              Não encontramos materiais com os filtros selecionados.
              Experimente alterar os termos da pesquisa ou limpar os filtros.
            </p>

            <button
              type="button"
              onClick={() => void limparFiltros()}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700"
            >
              <RefreshCw size={16} />
              Limpar filtros
            </button>
          </div>
        )}

        <div className="mt-12 rounded-2xl border border-violet-100 bg-violet-50 p-6">
          <div className="flex items-start gap-3">
            <Heart
              size={22}
              className="mt-1 shrink-0 text-violet-600"
            />

            <div>
              <h2 className="font-bold text-violet-900">
                Informação também é cuidado
              </h2>

              <p className="mt-2 text-sm leading-7 text-violet-800">
                Os conteúdos disponibilizados têm finalidade informativa
                e educativa. Eles não substituem a avaliação,
                o diagnóstico ou o acompanhamento de profissionais
                de saúde qualificados.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Conteudos;