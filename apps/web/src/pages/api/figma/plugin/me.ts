import { NotAllowedError, NotFoundError } from "@utils/httpErrors";
import { prisma } from "@utils/prisma";
import type { UserWithAccounts } from "@assetier/types";
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
        },
      });

      if (!user) {
        throw new NotFoundError();
      }

      const personalAccount = user.accounts.find((acc) => acc.isPersonal);

      if (!personalAccount) {
        throw new NotFoundError();
      }

      return res.status(200).send({
        user: user as UserWithAccounts,
        personalAccount: personalAccount.account,
        accounts: user.accounts.map((acc) => acc.account),
      });
    }

    default: {
      throw new NotAllowedError();
    }
  }
});
