import useSWR from "swr";
import type { Organization, User } from "@prisma/client";
import { fetcher } from "@utils/fetcher";

export type UserResponse = User & {
  UserToOrganization: {
    organization: Organization;
  }[];
};

export function useMe() {
  const { data, error } = useSWR<UserResponse>("/api/user/me", fetcher);
  return {
    user: data,
    error,
  };
}
