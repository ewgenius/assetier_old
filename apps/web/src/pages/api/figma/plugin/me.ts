import type { NextApiResponse } from "next";
import {
  ForbiddenError,
  NotAllowedError,
  NotFoundError,
} from "@utils/httpErrors";
import { prisma } from "@utils/prisma";
import type {
  NextApiRequestWithJWTUser,
  UserWithOrganizations,
} from "@assetier/types";
import { runCors } from "@utils/corsMiddleware";
import { withMiddleware } from "@utils/withMiddleware";
import { auth0JwtMiddleware } from "@utils/auth0JwtMiddleware";

export default withMiddleware<NextApiRequestWithJWTUser, NextApiResponse>(
  async (req, res) => {
    const { method } = req;

    switch (method) {
      case "GET": {
        if (!req.user) {
          throw new ForbiddenError();
        }

        const user = await prisma.user.findUnique({
          where: {
            id: req.user.sub,
          },
          include: {
            organizations: {
              include: {
                organization: {
                  include: {
                    organizationPlan: true,
                  },
                },
              },
            },
          },
        });

        if (!user) {
          throw new NotFoundError();
        }

        const personalOrganization = user.organizations.find(
          (org) => org.isPersonal
        );

        if (!personalOrganization) {
          throw new NotFoundError();
        }

        return res.status(200).send({
          user: user as UserWithOrganizations,
          personalOrganization: personalOrganization.organization,
          organizations: user.organizations.map((org) => org.organization),
        });
      }

      default: {
        throw new NotAllowedError();
      }
    }
  },
  [runCors, auth0JwtMiddleware]
);
