import { AccountType, Role, SubscriptionPlanType } from "@assetier/prisma";
import { NotAllowedError } from "@utils/httpErrors";
import { prisma } from "@utils/prisma";
import { withUser } from "@utils/withUser";

export default withUser(async ({ method, user, body }, res) => {
  switch (method) {
    case "POST": {
      let plan = await prisma.subscriptionPlan.findUnique({
        where: {
          planType_active: {
            planType: SubscriptionPlanType.TEAM_TRIAL,
            active: true,
          },
        },
      });

      if (!plan) {
        plan = await prisma.subscriptionPlan.create({
          data: {
            planType: SubscriptionPlanType.TEAM_TRIAL,
            // paddleSubscriptionPlanId: -1,
          },
        });
      }

      const subscription = await prisma.subscription.create({
        data: {
          subscriptionPlanId: plan.id,
          // paddleSubscriptionId: -1,
        },
      });

      const { id: newAccountId } = await prisma.account.create({
        data: {
          name: body.name,
          type: AccountType.TEAM,
          subscriptionId: subscription.id,
        },
      });

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          accounts: {
            create: {
              isPersonal: false,
              role: Role.ADMIN,
              accountId: newAccountId,
            },
          },
        },
      });

      const account = await prisma.account.findUnique({
        where: {
          id: newAccountId,
        },
        include: {
          subscription: {
            include: {
              subscriptionPlan: true,
            },
          },
        },
      });

      return res.status(200).json(account);
    }

    default: {
      throw new NotAllowedError();
    }
  }
});
