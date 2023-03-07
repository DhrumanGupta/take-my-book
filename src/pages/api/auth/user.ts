import { IncomingForm } from "formidable";
import mv from "mv";
import { File } from "formidable";
import { prisma } from "lib/db";
import authorizedRoute from "lib/middlewares/authorizedRoute";
import { NextApiRequest, NextApiResponse } from "next";
import { User } from "types/DTOs";
import type { ApiResponse } from "types/responses";

function getUser(req: NextApiRequest, res: ApiResponse<User>, user: User) {
  return res.json({
    code: 200,
    msg: "success",
    data: user,
  });
}

async function addPhoto(req: NextApiRequest, res: NextApiResponse, user: User) {
  const pictures: string[] = await new Promise((resolve, reject) => {
    const form = new IncomingForm({
      maxFileSize: 4 * 1024 * 1024, // 4mb,
      multiples: true,
      maxFiles: 1,
    });

    // form.multiples = false;

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      const allFiles = files.files;
      // console.log(fields, files);
      const res: string[] = [];
      const parseFile = (file: File): string => {
        const oldPath = file.filepath;
        const fileName =
          file.newFilename + "." + file.originalFilename?.split(".").at(-1);
        var newPath = `./public/images/user-content/${fileName}`;
        mv(oldPath, newPath, function (err) {
          reject(err);
        });
        return `/images/user-content/${fileName}`;
      };

      if (Array.isArray(allFiles)) {
        for (let file of allFiles) {
          res.push(parseFile(file));
        }
      } else {
        res.push(parseFile(allFiles));
      }

      resolve(res);
    });
  });

  if (pictures.length <= 0) {
    return res.status(400).send({ code: 400, msg: "No pictures provided!" });
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      photoUrl: pictures[0],
    },
  });

  return res.json({
    code: 200,
    msg: "success",
    data: pictures[0],
  });
}

async function userRoute(
  req: NextApiRequest,
  res: NextApiResponse,
  user: User
) {
  if (req.method === "POST") {
    return await addPhoto(req, res, user);
  }

  if (req.method === "GET") {
    return getUser(req, res, user);
  }

  // User exists, so return it from the session
  res.json({
    code: 200,
    msg: "success",
    data: user,
  });
}

export default authorizedRoute(userRoute);
