import { IncomingForm } from "formidable";
import authorizedRoute from "lib/middlewares/authorizedRoute";
import {
  getBooks as getBooksDb,
  createBook as createBookDb,
} from "lib/repos/book";
import type { NextApiRequest, NextApiHandler } from "next";
import { Book, User } from "types/DTOs";
import { BookCreateProps, BookSearchProps } from "types/requests";
import { ApiResponse, BookQueryResult } from "types/responses";
import { File } from "formidable";
import mv from "mv";

// @ts-ignore
interface GetBookRequest extends NextApiRequest {
  query: BookSearchProps;
}

// @ts-ignore
interface CreateBookRequest extends NextApiRequest {
  query: BookCreateProps;
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

export const config = {
  api: {
    bodyParser: false,
  },
};

const createBook = async (
  req: CreateBookRequest,
  res: ApiResponse<Book>,
  user: User
) => {
  const { title, isbn, description, price } = req.query;

  if (!title || title.length < 4) {
    return res.status(400).send({ code: 400, msg: "Title too short" });
  }

  if (!isbn || isbn.length < 10) {
    return res.status(400).send({ code: 400, msg: "ISBN too short" });
  }

  if (!description || description.length < 20) {
    return res.status(400).send({ code: 400, msg: "Description too short" });
  }

  const priceInt = parseInt(price);

  if (!priceInt || priceInt < 0) {
    return res.status(400).send({ code: 400, msg: "Price too low" });
  }

  let pictures: string[] = [];

  try {
    pictures = await new Promise((resolve, reject) => {
      const form = new IncomingForm({
        maxFileSize: 4 * 1024 * 1024, // 4mb,
        multiples: true,
        maxFiles: 3,
      });

      // form.multiples = false;

      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        const allFiles = files.files;
        // console.log(fields, files);
        const res: string[] = [];
        const parseFile = (file: File): string => {
          const oldPath = file.filepath;
          const fileName =
            file.newFilename + "." + file.originalFilename?.split(".").at(-1);
          var newPath = `./public/images/user-content/${fileName}`;
          mv(oldPath, newPath, function (err) {
            reject(err);
          });
          return `/images/user-content/${fileName}`;
        };

        if (Array.isArray(allFiles)) {
          for (let file of allFiles) {
            res.push(parseFile(file));
          }
        } else {
          res.push(parseFile(allFiles));
        }

        resolve(res);
      });
    });

    // await addImage({ id, url: path });
  } catch (err) {
    console.log(err);
    res.status(500).send({ code: 500, msg: "Retry" });
  }

  if (pictures.length <= 0) {
    return res.status(400).send({ code: 400, msg: "No pictures provided!" });
  }

  const book = await createBookDb({
    title,
    description,
    isbn,
    price: priceInt,
    pictures,
    listedById: user.id,
  });

  // console.log(book);

  return res.status(200).send({ code: 200, msg: "success", data: book });
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
  // @ts-ignore
  POST: authorizedRoute(createBook),
};

export default route;
