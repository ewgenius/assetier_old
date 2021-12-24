import { withOrganization } from "@utils/withOrganization";
import { getGithubApp } from "@utils/getGithubApp";

export default withOrganization(async (req, res, { organization }) => {
  switch (req.method) {
    case "GET": {
      const installationId = Number(req.query.accountId);

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
      return res.status(409).send({
        error: "Not Allowed",
      });
    }
  }
});
