import { User, Organization } from "@prisma/client";
import { prisma } from "@utils/prisma";
import { withSession, ErrorResponse } from "@utils/withSession";

export type UserResponse =
  | (User & {
      UserToOrganization: {
        organization: Organization;
      }[];
    })
  | null;

export default withSession<UserResponse | ErrorResponse>(
  async (req, res, session) => {
    switch (req.method) {
      case "GET": {
        const user = await prisma.user.findUnique({
          where: {
            id: session.userId,
          },
          include: {
            UserToOrganization: {
              include: {
                organization: true,
              },
            },
          },
        });
        return res.status(200).send(user);
      }

      default: {
        return res.status(409).send({
          error: "Not Allowed",
        });
      }
    }
  }
);
