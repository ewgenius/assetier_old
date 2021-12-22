import type { NextApiRequest, NextApiResponse } from "next";
import type { ErrorResponse, SessionWithId } from "@utils/types";
import { User } from "@prisma/client";
import { prisma } from "@utils/prisma";
import { withSession } from "@utils/withSession";

export type NextApiHandlerWithUser<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
  context: { session: SessionWithId; user: User }
) => void | Promise<void>;

export const withUser = <T = any>(handler: NextApiHandlerWithUser<T>) =>
  withSession(async (req, res, session) => {
    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
    });

    if (user) {
      return handler(req, res, { session, user });
    }

    res.status(404).send({
      error: "User not found.",
    });
  });
