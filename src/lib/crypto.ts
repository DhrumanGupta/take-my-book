import { randomBytes, scryptSync, timingSafeEqual } from "crypto";

const generateHashWithSalt = (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return { salt, hash };
};

const verifyPassword = (
  password: string,
  hash: string,
  salt: string
): Boolean => {
  const hashedBuffer = scryptSync(password, salt, 64);

  const keyBuffer = Buffer.from(hash, "hex");
  const match = timingSafeEqual(hashedBuffer, keyBuffer);

  return match;
};

export { generateHashWithSalt, verifyPassword };
