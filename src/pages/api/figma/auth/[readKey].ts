import type { NextApiHandler } from "next";
import {
  BadRequestError,
  NotAllowedError,
  NotFoundError,
} from "@utils/httpErrors";
import { prisma } from "@utils/prisma";

export const handler: NextApiHandler = async ({ method, query }, res) => {
  switch (method) {
    case "GET": {
      if (!query.readKey) {
        throw new BadRequestError();
      }

      const readWritePair = await prisma.figmaReadWritePair.findUnique({
        where: {
          readKey: query.readKey as string,
        },
      });

      if (!readWritePair) {
        throw new NotFoundError();
      }

      // TODO: delete if it has access token

      res.status(200).json(readWritePair);
    }

    default: {
      throw new NotAllowedError();
    }
  }
};

export default handler;
