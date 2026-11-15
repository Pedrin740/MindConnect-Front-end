import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, MapPin, Phone, Clock, HeartHandshake, LoaderCircle, AlertCircle } from "lucide-react";
import { buscarServicos, buscarCategoriasServico, buscarMunicipios } from "../services/servicosService";
import type { ServicoAcolhimento, CategoriaServico } from "../services/servicoTypes";
import MapaServicos from "../components/MapaServicos";

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

function Servicos() {
  const [searchParams] = useSearchParams();

  const [servicos, setServicos] = useState<ServicoAcolhimento[]>([]);
  const [categorias, setCategorias] = useState<CategoriaServico[]>([]);
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [regioes, setRegioes] = useState<string[]>([]);

  const [busca, setBusca] = useState(searchParams.get("busca") || "");
  const [municipio, setMunicipio] = useState(searchParams.get("municipio") || "");
  const [regiao, setRegiao] = useState(searchParams.get("regiao") || "");
  const [categoria, setCategoria] = useState(searchParams.get("categoria") || "");

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        setErro("");

        const [
          listaServicos,
          listaCategorias,
          listaMunicipios,
          todosServicos,
        ] = await Promise.all([
          buscarServicos(
            searchParams.get("busca") || undefined,
            searchParams.get("municipio") || undefined,
            searchParams.get("regiao") || undefined,
            searchParams.get("categoria") || undefined
          ),
          buscarCategoriasServico(),
          buscarMunicipios(),
          buscarServicos(),
        ]);

        setServicos(listaServicos);
        setCategorias(listaCategorias);
        setMunicipios(listaMunicipios);

        const regioesDisponiveis = Array.from(
          new Set(
            todosServicos
              .map((servico) => servico.regiao?.trim())
              .filter((item): item is string => Boolean(item))
          )
        ).sort((a, b) => a.localeCompare(b, "pt-BR"));

        setRegioes(regioesDisponiveis);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os serviços."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, [searchParams]);

  async function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setCarregando(true);
      setErro("");

      const resultados = await buscarServicos(
        busca.trim() || undefined,
        municipio || undefined,
        regiao || undefined,
        categoria || undefined
      );

      setServicos(resultados);
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

  function limparFiltros() {
    setBusca("");
    setMunicipio("");
    setRegiao("");
    setCategoria("");

    async function carregarTodos() {
      try {
        setCarregando(true);
        setErro("");

        const resultados = await buscarServicos();
        setServicos(resultados);
      } catch (error) {
        setErro(
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os serviços."
        );
      } finally {
        setCarregando(false);
      }
    }

    carregarTodos();
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Cabeçalho */}
      <section className="bg-gradient-to-br from-violet-700 via-violet-600 to-purple-500 px-6 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium">
            <HeartHandshake size={17} />
            Cuidado e acolhimento
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
            Serviços de acolhimento
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-8 text-violet-100 sm:text-lg">
            Encontre serviços de atendimento e acolhimento
            disponíveis para oferecer apoio e orientação.
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Pesquisa e filtros */}
        <form
          onSubmit={handleSearch}
          className="relative -mt-20 rounded-2xl border border-slate-100 bg-white p-5 shadow-xl shadow-slate-200/60 sm:p-7"
        >
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Encontre um serviço
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Utilize os filtros para encontrar serviços de acolhimento.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {/* Nome */}
            <div>
              <label
                htmlFor="busca-servico"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Nome do serviço
              </label>

              <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 px-4 transition-colors focus-within:border-violet-500 focus-within:ring-2 focus-within:ring-violet-100">
                <Search size={19} className="shrink-0 text-violet-500" />

                <input
                  id="busca-servico"
                  type="search"
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  placeholder="Digite o nome..."
                  className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Município */}
            <div>
              <label
                htmlFor="municipio-servico"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Município
              </label>

              <select
                id="municipio-servico"
                value={municipio}
                onChange={(event) => setMunicipio(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              >
                <option value="">Todos os municípios</option>

                {municipios.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Região */}
            <div>
              <label
                htmlFor="regiao-servico"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Região
              </label>

              <select
                id="regiao-servico"
                value={regiao}
                onChange={(event) => setRegiao(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              >
                <option value="">Todas as regiões</option>

                {regioes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Categoria */}
            <div>
              <label
                htmlFor="categoria-servico"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Categoria
              </label>

              <select
                id="categoria-servico"
                value={categoria}
                onChange={(event) => setCategoria(event.target.value)}
                className="h-12 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              >
                <option value="">Todas as categorias</option>

                {categorias.map((item) => (
                  <option
                    key={item.idCategoriaServico}
                    value={String(item.idCategoriaServico)}
                  >
                    {item.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Botão */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={carregando}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-700 px-5 font-semibold text-white transition-colors hover:bg-violet-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Search size={18} />
                Pesquisar
              </button>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={limparFiltros}
              disabled={carregando}
              className="text-sm font-medium text-violet-700 transition-colors hover:text-violet-900 disabled:opacity-50"
            >
              Limpar filtros
            </button>
          </div>
        </form>

        {/* Resultados */}
        <div className="mb-6 mt-12">
          <h2 className="text-2xl font-bold text-slate-900">
            Serviços disponíveis
          </h2>

          {!carregando && !erro && (
            <p className="mt-1 text-sm text-slate-500">
              {servicos.length} serviço(s) encontrado(s)
            </p>
          )}
        </div>

        {/* Carregamento */}
        {carregando && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16">
            <LoaderCircle
              size={36}
              className="animate-spin text-violet-600"
            />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Carregando serviços...
            </p>
          </div>
        )}

        {/* Erro */}
        {!carregando && erro && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle size={32} className="mx-auto text-red-500" />

            <h3 className="mt-3 font-semibold text-red-800">
              Não foi possível carregar os serviços
            </h3>

            <p className="mt-2 text-sm text-red-700">{erro}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Mapa de serviços - integração Leaflet preservada */}
        {!carregando && !erro && servicos.length > 0 && (
          <MapaServicos servicos={servicos} />
        )}

        {/* Lista de serviços */}
        {!carregando && !erro && servicos.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {servicos.map((servico) => (
              <article
                key={servico.idServico}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/60"
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700 transition-colors group-hover:bg-violet-100">
                    <HeartHandshake size={25} />
                  </div>

                  <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
                    {servico.nomeCategoria}
                  </span>
                </div>

                <h3 className="text-lg font-bold leading-snug text-slate-900">
                  {servico.nome}
                </h3>

                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-600">
                  {servico.descricaoServicos ||
                    "Informações sobre o atendimento não disponíveis."}
                </p>

                <div className="mt-6 space-y-3 border-t border-slate-100 pt-5">
                  <div className="flex items-start gap-3 text-sm text-slate-600">
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0 text-violet-600"
                    />

                    <span>
                      {servico.endereco}
                      {servico.bairro && `, ${servico.bairro}`}
                      {servico.municipio && ` — ${servico.municipio}`}
                      {servico.regiao && ` — ${servico.regiao}`}
                    </span>
                  </div>

                  {servico.telefone && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone
                        size={17}
                        className="shrink-0 text-violet-600"
                      />

                      <span>{formatarTelefone(servico.telefone)}</span>
                    </div>
                  )}

                  {servico.horarioFuncionamento && (
                    <div className="flex items-start gap-3 text-sm text-slate-600">
                      <Clock
                        size={17}
                        className="mt-0.5 shrink-0 text-violet-600"
                      />

                      <span>{servico.horarioFuncionamento}</span>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Nenhum resultado */}
        {!carregando && !erro && servicos.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-50 text-violet-600">
              <Search size={30} />
            </div>

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              Nenhum serviço encontrado
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Não encontramos serviços com os critérios informados.
              Tente modificar sua pesquisa ou selecionar outros filtros.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

export default Servicos;
