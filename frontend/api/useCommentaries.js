import { fetchApi } from "./fetchApi";
import useSWRImmutable from "swr/immutable";

export const useCommentaries = (id) => {
  const { data, error, mutate } = useSWRImmutable(
    `publications/${id}/comments`,
    fetchApi
  );

  const loading = !data && !error;

  return {
    loading,
    error,
    data,
    mutate,
  };
};
