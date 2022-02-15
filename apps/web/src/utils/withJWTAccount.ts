import { NextApiResponse } from "next";
import type {
  NextApiRequestWithAccount,
  NextApiHandlerWithAccount,
} from "@assetier/types";
import { getUserAccount } from "@utils/getUserAccount";
import { runCors } from "@utils/corsMiddleware";
import { withMiddleware } from "@utils/withMiddleware";
import { auth0JwtMiddleware } from "@utils/auth0JwtMiddleware";
import { ForbiddenError } from "./httpErrors";

export const withJWTAccount = <T = any>(
  handler: NextApiHandlerWithAccount<T>
) =>
  withMiddleware<NextApiRequestWithAccount, NextApiResponse<T>>(
    async (req, res) => {
      if (!req.user) {
        throw new ForbiddenError();
      }

      const { user, account } = await getUserAccount(
        (req.user as any).sub as string,
        req.query.accountId as string
      );

      (req as NextApiRequestWithAccount).user = user;
      (req as NextApiRequestWithAccount).account = account;

      return handler(req as NextApiRequestWithAccount, res);
    },
    [runCors, auth0JwtMiddleware]
  );
