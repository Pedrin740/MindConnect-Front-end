import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Clock, HeartHandshake, CalendarDays, FileText, LoaderCircle, AlertCircle,} from "lucide-react";
import { buscarServicoPorId } from "../services/servicosService";
import type { ServicoAcolhimento } from "../services/servicoTypes";

function formatarTelefone(telefone: string): string {
  const numeros = telefone.replace(/\D/g, "");

  if (!numeros) return telefone.trim();

  const numeroLocal =
    numeros.startsWith("55") &&
    (numeros.length === 12 || numeros.length === 13)
      ? numeros.slice(2)
      : numeros;

  if (numeroLocal.length === 10) {
    return `(${numeroLocal.slice(0, 2)}) ${numeroLocal.slice(2, 6)}-${numeroLocal.slice(6)}`;
  }

  if (numeroLocal.length === 11) {
    return `(${numeroLocal.slice(0, 2)}) ${numeroLocal.slice(2, 7)}-${numeroLocal.slice(7)}`;
  }

  if (numeroLocal.length === 8) {
    return `${numeroLocal.slice(0, 4)}-${numeroLocal.slice(4)}`;
  }

  if (numeroLocal.length === 9) {
    return `${numeroLocal.slice(0, 5)}-${numeroLocal.slice(5)}`;
  }

  return telefone.trim();
}

function formatarData(data: string): string {
  if (!data) return "Não informada";

  const dataNormalizada = new Date(data);

  if (Number.isNaN(dataNormalizada.getTime())) {
    return data;
  }

  return dataNormalizada.toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
}

function ServicoDetalhe() {
  const { id } = useParams<{ id: string }>();

  const [servico, setServico] = useState<ServicoAcolhimento | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    let cancelado = false;

    async function carregarServico() {
      if (!id || !/^\d+$/.test(id)) {
        setErro("O identificador do serviço é inválido.");
        setCarregando(false);
        return;
      }

      try {
        setCarregando(true);
        setErro("");

        const resultado = await buscarServicoPorId(Number(id));

        if (!cancelado) {
          setServico(resultado);
        }
      } catch (error) {
        if (!cancelado) {
          setErro(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os detalhes do serviço."
          );
        }
      } finally {
        if (!cancelado) {
          setCarregando(false);
        }
      }
    }

    carregarServico();

    return () => {
      cancelado = true;
    };
  }, [id]);

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-violet-700 via-violet-600 to-purple-500 px-6 py-12 text-white sm:py-16">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/servicos"
            className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-violet-100 transition-colors hover:text-white"
          >
            <ArrowLeft size={18} />
            Voltar para serviços
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
              <HeartHandshake size={26} />
            </div>

            <span className="text-sm font-semibold text-violet-100">
              Detalhes do serviço de acolhimento
            </span>
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-5xl">
            {servico?.nome || "Detalhes do serviço"}
          </h1>

          {servico?.nomeCategoria && (
            <span className="mt-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
              {servico.nomeCategoria}
            </span>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
        {carregando && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20">
            <LoaderCircle
              size={38}
              className="animate-spin text-violet-600"
            />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Carregando informações do serviço...
            </p>
          </div>
        )}

        {!carregando && erro && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <AlertCircle size={34} className="mx-auto text-red-500" />

            <h2 className="mt-4 text-lg font-bold text-red-900">
              Não foi possível carregar o serviço
            </h2>

            <p className="mt-2 text-sm leading-6 text-red-700">
              {erro}
            </p>

            <Link
              to="/servicos"
              className="mt-6 inline-flex rounded-xl bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-800"
            >
              Voltar para a lista
            </Link>
          </div>
        )}

        {!carregando && !erro && servico && (
          <div className="space-y-6">
            {/* Descrição */}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <FileText size={21} />
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  Sobre o serviço
                </h2>
              </div>

              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">
                {servico.descricaoServicos ||
                  "Não há descrição detalhada cadastrada para este serviço."}
              </p>
            </article>

            {/* Localização e contato */}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <MapPin size={21} />
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  Localização e contato
                </h2>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Endereço
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {servico.endereco || "Não informado"}
                    {servico.bairro && `, ${servico.bairro}`}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Município
                  </p>

                  <p className="mt-2 text-sm text-slate-700">
                    {servico.municipio || "Não informado"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Região
                  </p>

                  <p className="mt-2 text-sm text-slate-700">
                    {servico.regiao || "Não informada"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Telefone
                  </p>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                    <Phone size={16} className="text-violet-600" />

                    {servico.telefone
                      ? formatarTelefone(servico.telefone)
                      : "Não informado"}
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Horário de funcionamento
                  </p>

                  <div className="mt-2 flex items-start gap-2 text-sm leading-6 text-slate-700">
                    <Clock
                      size={17}
                      className="mt-0.5 shrink-0 text-violet-600"
                    />

                    {servico.horarioFuncionamento || "Não informado"}
                  </div>
                </div>
              </div>
            </article>

            {/* Fonte e verificação */}
            <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                  <CalendarDays size={21} />
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  Informações da fonte
                </h2>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Fonte de informação
                  </p>

                  <p className="mt-2 break-words text-sm leading-6 text-slate-700">
                    {servico.fonteInformacao || "Não informada"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Última verificação
                  </p>

                  <p className="mt-2 text-sm text-slate-700">
                    {formatarData(servico.dataVerificacao)}
                  </p>
                </div>
              </div>
            </article>

            <div className="flex justify-start">
              <Link
                to="/servicos"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-violet-200 hover:text-violet-700"
              >
                <ArrowLeft size={17} />
                Voltar para serviços
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default ServicoDetalhe;
