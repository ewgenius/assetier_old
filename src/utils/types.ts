import type { NextComponentType, NextPage, NextPageContext } from "next";
import type { AppProps } from "next/app";
import type { Session } from "next-auth/core/types";
import type { User, Organization, OrganizationPlan } from "@prisma/client";
import { ComponentType, ReactNode } from "react";

export type WithNavId<W = {}> = {
  type: "site" | "app";
  navId: string;
  Wrapper?: ComponentType<W>;
  wrapperProps?: W;
};

export type NextPageExtended<P = {}, IP = P, W = {}> = NextPage<P, IP> &
  WithNavId<W>;

export type AppPropsExtended<P = {}> = AppProps<P> & {
  Component: NextComponentType<NextPageContext, any, P> & WithNavId;
};

export type SessionWithId = Session & {
  userId: string;
};

export type UserWithOrganizations = User & {
  organizations: {
    organization: Organization;
  }[];
};

export type OrganizationWithPlan = Organization & {
  organizationPlan: OrganizationPlan;
};

export interface UserResponse {
  user: UserWithOrganizations;
  personalOrganization: Organization;
}

export interface GithubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string;
  type: "file";
  _links: {
    self: string;
    git: string;
    html: string;
  };
}
