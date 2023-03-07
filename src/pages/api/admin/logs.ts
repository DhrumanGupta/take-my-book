import { Role } from "@prisma/client";
import authorizedRoute from "lib/middlewares/authorizedRoute";
import { NextApiRequest } from "next";
import { Book, User } from "types/DTOs";
import { ApiResponse } from "types/responses";
import { prisma } from "lib/db";

const getSessions = async (
  req: NextApiRequest,
  res: ApiResponse<Book[]>,
  user: User
) => {
  if (req.method !== "GET") {
    return res.status(400).send({ msg: "Method not allowed", code: 400 });
  }

  if (user.role !== Role.ADMIN) {
    return res.status(401).send({ msg: "Unauthorized", code: 401 });
  }

  const books = await prisma.book.findMany({
    include: {
      pictures: true,
    },
  });

  const transformed: Book[] = books.map((book) => ({
    id: book.id,
    title: book.title,
    isbn: book.isbn,
    description: book.description,
    price: book.price,
    featuredPicture: book.featuredPicture!,
    listedById: book.listedById,
    listedOn: book.listedOn.getTime(),
    pictures: book.pictures.map((pic) => pic.url),
  }));

  return res.status(200).send({ code: 200, data: transformed, msg: "success" });
};

export default authorizedRoute(getSessions);
