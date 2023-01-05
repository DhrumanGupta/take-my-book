import type { AxiosResponse as AxiosResp } from "axios";
import type { Response } from "types/responses";

type AxiosResponse<T> = AxiosResp<Response<T>>;

export type { AxiosResponse };
