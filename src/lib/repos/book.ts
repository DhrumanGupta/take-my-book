import { prisma } from "lib/db";
import { Prisma } from "@prisma/client";
import type { Book } from "types/DTOs";
import { User } from "types/DTOs";
import { BookQueryResult } from "types/responses";

type BookWithPictures = Prisma.BookGetPayload<{ include: { pictures: true } }>;

interface PriceRange {
  low?: number;
  high?: number;
}

interface GetBookProps {
  cursor?: string;
  isbn?: string;
  search?: string;
  priceRange?: PriceRange;
}

function transformBook(book: BookWithPictures): Book {
  return {
    id: book.id,
    title: book.title,
    isbn: book.isbn,
    description: book.description,
    price: book.price,
    featuredPicture: book.featuredPicture,
    listedOn: book.listedOn,
    pictures: book.pictures.map((picture) => picture.url),
  };
}

async function getBooks({
  cursor,
  isbn,
  search,
  priceRange,
}: GetBookProps): Promise<BookQueryResult> {
  const query: Parameters<typeof prisma.book.findMany>[0] = {
    take: 21,
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

  if (cursor && cursor.length > 0) {
    query.cursor = { id: cursor };
  }

  if (isbn && isbn.length > 0) {
    query.where = { ...query.where, isbn: { contains: isbn.toUpperCase() } };
  }

  if (search && search.length > 0) {
    query.where = {
      ...query.where,
      title: { contains: search, mode: "insensitive" },
    };
  }

  if (priceRange) {
    if (!priceRange?.low || priceRange.low <= 0) {
      priceRange.low = 0;
    }

    if (priceRange.high) {
      if (priceRange.high < priceRange.low) {
        priceRange.high = priceRange.low;
      }

      query.where = {
        ...query.where,
        price: {
          lte: priceRange.high,
        },
      };
    }

    if (priceRange.low) {
      query.where = {
        ...query.where,
        price: {
          // @ts-ignore
          ...query.where?.price,
          gte: priceRange.low,
        },
      };
    }
  }
  console.log(query);
  const books = (await prisma.book.findMany(query)) as BookWithPictures[];
  let last = undefined;
  if (books.length > 20) {
    last = books.pop();
  }
  const transformed = books.map(transformBook);

  return {
    books: transformed,
    nextCursor: last?.id,
  };
}

async function getBook({ id }: { id: string }): Promise<Book | undefined> {
  if (!id) {
    return undefined;
  }

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

  if (!book) {
    return undefined;
  }

  const transformed = transformBook(book);

  return transformed;
}

interface CreateBookProps {
  title: string;
  isbn: string;
  description: string;
  listedById: string;
  price: number;
  pictures: string[]; // urls
}

async function createBook({
  title,
  isbn,
  description,
  listedById,
  price,
  pictures,
}: CreateBookProps): Promise<Book | undefined> {
  if (pictures.length <= 0) {
    throw new Error("No pictures provided");
  }

  const book = (await prisma.book.create({
    data: {
      title,
      isbn,
      description,
      listedBy: { connect: { id: listedById } },
      price,
      featuredPicture: pictures[0],
      pictures: {
        create: pictures.map((url) => ({ url })),
      },
    },
    select: {
      pictures: true,
    },
  })) as BookWithPictures;

  return transformBook(book);
}

export { getBooks, getBook, createBook };
