import { NotAllowedError, NotFoundError } from "@utils/httpErrors";
import { withSession } from "@utils/withSession";
import { prisma } from "@utils/prisma";
import type { UserMe, UserWithAccounts } from "@assetier/types";
import { AccountType, Role, SubscriptionPlanType } from "@assetier/prisma";
import { getAuth0ManagementToken } from "@utils/getAuth0ManagementToken";
import { getAuth0User } from "@utils/getAuth0User";

async function createPersonalAccount(userId: string) {
  let hobbyPlan = await prisma.subscriptionPlan.findUnique({
    where: {
      planType_active: {
        planType: SubscriptionPlanType.HOBBY,
        active: true,
      },
    },
  });

  if (!hobbyPlan) {
    hobbyPlan = await prisma.subscriptionPlan.create({
      data: {
        planType: SubscriptionPlanType.HOBBY,
        // TODO: pass real sub id
        paddleSubscriptionPlanId: 0,
      },
    });
  }

  // const subscription = await prisma.account.create({

  // })

  const account = await prisma.account.create({
    data: {
      type: AccountType.PERSONAL,
      // subscriptionId: hobbyPlan.id,
    },
  });

  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      accounts: {
        create: {
          isPersonal: true,
          role: Role.ADMIN,
          accountId: account.id,
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
          accounts: {
            include: {
              account: {
                include: {
                  subscription: {
                    include: {
                      subscriptionPlan: true,
                    },
                  },
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

          // preparing default personal account
          await createPersonalAccount(newUser.id);

          user = await prisma.user.findUnique({
            where: {
              id: session.userId,
            },
            include: {
              accounts: {
                include: {
                  account: {
                    include: {
                      subscription: {
                        include: {
                          subscriptionPlan: true,
                        },
                      },
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

      const personalAccount = user.accounts.find((acc) => acc.isPersonal);

      if (!personalAccount) {
        throw new NotFoundError();
      }

      return res.status(200).send({
        user: userPublic as UserWithAccounts,
        personalAccount: personalAccount.account,
        accounts: user.accounts.map((acc) => acc.account),
      });
    }

    default: {
      throw new NotAllowedError();
    }
  }
});
