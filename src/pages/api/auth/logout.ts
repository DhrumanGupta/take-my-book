import { withSessionRoute } from "lib/sesion";
import type { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).send({ msg: "Only POST requests allowed" });
    return;
  }

  await req.session.destroy();
  res.status(200).send({});
};

export default withSessionRoute(handler);
