import { NotAllowedError, NotFoundError } from "@utils/httpErrors";
import { withSession } from "@utils/withSession";
import { prisma } from "@utils/prisma";
import type { UserMe, UserWithOrganizations } from "@assetier/types";
import { OrganizationPlanType, OrganizationType, Role } from "@assetier/prisma";

async function createPersonalOrganization(userId: string) {
  let hobbyPlan = await prisma.organizationPlan.findUnique({
    where: {
      planType_active: {
        planType: OrganizationPlanType.HOBBY,
        active: true,
      },
    },
  });

  if (!hobbyPlan) {
    hobbyPlan = await prisma.organizationPlan.create({
      data: {
        name: "Hobby",
        planType: OrganizationPlanType.HOBBY,
      },
    });
  }

  const organization = await prisma.organization.create({
    data: {
      type: OrganizationType.PERSONAL,
      organizationPlanId: hobbyPlan.name,
    },
  });

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      organizations: {
        create: {
          isPersonal: true,
          role: Role.ADMIN,
          organizationId: organization.id,
        },
      },
    },
  });
}

export default withSession<UserMe>(async ({ method, session }, res) => {
  switch (method) {
    case "GET": {
      let user = await prisma.user.findUnique({
        where: {
          id: session.userId,
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
        if (session.userId) {
          const newUser = await prisma.user.create({
            data: {
              id: session.userId,
              email: session.user.email,
              name: session.user.nickname,
              image: session.user.picture,
            },
          });

          await createPersonalOrganization(newUser.id);

          user = await prisma.user.findUnique({
            where: {
              id: session.userId,
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
        }

        if (!user) {
          throw new NotFoundError();
        }
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
