import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin, LoaderCircle, Filter, Info } from "lucide-react";
import type { LatLngBoundsExpression } from "leaflet";
import type { ServicoAcolhimento, CategoriaServico } from "../services/servicoTypes";
import { buscarServicos, buscarCategoriasServico } from "../services/servicosService";
import { geocodificarEndereco } from "../services/geocodificacaoService";
import "leaflet/dist/leaflet.css";

interface MapaServicosProps {
  servicos: ServicoAcolhimento[];
}

interface ServicoComCoordenadas {
  servico: ServicoAcolhimento;
  latitude: number;
  longitude: number;
}

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

function possuiCoordenadasValidas(
  servico: ServicoAcolhimento
): boolean {
  const latitude = Number(servico.latitude);
  const longitude = Number(servico.longitude);

  return (
    servico.latitude !== null &&
    servico.latitude !== undefined &&
    servico.longitude !== null &&
    servico.longitude !== undefined &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180 &&
    (latitude !== 0 || longitude !== 0)
  );
}

function montarEndereco(servico: ServicoAcolhimento): string {
  return [
    servico.endereco,
    servico.bairro,
    servico.municipio,
    "São Paulo",
    "Brasil",
  ]
    .filter((parte) => parte && parte.trim())
    .join(", ");
}

const iconeMarcador = L.divIcon({
  className: "mindconnect-marker",
  html: `
    <div style="
      width: 36px;
      height: 36px;
      background: #6d28d9;
      border: 3px solid white;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      box-shadow: 0 3px 10px rgba(0,0,0,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 10px;
        height: 10px;
        background: white;
        border-radius: 50%;
      "></div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

function AjustarEnquadramento({
  coordenadas,
}: {
  coordenadas: [number, number][];
}) {
  const mapa = useMap();

  useEffect(() => {
    if (coordenadas.length === 0) return;

    if (coordenadas.length === 1) {
      mapa.setView(coordenadas[0], 14);
      return;
    }

    const limites: LatLngBoundsExpression = coordenadas;

    mapa.fitBounds(limites, {
      padding: [40, 40],
      maxZoom: 14,
    });
  }, [coordenadas, mapa]);

  return null;
}

function MapaServicos(_props: MapaServicosProps) {
  const [todosServicos, setTodosServicos] = useState<
    ServicoAcolhimento[]
  >([]);

  const [categorias, setCategorias] = useState<CategoriaServico[]>([]);

  const [categoriaSelecionada, setCategoriaSelecionada] = useState("");

  const [carregandoDados, setCarregandoDados] = useState(true);
  const [erroDados, setErroDados] = useState("");

  const [servicosLocalizados, setServicosLocalizados] = useState<
    ServicoComCoordenadas[]
  >([]);

  const [carregandoGeocodificacao, setCarregandoGeocodificacao] =
    useState(false);

  // Carrega todos os serviços e categorias independentemente
  // dos filtros utilizados na página de serviços.
  useEffect(() => {
    let cancelado = false;

    async function carregarDadosMapa() {
      try {
        setCarregandoDados(true);
        setErroDados("");

        const [listaServicos, listaCategorias] = await Promise.all([
          buscarServicos(),
          buscarCategoriasServico(),
        ]);

        if (cancelado) return;

        setTodosServicos(listaServicos);
        setCategorias(listaCategorias);
      } catch (error) {
        if (!cancelado) {
          setErroDados(
            error instanceof Error
              ? error.message
              : "Não foi possível carregar os dados do mapa."
          );
        }
      } finally {
        if (!cancelado) {
          setCarregandoDados(false);
        }
      }
    }

    carregarDadosMapa();

    return () => {
      cancelado = true;
    };
  }, []);

  // Filtra os serviços exclusivamente para o mapa.
  const servicosFiltrados = useMemo(() => {
    if (!categoriaSelecionada) return todosServicos;

    return todosServicos.filter(
      (servico) =>
        String(servico.idCategoriaServico) === categoriaSelecionada
    );
  }, [todosServicos, categoriaSelecionada]);

  // Localiza os serviços e utiliza as coordenadas cadastradas
  // sempre que estiverem disponíveis.
  useEffect(() => {
    let cancelado = false;

    async function localizarServicos() {
      setServicosLocalizados([]);

      const servicosComCoordenadasValidas: ServicoComCoordenadas[] =
        servicosFiltrados
          .filter(possuiCoordenadasValidas)
          .map((servico) => ({
            servico,
            latitude: Number(servico.latitude),
            longitude: Number(servico.longitude),
          }));

      const servicosSemCoordenadas = servicosFiltrados.filter(
        (servico) => !possuiCoordenadasValidas(servico)
      );

      setServicosLocalizados(servicosComCoordenadasValidas);

      if (servicosSemCoordenadas.length === 0) {
        setCarregandoGeocodificacao(false);
        return;
      }

      setCarregandoGeocodificacao(true);

      try {
        const encontrados: ServicoComCoordenadas[] = [];

        for (
          let i = 0;
          i < servicosSemCoordenadas.length;
          i += 3
        ) {
          if (cancelado) return;

          const lote = servicosSemCoordenadas.slice(i, i + 3);

          const resultados = await Promise.all(
            lote.map(async (servico) => {
              const endereco = montarEndereco(servico);

              if (!endereco.trim()) return null;

              const resultado = await geocodificarEndereco(endereco);

              if (!resultado) return null;

              return {
                servico,
                latitude: resultado.latitude,
                longitude: resultado.longitude,
              };
            })
          );

          if (cancelado) return;

          resultados.forEach((resultado) => {
            if (resultado) {
              encontrados.push(resultado);
            }
          });

          setServicosLocalizados([
            ...servicosComCoordenadasValidas,
            ...encontrados,
          ]);
        }
      } catch {
        // O aviso informativo substitui a mensagem técnica
        // de geocodificação.
      } finally {
        if (!cancelado) {
          setCarregandoGeocodificacao(false);
        }
      }
    }

    if (!carregandoDados && !erroDados) {
      localizarServicos();
    }

    return () => {
      cancelado = true;
    };
  }, [servicosFiltrados, carregandoDados, erroDados]);

  // Coordenadas utilizadas para posicionar os marcadores no mapa.
  const coordenadas = useMemo<[number, number][]>(
    () =>
      servicosLocalizados.map((item) => [
        item.latitude,
        item.longitude,
      ]),
    [servicosLocalizados]
  );

  // O contador utiliza diretamente a mesma lista que alimenta
  // os marcadores, evitando divergência entre as duas informações.
  const quantidadeLocalizacoes = servicosLocalizados.length;

  const textoLocalizacoes =
    quantidadeLocalizacoes === 1
      ? "localização"
      : "localizações";

  const centroInicial: [number, number] =
    coordenadas.length > 0
      ? coordenadas[0]
      : [-23.5505, -46.6333];

  return (
    <section className="mb-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Cabeçalho do mapa */}
      <div className="flex flex-col gap-4 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MapPin size={21} className="text-violet-600" />

            <h2 className="text-xl font-bold text-slate-900">
              Mapa de serviços
            </h2>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Explore a localização dos serviços de acolhimento.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          {/* Filtro por categoria */}
          <div className="w-full sm:w-64">
            <label
              htmlFor="categoria-mapa"
              className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <Filter size={16} className="text-violet-600" />
              Categoria no mapa
            </label>

            <select
              id="categoria-mapa"
              value={categoriaSelecionada}
              onChange={(event) =>
                setCategoriaSelecionada(event.target.value)
              }
              disabled={carregandoDados || Boolean(erroDados)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-violet-500 focus:ring-2 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Todas as categorias</option>

              {categorias.map((categoria) => (
                <option
                  key={categoria.idCategoriaServico}
                  value={String(categoria.idCategoriaServico)}
                >
                  {categoria.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Contador de localizações */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-full bg-violet-50 px-3 py-1.5 text-sm font-semibold text-violet-700">
              {quantidadeLocalizacoes} {textoLocalizacoes}
            </span>

            {(carregandoDados || carregandoGeocodificacao) && (
              <span className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700">
                <LoaderCircle
                  size={14}
                  className="animate-spin shrink-0"
                />

                {carregandoDados
                  ? "Carregando mapa..."
                  : "Localizando endereços..."}
              </span>
            )}
          </div>
        </div>
      </div>

      {erroDados && (
        <div className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm text-red-800">
          {erroDados}
        </div>
      )}

      {/* Aviso sobre a disponibilidade das localizações */}
      <div className="flex items-start gap-3 border-b border-amber-100 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-800">
        <Info size={18} className="mt-0.5 shrink-0" />

        <p>
          Nem todas as unidades cadastradas estão representadas no mapa,
          devido à ausência ou à insuficiência de dados públicos de localização.
        </p>
      </div>

      {!carregandoDados &&
      !erroDados &&
      coordenadas.length > 0 ? (
        <MapContainer
          key={categoriaSelecionada || "todas"}
          center={centroInicial}
          zoom={11}
          scrollWheelZoom={true}
          className="h-[420px] w-full sm:h-[480px]"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <AjustarEnquadramento coordenadas={coordenadas} />

          {servicosLocalizados.map(
            ({ servico, latitude, longitude }) => (
              <Marker
                key={servico.idServico}
                position={[latitude, longitude]}
                icon={iconeMarcador}
              >
                <Popup>
                  <div className="min-w-[210px]">
                    <h3 className="text-sm font-bold text-slate-900">
                      {servico.nome}
                    </h3>

                    <span className="mt-1 inline-block rounded-full bg-violet-50 px-2 py-1 text-xs font-semibold text-violet-700">
                      {servico.nomeCategoria}
                    </span>

                    <p className="mt-2 text-xs leading-5 text-slate-600">
                      {servico.endereco}
                      {servico.bairro && `, ${servico.bairro}`}
                      {servico.municipio && ` — ${servico.municipio}`}
                    </p>

                    {servico.telefone && (
                      <p className="mt-2 text-xs text-slate-600">
                        Telefone: {formatarTelefone(servico.telefone)}
                      </p>
                    )}

                    {servico.horarioFuncionamento && (
                      <p className="mt-1 text-xs text-slate-600">
                        Horário: {servico.horarioFuncionamento}
                      </p>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          )}
        </MapContainer>
      ) : (
        <div className="flex h-[300px] flex-col items-center justify-center px-6 text-center">
          {carregandoDados || carregandoGeocodificacao ? (
            <>
              <LoaderCircle
                size={38}
                className="animate-spin text-violet-500"
              />

              <h3 className="mt-4 font-semibold text-slate-700">
                Carregando localizações...
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Estamos consultando os serviços e suas coordenadas geográficas.
              </p>
            </>
          ) : (
            <>
              <MapPin size={38} className="text-slate-300" />

              <h3 className="mt-4 font-semibold text-slate-700">
                Nenhuma localização disponível
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                Não encontramos coordenadas geográficas válidas para os serviços desta categoria.
              </p>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default MapaServicos;
