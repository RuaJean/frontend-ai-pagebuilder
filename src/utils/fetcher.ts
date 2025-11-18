export async function fetchJson<TResponse>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<TResponse> {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`Error HTTP ${response.status}`);
  }
  return response.json() as Promise<TResponse>;
}
