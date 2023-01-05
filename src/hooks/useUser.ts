import useSWR, { KeyedMutator } from "swr";
import { getUser } from "lib/apis/userApi";
import { authRoutes } from "data/routes";
import { User } from "types/DTOs";
import { Response } from "types/responses";

type Data = {
  loading: boolean;
  loggedIn: boolean;
  user: User;
  mutate: KeyedMutator<User | undefined>;
};

const useUser = (): Data => {
  const { data, mutate, error } = useSWR<User | undefined>(
    authRoutes.user,
    getUser,
    {
      refreshInterval: 300000, // 5 Minutes
      shouldRetryOnError: false,
    }
  );

  const loading = Boolean(!data && !error);
  const loggedIn = Boolean(!error && data);

  return {
    loading,
    loggedIn,
    user: data!,
    mutate,
  };
};

export default useUser;
