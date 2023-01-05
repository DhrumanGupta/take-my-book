import authorizedRoute from "lib/middlewares/authorizedRoute";
import {
  getBooks as getBooksDb,
  createBook as createBookDb,
} from "lib/repos/book";
import type { NextApiRequest, NextApiHandler } from "next";
import { Book, User } from "types/DTOs";
import { BookCreateProps, BookSearchProps } from "types/requests";
import { ApiResponse, BookQueryResult } from "types/responses";

// @ts-ignore
interface GetBookRequest extends NextApiRequest {
  query: BookSearchProps;
}

interface CreateBookRequest extends NextApiRequest {
  body: BookCreateProps;
}

function isNumeric(str: String) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    // @ts-ignore
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

const getBooks = async (
  req: GetBookRequest,
  res: ApiResponse<BookQueryResult>
) => {
  const { cursor, isbn, search, priceHigh, priceLow } = req.query;

  let high: number | undefined;
  let low: number | undefined;

  if (!priceLow) {
    low = 0;
  }

  if (priceHigh && isNumeric(priceHigh)) {
    high = parseInt(priceHigh);
  }

  if (priceLow && isNumeric(priceLow)) {
    low = parseInt(priceLow);
  }

  const books = await getBooksDb({
    cursor,
    isbn,
    search,
    priceRange: high || low ? { high, low } : undefined,
  });
  return res.status(200).send({
    code: 200,
    msg: "success",
    data: books,
  });
};

const createBook = async (
  req: CreateBookRequest,
  res: ApiResponse<Book>,
  user: User
) => {
  const { title, isbn, description, price, pictures } = req.body;

  if (!title || title.length < 4) {
    return res.status(400).send({ code: 400, msg: "Title too short" });
  }

  if (!isbn || isbn.length < 10) {
    return res.status(400).send({ code: 400, msg: "ISBN too short" });
  }

  if (!description || description.length < 20) {
    return res.status(400).send({ code: 400, msg: "Description too short" });
  }

  if (!price || price < 0 || typeof price !== "number") {
    return res.status(400).send({ code: 400, msg: "Price too low" });
  }

  if (!pictures || pictures.length <= 0) {
    return res.status(400).send({ code: 400, msg: "No pictures provided" });
  }

  for (let picture of pictures) {
    const isUrl = picture.match(
      /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g
    );

    const endsWith =
      picture.endsWith(".jpg") ||
      picture.endsWith(".png") ||
      picture.endsWith(".jpeg");

    if (!isUrl || !endsWith) {
      return res
        .status(400)
        .send({ code: 400, msg: "Invalid picture url provided" });
    }
  }

  const book = await createBookDb({
    title,
    description,
    isbn,
    price,
    pictures,
    listedById: user.id,
  });

  return res.json({ code: 200, msg: "success", data: book });
};

const route: NextApiHandler = async (req, res) => {
  const method = (req.method as keyof typeof methods) || "GET";
  if (methods[method] === undefined) {
    return res.status(405).send({ msg: `${method} not allowed.` });
  }
  return await methods[method](req, res);
};

const methods = {
  GET: getBooks,
  POST: authorizedRoute(createBook),
};

export default route;
