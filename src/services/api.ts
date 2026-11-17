const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  status: number;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

if (!API_URL) {
  throw new Error("A variável VITE_API_URL não foi configurada.");
}

async function lerResposta(response: Response): Promise<unknown> {
  if (response.status === 204 || response.status === 205) {
    return undefined;
  }

  const texto = await response.text();

  if (!texto.trim()) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    try {
      return JSON.parse(texto) as unknown;
    } catch {
      return texto;
    }
  }

  return texto;
}

function obterMensagemErro(dados: unknown, status: number): string {
  if (typeof dados === "string" && dados.trim()) {
    return dados;
  }

  if (dados && typeof dados === "object") {
    const objeto = dados as Record<string, unknown>;

    for (const chave of ["message", "mensagem", "error", "detail", "title"]) {
      const valor = objeto[chave];

      if (typeof valor === "string" && valor.trim()) {
        return valor;
      }
    }
  }

  const mensagens: Record<number, string> = {
    400: "Os dados enviados são inválidos.",
    401: "Sua sessão expirou. Entre novamente na plataforma.",
    403: "Você não tem permissão para realizar esta operação.",
    404: "O recurso solicitado não foi encontrado.",
    409: "A operação não pode ser concluída porque existe um conflito.",
    500: "Ocorreu um erro interno no servidor.",
    502: "O servidor está temporariamente indisponível.",
    503: "O serviço está temporariamente indisponível.",
  };

  return mensagens[status] ?? `Erro na requisição (HTTP ${status}).`;
}

export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        Accept: "application/json",
        ...options.headers,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }

    throw new ApiError(
      "Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.",
      0,
      error
    );
  }

  const dados = await lerResposta(response);

  if (!response.ok) {
    throw new ApiError(
      obterMensagemErro(dados, response.status),
      response.status,
      dados
    );
  }

  return dados as T;
}