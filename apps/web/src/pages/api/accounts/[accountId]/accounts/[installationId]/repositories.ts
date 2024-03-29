import { withAccount } from "@utils/withAccount";
import { getGithubApp } from "@utils/getGithubApp";
import { NotAllowedError } from "@utils/httpErrors";

export default withAccount(async ({ method, query }, res) => {
  switch (method) {
    case "GET": {
      const installationId = Number(query.installationId);

      const app = await getGithubApp();
      const repositories = [];

      for await (const { repository } of app.eachRepository.iterator({
        installationId,
      })) {
        repositories.push(repository);
      }

      return res.status(200).send(repositories);
    }

    default: {
      throw new NotAllowedError();
    }
  }
});
