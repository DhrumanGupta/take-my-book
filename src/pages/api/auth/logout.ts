import type { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import { PrismaClient } from "@prisma/client";
import { sessionOptions } from "lib/sesion";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).send({ msg: "Only POST requests allowed" });
    return;
  }

  await req.session.destroy();
  res.status(200).send({});
};

export default withIronSessionApiRoute(handler, sessionOptions);
