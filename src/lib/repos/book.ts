import { prisma } from "lib/db";
import { Prisma } from "@prisma/client";
import type { Book } from "types/DTOs";

type BookWithPictures = Prisma.BookGetPayload<{ include: { pictures: true } }>;

interface GetBookProps {
  cursor?: string;
  isbn?: string;
  search?: string;
}

async function getBooks({
  cursor,
  isbn,
  search,
}: GetBookProps): Promise<Book[]> {
  const query: Parameters<typeof prisma.book.findMany>[0] = {
    take: 20,
    orderBy: {
      listedOn: "desc",
    },
    include: {
      pictures: {
        select: {
          url: true,
        },
      },
    },
  };

  if (cursor) {
    query.cursor = { id: cursor };
  }

  if (isbn) {
    query.where = { ...query.where, isbn: { contains: isbn.toUpperCase() } };
  }

  if (search) {
    query.where = {
      ...query.where,
      title: { contains: search, mode: "insensitive" },
    };
  }

  const books = (await prisma.book.findMany(query)) as BookWithPictures[];
  const transformed = books.map((book) => ({
    id: book.id,
    title: book.title,
    isbn: book.isbn,
    description: book.description,
    price: book.price,
    featuredPicture: book.featuredPicture,
    listedOn: book.listedOn,
    pictures: book.pictures.map((picture) => picture.url),
  }));

  return transformed;
}

async function getBook({ id }: { id: string }): Promise<Book> {
  const book = (await prisma.book.findFirst({
    where: { id },
    include: {
      pictures: {
        select: {
          url: true,
        },
      },
    },
  })) as BookWithPictures;

  const transformed = {
    id: book.id,
    title: book.title,
    isbn: book.isbn,
    description: book.description,
    price: book.price,
    featuredPicture: book.featuredPicture,
    listedOn: book.listedOn,

    pictures: book.pictures.map((picture) => picture.url),
  };

  return transformed;
}

export { getBooks, getBook };
