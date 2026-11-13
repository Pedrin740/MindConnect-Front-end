const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error(
    "A variável VITE_API_URL não foi configurada."
  );
}

export async function api<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();

    throw new Error(
      errorMessage || `Erro na requisição: ${response.status}`
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}