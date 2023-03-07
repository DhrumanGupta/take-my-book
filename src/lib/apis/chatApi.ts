import axios from "axios";
import { chatRoutes } from "data/routes";
import { ChatSession } from "types/DTOs";
import { AxiosResponse } from "./types";

axios.defaults.withCredentials = true;

const getChatSessions = async (): Promise<ChatSession[]> => {
  const resp: AxiosResponse<ChatSession[]> = await axios.get(
    chatRoutes.getAllSessions
  );
  return resp.data!.data!;
};

const getChatSession = async (id: string): Promise<ChatSession> => {
  const resp: AxiosResponse<ChatSession> = await axios.get(
    chatRoutes.getSession(id)
  );
  return resp.data!.data!;
};

export { getChatSessions, getChatSession };
