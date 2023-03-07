import { Book } from "types/DTOs";
import type { NextApiRequest } from "next";
import { getBooksFromUser } from "lib/repos/book";
import { ApiResponse } from "types/responses";

const getBook = async (req: NextApiRequest, res: ApiResponse<Book[]>) => {
  const { id } = req.query as { id: string };
  const book = await getBooksFromUser({ id });

  if (!book) {
    return res.status(404).send({ code: 404, msg: "Not Found" });
  }

  return res.status(200).send({ code: 200, msg: "success", data: book });
};

export default getBook;
