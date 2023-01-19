import { NextApiResponse } from "next";
import { Book } from "./DTOs";
import S3 from "aws-sdk/clients/s3";

interface Response<T> {
  code: Number;
  msg: string;
  data?: T;
}

interface BookQueryResult {
  books: Book[];
  nextCursor?: string;
}

type UploadPictureResult = string;

type ApiResponse<T = void> = NextApiResponse<Response<T>>;

export type { Response, ApiResponse, BookQueryResult, UploadPictureResult };
