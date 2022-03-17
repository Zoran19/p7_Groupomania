import { fetchApi } from "./fetchApi";
import useSWR from "swr";

export const useProfil = () => {
  const { data, error, mutate } = useSWR("users/me", fetchApi);

  const loading = !data && !error;

  return {
    loading,
    error,
    data,
    mutate,
  };
};
