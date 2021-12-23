import { useEffect } from "react";
import type { NextPage, GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { getSession } from "next-auth/react";

import type { SessionWithId } from "@utils/types";
import { prisma } from "@utils/prisma";
import { Spinner } from "@components/Spinner";

export const Setup: NextPage = () => {
  useEffect(() => {
    window.close();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <Spinner />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = (await getSession(context)) as SessionWithId;
  // const privateKey = await getGitHubPrivateKey();

  // const app = new App({
  //   appId: Number(process.env.GITHUB_APP_ID),
  //   privateKey,
  //   clientId: process.env.GITHUB_APP_CLIENT_ID,
  //   clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
  // });

  // const repositories = [];

  // for await (const { octokit, repository } of app.eachRepository.iterator()) {
  //   repositories.push(repository);
  // }

  // TODO: validate

  const userId = session.userId;
  const installationId = Number(context.query.installation_id as string);
  const organizationId = context.query.state as string;

  if (userId && installationId && organizationId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        organizations: true,
      },
    });

    if (
      !user?.organizations.some((org) => org.organizationId === organizationId)
    ) {
      // TODO
    }

    await prisma.githubInstallation.create({
      data: {
        installationId,
        organizationId,
      },
    });
  }

  return {
    props: {},
  };
};

export default Setup;
