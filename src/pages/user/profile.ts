import { withIronSessionApiRoute } from "iron-session/next";
import * as session from "lib/sesion";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "types/DTOs";
import { ErrorFallback } from "types/responses";

export default withIronSessionApiRoute(userRoute, session.sessionOptions);

async function userRoute(
  req: NextApiRequest,
  res: NextApiResponse<ErrorFallback<User>>
) {
  if (req.method !== "GET") {
    return res.status(405).send({ msg: "Only POST requests allowed" });
  }

  if (!req.session.user) {
    return res.status(401).send({ msg: "Not logged in" });
  }

  // User exists, so return it from the session
  res.json({
    ...req.session.user,
  });
}
