import { User, Organization } from "@prisma/client";
import { prisma } from "@utils/prisma";
import type {
  ErrorResponse,
  UserResponse,
  UserWithOrganizations,
} from "@utils/types";
import { withSession } from "@utils/withSession";

export default withSession<UserResponse | ErrorResponse>(
  async (req, res, session) => {
    switch (req.method) {
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
        return res.status(409).send({
          error: "Not Allowed",
        });
      }
    }
  }
);