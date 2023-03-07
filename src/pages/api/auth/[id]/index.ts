import authorizedRoute from "lib/middlewares/authorizedRoute";
import { NextApiRequest } from "next";
import { User } from "types/DTOs";
import { prisma } from "lib/db";
import { ApiResponse } from "types/responses";

const userRoute = async (
  req: NextApiRequest,
  res: ApiResponse<User | undefined>,
  user: User
) => {
  const { id } = req.query as { id: string };
  const fetchedUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!fetchedUser) {
    return res.status(404).send({ code: 404, msg: "User not found" });
  }

  return res.json({
    code: 200,
    msg: "success",
    data: {
      id: fetchedUser.id,
      name: fetchedUser.name,
      email: fetchedUser.email,
      photoUrl: fetchedUser.photoUrl,
      role: fetchedUser.role,
    },
  });
};

export default authorizedRoute(userRoute);
