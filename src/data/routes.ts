//const env = process.env.NODE_ENV || "development";

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

const petitionBaseRoute = `${basePath}/petition`;
export const petitionRoutes = {
  getFromId: (id: string) => `${petitionBaseRoute}/${id}`,
  getAll: (query: string) => `${petitionBaseRoute}${query}`,
  getUser: `${petitionBaseRoute}/user`,
  create: `${petitionBaseRoute}/`,
  sign: `${petitionBaseRoute}/sign`,
  video: `${petitionBaseRoute}/videos`,
};
