import {
  ForbiddenError,
  NotAllowedError,
  NotFoundError,
} from "@utils/httpErrors";
import { prisma } from "@utils/prisma";
import type {
  Middleware,
  NextApiRequestWithJWTUser,
  UserWithOrganizations,
} from "@assetier/types";
import { runCors } from "@utils/corsMiddleware";
import { withMiddleware } from "@utils/withMiddleware";

import jwt from "express-jwt";
import { expressJwtSecret } from "jwks-rsa";
import { NextApiRequest, NextApiResponse } from "next";

const jwtCheck: Middleware = (req: NextApiRequest, res: NextApiResponse) =>
  new Promise((resolve, reject) => {
    jwt({
      secret: expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://assetier-dev.us.auth0.com/.well-known/jwks.json",
      }),
      audience: "https://localhost:3000/api/figma",
      issuer: "https://assetier-dev.us.auth0.com/",
      algorithms: ["RS256"],
    })(req as any, res as any, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve({});
      }
    });
  });

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
  [runCors, jwtCheck]
);
