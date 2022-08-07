interface Error {
  msg: string;
}

type ErrorFallback<T> = Error | T;

export type { Error, ErrorFallback };
