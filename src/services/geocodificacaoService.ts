import { api } from "./api";

export interface ResultadoGeocodificacao {
  latitude: number;
  longitude: number;
  enderecoEncontrado: string | null;
  municipio: string | null;
  cep: string | null;
  confianca: number;
}

const cacheGeocodificacao = new Map<string, ResultadoGeocodificacao | null>();

export async function geocodificarEndereco(endereco: string): Promise<ResultadoGeocodificacao | null> {
  const enderecoNormalizado = endereco.trim().toLowerCase();

  if (!enderecoNormalizado) {
    return null;
  }

  if (cacheGeocodificacao.has(enderecoNormalizado)) {
    return cacheGeocodificacao.get(enderecoNormalizado) ?? null;
  }

  try {
    const resultado = await api<ResultadoGeocodificacao>("/api/geocodificacao", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ endereco }),
    });

    cacheGeocodificacao.set(enderecoNormalizado, resultado);

    return resultado;
  } catch (error) {
    if (error instanceof Error && error.message.includes("404")) {
      cacheGeocodificacao.set(enderecoNormalizado, null);
      return null;
    }

    throw error;
  }
}
