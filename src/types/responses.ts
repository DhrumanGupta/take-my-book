import { NextApiResponse } from "next";
import { Book } from "./DTOs";

interface Response<T> {
  code: Number;
  msg: string;
  data?: T;
}

interface BookQueryResult {
  books: Book[];
  nextCursor?: string;
}

type ApiResponse<T = void> = NextApiResponse<Response<T>>;

export type { Response, ApiResponse, BookQueryResult };
