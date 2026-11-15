import { useEffect, useState } from "react";
import { BookOpen, CalendarDays, ExternalLink, FileText, Heart, LoaderCircle, AlertCircle, RefreshCw, } from "lucide-react";
import { buscarConteudos } from "../services/conteudoService";
import type { Conteudo } from "../services/conteudoTypes";

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
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  async function carregarConteudos() {
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

  useEffect(() => {
    carregarConteudos();
  }, []);

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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Materiais disponíveis
          </h2>

          {!carregando && !erro && (
            <p className="mt-1 text-sm text-slate-500">
              {conteudos.length} conteúdo(s) encontrado(s)
            </p>
          )}
        </div>

        {/* Carregamento */}
        {carregando && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20">
            <LoaderCircle
              size={38}
              className="animate-spin text-violet-600"
            />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Carregando conteúdos...
            </p>
          </div>
        )}

        {/* Erro */}
        {!carregando && erro && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle
              size={34}
              className="mx-auto text-red-500"
            />

            <h3 className="mt-4 text-lg font-bold text-red-900">
              Não foi possível carregar os conteúdos
            </h3>

            <p className="mt-2 text-sm leading-6 text-red-700">
              {erro}
            </p>

            <button
              type="button"
              onClick={carregarConteudos}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              <RefreshCw size={17} />
              Tentar novamente
            </button>
          </div>
        )}

        {/* Listagem */}
        {!carregando && !erro && conteudos.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {conteudos.map((conteudo) => (
              <article
                key={conteudo.idConteudo}
                className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/60"
              >
                {/* Ícone e assunto */}
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 transition-colors group-hover:bg-violet-100">
                    <BookOpen size={25} />
                  </div>

                  {conteudo.assunto && (
                    <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
                      {conteudo.assunto}
                    </span>
                  )}
                </div>

                {/* Título */}
                <h3 className="text-lg font-bold leading-snug text-slate-900">
                  {conteudo.titulo}
                </h3>

                {/* Descrição */}
                <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">
                  {conteudo.descricao ||
                    "Não há descrição disponível para este conteúdo."}
                </p>

                {/* Categorias */}
                {conteudo.categorias && conteudo.categorias.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {conteudo.categorias.map((categoria) => (
                      <span
                        key={categoria.idCategoriaConteudo}
                        className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-700"
                      >
                        {categoria.nome}
                      </span>
                    ))}
                  </div>
                )}

                {/* Informações */}
                <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <CalendarDays
                      size={17}
                      className="shrink-0 text-violet-600"
                    />

                    <span>
                      {formatarData(conteudo.dataPublicacao)}
                    </span>
                  </div>

                  {conteudo.fonteInformacao && (
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <FileText
                        size={17}
                        className="mt-0.5 shrink-0 text-violet-600"
                      />

                      <span className="break-words">
                        {conteudo.fonteInformacao}
                      </span>
                    </div>
                  )}
                </div>

                {/* Material */}
                {conteudo.material && validarUrlMaterial(conteudo.material) && (
                  <a
                    href={conteudo.material}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-800"
                  >
                    Acessar material
                    <ExternalLink size={16} />
                  </a>
                )}

                {conteudo.material && !validarUrlMaterial(conteudo.material) && (
                  <div className="mt-6 rounded-xl bg-violet-50 px-4 py-3 text-sm leading-6 text-violet-800">
                    {conteudo.material}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {/* Lista vazia */}
        {!carregando && !erro && conteudos.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              <Heart size={30} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              Nenhum conteúdo disponível
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Ainda não existem conteúdos ativos cadastrados.
              Volte em outro momento para conferir as novidades.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Conteudos;