import type {
  NextApiRequestWithSession,
  Middleware,
  NextApiRequestWithAccount,
  NextApiHandlerWithAccount,
} from "@assetier/types";
import { withSession } from "@utils/withSession";
import { getUserAccount } from "@utils/getUserAccount";

export const withAccount = <T = any>(
  handler: NextApiHandlerWithAccount<T>,
  middleware?: Middleware
) =>
  withSession(async (req: NextApiRequestWithSession, res) => {
    const { user, account } = await getUserAccount(
      req.session.userId as string,
      req.query.accountId as string
    );

    (req as NextApiRequestWithAccount).user = user;
    (req as NextApiRequestWithAccount).account = account;

    return handler(req as NextApiRequestWithAccount, res);
  }, middleware);
