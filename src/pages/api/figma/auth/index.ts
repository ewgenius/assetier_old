import type { NextApiHandler } from "next";
import { NotAllowedError } from "@utils/httpErrors";
import { prisma } from "@utils/prisma";
import { runCors } from "@utils/corsMiddleware";

export const handler: NextApiHandler = async (req, res) => {
  await runCors(req, res);

  const { method } = req;

  switch (method) {
    case "GET": {
      const readWritePair = await prisma.figmaReadWritePair.create({
        data: {},
      });
      return res.status(200).json(readWritePair);
    }

    default: {
      throw new NotAllowedError();
    }
  }
};

export default handler;
