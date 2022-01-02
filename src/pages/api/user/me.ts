import { NotAllowedError, NotFoundError } from "@utils/httpErrors";
import { withSession } from "@utils/withSession";
import { prisma } from "@utils/prisma";
import type { UserMe, UserWithOrganizations } from "@utils/types";

export default withSession<UserMe>(async ({ method, session }, res) => {
  switch (method) {
    case "GET": {
      const user = await prisma.user.findUnique({
        where: {
          id: session.userId,
        },
        include: {
          organizations: {
            // where: {
            //   isPersonal: true,
            // },
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
