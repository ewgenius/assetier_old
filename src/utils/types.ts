import type { NextComponentType, NextPage, NextPageContext } from "next";
import type { AppProps } from "next/app";
import type { Session } from "next-auth/core/types";
import type { User, Organization } from "@prisma/client";

export type WithNavId = {
  type: "site" | "app";
  navId: string;
};

export type NextPageExtended<P = {}, IP = P> = NextPage<P, IP> & WithNavId;

export type AppPropsExtended<P = {}> = AppProps<P> & {
  Component: NextComponentType<NextPageContext, any, P> & WithNavId;
};

export type ErrorResponse = {
  error: string;
};

export type SessionWithId = Session & {
  userId: string;
};

export type UserWithOrganizations = User & {
  organizations: {
    organization: Organization;
  }[];
};

export interface UserResponse {
  user: UserWithOrganizations;
  personalOrganization: Organization;
}
