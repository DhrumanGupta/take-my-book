import axios, { Axios } from "axios";
import { authRoutes } from "data/routes";
import { User } from "types/DTOs";
import { UserLoginProps, UserSignupProps } from "types/requests";
import { AxiosResponse } from "./types";

axios.defaults.withCredentials = true;

const getUser = async (): Promise<User | undefined> => {
  const resp: AxiosResponse<User> = await axios.get(authRoutes.user);
  return resp.data.data;
};

const getUserById = async (id: string): Promise<User | undefined> => {
  const resp: AxiosResponse<User> = await axios.get(authRoutes.userById(id));
  return resp.data.data;
};

const logout = async () => {
  await axios.post(authRoutes.logout);
};

const login = async ({
  email,
  password,
}: UserLoginProps): Promise<User | undefined> => {
  const resp: AxiosResponse<User> = await axios.post(authRoutes.login, {
    email,
    password,
  });
  return resp.data.data;
};

const register = async ({ name, email, password }: UserSignupProps) => {
  const resp: AxiosResponse<User> = await axios.post(authRoutes.register, {
    name,
    email,
    password,
  });
  return resp.data.data;
};

const updatePhoto = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const resp: AxiosResponse<User> = await axios.put(
    authRoutes.setImage,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  const user = resp.data.data!;

  return user;
};

export { getUser, getUserById, login, register, logout, updatePhoto };
