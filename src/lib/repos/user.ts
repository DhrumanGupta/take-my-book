import { prisma } from "lib/db";
import { Prisma } from "@prisma/client";
import type { User } from "types/DTOs";
// import { BookQueryResult } from "types/responses";

type BookWithPictures = Prisma.BookGetPayload<{ include: { pictures: true } }>;

// function transformBook(book: BookWithPictures): Book {
//   return {
//     id: book.id,
//     title: book.title,
//     isbn: book.isbn,
//     description: book.description,
//     price: book.price,
//     featuredPicture: book.featuredPicture || "",
//     listedOn: book.listedOn.getTime(),
//     pictures: book.pictures.map((picture) => picture.url),
//     listedById: book.listedById,
//   };
// }

async function getUser({ id }: { id: string }): Promise<User | undefined> {
  if (!id) {
    return undefined;
  }

  const book = await prisma.user.findFirst({
    where: { id },
  });

  if (!book) {
    return undefined;
  }

  // const transformed = transformBook(book);

  return book;
}

interface CreateBookProps {
  title: string;
  isbn: string;
  description: string;
  listedById: string;
  price: number;
  pictures?: string[]; // urls
}

export { getUser };
