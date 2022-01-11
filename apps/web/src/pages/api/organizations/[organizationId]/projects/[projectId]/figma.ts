import { withProject } from "@utils/withProject";
import { NotAllowedError, NotFoundError } from "@utils/httpErrors";
import { prisma } from "@utils/prisma";
import { parseFigmaUrl } from "@utils/parseFigmaUrl";
import { fetcher } from "@utils/fetcher";

export interface FigmaFile {
  document: {
    id: string;
    name: string;
    type: "DOCUMENT";
    children: any[];
  };
}

export default withProject<any[]>(async ({ method, project }, res) => {
  switch (method) {
    case "GET": {
      if (!project.figmaOauthConnectionId || !project.figmaFileUrl) {
        throw new NotFoundError("no connection details");
      }
      const figmaFileDetails = parseFigmaUrl(project.figmaFileUrl);
      if (!figmaFileDetails) {
        throw new NotFoundError("no figma file details");
      }

      const connection = await prisma.figmaOauthConnection.findUnique({
        where: {
          id: project.figmaOauthConnectionId,
        },
      });

      if (!connection) {
        throw new NotFoundError("no figma connection");
      }

      const figmaFile = await fetcher<FigmaFile>(
        `https://api.figma.com/v1/files/${figmaFileDetails.key}`,
        {
          headers: {
            Authorization: `Bearer ${connection?.accessToken}`,
          },
        }
      );

      console.log(JSON.stringify(figmaFile.document.children, null, 2));

      return res.status(200).send([]);
    }

    default: {
      throw new NotAllowedError();
    }
  }
});
