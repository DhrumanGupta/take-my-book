//const env = process.env.NODE_ENV || "development";

import { BookSearchProps } from "types/requests";

//const domain = env === "development" ? "localhost:1337" : "backend.travelcheapwith.tech";
//const basePath = `http${env !== "development" ? s : ""}://${domain}`;
const basePath = "/api";

const authBaseRoute = `${basePath}/auth`;
export const authRoutes = {
  login: `${authBaseRoute}/login`,
  logout: `${authBaseRoute}/logout`,
  register: `${authBaseRoute}/register`,
  user: `${authBaseRoute}/user`,
};

const bookBaseRoute = `${basePath}/book`;
export const bookRoutes = {
  getFromId: (id: string) => `${bookBaseRoute}/${id}`,
  getAll: (params: BookSearchProps) => {
    Object.keys(params).forEach((key) => {
      // @ts-ignore
      if (params[key] === undefined) {
        // @ts-ignore
        delete params[key];
      }
    });

    return `${bookBaseRoute}?${new URLSearchParams(params as any)}`;
  },
  create: `${bookBaseRoute}/`,
  addImage: `${bookBaseRoute}/images`,
};
