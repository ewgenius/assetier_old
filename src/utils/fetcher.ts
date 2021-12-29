import { HttpError } from "./httpErrors";

export const fetcher = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, init).then((r) => {
    if (r.status >= 400) {
      throw new HttpError(r.statusText, r.status);
    }
    return r.json();
  });

export const mapFetcher =
  <T>(getId: (item: T) => string) =>
  (input: RequestInfo, init?: RequestInit) =>
    fetcher(input, init).then((list: T[]) =>
      list.reduce<Record<string, T>>((map, item) => {
        map[getId(item)] = item;
        return map;
      }, {})
    );
