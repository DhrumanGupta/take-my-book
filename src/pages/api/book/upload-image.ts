import { File, IncomingForm } from "formidable";
import mv from "mv";
import { NextApiRequest } from "next";
import { BookUploadImageProps } from "types/requests";
import { ApiResponse, UploadPictureResult } from "types/responses";
import authorizedRoute from "lib/middlewares/authorizedRoute";
import { User } from "types/DTOs";
import { addImage, getBook as getBookDb } from "lib/repos/book";

// @ts-ignore
interface ApiRequest extends NextApiRequest {
  query: BookUploadImageProps;
}

export const config = {
  api: {
    bodyParser: false,
  },
};

const handler = async (
  req: ApiRequest,
  res: ApiResponse<UploadPictureResult>,
  user: User
) => {
  if (!req.method || req.method !== "POST") {
    return res
      .status(400)
      .send({ code: 400, msg: `${req.method || "METHOD"} not allowd` });
  }

  const { id } = req.query;
  if (!id) {
    return res.status(400).send({ code: 400, msg: "Missing id" });
  }

  const book = await getBookDb({ id });

  if (!book) {
    return res.status(400).send({ code: 400, msg: "Book not found" });
  }

  if (book.listedById !== user.id) {
    return res.status(400).send({ code: 400, msg: "Not authorized" });
  }

  if (book.pictures.length >= 3) {
    return res
      .status(400)
      .send({ code: 400, msg: "Maximum pictures already uploaded" });
  }

  try {
    const path: string = await new Promise((resolve, reject) => {
      const form = new IncomingForm({
        maxFileSize: 2 * 1024 * 1024, // 2mb,
      });

      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        const file = files.files as File;
        //   console.log(fields, files);
        const oldPath = file.filepath;
        const fileName =
          file.newFilename + "." + file.originalFilename?.split(".").at(-1);
        var newPath = `./public/images/user-content/${fileName}`;
        mv(oldPath, newPath, function (err) {
          reject(err);
        });

        //   console.log(file);
        resolve(`/images/user-content/${fileName}`);
        //   console.log(files.file);
        //   var oldPath = files.file.filePath;
        //   res.status(200).json({ fields, files });
      });
    });

    await addImage({ id, url: path });

    res.status(200).json({ code: 200, msg: "Success" });
  } catch {
    res.status(500).json({ code: 500, msg: "Retry" });
  }
};

// @ts-ignore
export default authorizedRoute(handler);
