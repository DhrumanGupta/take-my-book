export interface Error {
  msg: string;
}

export type ErrorFallback<T> = Error | T;
