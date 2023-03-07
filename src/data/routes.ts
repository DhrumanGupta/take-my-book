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
  userById: (id: string) => `${authBaseRoute}/${id}`,
  setImage: `${authBaseRoute}/photo`,
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
  addImage: (id: string) => `${bookBaseRoute}/upload-image?id=${id}`,
  getForUser: (id: string) => `${bookBaseRoute}/user/${id}`,
};

const chatBaseRoute = `${basePath}/chat`;
export const chatRoutes = {
  getAllSessions: `${chatBaseRoute}/sessions`,
  getSession: (userId: string) => `${chatBaseRoute}/session?userId=${userId}`,
};

const adminBaseRoute = `${basePath}/admin`;
export const adminRoutes = {
  logs: `${adminBaseRoute}/logs`,
};
