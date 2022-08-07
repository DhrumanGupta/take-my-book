import authorizedRoute from "lib/middlewares/authorizedRoute";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "types/DTOs";
import type { ErrorFallback } from "types/responses";

export default authorizedRoute(userRoute);

async function userRoute(
  req: NextApiRequest,
  res: NextApiResponse<ErrorFallback<User>>,
  user: User
) {
  if (req.method !== "GET") {
    res.status(405).send({ msg: "Only POST requests allowed" });
    return;
  }

  // User exists, so return it from the session
  res.json(user);
}
