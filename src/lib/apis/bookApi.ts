import type { PresignedPost } from "aws-sdk/clients/s3";
import axios from "axios";
import { bookRoutes } from "data/routes";
import { Book } from "types/DTOs";
import {
  BookCreateProps,
  BookSearchProps,
  BookUploadImageProps,
} from "types/requests";
import { AxiosResponse } from "./types";

const getBook = async (id: string): Promise<Book | undefined> => {
  try {
    const resp: AxiosResponse<Book> = await axios.get(bookRoutes.getFromId(id));
    return resp.data.data;
  } catch (e) {
    return undefined;
  }
};

const getBooks = async ({
  cursor,
  isbn,
  search,
  priceLow,
  priceHigh,
}: BookSearchProps): Promise<Book[]> => {
  const route = bookRoutes.getAll({
    cursor,
    isbn,
    search,
    priceLow,
    priceHigh,
  });

  const resp: AxiosResponse<Book[]> = await axios.get(route);
  return resp.data.data!;
};

const createBook = async ({
  title,
  isbn,
  description,
  price,
  pictures,
}: BookCreateProps): Promise<Book | undefined> => {
  const resp: AxiosResponse<Book> = await axios.post(bookRoutes.create, {
    title,
    isbn,
    description,
    price,
    pictures,
  });
  return resp.data.data;
};

const uploadImages = async (files: File[]): Promise<string[]> => {
  const fileData: BookUploadImageProps[] = files.map((file) => ({
    name: file.name,
    type: file.type,
  }));

  const resp: AxiosResponse<PresignedPost[]> = await axios.post(
    bookRoutes.addImage,
    fileData
  );

  const data = resp.data.data!;

  for (let i = 0; i < files.length; i++) {
    await axios.put(data[i].url, files[i], {
      headers: {
        "Content-Type": files[i].type,
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  return data.map((d) => d.url);
};

export { getBook, getBooks, createBook, uploadImages };
