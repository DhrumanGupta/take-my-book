import S3 from "aws-sdk/clients/s3";
import { NextApiRequest } from "next";
import { BookUploadImageProps } from "types/requests";
import { ApiResponse } from "types/responses";

interface ApiRequest extends NextApiRequest {
  body: BookUploadImageProps[];
}

export default async function handler(
  req: ApiRequest,
  res: ApiResponse<S3.PresignedPost[]>
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .send({ code: 405, msg: "Only POST requests allowed" });
  }

  const data = req.body;

  if (!data || data.length <= 0) {
    return res.status(400).json({ code: 400, msg: "No files provided" });
  }

  if (data.length > 5) {
    return res.status(400).json({ code: 400, msg: "Too many files provided" });
  }

  const s3 = new S3({
    apiVersion: "2006-03-01",
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  });

  for (let file of data) {
    if (!file || !file.name || !file.type) {
      return res.status(400).json({ code: 400, msg: "Invalid file" });
    }
  }

  try {
    const result: S3.PresignedPost[] = [];
    for (let file of data) {
      const post = await s3.createPresignedPost({
        Bucket: process.env.BUCKET_NAME,
        Fields: {
          key: file.name,
          "Content-Type": file.type,
        },
        Expires: 60, // seconds
        Conditions: [
          ["content-length-range", 0, 1048576], // up to 1 MB
        ],
      });
      result.push(post);
    }
    res.status(200).json({ data: result, code: 200, msg: "success" });
  } catch (err) {
    res.status(500).json({ code: 500, msg: err as string });
  }
}
