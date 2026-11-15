import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin } from "lucide-react";
import type { LatLngBoundsExpression } from "leaflet";
import type { ServicoAcolhimento } from "../services/servicoTypes";
import "leaflet/dist/leaflet.css";

interface MapaServicosProps {
  servicos: ServicoAcolhimento[];
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

function MapaServicos({ servicos }: MapaServicosProps) {
  const servicosComCoordenadas = useMemo(() => {
    return servicos.filter((servico) => {
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
    });
  }, [servicos]);

  const coordenadas = useMemo<[number, number][]>(
    () =>
      servicosComCoordenadas.map((servico) => [
        Number(servico.latitude),
        Number(servico.longitude),
      ]),
    [servicosComCoordenadas]
  );

  const centroInicial: [number, number] =
    coordenadas.length > 0
      ? coordenadas[0]
      : [-23.5505, -46.6333];

  return (
    <section className="mb-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-col gap-2 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
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

        <span className="w-fit rounded-full bg-violet-50 px-3 py-1.5 text-sm font-semibold text-violet-700">
          {coordenadas.length} localização(ões)
        </span>
      </div>

      {coordenadas.length > 0 ? (
        <MapContainer
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

          {servicosComCoordenadas.map((servico) => (
            <Marker
              key={servico.idServico}
              position={[
                Number(servico.latitude),
                Number(servico.longitude),
              ]}
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
          ))}
        </MapContainer>
      ) : (
        <div className="flex h-[300px] flex-col items-center justify-center px-6 text-center">
          <MapPin size={38} className="text-slate-300" />

          <h3 className="mt-4 font-semibold text-slate-700">
            Nenhuma localização disponível
          </h3>

          <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
            Não encontramos coordenadas geográficas válidas para os serviços
            exibidos nesta consulta.
          </p>
        </div>
      )}
    </section>
  );
}

export default MapaServicos;
