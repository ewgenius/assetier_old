import { NotAllowedError, NotFoundError } from "@utils/httpErrors";
import { withSession } from "@utils/withSession";
import { prisma } from "@utils/prisma";
import type { Auth0User, UserMe, UserWithOrganizations } from "@assetier/types";
import { OrganizationPlanType, OrganizationType, Role } from "@assetier/prisma";
import { fetcher } from "@utils/fetcher";

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

export async function getAuth0ManagementToken() {
  const data = new URLSearchParams();
  data.set("grant_type", "client_credentials");
  data.set("client_id", process.env.AUTH0_M2M_CLIENT_ID as string);
  data.set("client_secret", process.env.AUTH0_M2M_CLIENT_SECRET as string);
  data.set("audience", `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`);
  const managementToken = await fetcher(
    `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: data,
    }
  );

  return managementToken;
}

export async function getAuth0User(userId: string, managementToken: string) {
  const user = fetcher<Auth0User>(
    `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${managementToken}`,
      },
    }
  );

  return user;
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
          figmaAuthCredentials: true,
        },
      });

      // first time login, creating user
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

          // preparing default personal organization
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
              figmaAuthCredentials: true,
            },
          });
        }

        if (!user) {
          throw new NotFoundError();
        }
      }

      const { figmaAuthCredentials, ...userPublic } = user;

      // persisting figma access token for user
      if (!figmaAuthCredentials) {
        const managementToken = await getAuth0ManagementToken();
        const auth0User = await getAuth0User(
          session.userId,
          managementToken.access_token
        );

        const figmaIdentity = auth0User.identities.find(
          (identity) => identity.connection === "figma"
        );

        if (figmaIdentity) {
          await prisma.figmaAuthCredentials.create({
            data: {
              userId: user.id,
              accessToken: figmaIdentity.access_token,
              refreshToken: figmaIdentity.refresh_token,
            },
          });
        }
      }

      const personalOrganization = user.organizations.find(
        (org) => org.isPersonal
      );

      if (!personalOrganization) {
        throw new NotFoundError();
      }

      return res.status(200).send({
        user: userPublic as UserWithOrganizations,
        personalOrganization: personalOrganization.organization,
        organizations: user.organizations.map((org) => org.organization),
      });
    }

    default: {
      throw new NotAllowedError();
    }
  }
});
