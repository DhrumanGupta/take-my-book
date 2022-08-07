import { getBooks as getBooksFromDb } from "lib/repos/book";
import type { NextApiRequest, NextApiResponse } from "next";
import { Book } from "types/DTOs";

interface ExtendedNextApiRequest extends NextApiRequest {
  query: {
    cursor?: string;
    isbn?: string;
    search?: string;
  };
}

const getBooks = async (
  req: ExtendedNextApiRequest,
  res: NextApiResponse<Book[]>
) => {
  const { cursor, isbn, search } = req.query;
  const books = await getBooksFromDb({ cursor, isbn, search });
  return res.status(200).send(books);
};

const route = async (req: NextApiRequest, res: NextApiResponse) => {
  const method = (req.method as keyof typeof methods) || "GET";
  if (methods[method] === undefined) {
    return res.status(405).send({ msg: `${method} not allowed.` });
  }
  return await methods[method](req, res);
};

const methods = {
  GET: getBooks,
};

export default route;
