import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import Joi from "joi";
import validate from "lib/middlewares/validate";
import { User } from "types/DTOs";
import { ErrorFallback } from "types/responses";
import { generateHashWithSalt } from "lib/crypto";

const prisma = new PrismaClient();

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
    name: string;
  };
}

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(32).required(),
  name: Joi.string().min(6).max(32).required(),
});

const handler = async (
  req: ExtendedNextApiRequest,
  res: NextApiResponse<ErrorFallback<User>>
) => {
  if (req.method !== "POST") {
    res.status(405).send({ msg: "Only POST requests allowed" });
    return;
  }

  const { email, password, name } = req.body;

  const userExists = await prisma.user.count({ where: { email } });
  if (Boolean(userExists)) {
    return res.status(409).send({ msg: "Account with email already exists" });
  }

  const { salt, hash } = generateHashWithSalt(password);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash: hash,
      salt,
    },
    select: {
      email: true,
      name: true,
    },
  });

  res.status(201).send(user);
};

export default validate({ body: schema }, handler);
