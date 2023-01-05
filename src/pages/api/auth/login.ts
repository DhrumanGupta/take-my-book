import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/db";
import { User } from "types/DTOs";
import type { ApiResponse } from "types/responses";
import { verifyPassword } from "lib/crypto";
import { withSessionRoute } from "lib/sesion";
import { UserLoginProps } from "types/requests";

interface ExtendedNextApiRequest extends NextApiRequest {
  body: UserLoginProps;
}

const handler = async (req: ExtendedNextApiRequest, res: ApiResponse<User>) => {
  if (req.method !== "POST") {
    res.status(405).send({ code: 405, msg: "Only POST requests allowed" });
    return;
  }

  const { email, password } = req.body;

  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    return res.status(403).send({ code: 403, msg: "Invalid credentials" });
  }

  const passwordMatch = verifyPassword(password, user.passwordHash, user.salt);

  if (!passwordMatch) {
    return res.status(403).send({ code: 403, msg: "Invalid credentials" });
  }

  const dto = {
    name: user.name,
    email: user.email,
    id: user.id,
    role: user.role,
  };

  req.session.user = dto;
  await req.session.save();

  res.status(200).send({
    code: 200,
    msg: "Login succesful",
    data: dto,
  });
};

export default withSessionRoute(handler);
