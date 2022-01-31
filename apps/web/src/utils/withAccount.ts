import type {
  NextApiRequestWithSession,
  Middleware,
  NextApiRequestWithAccount,
  NextApiHandlerWithAccount,
} from "@assetier/types";
import { prisma } from "@utils/prisma";
import { withSession } from "@utils/withSession";
import { ForbiddenError, NotFoundError } from "./httpErrors";

export const withAccount = <T = any>(
  handler: NextApiHandlerWithAccount<T>,
  middleware?: Middleware
) =>
  withSession(async (req: NextApiRequestWithSession, res) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.session.userId,
      },
      include: {
        accounts: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    if (!user.verified) {
      throw new ForbiddenError();
    }

    const account = await prisma.account.findUnique({
      where: {
        id: req.query.accountId as string,
      },
      include: {
        subscription: {
          include: {
            subscriptionPlan: true,
          },
        },
      },
    });

    if (!account) {
      throw new NotFoundError("Account not found.");
    }

    if (!user.accounts.some((acc) => acc.accountId === account.id)) {
      throw new ForbiddenError();
    }

    (req as NextApiRequestWithAccount).user = user;
    (req as NextApiRequestWithAccount).account = account;

    return handler(req as NextApiRequestWithAccount, res);
  }, middleware);
