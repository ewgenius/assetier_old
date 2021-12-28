import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import type { SessionWithId } from "@utils/types";
import { UnauthorizedError } from "./httpErrors";
import { withHttpError } from "./withHttpError";

export type NextApiRequestWithSession = NextApiRequest & {
  session: SessionWithId;
};

export type NextApiHandlerWithSession<T = any> = (
  req: NextApiRequestWithSession,
  res: NextApiResponse<T>
) => void | Promise<void>;

export const withSession = <T = any>(handler: NextApiHandlerWithSession<T>) =>
  withHttpError(
    async (req: NextApiRequestWithSession, res: NextApiResponse) => {
      const session = (await getSession({ req })) as SessionWithId;

      if (!session) {
        throw new UnauthorizedError();
      }

      req.session = session;

      return handler(req, res);
    }
  );
