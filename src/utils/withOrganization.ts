import type { NextApiRequest, NextApiResponse } from "next";
import type { ErrorResponse, SessionWithId } from "@utils/types";
import type { Organization, User } from "@prisma/client";
import { prisma } from "@utils/prisma";
import { withSession } from "@utils/withSession";

export type NextApiHandlerWithOrganization<T = any> = (
  req: NextApiRequest,
  res: NextApiResponse<T>,
  context: {
    session: SessionWithId;
    user: User;
    organization: Organization;
  }
) => void | Promise<void>;

export const withOrganization = <T = any>(
  handler: NextApiHandlerWithOrganization<T>
) =>
  withSession(async (req, res, session) => {
    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
      include: {
        organizations: true,
      },
    });

    if (user) {
      const organization = await prisma.organization.findUnique({
        where: {
          id: req.query.organizationId as string,
        },
      });

      if (organization) {
        if (
          user.organizations.some(
            (org) => org.organizationId === organization.id
          )
        ) {
          return handler(req, res, { session, user, organization });
        }

        return res.status(403).send({
          error: "Unauthorized access.",
        });
      }

      return res.status(404).send({
        error: "Organization not found.",
      });
    }

    return res.status(404).send({
      error: "User not found.",
    });
  });
