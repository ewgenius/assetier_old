import { useEffect } from "react";
import type { NextPage, GetServerSideProps } from "next";
import { getSession } from "@auth0/nextjs-auth0";

import { prisma } from "@utils/prisma";
import { Spinner } from "@components/Spinner";
import { getOctokit } from "@utils/getOctokit";
import { GithubAccountType } from "@assetier/prisma";

export const GithubAppSetup: NextPage = () => {
  useEffect(() => {
    window.close();
  }, []);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <Spinner />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = getSession(context.req, context.res);

  // TODO: validate
  if (!session || !session.user) {
    return {
      props: {},
    };
  }

  const userId = session.user.sub;
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

    const octokit = await getOctokit(installationId);
    const installation = await octokit.request(
      "GET /app/installations/{installation_id}",
      {
        installation_id: installationId,
      }
    );

    console.log("INFO", installation.data.account);

    await prisma.githubInstallation.create({
      data: {
        installationId,
        organizationId,
        accountLogin: installation.data.account?.login || "",
        accountAvatarUrl: installation.data.account?.avatar_url || "",
        accountType:
          installation.data.account?.type === "User"
            ? GithubAccountType.USER
            : GithubAccountType.ORGANIZATION,
      },
    });
  }

  return {
    props: {},
  };
};

export default GithubAppSetup;
