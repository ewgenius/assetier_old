import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { getSession } from "next-auth/react";
import type { Session } from "next-auth/core/types";

export type ErrorResponse = {
  error: string;
};

export type SessionWithId = Session & {
  userId: string;
};

export type NextApiHandlerWithSession<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
  session: SessionWithId | null
) => void | Promise<void>;

export const withSession =
  <T = any>(handler: NextApiHandlerWithSession<T>) =>
  async (req: NextApiRequest, res: NextApiResponse<T | ErrorResponse>) => {
    const session = (await getSession({ req })) as SessionWithId;

    if (!session) {
      res.status(401).send({
        error:
          "You must be signed in to view the protected content on this page.",
      });
    }

    return handler(req, res, session);
  };
