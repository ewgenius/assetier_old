import type { NextPage, GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { App } from "@octokit/app";
import { AuthBlock } from "@components/AuthBlock";
import { getGitHubPrivateKey } from "@utils/getGitHubPrivateKey";

export interface SetupProps {
  repositories: {
    id: number;
    owner: {
      login: string;
    };
    name: string;
  }[];
}

export const Setup: NextPage<SetupProps> = ({ repositories }) => {
  const { query } = useRouter();

  return (
    <div className="container mx-auto p-2">
      <AuthBlock />

      <div className="mt-8">
        <p>Select repository:</p>
        {repositories.map((repo) => (
          <Link
            href={`/setup/repository?installation_id=${query.installation_id}&owner=${repo.owner.login}&repository=${repo.name}`}
            key={repo.id}
          >
            <a className="underline hover:no-underline">
              {repo.owner.login}/{repo.name}
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<SetupProps> = async (
  context
) => {
  const privateKey = await getGitHubPrivateKey();

  const app = new App({
    appId: Number(process.env.GITHUB_APP_ID),
    privateKey,
    clientId: process.env.GITHUB_APP_CLIENT_ID,
    clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
  });

  const repositories = [];

  for await (const { octokit, repository } of app.eachRepository.iterator()) {
    repositories.push(repository);
  }

  return {
    props: {
      repositories,
    },
  };
};

export default Setup;
