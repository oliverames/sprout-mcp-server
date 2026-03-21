import axios, {
  type AxiosInstance,
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  BASE_URL,
  REQUEST_TIMEOUT_MS,
  MAX_RETRIES,
  RETRY_BASE_DELAY_MS,
  RATE_LIMIT_SOFT_CAP,
  RETRYABLE_STATUS_CODES,
  MAX_202_RETRIES,
} from "../constants.js";
import type { AuthProvider } from "./auth.js";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function handleApiError(error: unknown): string {
  if (error && typeof error === "object" && "isAxiosError" in error) {
    const axiosErr = error as AxiosError<{ error?: string }>;
    const requestId = axiosErr.response?.headers?.["x-sprout-request-id"];
    const suffix = requestId ? ` (Request ID: ${requestId})` : "";

    if (axiosErr.response) {
      const apiMsg = axiosErr.response.data?.error;
      const detail = apiMsg ? ` — ${apiMsg}` : "";
      switch (axiosErr.response.status) {
        case 400:
          return `Bad request. Check parameter values and date formats.${detail}${suffix}`;
        case 401:
          return `Authentication failed. Check your SPROUT_API_TOKEN or OAuth credentials.${detail}${suffix}`;
        case 403:
          return `Insufficient permissions. Verify API access is enabled in Sprout settings.${detail}${suffix}`;
        case 404:
          return `Resource not found. Check the ID is correct.${detail}${suffix}`;
        case 429:
          return `Rate limited. The server will retry automatically.${suffix}`;
        case 504:
          return `Request timed out. Try narrowing the date range or reducing the number of profiles.${suffix}`;
        default:
          return `API error (${axiosErr.response.status}): ${apiMsg ?? axiosErr.message}${suffix}`;
      }
    }

    if (axiosErr.code === "ECONNABORTED") {
      return "Request timed out. Try again or narrow your query.";
    }

    return `Network error: ${axiosErr.message}`;
  }

  if (error instanceof Error) {
    return `Error: ${error.message}`;
  }

  return `Error: ${String(error)}`;
}

class RateLimiter {
  private timestamps: number[] = [];

  async throttle(): Promise<void> {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((t) => now - t < 60_000);

    if (this.timestamps.length >= RATE_LIMIT_SOFT_CAP) {
      const waitMs = 60_000 - (now - this.timestamps[0]!) + 100;
      if (waitMs > 0) {
        await sleep(waitMs);
      }
    }

    this.timestamps.push(Date.now());
  }
}

export interface ApiClient {
  get<T>(path: string): Promise<T>;
  getWithPolling<T>(path: string): Promise<T>;
  post<T>(path: string, body: unknown): Promise<T>;
  postFormData<T>(path: string, formData: FormData): Promise<T>;
}

export function createApiClient(auth: AuthProvider): ApiClient {
  const rateLimiter = new RateLimiter();

  const instance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: REQUEST_TIMEOUT_MS,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "User-Agent": "sprout-mcp-server/1.1.0",
    },
  });

  instance.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const token = await auth.getToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  async function requestWithRetry<T>(
    fn: () => Promise<AxiosResponse<T>>,
    retries = MAX_RETRIES
  ): Promise<T> {
    await rateLimiter.throttle();

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fn();
        return response.data;
      } catch (error) {
        const axiosErr = error as AxiosError;
        const status = axiosErr.response?.status;

        if (status && RETRYABLE_STATUS_CODES.includes(status) && attempt < retries) {
          const retryAfter = axiosErr.response?.headers?.["retry-after"];
          const retryAfterMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : NaN;
          const delayMs = !isNaN(retryAfterMs) && retryAfterMs > 0
            ? retryAfterMs
            : RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
          await sleep(delayMs);
          continue;
        }

        throw error;
      }
    }

    throw new Error("Max retries exceeded");
  }

  async function pollFor202<T>(
    fn: () => Promise<AxiosResponse<T>>
  ): Promise<T> {
    let transientRetries = 0;
    for (let attempt = 0; attempt < MAX_202_RETRIES; attempt++) {
      await rateLimiter.throttle();

      let response: AxiosResponse<T>;
      try {
        response = await fn();
      } catch (error) {
        const axiosErr = error as AxiosError;
        const status = axiosErr.response?.status;
        if (status && RETRYABLE_STATUS_CODES.includes(status) && transientRetries < MAX_RETRIES) {
          transientRetries++;
          await sleep(RETRY_BASE_DELAY_MS * Math.pow(2, transientRetries - 1));
          continue;
        }
        throw error;
      }

      if (response.status !== 202) {
        return response.data;
      }

      const body = response.data as { data?: Array<{ wait_until?: string }> };
      const waitUntil = body?.data?.[0]?.wait_until;
      if (waitUntil) {
        const waitMs = new Date(waitUntil).getTime() - Date.now();
        if (waitMs > 0) {
          await sleep(Math.min(waitMs, 30_000));
        }
      } else {
        await sleep(2000 * (attempt + 1));
      }
    }

    throw new Error(`Media processing timed out after ${MAX_202_RETRIES} poll attempts`);
  }

  return {
    async get<T>(path: string): Promise<T> {
      return requestWithRetry(() => instance.get<T>(path));
    },

    async post<T>(path: string, body: unknown): Promise<T> {
      return requestWithRetry(() => instance.post<T>(path, body));
    },

    async getWithPolling<T>(path: string): Promise<T> {
      return pollFor202(() =>
        instance.get<T>(path, {
          validateStatus: (status: number) => (status >= 200 && status < 300) || status === 202,
        })
      );
    },

    async postFormData<T>(path: string, formData: FormData): Promise<T> {
      return pollFor202(() =>
        instance.post<T>(path, formData, {
          headers: { "Content-Type": undefined },
          validateStatus: (status: number) => (status >= 200 && status < 300) || status === 202,
        })
      );
    },
  };
}
