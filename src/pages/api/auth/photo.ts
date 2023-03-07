import { IncomingForm } from "formidable";
import authorizedRoute from "lib/middlewares/authorizedRoute";
import type { NextApiRequest, NextApiHandler } from "next";
import { User } from "types/DTOs";
import { ApiResponse } from "types/responses";
import { File } from "formidable";
import mv from "mv";
import rimraf from "rimraf";
import { prisma } from "lib/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

const updateProfilePicture = async (
  req: NextApiRequest,
  res: ApiResponse<User>,
  user: User
) => {
  let picture: string = "";

  try {
    picture = await new Promise((resolve, reject) => {
      const form = new IncomingForm({
        maxFileSize: 4 * 1024 * 1024, // 4mb,
        multiples: true,
        maxFiles: 1,
      });

      // form.multiples = false;

      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        const allFiles = files.file || files.files;
        // console.log(fields, files);
        let res: string = "";
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
          res = parseFile(allFiles[0]);
        } else {
          res = parseFile(allFiles);
        }

        resolve(res);
      });
    });

    // await addImage({ id, url: path });
  } catch (err) {
    console.log(err);
    res.status(500).send({ code: 500, msg: "Retry" });
  }

  if (!picture || picture.length <= 0) {
    return res.status(400).send({ code: 400, msg: "No picture provided!" });
  }

  if (user.photoUrl) {
    console.log(`./public${user.photoUrl}`);
    rimraf(`./public${user.photoUrl}`);
  }

  const resp = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      photoUrl: picture,
    },
    select: {
      id: true,
      name: true,
      email: true,
      photoUrl: true,
      role: true,
    },
  });

  return res.status(200).send({ code: 200, msg: "success", data: resp });
};

const route: NextApiHandler = async (req, res) => {
  const method = (req.method as keyof typeof methods) || "GET";
  if (methods[method] === undefined) {
    return res.status(405).send({ msg: `${method} not allowed.` });
  }
  return await methods[method](req, res);
};

const methods = {
  // @ts-ignore
  PUT: authorizedRoute(updateProfilePicture),
};

export default route;
