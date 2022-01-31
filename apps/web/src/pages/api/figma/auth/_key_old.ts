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
      if (!query.key) {
        throw new BadRequestError();
      }

      const readWritePair = await prisma.figmaReadWritePair.findUnique({
        where: {
          readKey: query.key as string,
        },
      });

      if (!readWritePair) {
        throw new NotFoundError();
      }

      if (readWritePair.token) {
        await prisma.figmaReadWritePair.delete({
          where: {
            readKey: query.key as string,
          },
        });
      }

      return res.status(200).json(readWritePair);
    }

    case "PUT": {
      const {
        query,
        body: { organizationId, projectId, figmaFileUrl },
      } = req;

      if (!query.key || !organizationId || !projectId || !figmaFileUrl) {
        throw new BadRequestError();
      }

      const readWritePair = await prisma.figmaReadWritePair.findUnique({
        where: {
          writeKey: query.key as string,
        },
      });

      if (!readWritePair) {
        throw new NotFoundError();
      }

      const project = await prisma.project.findUnique({
        where: {
          id: projectId,
        },
      });

      if (!project) {
        throw new NotFoundError();
      }

      if (!project.figmaFileUrl) {
        await prisma.project.update({
          where: {
            id: projectId,
          },
          data: {
            figmaFileUrl,
          },
        });
      }

      const updatedPair = await prisma.figmaReadWritePair.update({
        where: {
          writeKey: query.key as string,
        },
        data: {
          organizationId,
          projectId,
        },
      });

      return res.status(200).json(updatedPair);
    }

    default: {
      throw new NotAllowedError();
    }
  }
};

export default handler;
