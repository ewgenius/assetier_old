import { Organization } from "@prisma/client";
import { NotAllowedError } from "@utils/httpErrors";
import { prisma } from "@utils/prisma";
import type {
  ErrorResponse,
  UserResponse,
  UserWithOrganizations,
} from "@utils/types";
import { withSession } from "@utils/withSession";

export default withSession<UserResponse | ErrorResponse>(
  async ({ method, session }, res) => {
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
                organization: true,
              },
            },
          },
        });

        return res.status(200).send({
          user: user as UserWithOrganizations,
          personalOrganization: user?.organizations[0]
            .organization as Organization,
        });
      }

      default: {
        throw new NotAllowedError();
      }
    }
  }
);
