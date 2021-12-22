import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { prisma } from "@utils/prisma";
import { OrganizationType, Role, User } from "@prisma/client";

async function createPersonalOrganization(userId: string) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      UserToOrganization: {
        create: {
          isPersonal: true,
          role: Role.ADMIN,

          organization: {
            create: {
              type: OrganizationType.PERSONAL,
            },
          },
        },
      },
    },
  });
}

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user: { id } }) {
      return {
        ...session,
        userId: id,
      };
    },
  },

  events: {
    signIn: async ({ user: { id } }) => {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          UserToOrganization: {
            where: {
              isPersonal: true,
            },
          },
        },
      });

      if (!user?.UserToOrganization || !user?.UserToOrganization?.length) {
        await createPersonalOrganization(id);
      }
    },

    createUser: async ({ user }) => {
      console.log("register", user);

      // create personal org
      await createPersonalOrganization(user.id);
    },
  },

  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
});
