import { NotAllowedError } from "@utils/httpErrors";
import { withSession } from "@utils/withSession";
import { prisma } from "@utils/prisma";
import type {
  OrganizationWithPlan,
  UserResponse,
  UserWithOrganizations,
} from "@utils/types";

export default withSession<UserResponse>(async ({ method, session }, res) => {
  switch (method) {
    case "GET": {
      const user = await prisma.user.findUnique({
        where: {
          id: session.userId,
        },
        include: {
          organizations: {
            where: {
              isPersonal: true,
            },
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

      return res.status(200).send({
        user: user as UserWithOrganizations,
        personalOrganization: user?.organizations[0]
          .organization as OrganizationWithPlan,
      });
    }

    default: {
      throw new NotAllowedError();
    }
  }
});
