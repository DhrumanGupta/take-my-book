import axios from "axios";
import { bookRoutes } from "data/routes";
import { Book } from "types/DTOs";
import {
  BookCreateProps,
  BookSearchProps,
  BookUploadImageProps,
} from "types/requests";
import { UploadPictureResult } from "types/responses";
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

interface CreateBookProps extends Omit<BookCreateProps, "pictures"> {
  pictures: File[];
}

const createBook = async ({
  title,
  isbn,
  description,
  price,
  pictures,
}: CreateBookProps): Promise<Book | undefined> => {
  const resp: AxiosResponse<Book> = await axios.post(bookRoutes.create, {
    title,
    isbn,
    description,
    price,
    // pictures,
  });

  const book = resp.data.data!;

  console.log(book);

  await uploadImages(pictures, book.id);

  return book;
};

const uploadImages = async (files: File[], bookId: string): Promise<void> => {
  // const fileData: BookUploadImageProps[] = files.map((file) => ({
  //   name: file.name,
  //   type: file.type,
  // }));

  for (let file of files) {
    const formData = new FormData();
    formData.append("files", file);

    await axios.post(bookRoutes.addImage(bookId), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
};

export { getBook, getBooks, createBook };
