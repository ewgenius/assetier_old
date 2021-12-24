import useSWR from "swr";
import { fetcher } from "@utils/fetcher";

export type Contents = Array<{
  name: string | null;
  download_url: string | null;
  git_url: string;
  _links: {
    html: string;
  };
}>;

export function useProjectContents(organizationId: string, projectId: string) {
  const { data, error } = useSWR<Contents>(
    `/api/organizations/${organizationId}/projects/${projectId}/contents`,
    fetcher
  );

  return {
    contents: data,
    error,
  };
}
