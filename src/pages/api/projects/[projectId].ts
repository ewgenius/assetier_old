import type { Project } from "@prisma/client";
import { prisma } from "@utils/prisma";
import { withSession, ErrorResponse } from "@utils/withSession";

export default withSession<Project | null | ErrorResponse>(
  async (req, res, session) => {
    switch (req.method) {
      case "GET": {
        const project = await prisma.project.findUnique({
          where: {
            id: req.query.projectId as string,
          },
        });

        if (project && project.userId !== session?.userId) {
          return res.status(403).send({
            error: "Unauthorised",
          });
        }

        return res.status(200).send(project);
      }

      default: {
        return res.status(409).send({
          error: "Not Allowed",
        });
      }
    }
  }
);
