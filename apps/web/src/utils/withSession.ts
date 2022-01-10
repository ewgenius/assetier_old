import type { NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import type {
  SessionWithId,
  NextApiRequestWithSession,
  Middleware,
} from "lib-types";
import { UnauthorizedError } from "./httpErrors";
import { withHttpError } from "./withHttpError";
import { getToken } from "next-auth/jwt";

export type NextApiHandlerWithSession<T = any> = (
  req: NextApiRequestWithSession,
  res: NextApiResponse<T>
) => void | Promise<void>;

export const withSession = <T = any>(
  handler: NextApiHandlerWithSession<T>,
  middleware?: Middleware
) =>
  withHttpError(
    async (req: NextApiRequestWithSession, res: NextApiResponse) => {
      if (middleware) {
        await middleware(req, res);
      }

      let session = (await getSession({ req })) as SessionWithId;
      if (!session) {
        session = (await getToken({
          req,
          secret: process.env.NEXTAUTH_SECRET as string,
        })) as SessionWithId;
      }

      if (!session) {
        throw new UnauthorizedError();
      }

      req.session = session;

      return handler(req, res);
    }
  );
