import type { NextApiResponse, NextApiHandler } from "next";
import type {
  NextApiRequestWithSession,
  Middleware,
  AuthSession,
} from "@assetier/types";
import { UnauthorizedError } from "./httpErrors";
import { withHttpError } from "./withHttpError";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";

export type NextApiHandlerWithSession<T = any> = (
  req: NextApiRequestWithSession,
  res: NextApiResponse<T>
) => void | Promise<void>;

export const withSession = <T = any>(
  handler: NextApiHandlerWithSession<T>,
  middleware?: Middleware
) =>
  withHttpError(
    withApiAuthRequired((async (
      req: NextApiRequestWithSession,
      res: NextApiResponse
    ) => {
      const session = getSession(req, res);

      if (!session) {
        throw new UnauthorizedError();
      }

      req.session = {
        ...session,
        userId: session.user.sub,
      } as AuthSession;

      return handler(req, res);
    }) as NextApiHandler),
    middleware
  );
