import { withProject } from "@utils/withProject";
import { NotAllowedError, NotFoundError } from "@utils/httpErrors";
import { prisma } from "@utils/prisma";
import { parseFigmaUrl } from "@utils/parseFigmaUrl";
import { fetcher } from "@utils/fetcher";
import { figma } from "@utils/figma";

export interface FigmaFile {
  document: {
    id: string;
    name: string;
    type: "DOCUMENT";
    children: any[];
  };
}

export default withProject<FigmaFile>(
  async ({ method, project, user }, res) => {
    switch (method) {
      case "GET": {
        if (!project.figmaFileUrl) {
          throw new NotFoundError("no connection details");
        }
        const figmaFileDetails = parseFigmaUrl(project.figmaFileUrl);
        if (!figmaFileDetails) {
          throw new NotFoundError("no figma file details");
        }

        const credentials = await prisma.figmaAuthCredentials.findUnique({
          where: {
            userId: user.id,
          },
        });

        if (!credentials) {
          throw new NotFoundError("no figma connection");
        }

        const figmaFile = await figma.fetch<FigmaFile>(
          `/v1/files/${figmaFileDetails.key}`,
          credentials
        );

        return res.status(200).json(figmaFile);
      }

      default: {
        throw new NotAllowedError();
      }
    }
  }
);
