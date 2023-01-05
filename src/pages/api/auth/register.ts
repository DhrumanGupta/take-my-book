import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/db";
import Joi from "joi";
import validate from "lib/middlewares/validate";
import { User } from "types/DTOs";
import { generateHashWithSalt } from "lib/crypto";
import type { ApiResponse } from "types/responses";
import { withSessionRoute } from "lib/sesion";
import { UserSignupProps } from "types/requests";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: UserSignupProps;
}

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(32).required(),
  name: Joi.string()
    .regex(/^[a-zA-Z ]*$/m)
    .min(6)
    .max(32)
    .required(),
});

const handler = async (req: ExtendedNextApiRequest, res: ApiResponse<User>) => {
  if (req.method !== "POST") {
    res.status(405).send({ code: 405, msg: "Only POST requests allowed" });
    return;
  }

  const { email, password, name } = req.body;

  const userExists = await prisma.user.count({ where: { email } });
  if (Boolean(userExists)) {
    return res
      .status(409)
      .send({ code: 409, msg: "Account with email already exists" });
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
      id: true,
      role: true,
    },
  });

  req.session.user = user;
  await req.session.save();

  res.status(201).send({
    code: 201,
    msg: "sucess",
    data: user,
  });
};

export default validate({ body: schema }, async (req, res) => {
  return await withSessionRoute(handler)(req, res);
});
