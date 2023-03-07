import { prisma } from "lib/db";
import { withSessionRoute } from "lib/sesion";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "types/DTOs";

const authorizedRoute = (
  handler: (
    req: NextApiRequest,
    res: NextApiResponse,
    user: User
  ) => undefined | Promise<any>
) => {
  return withSessionRoute(async (req, res) => {
    if (!req.session.user) {
      return res.status(401).send({ msg: "Not logged in" });
    }

    const user: User | null = await prisma.user.findFirst({
      where: { id: req.session.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        photoUrl: true,
      },
    });

    // console.log(`id: ${req.session.user.id}`);
    // console.log(`user: ${user}`);

    if (!user) {
      req.session.destroy();
      return res.status(403).send({ code: 403, msg: "Not logged in" });
    }

    return handler(req, res, user);
  });
};

export default authorizedRoute;
