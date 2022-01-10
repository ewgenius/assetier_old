import { prisma } from "@utils/prisma";
import { withSession } from "@utils/withSession";
import type {
  NextApiRequestWithSession,
  NextApiHandlerWithUser,
  NextApiRequestWithUser,
  Middleware,
} from "@assetier/types";
import { ForbiddenError, NotFoundError } from "./httpErrors";

export const withUser = <T = any>(
  handler: NextApiHandlerWithUser<T>,
  middleware?: Middleware
) =>
  withSession(async (req: NextApiRequestWithSession, res) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.session.userId,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    if (!user.verified) {
      throw new ForbiddenError();
    }

    (req as NextApiRequestWithUser).user = user;

    return handler(req as NextApiRequestWithUser, res);
  }, middleware);
