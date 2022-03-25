import { fetchApi } from "./fetchApi";
import useSWRImmutable from "swr/immutable";

export const usePublications = () => {
  const { data, error, mutate } = useSWRImmutable("publications", fetchApi);

  const loading = !data && !error;

  return {
    loading,
    error,
    data,
    mutate,
  };
};
