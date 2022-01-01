import type {
  NextApiRequestWithOrganization,
  NextApiRequestWithSession,
  NextApiHandlerWithOrganization,
} from "./types";
import { prisma } from "@utils/prisma";
import { withSession } from "@utils/withSession";
import { ForbiddenError, NotFoundError } from "./httpErrors";

export const withOrganization = <T = any>(
  handler: NextApiHandlerWithOrganization<T>
) =>
  withSession(async (req: NextApiRequestWithSession, res) => {
    const user = await prisma.user.findUnique({
      where: {
        id: req.session.userId,
      },
      include: {
        organizations: true,
      },
    });

    if (!user) {
      throw new NotFoundError("User not found.");
    }

    if (!user.verified) {
      throw new ForbiddenError();
    }

    const organization = await prisma.organization.findUnique({
      where: {
        id: req.query.organizationId as string,
      },
      include: {
        organizationPlan: true,
      },
    });

    if (!organization) {
      throw new NotFoundError("Organization not found.");
    }

    if (
      !user.organizations.some((org) => org.organizationId === organization.id)
    ) {
      throw new ForbiddenError();
    }

    (req as NextApiRequestWithOrganization).user = user;
    (req as NextApiRequestWithOrganization).organization = organization;

    return handler(req as NextApiRequestWithOrganization, res);
  });
