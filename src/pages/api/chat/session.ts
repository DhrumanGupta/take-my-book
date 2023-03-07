import authorizedRoute from "lib/middlewares/authorizedRoute";
import { getChatSession, getChatSessionsForUser } from "lib/repos/chat";
import { NextApiRequest, NextApiResponse } from "next";
import { ChatSession, User } from "types/DTOs";
import { ApiResponse } from "types/responses";

const getSessions = async (
  req: NextApiRequest,
  res: ApiResponse<ChatSession>,
  user: User
) => {
  if (req.method !== "GET") {
    return res.status(400).send({ msg: "Method not allowed", code: 400 });
  }
  const { userId } = req.query;

  //   if (!userId) return res.status(400).send({ msg: "No user id", code: 400 });

  const session = await getChatSession(user.id, userId as string);

  if (!session) {
    return res.status(400).send({
      msg: "Invalid user ids",
      code: 400,
    });
  }

  return res.status(200).send({
    msg: "success",
    data: session,
    code: 200,
  });
};

export default authorizedRoute(getSessions);
