import { withSessionRoute } from "lib/sesion";
import type { NextApiHandler } from "next";
import { ApiResponse } from "types/responses";

const handler: NextApiHandler = async (req, res: ApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).send({ code: 405, msg: "Only POST requests allowed" });
    return;
  }

  await req.session.destroy();
  res.status(200).send({ code: 200, msg: "Success" });
};

export default withSessionRoute(handler);
