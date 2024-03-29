import type {
  NextApiRequest,
  NextApiResponse,
  NextComponentType,
  NextPage,
  NextPageContext,
} from "next";
import type { AppProps } from "next/app";
import type { Session } from "@auth0/nextjs-auth0";
import type {
  User,
  Project,
  Account,
  Subscription,
  SubscriptionPlan,
} from "@assetier/prisma";
import type { ComponentType } from "react";

export type { User } from "@assetier/prisma";
export type { Account } from "@assetier/prisma";
export type { Project } from "@assetier/prisma";
export type { FigmaReadWritePair } from "@assetier/prisma";

export type WithNavId<W = {}> = {
  type: "site" | "app" | "auth" | "auth0";
  navId?: string;
  Wrapper?: ComponentType<W>;
  wrapperProps?: W;
};

export type NextPageExtended<P = {}, IP = P, W = {}> = NextPage<P, IP> &
  WithNavId<W>;

export type AppPropsExtended<P = {}> = AppProps<P> & {
  Component: NextComponentType<NextPageContext, {}, P> & WithNavId;
};

export type Middleware = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<any>;

export interface AuthSession extends Session {
  user: {
    nickname: string;
    name: string;
    picture: string;
    updated_at: string;
    email: string;
    sub: string;
  };

  userId: string;
}

export type NextApiRequestWithJWTUser = NextApiRequest & {
  user: {
    sub: string;
    perimssions: string[];
  };
  session: {
    userId: string;
  };
};

export type NextApiRequestWithSession = NextApiRequest & {
  session: AuthSession;
};

export type NextApiRequestWithAccount = NextApiRequestWithSession & {
  user: User;
  account: AccountWithPlan;
};

export type NextApiRequestWithProject = NextApiRequestWithAccount & {
  project: Project;
};

export type NextApiRequestWithUser = NextApiRequestWithSession & {
  user: User;
};

export type NextApiHandlerWithUser<T = any> = (
  req: NextApiRequestWithUser,
  res: NextApiResponse<T>
) => void | Promise<void>;

export type NextApiHandlerWithJWTUser<T = any> = (
  req: NextApiRequestWithJWTUser,
  res: NextApiResponse<T>
) => void | Promise<void>;

export type NextApiHandlerWithAccount<T = any> = (
  req: NextApiRequestWithAccount,
  res: NextApiResponse<T>
) => void | Promise<void>;

export type NextApiHandlerWithProject<T = any> = (
  req: NextApiRequestWithProject,
  res: NextApiResponse<T>
) => void | Promise<void>;

export type UserWithAccounts = User & {
  accounts: {
    account: Account;
  }[];
};

export type SubscriptionWithPlan = Subscription & {
  subscriptionPlan: SubscriptionPlan;
};

export type AccountWithPlan = Account & {
  subscription: SubscriptionWithPlan | null;
};

export interface UserMe {
  user: UserWithAccounts;
  personalAccount: AccountWithPlan;
  accounts: AccountWithPlan[];
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

export interface GithubMergedPullRequest {
  sha: string;
  merged: boolean;
  message: string;
}

export interface Repository {
  owner: {
    login: string;
  };
  name: string;
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

export interface GHTree {
  path: string;
  mode: "100644";
  type: "blob";
  content: string;
}

export interface FigmaUser {
  id: string;
  email: string;
  handle: string;
  img_url: string;
}

export interface AssetMetaInfo {
  repoOwner: string;
  repoName: string;
  repoSha: string;
  assetPath: string;
  url: string;
}

export interface Auth0UserIdentity {
  provider: string;
  access_token: string;
  refresh_token: string;
  user_id: string;
  connection: string;
  isSocial: boolean;
}

export interface Auth0User {
  created_at: string;
  email: string;
  handle: string;
  identities: Auth0UserIdentity[];
  img_url: string;
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;
  user_id: string;
  last_ip: string;
  last_login: string;
  logins_count: number;
}

export interface Auth0DeviceCode {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
  verification_uri_complete: string;
}

export interface Auth0DeviceToken {
  access_token: string;
  refresh_token: string;
  id_token: string;
  scope: string;
  expires_in: number;
  token_type: string;
}
