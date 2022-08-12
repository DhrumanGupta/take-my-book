import { Book } from "types/DTOs";
import type { NextApiRequest, NextApiResponse } from "next";
import { getBook as getBookFromDB } from "lib/repos/book";
import { ErrorFallback } from "types/responses";

const getBook = async (
  req: NextApiRequest,
  res: NextApiResponse<ErrorFallback<Book>>
) => {
  const { id } = req.query as { id: string };
  const book = await getBookFromDB({ id });
  if (!book) {
    return res.status(404).send({ msg: "Not Found" });
  }
  return res.status(200).send(book);
};

export default getBook;
