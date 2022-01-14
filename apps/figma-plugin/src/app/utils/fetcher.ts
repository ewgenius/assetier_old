import { HttpError } from "./httpErrors";

export const fetcher = <T = any>(input: RequestInfo, init?: RequestInit) =>
  fetch(input, init).then((r) => {
    if (r.status >= 400) {
      throw new HttpError(r.statusText, r.status);
    }
    return r.json() as Promise<T>;
  });

export const authFetcher =
  <T = any>(token: string) =>
  (input: RequestInfo, init?: RequestInit) =>
    fetcher<T>(input, {
      ...init,
      headers: {
        ...(init?.headers || {}),
        authorization: `Bearer ${token}`,
      },
    });
