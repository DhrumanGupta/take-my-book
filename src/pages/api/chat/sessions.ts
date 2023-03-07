import authorizedRoute from "lib/middlewares/authorizedRoute";
import { getChatSessionsForUser } from "lib/repos/chat";
import { NextApiRequest, NextApiResponse } from "next";
import { ChatSession, User } from "types/DTOs";
import { ApiResponse } from "types/responses";

const getSessions = async (
  req: NextApiRequest,
  res: ApiResponse<ChatSession[]>,
  user: User
) => {
  if (req.method !== "GET") {
    return res.status(400).send({ msg: "Method not allowed", code: 400 });
  }

  const sessions = await getChatSessionsForUser(user.id);

  return res.status(200).send({
    msg: "success",
    data: sessions,
    code: 200,
  });
};

export default authorizedRoute(getSessions);
