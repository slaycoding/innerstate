import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * Gets the base URL for the Express API server (e.g., "https://stillness.onrender.com")
 * @returns {string} The API base URL
 */
export function getApiUrl(): string {
  const url = "https://stillness.onrender.com";
  console.log("API BASE URL:", url);
  return url;
}
async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  route: string,
  data?: unknown,
): Promise<Response> {
  const baseUrl = getApiUrl();
  const url = new URL(route, baseUrl);

  console.log("API REQUEST:", method, url.toString(), data);

  const res = await fetch(url.toString(), {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
  });

  console.log("FETCH FINISHED:", res.status);

  await throwIfResNotOk(res);
  return res;
}
type UnauthorizedBehavior = "returnNull" | "throw";

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const baseUrl = getApiUrl();
    const path = Array.isArray(queryKey) ? queryKey.join("/") : String(queryKey);
    const url = new URL(path, baseUrl);

    console.log("QUERY REQUEST:", url.toString());

    const res = await fetch(url.toString(), {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("QUERY RESPONSE STATUS:", res.status);

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null as any;
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${res.status}: ${text}`);
    }

    return await res.json();
  };
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
