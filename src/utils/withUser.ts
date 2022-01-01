import type { NextApiResponse } from "next";
import type { User } from "@prisma/client";
import { prisma } from "@utils/prisma";
import { withSession } from "@utils/withSession";
import type { NextApiRequestWithSession } from "@utils/withSession";
import { NotFoundError } from "./httpErrors";

export type NextApiRequestWithUser = NextApiRequestWithSession & {
  user: User;
};

export type NextApiHandlerWithUser<T = any> = (
  req: NextApiRequestWithUser,
  res: NextApiResponse<T>
) => void | Promise<void>;

export const withUser = <T = any>(handler: NextApiHandlerWithUser<T>) =>
  withSession(async (req: NextApiRequestWithSession, res) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.session.userId,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    (req as NextApiRequestWithUser).user = user;

    return handler(req as NextApiRequestWithUser, res);
  });
