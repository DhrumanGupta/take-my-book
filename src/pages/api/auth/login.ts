import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { PrismaClient } from "@prisma/client";
import { User } from "types/DTOs";
import { ErrorFallback } from "types/responses";
import { sessionOptions } from "lib/sesion";
import { verifyPassword } from "lib/crypto";

const prisma = new PrismaClient();

interface ExtendedNextApiRequest extends NextApiRequest {
  body: {
    email: string;
    password: string;
  };
}

const handler = async (
  req: ExtendedNextApiRequest,
  res: NextApiResponse<ErrorFallback<{ user: User; msg: string }>>
) => {
  if (req.method !== "POST") {
    res.status(405).send({ msg: "Only POST requests allowed" });
    return;
  }

  const { email, password } = req.body;

  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    return res.status(403).send({ msg: "Invalid credentials" });
  }

  const passwordMatch = verifyPassword(password, user.passwordHash, user.salt);

  if (!passwordMatch) {
    return res.status(403).send({ msg: "Invalid credentials" });
  }

  const dto = {
    name: user.name,
    email: user.email,
  };

  req.session.user = dto;
  await req.session.save();

  res.status(201).send({
    msg: "Login succesful",
    user: dto,
  });
};

export default withIronSessionApiRoute(handler, sessionOptions);
