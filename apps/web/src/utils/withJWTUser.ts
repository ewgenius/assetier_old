import type { NextApiResponse } from "next";
import { ForbiddenError } from "@utils/httpErrors";
import type {
  NextApiHandlerWithJWTUser,
  NextApiRequestWithJWTUser,
} from "@assetier/types";
import { runCors } from "@utils/corsMiddleware";
import { withMiddleware } from "@utils/withMiddleware";
import { auth0JwtMiddleware } from "@utils/auth0JwtMiddleware";

export const withJWTUser = <T = any>(handler: NextApiHandlerWithJWTUser<T>) =>
  withMiddleware<NextApiRequestWithJWTUser, NextApiResponse<T>>(
    async (req, res) => {
      if (!req.user) {
        throw new ForbiddenError();
      }
      return handler(req, res);
    },
    [runCors, auth0JwtMiddleware]
  );
