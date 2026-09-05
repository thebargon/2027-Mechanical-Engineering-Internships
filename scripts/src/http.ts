import { AsyncLocalStorage } from "node:async_hooks";

export const requestContext = new AsyncLocalStorage<{ failures: number; partial?: string; lastError?: string }>();
let nextRequestAt = 0;
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Space request starts globally, including retries; callers also use a bounded worker pool.
export async function request(url: string, format: "json" | "text", payload?: Record<string, unknown>): Promise<any | null> {
  let lastError = "Request failed";
  for (let attempt = 0; attempt < 3; attempt++) {
    const start = Math.max(Date.now(), nextRequestAt);
    nextRequestAt = start + 250;
    await sleep(Math.max(0, start - Date.now()));
    try {
      const response = await fetch(url, {
        method: payload ? "POST" : "GET",
        body: payload ? JSON.stringify(payload) : undefined,
        signal: AbortSignal.timeout(12000),
        headers: { "User-Agent": "MechanicalInternshipTracker/1.0", Accept: format === "json" ? "application/json" : "text/html", ...(payload ? { "Content-Type": "application/json" } : {}) },
      });
      if (response.ok) return format === "json" ? await response.json() : await response.text();
      lastError = `HTTP ${response.status}`;
      await response.body?.cancel();
      if (response.status !== 429 && response.status < 500) break;
      const retry = response.headers.get("retry-after");
      const delay = retry ? (Number.isFinite(Number(retry)) ? Number(retry) * 1000 : Date.parse(retry) - Date.now()) : 1000 * 2 ** attempt;
      // Do not retry earlier than a server asks; defer long waits to the next scheduled run.
      if (delay > 10000) break;
      if (attempt < 2) await sleep(Math.max(1000, delay || 1000));
    } catch {
      lastError = "Network, timeout, or response decoding failure";
      if (attempt < 2) await sleep(1000 * 2 ** attempt);
    }
  }
  const context = requestContext.getStore();
  if (context) { context.failures++; context.lastError = lastError; }
  return null;
}

export async function mapLimited<T, R>(items: T[], worker: (item: T) => Promise<R>, limit = 3): Promise<R[]> {
  const result: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      result[index] = await worker(items[index]);
    }
  }));
  return result;
}
