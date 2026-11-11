const configuredApiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");
const pendingGetRequests = new Map<string, Promise<Response>>();

function requestKey(url: string, init: RequestInit) {
  const headers = new Headers(init.headers);
  const headerKey = Array.from(headers.entries()).sort(([a], [b]) => a.localeCompare(b));
  return `${url}|${init.credentials || "same-origin"}|${JSON.stringify(headerKey)}`;
}

export function dedupedFetch(input: RequestInfo | URL, init: RequestInit = {}) {
  const method = (init.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
  if (method !== "GET") return fetch(input, init);

  const url = input instanceof Request ? input.url : String(input);
  const key = requestKey(url, init);
  const existing = pendingGetRequests.get(key);
  if (existing) return existing.then((response) => response.clone());

  const pending = fetch(input, init).finally(() => {
    if (pendingGetRequests.get(key) === pending) pendingGetRequests.delete(key);
  });
  pendingGetRequests.set(key, pending);
  return pending.then((response) => response.clone());
}

export function backendUrl(path: string) {
  return `${configuredApiBase}${path}`;
}

export function backendFetch(path: string, init: RequestInit = {}) {
  return dedupedFetch(backendUrl(path), {
    ...init,
    credentials: "include",
  });
}
