import type { Project } from "@prisma/client";
import { prisma } from "@utils/prisma";
import { withOrganization } from "@utils/withOrganization";
import { ErrorResponse } from "@utils/types";

export default withOrganization<Project | null | ErrorResponse>(
  async (req, res, { organization }) => {
    switch (req.method) {
      case "GET": {
        const project = await prisma.project.findUnique({
          where: {
            id: req.query.projectId as string,
          },
        });

        if (project) {
          if (project.organizationId === organization.id) {
            return res.status(200).send(project);
          }

          return res.status(403).send({
            error: "Unauthorised",
          });
        }

        return res.status(404).send({
          error: "Project not found",
        });
      }

      default: {
        return res.status(409).send({
          error: "Not Allowed",
        });
      }
    }
  }
);
