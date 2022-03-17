import { fetchApi } from "./fetchApi";
import useSWR from "swr";

export const usePublications = () => {
  const { data, error, mutate } = useSWR("publications", fetchApi);

  const loading = !data && !error;

  return {
    loading,
    error,
    data,
    mutate,
  };
};
