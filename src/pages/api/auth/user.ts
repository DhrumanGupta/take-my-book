import authorizedRoute from "lib/middlewares/authorizedRoute";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "types/DTOs";
import type { ApiResponse } from "types/responses";

export default authorizedRoute(userRoute);

async function userRoute(
  req: NextApiRequest,
  res: ApiResponse<User>,
  user: User
) {
  if (req.method !== "GET") {
    res.status(405).send({ code: 405, msg: "Only GET requests allowed" });
    return;
  }

  // User exists, so return it from the session
  res.json({
    code: 200,
    msg: "success",
    data: user,
  });
}
