import { fetchApi } from "./fetchApi";
import useSWRImmutable from "swr/immutable";

export const useProfil = () => {
  const { data, error, mutate } = useSWRImmutable("users/me", fetchApi);

  const loading = !data && !error;

  return {
    loading,
    error,
    data,
    mutate,
  };
};
