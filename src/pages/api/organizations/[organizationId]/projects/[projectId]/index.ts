import type { Project } from "@prisma/client";
import { prisma } from "@utils/prisma";
import { ErrorResponse } from "@utils/types";
import { withProject } from "@utils/withProject";

export default withProject<Project | null | ErrorResponse>(
  async (req, res, { project }) => {
    switch (req.method) {
      case "GET": {
        return res.status(200).send(project);
      }

      case "PATCH": {
        const updatedProject = await prisma.project.update({
          where: {
            id: project.id,
          },
          data: req.body,
        });
        return res.status(200).send(updatedProject);
      }

      default: {
        return res.status(409).send({
          error: "Not Allowed",
        });
      }
    }
  }
);
