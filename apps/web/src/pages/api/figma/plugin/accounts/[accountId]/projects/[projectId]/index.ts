import { NotAllowedError, NotFoundError } from "@utils/httpErrors";
import { parseFigmaUrl } from "@utils/parseFigmaUrl";
import { withJWTProject } from "@utils/withJWTProject";

export const handler = withJWTProject(async (req, res) => {
  const { method, project, account } = req;

  switch (method) {
    case "GET": {
      if (!project.figmaFileUrl) {
        throw new NotFoundError("no connection details");
      }
      const figmaFileDetails = parseFigmaUrl(project.figmaFileUrl);
      if (!figmaFileDetails) {
        throw new NotFoundError("no figma file details");
      }

      return res.status(200).json({
        account,
        project,
      });
    }

    default: {
      throw new NotAllowedError();
    }
  }
});

export default handler;
