import type { NextApiHandler } from "next";
import { NotAllowedError } from "@utils/httpErrors";
import { prisma } from "@utils/prisma";

export const handler: NextApiHandler = async ({ method }, res) => {
  switch (method) {
    case "GET": {
      const readWritePair = await prisma.figmaReadWritePair.create({
        data: {},
      });
      res.status(200).json(readWritePair);
    }

    default: {
      throw new NotAllowedError();
    }
  }
};

export default handler;
