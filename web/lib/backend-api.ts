const configuredApiBase = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080").replace(/\/$/, "");

export function backendUrl(path: string) {
  return `${configuredApiBase}${path}`;
}

export function backendFetch(path: string, init: RequestInit = {}) {
  return fetch(backendUrl(path), {
    ...init,
    credentials: "include",
  });
}
