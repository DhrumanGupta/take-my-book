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
    featuredPicture: book.featuredPicture || "",
    listedOn: book.listedOn.getTime(),
    pictures: book.pictures.map((picture) => picture.url),
    listedById: book.listedById,
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
    where: {
      featuredPicture: {
        not: null,
      },
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
  // console.log(query);
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
  pictures?: string[]; // urls
}

async function createBook({
  title,
  isbn,
  description,
  listedById,
  price,
  pictures,
}: CreateBookProps): Promise<Book | undefined> {
  const data: Prisma.BookCreateArgs = {
    data: {
      title,
      isbn,
      description,
      listedBy: { connect: { id: listedById } },
      price,
    },
    include: {
      pictures: true,
    },
  };

  if (pictures) {
    data.data.featuredPicture = pictures[0];
    data.data.pictures = {
      create: pictures.map((url) => ({ url })),
    };
  }

  const book = (await prisma.book.create(data)) as BookWithPictures;

  return transformBook(book);
}

async function addImage({ id, url }: { id: string; url: string }) {
  await prisma.book.update({
    where: { id },
    data: {
      pictures: {
        create: { url },
      },
      featuredPicture: url,
    },
  });
}

async function getBooksFromUser({ id }: { id: string }) {
  const books = await prisma.book.findMany({
    where: {
      listedById: id,
    },
    include: {
      pictures: true,
    },
  });

  return books.map(transformBook);
}

export { getBooks, getBook, createBook, addImage, getBooksFromUser };
