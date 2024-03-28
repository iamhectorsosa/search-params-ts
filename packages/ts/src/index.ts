type URLSearchParams = Record<string, any>;

type SchemaValidatorFn<TReturn> = (search: URLSearchParams) => TReturn;

type SchemaValidatorObj<TReturn> = {
  parse: SchemaValidatorFn<TReturn>;
};

export type SchemaValidator<TReturn> =
  | SchemaValidatorObj<TReturn>
  | SchemaValidatorFn<TReturn>;

export type Router = {
  push: (href: string) => void;
};

export function useSearchParams<TSearchSchema extends URLSearchParams>({
  schema,
  query,
  router,
}: {
  schema: SchemaValidator<TSearchSchema>;
  query: string;
  router: Router;
}): TSearchSchema & {
  setQuery: (
    input:
      | Partial<TSearchSchema>
      | ((prevParams: TSearchSchema) => Partial<TSearchSchema>)
  ) => void;
  clearQuery: () => void;
} {
  const queryObj = [
    ...new URLSearchParams(query).entries(),
  ].reduce<URLSearchParams>((params, [key, value]) => {
    const decodedValue = decodeURIComponent(value);
    try {
      const parsedValue = JSON.parse(decodedValue);
      params[key] = parsedValue;
    } catch (_e) {
      params[key] = decodedValue;
    }

    return params;
  }, {});

  function _parseQuery(input: URLSearchParams) {
    return typeof schema === "object" ? schema.parse(input) : schema(input);
  }

  function _stringify(input: TSearchSchema) {
    const params = Object.entries(input).map(([key, value]) => [
      key,
      typeof value === "object" ? JSON.stringify(value) : value,
    ]);

    return "?" + new URLSearchParams(params).toString();
  }

  const parsedQuery = _parseQuery(queryObj);

  function setQuery(
    input:
      | Partial<TSearchSchema>
      | ((prevParams: TSearchSchema) => Partial<TSearchSchema>)
  ): void {
    const _setQuery = (prevState: TSearchSchema) =>
      typeof input === "function"
        ? { ...prevState, ...input(prevState) }
        : { ...prevState, ...input };

    const parsedParams = _parseQuery(_setQuery(parsedQuery));
    router.push(_stringify(parsedParams));
  }

  function clearQuery() {
    console.log("ss");
    const parsedParams = _parseQuery({});
    router.push(_stringify(parsedParams));
  }

  return {
    ...parsedQuery,
    setQuery,
    clearQuery,
  };
}
