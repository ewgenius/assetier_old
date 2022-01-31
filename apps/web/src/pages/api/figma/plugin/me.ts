import { NotAllowedError, NotFoundError } from "@utils/httpErrors";
import { prisma } from "@utils/prisma";
import type { UserWithOrganizations } from "@assetier/types";
import { withJWTUser } from "@utils/withJWTUser";

export default withJWTUser(async (req, res) => {
  const { method } = req;

  switch (method) {
    case "GET": {
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
});
