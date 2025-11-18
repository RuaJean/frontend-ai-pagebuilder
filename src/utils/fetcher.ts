export async function fetcher<T>(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  if (!response.ok) {
    throw new Error(`Error ${response.status}`);
  }
  return (await response.json()) as T;
}
