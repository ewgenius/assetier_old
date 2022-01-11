import type { NextApiHandler } from "next";
import {
  BadRequestError,
  NotAllowedError,
  NotFoundError,
} from "@utils/httpErrors";
import { prisma } from "@utils/prisma";
import { runCors } from "@utils/corsMiddleware";

export const handler: NextApiHandler = async (req, res) => {
  await runCors(req, res);

  const { method, query } = req;

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

      if (readWritePair.token) {
        await prisma.figmaReadWritePair.delete({
          where: {
            readKey: query.readKey as string,
          },
        });
      }

      return res.status(200).json(readWritePair);
    }

    default: {
      throw new NotAllowedError();
    }
  }
};

export default handler;
