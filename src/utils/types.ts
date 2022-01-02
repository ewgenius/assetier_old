import type {
  NextApiRequest,
  NextApiResponse,
  NextComponentType,
  NextPage,
  NextPageContext,
} from "next";
import type { AppProps } from "next/app";
import type { Session } from "next-auth/core/types";
import type {
  User,
  Organization,
  OrganizationPlan,
  Project,
} from "@prisma/client";
import type { ComponentType } from "react";

export type WithNavId<W = {}> = {
  type: "site" | "app";
  navId: string;
  Wrapper?: ComponentType<W>;
  wrapperProps?: W;
};

export type NextPageExtended<P = {}, IP = P, W = {}> = NextPage<P, IP> &
  WithNavId<W>;

export type AppPropsExtended<P = {}> = AppProps<P> & {
  Component: NextComponentType<NextPageContext, {}, P> & WithNavId;
};

export type NextApiRequestWithSession = NextApiRequest & {
  session: SessionWithId;
};

export type NextApiRequestWithOrganization = NextApiRequestWithSession & {
  user: User;
  organization: OrganizationWithPlan;
};

export type NextApiRequestWithProject = NextApiRequestWithOrganization & {
  project: Project;
};

export type NextApiRequestWithUser = NextApiRequestWithSession & {
  user: User;
};

export type NextApiHandlerWithUser<T = any> = (
  req: NextApiRequestWithUser,
  res: NextApiResponse<T>
) => void | Promise<void>;

export type NextApiHandlerWithOrganization<T = any> = (
  req: NextApiRequestWithOrganization,
  res: NextApiResponse<T>
) => void | Promise<void>;

export type NextApiHandlerWithProject<T = any> = (
  req: NextApiRequestWithProject,
  res: NextApiResponse<T>
) => void | Promise<void>;

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

export interface UserMe {
  user: UserWithOrganizations;
  personalOrganization: OrganizationWithPlan;
  organizations: OrganizationWithPlan[];
}

export interface OctokitError {
  error: string;
  status: number;
}

export type GithubConnection = Pick<
  Project,
  "githubInstallationId" | "repositoryId"
> & {
  branch: string;
};

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

export interface GithubBranch {
  name: string;
  commit: {
    sha: string;
    url: string;
  };
  protected: boolean;
  protection?: {
    url?: string;
    enabled?: boolean;
    required_status_checks?: {
      url?: string;
      enforcement_level?: string;
      contexts: string[];
      contexts_url?: string;
      strict?: boolean;
    };
  };
  protection_url?: string;
}
