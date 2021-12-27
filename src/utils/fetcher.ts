export const fetcher = (input: RequestInfo, init?: RequestInit) =>
  fetch(input, init).then((res) => res.json());

export const mapFetcher =
  <T>(getId: (item: T) => string) =>
  (input: RequestInfo, init?: RequestInit) =>
    fetcher(input, init).then((list: T[]) =>
      list.reduce<Record<string, T>>((map, item) => {
        map[getId(item)] = item;
        return map;
      }, {})
    );
