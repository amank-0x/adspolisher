import { backendFetch } from "./backend-api";

/**
 * Unified fetch helper for Creator Dashboard features.
 * Connects directly to backend API (/api/v1/creator/...) with credentials,
 * with automatic fallback to Next.js API route proxy (/api/creator/...).
 */
export async function creatorFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  try {
    const res = await backendFetch(`/api/v1/creator${normalizedPath}`, init);
    if (res.status !== 502 && res.status !== 503) {
      return res;
    }
  } catch (err) {
    console.warn(`[creatorFetch] Direct backend call to /api/v1/creator${normalizedPath} failed:`, err);
  }

  // Fallback to Next.js API route proxy
  return backendFetch(`/api/creator${normalizedPath}`, init);
}
