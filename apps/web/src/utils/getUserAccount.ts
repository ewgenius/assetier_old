import { prisma } from "@utils/prisma";
import { ForbiddenError, NotFoundError } from "./httpErrors";

export async function getUserAccount(userId: string, accountId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      accounts: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  if (!user.verified) {
    throw new ForbiddenError();
  }

  const account = await prisma.account.findUnique({
    where: {
      id: accountId,
    },
    include: {
      subscription: {
        include: {
          subscriptionPlan: true,
        },
      },
    },
  });

  if (!account) {
    throw new NotFoundError("Account not found.");
  }

  if (!user.accounts.some((acc) => acc.accountId === account.id)) {
    throw new ForbiddenError();
  }

  return {
    user,
    account,
  };
}
