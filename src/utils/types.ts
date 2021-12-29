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
  personalOrganization: OrganizationWithPlan;
}

export interface GithubCommit {
  url: string;
  sha: string;
  node_id: string;
  html_url: string;
  comments_url: string;
  commit: {
    url: string;
    message: string;
    author: {
      name?: string;
      email?: string;
      date?: string;
    } | null;
  };
  author: {
    login: string;
    avatar_url: string;
  };
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
